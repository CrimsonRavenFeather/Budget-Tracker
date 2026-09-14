const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

let authToken = null

export function setAuthToken(token) {
  authToken = token
  if (token) {
    localStorage.setItem('access_token', token)
  } else {
    localStorage.removeItem('access_token')
  }
}

export function loadStoredToken() {
  authToken = localStorage.getItem('access_token')
  return authToken
}

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, params } = {}) {
  let url = `${BASE_URL}${path}`
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    ).toString()
    if (qs) url += `?${qs}`
  }

  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  let data = null
  try {
    data = await res.json()
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = data?.detail
      ? typeof data.detail === 'string'
        ? data.detail
        : JSON.stringify(data.detail)
      : `Request failed (${res.status})`
    throw new ApiError(message, res.status)
  }

  return data
}

export const api = {
  register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  listBuckets: () => request('/buckets'),
  createBucket: (payload) => request('/buckets', { method: 'POST', body: payload }),
  updateBucket: (id, payload) => request(`/buckets/${id}`, { method: 'PUT', body: payload }),

  listCategories: () => request('/categories'),
  createCategory: (payload) => request('/categories', { method: 'POST', body: payload }),

  listTransactions: (from, to) => request('/transactions', { params: { from, to } }),
  createTransaction: (payload) => request('/transactions', { method: 'POST', body: payload }),
  updateTransaction: (id, payload) => request(`/transactions/${id}`, { method: 'PUT', body: payload }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  getSummary: (month) => request('/analytics/summary', { params: { month } }),
  getTrend: (months) => request('/analytics/trend', { params: { months } }),
  getInsight: (month) => request('/analytics/insight', { params: { month } }),
}

export { ApiError }
