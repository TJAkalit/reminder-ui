import { Badge, Card, Group, Progress, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'

import { useToday } from '../api/queries'
import type { TodayRoutine } from '../api/types'
import { CheckStatusIcon } from '../components/CheckStatusIcon'
import { QueryState } from '../components/QueryState'
import { StreakBadge } from '../components/StreakBadge'
import { formatLongDate, formatTime, withEmoji } from '../lib/format'

function StateBadge({ routine, timeZone }: { routine: TodayRoutine; timeZone: string }) {
  const at = routine.scheduled_at ? formatTime(routine.scheduled_at, timeZone) : null
  switch (routine.state) {
    case 'upcoming':
      return <Badge variant="light">Напомню в {at}</Badge>
    case 'open':
      return (
        <Badge variant="light" color="teal">
          Отправлен в {at}
        </Badge>
      )
    case 'not_sent':
      return (
        <Badge variant="light" color="orange">
          Ещё не отправлен
        </Badge>
      )
    case 'missed':
      return (
        <Badge variant="light" color="gray">
          Не отправлен (бот был недоступен)
        </Badge>
      )
  }
}

function RoutineCard({ routine, timeZone }: { routine: TodayRoutine; timeZone: string }) {
  const total = routine.items.length
  const done = routine.items.filter((item) => item.status === 'done').length

  return (
    <Card withBorder padding="lg">
      <Group justify="space-between" align="flex-start" mb="xs">
        <div>
          <Title order={3}>{withEmoji(routine.title, routine.emoji ?? '🔔')}</Title>
          <Text size="sm" c="dimmed">
            {routine.schedule_description}
          </Text>
        </div>
        <StateBadge routine={routine} timeZone={timeZone} />
      </Group>

      {total > 0 && (
        <Group gap="sm" mb="md" wrap="nowrap">
          <Progress
            value={(done / total) * 100}
            color="teal"
            style={{ flex: 1 }}
            aria-label="Прогресс"
          />
          <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
            {done} из {total}
          </Text>
        </Group>
      )}

      <Stack gap="xs">
        {routine.items.map((item) => (
          <Group key={item.habit_id} justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <CheckStatusIcon status={item.status} />
              <Text
                component={Link}
                to={`/habits/${item.habit_id}`}
                c={item.status === 'skipped' ? 'dimmed' : 'inherit'}
                td={item.status === 'skipped' ? 'line-through' : 'none'}
              >
                {withEmoji(item.title, item.emoji)}
              </Text>
            </Group>
            <StreakBadge streak={item.current_streak} size="sm" />
          </Group>
        ))}
      </Stack>
    </Card>
  )
}

export function TodayPage() {
  const today = useToday()
  return (
    <QueryState query={today}>
      {(data) => (
        <Stack>
          <div>
            <Title order={2}>Сегодня</Title>
            <Text c="dimmed">{formatLongDate(data.date)}</Text>
          </div>
          {data.routines.length === 0 ? (
            <Card withBorder padding="lg">
              <Text c="dimmed">
                Сегодня по расписанию ничего нет. Добавить привычку можно в Telegram командой{' '}
                <b>/add</b>.
              </Text>
            </Card>
          ) : (
            data.routines.map((routine) => (
              <RoutineCard key={routine.routine_id} routine={routine} timeZone={data.timezone} />
            ))
          )}
          <Text size="xs" c="dimmed" ta="center">
            Отмечать привычки можно в Telegram до конца дня.
          </Text>
        </Stack>
      )}
    </QueryState>
  )
}
