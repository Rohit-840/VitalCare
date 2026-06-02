const BASE = '/api';

function getToken() {
  return localStorage.getItem('vitalcare_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login:    (payload) => request('/auth/login',    { method: 'POST', body: payload, auth: false }),
  me:       () => request('/auth/me'),

  diagnose: (vitals) => request('/health/diagnose', { method: 'POST', body: { vitals } }),
  records:  () => request('/health/records'),
  deleteRecord: (id) => request(`/health/records/${id}`, { method: 'DELETE' }),

  doctors: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/doctors${qs ? '?' + qs : ''}`, { auth: false });
  },
  specialties: () => request('/doctors/specialties', { auth: false }),
  cities:      () => request('/doctors/cities',      { auth: false }),

  bookAppointment: (payload) => request('/appointments', { method: 'POST', body: payload }),
  myAppointments:  () => request('/appointments/mine'),
  cancelAppointment: (id) => request(`/appointments/${id}/cancel`, { method: 'PATCH' })
};
