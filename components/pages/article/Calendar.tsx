'use client'

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

import { getArticleCategoryColor } from '@/lib/blogCategories'
import { deterministicRange } from '@/lib/deterministicRandom'
import { resolveHref } from '@/sanity/lib/utils'

interface CalendarProps {
  currentMonth: Date
  events: any[]
  width?: string
  color?: string
  backgroundColor?: string
  onMonthChange: (date: Date) => void
}

export default function Calendar({
  currentMonth,
  events,
  width = 'w-full',
  color,
  backgroundColor = 'transparent',
  onMonthChange,
}: CalendarProps) {
  const reducedMotion = useReducedMotion()
  const monthLabel = format(currentMonth, 'MMMM yyyy')
  const calendarTextColor = color ?? 'currentColor'
  const mutedTextColor = `color-mix(in srgb, ${calendarTextColor} 35%, transparent)`
  const gridBorderColor = `color-mix(in srgb, ${calendarTextColor} 55%, transparent)`

  const handleMonthChange = (offset: number) => {
    const newMonth = addMonths(currentMonth, offset)
    onMonthChange(newMonth)
  }

  const getEventsForDate = (date: Date) =>
    events.filter((event) => isSameDay(new Date(event.date), date))

  // Month navigation header
  const renderHeader = () => (
    <div className="relative mb-5 flex items-center justify-between">
      <div className="min-w-0 flex-1 [container-type:inline-size]">
        <h2
          className="relative whitespace-nowrap py-3 text-[clamp(3rem,21.5cqw,8rem)] font-normal uppercase leading-none tracking-[-0.09em]"
          style={{ color: calendarTextColor }}
          aria-live="polite"
        >
          <span className="sr-only">{monthLabel}</span>
          <span aria-hidden="true">
            {monthLabel.split('').map((letter, index) => {
              if (letter === ' ')
                return (
                  <span key={`${monthLabel}-${index}`} className="block h-3" />
                )
              const isYear = index > monthLabel.indexOf(' ')
              const rotate = deterministicRange(
                -6,
                6,
                monthLabel,
                index,
                'rotate',
              )
              const y =
                deterministicRange(-0.12, 0.12, monthLabel, index, 'top') +
                index * 0.012 -
                (isYear ? 0.38 : 0.18)
              return (
                <motion.span
                  key={`${monthLabel}-${index}`}
                  className="distort relative inline-block"
                  style={
                    isYear
                      ? {
                          marginLeft:
                            index === monthLabel.indexOf(' ') + 1
                              ? '2.4em'
                              : undefined,
                          letterSpacing: '0.025em',
                        }
                      : { left: '-0.25em' }
                  }
                  initial={false}
                  animate={
                    reducedMotion
                      ? { rotate, y: `${y}em` }
                      : {
                          rotate: [
                            rotate,
                            rotate +
                              deterministicRange(
                                -2,
                                2,
                                monthLabel,
                                index,
                                'drift',
                              ),
                          ],
                          y: [
                            `${y}em`,
                            `${y + deterministicRange(-0.08, 0.08, monthLabel, index, 'float')}em`,
                          ],
                        }
                  }
                  transition={{
                    duration: deterministicRange(
                      3,
                      5,
                      monthLabel,
                      index,
                      'duration',
                    ),
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              )
            })}
          </span>
        </h2>
      </div>
      <div className="absolute bottom-3 right-0 flex gap-1 text-lg md:text-2xl">
        <button
          onClick={() => handleMonthChange(-1)}
          className="distort px-2 py-1 md:px-3"
          style={{ color: calendarTextColor }}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <button
          onClick={() => handleMonthChange(1)}
          className="distort px-2 py-1 md:px-3"
          style={{ color: calendarTextColor }}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
    </div>
  )

  // Calendar grid cells
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    let day = startDate
    const rows: React.ReactNode[] = []
    while (day <= endDate) {
      const weekDays = Array.from({ length: 7 }).map(() => {
        const dayEvents = getEventsForDate(day)
        const isOutsideMonth = !isSameMonth(day, monthStart)

        const cell = (
          <div
            key={day.toString()}
            className="calendar-grid-cell-distorted relative flex min-h-10 flex-col overflow-visible p-1 sm:min-h-12 md:min-h-20 md:p-1.5"
          >
            <span
              className="distort mb-1 text-xs md:text-sm"
              style={{
                color: isOutsideMonth ? mutedTextColor : calendarTextColor,
              }}
            >
              {format(day, 'd')}
            </span>
            <div className="relative z-10 mt-auto flex flex-col items-start gap-1 overflow-visible">
              {dayEvents.slice(0, 2).map((event) => {
                const href = resolveHref(event._type, event.slug?.current)
                const categoryColor = getArticleCategoryColor(event)
                return (
                  <Link
                    key={event._id}
                    href={href || '#'}
                    className="calendar-event-link block px-1.5 py-1 text-[0.6rem] font-medium uppercase leading-none md:text-xs"
                    style={{
                      backgroundColor: categoryColor || calendarTextColor,
                      color: categoryColor
                        ? '#000000'
                        : `var(--site-theme-on-solid, ${backgroundColor})`,
                    }}
                  >
                    <span className="distort">{event.title}</span>
                  </Link>
                )
              })}
              {dayEvents.length > 2 && (
                <span
                  className="distort text-[0.6rem] leading-none"
                  style={{ color: calendarTextColor }}
                >
                  +{dayEvents.length - 2}
                </span>
              )}
            </div>
          </div>
        )

        day = addDays(day, 1)
        return cell
      })

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 overflow-visible">
          {weekDays}
        </div>,
      )
    }

    return (
      <div
        className="calendar-grid-distorted"
        style={
          {
            '--calendar-border-color': gridBorderColor,
          } as React.CSSProperties
        }
      >
        {rows}
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col ${width}`}
      style={{ color: calendarTextColor }}
    >
      {renderHeader()}
      {renderCells()}
    </div>
  )
}
