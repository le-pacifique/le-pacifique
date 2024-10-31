import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'merch',
  title: 'Merch',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Vinyl', value: 'vinyl' },
          { title: 'Tapes', value: 'tapes' },
          { title: 'Clothes', value: 'clothes' },
          { title: 'Bibelots', value: 'bibelots' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'string',
      hidden: ({ parent }) =>
        parent.type !== 'vinyl' && parent.type !== 'tapes',
    }),
    defineField({
      name: 'design',
      title: 'Design',
      type: 'string',
      hidden: ({ parent }) =>
        parent.type !== 'clothes' && parent.type !== 'bibelots',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
  ],
})
