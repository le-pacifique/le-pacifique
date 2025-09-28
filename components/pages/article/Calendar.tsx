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
import { useState } from 'react'

import { resolveHref } from '@/sanity/lib/utils'

import ArtistTitle from '../artist/ArtistTitle'
import MonthTitle from './MonthTitle'

interface CalendarProps {
  events: any[]
  width?: string
  onMonthChange?: (date: Date) => void
}

export default function Calendar({
  events,
  width = 'w-full',
  onMonthChange,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleMonthChange = (offset: number) => {
    const newMonth = addMonths(currentMonth, offset)
    setCurrentMonth(newMonth)
    if (onMonthChange) onMonthChange(newMonth)
  }

  const getEventForDate = (date: Date) =>
    events.find((event) => isSameDay(new Date(event.date), date))

  // Month navigation header
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl md:text-5xl uppercase tracking-tight text-[#F6AB65] relative font-black">
        {format(currentMonth, 'MMMM yyyy')
          .split('') // Split the string into individual letters
          .map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{
                display: 'inline-block',
                transform: `rotate(${Math.random() * 6 - 3}deg)`, // Random rotation between -3 and 3 degrees
                position: 'relative',
                top: `${Math.random() * 0.5 - 0.25}rem`, // Random vertical position between -0.25rem and 0.25rem
                left: `${Math.random() * 0.5 - 0.25}rem`, // Random horizontal position between -0.25rem and 0.25rem
              }}
            >
              {letter === ' ' ? '\u00A0' : letter} {/* Preserve spaces */}
            </span>
          ))}
      </h2>
      {/* <MonthTitle
        name={format(currentMonth, 'MMMM yyyy')}
        fontSize="6xl"
        position={{
          baseTop: 18,
          baseLeft: 5,
          wordTopOffset: 5,
          wordLeftOffset: 15,
        }}
        spacing={{
          topIncrement: 0.4,
          leftIncrement: 2,
        }}
        rotation={{
          min: -1, // Even less inclined
          max: 1,
        }}
        color="#F1FB84"

      /> */}
      <div className="flex gap-2 text-lg md:text-2xl">
        <button
          onClick={() => handleMonthChange(-1)}
          className="text-black px-3 py-1 md:px-4 md:py-2"
        >
          &lt;
        </button>
        <button
          onClick={() => handleMonthChange(1)}
          className="text-black px-3 py-1 md:px-4 md:py-2"
        >
          &gt;
        </button>
      </div>
    </div>
  )

  // Days of week header
  const renderDays = () => {
    const startDate = startOfWeek(currentMonth)
    return (
      <div className="grid grid-cols-7 text-black border-b">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="text-center py-2 font-medium uppercase text-xs md:text-sm text-gray-700"
          >
            {format(addDays(startDate, i), 'EEE')}
          </div>
        ))}
      </div>
    )
  }

  const renderLegend = () => {
    // Get unique categories and their colors
    const categories = unique(
      events.map((event) => ({
        category: event.category || 'General',
        color: event.color || '#a855f7',
      })),
      'category',
    )

    return (
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {/* {categories.map((item) => (
          <div key={item.category} className="flex items-center">
            <span
              className="w-3 h-3 inline-block rounded-0 mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-sm text-white">{item.category}</span>
          </div>
        ))} */}
        <div className="flex items-center">
          <span
            className="w-3 h-3 inline-block rounded-0 mr-2"
            style={{ backgroundColor: '#F1FB84' }}
          ></span>
          <span className="text-sm text-white">Artists</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-3 h-3 inline-block rounded-0 mr-2"
            style={{ backgroundColor: '#F6AB65' }}
          ></span>
          <span className="text-sm text-white">Collections</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-3 h-3 inline-block rounded-0 mr-2"
            style={{ backgroundColor: '#EED5F4' }}
          ></span>
          <span className="text-sm text-white">Blog</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-3 h-3 inline-block rounded-0 mr-2"
            style={{ backgroundColor: '#C6F042' }}
          ></span>
          <span className="text-sm text-white">Artists</span>
        </div>
      </div>
    )
  }

  // Calendar grid cells
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    let day = startDate
    const rows: React.ReactNode[] = []
    while (day <= endDate) {
      const weekDays = Array.from({ length: 7 }).map(() => {
        const event = getEventForDate(day)
        const href = event ? resolveHref(event._type, event.slug.current) : null
        const isOutsideMonth = !isSameMonth(day, monthStart)

        const cell = (
          <div
            key={day.toString()}
            className={`min-h-[80px] md:min-h-[120px] border border-white p-1 md:p-2 flex flex-col relative ${
              isOutsideMonth ? 'text-gray-300' : ''
            }`}
          >
            <span className="text-lg md:text-2xl text-white mb-1">
              {format(day, 'd')}
            </span>
            {event && (
              <Link
                href={href || '#'}
                className="mt-auto inline-block px-2 py-1 text-xs md:text-sm font-medium uppercase -rotate-3 text-black"
                style={{
                  backgroundColor: event.color || '#a855f7',
                }}
              >
                {event.title}
              </Link>
            )}
          </div>
        )

        day = addDays(day, 1)
        return cell
      })

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {weekDays}
        </div>,
      )
    }

    return <div>{rows}</div>
  }

  return (
    <div className={`flex flex-col ${width}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderLegend()}
    </div>
  )
}

export function unique<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set()
  return arr.filter((item) => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}
