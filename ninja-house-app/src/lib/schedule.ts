import { scheduleData } from '../data/schedule'
import type { ScheduleProgram } from '../data/schedule'
import { programsData } from '../data/programs'
import type { Program } from '../data/programs'

/**
 * Returns the program currently live (between 9:00 PM and 11:00 PM on its dayIndex)
 */
export function getCurrentProgram(mockDate?: Date): ScheduleProgram | null {
  const now = mockDate || new Date()
  const todayIndex = now.getDay() // 0=Sun, 1=Mon...6=Sat
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  const currentMinutes = currentHour * 60 + currentMin

  const showStartMinutes = 21 * 60  // 9PM
  const showEndMinutes = 23 * 60    // 11PM

  const todayProgram = scheduleData.find((p) => p.dayIndex === todayIndex)
  if (todayProgram) {
    if (currentMinutes >= showStartMinutes && currentMinutes < showEndMinutes) {
      return todayProgram
    }
  }
  return null
}

/**
 * Returns the upcoming live show.
 * If today's show hasn't started yet, returns today's show.
 * Otherwise, returns the chronologically next show in the week.
 */
export function getNextProgram(mockDate?: Date): ScheduleProgram {
  const now = mockDate || new Date()
  const todayIndex = now.getDay()
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  const currentMinutes = currentHour * 60 + currentMin
  const showEndMinutes = 23 * 60

  // Sort shows by weekly order Mon(1) ... Fri(5), Sat(6), Sun(0)
  const getOrder = (day: number) => (day === 0 ? 7 : day)
  
  // Sort scheduleData by weekly order
  const sortedShows = [...scheduleData].sort((a, b) => getOrder(a.dayIndex) - getOrder(b.dayIndex))

  // Find if there is a show today and if it is not finished yet
  const todayShow = sortedShows.find((p) => p.dayIndex === todayIndex)
  if (todayShow && currentMinutes < showEndMinutes) {
    return todayShow
  }

  // Otherwise, find the next show in order
  const todayOrder = getOrder(todayIndex)
  const nextShow = sortedShows.find((p) => getOrder(p.dayIndex) > todayOrder)

  if (nextShow) {
    return nextShow
  }

  // If no shows later in the week, wrap around to the first show (Monday)
  return sortedShows[0]
}

/**
 * Get full program specifications by slug from programsData
 */
export function getProgramBySlug(slug: string): Program | undefined {
  return programsData.find((p) => p.slug === slug)
}

/**
 * Get list of programs by day index
 */
export function getProgramsByDay(dayIndex: number): Program[] {
  return programsData.filter((p) => p.dayIndex === dayIndex)
}
