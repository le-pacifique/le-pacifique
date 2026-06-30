import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import ArticlePage from '@/components/pages/article/ArticlePage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadArticle, loadBlog, loadSettings } from '@/sanity/loader/loadQuery'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const { data: article } = await loadArticle(slug)
  const ogImage = article?.coverImage?.asset?._ref
    ? urlForOpenGraphImage({ _ref: article.coverImage.asset._ref })
    : null
  const description = Array.isArray(article?.excerpt)
    ? toPlainText(article.excerpt)
    : article?.excerpt

  return {
    title: article?.title,
    description: description || (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('article')
}

export default async function ArticleSlugRoute({ params }: Props) {
  const { slug } = await params
  const [initial, settings, blog] = await Promise.all([
    loadArticle(slug),
    loadSettings(),
    loadBlog(),
  ])

  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return (
    <ArticlePage
      data={initial.data}
      blogTheme={blog.data}
      settingsTheme={settings.data.theme}
    />
  )
}
