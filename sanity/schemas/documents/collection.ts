import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  groups: [
    {
      name: 'info',
      title: 'Collection Info',
      default: true,
    },
    {
      name: 'design',
      title: 'Design & Layout',
    },
    {
      name: 'releases',
      title: 'Releases',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'info',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'info',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'design',
      options: {
        disableAlpha: true, // Disable alpha channel if not needed
      },
    }),
    defineField({
      name: 'titleColor',
      title: 'Collection Title Color',
      type: 'color',
      group: 'design',
      description:
        'Optional color for the large animated collection title. Falls back to the default text color when empty.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'titleScale',
      title: 'Title Size (%)',
      type: 'number',
      group: 'design',
      description:
        'Optional. Leave empty to fit the animated title to its column automatically, or set a custom scale.',
      validation: (rule) => rule.min(50).max(120),
    }),
    defineField({
      name: 'layout',
      title: 'Column Layout',
      type: 'string',
      group: 'design',
      description:
        'Choose the text side. The animated title follows the description column automatically.',
      options: {
        list: [
          { title: 'Text Left', value: 'left' },
          { title: 'Text Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Notes Drawing',
      type: 'reference',
      group: 'design',
      to: [{ type: 'drawingsBank' }],
      description: 'Select a note drawing from the Drawings Bank.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'notes' },
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'info',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'releases',
      title: 'Releases',
      type: 'array',
      group: 'releases',
      of: [
        {
          type: 'reference',
          to: { type: 'release' },
        },
      ],
    }),
  ],
})
