// // Same-origin in production (proxied to the Render backend by vercel.json's
// // /api/:path* rewrite) — required for the customer session cookie to work
// // on Safari iOS and Chrome Android, both of which block third-party cookies
// // by default. When the frontend and backend were on different domains, the
// // browser correctly stored khayaal_token as belonging to
// // khayaal-backend.onrender.com, and then refused to attach it to any
// // cross-site fetch() from khayaalofficial.in — invisibly, with no console
// // error, since this is a browser privacy policy, not a bug either app could
// // detect. Routing every request through /api on the frontend's own origin
// // makes the cookie genuinely first-party, which both browsers exempt from
// // that restriction. Local dev has no Vercel rewrite layer, so it keeps
// // talking to the backend directly.
// const configuredApiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// // VITE_API_URL is documented as the backend origin. Tolerate an accidental
// // trailing /api too, because service paths already include it where needed.
// const API_BASE = import.meta.env.DEV ? configuredApiBase.replace(/\/api\/?$/, '') : '/api';

// // Service modules describe backend routes. Some backend routes already live
// // under /api (admin, orders, and customer account routes), while public
// // catalog routes do not. In production, avoid prefixing those /api routes a
// // second time so the browser always requests /api/admin/... rather than
// // /api/api/admin/.... The Vercel rewrites preserve that backend prefix.
// function requestUrl(path) {
//   if (!import.meta.env.DEV && path.startsWith('/api/')) return path;
//   return `${API_BASE}${path}`;
// }

// // Lets CustomerAuthContext react to a session going invalid (expired/revoked
// // JWT) no matter which API call surfaces it, without apiClient importing
// // the context (which would be circular — the context itself calls `api`).
// let unauthorizedHandler = null;
// export function setUnauthorizedHandler(fn) {
//   unauthorizedHandler = fn;
// }

// // React StrictMode intentionally re-runs mount effects in development. Keep
// // concurrent identical GETs on one network request so providers and hooks do
// // not turn that lifecycle check into a burst against the API. This only
// // shares requests while they are in flight; it does not cache responses.
// const inFlightGetRequests = new Map();

// function requestGet(path, options = {}) {
//   const method = options.method || 'GET';
//   // A caller-owned AbortSignal must remain isolated; sharing its request would
//   // let one consumer cancel work another consumer is awaiting.
//   if (method !== 'GET' || options.signal || /^\/api\/admin(?:\/|$)/.test(path)) {
//     return request(path, options);
//   }

//   const headers = Object.entries(options.headers || {}).sort(([a], [b]) => a.localeCompare(b));
//   const key = JSON.stringify([
//     requestUrl(path),
//     options.cache || 'default',
//     options.credentials || 'include',
//     Boolean(options.suppressUnauthorizedHandler),
//     headers,
//   ]);

//   const existing = inFlightGetRequests.get(key);
//   if (existing) return existing;

//   const pending = request(path, options).finally(() => {
//     if (inFlightGetRequests.get(key) === pending) inFlightGetRequests.delete(key);
//   });
//   inFlightGetRequests.set(key, pending);
//   return pending;
// }

// // Same pattern, for the admin side: AdminAuthContext registers a function
// // that returns the current Firebase ID token (or null if signed out), and
// // every request below attaches it as a Bearer header when present. Customer
// // requests are unaffected — they authenticate via the httpOnly cookie
// // (credentials: 'include'), never this header.
// let adminTokenProvider = null;
// export function setAdminTokenProvider(fn) {
//   adminTokenProvider = fn;
// }

