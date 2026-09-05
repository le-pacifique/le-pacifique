import { LuImage, LuLink, LuPalette, LuUserRound } from 'react-icons/lu'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  groups: [
    {
      name: 'info',
      title: 'Artist Info',
      icon: LuUserRound,
      default: true,
    },
    {
      name: 'design',
      title: 'Design & Layout',
      icon: LuPalette,
    },
    {
      name: 'media',
      title: 'Media',
      icon: LuImage,
    },
    {
      name: 'links',
      title: 'Links & Contact',
      icon: LuLink,
    },
  ],
  fieldsets: [
    {
      name: 'sectionButtons',
      title: 'Section Button Colors',
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'design',
      options: {
        disableAlpha: true, // Disable alpha channel if not needed
      },
    }),
    defineField({
      name: 'titleColor',
      title: 'Artist Title Color',
      type: 'color',
      group: 'design',
      description:
        'Optional color for the large animated artist title. Falls back to the default text color when empty.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'sectionButtonColor',
      title: 'Accent Color',
      type: 'color',
      group: 'design',
      fieldset: 'sectionButtons',
      description:
        'Optional. Defaults to the Artists theme color. Used for inactive button backgrounds and active button text.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'sectionButtonContrastColor',
      title: 'Contrast Color',
      type: 'color',
      group: 'design',
      fieldset: 'sectionButtons',
      description:
        'Optional. Defaults to black. Used for inactive button text and the active button background.',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Notes Drawing',
      type: 'reference',
      group: 'design',
      to: [{ type: 'drawingsBank' }],
      description: 'Select a note drawing from the Drawings Bank.',
      options: {
        filter: 'category == $category',
        filterParams: { category: 'notes' },
      },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'info',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'info',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Artist Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the image for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'array',
      group: 'info',
      description: 'Main text displayed beside the artist image.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Title', value: 'h1' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
            { title: 'Small heading', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Image caption',
              description: 'Caption displayed below the image.',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
          ],
        }),
        defineArrayMember({
          name: 'htmlEmbed',
          title: 'HTML Embed',
          type: 'object',
          fields: [
            defineField({
              name: 'html',
              title: 'HTML / iframe code',
              type: 'text',
              rows: 6,
              description:
                'Paste trusted embed code here, for example a YouTube iframe.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              html: 'html',
              caption: 'caption',
            },
            prepare({ caption, html }) {
              return {
                title: caption || 'HTML Embed',
                subtitle: html,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'releasesCatalog',
      title: 'Releases Catalog',
      type: 'array',
      group: 'links',
      description:
        'Optional external releases. Sanity releases connected to this artist appear automatically.',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'radioShows',
      title: 'Radio Shows',
      type: 'array',
      group: 'links',
      description: 'Radio appearances, mixes, interviews, or broadcasts.',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Links',
      type: 'array',
      group: 'links',
      description: 'Websites, social profiles, Bandcamp, SoundCloud, and more.',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email Address for Bookings',
      type: 'email',
      group: 'links',
    }),
    defineField({
      name: 'pressKit',
      title: 'Press Kit',
      type: 'array',
      group: 'media',
      of: [
        defineField({
          name: 'pressKitItem',
          type: 'object',
          title: 'Press Kit Item',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
            {
              name: 'file',
              type: 'file',
              title: 'File',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Column Layout',
      type: 'string',
      group: 'design',
      description:
        'Choose the image side. The artist title follows the biography column automatically.',
      options: {
        list: [
          { title: 'Image Left', value: 'left' },
          { title: 'Image Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
  ],
  preview: {
    select: {
      image: 'image',
      layout: 'layout',
      name: 'name',
    },
    prepare({ image, layout, name }) {
      const imageSide = layout === 'left' ? 'left' : 'right'

      return {
        title: name || 'Untitled artist',
        subtitle: `Artist · Image ${imageSide}`,
        media: image,
      }
    },
  },
})
