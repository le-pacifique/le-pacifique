import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-06-21' })

const refs = {
  artists: 'dd4276fa-d28a-4e6a-a730-c4f850f1809d',
  collections: 'dd93cda7-2d17-4125-ba3b-c844b5569c4c',
  blog: '2dba168b-e506-488d-a8c7-ebcce1e113b0',
  merch: '39178287-b65b-4276-a9f2-60de978e0557',
}

const sectionColors = {
  artists: '#F1FB84',
  collections: '#c5e1a5',
  blog: '#9E9E9E',
  merch: '#EED5F4',
  info: '#C6F042',
  releases: '#C6F042',
  projects: '#C2D9C7',
}

function color(hex: string) {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  const lightness = (max + min) / 2
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  const value = max
  const hsvSaturation = max === 0 ? 0 : delta / max
  let hue = 0

  if (delta !== 0) {
    if (max === rn) hue = 60 * (((gn - bn) / delta) % 6)
    if (max === gn) hue = 60 * ((bn - rn) / delta + 2)
    if (max === bn) hue = 60 * ((rn - gn) / delta + 4)
  }

  if (hue < 0) hue += 360

  return {
    _type: 'color',
    hex,
    alpha: 1,
    hsl: {
      _type: 'hslaColor',
      h: hue,
      s: saturation,
      l: lightness,
      a: 1,
    },
    hsv: {
      _type: 'hsvaColor',
      h: hue,
      s: hsvSaturation,
      v: value,
      a: 1,
    },
    rgb: {
      _type: 'rgbaColor',
      r,
      g,
      b,
      a: 1,
    },
  }
}

function drawingRef(id: string) {
  return {
    _type: 'reference',
    _ref: id,
  }
}

async function main() {
  const transaction = client.transaction()

  Object.values(refs).forEach((id) => {
    transaction.patch(id, (patch) => patch.set({ category: 'menuImages' }))
  })

  transaction.createOrReplace({
    _id: 'menu',
    _type: 'menu',
    sections: {
      artists: {
        backgroundColor: color(sectionColors.artists),
        textColor: color('#000000'),
        image: drawingRef(refs.artists),
      },
      collections: {
        backgroundColor: color(sectionColors.collections),
        textColor: color('#000000'),
        image: drawingRef(refs.collections),
      },
      blog: {
        backgroundColor: color(sectionColors.blog),
        textColor: color('#000000'),
        image: drawingRef(refs.blog),
      },
      merch: {
        backgroundColor: color(sectionColors.merch),
        textColor: color('#000000'),
        image: drawingRef(refs.merch),
      },
      info: {
        backgroundColor: color(sectionColors.info),
        textColor: color('#000000'),
      },
      releases: {
        backgroundColor: color(sectionColors.releases),
        textColor: color('#000000'),
      },
      projects: {
        backgroundColor: color(sectionColors.projects),
        textColor: color('#000000'),
      },
    },
  })

  transaction.delete('drafts.menu')

  await transaction.commit()
  console.log('Menu singleton populated.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
