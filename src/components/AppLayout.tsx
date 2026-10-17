import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconChecklist, IconListDetails, IconMoon, IconSun } from '@tabler/icons-react'
import { NavLink, Outlet } from 'react-router'

import { UserGate } from './UserGate'
import { UserSelect } from './UserSelect'

const NAV = [
  { to: '/', label: 'Сегодня', icon: IconChecklist, end: true },
  { to: '/habits', label: 'Привычки', icon: IconListDetails, end: false },
]

function NavButtons({ fullWidth = false }: { fullWidth?: boolean }) {
  return NAV.map(({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      style={{ flex: fullWidth ? 1 : undefined, textDecoration: 'none' }}
    >
      {({ isActive }) => (
        <Button
          component="span"
          variant={isActive ? 'light' : 'subtle'}
          color={isActive ? undefined : 'gray'}
          leftSection={<Icon size={18} />}
          fullWidth={fullWidth}
        >
          {label}
        </Button>
      )}
    </NavLink>
  ))
}

function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const scheme = useComputedColorScheme('light')
  const next = scheme === 'dark' ? 'light' : 'dark'
  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label={next === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
      onClick={() => setColorScheme(next)}
    >
      {scheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  )
}

export function AppLayout() {
  // Bottom navigation on phones, header navigation from the `sm` breakpoint.
  const isPhone = useMediaQuery('(max-width: 48em)') ?? false
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 64, collapsed: !isPhone }} padding="md">
      <AppShell.Header>
        <Container size="md" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Group gap="lg" wrap="nowrap">
              <Text fw={700} size="lg" style={{ whiteSpace: 'nowrap' }}>
                ✅ Reminder
              </Text>
              <Group gap={4} visibleFrom="sm">
                <NavButtons />
              </Group>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <UserSelect width={{ base: 140, xs: 200 }} />
              <ColorSchemeToggle />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="md" px={0}>
          <UserGate>
            <Outlet />
          </UserGate>
        </Container>
      </AppShell.Main>

      <AppShell.Footer hiddenFrom="sm" p="xs">
        <Group gap="xs" wrap="nowrap">
          <NavButtons fullWidth />
        </Group>
      </AppShell.Footer>
    </AppShell>
  )
}
