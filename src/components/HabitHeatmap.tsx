import { Heatmap } from '@mantine/charts'
import { Group, ScrollArea, Text } from '@mantine/core'

import type { DayOutcome, HabitHistory } from '../api/types'
import { formatDate } from '../lib/format'
import { OUTCOME_META } from '../lib/outcome'

// Heatmap values are only keys for colors; the outcome itself drives the fill.
const VALUE: Record<DayOutcome, number> = {
  missed: 0,
  pending: 1,
  not_done: 2,
  skipped: 3,
  done: 4,
}

const OUTCOME_BY_VALUE = Object.fromEntries(
  Object.entries(VALUE).map(([outcome, value]) => [value, outcome as DayOutcome]),
)

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const WEEKDAYS = ['Вс', 'Пн', '', 'Ср', '', 'Пт', '']

const MIN_WEEKS = 12

function shiftDays(isoDate: string, delta: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

/** Start at the first record (at least MIN_WEEKS back) instead of an almost empty year. */
function startDate(history: HabitHistory): string {
  const first = history.days[0]?.date ?? history.date_to
  const minimal = shiftDays(history.date_to, -MIN_WEEKS * 7)
  const start = first < minimal ? first : minimal
  return start < history.date_from ? history.date_from : start
}

export function HabitHeatmap({ history }: { history: HabitHistory }) {
  const data = Object.fromEntries(history.days.map((day) => [day.date, VALUE[day.outcome]]))
  const used = new Set(history.days.map((day) => day.outcome))

  return (
    <div>
      <ScrollArea type="auto" offsetScrollbars>
        <Heatmap
          data={data}
          startDate={startDate(history)}
          endDate={history.date_to}
          withMonthLabels
          monthLabels={MONTHS}
          withWeekdayLabels
          weekdayLabels={WEEKDAYS}
          firstDayOfWeek={1}
          rectSize={13}
          gap={2}
          withTooltip
          getTooltipLabel={({ date, value }) => {
            const outcome = value === null ? undefined : OUTCOME_BY_VALUE[value]
            return `${formatDate(date)} — ${outcome ? OUTCOME_META[outcome].label : 'не запланировано'}`
          }}
          getRectProps={({ value }) => {
            const outcome = value === null ? undefined : OUTCOME_BY_VALUE[value]
            return outcome ? { fill: OUTCOME_META[outcome].color } : {}
          }}
        />
      </ScrollArea>
      <Group gap="md" mt="xs">
        {(Object.keys(OUTCOME_META) as DayOutcome[])
          .filter((outcome) => used.has(outcome) || outcome === 'done' || outcome === 'not_done')
          .map((outcome) => (
            <Group key={outcome} gap={6}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: OUTCOME_META[outcome].color,
                  display: 'inline-block',
                }}
              />
              <Text size="xs" c="dimmed">
                {OUTCOME_META[outcome].label}
              </Text>
            </Group>
          ))}
      </Group>
    </div>
  )
}
