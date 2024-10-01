import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Image from 'next/image'
import Link from 'next/link'

import logo from '/public/images/banners/B13.png'
import logoBis from '/public/images/banners/B13bis.png'
import { ProjectListItem } from '@/components/pages/home/ProjectListItem'
import { Header } from '@/components/shared/Header'
import { resolveHref } from '@/sanity/lib/utils'
import type { HomePagePayload } from '@/types'

export interface HomePageProps {
  data: HomePagePayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], showcaseProjects = [], title = '' } = data ?? {}
  console.log(data)

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="absolute inset-0 bg-homepage-pattern bg-cover bg-center blur-sm md:blur-md"></div>

      {/* Header */}
      {/* {title && <Header centered title={title} description={overview} />} */}
      <Image
        className="z-50 min-w-96 max-w-[90rem] hidden md:flex"
        src={logo}
        alt="PCFQ Logo"
      />
      <Image
        className="z-50 max-w-60 p-4 -mt-12 md:hidden"
        src={logoBis}
        alt="PCFQ Logo"
      />

      {/* Showcase projects */}
      {/* {showcaseProjects && showcaseProjects.length > 0 && (
        <div className="mx-auto max-w-[100rem] rounded-md border">
          {showcaseProjects.map((project, key) => {
            const href = resolveHref(project?._type, project?.slug)
            if (!href) {
              return null
            }
            return (
              <Link
                key={key}
                href={href}
                data-sanity={encodeDataAttribute?.([
                  'showcaseProjects',
                  key,
                  'slug',
                ])}
              >
                <ProjectListItem project={project} odd={key % 2} />
              </Link>
            )
          })}
        </div>
      )} */}
    </div>
  )
}

export default HomePage
