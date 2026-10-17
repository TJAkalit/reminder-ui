const KEY = 'reminder.userId'

export function loadUserId(): number | null {
  try {
    const raw = localStorage.getItem(KEY)
    const id = raw === null ? NaN : Number(raw)
    return Number.isInteger(id) ? id : null
  } catch {
    return null
  }
}

export function saveUserId(id: number | null): void {
  try {
    if (id === null) {
      localStorage.removeItem(KEY)
    } else {
      localStorage.setItem(KEY, String(id))
    }
  } catch {
    // Storage can be unavailable (private mode); the selection then lives for the session only.
  }
}
