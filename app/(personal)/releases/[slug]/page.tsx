import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import ReleasePage from '@/components/pages/release/ReleasePage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadRelease, loadSettings } from '@/sanity/loader/loadQuery'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const { data: release } = await loadRelease(slug)
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
  const { slug } = await params
  const [initial, settings] = await Promise.all([
    loadRelease(slug),
    loadSettings(),
  ])

  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return <ReleasePage data={initial.data} settingsTheme={settings.data.theme} />
}
