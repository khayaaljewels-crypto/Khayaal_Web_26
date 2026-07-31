const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Lets CustomerAuthContext react to a session going invalid (expired/revoked
// JWT) no matter which API call surfaces it, without apiClient importing
// the context (which would be circular — the context itself calls `api`).
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

// Same pattern, for the admin side: AdminAuthContext registers a function
// that returns the current Firebase ID token (or null if signed out), and
// every request below attaches it as a Bearer header when present. Customer
// requests are unaffected — they authenticate via the httpOnly cookie
// (credentials: 'include'), never this header.
let adminTokenProvider = null;
export function setAdminTokenProvider(fn) {
  adminTokenProvider = fn;
}

async function authHeaders() {
  const token = await adminTokenProvider?.();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}, isRetry = false) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()), ...options.headers },
      ...options,
    });
  } catch (networkErr) {
    // `fetch` only throws for a genuine network-level failure (server
    // unreachable, DNS failure, offline) — never for HTTP error responses,
    // which resolve normally with res.ok === false. One retry after a short
    // pause handles a transient blip without looping forever.
    if (isRetry) throw new Error('Network error — please check your connection and try again.');
    await new Promise((resolve) => setTimeout(resolve, 400));
    return request(path, options, true);
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (res.status === 401) unauthorizedHandler?.();

  if (!res.ok) {
    throw new Error(body?.error || body?.message || `Request failed (${res.status})`);
  }
  return body;
}

// Multipart upload — deliberately bypasses `request()`'s JSON handling.
// The browser must set its own multipart Content-Type (with boundary), so
// this never sets a Content-Type header manually.
async function requestFormData(path, formData, method = 'POST') {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: await authHeaders(),
    body: formData,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) throw new Error(body?.error || `Upload failed (${res.status})`);
  return body;
}

// `fetch` has no upload-progress event, so a real progress bar needs XHR.
// Kept separate from `requestFormData` above rather than replacing it —
// most upload call sites don't need a progress bar and XHR is more
// verbose to work with than fetch.
async function uploadWithProgress(path, formData, { method = 'POST', onProgress } = {}) {
  const headers = await authHeaders();
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_BASE}${path}`);
    xhr.withCredentials = true;
    for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let body = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response — body stays null
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body);
      } else {
        reject(new Error(body?.error || `Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed — check your connection.'));

    xhr.send(formData);
  });
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: (path, data) => request(path, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => requestFormData(path, formData, 'POST'),
  uploadPut: (path, formData) => requestFormData(path, formData, 'PUT'),
  uploadWithProgress: (path, formData, onProgress) => uploadWithProgress(path, formData, { method: 'POST', onProgress }),
};

export const GOOGLE_LOGIN_URL = `${API_BASE}/auth/google`;
export { API_BASE };
