import type { DayOutcome, Habit, HabitHistory, Routine, Today, User } from '../api/types'

/** Realistic sample data for `npm run dev:mock` and tests. */

export const TODAY = '2026-10-18'

export const users: User[] = [
  { id: 1, display_name: 'Тестовый пользователь', timezone: 'Europe/Moscow' },
]

const schedule = {
  rrule: 'FREQ=DAILY;BYHOUR=7;BYMINUTE=0',
  start: '2026-08-01',
  time: '07:00',
  description: 'каждый день в 07:00',
}

const routineRef = { id: 1, title: 'Утро', emoji: '🌅', schedule }

export const routines: Routine[] = [
  {
    ...routineRef,
    is_active: true,
    next_run_at: '2026-10-19T04:00:00Z',
    habits: [
      { id: 1, title: 'Стакан воды', emoji: '💧' },
      { id: 2, title: 'Зарядка 10 минут', emoji: '🤸' },
      { id: 3, title: 'Без телефона 30 минут', emoji: '📵' },
    ],
  },
]

export const habits: Habit[] = [
  {
    id: 1,
    title: 'Стакан воды',
    description: 'Сразу после пробуждения',
    emoji: '💧',
    created_at: '2026-08-01T10:00:00Z',
    archived_at: null,
    routine: routineRef,
    stats: {
      current_streak: 23,
      best_streak: 23,
      completion_rate_30d: 0.93,
      milestones: [
        { threshold: 7, achieved_on: '2026-10-02' },
        { threshold: 14, achieved_on: '2026-10-09' },
        { threshold: 21, achieved_on: '2026-10-16' },
      ],
      next_milestone: { threshold: 30, remaining: 7 },
    },
  },
  {
    id: 2,
    title: 'Зарядка 10 минут',
    description: null,
    emoji: '🤸',
    created_at: '2026-08-01T10:00:00Z',
    archived_at: null,
    routine: routineRef,
    stats: {
      current_streak: 4,
      best_streak: 9,
      completion_rate_30d: 0.6,
      milestones: [{ threshold: 7, achieved_on: '2026-09-12' }],
      next_milestone: { threshold: 7, remaining: 3 },
    },
  },
  {
    id: 3,
    title: 'Без телефона 30 минут',
    description: null,
    emoji: '📵',
    created_at: '2026-10-10T10:00:00Z',
    archived_at: null,
    routine: routineRef,
    stats: {
      current_streak: 0,
      best_streak: 2,
      completion_rate_30d: 0.375,
      milestones: [],
      next_milestone: { threshold: 7, remaining: 7 },
    },
  },
]

export const today: Today = {
  date: TODAY,
  timezone: 'Europe/Moscow',
  routines: [
    {
      routine_id: 1,
      title: 'Утро',
      emoji: '🌅',
      schedule_description: 'каждый день в 07:00',
      scheduled_at: '2026-10-18T04:00:00Z',
      occurrence_id: 80,
      state: 'open',
      items: [
        { habit_id: 1, title: 'Стакан воды', emoji: '💧', status: 'done', current_streak: 23 },
        {
          habit_id: 2,
          title: 'Зарядка 10 минут',
          emoji: '🤸',
          status: 'pending',
          current_streak: 4,
        },
        {
          habit_id: 3,
          title: 'Без телефона 30 минут',
          emoji: '📵',
          status: 'skipped',
          current_streak: 0,
        },
      ],
    },
  ],
}

function shiftDay(iso: string, delta: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

/** Deterministic pseudo-random history ending today. */
export function history(habitId: number): HabitHistory {
  const habit = habits.find((h) => h.id === habitId)
  const start = habit ? habit.created_at.slice(0, 10) : TODAY
  const total = Math.round((Date.parse(TODAY) - Date.parse(start)) / 86_400_000)
  const streak = habit?.stats.current_streak ?? 0
  const outcomes: DayOutcome[] = ['done', 'done', 'not_done', 'done', 'skipped', 'done', 'missed']
  const days = Array.from({ length: total + 1 }, (_, index) => {
    const fromEnd = total - index
    let outcome: DayOutcome
    if (fromEnd === 0) outcome = 'pending'
    else if (fromEnd <= streak) outcome = 'done'
    else if (fromEnd === streak + 1) outcome = 'not_done'
    else outcome = outcomes[(index * 7 + habitId * 3) % outcomes.length] ?? 'done'
    return { date: shiftDay(start, index), outcome }
  })
  return { habit_id: habitId, date_from: shiftDay(TODAY, -364), date_to: TODAY, days }
}
