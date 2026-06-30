import { colorInput } from '@sanity/color-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'

import { pageStructure, singletonPlugin } from '../sanity/plugins/settings'
import article from '../sanity/schemas/documents/article'
import artist from '../sanity/schemas/documents/artist'
import collection from '../sanity/schemas/documents/collection'
import drawings from '../sanity/schemas/documents/drawings'
import images from '../sanity/schemas/documents/images'
import merch from '../sanity/schemas/documents/merch'
import page from '../sanity/schemas/documents/page'
import project from '../sanity/schemas/documents/project'
import release from '../sanity/schemas/documents/release'
import duration from '../sanity/schemas/objects/duration'
import milestone from '../sanity/schemas/objects/milestone'
import pageTheme from '../sanity/schemas/objects/pageTheme'
import timeline from '../sanity/schemas/objects/timeline'
import blog from '../sanity/schemas/singletons/blog'
import home from '../sanity/schemas/singletons/home'
import info from '../sanity/schemas/singletons/info'
import menu from '../sanity/schemas/singletons/menu'
import settings from '../sanity/schemas/singletons/settings'
import * as resolve from './src/resolve'
import StudioLogo from './src/StudioLogo'

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'wz2tqa8c'
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production'
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2023-06-21'
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Le Pacifique Records',
  icon: StudioLogo,
  projectId,
  dataset,
  schema: {
    types: [
      home,
      blog,
      menu,
      settings,
      info,
      artist,
      collection,
      release,
      article,
      project,
      page,
      merch,
      drawings,
      images,
      duration,
      milestone,
      timeline,
      pageTheme,
    ],
  },
  plugins: [
    structureTool({
      structure: pageStructure([home, blog, menu, settings, info]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    singletonPlugin([home.name, blog.name, menu.name, settings.name, info.name]),
    unsplashImageAsset(),
    visionTool({ defaultApiVersion: apiVersion }),
    colorInput(),
  ],
})
