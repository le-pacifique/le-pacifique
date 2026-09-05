import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Article Content', default: true },
    { name: 'publishing', title: 'Publishing & Categories' },
    { name: 'design', title: 'Design' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'design',
      description:
        'Overrides the default Blog background color from Settings > Theme.',
      options: {
        disableAlpha: true, // Disable alpha channel if not needed
      },
    }),
    defineField({
      name: 'noteDrawing',
      title: 'Drawing',
      type: 'reference',
      group: 'design',
      to: [{ type: 'drawingsBank' }],
      description: 'Overrides the default Blog drawing from Settings > Theme.',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      group: 'content',
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
              description: 'Important for SEO and accessiblity.',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      group: 'publishing',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'publishing',
      description:
        'Choose one or more filters for this article. Categories are managed under Blog → Categories.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'blogCategory' }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
})
