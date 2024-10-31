import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { ColorInput } from '@sanity/color-input'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'The background color of the homepage.',
      options: {
        disableAlpha: true, // Disable alpha channel if not needed
      },
    }),
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Description',
      type: 'array',
      of: [
        // Paragraphs
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                  },
                ],
              },
            ],
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
          type: 'block',
        }),
      ],
    }),
    defineField({
      name: 'popupText',
      title: 'Popup Text',
      type: 'text',
      description: 'The text that will be displayed in the popup.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'reference',
      to: [{ type: 'drawingsBank' }],
      description: 'Select a logo from the Drawings Bank.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'logos' },
      },
    }),
  ],
})
