import { format } from 'date-fns'
import type { PortableTextBlock } from 'next-sanity'

import { AnimatedInlineText } from '@/components/shared/AnimatedInlineText'
import { CustomPortableText } from '@/components/shared/CustomPortableText'
import ImageBox from '@/components/shared/ImageBox'
import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { getResolvedPageTheme, type SettingsTheme } from '@/lib/theme'
import type { ArticlePayload, PageThemePayload } from '@/types'

export interface ArticlePageProps {
  data: ArticlePayload
  blogTheme?: PageThemePayload | null
  settingsTheme?: SettingsTheme
}

const ArticlePage = ({ data, blogTheme, settingsTheme }: ArticlePageProps) => {
  const article = data
  const pageTheme = getResolvedPageTheme({
    backgroundColor: article.backgroundColor ?? blogTheme?.backgroundColor,
    textColor: blogTheme?.textColor,
    noteDrawing: article.noteDrawing ?? blogTheme?.noteDrawing,
    section: 'blog',
    settingsTheme,
  })
  const date = article.date ? new Date(article.date) : null
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, 'MMMM d, yyyy') : null
  const excerpt =
    typeof article.excerpt === 'string' ? article.excerpt : undefined

  return (
    <div
      className="relative min-h-svh w-full overflow-x-hidden px-5 pb-24 pt-28 md:px-10 md:pb-28 md:pt-32 lg:px-16"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        color: pageTheme.textColor,
      }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      {pageTheme.noteDrawing?.image && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      )}

      <article className="distort-text relative z-10 mx-auto max-w-5xl tracking-tight">
        {formattedDate && (
          <p className="mb-3 text-sm uppercase leading-none md:text-base">
            {formattedDate}
          </p>
        )}

        <AnimatedInlineText
          as="h1"
          className="max-w-6xl text-6xl font-black leading-none md:text-9xl lg:text-[10rem]"
          text={article.title}
        />

        {excerpt && (
          <p className="mt-6 max-w-3xl text-lg leading-snug md:text-2xl">
            {excerpt}
          </p>
        )}

        {article.coverImage?.asset && (
          <div className="mt-8 max-w-4xl">
            <ImageBox
              image={article.coverImage}
              alt={article.coverImage.alt || article.title}
              classesWrapper="relative aspect-[4/3] md:aspect-[16/9] rounded-none bg-transparent"
            />
            {article.coverImage.caption && (
              <p className="mt-2 text-xs leading-tight md:text-sm">
                {article.coverImage.caption}
              </p>
            )}
          </div>
        )}

        {article.content && article.content.length > 0 && (
          <div className="mt-10 max-w-4xl text-base leading-snug md:text-xl">
            <CustomPortableText
              paragraphClasses="mb-5"
              value={article.content as PortableTextBlock[]}
            />
          </div>
        )}
      </article>
    </div>
  )
}

export default ArticlePage
