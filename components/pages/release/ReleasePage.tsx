'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useLayoutEffect, useRef } from 'react'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { getResolvedPageTheme, type SettingsTheme } from '@/lib/theme'
import type { ReleasePayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import ReleasePlayer from './ReleasePlayer'

export interface ReleasePageProps {
  data: ReleasePayload
  settingsTheme?: SettingsTheme
}

const ReleasePage = ({ data, settingsTheme }: ReleasePageProps) => {
  const release = data
  const pageTheme = getResolvedPageTheme({
    backgroundColor: release.backgroundColor,
    noteDrawing: release.noteDrawing,
    section: 'releases',
    settingsTheme,
  })
  const releaseTitleColor = release.titleColor?.hex || pageTheme.textColor
  const isTextLeft = release.layout !== 'right'
  const descriptionScrollRef = useRef<HTMLDivElement>(null)
  const resetDescriptionScroll = useCallback(() => {
    if (descriptionScrollRef.current) {
      descriptionScrollRef.current.scrollTop = 0
    }
  }, [])

  useLayoutEffect(() => {
    resetDescriptionScroll()
  }, [release._id, resetDescriptionScroll])

  const currentIndex = release.collection?.releases.findIndex(
    (collectionRelease) => collectionRelease._id === release._id,
  )
  const totalReleases = release.collection?.releases.length || 0
  const previousRelease =
    currentIndex !== undefined && currentIndex > 0
      ? release.collection.releases[currentIndex - 1]
      : null
  const nextRelease =
    currentIndex !== undefined && currentIndex < totalReleases - 1
      ? release.collection.releases[currentIndex + 1]
      : null

  return (
    <div
      className="release-page relative h-svh w-full overflow-hidden"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        color: pageTheme.textColor,
        ['--release-player-background' as string]: pageTheme.backgroundColor,
        ['--release-scrollbar-thumb' as string]: releaseTitleColor,
        ['--release-scrollbar-track' as string]: 'transparent',
      }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />

      {pageTheme.noteDrawing?.image ? (
        <div
          aria-label={
            pageTheme.noteDrawing.title || 'Release background drawing'
          }
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-20 mx-auto px-4 lg:px-12 xl:px-24 2xl:px-48">
        <div className="mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div
            className={`min-w-0 ${isTextLeft ? 'lg:col-start-1' : 'lg:col-start-2'}`}
            data-testid="release-title-column"
          >
            <AnimatedArtistTitle
              blendMode={false}
              color={releaseTitleColor}
              distort
              fitToColumn
              name={release.title}
            />
          </div>
        </div>
      </div>

      {totalReleases > 1 ? (
        <div
          className={`absolute top-24 z-30 flex items-center gap-3 md:top-28 ${
            isTextLeft
              ? 'right-5 md:right-10 lg:right-16'
              : 'left-5 md:left-10 lg:left-16'
          }`}
        >
          <div className="distort bg-white/80 px-3 py-1 font-mono text-sm text-black md:text-base">
            {currentIndex !== undefined ? currentIndex + 1 : '?'}/
            {totalReleases}
          </div>

          <div className="flex gap-2">
            {previousRelease ? (
              <Link
                aria-label={`Previous release: ${previousRelease.title}`}
                className="distort flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black text-white transition-colors hover:bg-white hover:text-black"
                href={`/releases/${previousRelease.slug}`}
              >
                ←
              </Link>
            ) : null}

            {nextRelease ? (
              <Link
                aria-label={`Next release: ${nextRelease.title}`}
                className="distort flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black text-white transition-colors hover:bg-white hover:text-black"
                href={`/releases/${nextRelease.slug}`}
              >
                →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto h-full px-4 tracking-tight lg:px-12 xl:px-24 2xl:px-48">
        <div
          className={`release-content-grid mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:grid-rows-1 ${
            release.bandcampPlayer
              ? 'grid-rows-[calc(42svh+5rem)_minmax(0,1fr)]'
              : 'grid-rows-[42svh_minmax(0,1fr)]'
          }`}
        >
          <section
            className={`order-2 flex min-h-0 flex-col gap-4 pb-12 lg:h-full lg:pb-[6vh] lg:pt-[38vh] ${
              isTextLeft ? 'lg:order-1' : 'lg:order-2'
            }`}
            data-testid="release-information-column"
          >
            <div className="distort-text flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 pr-4">
                {release.artists?.length || release.catalogNumber ? (
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    {release.artists?.length ? (
                      <div className="flex flex-wrap items-center text-2xl font-bold leading-none md:text-3xl">
                        {release.artists.map((artist, index) => {
                          if (!artist) return null

                          const separator =
                            index < release.artists.length - 1 ? (
                              <span className="mr-2">,</span>
                            ) : null

                          if (
                            artist._type === 'artist' &&
                            'slug' in artist &&
                            artist.slug &&
                            typeof artist.slug === 'object'
                          ) {
                            return (
                              <span
                                className="flex items-center"
                                key={artist._id}
                              >
                                <Link
                                  className="transition-opacity hover:opacity-60 hover:underline"
                                  href={`/artists/${artist.slug.current}`}
                                >
                                  {artist.name}
                                </Link>
                                {separator}
                              </span>
                            )
                          }

                          if ('url' in artist && artist.url) {
                            return (
                              <span
                                className="flex items-center"
                                key={artist.name}
                              >
                                <a
                                  className="transition-opacity hover:opacity-60 hover:underline"
                                  href={artist.url}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {artist.name}
                                </a>
                                {separator}
                              </span>
                            )
                          }

                          return artist.name ? (
                            <span
                              className="flex items-center"
                              key={artist.name}
                            >
                              {artist.name}
                              {separator}
                            </span>
                          ) : null
                        })}
                      </div>
                    ) : null}
                    {release.catalogNumber ? (
                      <span className="text-xs font-bold uppercase opacity-65 md:text-sm">
                        {release.catalogNumber}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  {release.genres?.map((genre) => (
                    <span className="site-tag text-sm uppercase" key={genre}>
                      <span className="distort inline-block">{genre}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="release-page-scrollbar mt-6 min-h-0 overflow-y-auto overscroll-contain pb-4 pr-4"
                ref={descriptionScrollRef}
                data-testid="release-description-scroll"
              >
                {release.description?.length ? (
                  <div className="text-sm leading-snug md:text-lg">
                    {release.description.map((block: any) =>
                      block._type === 'block' ? (
                        <p className="mb-4" key={block._key}>
                          {block.children?.map((child: any) =>
                            child._type === 'span' ? (
                              <span key={child._key}>{child.text}</span>
                            ) : null,
                          )}
                        </p>
                      ) : null,
                    )}
                  </div>
                ) : null}

                {!release.bandcampPlayer && release.tracklist?.length ? (
                  <div className="mt-6">
                    <h2 className="mb-2 text-sm font-bold uppercase md:text-base">
                      Tracklist
                    </h2>
                    <ol className="list-inside list-decimal space-y-1 text-sm md:text-base">
                      {release.tracklist.map((track, index) => (
                        <li key={`${track.title}-${index}`}>
                          {track.title}
                          {track.duration ? ` — ${track.duration}` : ''}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {release.releaseDate ? (
                  <div className="mt-6 text-xs uppercase opacity-65 md:text-sm">
                    {release.releaseDate}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section
            className={`order-1 flex min-h-0 flex-col items-center justify-center pt-[6svh] lg:h-full lg:pt-0 ${isTextLeft ? 'lg:order-2' : 'lg:order-1'}`}
            data-testid="release-artwork-column"
          >
            <div className="relative w-full max-w-[34svh] shrink-0 lg:max-w-[72vh]">
              <div
                className="relative aspect-square w-full [perspective:1000px]"
                data-testid="release-artwork"
              >
                <div className="pointer-events-none relative h-full w-full animate-continuousFlip shadow-xl transition-all duration-500 [transform-style:preserve-3d]">
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    {release.image ? (
                      <Image
                        alt={release.title}
                        className="object-cover"
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        src={release.image}
                      />
                    ) : null}
                  </div>

                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {release.backCover || release.image ? (
                      <Image
                        alt={`${release.title} back cover`}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        src={release.backCover || release.image}
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              {release.bandcampPlayer ? (
                <div className="release-artwork-player relative z-30 mt-4 h-16 w-full lg:absolute lg:top-[calc(100%-2rem)]">
                  <ReleasePlayer
                    key={release._id}
                    embedUrl={release.bandcampPlayer}
                    title={release.title}
                    artist={
                      release.artists
                        ?.map((artist) => artist.name)
                        .filter(Boolean)
                        .join(', ') || ''
                    }
                    image={release.image}
                    tracklist={release.tracklist}
                  />
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReleasePage
