import { LuMenu } from 'react-icons/lu'
import { defineField, defineType } from 'sanity'

const menuSections = [
  { name: 'artists', title: 'Artists' },
  { name: 'collections', title: 'Collections' },
  { name: 'blog', title: 'Blog' },
  { name: 'merch', title: 'Merch' },
  { name: 'info', title: 'Info' },
  { name: 'releases', title: 'Releases' },
  { name: 'projects', title: 'Projects' },
]

const menuSectionFields = menuSections.map(({ name, title }) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'backgroundColor',
        title: 'Menu Background Color',
        type: 'color',
        description: 'Used for menu hover overlays and section menu bars.',
        options: {
          disableAlpha: true,
        },
      }),
      defineField({
        name: 'textColor',
        title: 'Menu Text Color',
        type: 'color',
        description: 'Used for menu labels and submenu links.',
        options: {
          disableAlpha: true,
        },
      }),
      defineField({
        name: 'image',
        title: 'Overlay Image',
        type: 'reference',
        description:
          'Shown centered across the full screen while this menu item is hovered.',
        to: [{ type: 'drawingsBank' }],
        options: {
          filter: 'category == $category',
          filterParams: { category: 'menuImages' },
        },
      }),
      defineField({
        name: 'overlayImageFit',
        title: 'Overlay Image Fit',
        type: 'string',
        description:
          'Contain shows the complete artwork. Cover fills the screen and may crop its edges.',
        initialValue: 'contain',
        options: {
          list: [
            { title: 'Contain — show the whole image', value: 'contain' },
            { title: 'Cover — fill the screen', value: 'cover' },
          ],
          layout: 'radio',
        },
      }),
    ],
  }),
)

export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  icon: LuMenu,
  fields: [
    defineField({
      name: 'sections',
      title: 'Menu Sections',
      type: 'object',
      fields: menuSectionFields,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu',
      }
    },
  },
})
