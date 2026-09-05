import { LuTag } from 'react-icons/lu'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  icon: LuTag,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'For example: Maria’s Reviews, Rants, or News.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Button Color',
      type: 'color',
      description:
        'Used for this category’s button on the Blog page. If empty, the Blog fallback accent color is used.',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used as the stable identifier for this filter.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { color: 'color.hex', title: 'title' },
    prepare({ color, title }) {
      return {
        title: title || 'Untitled category',
        subtitle: color ? `Blog category · ${color}` : 'Blog category',
      }
    },
  },
})
