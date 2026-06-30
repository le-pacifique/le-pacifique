import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import CollectionPage from '@/components/pages/collection/CollectionPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadCollection, loadSettings } from '@/sanity/loader/loadQuery'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const { data: collection } = await loadCollection(slug)
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
  const { slug } = await params
  const [initial, settings] = await Promise.all([
    loadCollection(slug),
    loadSettings(),
  ])
  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return (
    <CollectionPage data={initial.data} settingsTheme={settings.data.theme} />
  )
}
