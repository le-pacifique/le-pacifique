import type { PortableTextBlock } from 'next-sanity'
import type { Image } from 'sanity'

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface MilestoneItem {
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface ShowcaseProject {
  _type: string
  coverImage?: Image
  overview?: PortableTextBlock[]
  slug?: string
  tags?: string[]
  title?: string
}

// Page payloads

export interface HomePagePayload {
  footer?: PortableTextBlock[]
  overview?: PortableTextBlock[]
  showcaseProjects?: ShowcaseProject[]
  title?: string
  logo?: {
    _id: string
    title: string
    image: string
  }
  popupText?: string
  logos?: {
    _id: string
    title: string
    image: string
  }[]
  menuImages?: {
    artists?: { image: string; title?: string }
    collections?: { image: string; title?: string }
    blog?: { image: string; title?: string }
    merch?: { image: string; title?: string }
  }
}

export interface PagePayload {
  body?: PortableTextBlock[]
  name?: string
  overview?: PortableTextBlock[]
  title?: string
  slug?: string
  artists?: ArtistPayload[]
  collections?: CollectionPayload[]
  articles?: ArticlePayload[]
  releases?: ReleasePayload[]
  merch?: MerchPayload[]
}

export interface ArtistPayload {
  _id: string
  name: string
  image: any
  biography: string
  slug?: {
    current: string
  }
  _type: string
  overview?: PortableTextBlock[]
  noteDrawing?: {
    _id: string
    title: string
    image: string
  }
  backgroundColor?: {
    hex: string
  }
  socialMedia?: {
    _key: string
    title: string
    _type: string
    href: string
  }[]
  layout?: 'left' | 'right'
}

export interface ReleasePayload {
  _id: string
  image: any
  title: string
  catalogNumber: string
  releaseDate: string
  genres: string[]
  description: PortableTextBlock[]
  tracklist: Track[]
  credits: Credits
  slug: {
    current: string
  }
  _type: string
  bandcampPlayer: string
  artists: Array<
    | {
        _id: string
        name: string
        slug?: { current: string }
        _type?: string
      }
    | {
        name: string
        url?: string
        _type?: string
      }
  >
  collection: {
    _id: string
    title: string
    releases: {
      _id: string
      title: string
      slug: {
        current: string
      }
    }[]
  }
  backCover?: string
}

export type ArticlePayload = {
  _id: string
  title: string
  slug?: {
    current: string
  }
  _type?: string
  backgroundColor?: string
  excerpt?: PortableTextBlock[]
  color?: string
  previewText?: string
  coverImage?: {
    asset: {
      _ref: string
    }
    alt?: string
    caption?: string
  }

  date: string
  content: Array<
    | {
        _type: 'block'
        children: Array<{ text: string }>
      }
    | {
        _type: 'image'
        asset: {
          _ref: string
        }
        alt?: string
        caption?: string
      }
    | {
        _type: 'embed'
        url: string
      }
  >
}

export interface CollectionPayload {
  _id: string
  image: any
  title: string
  artists: string[]
  releaseDate: string
  genres: string[]
  description: PortableTextBlock[]
  tracklist: Track[]
  credits: Credits
  backgroundColor: {
    hex: string
  }
  slug?: {
    current: string
  }
  noteDrawing?: {
    _id: string
    title?: string
    image: string
  }
  _type?: string
  overview?: PortableTextBlock[]
  releases: ReleasePayload[]
}

export interface Track {
  title: string
  duration: string
}

export interface Credits {
  writtenBy: string[]
  masteringBy: string
  photoAndDrawingBy: string[]
  graphicDesign: string
  text: string
}

export interface ProjectPayload {
  client?: string
  coverImage?: Image
  description?: PortableTextBlock[]
  duration?: {
    start?: string
    end?: string
  }
  overview?: PortableTextBlock[]
  site?: string
  slug: string
  tags?: string[]
  title?: string
}

export interface SettingsPayload {
  footer?: PortableTextBlock[]
  menuItems?: MenuItem[]
  ogImage?: Image
  artists?: ArtistPayload[]
  collections?: CollectionPayload[]
}

export type MerchPayload = {
  _id: string
  name: string
  price: number
  stock: number
  type: 'vinyl' | 'tapes' | 'clothes' | 'bibelots'
  photo: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  artist?: string // For VINYL and TAPES
  design?: string // For CLOTHES and BIBELOTS
}
