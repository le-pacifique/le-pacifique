import 'server-only'

import * as queryStore from '@sanity/react-loader'
import { draftMode } from 'next/headers'
import { connection } from 'next/server'

import { client } from '@/sanity/lib/client'
import {
  articleBySlugQuery,
  articlesQuery,
  artistBySlugQuery,
  blogQuery,
  collectionBySlugQuery,
  homePageQuery,
  infoQuery,
  menuQuery,
  merchBySlugQuery,
  pagesBySlugQuery,
  projectBySlugQuery,
  releaseBySlugQuery,
  settingsQuery,
  simplifiedPagesBySlugQuery,
} from '@/sanity/lib/queries'
import { token } from '@/sanity/lib/token'
import {
  ArticlePayload,
  ArtistPayload,
  BlogPayload,
  CollectionPayload,
  HomePagePayload,
  InfoPayload,
  MenuPayload,
  MerchPayload,
  PagePayload,
  ProjectPayload,
  ReleasePayload,
  SettingsPayload,
} from '@/types'

const serverClient = client.withConfig({
  token,
  // Enable stega if it's a Vercel preview deployment, as the Vercel Toolbar has controls that shows overlays
  stega: process.env.VERCEL_ENV === 'preview',
})

/**
 * Sets the server client for the query store, doing it here ensures that all data fetching in production
 * happens on the server and not on the client.
 * Live mode in `sanity/presentation` still works, as it uses the `useLiveMode` hook to update `useQuery` instances with
 * live draft content using `postMessage`.
 */
queryStore.setServerClient(serverClient)

const usingCdn = serverClient.config().useCdn
const isDevelopment = process.env.NODE_ENV === 'development'
// Automatically handle draft mode
export const loadQuery = (async (query, params = {}, options = {}) => {
  const draft = await draftMode()
  const bypassCache = isDevelopment || draft.isEnabled
  if (bypassCache) {
    await connection()
  }

  const { perspective = draft.isEnabled ? 'previewDrafts' : 'published' } =
    options
  // Don't cache by default
  let revalidate: NextFetchRequestConfig['revalidate'] = 0
  if (bypassCache) {
    // Local Studio edits should be visible immediately after refresh.
    // Draft/Presentation mode should also bypass the public-page cache.
    revalidate = 0
  } else if (!usingCdn && Array.isArray(options.next?.tags)) {
    // If `next.tags` is set, and we're not using the CDN, then it's safe to cache.
    revalidate = false
  } else if (usingCdn) {
    revalidate = 60
  }
  return queryStore.loadQuery(query, params, {
    ...options,
    next: {
      ...(options.next || {}),
      revalidate,
    },
    perspective,
    // Enable stega if in Draft Mode, to enable overlays when outside Sanity Studio
    stega: draft.isEnabled,
  })
}) satisfies typeof queryStore.loadQuery

/**
 * Loaders that are used in more than one place are declared here, otherwise they're colocated with the component
 */

export function loadSettings() {
  return loadQuery<SettingsPayload>(
    settingsQuery,
    {},
    { next: { tags: ['settings', 'artist', 'collection', 'drawingsBank'] } },
  )
}

export function loadHomePage() {
  return loadQuery<HomePagePayload | null>(
    homePageQuery,
    {},
    { next: { tags: ['home', 'project', 'drawingsBank'] } },
  )
}

export function loadBlog() {
  return loadQuery<BlogPayload | null>(
    blogQuery,
    {},
    { next: { tags: ['blog', 'drawingsBank'] } },
  )
}

export function loadMenu() {
  return loadQuery<MenuPayload | null>(
    menuQuery,
    {},
    { next: { tags: ['menu', 'drawingsBank'] } },
  )
}

export function loadProject(slug: string) {
  return loadQuery<ProjectPayload | null>(
    projectBySlugQuery,
    { slug },
    { next: { tags: ['project', `project:${slug}`, 'drawingsBank'] } },
  )
}

export function loadArtist(slug: string) {
  return loadQuery<ArtistPayload | null>(
    artistBySlugQuery,
    { slug },
    { next: { tags: ['artist', `artist:${slug}`, 'drawingsBank'] } },
  )
}

export function loadCollection(slug: string) {
  return loadQuery<CollectionPayload | null>(
    collectionBySlugQuery,
    { slug },
    {
      next: {
        tags: [
          'collection',
          `collection:${slug}`,
          'release',
          'artist',
          'drawingsBank',
        ],
      },
    },
  )
}

export function loadPage(slug: string) {
  return loadQuery<PagePayload | null>(
    pagesBySlugQuery,
    { slug },
    {
      next: {
        tags: [
          'page',
          `page:${slug}`,
          'artist',
          'collection',
          'article',
          'merch',
          'drawingsBank',
        ],
      },
    },
  )
}

export function loadRelease(slug: string) {
  return loadQuery<ReleasePayload | null>(
    releaseBySlugQuery,
    { slug },
    {
      next: {
        tags: [
          'release',
          `release:${slug}`,
          'artist',
          'collection',
          'drawingsBank',
        ],
      },
    },
  )
}

export function loadArticle(slug: string) {
  return loadQuery<ArticlePayload | null>(
    articleBySlugQuery,
    { slug },
    { next: { tags: ['article', `article:${slug}`, 'drawingsBank'] } },
  )
}

export function loadArticles() {
  return loadQuery<ArticlePayload[]>(
    articlesQuery,
    {},
    { next: { tags: ['article', 'drawingsBank'] } },
  )
}

export function loadMerch(slug: string) {
  return loadQuery<MerchPayload | null>(
    merchBySlugQuery,
    { slug },
    { next: { tags: ['merch', `merch:${slug}`] } },
  )
}

export function loadInfo() {
  return loadQuery<InfoPayload | null>(
    infoQuery,
    {},
    { next: { tags: ['info', 'drawingsBank'] } },
  )
}
