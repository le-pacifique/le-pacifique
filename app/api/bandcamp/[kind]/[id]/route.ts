import { NextResponse } from 'next/server'

import { parseBandcampPlayer } from '@/lib/bandcamp'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; id: string }> },
) {
  const { kind, id } = await params
  if (!['album', 'track'].includes(kind) || !/^\d{1,12}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid release' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://bandcamp.com/EmbeddedPlayer/${kind}=${id}/size=small/`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(10_000) },
    )
    if (!response.ok) throw new Error('Bandcamp is unavailable')
    const album = parseBandcampPlayer(await response.text())
    return NextResponse.json(album, {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load this release. Please listen on Bandcamp.' },
      { status: 502 },
    )
  }
}
