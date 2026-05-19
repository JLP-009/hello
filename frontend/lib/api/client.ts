export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).detail || 'Request failed');
  return res.json();
}
