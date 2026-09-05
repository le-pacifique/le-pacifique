import { RevealImage } from '@/components/shared/RevealImage'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { deterministicRange } from '@/lib/deterministicRandom'
import { resolveHref } from '@/sanity/lib/utils'

export interface FloatingReleasesProps {
  releases: Array<{
    _id: string
    image: string
    imageLqip?: string
    slug: { current: string }
    title: string
    _type: string
  }>
}

const FloatingReleases = ({ releases }: FloatingReleasesProps) => {
  const hasSparseOrbit = releases.length <= 3
  const baseDuration = hasSparseOrbit ? 76 : releases.length <= 6 ? 62 : 52
  const sparseOrbitSeed = releases.map((release) => release._id).join('|')
  const sparseOrbitDuration =
    baseDuration + deterministicRange(0, 10, sparseOrbitSeed, 'duration')
  const sparseOrbitDelay = -deterministicRange(
    0,
    sparseOrbitDuration,
    sparseOrbitSeed,
    'delay',
  )

  return (
    <div
      className="relative h-full min-h-0 w-full isolate"
      data-testid="collection-releases-column"
    >
      {releases.map((release, index) => {
        const href = resolveHref(release._type, release.slug.current) || '#'
        const phase = (360 * index) / releases.length
        const duration = hasSparseOrbit
          ? sparseOrbitDuration
          : baseDuration + deterministicRange(0, 22, release._id, 'duration')
        const staggeredDelay = hasSparseOrbit
          ? sparseOrbitDelay
          : -(
              (duration * index) / releases.length +
              deterministicRange(
                0,
                duration / Math.max(releases.length * 3, 1),
                release._id,
                'delay-jitter',
              )
            )
        const style = {
          ['--collection-orbit-delay' as string]: `${staggeredDelay}s`,
          ['--collection-orbit-duration' as string]: `${duration}s`,
        } as CSSProperties

        for (let pointIndex = 0; pointIndex < 8; pointIndex += 1) {
          const angle = ((phase + pointIndex * 45) * Math.PI) / 180
          const horizontalRadius = deterministicRange(
            22,
            37,
            release._id,
            pointIndex,
            'horizontal-radius',
          )
          const verticalRadius = deterministicRange(
            19,
            35,
            release._id,
            pointIndex,
            'vertical-radius',
          )
          const left = Math.max(
            10,
            Math.min(
              90,
              50 +
                Math.cos(angle) * horizontalRadius +
                deterministicRange(
                  -5,
                  5,
                  release._id,
                  pointIndex,
                  'left-wobble',
                ),
            ),
          )
          const top = Math.max(
            10,
            Math.min(
              90,
              50 +
                Math.sin(angle) * verticalRadius +
                deterministicRange(
                  -5,
                  5,
                  release._id,
                  pointIndex,
                  'top-wobble',
                ),
            ),
          )

          style[`--collection-orbit-p${pointIndex}-left` as string] = `${left}%`
          style[`--collection-orbit-p${pointIndex}-top` as string] = `${top}%`
        }

        return (
          <Link
            aria-label={release.title}
            className="collection-release-float group absolute z-10 block size-14 hover:z-50 focus-visible:z-50 md:size-20"
            href={href}
            key={release._id}
            style={style}
          >
            <span className="relative block size-full origin-center overflow-hidden shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[3] group-focus-visible:scale-[3] md:group-hover:scale-[3.25] md:group-focus-visible:scale-[3.25]">
              {release.image && (
                <RevealImage
                  alt=""
                  blurDataURL={release.imageLqip}
                  sizes="(min-width: 768px) 80px, 56px"
                  src={release.image}
                />
              )}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default FloatingReleases
