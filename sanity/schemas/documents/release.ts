import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  fields: [
    defineField({
      name: 'catalogNumber',
      title: 'Catalog Number',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artists',
      title: 'Artist(s)',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artist' } }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'genres',
      title: 'Genre(s)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tracklist',
      title: 'Tracklist',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'duration', title: 'Duration', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'object',
      fields: [
        {
          name: 'writtenBy',
          title: 'Written by',
          type: 'array',
          of: [{ type: 'string' }],
        },
        { name: 'masteringBy', title: 'Mastering by', type: 'string' },
        {
          name: 'photo',
          title: 'Photo by',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'drawing',
          title: 'Drawing by',
          type: 'array',
          of: [{ type: 'string' }],
        },
        { name: 'graphicDesign', title: 'Graphic Design', type: 'string' },
        { name: 'text', title: 'Text', type: 'string' },
      ],
    }),
    defineField({
      name: 'bandcampPlayer',
      title: 'Bandcamp Player',
      type: 'url',
    }),
  ],
})
