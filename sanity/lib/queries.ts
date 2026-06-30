import { groq } from 'next-sanity'

const drawingFields = groq`
  _id,
  title,
  "image": media.asset->url
`

const pageThemeFields = groq`
  backgroundColor,
  textColor,
  "noteDrawing": noteDrawing->{
    ${drawingFields}
  }
`

const menuSectionFields = groq`
  backgroundColor,
  textColor,
  "image": image->{
    ${drawingFields}
  }
`

const settingsThemeFields = groq`
  theme{
    sections{
      home{
        ${pageThemeFields}
      },
      artists{
        ${pageThemeFields}
      },
      collections{
        ${pageThemeFields}
      },
      blog{
        ${pageThemeFields}
      },
      merch{
        ${pageThemeFields}
      },
      info{
        ${pageThemeFields}
      },
      releases{
        ${pageThemeFields}
      },
      projects{
        ${pageThemeFields}
      },
      pages{
        ${pageThemeFields}
      }
    }
  }
`

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    title,
    ${pageThemeFields},
    "logos": logos[]->{
      _id,
      title,
      "image": media.asset->url
    },
    "menuImages": {
          "artists": menuImages.artists->{
            _id,
            title,
            "image": media.asset->url
          },
          "collections": menuImages.collections->{
            _id,
            title,
            "image": media.asset->url
          },
          "blog": menuImages.blog->{
            _id,
            title,
            "image": media.asset->url
          },
          "merch": menuImages.merch->{
            _id,
            title,
            "image": media.asset->url
          },
          "info": menuImages.info->{
            _id,
            title,
            "image": media.asset->url
          }
        },
  }
`

export const blogQuery = groq`
  *[_type == "blog"][0]{
    _id,
    title,
    ${pageThemeFields}
  }
`

export const menuQuery = groq`
  *[_type == "menu"][0]{
    _id,
    "sections": {
      "artists": sections.artists{
        ${menuSectionFields}
      },
      "collections": sections.collections{
        ${menuSectionFields}
      },
      "blog": sections.blog{
        ${menuSectionFields}
      },
      "merch": sections.merch{
        ${menuSectionFields}
      },
      "info": sections.info{
        ${menuSectionFields}
      },
      "releases": sections.releases{
        ${menuSectionFields}
      },
      "projects": sections.projects{
        ${menuSectionFields}
      }
    }
  }
`

export const simplifiedPagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current
  }
`

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    ${pageThemeFields},
    body,
    overview,
    title,
    "slug": slug.current,
    "artists": artists[]->{
      _id,
      name,
      slug,
      image,
      biography,
      links,
      _type
    },
    "collections": collections[]->{
      _id,
      _type,
      title,
      description,
      "artists": artists[]->{
        _id,
        name,
        "slug": slug.current
      },
      releaseDate,
      genres,
      description,
      tracklist[] {
        title,
        duration
      },
      credits {
        writtenBy,
        masteringBy,
        photoAndDrawingBy,
        graphicDesign,
        text
      },
      image,
      slug,
    },
  "articles": articles[]->{
      _id,
      title,
      slug,
      _type,
      ${pageThemeFields},
      excerpt,
      coverImage,
      date,
      content
    },
  "merch": merch[]->{
      _id,
      name,
      type,
      price,
      stock,
      artist,
      design,
      photo {
        asset->{
          _id,
          url
        },
        alt
      },
      slug
    }
  }
`

export const artistBySlugQuery = groq`
  *[_type == "artist" && slug.current == $slug][0] {
    _id,
    biography,
    image,
    links,
    name,
    layout,
    titleColor,
    "slug": slug.current,
    ${pageThemeFields},
    socialMedia,
  }
`

export const collectionBySlugQuery = groq`
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    titleColor,
    ${pageThemeFields},
    description,
    "releases": releases[]->{
      _id,
      title,
      "slug": slug,
      _type,
      "image": image.asset->url,
      "backCover": backCover.asset->url,
      catalogNumber,
      releaseDate,
      genres,
      description,
      tracklist[] {
        title,
        duration
      },
      credits {
        writtenBy,
        masteringBy,
        photoAndDrawingBy,
        graphicDesign,
        text
      },
      bandcampPlayer,
      "artists": artists[]{
        _type == "reference" => @->{
          _id,
          name,
          "slug": slug.current,
          _type
        },
        _type != "reference" => {
          name,
          url,
          _type
        }
      }
    }
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    client,
    coverImage,
    description,
    duration,
    overview,
    ${pageThemeFields},
    site,
    "slug": slug.current,
    tags,
    title,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    footer,
    ${settingsThemeFields},
    menuItems[]->{
      _type,
      "slug": slug.current,
      title
    },
    seo{
      siteTitle,
      description,
      favicon{
        asset->{
          _id,
          url,
          originalFilename,
          mimeType
        }
      },
      appleTouchIcon,
      ogImage
    },
    ogImage,
        "artists": *[_type == "artist"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      _type
    },
    "collections": *[_type == "collection"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      _type
    }
  }
`

export const releaseBySlugQuery = groq`
  *[_type == "release" && slug.current == $slug][0] {
    _id,
    title,
    titleColor,
    "slug": slug.current,
    _type,
    ${pageThemeFields},
    "image": image.asset->url,
    "backCover": backCover.asset->url,
    catalogNumber,
    releaseDate,
    genres,
    description,
    tracklist[] {
      title,
      duration
    },
    credits {
      writtenBy,
      masteringBy,
      photoAndDrawingBy,
      graphicDesign,
      text
    },
    bandcampPlayer,
    "artists": artists[]{
      // If it's a reference, fetch referenced artist fields
      _type == "reference" => @->{
        _id,
        name,
        "slug": slug.current,
        _type
      },
      // If it's an object, just return the object
      _type != "reference" => {
        name,
        url,
        _type
      }
    },
    "collection": *[_type == "collection" && references(^._id)][0] {
      _id,
      title,
      "releases": releases[]-> {
        _id,
        title,
        "slug": slug.current,
        _type,
        "image": image.asset->url
      }
    }
  }
`

export const articlesQuery = groq`
  *[_type == "article"] | order(date desc) {
    _id,
    title,
    slug,
    _type,
    ${pageThemeFields},
    excerpt,
    coverImage,
    date
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    _type,
    ${pageThemeFields},
    excerpt,
    coverImage,
    date,
    content
  }
`

export const merchBySlugQuery = groq`
  *[_type == "merch" && slug.current == $slug][0] {
    _id,
    name,
    type,
    price,
    stock,
    artist,
    design,
    photo {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`

export const infoQuery = groq`
  *[_type == "info"][0] {
    _id,
    title,
    ${pageThemeFields},
    description,
    logos[]->{
      _id,
      title,
      "image": media.asset->url,
      alt
    },
    contactEmail,
    socialMedia[],
    pressKit[]
  }
`
