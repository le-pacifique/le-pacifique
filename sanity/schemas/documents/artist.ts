import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      options: {
        disableAlpha: true, // Disable alpha channel if not needed
      },
    }),
    defineField({
      name: 'titleColor',
      title: 'Artist Title Color',
      type: 'color',
      description:
        'Optional color for the large animated artist title. Falls back to the default text color when empty.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Notes Drawing',
      type: 'reference',
      to: [{ type: 'drawingsBank' }],
      description: 'Select a note drawing from the Drawings Bank.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'notes' },
      },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
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
      name: 'biography',
      title: 'Biography',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Title', value: 'h1' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
            { title: 'Small heading', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Image caption',
              description: 'Caption displayed below the image.',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
          ],
        }),
        defineArrayMember({
          name: 'htmlEmbed',
          title: 'HTML Embed',
          type: 'object',
          fields: [
            defineField({
              name: 'html',
              title: 'HTML / iframe code',
              type: 'text',
              rows: 6,
              description:
                'Paste trusted embed code here, for example a YouTube iframe.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              html: 'html',
              caption: 'caption',
            },
            prepare({ caption, html }) {
              return {
                title: caption || 'HTML Embed',
                subtitle: html,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'releasesCatalog',
      title: 'Releases Catalog',
      type: 'array',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'radioShows',
      title: 'Radio Shows',
      type: 'array',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'array',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email Address for Bookings',
      type: 'email',
    }),
    defineField({
      name: 'pressKit',
      title: 'Press Kit',
      type: 'array',
      of: [
        defineField({
          name: 'pressKitItem',
          type: 'object',
          title: 'Press Kit Item',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
            {
              name: 'file',
              type: 'file',
              title: 'File',
            },
          ],
        }),
      ],
    }),
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Image Left', value: 'left' },
          { title: 'Image Right', value: 'right' },
        ],
        layout: 'radio', // or dropdown
      },
      initialValue: 'right',
    },
  ],
})
