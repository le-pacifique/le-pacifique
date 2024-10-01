import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import ArtistPage from '@/components/pages/artist/ArtistPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadRelease } from '@/sanity/loader/loadQuery'
import ReleasePage from '@/components/pages/release/ReleasePage'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: release } = await loadRelease(params.slug)
  const ogImage = urlForOpenGraphImage(release?.image)

  return {
    title: release?.title,
    description: release?.description
      ? toPlainText(release.description)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('release')
}

export default async function ReleaseSlugRoute({ params }: Props) {
  const initial = await loadRelease(params.slug)

  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return <ReleasePage data={initial.data} />
}
