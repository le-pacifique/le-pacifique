import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/utils'

interface ImageBoxProps {
  image?: { asset?: any }
  alt?: string
  width?: number
  height?: number
  size?: string
  classesWrapper?: string
  'data-sanity'?: string
}

function isGifImage(image?: { asset?: any }) {
  const ref = image?.asset?._ref || image?.asset?._id || ''
  const url = image?.asset?.url || ''

  return ref.endsWith('-gif') || /\.gif($|\?)/i.test(url)
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  width = 3500,
  height = 2000,
  size = '100vw',
  classesWrapper,
  ...props
}: ImageBoxProps) {
  const isGif = isGifImage(image)
  const imageUrl = image
    ? isGif
      ? urlForImage(image)?.url()
      : urlForImage(image)?.height(height).width(width).fit('crop').url()
    : undefined

  return (
    <div
      className={`w-full overflow-hidden rounded-[3px] ${
        isGif ? 'bg-transparent' : 'bg-gray-50'
      } ${classesWrapper}`}
      data-sanity={props['data-sanity']}
    >
      {imageUrl && isGif && (
        <Image
          className="absolute h-full w-full object-contain"
          alt={alt}
          width={width}
          height={height}
          sizes={size}
          src={imageUrl}
          unoptimized
        />
      )}
      {imageUrl && !isGif && (
        <Image
          className="absolute h-full w-full object-cover"
          alt={alt}
          width={width}
          height={height}
          sizes={size}
          src={imageUrl}
        />
      )}
    </div>
  )
}
