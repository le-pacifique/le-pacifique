export interface PlayerTrack {
  id: number
  title: string
  artist: string
  duration: number
  src: string
}

export interface PlayerAlbum {
  title: string
  artist: string
  url: string
  tracks: PlayerTrack[]
}

export function getBandcampEmbedPath(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'bandcamp.com')
      return null
    const match = url.pathname.match(
      /^\/EmbeddedPlayer\/(album|track)=(\d+)(?:\/|$)/,
    )
    return match ? `${match[1]}/${match[2]}` : null
  } catch {
    return null
  }
}

function decodeAttribute(value: string) {
  return value.replace(
    /&(#x[\da-f]+|#\d+|quot|apos|amp|lt|gt);/gi,
    (entity, code: string) => {
      const named: Record<string, string> = {
        quot: '"',
        apos: "'",
        amp: '&',
        lt: '<',
        gt: '>',
      }
      if (code.startsWith('#')) {
        const hex = code[1].toLowerCase() === 'x'
        const point = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10)
        return point <= 0x10ffff ? String.fromCodePoint(point) : entity
      }
      return named[code.toLowerCase()] ?? entity
    },
  )
}

function isStreamUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && /^t\d+\.bcbits\.com$/.test(url.hostname)
  } catch {
    return false
  }
}

export function parseBandcampPlayer(html: string): PlayerAlbum {
  const attribute = html.match(/\bdata-player-data=(["'])([\s\S]*?)\1/)?.[2]
  if (!attribute) throw new Error('Bandcamp player data is unavailable')
  const data = JSON.parse(decodeAttribute(attribute))
  if (data.killed || data.album_private)
    throw new Error('Release is unavailable')

  const tracks: PlayerTrack[] = (Array.isArray(data.tracks) ? data.tracks : [])
    .filter(
      (track: any) =>
        track.track_streaming !== false &&
        Number.isSafeInteger(track.id) &&
        typeof track.title === 'string' &&
        Number.isFinite(track.duration) &&
        track.duration > 0 &&
        isStreamUrl(track.file?.['mp3-128']),
    )
    .map((track: any) => ({
      id: track.id,
      title: track.title,
      artist:
        typeof track.artist === 'string' ? track.artist : data.artist || '',
      duration: track.duration,
      src: track.file['mp3-128'],
    }))
  if (!tracks.length) throw new Error('No public streams are available')

  const url = new URL(data.linkback)
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.bandcamp.com')) {
    throw new Error('Invalid Bandcamp release link')
  }

  return {
    title: data.album_title || tracks[0].title,
    artist: data.artist || '',
    url: url.href,
    tracks,
  }
}
