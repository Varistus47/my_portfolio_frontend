/**
 * Admin token storage.
 *
 * sessionStorage, not localStorage: the admin session should die with the tab.
 * The password itself is never stored anywhere on the client - only the
 * short-lived token the backend hands back.
 */

const TOKEN_KEY = 'portfolio_admin_token'

/** Notifies mounted components when the token is cleared mid-session. */
type Listener = () => void
const listeners = new Set<Listener>()

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    // Private-browsing modes can throw on storage access.
    return null
  }
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore - the session just will not survive a refresh */
  }
  notify()
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
  notify()
}

export function onTokenChange(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notify(): void {
  for (const listener of listeners) listener()
}
