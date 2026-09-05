import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  getSectionTheme,
  type SettingsTheme,
} from '@/lib/theme'
import type { CollectionPayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import FloatingReleases from './FloatingReleases'

export interface CollectionPageProps {
  data: CollectionPayload
  settingsTheme?: SettingsTheme
}

const CollectionPage = ({ data, settingsTheme }: CollectionPageProps) => {
  const collection = data

  const formattedReleases =
    collection.releases?.map((release) => ({
      _id: release._id,
      title: release.title,
      image: release.image || '',
      imageLqip: release.imageLqip,
      _type: release._type,
      slug: {
        current: release.slug?.current || '',
      },
      ...(release.backCover && { backCover: release.backCover }),
      artists: (release.artists || []).map((artist: any) => ({
        ...artist,
        slug:
          typeof artist.slug === 'object' ? artist.slug?.current : artist.slug,
      })),
    })) || []

  const pageTheme = getResolvedPageTheme({
    backgroundColor: collection.backgroundColor,
    noteDrawing: collection.noteDrawing,
    section: 'collections',
    settingsTheme,
  })
  const collectionColor = getSectionTheme(
    settingsTheme,
    'collections',
  ).backgroundColor
  const collectionTitleColor = collection.titleColor?.hex || pageTheme.textColor
  const isTextLeft = collection.layout === 'left'

  return (
    <div
      className="collection-page relative h-svh w-full overflow-hidden"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        ['--collection-accent' as string]: collectionColor,
        ['--collection-scrollbar-thumb' as string]: collectionColor,
      }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      <svg className="hidden">
        <filter id="roughText">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </svg>

      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        ></div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20 mx-auto px-4 lg:px-12 xl:px-24 2xl:px-48">
        <div className="mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div
            className={`min-w-0 ${isTextLeft ? 'lg:col-start-1' : 'lg:col-start-2'}`}
            data-testid="collection-title-column"
          >
            <AnimatedArtistTitle
              name={collection.title}
              color={collectionTitleColor}
              blendMode={false}
              distort
              fitToColumn
              scale={
                collection.titleScale ? collection.titleScale / 100 : undefined
              }
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto h-full px-4 tracking-tight lg:px-12 xl:px-24 2xl:px-48">
        <div className="mx-auto grid h-full max-w-2xl grid-cols-1 grid-rows-[42svh_minmax(0,1fr)] gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:grid-rows-1">
          <div
            className={`order-1 min-h-0 lg:h-full ${isTextLeft ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {formattedReleases.length > 0 ? (
              <FloatingReleases releases={formattedReleases} />
            ) : (
              <div className="distort flex h-full items-center justify-center text-sm uppercase md:text-xl">
                No releases found for this collection
              </div>
            )}
          </div>

          <div
            className={`order-2 min-h-0 pb-12 lg:h-full lg:pb-[6vh] lg:pt-[44vh] ${isTextLeft ? 'lg:order-1' : 'lg:order-2'}`}
            data-testid="collection-description-column"
          >
            {collection.description && (
              <div className="collection-description-scrollbar h-full min-h-0 overflow-y-auto pr-4 text-black">
                {collection.description.map((block: any) => {
                  if (block._type === 'block') {
                    return (
                      <p
                        key={block._key}
                        className="distort mb-3 text-sm leading-snug md:text-xl"
                      >
                        {block.children?.map((child: any) => {
                          if (child._type === 'span') {
                            return (
                              <span
                                key={child._key}
                                className={
                                  child.marks?.includes('strong')
                                    ? 'font-bold'
                                    : ''
                                }
                              >
                                {child.text}
                              </span>
                            )
                          }

                          return null
                        })}
                      </p>
                    )
                  }

                  return null
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionPage
