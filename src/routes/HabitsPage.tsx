import {
  Badge,
  Card,
  Group,
  RingProgress,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { useHabits } from '../api/queries'
import type { Habit } from '../api/types'
import { MilestoneBadges } from '../components/MilestoneBadges'
import { QueryState } from '../components/QueryState'
import { StreakBadge } from '../components/StreakBadge'
import { days, formatPercent, withEmoji } from '../lib/format'

function HabitCard({ habit }: { habit: Habit }) {
  const { stats } = habit
  const rate = stats.completion_rate_30d
  return (
    <Card
      withBorder
      padding="md"
      component={Link}
      to={`/habits/${habit.id}`}
      aria-label={habit.title}
      style={{ opacity: habit.archived_at ? 0.6 : 1 }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Text fw={600} truncate>
            {withEmoji(habit.title, habit.emoji)}
          </Text>
          {habit.archived_at && (
            <Badge size="xs" color="gray" variant="outline">
              В архиве
            </Badge>
          )}
          <Group gap={6} wrap="nowrap">
            <StreakBadge streak={stats.current_streak} />
            <Text size="xs" c="dimmed">
              рекорд {days(stats.best_streak)}
            </Text>
          </Group>
        </Stack>
        <RingProgress
          size={64}
          thickness={6}
          roundCaps
          sections={rate === null ? [] : [{ value: rate * 100, color: 'teal' }]}
          label={
            <Text size="xs" ta="center" fw={600}>
              {formatPercent(rate)}
            </Text>
          }
          aria-label="Выполнение за 30 дней"
        />
      </Group>
      <MilestoneBadges stats={stats} />
    </Card>
  )
}

function groupByRoutine(habits: Habit[]) {
  const groups = new Map<number, { routine: Habit['routine']; habits: Habit[] }>()
  for (const habit of habits) {
    const group = groups.get(habit.routine.id) ?? { routine: habit.routine, habits: [] }
    group.habits.push(habit)
    groups.set(habit.routine.id, group)
  }
  return [...groups.values()]
}

export function HabitsPage() {
  const [withArchived, setWithArchived] = useState(false)
  const habits = useHabits(withArchived)

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Привычки</Title>
        <Switch
          label="Архивные"
          checked={withArchived}
          onChange={(event) => setWithArchived(event.currentTarget.checked)}
        />
      </Group>
      <QueryState query={habits}>
        {(list) =>
          list.length === 0 ? (
            <Card withBorder padding="lg">
              <Text c="dimmed">
                Привычек пока нет. Добавьте первую в Telegram командой <b>/add</b>.
              </Text>
            </Card>
          ) : (
            groupByRoutine(list).map(({ routine, habits: items }) => (
              <Stack key={routine.id} gap="xs">
                <Group gap="xs">
                  <Title order={4}>{withEmoji(routine.title, routine.emoji ?? '🔔')}</Title>
                  <Badge variant="light" leftSection={<IconClock size={12} />}>
                    {routine.schedule.description}
                  </Badge>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {items.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </SimpleGrid>
              </Stack>
            ))
          )
        }
      </QueryState>
    </Stack>
  )
}
