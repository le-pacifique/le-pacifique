import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-06-21' })
const rootDir = resolve(process.cwd(), '..')

type PortableTextBlock = {
  children?: Array<{ text?: string }>
}

function toPlainText(blocks?: PortableTextBlock[]) {
  return blocks
    ?.map((block) => block.children?.map((child) => child.text).join('') ?? '')
    .filter(Boolean)
    .join('\n\n')
}

async function uploadFileAsset(kind: 'file' | 'image', path: string) {
  const filename = path.split('/').pop()
  return client.assets.upload(kind, createReadStream(path), {
    filename,
    source: {
      id: 'le-pacifique-local-assets',
      name: 'Le Pacifique local assets',
      url: 'https://le-pacifique.sanity.studio',
    },
  })
}

async function main() {
  const [home, settings] = await Promise.all([
    client.fetch(`*[_id == "home"][0]{title, overview}`),
    client.fetch(`*[_id == "settings"][0]{ogImage, seo}`),
  ])

  const [favicon, appleTouchIcon] = await Promise.all([
    uploadFileAsset('file', resolve(rootDir, 'app/favicon.ico')),
    uploadFileAsset('image', resolve(rootDir, 'app/iconpcfq.png')),
  ])

  await client
    .patch('settings')
    .set({
      'seo.siteTitle': settings?.seo?.siteTitle || home?.title || 'Le Pacifique',
      'seo.description':
        settings?.seo?.description || toPlainText(home?.overview) || '',
      'seo.favicon': {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: favicon._id,
        },
      },
      'seo.appleTouchIcon': {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: appleTouchIcon._id,
        },
      },
      'seo.ogImage': settings?.seo?.ogImage ?? settings?.ogImage,
    })
    .commit()

  console.log('Settings SEO populated.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
