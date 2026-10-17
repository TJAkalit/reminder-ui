import type { DayOutcome } from '../api/types'

export const OUTCOME_META: Record<DayOutcome, { label: string; color: string }> = {
  done: { label: 'Выполнено', color: 'var(--mantine-color-teal-6)' },
  skipped: { label: 'Пропущено', color: 'var(--mantine-color-yellow-5)' },
  not_done: { label: 'Не выполнено', color: 'var(--mantine-color-red-4)' },
  pending: { label: 'Сегодня, ещё не отмечено', color: 'var(--mantine-color-blue-3)' },
  missed: { label: 'Напоминание не отправлено', color: 'var(--mantine-color-gray-5)' },
}
