import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { users } from '../mocks/data'
import { server } from '../mocks/node'
import { renderApp } from './render'

describe('user selection', () => {
  it('auto-selects the only user and shows today', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'Сегодня' })).toBeInTheDocument()
    expect(localStorage.getItem('reminder.userId')).toBe('1')
  })

  it('asks to pick a user when there are several', async () => {
    server.use(
      http.get('*/api/v1/users', () =>
        HttpResponse.json([...users, { id: 2, display_name: 'Второй', timezone: 'UTC' }]),
      ),
    )
    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'Кто вы?' })).toBeInTheDocument()
  })

  it('explains how to register when there are no users', async () => {
    server.use(http.get('*/api/v1/users', () => HttpResponse.json([])))
    renderApp('/')
    expect(await screen.findByText(/Пользователей пока нет/)).toBeInTheDocument()
  })

  it('drops a stored user the API does not know', async () => {
    server.use(
      http.get('*/api/v1/users', () =>
        HttpResponse.json([...users, { id: 2, display_name: 'Второй', timezone: 'UTC' }]),
      ),
    )
    renderApp('/', { userId: 99 })
    expect(await screen.findByRole('heading', { name: 'Кто вы?' })).toBeInTheDocument()
    expect(localStorage.getItem('reminder.userId')).toBeNull()
  })
})

describe('today page', () => {
  it('shows the routine, its time, progress and streaks', async () => {
    renderApp('/', { userId: 1 })
    expect(await screen.findByRole('heading', { name: '🌅 Утро' })).toBeInTheDocument()
    expect(screen.getByText('каждый день в 07:00')).toBeInTheDocument()
    expect(screen.getByText('Отправлен в 07:00')).toBeInTheDocument()
    expect(screen.getByText('1 из 3')).toBeInTheDocument()
    expect(screen.getByText('💧 Стакан воды')).toBeInTheDocument()
    expect(screen.getByLabelText('Серия 23')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Выполнено')).toHaveLength(1)
    expect(screen.getAllByLabelText('Пропущено')).toHaveLength(1)
  })

  it('shows an error with retry when the API fails', async () => {
    server.use(http.get('*/api/v1/today', () => HttpResponse.json({}, { status: 500 })))
    renderApp('/', { userId: 1 })
    expect(await screen.findByText('Не удалось загрузить данные')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()
  })
})

describe('habits pages', () => {
  it('lists habits grouped by routine with streaks and milestones', async () => {
    renderApp('/habits', { userId: 1 })
    const card = await screen.findByRole('link', { name: 'Стакан воды' })
    expect(within(card).getByLabelText('Серия 23')).toBeInTheDocument()
    expect(within(card).getByText('рекорд 23 дня')).toBeInTheDocument()
    expect(within(card).getByText('93%')).toBeInTheDocument()
    expect(within(card).getByText('21 день')).toBeInTheDocument()
    expect(within(card).getByText('до 30 дней: ещё 7')).toBeInTheDocument()
    expect(screen.getByText('каждый день в 07:00')).toBeInTheDocument()
  })

  it('shows habit details and history', async () => {
    renderApp('/habits/1', { userId: 1 })
    expect(await screen.findByRole('heading', { name: '💧 Стакан воды' })).toBeInTheDocument()
    expect(screen.getByText('🔥 23 дня')).toBeInTheDocument()
    expect(screen.getByText('Сразу после пробуждения')).toBeInTheDocument()
    expect(await screen.findByText('История')).toBeInTheDocument()
  })

  it('shows not found for an unknown route', async () => {
    renderApp('/nope', { userId: 1 })
    expect(await screen.findByText('Страница не найдена')).toBeInTheDocument()
  })
})
