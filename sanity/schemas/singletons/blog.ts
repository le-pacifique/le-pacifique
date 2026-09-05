import { LuNewspaper } from 'react-icons/lu'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  icon: LuNewspaper,
  groups: [
    { name: 'content', title: 'Blog Content', default: true },
    { name: 'design', title: 'Design & Layout' },
  ],
  fieldsets: [
    {
      name: 'categoryButtons',
      title: 'Category Button Colors',
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      initialValue: 'Blog',
      description: 'Optional. Leave blank to show the page without a heading.',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'design',
      description: 'Controls the Blog index page background.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'textColor',
      title: 'Text / Title Color',
      type: 'color',
      group: 'design',
      description: 'Controls the Blog title, calendar, and article list text.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Note Drawing',
      type: 'reference',
      group: 'design',
      to: [{ type: 'drawingsBank' }],
      description: 'Drawing displayed on the Blog page background.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'notes' },
      },
    }),
    defineField({
      name: 'layout',
      title: 'Column Layout',
      type: 'string',
      group: 'design',
      description:
        'Choose the article-list side. The animated title follows the article column.',
      initialValue: 'right',
      options: {
        list: [
          { title: 'Articles Left', value: 'left' },
          { title: 'Articles Right', value: 'right' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'titleColor',
      title: 'Blog Title Color',
      type: 'color',
      group: 'design',
      description:
        'Optional color for the large animated Blog title. Falls back to the page text color.',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'categoryButtonColor',
      title: 'Accent Color',
      type: 'color',
      group: 'design',
      fieldset: 'categoryButtons',
      description: 'Background of inactive category buttons.',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'categoryButtonContrastColor',
      title: 'Contrast Color',
      type: 'color',
      group: 'design',
      fieldset: 'categoryButtons',
      description:
        'Text on inactive buttons and the background of the selected button.',
      options: { disableAlpha: true },
    }),
  ],
})
