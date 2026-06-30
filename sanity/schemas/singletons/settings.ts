import { defineArrayMember, defineField, defineType } from 'sanity'
import { LuPanelBottom, LuSearch, LuSettings } from 'react-icons/lu'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: LuSettings,
  groups: [
    {
      name: 'general',
      title: 'General',
      icon: LuSettings,
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: LuSearch,
    },
    {
      name: 'footer',
      title: 'Footer',
      icon: LuPanelBottom,
    },
  ],
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'menuItems',
      title: 'Menu Item list',
      description: 'Links displayed on the header of your site.',
      type: 'array',
      group: 'general',
      of: [
        {
          title: 'Reference',
          type: 'reference',
          to: [
            {
              type: 'home',
            },
            {
              type: 'page',
            },
            {
              type: 'project',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'footer',
      description:
        'This is a block of text that will be displayed at the bottom of the page.',
      title: 'Footer Info',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'block',
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
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      description:
        'Default site metadata used for search, social cards, favicons, and saved-home-screen icons.',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'siteTitle',
          title: 'Site Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          description:
            'Default meta description used when a page does not define its own description.',
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          type: 'file',
          description: 'Browser tab icon. Use an .ico file.',
          options: {
            accept: '.ico,image/png,image/svg+xml',
          },
        }),
        defineField({
          name: 'appleTouchIcon',
          title: 'Apple Touch Icon',
          type: 'image',
          description: 'Icon used when saving the site to an iPhone/iPad home screen.',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Default image for social cards and search result previews.',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
