const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getToken() {
  return localStorage.getItem('devhub_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('devhub_token', token);
  else localStorage.removeItem('devhub_token');
}

export function getStoredToken() {
  return getToken();
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status, data.details);
  }

  return data;
}

export const api = {
  // auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // projects
  getProjects: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v);
    });
    const qs = q.toString();
    return request(`/projects${qs ? `?${qs}` : ''}`);
  },
  getProject: (slug) => request(`/projects/${slug}`),
  createProject: (body) =>
    request('/projects', { method: 'POST', body: JSON.stringify(body) }),
  vote: (id) => request(`/projects/${id}/vote`, { method: 'POST' }),
  getComments: (id) => request(`/projects/${id}/comments`),
  addComment: (id, body) =>
    request(`/projects/${id}/comments`, { method: 'POST', body: JSON.stringify(body) }),

  // tags & users
  getTags: () => request('/tags'),
  getUser: (username) => request(`/users/${username}`),
};

export { ApiError };
