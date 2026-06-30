import Link from 'next/link'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  type SettingsTheme,
} from '@/lib/theme'
import { resolveHref } from '@/sanity/lib/utils'
import type { CollectionPayload, PageThemePayload } from '@/types'

export interface CollectionsPageProps {
  collections: CollectionPayload[]
  pageTheme?: PageThemePayload
  settingsTheme?: SettingsTheme
}

const CollectionsPage = ({
  collections,
  pageTheme: pageThemeOverride,
  settingsTheme,
}: CollectionsPageProps) => {
  const pageTheme = getResolvedPageTheme({
    backgroundColor: pageThemeOverride?.backgroundColor,
    noteDrawing: pageThemeOverride?.noteDrawing,
    section: 'collections',
    settingsTheme,
  })

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      )}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-8">Collections</h1>
        {collections && collections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, key) => {
              const href = resolveHref(
                collection?._type,
                collection?.slug?.current,
              )
              if (!href) {
                return null
              }
              return (
                <Link key={key} href={href}>
                  <h2>{collection.title}</h2>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionsPage
