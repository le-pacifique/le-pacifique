import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'
import { Suspense } from 'react'

import ArtistsPage from '@/components/pages/artist/ArtistsPage'
import CollectionsPage from '@/components/pages/collection/CollectionsPage'
import { Page } from '@/components/pages/page/Page'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadPage } from '@/sanity/loader/loadQuery'
import BlogPage from '@/components/pages/article/BlogPage'
import MerchPage from '@/components/pages/merch/MerchPage'
const PagePreview = dynamic(() => import('@/components/pages/page/PagePreview'))

type Props = {
  params: { slug: string }
}

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

  // if (draftMode().isEnabled) {
  //   return <PagePreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }
  console.log(initial.data, 'initial.data')

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
    return <BlogPage articles={initial.data.articles ?? []} />
  }

  // Conditionally render the MerchPage component if the slug is 'merch'
  if (params.slug === 'merch') {
    return <MerchPage merch={initial.data.merch ?? []} />
  }

  return <Page data={initial.data} />
}
