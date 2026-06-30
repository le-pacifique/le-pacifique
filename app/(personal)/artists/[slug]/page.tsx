import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import ArtistPage from '@/components/pages/artist/ArtistPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadArtist, loadSettings } from '@/sanity/loader/loadQuery'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const { data: artist } = await loadArtist(slug)
  const ogImage = urlForOpenGraphImage(artist?.image)

  return {
    title: artist?.name,
    description: artist?.overview
      ? toPlainText(artist.overview)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('artist')
}

export default async function ArtistSlugRoute({ params }: Props) {
  const { slug } = await params
  const [initial, settings] = await Promise.all([
    loadArtist(slug),
    loadSettings(),
  ])

  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return <ArtistPage data={initial.data} settingsTheme={settings.data.theme} />
}
