import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getBandcampEmbedPath, parseBandcampPlayer } from './bandcamp.ts'

const track = {
  id: 1,
  title: 'A. Jardin Side',
  artist: 'Jeunesse 7',
  duration: 1383.92,
  track_streaming: true,
  file: { 'mp3-128': 'https://t4.bcbits.com/stream/track?p=0&token=public' },
}

function embed(overrides = {}) {
  const data = {
    album_title: 'Hobbies & Galore',
    artist: 'Jeunesse 7',
    linkback: 'https://jeunesse7.bandcamp.com/album/hobbies-galore',
    tracks: [track],
    ...overrides,
  }
  const attribute = JSON.stringify(data)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
  return `<script data-player-data="${attribute}"></script>`
}

test('accepts album and track embeds, rejects arbitrary URLs', () => {
  assert.equal(
    getBandcampEmbedPath(
      'https://bandcamp.com/EmbeddedPlayer/album=2194154692/size=small/',
    ),
    'album/2194154692',
  )
  assert.equal(
    getBandcampEmbedPath('https://bandcamp.com/EmbeddedPlayer/track=42/'),
    'track/42',
  )
  for (const url of [
    'https://evil.test/EmbeddedPlayer/album=42/',
    'https://bandcamp.com.evil.test/EmbeddedPlayer/album=42/',
    'http://bandcamp.com/EmbeddedPlayer/album=42/',
    'https://bandcamp.com/EmbeddedPlayer/album=42evil/',
    'not a URL',
  ]) {
    assert.equal(getBandcampEmbedPath(url), null)
  }
})

test('decodes metadata and returns playable tracks without losing stream parameters', () => {
  const album = parseBandcampPlayer(embed())
  assert.equal(album.title, 'Hobbies & Galore')
  assert.equal(album.url, 'https://jeunesse7.bandcamp.com/album/hobbies-galore')
  assert.deepEqual(album.tracks, [
    {
      id: 1,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      src: track.file['mp3-128'],
    },
  ])
})

test('omits restricted tracks and non-Bandcamp stream sources', () => {
  const album = parseBandcampPlayer(
    embed({
      tracks: [
        track,
        { ...track, id: 2, track_streaming: false },
        { ...track, id: 3, file: null },
        {
          ...track,
          id: 4,
          file: { 'mp3-128': 'https://t4.bcbits.com.evil.test/audio.mp3' },
        },
        { ...track, id: 5, duration: -1 },
      ],
    }),
  )
  assert.deepEqual(
    album.tracks.map((item) => item.id),
    [1],
  )
})

test('fails clearly when markup, public streams, or release links are unavailable', () => {
  assert.throws(() => parseBandcampPlayer('<html>Unavailable</html>'))
  assert.throws(() =>
    parseBandcampPlayer('<script data-player-data="broken"></script>'),
  )
  assert.throws(() => parseBandcampPlayer(embed({ album_private: true })))
  assert.throws(() => parseBandcampPlayer(embed({ killed: true })))
  assert.throws(() => parseBandcampPlayer(embed({ tracks: [] })))
  assert.throws(() =>
    parseBandcampPlayer(embed({ linkback: 'https://evil.test' })),
  )
})
