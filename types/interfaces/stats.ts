

// Statistics interfaces
export interface PlatformStats {
  users: UserStats
  jobs: JobStats
  applications: ApplicationStats
  categories: CategoryStat[]
  locations: LocationStat[]
  revenue: RevenueStats
}

export interface UserStats {
  total: number
  jobSeekers: number
  recruiters: number
  admins: number
  newThisMonth: number
}

export interface JobStats {
  total: number
  active: number
  expired: number
  featured: number
  newThisMonth: number
}

export interface ApplicationStats {
  total: number
  pending: number
  reviewed: number
  interviewed: number
  hired: number
  newThisMonth: number
}

export interface CategoryStat {
  name: string
  count: number
}

export interface LocationStat {
  name: string
  count: number
}

export interface RevenueStats {
  total: number
  thisMonth: number
  lastMonth: number
  growth: number
}