// async function authHeaders() {
//   const token = await adminTokenProvider?.();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// async function request(path, options = {}, isRetry = false) {
//   // A session-restore call needs to decide when a 401 is final. In
//   // particular, immediately after an OAuth redirect the first request can
//   // race the proxy/cookie becoming available. Do not let that transient
//   // response trigger the global logout handler before the caller finishes
//   // its bounded retry window.
//   const { suppressUnauthorizedHandler = false, ...fetchOptions } = options;
//   let res;
//   try {
//     res = await fetch(requestUrl(path), {
//       credentials: 'include',
//       headers: {
//         ...(fetchOptions.body !== undefined && fetchOptions.body !== null
//           ? { 'Content-Type': 'application/json' }
//           : {}),
//         ...(await authHeaders()),
//         ...fetchOptions.headers,
//       },
//       ...fetchOptions,
//     });
//   } catch {
//     // `fetch` only throws for a genuine network-level failure (server
//     // unreachable, DNS failure, offline) — never for HTTP error responses,
//     // which resolve normally with res.ok === false. One retry after a short
//     // pause handles a transient blip without looping forever.
//     if (isRetry) throw new Error('Network error — please check your connection and try again.');
//     await new Promise((resolve) => setTimeout(resolve, 400));
//     return request(path, options, true);
//   }

//   const isJson = res.headers.get('content-type')?.includes('application/json');
//   const body = isJson ? await res.json() : null;

//   if (res.status === 401 && !suppressUnauthorizedHandler) unauthorizedHandler?.();

//   if (!res.ok) {
//     const error = new Error(body?.error || body?.message || `Request failed (${res.status})`);
//     error.status = res.status;
//     throw error;
//   }
//   return body;
// }

// // Multipart upload — deliberately bypasses `request()`'s JSON handling.
// // The browser must set its own multipart Content-Type (with boundary), so
// // this never sets a Content-Type header manually.
// async function requestFormData(path, formData, method = 'POST') {
//   const res = await fetch(requestUrl(path), {
//     method,
//     credentials: 'include',
//     headers: await authHeaders(),
//     body: formData,
//   });
//   const isJson = res.headers.get('content-type')?.includes('application/json');
//   const body = isJson ? await res.json() : null;
//   if (!res.ok) throw new Error(body?.error || `Upload failed (${res.status})`);
//   return body;
// }

// // `fetch` has no upload-progress event, so a real progress bar needs XHR.
// // Kept separate from `requestFormData` above rather than replacing it —
// // most upload call sites don't need a progress bar and XHR is more
// // verbose to work with than fetch.
// async function uploadWithProgress(path, formData, { method = 'POST', onProgress } = {}) {
//   const headers = await authHeaders();
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, requestUrl(path));
//     xhr.withCredentials = true;
//     for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);

//     xhr.upload.onprogress = (e) => {
//       if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
//     };

//     xhr.onload = () => {
//       let body = null;
//       try {
//         body = JSON.parse(xhr.responseText);
//       } catch {
//         // non-JSON response — body stays null
//       }
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(body);
//       } else {
//         reject(new Error(body?.error || `Upload failed (${xhr.status})`));
//       }
//     };
//     xhr.onerror = () => reject(new Error('Upload failed — check your connection.'));

//     xhr.send(formData);
//   });
// }

// export const api = {
//   get: (path, options) => requestGet(path, options),
//   post: (path, data) => request(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
//   put: (path, data) => request(path, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
//   delete: (path) => request(path, { method: 'DELETE' }),
//   upload: (path, formData) => requestFormData(path, formData, 'POST'),
//   uploadPut: (path, formData) => requestFormData(path, formData, 'PUT'),
//   uploadWithProgress: (path, formData, onProgress) => uploadWithProgress(path, formData, { method: 'POST', onProgress }),
// };

// // Keep the OAuth entry point on the public origin and give the backend a
// // safe, explicit post-login destination. This must remain a relative /api
// // URL in production so the OAuth callback can set a first-party cookie for
// // www.khayaalofficial.in through the Vercel rewrite.
// export const GOOGLE_LOGIN_URL = `${API_BASE}/auth/google?returnTo=/my-account`;
// export { API_BASE };


// Same-origin in production so cookies remain first-party.
const configuredApiBase =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

const API_BASE = import.meta.env.DEV
  ? configuredApiBase.replace(/\/api\/?$/, '')
  : '/api';

function requestUrl(path) {
  if (!import.meta.env.DEV && path.startsWith('/api/')) {
    return path;
  }

  return `${API_BASE}${path}`;
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
  `${API_BASE}/auth/google?returnTo=/my-account`;

export { API_BASE };