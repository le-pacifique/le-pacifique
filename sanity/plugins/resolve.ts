/**
 * Sets up the Presentation Resolver API,
 * see https://www.sanity.io/docs/presentation-resolver-api for more information.
 */

import { defineDocuments, defineLocations } from 'sanity/presentation'

import { resolveHref } from '@/sanity/lib/utils'

export const mainDocuments = defineDocuments([
  {
    route: '/',
    filter: `_type == "home"`,
  },
  {
    route: '/blog',
    filter: `_type == "blog"`,
  },
  {
    route: '/artists/:slug',
    filter: `_type == "artist" && slug.current == $slug`,
  },
  {
    route: '/collections/:slug',
    filter: `_type == "collection" && slug.current == $slug`,
  },
  {
    route: '/releases/:slug',
    filter: `_type == "release" && slug.current == $slug`,
  },
  {
    route: '/blog/:slug',
    filter: `_type == "article" && slug.current == $slug`,
  },
  {
    route: '/projects/:slug',
    filter: `_type == "project" && slug.current == $slug`,
  },
  {
    route: '/:slug',
    filter: `_type == "page" && slug.current == $slug`,
  },
])

export const locations = {
  settings: defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
    locations: [{ title: 'Home', href: resolveHref('home')! }],
  }),
  home: defineLocations({
    message: 'This document is used to render the front page',
    tone: 'positive',
    locations: [{ title: 'Home', href: resolveHref('home')! }],
  }),
  blog: defineLocations({
    message: 'This document is used to render the blog page',
    tone: 'positive',
    locations: [{ title: 'Blog', href: resolveHref('blog')! }],
  }),
  menu: defineLocations({
    message: 'This document controls the global menu hover colors and images',
    tone: 'caution',
    locations: [{ title: 'Home', href: resolveHref('home')! }],
  }),
  project: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('project', doc?.slug)!,
        },
      ],
    }),
  }),
  page: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('page', doc?.slug)!,
        },
      ],
    }),
  }),
  artist: defineLocations({
    select: { title: 'name', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('artist', doc?.slug)!,
        },
      ],
    }),
  }),
  collection: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('collection', doc?.slug)!,
        },
      ],
    }),
  }),
  release: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('release', doc?.slug)!,
        },
      ],
    }),
  }),
  article: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('article', doc?.slug)!,
        },
      ],
    }),
  }),
  merch: defineLocations({
    select: { title: 'title' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Merch',
          href: resolveHref('merch')!,
        },
      ],
    }),
  }),
  info: defineLocations({
    message: 'This document is used to render the info page',
    tone: 'positive',
    locations: [{ title: 'Info', href: resolveHref('info')! }],
  }),
}
