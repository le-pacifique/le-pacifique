'use client'

import Link from 'next/link'

import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { SectionTabs } from '@/components/shared/SectionTabs'
import type { ArtistPayload } from '@/types'

type SectionKey = 'bio' | 'releases' | 'radio' | 'links'

const sections: Array<{ key: SectionKey; label: string }> = [
  { key: 'bio', label: 'Bio' },
  { key: 'releases', label: 'Releases' },
  { key: 'radio', label: 'Radio' },
  { key: 'links', label: 'Links' },
]

type ArtistSectionsProps = Pick<
  ArtistPayload,
  | '_id'
  | 'biography'
  | 'email'
  | 'linkedReleases'
  | 'radioShows'
  | 'releasesCatalog'
  | 'socialMedia'
> & {
  accentColor: string
  contrastColor: string
}

const EmptySection = () => (
  <p className="distort mt-6 text-sm uppercase tracking-tight text-black/60 md:text-xl">
    Nothing here yet.
  </p>
)

export default function ArtistSections({
  _id,
  accentColor,
  biography,
  contrastColor,
  email,
  linkedReleases,
  radioShows,
  releasesCatalog,
  socialMedia,
}: ArtistSectionsProps) {
  const biographyContent = Array.isArray(biography) ? (
    <div className="distort mt-6 text-sm leading-snug tracking-tight text-black md:text-xl">
      <CustomPortableText value={biography} paragraphClasses="mb-4" />
    </div>
  ) : biography ? (
    <p className="distort mt-6 text-sm leading-snug tracking-tight text-black md:text-xl">
      {biography}
    </p>
  ) : (
    <EmptySection />
  )

  const renderActiveSection = (activeSection: SectionKey) => {
    if (activeSection === 'releases') {
      const hasReleases = Boolean(
        linkedReleases?.length || releasesCatalog?.length,
      )

      return hasReleases ? (
        <ul className="distort mt-6 space-y-2 text-sm uppercase tracking-tight md:text-xl">
          {linkedReleases?.map((release) => (
            <li key={release._id}>
              {release.slug ? (
                <Link
                  className="hover:opacity-60"
                  href={`/releases/${release.slug}`}
                >
                  {release.title}
                </Link>
              ) : (
                release.title
              )}
            </li>
          ))}
          {releasesCatalog?.map((release, index) => (
            <li key={release._key || `${release.href}-${index}`}>
              {release.href ? (
                <a
                  className="hover:opacity-60"
                  href={release.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {release.title || release.href}
                </a>
              ) : (
                release.title
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptySection />
      )
    }

    if (activeSection === 'radio') {
      return radioShows?.length ? (
        <ul className="distort mt-6 space-y-2 text-sm uppercase tracking-tight md:text-xl">
          {radioShows.map((show, index) => (
            <li key={show._key || `${show.href}-${index}`}>
              {show.href ? (
                <a
                  className="hover:opacity-60"
                  href={show.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {show.title || show.href}
                </a>
              ) : (
                show.title
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptySection />
      )
    }

    const hasLinks = Boolean(socialMedia?.length || email)

    return hasLinks ? (
      <ul className="distort mt-6 space-y-2 text-sm uppercase tracking-tight md:text-xl">
        {socialMedia?.map((link, index) => (
          <li key={link._key || `${link.href}-${index}`}>
            {link.href ? (
              <a
                className="hover:opacity-60"
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.title || link.href}
              </a>
            ) : (
              link.title
            )}
          </li>
        ))}
        {email && (
          <li>
            <a className="hover:opacity-60" href={`mailto:${email}`}>
              {email}
            </a>
          </li>
        )}
      </ul>
    ) : (
      <EmptySection />
    )
  }

  return (
    <SectionTabs
      seed={_id}
      label="Artist sections"
      tabLayout="wide"
      accentColor={accentColor}
      contrastColor={contrastColor}
      sections={sections.map((section) => ({
        ...section,
        content:
          section.key === 'bio'
            ? biographyContent
            : renderActiveSection(section.key),
      }))}
    />
  )
}
