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

export interface ColorPayload {
  hex?: string
}

export interface DrawingPayload {
  _id?: string
  title?: string
  image?: string
}

export interface PageThemePayload {
  backgroundColor?: ColorPayload | string
  textColor?: ColorPayload | string
  noteDrawing?: DrawingPayload
}

export type SectionThemeKey =
  | 'home'
  | 'artists'
  | 'collections'
  | 'blog'
  | 'merch'
  | 'info'
  | 'releases'
  | 'projects'
  | 'pages'

export interface SettingsThemePayload {
  sections?: Partial<Record<SectionThemeKey, PageThemePayload>>
}

export interface BlogPayload extends PageThemePayload {
  _id: string
  title?: string
}

export interface MenuSectionPayload {
  backgroundColor?: ColorPayload | string
  textColor?: ColorPayload | string
  image?: DrawingPayload
}

export interface MenuPayload {
  _id: string
  sections?: Partial<Record<SectionThemeKey, MenuSectionPayload>>
}

// Page payloads

export interface HomePagePayload extends PageThemePayload {
  footer?: PortableTextBlock[]
  overview?: PortableTextBlock[]
  showcaseProjects?: ShowcaseProject[]
  title?: string
  logo?: {
    _id: string
    title: string
    image: string
  }
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
    info?: { image: string; title?: string } // <-- Add this line
  }
}

export interface PagePayload extends PageThemePayload {
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
  info?: InfoPayload
}

export interface ArtistPayload {
  _id: string
  name: string
  image: any
  biography?: PortableTextBlock[] | string
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
  backgroundColor?: ColorPayload
  titleColor?: ColorPayload
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
  backgroundColor?: ColorPayload
  noteDrawing?: DrawingPayload
  titleColor?: ColorPayload
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
  backgroundColor?: ColorPayload | string
  noteDrawing?: DrawingPayload
  excerpt?: PortableTextBlock[] | string
  color?: string
  previewText?: string
  coverImage?: {
    asset: {
      _ref?: string
      url?: string
    }
    alt?: string
    caption?: string
  }

  date: string
  content?: Array<
    | PortableTextBlock
    | {
        _key?: string
        _type: 'htmlEmbed'
        caption?: string
        html?: string
      }
    | {
        _key?: string
        _type: 'image'
        alt?: string
        asset?: {
          _ref?: string
          url?: string
        }
        caption?: string
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
  backgroundColor?: ColorPayload
  titleColor?: ColorPayload
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
  backgroundColor?: ColorPayload
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
  noteDrawing?: DrawingPayload
}

export interface SettingsPayload {
  footer?: PortableTextBlock[]
  menuItems?: MenuItem[]
  ogImage?: Image
  seo?: {
    siteTitle?: string
    description?: string
    favicon?: {
      asset?: {
        _id?: string
        url?: string
        originalFilename?: string
        mimeType?: string
      }
    }
    appleTouchIcon?: Image
    ogImage?: Image
  }
  theme?: SettingsThemePayload
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

export interface InfoPayload {
  _id: string
  title: string
  backgroundColor?: ColorPayload
  noteDrawing?: DrawingPayload
  description?: Array<{ _type: string; children: Array<{ text: string }> }>
  logos?: Array<
    | {
        _id: string
        title?: string
        image: string
        alt?: string
      }
    | {
        _key: string
        asset: { _ref: string; _type?: string }
        alt?: string
      }
  >
  contactEmail?: string
  socialMedia?: Array<{
    _key?: string
    title: string
    href: string
  }>
  pressKit?: Array<{
    title: string
    file: { asset: { _ref: string; _type?: string } }
  }>
}
