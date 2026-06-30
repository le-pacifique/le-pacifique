import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'
import type { Image } from 'sanity'

import { AnimatedInlineText } from '@/components/shared/AnimatedInlineText'
import ImageBox from '@/components/shared/ImageBox'
import { TimelineSection } from '@/components/shared/TimelineSection'

function getBlockText(value: any) {
  return (
    value?.children
      ?.map((child: any) => (child._type === 'span' ? child.text : ''))
      .join('') || ''
  )
}

function isHtmlSnippet(value: string) {
  const trimmed = value.trim()

  return trimmed.startsWith('<') && trimmed.endsWith('>')
}

function sanitizeEmbedHtml(value?: string) {
  if (!value) return ''

  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+=(["']).*?\1/gi, '')
}

function HtmlEmbed({ caption, html }: { caption?: string; html?: string }) {
  const cleanHtml = sanitizeEmbedHtml(html)
  if (!cleanHtml) return null

  return (
    <div className="my-8">
      <div
        className="aspect-video w-full max-w-4xl overflow-hidden bg-black [&>iframe]:h-full [&>iframe]:w-full"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
      {caption && (
        <p className="mt-2 text-xs leading-tight md:text-sm">{caption}</p>
      )}
    </div>
  )
}

export function CustomPortableText({
  paragraphClasses,
  value,
}: {
  paragraphClasses?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children, value }) => {
        const text = getBlockText(value)
        if (isHtmlSnippet(text)) return <HtmlEmbed html={text} />

        return <p className={paragraphClasses}>{children}</p>
      },
      h1: ({ value }) => (
        <AnimatedInlineText
          as="h1"
          className="mb-5 text-4xl font-black leading-none md:text-6xl"
          text={getBlockText(value)}
        />
      ),
      h2: ({ value }) => (
        <AnimatedInlineText
          as="h2"
          className="mb-4 mt-8 text-3xl font-black leading-none md:text-5xl"
          text={getBlockText(value)}
        />
      ),
      h3: ({ value }) => (
        <AnimatedInlineText
          as="h3"
          className="mb-3 mt-7 text-2xl font-black leading-none md:text-4xl"
          text={getBlockText(value)}
        />
      ),
      h4: ({ value }) => (
        <AnimatedInlineText
          as="h4"
          className="mb-3 mt-6 text-xl font-black leading-none md:text-3xl"
          text={getBlockText(value)}
        />
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-4 border-current pl-4 text-lg leading-snug md:text-2xl">
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a
            className="underline transition hover:opacity-50"
            href={value?.href}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        )
      },
    },
    types: {
      image: ({
        value,
      }: {
        value: Image & { alt?: string; caption?: string }
      }) => {
        return (
          <div className="my-6 space-y-2">
            <ImageBox
              image={value}
              alt={value.alt}
              classesWrapper="relative aspect-[16/9]"
            />
            {value?.caption && (
              <div className="font-sans text-sm text-gray-600">
                {value.caption}
              </div>
            )}
          </div>
        )
      },
      timeline: ({ value }) => {
        const { items } = value || {}
        return <TimelineSection timelines={items} />
      },
      htmlEmbed: ({
        value,
      }: {
        value: { caption?: string; html?: string }
      }) => {
        return <HtmlEmbed caption={value.caption} html={value.html} />
      },
    },
  }

  return <PortableText components={components} value={value} />
}
