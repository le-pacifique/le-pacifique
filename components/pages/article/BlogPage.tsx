'use client'

import { endOfMonth, format, isWithinInterval, startOfMonth } from 'date-fns'
import Link from 'next/link'
import { toPlainText } from 'next-sanity'
import { useState } from 'react'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  colorToHex,
  getResolvedPageTheme,
  type SettingsTheme,
} from '@/lib/theme'
import { resolveHref } from '@/sanity/lib/utils'
import type { ArticlePayload, PageThemePayload } from '@/types'

import BlogTitle from '../home/BlogTitle'
import Calendar from './Calendar'

export interface BlogPageProps {
  articles: ArticlePayload[]
  menuImage?: {
    image: string
    title?: string
  }
  pageTheme?: PageThemePayload
  settingsTheme?: SettingsTheme
}

function getArticleDate(article: ArticlePayload) {
  const date = article.date ? new Date(article.date) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

function getInitialMonth(articles: ArticlePayload[]) {
  const dates = articles
    .map(getArticleDate)
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())

  return dates[0] ?? new Date()
}

function getArticlePreview(article: ArticlePayload) {
  if (article.previewText) return article.previewText
  if (typeof article.excerpt === 'string') return article.excerpt
  if (Array.isArray(article.excerpt)) return toPlainText(article.excerpt)
  return undefined
}

const BlogPage = ({
  articles,
  menuImage,
  pageTheme: pageThemeOverride,
  settingsTheme,
}: BlogPageProps) => {
  const [currentMonth, setCurrentMonth] = useState(() =>
    getInitialMonth(articles),
  )
  const pageTheme = getResolvedPageTheme({
    backgroundColor: pageThemeOverride?.backgroundColor,
    textColor: pageThemeOverride?.textColor,
    noteDrawing: pageThemeOverride?.noteDrawing,
    section: 'blog',
    settingsTheme,
  })
  const drawing = pageTheme.noteDrawing ?? menuImage
  const datedArticles = articles
    .filter((article) => getArticleDate(article))
    .sort(
      (a, b) =>
        (getArticleDate(b)?.getTime() ?? 0) -
        (getArticleDate(a)?.getTime() ?? 0),
    )

  // Filter articles for current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const monthArticles = datedArticles.filter((article) => {
    const date = getArticleDate(article)
    return date
      ? isWithinInterval(date, { start: monthStart, end: monthEnd })
      : false
  })

  // Group by day
  const groupedArticles = monthArticles.reduce(
    (acc, article) => {
      const date = getArticleDate(article)
      if (!date) return acc

      const dateKey = format(date, 'yyyy-MM-dd')
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
      className="relative min-h-svh w-full overflow-x-hidden px-5 pb-20 pt-24 md:px-10 md:py-24 lg:px-16"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        color: pageTheme.textColor,
      }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      <BlogTitle name="Blog" color={pageTheme.textColor} distort />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-[88rem] grid-cols-1 gap-10 md:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1fr)] md:items-center">
        <section className="flex justify-center md:justify-start">
          <Calendar
            currentMonth={currentMonth}
            events={datedArticles}
            width="w-full max-w-xl"
            color={pageTheme.textColor}
            backgroundColor={pageTheme.backgroundColor}
            onMonthChange={handleMonthChange}
          />
        </section>

        <section className="w-full md:ml-auto">
          {Object.keys(groupedArticles).length > 0 ? (
            <div className="distort-text space-y-8">
              {Object.keys(groupedArticles)
                .sort()
                .map((date) => (
                  <div key={date}>
                    <h3
                      className="mb-3 border-b pb-2 text-lg font-semibold md:text-xl"
                      style={{ borderColor: pageTheme.textColor }}
                    >
                      {format(new Date(date), 'EEEE, MMM d')}
                    </h3>
                    <ul className="space-y-6">
                      {groupedArticles[date].map((article) => {
                        const href = resolveHref(
                          article._type,
                          article.slug?.current,
                        )
                        const preview = getArticlePreview(article)

                        return (
                          <li
                            key={article._id}
                            className="group border-l-4 pl-4"
                            style={{
                              borderColor:
                                article.color ||
                                colorToHex(article.backgroundColor) ||
                                '#FFFFFF',
                            }}
                          >
                            <Link
                              href={href || '#'}
                              className="block transition-opacity hover:opacity-70"
                            >
                              <h4 className="mb-2 text-lg font-bold group-hover:underline md:text-2xl">
                                {article.title}
                              </h4>
                            </Link>
                            {preview && (
                              <div className="mb-3 max-w-2xl text-sm leading-snug opacity-80 md:text-base">
                                {preview}
                              </div>
                            )}
                            <Link
                              href={href || '#'}
                              className="inline-block px-3 py-1 text-sm uppercase transition-opacity hover:opacity-80"
                              style={{
                                backgroundColor: pageTheme.textColor,
                                color: pageTheme.backgroundColor,
                              }}
                            >
                              READ MORE
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
            </div>
          ) : (
            <div className="distort py-8 text-center">
              No articles this month.
            </div>
          )}
        </section>
      </div>

      {/* Note drawing */}
      {drawing?.image && (
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${drawing.image})` }}
          aria-label={drawing.title || 'Blog background drawing'}
        />
      )}
    </div>
  )
}

export default BlogPage
