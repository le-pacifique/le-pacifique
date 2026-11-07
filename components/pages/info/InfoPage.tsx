import { PortableText } from '@portabletext/react'
import Image from 'next/image'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { SectionTabs } from '@/components/shared/SectionTabs'
import { TitlePanelSpacing } from '@/components/shared/TitlePanelSpacing'
import {
  getResolvedPageTheme,
  getSectionTheme,
  type SettingsTheme,
} from '@/lib/theme'
import { urlForImage } from '@/sanity/lib/utils'
import type { InfoPayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'

export interface InfoPageProps {
  info: InfoPayload
  menuImage?: {
    image: string
    title?: string
  }
  settingsTheme?: SettingsTheme
}

const InfoPage = ({ info, menuImage, settingsTheme }: InfoPageProps) => {
  const isImageLeft = info.layout === 'left'
  const hasImage = Boolean(info.image?.asset)
  const hasTitle = Boolean(info.title?.trim())
  const pageTheme = getResolvedPageTheme({
    backgroundColor: info.backgroundColor,
    noteDrawing: info.noteDrawing,
    section: 'info',
    settingsTheme,
  })
  const drawing = pageTheme.noteDrawing ?? menuImage
  const socialButtonColor = getSectionTheme(
    settingsTheme,
    'info',
  ).backgroundColor

  return (
    <div
      className="info-page relative h-svh w-full overflow-hidden"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        color: pageTheme.textColor,
        ['--info-selection-color' as string]: socialButtonColor,
      }}
    >
      <TitlePanelSpacing title={info.title} />
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />

      {drawing?.image ? (
        <div
          aria-label={drawing.title || 'Info background drawing'}
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${drawing.image})` }}
        />
      ) : null}

      {info.title?.trim() && (
        <div className="pointer-events-none absolute inset-0 z-20 mx-auto px-4 lg:px-12 xl:px-24 2xl:px-48">
          <div className="mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div
              className={`min-w-0 ${isImageLeft ? 'lg:col-start-2' : 'lg:col-start-1'}`}
              data-testid="info-title-column"
            >
              <AnimatedArtistTitle
                blendMode={false}
                color={pageTheme.textColor}
                distort
                fitToColumn
                name={info.title.trim()}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto h-full px-4 tracking-tight lg:px-12 xl:px-24 2xl:px-48">
        <div
          className={`mx-auto grid h-full max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:grid-rows-1 ${hasImage ? 'grid-rows-[42svh_minmax(0,1fr)]' : 'grid-rows-1'}`}
        >
          <div
            className={`min-h-0 pb-12 lg:h-full lg:pb-[6vh] ${isImageLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'} ${hasTitle ? (hasImage ? 'lg:pt-[var(--title-panel-offset,44vh)]' : 'pt-[42svh] lg:pt-[var(--title-panel-offset,44vh)]') : hasImage ? 'lg:pt-[16vh]' : 'pt-28 lg:pt-[16vh]'}`}
          >
            <SectionTabs
              seed={info._id}
              label="Info sections"
              tabLayout="wide"
              accentColor={socialButtonColor}
              contrastColor="#000000"
              sections={[
                {
                  key: 'info',
                  label: 'Info',
                  content: (
                    <div className="info-description distort-text mt-6 text-sm leading-snug md:text-xl">
                      {info.description?.length ? (
                        <PortableText value={info.description} />
                      ) : (
                        <p className="uppercase opacity-60">
                          About text coming soon.
                        </p>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'links',
                  label: 'Links',
                  content: (
                    <div className="distort-text mt-6 space-y-8 text-sm md:text-xl">
                      {info.socialMedia?.length ? (
                        <ul className="space-y-2 uppercase">
                          {info.socialMedia.map((link, index) => (
                            <li key={link._key || index}>
                              <a
                                className="hover:opacity-60"
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {info.pressKit?.length ? (
                        <div>
                          <h2 className="mb-3 text-xs font-bold uppercase opacity-60 md:text-sm">
                            Press Kit
                          </h2>
                          <ul className="space-y-2">
                            {info.pressKit.map((item, index) => (
                              <li key={item._key || index}>
                                {item.file?.asset?.url ? (
                                  <a
                                    className="underline underline-offset-4 hover:opacity-60"
                                    href={item.file.asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.title}
                                  </a>
                                ) : (
                                  item.title
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {!info.socialMedia?.length && !info.pressKit?.length && (
                        <p className="uppercase opacity-60">No links yet.</p>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'contact',
                  label: 'Contact',
                  content: (
                    <div className="distort-text mt-6 text-sm md:text-xl">
                      {info.contactEmail ? (
                        <a
                          className="break-all font-bold underline underline-offset-4 hover:opacity-60"
                          href={`mailto:${info.contactEmail}`}
                        >
                          {info.contactEmail}
                        </a>
                      ) : (
                        <p className="uppercase opacity-60">
                          Contact details coming soon.
                        </p>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
          {hasImage && (
            <div
              className={`order-1 flex min-h-0 items-center justify-center ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
              data-testid="info-image-column"
            >
              <div className="relative h-[34svh] w-full lg:h-[75vh]">
                <Image
                  alt={info.image?.alt || info.title || 'Le Pacifique'}
                  className="object-contain"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={urlForImage(info.image)?.url() ?? ''}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoPage
