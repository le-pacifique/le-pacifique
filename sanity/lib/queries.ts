import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    overview,
    title,
    backgroundColor,
    popupText,
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
          }
        },
    popupText
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
    layout,
    "slug": slug.current,
    "noteDrawing": noteDrawing->{
      _id,
      title,
      "image": media.asset->url
    },
    backgroundColor,
    socialMedia,
  }
`

export const collectionBySlugQuery = groq`
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    backgroundColor,
    description,
    "noteDrawing": noteDrawing->{
      _id,
      title,
      "image": media.asset->url
    },    
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
    "slug": slug.current,
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
