'use client'

import { useState } from 'react'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  getSectionTheme,
  type SettingsTheme,
} from '@/lib/theme'
import type { ArticlePayload, BlogPayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import BlogArticleList from './BlogArticleList'
import Calendar from './Calendar'

export interface BlogPageProps {
  articles: ArticlePayload[]
  category?: string
  menuImage?: {
    image: string
    title?: string
  }
  pageTheme?: Partial<BlogPayload>
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

const BlogPage = ({
  articles,
  category = 'all',
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
  const sortedArticles = [...articles].sort(
    (a, b) =>
      (getArticleDate(b)?.getTime() ?? 0) - (getArticleDate(a)?.getTime() ?? 0),
  )
  const datedArticles = sortedArticles.filter((article) =>
    getArticleDate(article),
  )
  const sectionTheme = getSectionTheme(settingsTheme, 'blog')
  const pageTitle = pageThemeOverride?.title?.trim()
  const titleColor = pageThemeOverride?.titleColor?.hex || pageTheme.textColor
  const categoryButtonColor =
    pageThemeOverride?.categoryButtonColor?.hex || sectionTheme.backgroundColor
  const categoryButtonContrastColor =
    pageThemeOverride?.categoryButtonContrastColor?.hex || '#000000'
  const areArticlesLeft = pageThemeOverride?.layout === 'left'

  return (
    <div
      className="blog-page relative h-svh w-full overflow-hidden"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        color: pageTheme.textColor,
      }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />

      {drawing?.image ? (
        <div
          aria-label={drawing.title || 'Blog background drawing'}
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${drawing.image})` }}
        />
      ) : null}

      {pageTitle && (
        <div className="pointer-events-none absolute inset-0 z-20 mx-auto px-4 lg:px-12 xl:px-24 2xl:px-48">
          <div className="mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div
              className={`min-w-0 ${areArticlesLeft ? 'lg:col-start-1' : 'lg:col-start-2'}`}
              data-testid="blog-title-column"
            >
              <AnimatedArtistTitle
                blendMode={false}
                color={titleColor}
                distort
                fitToColumn
                name={pageTitle}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto h-full px-4 tracking-tight lg:px-12 xl:px-24 2xl:px-48">
        <div className="mx-auto grid h-full max-w-2xl grid-cols-1 grid-rows-[46svh_minmax(0,1fr)] gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:grid-rows-1">
          <section
            className={`flex min-h-0 items-center justify-center pt-[15svh] lg:h-full lg:pt-0 ${
              areArticlesLeft ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
            }`}
          >
            <Calendar
              backgroundColor={pageTheme.backgroundColor}
              color={pageTheme.textColor}
              currentMonth={currentMonth}
              events={datedArticles}
              onMonthChange={setCurrentMonth}
              width="w-full max-w-xl"
            />
          </section>

          <section
            className={`min-h-0 pb-8 lg:h-full lg:pb-[6vh] lg:pt-[34vh] ${
              areArticlesLeft ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
            }`}
            data-testid="blog-articles-column"
          >
            <BlogArticleList
              key={category}
              initialCategory={category}
              accentColor={categoryButtonColor}
              articles={sortedArticles}
              contrastColor={categoryButtonContrastColor}
              pageBackgroundColor={pageTheme.backgroundColor}
              textColor={pageTheme.textColor}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
