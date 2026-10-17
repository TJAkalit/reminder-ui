/** Formatting helpers. Dates from the API are local calendar days (YYYY-MM-DD). */

function calendarDay(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`)
}

const longDate = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  timeZone: 'UTC',
})

const shortDate = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** «суббота, 18 октября» */
export function formatLongDate(isoDate: string): string {
  return longDate.format(calendarDay(isoDate))
}

/** «18 октября 2026 г.» */
export function formatDate(isoDate: string): string {
  return shortDate.format(calendarDay(isoDate))
}

/** Time of an instant in the user's timezone: «07:00». */
export function formatTime(isoDateTime: string, timeZone: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(isoDateTime))
}

export function formatPercent(rate: number | null): string {
  return rate === null ? '—' : `${Math.round(rate * 100)}%`
}

export function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function days(n: number): string {
  return `${n} ${pluralRu(n, 'день', 'дня', 'дней')}`
}

export function withEmoji(title: string, emoji: string | null | undefined): string {
  return emoji ? `${emoji} ${title}` : title
}
