import Image from 'next/image'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { TitlePanelSpacing } from '@/components/shared/TitlePanelSpacing'
import {
  getResolvedPageTheme,
  getSectionTheme,
  type SettingsTheme,
} from '@/lib/theme'
import { urlForImage } from '@/sanity/lib/utils'
import type { ArtistPayload } from '@/types'

import AnimatedArtistTitle from './AnimatedArtistTitle'
import ArtistSections from './ArtistSections'

export interface ArtistPageProps {
  data: ArtistPayload
  settingsTheme?: SettingsTheme
}

const ArtistPage = ({ data, settingsTheme }: ArtistPageProps) => {
  const artist = data
  const { noteDrawing, backgroundColor, layout, titleColor } = data

  const isLeft = layout === 'left'
  const pageTheme = getResolvedPageTheme({
    backgroundColor,
    noteDrawing,
    section: 'artists',
    settingsTheme,
  })
  const bgColor = getSectionTheme(settingsTheme, 'artists').backgroundColor
  const artistTitleColor = titleColor?.hex || pageTheme.textColor
  const sectionButtonColor = artist.sectionButtonColor?.hex || bgColor
  const sectionButtonContrastColor =
    artist.sectionButtonContrastColor?.hex || '#000000'

  return (
    <div
      className="relative h-svh w-full overflow-hidden"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <TitlePanelSpacing title={artist.name} />
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />

      <div className="pointer-events-none absolute inset-0 z-[19] mx-auto px-4 lg:px-12 xl:px-24 2xl:px-48">
        <div className="mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div
            className={`min-w-0 ${isLeft ? 'lg:col-start-2' : 'lg:col-start-1'}`}
            data-testid="artist-title-column"
          >
            <AnimatedArtistTitle
              name={artist.name}
              color={artistTitleColor}
              blendMode={false}
              distort
            />
          </div>
        </div>
      </div>

      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        ></div>
      )}

      <div className="relative z-10 mx-auto h-full px-4 tracking-tight lg:px-12 xl:px-24 2xl:px-48">
        <div className="mx-auto grid h-full max-w-2xl grid-cols-1 grid-rows-[38svh_minmax(0,1fr)] gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:grid-rows-1">
          <div
            className={`${
              isLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
            } min-h-0 pb-12 lg:h-full lg:pb-[6vh] lg:pt-[calc(var(--title-panel-offset,44vh)-1.5rem)]`}
            data-testid="artist-biography-column"
          >
            <ArtistSections
              _id={artist._id}
              accentColor={sectionButtonColor}
              biography={artist.biography}
              contrastColor={sectionButtonContrastColor}
              email={artist.email}
              linkedReleases={artist.linkedReleases}
              radioShows={artist.radioShows}
              releasesCatalog={artist.releasesCatalog}
              socialMedia={artist.socialMedia}
            />
          </div>

          {artist?.image && (
            <div
              className={`flex min-h-0 items-center justify-center ${
                isLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
              }`}
              data-testid="artist-image-column"
            >
              <div className="relative h-[34svh] w-full lg:h-[75vh]">
                <Image
                  alt={artist.image?.alt || artist.name}
                  className="object-contain"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={urlForImage(artist.image)?.url() ?? ''}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistPage
