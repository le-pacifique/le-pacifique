import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import { ProjectPage } from '@/components/pages/project/ProjectPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadProject, loadSettings } from '@/sanity/loader/loadQuery'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = await loadProject(slug)
  const ogImage = urlForOpenGraphImage(project?.coverImage)

  return {
    title: project?.title,
    description: project?.overview
      ? toPlainText(project.overview)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('project')
}

export default async function ProjectSlugRoute({ params }: Props) {
  const { slug } = await params
  const [initial, settings] = await Promise.all([
    loadProject(slug),
    loadSettings(),
  ])

  // if (draftMode().isEnabled) {
  //   return <ProjectPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }

  return <ProjectPage data={initial.data} settingsTheme={settings.data.theme} />
}
