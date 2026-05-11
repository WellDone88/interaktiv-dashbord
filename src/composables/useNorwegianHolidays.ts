import { computed } from 'vue'

interface Holiday {
  month: number // 0-11
  day: number
  name: string
  isFixed: boolean // true if always on same date, false if based on Easter
}

// Norwegian holidays
const norwegianHolidays: Holiday[] = [
  // Fixed holidays
  { month: 0, day: 1, name: 'Nyttårsdag', isFixed: true },
  { month: 4, day: 17, name: '17. mai', isFixed: true },
  { month: 11, day: 25, name: 'Julaften', isFixed: true },
  { month: 11, day: 26, name: '1. juledag', isFixed: true },
  { month: 11, day: 27, name: '2. juledag', isFixed: true },
  { month: 11, day: 31, name: 'Nyttårsaften', isFixed: true },
]

// Calculate Easter Sunday for a given year using Computus algorithm
const calculateEaster = (year: number): Date => {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return new Date(year, month - 1, day)
}

// Get all holidays for a given year
const getHolidaysForYear = (year: number): Map<string, string> => {
  const holidayMap = new Map<string, string>()

  // Add fixed holidays
  norwegianHolidays.forEach((holiday) => {
    const dateKey = `${year}-${String(holiday.month + 1).padStart(2, '0')}-${String(holiday.day).padStart(2, '0')}`
    holidayMap.set(dateKey, holiday.name)
  })

  // Add Easter-based holidays
  const easter = calculateEaster(year)
  const easterYear = easter.getFullYear()
  const easterMonth = easter.getMonth()
  const easterDay = easter.getDate()

  // Maundy Thursday (4 days before Easter)
  const maundyThursday = new Date(easterYear, easterMonth, easterDay - 3)
  holidayMap.set(
    `${maundyThursday.getFullYear()}-${String(maundyThursday.getMonth() + 1).padStart(2, '0')}-${String(maundyThursday.getDate()).padStart(2, '0')}`,
    'Skjærtorsdag',
  )

  // Good Friday (2 days before Easter)
  const goodFriday = new Date(easterYear, easterMonth, easterDay - 2)
  holidayMap.set(
    `${goodFriday.getFullYear()}-${String(goodFriday.getMonth() + 1).padStart(2, '0')}-${String(goodFriday.getDate()).padStart(2, '0')}`,
    'Langfredag',
  )

  // Easter Saturday (1 day before Easter)
  const easterSaturday = new Date(easterYear, easterMonth, easterDay - 1)
  holidayMap.set(
    `${easterSaturday.getFullYear()}-${String(easterSaturday.getMonth() + 1).padStart(2, '0')}-${String(easterSaturday.getDate()).padStart(2, '0')}`,
    'Påskesøndag (lørdag)',
  )

  // Easter Sunday
  holidayMap.set(
    `${easterYear}-${String(easterMonth + 1).padStart(2, '0')}-${String(easterDay).padStart(2, '0')}`,
    'Påskesøndag',
  )

  // Easter Monday (1 day after Easter)
  const easterMonday = new Date(easterYear, easterMonth, easterDay + 1)
  holidayMap.set(
    `${easterMonday.getFullYear()}-${String(easterMonday.getMonth() + 1).padStart(2, '0')}-${String(easterMonday.getDate()).padStart(2, '0')}`,
    'Annen påskedag',
  )

  // Ascension Day (39 days after Easter)
  const ascensionDay = new Date(easterYear, easterMonth, easterDay + 39)
  holidayMap.set(
    `${ascensionDay.getFullYear()}-${String(ascensionDay.getMonth() + 1).padStart(2, '0')}-${String(ascensionDay.getDate()).padStart(2, '0')}`,
    'Kristi himmelfartsdag',
  )

  // Whit Sunday (49 days after Easter)
  const whitSunday = new Date(easterYear, easterMonth, easterDay + 49)
  holidayMap.set(
    `${whitSunday.getFullYear()}-${String(whitSunday.getMonth() + 1).padStart(2, '0')}-${String(whitSunday.getDate()).padStart(2, '0')}`,
    'Pinsedag',
  )

  return holidayMap
}

export const useNorwegianHolidays = () => {
  const getHolidayName = (year: number, month: number, day: number): string | null => {
    const holidays = getHolidaysForYear(year)
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return holidays.get(dateKey) || null
  }

  const isHoliday = (year: number, month: number, day: number): boolean => {
    return getHolidayName(year, month, day) !== null
  }

  return {
    getHolidayName,
    isHoliday,
  }
}
