import { NextResponse } from 'next/server'

import { getBandcampEmbedPathFromPage, getBandcampReleaseUrl, parseBandcampPlayer } from '@/lib/bandcamp'

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get('url') || ''
  const url = getBandcampReleaseUrl(value)
  if (!url) return NextResponse.json({ error: 'Invalid Bandcamp release' }, { status: 400 })

  try {
    const options = {
      next: { revalidate: 300 },
      redirect: 'error' as const,
      signal: AbortSignal.timeout(15_000),
    }
    const page = await fetch(url, options)
    if (!page.ok) throw new Error('Bandcamp release is unavailable')
    const path = getBandcampEmbedPathFromPage(await page.text())
    const [kind, id] = path.split('/')
    const player = await fetch(
      `https://bandcamp.com/EmbeddedPlayer/${kind}=${id}/size=small/`,
      { ...options, signal: AbortSignal.timeout(10_000) },
    )
    if (!player.ok) throw new Error('Bandcamp player is unavailable')
    return NextResponse.json(parseBandcampPlayer(await player.text()), {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
    })
  } catch {
    return NextResponse.json({ error: 'Unable to load this Bandcamp release.' }, { status: 502 })
  }
}
