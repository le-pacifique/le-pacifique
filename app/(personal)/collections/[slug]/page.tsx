import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import ArtistPage from '@/components/pages/artist/ArtistPage'
import CollectionPage from '@/components/pages/collection/CollectionPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadCollection } from '@/sanity/loader/loadQuery'
const ProjectPreview = dynamic(
  () => import('@/components/pages/project/ProjectPreview'),
)

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: collection } = await loadCollection(params.slug)
  const ogImage = urlForOpenGraphImage(collection?.image)

  return {
    title: collection?.title,
    description: collection?.overview
      ? toPlainText(collection.overview)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('collection')
}

export default async function CollectionSlugRoute({ params }: Props) {
  const initial = await loadCollection(params.slug)
  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return <CollectionPage data={initial.data} />
}
