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
import Link from 'next/link'

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
    <div className="mb-3 flex items-center justify-between">
      <h2
        className="relative text-2xl font-black uppercase tracking-tight md:text-4xl"
        style={{ color: calendarTextColor }}
      >
        {format(currentMonth, 'MMMM yyyy')
          .split('')
          .map((letter, index) => (
            <span
              key={index}
              className="distort inline-block"
              style={{
                display: 'inline-block',
                transform: `rotate(${deterministicRange(-3, 3, currentMonth.toISOString(), index, 'rotate')}deg)`,
                position: 'relative',
                top: `${deterministicRange(-0.25, 0.25, currentMonth.toISOString(), index, 'top')}rem`,
                left: `${deterministicRange(-0.25, 0.25, currentMonth.toISOString(), index, 'left')}rem`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
      </h2>
      <div className="flex gap-1 text-lg md:text-2xl">
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
            className="calendar-grid-cell-distorted relative flex min-h-14 flex-col overflow-visible p-1 md:min-h-20 md:p-1.5"
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
                return (
                  <Link
                    key={event._id}
                    href={href || '#'}
                    className="calendar-event-link block px-1.5 py-1 text-[0.6rem] font-medium uppercase leading-none md:text-xs"
                    style={{
                      backgroundColor: calendarTextColor,
                      color: backgroundColor,
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
