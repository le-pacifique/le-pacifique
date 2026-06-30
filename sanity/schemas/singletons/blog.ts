import { defineField, defineType } from 'sanity'
import { LuNewspaper } from 'react-icons/lu'

export default defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  icon: LuNewspaper,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Blog',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'Controls the Blog index page background.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'textColor',
      title: 'Text / Title Color',
      type: 'color',
      description: 'Controls the Blog title, calendar, and article list text.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Note Drawing',
      type: 'reference',
      to: [{ type: 'drawingsBank' }],
      description: 'Drawing displayed on the Blog page background.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'notes' },
      },
    }),
  ],
})
