import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageTheme',
  title: 'Page Theme',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'Used as the page background and section menu color.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'textColor',
      title: 'Text / Title Color',
      type: 'color',
      description:
        'Used for section text, menu titles, and large animated titles.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Drawing',
      type: 'reference',
      to: [{ type: 'drawingsBank' }],
      description: 'Drawing displayed on top of the page background.',
    }),
  ],
  preview: {
    select: {
      color: 'backgroundColor.hex',
      textColor: 'textColor.hex',
      drawing: 'noteDrawing.title',
    },
    prepare({ color, textColor, drawing }) {
      return {
        title: color || 'Theme',
        subtitle: [textColor ? `Text ${textColor}` : undefined, drawing]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
