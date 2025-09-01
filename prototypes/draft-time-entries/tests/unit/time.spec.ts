import { describe, it, expect } from 'vitest'
import { minutesToUnits, unitsToMinutes } from '../../src/lib/time'

describe('time utilities', () => {
  it('converts minutes to units', () => {
    expect(minutesToUnits(6)).toBe(1)
    expect(minutesToUnits(7)).toBe(2)
  })

  it('converts units to minutes', () => {
    expect(unitsToMinutes(1)).toBe(6)
  })
})
