import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    overview,
    showcaseProjects[]->{
      _type,
      coverImage,
      overview,
      "slug": slug.current,
      tags,
      title,
    },
    title,
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
      overview,
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
    "slug": slug.current,
  }
`

export const collectionBySlugQuery = groq`
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    backgroundColor,
    description,
    "releases": releases[]->{
      _id,
      title,
      slug,
      _type,
      "image": image.asset->url,
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
      bandcampPlayer
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
    site,
    "slug": slug.current,
    tags,
    title,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    footer,
    menuItems[]->{
      _type,
      "slug": slug.current,
      title
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
    slug,
    _type,
    "image": image.asset->url,
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
    bandcampPlayer
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    _type,
    backgroundColor,
    excerpt,
    coverImage {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    date,
    content[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url
        }
      }
    }
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
