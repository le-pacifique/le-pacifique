'use client'

import { endOfMonth, format, isWithinInterval, startOfMonth } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { theme } from '@/lib/theme'
import { resolveHref } from '@/sanity/lib/utils'
import type { ArticlePayload } from '@/types'

import BlogTitle from '../home/BlogTitle'
import Calendar from './Calendar'

export interface BlogPageProps {
  articles: ArticlePayload[]
  menuImage?: {
    image: string
    title?: string
  }
}

const BlogPage = ({ articles, menuImage }: BlogPageProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const bgColor = theme.colors.menu.Blog.background

  // Filter articles for current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const monthArticles = articles.filter((a) =>
    isWithinInterval(new Date(a.date), { start: monthStart, end: monthEnd }),
  )

  // Group by day
  const groupedArticles = monthArticles.reduce(
    (acc, article) => {
      const dateKey = format(new Date(article.date), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(article)
      return acc
    },
    {} as Record<string, ArticlePayload[]>,
  )

  // Handle month changes from calendar
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date)
  }

  return (
    <div
      className="h-[100svh] w-full relative flex flex-col md:flex-row"
      style={{ backgroundColor: bgColor }}
    >
      <svg className="hidden">
        <filter id="roughText">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </svg>

      <BlogTitle name="Blog" style={{ filter: 'url(#roughText)' }} />

      {/* Left: Calendar (50% on desktop) */}
      <div className="md:w-1/2 p-6 flex flex-col items-center justify-center mt-16">
        <Calendar
          events={articles}
          width="w-full max-w-3xl"
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* Right: Events list (50% on desktop, scrollable) */}
      <div className="md:w-1/2 h-full max-h-[100svh] overflow-y-auto p-6">
        <div className="mx-4 mt-52 md:mt-52 mb-8">
          {Object.keys(groupedArticles).length > 0 ? (
            Object.keys(groupedArticles)
              .sort()
              .map((date) => (
                <div key={date} className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-black border-b border-black/30 pb-2">
                    {format(new Date(date), 'EEEE, MMM d')}
                  </h3>
                  <ul className="space-y-6">
                    {groupedArticles[date].map((article) => {
                      const href = resolveHref(
                        article._type,
                        article.slug?.current,
                      )
                      return (
                        <li
                          key={article._id}
                          className="group border-l-4 pl-4"
                          style={{
                            borderColor: article.color || '#FFFFFF', // Use the article's color or a default color
                          }}
                        >
                          <Link
                            href={href || '#'}
                            className="block text-black hover:text-black transition-colors"
                          >
                            <h4 className="text-lg font-bold mb-2 group-hover:underline">
                              {article.title}
                            </h4>
                          </Link>
                          {article.previewText && (
                            <div className="mb-3 text-black/80 text-sm leading-relaxed">
                              {article.previewText}
                            </div>
                          )}
                          <Link
                            href={href || '#'}
                            className="inline-block px-3 py-1 bg-black/20 hover:bg-black text-black hover:text-black rounded text-sm transition-colors"
                          >
                            Read more
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))
          ) : (
            <div className="text-white text-center py-8">
              No events this month. Check other months or stay tuned for
              updates.
            </div>
          )}
        </div>
      </div>

      {/* Background image */}
      {menuImage?.image && (
        <div className="absolute inset-0 overflow-hidden mix-blend-difference bg-black pointer-events-none">
          <Image
            className="absolute right-[13vw] md:right-16 bottom-[-10%] w-[60vw] md:w-[30vw] -rotate-12"
            src={menuImage.image}
            alt={menuImage.title || 'Blog Background'}
            width={2500}
            height={2500}
          />
        </div>
      )}
    </div>
  )
}

export default BlogPage
