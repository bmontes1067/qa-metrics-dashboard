export interface SprintMetrics {
  sprint: string
  passRate: number
  failRate: number
  skipRate: number
  totalTests: number
  bugsFound: number
  bugsFixed: number
  avgResponseTime: number // ms
}

export interface BugByModule {
  module: string
  critical: number
  high: number
  medium: number
  low: number
}

export interface KpiCard {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  icon: string
}

export const sprintData: SprintMetrics[] = [
  { sprint: 'S-18', passRate: 72, failRate: 20, skipRate: 8,  totalTests: 180, bugsFound: 24, bugsFixed: 18, avgResponseTime: 420 },
  { sprint: 'S-19', passRate: 75, failRate: 18, skipRate: 7,  totalTests: 195, bugsFound: 21, bugsFixed: 20, avgResponseTime: 398 },
  { sprint: 'S-20', passRate: 79, failRate: 15, skipRate: 6,  totalTests: 210, bugsFound: 17, bugsFixed: 19, avgResponseTime: 375 },
  { sprint: 'S-21', passRate: 81, failRate: 13, skipRate: 6,  totalTests: 224, bugsFound: 15, bugsFixed: 16, avgResponseTime: 360 },
  { sprint: 'S-22', passRate: 84, failRate: 11, skipRate: 5,  totalTests: 238, bugsFound: 12, bugsFixed: 14, avgResponseTime: 342 },
  { sprint: 'S-23', passRate: 83, failRate: 12, skipRate: 5,  totalTests: 245, bugsFound: 14, bugsFixed: 12, avgResponseTime: 355 },
  { sprint: 'S-24', passRate: 87, failRate: 9,  skipRate: 4,  totalTests: 260, bugsFound: 10, bugsFixed: 13, avgResponseTime: 318 },
  { sprint: 'S-25', passRate: 91, failRate: 6,  skipRate: 3,  totalTests: 274, bugsFound: 7,  bugsFixed: 10, avgResponseTime: 290 },
]

export const bugsByModule: BugByModule[] = [
  { module: 'Auth',      critical: 2, high: 5, medium: 8,  low: 3  },
  { module: 'Checkout',  critical: 4, high: 8, medium: 12, low: 6  },
  { module: 'Inventory', critical: 1, high: 3, medium: 6,  low: 9  },
  { module: 'API',       critical: 3, high: 6, medium: 4,  low: 2  },
  { module: 'Mobile',    critical: 2, high: 4, medium: 9,  low: 7  },
  { module: 'Reports',   critical: 0, high: 2, medium: 5,  low: 11 },
]

export const kpiCards: KpiCard[] = [
  { label: 'Pass Rate',        value: '91%',   delta: '+4% vs last sprint', deltaPositive: true,  icon: '✅' },
  { label: 'Tests Automated',  value: '274',   delta: '+14 this sprint',    deltaPositive: true,  icon: '🤖' },
  { label: 'Open Bugs',        value: '7',     delta: '-3 vs last sprint',  deltaPositive: true,  icon: '🐛' },
  { label: 'Avg Response',     value: '290ms', delta: '-28ms vs last',      deltaPositive: true,  icon: '⚡' },
]

export const coverageByType = {
  labels: ['E2E', 'API', 'Unit', 'Mobile', 'Performance'],
  values: [68, 82, 91, 55, 40],
}
