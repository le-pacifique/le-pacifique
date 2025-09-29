import { colorInput } from '@sanity/color-input'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'info',
  title: 'Info',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Note Drawing',
      type: 'reference',
      to: [{ type: 'drawingsBank' }],
      description: 'Select a note drawing from the Drawings Bank.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'notes' },
      },
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text about the label, its philosophy, etc.',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'drawingsBank' }],
          options: {
            filter: 'category == $category',
            filterParams: { category: 'logos' },
          },
        },
      ],
      description: 'Array of label logos or partner logos.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email',
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
            { name: 'title', type: 'string', title: 'Platform' },
            { name: 'href', type: 'url', title: 'URL' },
          ],
        }),
      ],
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
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'file', type: 'file', title: 'File' },
          ],
        }),
      ],
    }),
  ],
})
