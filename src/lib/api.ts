import { auth } from './firebase';

// Helper to make authenticated requests to our backend
export async function apiFetch(url: string, options: RequestInit = {}) {
  let token = null;
  if (auth?.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (e) {
      console.error("Error getting auth token", e);
    }
  }

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Get active workspace, fallback to default
  const wsId = localStorage.getItem('active_workspace_id') || 'ws-bizos-001';
  headers.set('x-workspace-id', wsId);

  // Default to application/json if sending a body
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers
  });
  
  return res;
}
