'use client'
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/studio/[[...index]]/page.tsx` route
 */

import { colorInput } from '@sanity/color-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'

import { apiVersion, dataset, projectId, studioUrl } from '@/sanity/lib/api'
import * as resolve from '@/sanity/plugins/resolve'
import { pageStructure, singletonPlugin } from '@/sanity/plugins/settings'
import artist from '@/sanity/schemas/documents/artist'
import collection from '@/sanity/schemas/documents/collection'
import page from '@/sanity/schemas/documents/page'
import project from '@/sanity/schemas/documents/project'
import release from '@/sanity/schemas/documents/release'
import duration from '@/sanity/schemas/objects/duration'
import milestone from '@/sanity/schemas/objects/milestone'
import timeline from '@/sanity/schemas/objects/timeline'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'

import StudioLogo from './components/global/StudioLogo'
import article from './sanity/schemas/documents/article'
import drawings from './sanity/schemas/documents/drawings'
import images from './sanity/schemas/documents/images'
import merch from './sanity/schemas/documents/merch'
import info from './sanity/schemas/singletons/info'

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Le Pacifique Records'

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || '',
  dataset: dataset || '',
  title,
  icon: StudioLogo,
  schema: {
    // If you want more content types, you can add them to this array
    types: [
      // Singletons
      home,
      settings,
      info,
      // Documents
      duration,
      page,
      project,
      artist,
      collection,
      release,
      article,
      merch,
      images,
      drawings,
      // Objects
      milestone,
      timeline,
    ],
  },
  plugins: [
    structureTool({
      structure: pageStructure([home, settings]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([home.name, settings.name, info.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    colorInput(),
  ],
})
