import { describe, it, expect } from 'vitest'
import { sprintData, bugsByModule, kpiCards, coverageByType } from '../data/metrics'

describe('sprintData', () => {
  it('should have 8 sprints', () => {
    expect(sprintData).toHaveLength(8)
  })

  it('should have pass + fail + skip rates summing to 100 per sprint', () => {
    sprintData.forEach(s => {
      expect(s.passRate + s.failRate + s.skipRate).toBe(100)
    })
  })

  it('should have increasing pass rates overall (positive trend)', () => {
    const first = sprintData[0].passRate
    const last  = sprintData[sprintData.length - 1].passRate
    expect(last).toBeGreaterThan(first)
  })

  it('should have decreasing avg response time overall (positive trend)', () => {
    const first = sprintData[0].avgResponseTime
    const last  = sprintData[sprintData.length - 1].avgResponseTime
    expect(last).toBeLessThan(first)
  })

  it('each sprint should have all required fields', () => {
    sprintData.forEach(s => {
      expect(s).toHaveProperty('sprint')
      expect(s).toHaveProperty('passRate')
      expect(s).toHaveProperty('failRate')
      expect(s).toHaveProperty('skipRate')
      expect(s).toHaveProperty('totalTests')
      expect(s).toHaveProperty('bugsFound')
      expect(s).toHaveProperty('bugsFixed')
      expect(s).toHaveProperty('avgResponseTime')
    })
  })

  it('pass rate should always be between 0 and 100', () => {
    sprintData.forEach(s => {
      expect(s.passRate).toBeGreaterThanOrEqual(0)
      expect(s.passRate).toBeLessThanOrEqual(100)
    })
  })
})

describe('bugsByModule', () => {
  it('should have 6 modules', () => {
    expect(bugsByModule).toHaveLength(6)
  })

  it('each module should have critical, high, medium, low counts', () => {
    bugsByModule.forEach(b => {
      expect(b).toHaveProperty('module')
      expect(b.critical).toBeGreaterThanOrEqual(0)
      expect(b.high).toBeGreaterThanOrEqual(0)
      expect(b.medium).toBeGreaterThanOrEqual(0)
      expect(b.low).toBeGreaterThanOrEqual(0)
    })
  })

  it('Checkout should have the highest critical bug count', () => {
    const checkout = bugsByModule.find(b => b.module === 'Checkout')!
    const maxCritical = Math.max(...bugsByModule.map(b => b.critical))
    expect(checkout.critical).toBe(maxCritical)
  })
})

describe('kpiCards', () => {
  it('should have 4 KPI cards', () => {
    expect(kpiCards).toHaveLength(4)
  })

  it('each KPI card should have required fields', () => {
    kpiCards.forEach(k => {
      expect(k).toHaveProperty('label')
      expect(k).toHaveProperty('value')
      expect(k).toHaveProperty('delta')
      expect(k).toHaveProperty('deltaPositive')
      expect(k).toHaveProperty('icon')
    })
  })

  it('all current KPIs should be positive trends', () => {
    kpiCards.forEach(k => {
      expect(k.deltaPositive).toBe(true)
    })
  })
})

describe('coverageByType', () => {
  it('should have matching labels and values length', () => {
    expect(coverageByType.labels.length).toBe(coverageByType.values.length)
  })

  it('all coverage values should be between 0 and 100', () => {
    coverageByType.values.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(100)
    })
  })

  it('unit tests should have highest coverage', () => {
    const unitIdx = coverageByType.labels.indexOf('Unit')
    const max = Math.max(...coverageByType.values)
    expect(coverageByType.values[unitIdx]).toBe(max)
  })
})
