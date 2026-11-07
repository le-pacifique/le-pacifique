'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { getBandcampEmbedPath, getBandcampReleaseUrl, type PlayerAlbum } from '@/lib/bandcamp'

type IconName = 'play' | 'pause' | 'previous' | 'next' | 'volume' | 'muted'

function PlayerIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    play: 'M9 5.5 26 16 9.5 27Z',
    pause: 'M8 5.5 13.5 5 13 27 7.5 27Z M20 5 25.5 5.5 25 27 19.5 26.5Z',
    previous: 'M25 7 14 16 25.5 25Z M13 7 2.5 16 13.5 25Z',
    next: 'M6.5 7 17.5 16 6 25Z M18.5 7 29 16 18 25Z',
    volume:
      'M3 12 9 12 15.5 6 15 26 9 20 3 20Z M21 11Q26 16 21 21 M25 6Q34 16 25 26',
    muted: 'M3 12 9 12 15.5 6 15 26 9 20 3 20Z M22 12 29 21 M29 12 22 21',
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className="release-player-icon"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatTime(seconds: number) {
  const time = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  return `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`
}

interface ReleasePlayerProps {
  embedUrl: string
  title: string
  artist: string
  image?: string
  tracklist?: { title: string; duration: string }[]
}

export default function ReleasePlayer({
  embedUrl,
  title,
  artist,
  image,
  tracklist = [],
}: ReleasePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playWhenReady = useRef(false)
  const [album, setAlbum] = useState<PlayerAlbum | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [mediaDuration, setMediaDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [muted, setMuted] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [playlistOpen, setPlaylistOpen] = useState(false)
  const track = album?.tracks[index]
  const duration = mediaDuration || track?.duration || 0
  const releaseArtist = artist || album?.artist || track?.artist
  const releaseLabel = releaseArtist ? `${releaseArtist} - ${title}` : title

  useEffect(() => {
    const controller = new AbortController()
    const path = getBandcampEmbedPath(embedUrl)
    const releaseUrl = getBandcampReleaseUrl(embedUrl)
    async function load() {
      try {
        if (!path && !releaseUrl) throw new Error('Unsupported Bandcamp link')
        const endpoint = path
          ? `/api/bandcamp/${path}`
          : `/api/bandcamp/release?url=${encodeURIComponent(releaseUrl!)}`
        const response = await fetch(endpoint, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Unable to load tracks')
        const nextAlbum: PlayerAlbum = await response.json()
        if (controller.signal.aborted) return
        setAlbum(nextAlbum)
        setStatus('ready')
      } catch {
        if (controller.signal.aborted) return
        setStatus('error')
        setError('Tracks are unavailable. You can still listen on Bandcamp.')
      }
    }
    void load()
    return () => controller.abort()
  }, [embedUrl, attempt])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = muted
    }
  }, [volume, muted])

  useEffect(() => {
    if (!playWhenReady.current || !audioRef.current) return
    playWhenReady.current = false
    void audioRef.current.play().catch(() => {
      setError('Couldn’t play this track. Retry or listen on Bandcamp.')
    })
  }, [track?.src])

  async function play() {
    const audio = audioRef.current
    if (!audio || !track) return
    setError('')
    try {
      await audio.play()
    } catch {
      playWhenReady.current = false
      setError('Couldn’t play this track. Retry or listen on Bandcamp.')
    }
  }

  function chooseTrack(next: number, autoplay = playing) {
    if (!audioRef.current || !album?.tracks[next]) return
    audioRef.current.pause()
    playWhenReady.current = autoplay
    setTime(0)
    setMediaDuration(0)
    setError('')
    if (next === index) {
      audioRef.current.currentTime = 0
      if (autoplay) void play()
    } else {
      setIndex(next)
    }
  }

  function retry() {
    audioRef.current?.pause()
    playWhenReady.current = false
    setStatus('loading')
    setError('')
    setIndex(0)
    setTime(0)
    setMediaDuration(0)
    setAlbum(null)
    setAttempt((value) => value + 1)
  }

  return (
    <div
      className={`release-player distort relative z-10 w-full shrink-0 ${playlistOpen ? 'release-player-playlist-open' : ''}`}
      data-testid="release-player"
      role="region"
      aria-label={`${title} music player`}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setPlaylistOpen(false)
      }}
    >
      <svg
        className="release-player-outline"
        aria-hidden="true"
        viewBox="0 0 420 216"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M9 7Q84 3 154 6T306 5Q380 4 407 10Q415 12 413 51L415 140Q413 176 411 205Q351 212 276 209L153 211Q69 208 9 207Q3 180 6 132L5 48Q4 18 9 7Z" />
      </svg>

      <div className="release-player-body">
        <div className="release-player-heading">
          {image ? (
            <Image
              src={image}
              alt=""
              width={48}
              height={48}
              className="release-player-thumbnail"
            />
          ) : null}
          <div className="release-player-copy min-w-0 flex-1">
            <span className="release-player-release-label" title={releaseLabel}>
              {releaseLabel}
            </span>
            <span className="release-player-eyebrow">{title}</span>
            <span className="release-player-track">
              {track?.title ||
                (status === 'loading'
                  ? 'Loading tracks…'
                  : 'Listen on Bandcamp')}
            </span>
            <span className="release-player-artist">
              {track?.artist || artist}
            </span>
          </div>
          <a
            className="release-player-bandcamp"
            href={album?.url || embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${title} on Bandcamp`}
          >
            <span className="release-player-bandcamp-logo" aria-hidden="true" />
          </a>
        </div>

        <div className="release-player-progress">
          <span className="release-player-elapsed" aria-hidden="true">
            {formatTime(time)}
          </span>
          <input
            aria-label="Seek"
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            className="release-player-range"
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(time, duration)}
            disabled={!track || status !== 'ready'}
            onChange={(event) => {
              const nextTime = Number(event.target.value)
              if (audioRef.current) audioRef.current.currentTime = nextTime
              setTime(nextTime)
            }}
          />
          <div className="release-player-times" aria-hidden="true">
            <span>{formatTime(time)}</span>
            <span>−{formatTime(duration - time)}</span>
          </div>
        </div>

        <div className="release-player-controls">
          <div className="release-player-transport">
            <button
              type="button"
              aria-label="Previous track"
              disabled={!track || status !== 'ready'}
              onClick={() =>
                chooseTrack(time > 3 ? index : Math.max(0, index - 1))
              }
            >
              <PlayerIcon name="previous" />
            </button>
            <button
              type="button"
              className="release-player-play"
              aria-label={playing ? 'Pause' : 'Play'}
              disabled={!track || status !== 'ready'}
              onClick={() =>
                playing ? audioRef.current?.pause() : void play()
              }
            >
              <PlayerIcon name={playing ? 'pause' : 'play'} />
            </button>
            <button
              type="button"
              aria-label="Next track"
              disabled={
                !album || index >= album.tracks.length - 1 || status !== 'ready'
              }
              onClick={() => chooseTrack(index + 1)}
            >
              <PlayerIcon name="next" />
            </button>
          </div>

          <div className="release-player-footer">
            <button
              type="button"
              className="release-player-mute"
              aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
              onClick={() => {
                if (volume === 0) setVolume(0.75)
                setMuted(!(muted || volume === 0))
              }}
            >
              <PlayerIcon name={muted || volume === 0 ? 'muted' : 'volume'} />
            </button>
            <input
              aria-label="Volume"
              className="release-player-range release-player-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(event) => {
                setVolume(Number(event.target.value))
                setMuted(false)
              }}
            />
            <button
              type="button"
              className="release-player-playlist-toggle"
              aria-label={playlistOpen ? 'Hide playlist' : 'Show playlist'}
              aria-expanded={playlistOpen}
              aria-controls="release-player-playlist"
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setPlaylistOpen(true)
              }}
              onClick={() => setPlaylistOpen(!playlistOpen)}
            >
              {String(index + 1).padStart(2, '0')}/
              {String(album?.tracks.length || tracklist.length).padStart(
                2,
                '0',
              )}
            </button>
          </div>
        </div>
      </div>

      {playlistOpen ? (
        <ol
          id="release-player-playlist"
          className="release-player-playlist release-page-scrollbar"
          aria-label="Playlist"
        >
          {(album?.tracks || tracklist).map((item, trackIndex) => (
            <li key={'id' in item ? item.id : `${item.title}-${trackIndex}`}>
              <button
                type="button"
                className="release-player-playlist-track"
                aria-label={`Play ${item.title}`}
                aria-current={
                  trackIndex === index && album ? 'true' : undefined
                }
                disabled={!album || status !== 'ready'}
                onClick={() => chooseTrack(trackIndex, true)}
              >
                <span
                  className="release-player-playlist-number"
                  aria-hidden="true"
                >
                  {trackIndex === index && playing
                    ? '▷'
                    : String(trackIndex + 1).padStart(2, '0')}
                </span>
                <span className="release-player-playlist-title">
                  {item.title}
                </span>
                <span className="release-player-playlist-duration">
                  {typeof item.duration === 'number'
                    ? formatTime(item.duration)
                    : item.duration}
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {error ? (
        <div className="release-player-error" role="alert">
          <span>{error}</span>{' '}
          <button type="button" onClick={retry}>
            Retry ↗
          </button>
        </div>
      ) : null}
      <span className="sr-only" role="status">
        {status === 'loading'
          ? 'Loading tracks'
          : `${track?.title || title}${playing ? ', playing' : ', paused'}`}
      </span>
      <audio
        ref={audioRef}
        src={track?.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const nextDuration = event.currentTarget.duration
          if (Number.isFinite(nextDuration)) setMediaDuration(nextDuration)
        }}
        onEnded={() => {
          if (album && index < album.tracks.length - 1)
            chooseTrack(index + 1, true)
          else {
            playWhenReady.current = false
            setPlaying(false)
          }
        }}
        onError={() => {
          setPlaying(false)
          setError('Couldn’t load the audio. Retry or listen on Bandcamp.')
        }}
      />
    </div>
  )
}
