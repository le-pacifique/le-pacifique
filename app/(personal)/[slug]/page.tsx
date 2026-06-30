import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'
import { Suspense } from 'react'

import BlogPage from '@/components/pages/article/BlogPage'
import ArtistsPage from '@/components/pages/artist/ArtistsPage'
import CollectionsPage from '@/components/pages/collection/CollectionsPage'
import InfoPage from '@/components/pages/info/InfoPage'
import MerchPage from '@/components/pages/merch/MerchPage'
import { Page } from '@/components/pages/page/Page'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import {
  loadArticles,
  loadBlog,
  loadHomePage,
  loadInfo,
  loadMenu,
  loadPage,
  loadSettings,
} from '@/sanity/loader/loadQuery'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const { data: page } = await loadPage(slug)

  return {
    title: page?.title,
    description: page?.overview
      ? toPlainText(page.overview)
      : (await parent).description,
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('page')
}

export default async function PageSlugRoute({ params }: Props) {
  const { slug } = await params
  const [initial, homepage, settings, menu] = await Promise.all([
    loadPage(slug),
    loadHomePage(),
    loadSettings(),
    loadMenu(),
  ])
  const settingsTheme = settings.data.theme
  const menuSections = menu.data?.sections
  const menuImageFor = (section: 'blog' | 'merch' | 'info') => {
    const menuImage = menuSections?.[section]?.image
    return menuImage?.image
      ? { image: menuImage.image, title: menuImage.title }
      : homepage?.data?.menuImages?.[section]
  }

  // if (draftMode().isEnabled) {
  //   return <PagePreview params={params} initial={initial} />
  // }

  // Conditionally render the ArtistsPage component if the slug is 'artists'
  if (slug === 'artists') {
    if (!initial.data) {
      notFound()
    }

    return (
      <Suspense fallback={<p>Loading feed...</p>}>
        <ArtistsPage
          artists={initial.data.artists ?? []}
          pageTheme={initial.data}
          settingsTheme={settingsTheme}
        />
      </Suspense>
    )
  }

  // Conditionally render the CollectionsPage component if the slug is 'collections'
  if (slug === 'collections') {
    if (!initial.data) {
      notFound()
    }

    return (
      <CollectionsPage
        collections={initial.data.collections ?? []}
        pageTheme={initial.data}
        settingsTheme={settingsTheme}
      />
    )
  }

  // Conditionally render the BlogPage component if the slug is 'blog'
  if (slug === 'blog') {
    const [{ data: allArticles }, { data: blog }] = await Promise.all([
      loadArticles(),
      loadBlog(),
    ])
    const articles = initial.data?.articles?.length
      ? initial.data.articles
      : allArticles

    return (
      <BlogPage
        articles={articles ?? []}
        menuImage={menuImageFor('blog')}
        pageTheme={blog ?? initial.data ?? undefined}
        settingsTheme={settingsTheme}
      />
    )
  }

  // Conditionally render the MerchPage component if the slug is 'merch'
  if (slug === 'merch') {
    if (!initial.data) {
      notFound()
    }

    return (
      <MerchPage
        merch={initial.data.merch ?? []}
        menuImage={menuImageFor('merch')}
        pageTheme={initial.data}
        settingsTheme={settingsTheme}
      />
    )
  }

  // Conditionally render the InfoPage component if the slug is 'info'
  if (slug === 'info') {
    const { data: info } = await loadInfo()
    if (!info) {
      notFound()
    }
    return (
      <InfoPage
        info={info}
        menuImage={menuImageFor('info')}
        settingsTheme={settingsTheme}
      />
    )
  }

  if (!initial.data) {
    notFound()
  }

  return <Page data={initial.data} settingsTheme={settingsTheme} />
}
