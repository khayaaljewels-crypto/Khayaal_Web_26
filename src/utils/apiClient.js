// VITE_API_URL is the backend origin in every environment. Public routes
// start at the root, while routes that belong to the backend's /api namespace
// keep that prefix (for example /api/admin/products).
const configuredApiBase =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:4000'
    : 'https://khayaal-backend.onrender.com');

const API_BASE = configuredApiBase
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

function requestUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Authentication/admin API requests must stay on the
  // Khayaal website origin so the auth cookie belongs to
  // www.khayaalofficial.in.
  if (normalizedPath.startsWith('/api/')) {
    return normalizedPath;
  }

  // Public catalogue APIs continue using the Render backend directly.
  return `${API_BASE}${normalizedPath}`;
}

let unauthorizedHandler = null;

export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

/*
 * Prevent duplicate identical GET requests.

 * Example:
 *
 * Component A -> GET /products?pageSize=12
 * Component B -> GET /products?pageSize=12
 *
 * Instead of sending two requests, both components share one request.
 */
const inFlightGetRequests = new Map();

function requestGet(path, options = {}) {
  const method = options.method || 'GET';

  // Don't share requests that have their own AbortController.
  // Admin requests are also kept isolated.
  if (
    method !== 'GET' ||
    options.signal ||
    /^\/api\/admin(?:\/|$)/.test(path)
  ) {
    return request(path, options);
  }

  const headers = Object.entries(options.headers || {}).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  const key = JSON.stringify([
    requestUrl(path),
    options.cache || 'default',
    options.credentials || 'include',
    Boolean(options.suppressUnauthorizedHandler),
    headers,
  ]);

  const existing = inFlightGetRequests.get(key);

  if (existing) {
    return existing;
  }

  const pending = request(path, options).finally(() => {
    if (inFlightGetRequests.get(key) === pending) {
      inFlightGetRequests.delete(key);
    }
  });

  inFlightGetRequests.set(key, pending);

  return pending;
}


/*
 * Admin Firebase authentication.
 */
let adminTokenProvider = null;

export function setAdminTokenProvider(fn) {
  adminTokenProvider = fn;
}

async function authHeaders() {
  const token = await adminTokenProvider?.();

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}


/*
 * Retry ONLY safe GET requests when the server/proxy returns
 * a temporary 429 or 503.
 */
const RETRYABLE_GET_STATUSES = new Set([429, 503]);

const MAX_GET_RETRIES = 2;

const MAX_RETRY_DELAY_MS = 5000;


function getRetryDelay(res, attempt) {
  const retryAfter = res.headers.get('retry-after');

  if (retryAfter) {
    const seconds = Number(retryAfter);

    if (Number.isFinite(seconds)) {
      return Math.min(
        Math.max(seconds * 1000, 250),
        MAX_RETRY_DELAY_MS
      );
    }

    const date = Date.parse(retryAfter);

    if (Number.isFinite(date)) {
      return Math.min(
        Math.max(date - Date.now(), 250),
        MAX_RETRY_DELAY_MS
      );
    }
  }

  // 1s -> 2s -> maximum 5s
  const base = Math.min(
    1000 * 2 ** attempt,
    MAX_RETRY_DELAY_MS
  );

  // Small jitter prevents multiple browser requests
  // retrying at exactly the same moment.
  return Math.round(base * (0.8 + Math.random() * 0.4));
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function request(path, options = {}, attempt = 0) {
  const {
    suppressUnauthorizedHandler = false,
    headers: optionHeaders,
    ...fetchOptions
  } = options;

  const method = String(
    fetchOptions.method || 'GET'
  ).toUpperCase();

  let res;

  try {
    res = await fetch(requestUrl(path), {
      credentials: 'include',

      headers: {
        ...(fetchOptions.body !== undefined &&
        fetchOptions.body !== null
          ? {
              'Content-Type': 'application/json',
            }
          : {}),

        ...(await authHeaders()),

        ...optionHeaders,
      },

      ...fetchOptions,
    });
  } catch {
    // Only retry GET network failures once.
    if (method !== 'GET' || attempt >= 1) {
      throw new Error(
        'Network error — please check your connection and try again.'
      );
    }

    await sleep(400);

    return request(path, options, attempt + 1);
  }


  /*
   * Retry temporary proxy/server throttling.
   *
   * IMPORTANT:
   * We do NOT retry POST/PUT/DELETE.
   */
  if (
    method === 'GET' &&
    RETRYABLE_GET_STATUSES.has(res.status) &&
    attempt < MAX_GET_RETRIES
  ) {
    const delay = getRetryDelay(res, attempt);

    await sleep(delay);

    return request(path, options, attempt + 1);
  }


  const isJson = res.headers
    .get('content-type')
    ?.includes('application/json');

  const body = isJson
    ? await res.json()
    : null;


  if (
    res.status === 401 &&
    !suppressUnauthorizedHandler
  ) {
    unauthorizedHandler?.();
  }


  if (!res.ok) {
    const error = new Error(
      body?.error ||
      body?.message ||
      `Request failed (${res.status})`
    );

    error.status = res.status;

    error.retryAfter =
      res.headers.get('retry-after') || null;

    throw error;
  }


  return body;
}


/*
 * Multipart upload.
 */
async function requestFormData(
  path,
  formData,
  method = 'POST'
) {
  const res = await fetch(requestUrl(path), {
    method,
    credentials: 'include',
    headers: await authHeaders(),
    body: formData,
  });

  const isJson = res.headers
    .get('content-type')
    ?.includes('application/json');

  const body = isJson
    ? await res.json()
    : null;

  if (!res.ok) {
    throw new Error(
      body?.error ||
      `Upload failed (${res.status})`
    );
  }

  return body;
}


/*
 * Upload with progress.
 */
async function uploadWithProgress(
  path,
  formData,
  {
    method = 'POST',
    onProgress,
  } = {}
) {
  const headers = await authHeaders();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      method,
      requestUrl(path)
    );

    xhr.withCredentials = true;

    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    xhr.upload.onprogress = (e) => {
      if (
        e.lengthComputable &&
        onProgress
      ) {
        onProgress(
          Math.round(
            (e.loaded / e.total) * 100
          )
        );
      }
    };

    xhr.onload = () => {
      let body = null;

      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // Non JSON response.
      }

      if (
        xhr.status >= 200 &&
        xhr.status < 300
      ) {
        resolve(body);
      } else {
        reject(
          new Error(
            body?.error ||
            `Upload failed (${xhr.status})`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          'Upload failed — check your connection.'
        )
      );
    };

    xhr.send(formData);
  });
}


export const api = {
  get: (path, options) =>
    requestGet(path, options),

  post: (path, data) =>
    request(path, {
      method: 'POST',
      body: data
        ? JSON.stringify(data)
        : undefined,
    }),

  put: (path, data) =>
    request(path, {
      method: 'PUT',
      body: data
        ? JSON.stringify(data)
        : undefined,
    }),

  delete: (path) =>
    request(path, {
      method: 'DELETE',
    }),

  upload: (path, formData) =>
    requestFormData(
      path,
      formData,
      'POST'
    ),

  uploadPut: (path, formData) =>
    requestFormData(
      path,
      formData,
      'PUT'
    ),

  uploadWithProgress: (
    path,
    formData,
    onProgress
  ) =>
    uploadWithProgress(
      path,
      formData,
      {
        method: 'POST',
        onProgress,
      }
    ),
};


/*
 * Google OAuth.
 */
export const GOOGLE_LOGIN_URL =
  `/api/auth/google?returnTo=/my-account`;

export { API_BASE };
