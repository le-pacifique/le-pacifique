import { defineField, defineType } from 'sanity'
import { LuHouse } from 'react-icons/lu'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: LuHouse,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description:
        'Overrides the default Home background color from Settings > Theme.',
      options: {
        disableAlpha: true, // Disable alpha channel if not needed
      },
    }),
    defineField({
      name: 'textColor',
      title: 'Title Color',
      type: 'color',
      description: 'Controls the big homepage title color.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Drawing',
      type: 'reference',
      to: [{ type: 'drawingsBank' }],
      description: 'Overrides the default Home drawing from Settings > Theme.',
    }),
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
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
      description: 'Select one or more logos from the Drawings Bank.',
    }),
  ],
})
