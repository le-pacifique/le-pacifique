'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toPlainText } from 'next-sanity'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  getArticleCategoryColor,
  getBlogCategories,
  getBlogCategoryKey,
} from '@/lib/blogCategories'
import { deterministicRange } from '@/lib/deterministicRandom'
import { resolveHref } from '@/sanity/lib/utils'
import type { ArticlePayload } from '@/types'

interface BlogArticleListProps {
  initialCategory?: string
  accentColor: string
  articles: ArticlePayload[]
  contrastColor: string
}

const getArticlePreview = (article: ArticlePayload) => {
  if (article.previewText) return article.previewText
  if (typeof article.excerpt === 'string') return article.excerpt
  if (Array.isArray(article.excerpt)) return toPlainText(article.excerpt)
  return undefined
}

export default function BlogArticleList({
  initialCategory = 'all',
  accentColor,
  articles,
  contrastColor,
}: BlogArticleListProps) {
  const router = useRouter()
  const categories = useMemo(() => getBlogCategories(articles), [articles])
  const [activeCategory, setActiveCategory] = useState(() =>
    categories.some(
      (category) => getBlogCategoryKey(category) === initialCategory,
    )
      ? initialCategory
      : 'all',
  )
  const [showTopFade, setShowTopFade] = useState(false)
  const [showBottomFade, setShowBottomFade] = useState(false)
  const scrollPanelRef = useRef<HTMLDivElement>(null)

  const filteredArticles = useMemo(
    () =>
      activeCategory === 'all'
        ? articles
        : articles.filter((article) =>
            article.categories?.some(
              (category) => getBlogCategoryKey(category) === activeCategory,
            ),
          ),
    [activeCategory, articles],
  )

  const groupedArticles = useMemo(
    () =>
      filteredArticles.reduce(
        (groups, article) => {
          const date = article.date ? new Date(article.date) : null
          const dateKey =
            date && !Number.isNaN(date.getTime())
              ? format(date, 'yyyy-MM-dd')
              : 'undated'

          if (!groups[dateKey]) groups[dateKey] = []
          groups[dateKey].push(article)
          return groups
        },
        {} as Record<string, ArticlePayload[]>,
      ),
    [filteredArticles],
  )

  const updateScrollFades = useCallback(() => {
    const panel = scrollPanelRef.current
    if (!panel) return

    const hasOverflow = panel.scrollHeight > panel.clientHeight + 1
    setShowTopFade(hasOverflow && panel.scrollTop > 2)
    setShowBottomFade(
      hasOverflow &&
        panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2,
    )
  }, [])

  useEffect(() => {
    const panel = scrollPanelRef.current
    if (!panel) return

    panel.scrollTop = 0
    const frame = requestAnimationFrame(updateScrollFades)
    const resizeObserver = new ResizeObserver(updateScrollFades)

    resizeObserver.observe(panel)
    if (panel.firstElementChild) {
      resizeObserver.observe(panel.firstElementChild)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [activeCategory, updateScrollFades])

  const scrollMask = (() => {
    if (showTopFade && showBottomFade) {
      return 'linear-gradient(to bottom, transparent 0, black 2rem, black calc(100% - 2rem), transparent 100%)'
    }
    if (showTopFade) {
      return 'linear-gradient(to bottom, transparent 0, black 2rem, black 100%)'
    }
    if (showBottomFade) {
      return 'linear-gradient(to bottom, black 0, black calc(100% - 2rem), transparent 100%)'
    }
    return undefined
  })()

  const filterOptions = [
    { color: accentColor, key: 'all', title: 'All' },
    ...categories.map((category) => ({
      color: category.color?.hex || accentColor,
      key: getBlogCategoryKey(category),
      title: category.title,
    })),
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        aria-label="Blog categories"
        className="mb-4 flex shrink-0 flex-wrap gap-x-3 gap-y-4 py-2"
        role="tablist"
      >
        {filterOptions.map((category, index) => {
          const active = activeCategory === category.key
          const rotate =
            deterministicRange(4, 8, 'blog-category', category.key, 'rotate') *
            (index % 2 === 0 ? 1 : -1)
          const top = deterministicRange(
            -4,
            4,
            'blog-category',
            category.key,
            'top',
          )

          return (
            <button
              aria-controls="blog-article-panel"
              aria-selected={active}
              className="relative px-2 py-0 text-sm font-medium uppercase tracking-tight hover:animate-wiggle md:text-xl"
              id={`blog-category-${category.key}`}
              key={category.key}
              onClick={() => {
                setActiveCategory(category.key)
                router.push(
                  category.key === 'all'
                    ? '/blog'
                    : `/blog?category=${encodeURIComponent(category.key)}`,
                  { scroll: false },
                )
              }}
              role="tab"
              style={{
                top,
                transform: `rotate(${rotate}deg)`,
                ['--initial-rotate' as string]: `${rotate}deg`,
                backgroundColor: active ? contrastColor : category.color,
                color: active ? category.color : contrastColor,
              }}
              type="button"
            >
              {category.title}
            </button>
          )
        })}
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          aria-labelledby={`blog-category-${activeCategory}`}
          className="artist-section-scrollbar h-full overflow-y-auto pr-4"
          id="blog-article-panel"
          onScroll={updateScrollFades}
          ref={scrollPanelRef}
          role="tabpanel"
          style={{ maskImage: scrollMask, WebkitMaskImage: scrollMask }}
        >
          {filteredArticles.length ? (
            <div className="distort-text space-y-7 pb-4">
              {Object.keys(groupedArticles)
                .sort((a, b) => b.localeCompare(a))
                .map((date) => (
                  <div key={date}>
                    <h2 className="mb-3 pb-2 text-sm font-semibold md:text-xl">
                      {date === 'undated'
                        ? 'Undated'
                        : format(new Date(`${date}T12:00:00`), 'EEEE, MMM d')}
                    </h2>
                    <ul className="space-y-6">
                      {groupedArticles[date].map((article) => {
                        const href = resolveHref(
                          article._type,
                          article.slug?.current,
                        )
                        const preview = getArticlePreview(article)

                        return (
                          <li
                            className="blog-article-card group p-4"
                            key={article._id}
                            style={{
                              backgroundColor: '#ffffcb',
                              color: '#000000',
                              ['--blog-card-accent' as string]:
                                getArticleCategoryColor(article) || accentColor,
                            }}
                          >
                            <Link className="block" href={href || '#'}>
                              <h3 className="mb-1 text-lg font-bold group-hover:underline md:text-2xl">
                                {article.title}
                              </h3>
                            </Link>
                            {article.categories?.length ? (
                              <div className="mb-2 text-xs font-medium uppercase opacity-60 md:text-sm">
                                {article.categories
                                  .map((category) => category.title)
                                  .join(' / ')}
                              </div>
                            ) : null}
                            {preview ? (
                              <p className="mb-3 max-w-2xl text-sm leading-snug opacity-80 md:text-base">
                                {preview}
                              </p>
                            ) : null}
                            <Link
                              className="article-read-more inline-block px-3 py-1 text-sm uppercase transition-opacity hover:opacity-75"
                              href={href || '#'}
                              style={{
                                backgroundColor: '#000000',
                                color: '#ffffcb',
                              }}
                            >
                              Read more
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
            </div>
          ) : (
            <p className="distort py-8 text-sm uppercase opacity-60 md:text-xl">
              No articles in this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
