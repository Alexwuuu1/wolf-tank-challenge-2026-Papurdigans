export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function request(path, options = {}, token = null) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexion' }));
    throw new Error(error.message || 'Error de conexion');
  }

  return response.json();
}

export async function publicRequest(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error('Error de conexion');
  return response.json();
}
