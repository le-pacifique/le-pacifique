'use client'

import Image from 'next/image'
import { useState } from 'react'

export function RevealImage({
  src,
  alt,
  sizes,
  blurDataURL,
}: {
  src: string
  alt: string
  sizes: string
  blurDataURL?: string
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)

  return (
    <span
      className="image-reveal absolute inset-0 block"
      data-revealed={loadedSrc === src}
    >
      <span className="image-reveal__skeleton" aria-hidden="true">
        <span
          style={{
            backgroundImage: blurDataURL ? `url("${blurDataURL}")` : undefined,
          }}
        />
      </span>
      <Image
        key={src}
        alt={alt}
        className="image-reveal__content object-cover"
        fill
        sizes={sizes}
        src={src}
        onLoad={() => setLoadedSrc(src)}
      />
    </span>
  )
}
