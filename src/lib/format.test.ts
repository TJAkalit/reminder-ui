import { describe, expect, it } from 'vitest'

import { days, formatLongDate, formatPercent, formatTime, withEmoji } from './format'

describe('format', () => {
  it('formats local calendar days without timezone drift', () => {
    expect(formatLongDate('2026-10-18')).toBe('воскресенье, 18 октября')
  })

  it('formats time in the user timezone', () => {
    expect(formatTime('2026-10-18T04:00:00Z', 'Europe/Moscow')).toBe('07:00')
  })

  it('pluralizes days', () => {
    expect(days(1)).toBe('1 день')
    expect(days(3)).toBe('3 дня')
    expect(days(11)).toBe('11 дней')
    expect(days(21)).toBe('21 день')
    expect(days(66)).toBe('66 дней')
  })

  it('formats percent and emoji titles', () => {
    expect(formatPercent(0.926)).toBe('93%')
    expect(formatPercent(null)).toBe('—')
    expect(withEmoji('Вода', '💧')).toBe('💧 Вода')
    expect(withEmoji('Вода', null)).toBe('Вода')
  })
})
