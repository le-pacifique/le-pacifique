'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ArticlePayload } from '@/types'
import { resolveHref } from '@/sanity/lib/utils'
import CollectionTitle from '../collection/CollectionTitle'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns'

export interface BlogPageProps {
  articles: ArticlePayload[]
}

const BlogPage = ({ articles }: BlogPageProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleMonthChange = (offset: number) => {
    setCurrentMonth(addMonths(currentMonth, offset))
  }

  const getArticleForDate = (date: Date) =>
    articles.find((article) => isSameDay(new Date(article.date), date))

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy'
    return (
      <div className="flex justify-between items-center mb-6 w-[40vw]">
        <h2 className="text-5xl uppercase font-bold">
          {format(currentMonth, dateFormat)}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleMonthChange(-1)}
            className="px-3 py-1 bg-black text-white hover:bg-gray-300"
          >
            &lt;
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            className="px-3 py-1 bg-black text-white hover:bg-gray-300"
          >
            &gt;
          </button>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    const startDate = startOfWeek(currentMonth)
    const dateFormat = 'EEEE'

    return (
      <div className="grid grid-cols-7 gap-1 w-[40vw] bg-black text-white">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="text-center text-base font-medium uppercase">
            {format(addDays(startDate, i), dateFormat).substring(0, 3)}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = 'd'
    let day = startDate

    const rows: JSX.Element[] = []

    while (day <= endDate) {
      const weekDays = Array.from({ length: 7 }).map(() => {
        const article = getArticleForDate(day)
        const href = article
          ? resolveHref(article._type, article.slug.current)
          : null
        const isOutsideMonth = !isSameMonth(day, monthStart)

        const cell = (
          <div
            key={day.toString()}
            className={`p-3 border-red-600 border m-1 font-bold text-center text-4xl ${
              isOutsideMonth ? 'text-black/10' : 'text-black'
            } ${article ? 'bg-white shadow-md border-none hover:bg-white/75' : ''}`}
          >
            {href ? (
              <Link href={href} className="font-medium">
                {format(day, dateFormat)}
              </Link>
            ) : (
              format(day, dateFormat)
            )}
          </div>
        )

        day = addDays(day, 1)
        return cell
      })

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 w-[40vw]">
          {weekDays}
        </div>,
      )
    }

    return <div className="mt-4">{rows}</div>
  }

  return (
    <div className="h-full w-full p-6 bg-red-500">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <CollectionTitle name="Blog" />
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  )
}

export default BlogPage
