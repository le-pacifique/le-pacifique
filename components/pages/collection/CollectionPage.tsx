import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  getSectionTheme,
  type SettingsTheme,
} from '@/lib/theme'
import type { CollectionPayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import RotatingCarousel from './RotatingCarousel'

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

  return (
    <div
      className="h-full w-full absolute -z-0"
      style={{ backgroundColor: pageTheme.backgroundColor }}
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

      {collection.description && (
        <div
          className="collection-description-scrollbar absolute top-[30%] right-[5%] z-40 max-w-xl p-6 text-black max-h-[50vh] overflow-y-auto"
          style={{
            scrollbarColor: `${collectionColor} transparent`,
            ['--collection-scrollbar-thumb' as string]: collectionColor,
          }}
        >
          {collection.description?.map((block: any) => {
            if (block._type === 'block') {
              return (
                <p
                  key={block._key}
                  className="distort mb-3 text-sm md:text-xl leading-snug"
                >
                  {block.children?.map((child: any) => {
                    if (child._type === 'span') {
                      return (
                        <span
                          key={child._key}
                          className={
                            child.marks?.includes('strong') ? 'font-bold' : ''
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
      {formattedReleases.length > 0 ? (
        <RotatingCarousel releases={formattedReleases} />
      ) : (
        <div className="flex h-screen items-center justify-center text-white text-2xl">
          No releases found for this collection
        </div>
      )}
      <AnimatedArtistTitle
        name={collection.title}
        color={collectionTitleColor}
        blendMode={false}
        distort
      />
    </div>
  )
}

export default CollectionPage
