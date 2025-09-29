import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'
import { Suspense } from 'react'

import BlogPage from '@/components/pages/article/BlogPage'
import ArtistsPage from '@/components/pages/artist/ArtistsPage'
import CollectionsPage from '@/components/pages/collection/CollectionsPage'
import MerchPage from '@/components/pages/merch/MerchPage'
import { Page } from '@/components/pages/page/Page'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadHomePage, loadInfo, loadPage } from '@/sanity/loader/loadQuery'
const PagePreview = dynamic(() => import('@/components/pages/page/PagePreview'))

import { theme } from '@/lib/theme'
import { ArticlePayload } from '@/types'
import InfoPage from '@/components/pages/info/InfoPage'
type Props = {
  params: { slug: string }
}

const mockArticles: ArticlePayload[] = [
  {
    _id: '1',
    _type: 'article',
    slug: { current: 'new-release-announcement' },
    title: 'New Release: Ambient Excursions Vol. 3',
    date: '2025-09-11',
    color: theme.colors.menu.Artists.background,
    previewText:
      'Le Pacifique is thrilled to announce our latest compilation album featuring ambient works from our roster of experimental artists. The third in our acclaimed series explores...',
    content: [
      {
        _type: 'block',
        children: [{ text: 'Full article content goes here.' }],
      },
    ],
  },
  {
    _id: '2',
    _type: 'article',
    slug: { current: 'live-sessions' },
    title: 'Le Pacifique Live Sessions',
    date: '2025-09-10',
    color: theme.colors.menu.Collections.background,
    previewText:
      'Join us at our Brussels studio for an intimate evening of live performances from our label artists. Limited capacity, tickets available now through our website...',
    content: [
      {
        _type: 'block',
        children: [{ text: 'Full article content goes here.' }],
      },
    ],
  },

  {
    _id: '3',
    _type: 'article',
    slug: { current: 'artist-interview' },
    title: 'Artist Interview: Sound Explorations',
    date: '2025-09-13',
    color: theme.colors.menu.Blog.background,
    previewText: `We sat down with our newest signing to discuss their approach to field recordings and how Brussels' urban landscape influences their work. A fascinating look into the creative process...`,
    content: [
      {
        _type: 'block',
        children: [{ text: 'Full article content goes here.' }],
      },
    ],
  },
  {
    _id: '4',
    _type: 'article',
    slug: { current: 'studio-expansion' },
    title: 'Studio Expansion & Residency Program',
    date: '2025-09-21',
    color: theme.colors.menu.Merch.background,
    previewText:
      'Le Pacifique is expanding our studio space to include a dedicated area for our new artist residency program. Applications open next month for experimental musicians...',
    content: [
      {
        _type: 'block',
        children: [{ text: 'Full article content goes here.' }],
      },
    ],
  },
  {
    _id: '5',
    _type: 'article',
    slug: { current: 'listening-party' },
    title: 'Vinyl Listening Party',
    date: '2025-09-29',
    color: '#F6AB65', // or any extra
    previewText:
      'Join us for a special listening session featuring our latest vinyl releases on our custom sound system. Free entry, refreshments provided. RSVP required...',
    content: [
      {
        _type: 'block',
        children: [{ text: 'Full article content goes here.' }],
      },
    ],
  },
]

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: page } = await loadPage(params.slug)

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
  const initial = await loadPage(params.slug)
  const homepage = await loadHomePage()

  // if (draftMode().isEnabled) {
  //   return <PagePreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  // Conditionally render the ArtistsPage component if the slug is 'artists'
  if (params.slug === 'artists') {
    return (
      <Suspense fallback={<p>Loading feed...</p>}>
        <ArtistsPage artists={initial.data.artists ?? []} />
      </Suspense>
    )
  }

  // Conditionally render the CollectionsPage component if the slug is 'collections'
  if (params.slug === 'collections') {
    return <CollectionsPage collections={initial.data.collections ?? []} />
  }

  // Conditionally render the BlogPage component if the slug is 'blog'
  if (params.slug === 'blog') {
    return (
      <BlogPage
        // articles={initial.data.articles ?? []}
        articles={mockArticles}
        menuImage={homepage?.data?.menuImages?.blog}
      />
    )
  }

  // Conditionally render the MerchPage component if the slug is 'merch'
  if (params.slug === 'merch') {
    return (
      <MerchPage
        merch={initial.data.merch ?? []}
        menuImage={homepage?.data?.menuImages?.merch}
      />
    )
  }

  // Conditionally render the InfoPage component if the slug is 'info'
  if (params.slug === 'info') {
    const { data: info } = await loadInfo()
    if (!info) {
      notFound()
    }
    return <InfoPage info={info} menuImage={homepage?.data?.menuImages?.info} />
  }

  if (params.slug === 'blog') {
    return (
      <BlogPage
        // articles={initial.data.articles ?? []}
        articles={mockArticles}
        menuImage={homepage?.data?.menuImages?.blog}
      />
    )
  }

  return <Page data={initial.data} />
}
