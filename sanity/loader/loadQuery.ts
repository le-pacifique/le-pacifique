import 'server-only'

import type { QueryParams } from '@sanity/client'
import type { QueryResponseInitial } from '@sanity/react-loader'
import * as queryStore from '@sanity/react-loader'
import { draftMode } from 'next/headers'
import { connection } from 'next/server'
import { cache } from 'react'

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

type LoadQueryOptions = NonNullable<Parameters<typeof queryStore.loadQuery>[2]>

const globalForSanityCache = globalThis as typeof globalThis & {
  __lePacifiqueSanityPublishedQueryCache?: Map<
    string,
    QueryResponseInitial<unknown>
  >
}

// Keep the last good published response across Turbopack module reloads. This
// is only a local-development safety net for intermittent VPN/TLS failures;
// draft queries must always come directly from Sanity.
const publishedQueryCache =
  globalForSanityCache.__lePacifiqueSanityPublishedQueryCache ??
  new Map<string, QueryResponseInitial<unknown>>()

if (isDevelopment) {
  globalForSanityCache.__lePacifiqueSanityPublishedQueryCache =
    publishedQueryCache
}

const isNetworkError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false

  const candidate = error as {
    cause?: unknown
    code?: string
    isNetworkError?: boolean
    message?: string
  }

  return (
    candidate.isNetworkError === true ||
    candidate.message === 'fetch failed' ||
    ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN'].includes(
      candidate.code || '',
    ) ||
    isNetworkError(candidate.cause)
  )
}

const createSafeSanityNetworkError = () =>
  new Error(
    'Sanity could not be reached. Check the VPN connection or bypass *.sanity.io and try again.',
  )

// Automatically handle draft mode
export const loadQuery = async <QueryResponseResult>(
  query: string,
  params: QueryParams = {},
  options: LoadQueryOptions = {},
): Promise<QueryResponseInitial<QueryResponseResult>> => {
  const draft = await draftMode()
  const bypassCache = isDevelopment || draft.isEnabled
  if (bypassCache) {
    await connection()
  }

  const { perspective = draft.isEnabled ? 'previewDrafts' : 'published' } =
    options
  // Don't cache by default
  let revalidate: number | false = 0
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
  const queryOptions: LoadQueryOptions = {
    ...options,
    next: {
      ...(options.next || {}),
      revalidate,
    },
    perspective,
    // Enable stega if in Draft Mode, to enable overlays when outside Sanity Studio
    stega: draft.isEnabled,
  }
  const canUseDevelopmentFallback = isDevelopment && perspective === 'published'
  const cacheKey = canUseDevelopmentFallback
    ? JSON.stringify([query, params])
    : undefined
  const rememberPublishedResult = (
    result: QueryResponseInitial<QueryResponseResult>,
  ) => {
    if (cacheKey) {
      publishedQueryCache.set(cacheKey, result as QueryResponseInitial<unknown>)
    }

    return result
  }

  try {
    return rememberPublishedResult(
      await queryStore.loadQuery<QueryResponseResult>(
        query,
        params,
        queryOptions,
      ),
    )
  } catch (error) {
    const canFallBackToCdn = canUseDevelopmentFallback && isNetworkError(error)

    if (!canFallBackToCdn) {
      if (isNetworkError(error)) throw createSafeSanityNetworkError()

      throw error
    }

    console.warn(
      '[Sanity] API connection failed; retrying this published query through the CDN.',
    )

    try {
      return rememberPublishedResult(
        await queryStore.loadQuery<QueryResponseResult>(query, params, {
          ...queryOptions,
          useCdn: true,
        }),
      )
    } catch (cdnError) {
      const cachedResult = cacheKey
        ? publishedQueryCache.get(cacheKey)
        : undefined

      if (cachedResult && isNetworkError(cdnError)) {
        console.warn(
          '[Sanity] API and CDN connections failed; using the last successful published response.',
        )

        return cachedResult as QueryResponseInitial<QueryResponseResult>
      }

      if (isNetworkError(cdnError)) throw createSafeSanityNetworkError()

      throw cdnError
    }
  }
}

/**
 * Loaders that are used in more than one place are declared here, otherwise they're colocated with the component
 */

export const loadSettings = cache(function loadSettings() {
  return loadQuery<SettingsPayload>(
    settingsQuery,
    {},
    { next: { tags: ['settings', 'artist', 'collection', 'drawingsBank'] } },
  )
})

export const loadHomePage = cache(function loadHomePage() {
  return loadQuery<HomePagePayload | null>(
    homePageQuery,
    {},
    { next: { tags: ['home', 'project', 'drawingsBank'] } },
  )
})

export const loadBlog = cache(function loadBlog() {
  return loadQuery<BlogPayload | null>(
    blogQuery,
    {},
    { next: { tags: ['blog', 'drawingsBank'] } },
  )
})

export const loadMenu = cache(function loadMenu() {
  return loadQuery<MenuPayload | null>(
    menuQuery,
    {},
    { next: { tags: ['menu', 'drawingsBank'] } },
  )
})

export const loadProject = cache(function loadProject(slug: string) {
  return loadQuery<ProjectPayload | null>(
    projectBySlugQuery,
    { slug },
    { next: { tags: ['project', `project:${slug}`, 'drawingsBank'] } },
  )
})

export const loadArtist = cache(function loadArtist(slug: string) {
  return loadQuery<ArtistPayload | null>(
    artistBySlugQuery,
    { slug },
    { next: { tags: ['artist', `artist:${slug}`, 'drawingsBank'] } },
  )
})

export const loadCollection = cache(function loadCollection(slug: string) {
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
})

export const loadPage = cache(function loadPage(slug: string) {
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
})

export const loadRelease = cache(function loadRelease(slug: string) {
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
})

export const loadArticle = cache(function loadArticle(slug: string) {
  return loadQuery<ArticlePayload | null>(
    articleBySlugQuery,
    { slug },
    {
      next: {
        tags: ['article', `article:${slug}`, 'blogCategory', 'drawingsBank'],
      },
    },
  )
})

export const loadArticles = cache(function loadArticles() {
  return loadQuery<ArticlePayload[]>(
    articlesQuery,
    {},
    { next: { tags: ['article', 'blogCategory', 'drawingsBank'] } },
  )
})

export const loadMerch = cache(function loadMerch(slug: string) {
  return loadQuery<MerchPayload | null>(
    merchBySlugQuery,
    { slug },
    { next: { tags: ['merch', `merch:${slug}`] } },
  )
})

export const loadInfo = cache(function loadInfo() {
  return loadQuery<InfoPayload | null>(
    infoQuery,
    {},
    { next: { tags: ['info', 'drawingsBank'] } },
  )
})
