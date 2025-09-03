import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'drawingsBank',
  title: 'Drawings Bank',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Logos', value: 'logos' },
          { title: 'Notes', value: 'notes' },
          { title: 'Menu', value: 'menuImages' },
          { title: 'Others', value: 'others' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
})
