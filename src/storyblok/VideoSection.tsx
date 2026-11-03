'use client'
import * as React from 'react'
import { useState } from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import StoryblokImage from '../components/StoryblokImage'
import type { VideoSectionContent } from '../content'
import RichTextView from '../components/RichText'
import { storyblokImageUrl } from '../lib/storyblokImage'
import { backgroundColor } from './backgroundColorClass'
import Button from './Button'

export type VideoSectionProps = {
  blok: VideoSectionContent
}

/**
 * Extracts the 11-character video id from any common YouTube URL:
 * watch?v=, youtu.be/, shorts/, embed/, live/.
 */
export const youtubeId = (url?: string): string | undefined => {
  if (!url) return undefined
  const match = url
    .trim()
    .match(
      /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    )
  return match?.[1]
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 68 48"
      className="w-[68px] h-12 drop-shadow-lg"
      aria-hidden="true"
    >
      <path
        d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.3 34 .3 34 .3s-21.2 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6c5.3 1.4 26.5 1.4 26.5 1.4s21.2 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z"
        fill="var(--brand-primary)"
      />
      <path
        d="M45 24 27 14v20z"
        fill="#fff"
      />
    </svg>
  )
}

function YouTubePlayer(props: {
  id: string
  title: string
  poster?: string
}) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0`}
        title={props.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  }

  // Facade: no YouTube scripts or cookies until the visitor clicks play.
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${props.title}`}
      className="group absolute inset-0 w-full h-full flex items-center justify-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={props.poster ?? `https://i.ytimg.com/vi/${props.id}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="relative transition-transform duration-200 group-hover:scale-110">
        <PlayIcon />
      </span>
    </button>
  )
}

function VideoSection(props: VideoSectionProps) {
  const blok = props.blok
  const title = blok.videoTitle || blok.headline || 'Video'
  // Poster cropped to the 16:9 player around the editor's focus point.
  const poster = blok.poster?.filename
    ? storyblokImageUrl(blok.poster.filename, {
        width: 1280,
        height: 720,
        focus: blok.poster.focus,
      })
    : undefined
  const ytId = blok.videoSource === 'youtube' ? youtubeId(blok.youtubeUrl) : undefined
  const assetUrl =
    blok.videoSource === 'asset' ? blok.videoAsset?.filename || undefined : undefined

  let media: React.ReactNode = null
  if (ytId) {
    media = (
      <YouTubePlayer
        id={ytId}
        title={title}
        poster={poster}
      />
    )
  } else if (assetUrl) {
    media = (
      <video
        className="absolute inset-0 w-full h-full object-cover bg-black"
        src={assetUrl}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        title={title}
      />
    )
  } else if (poster) {
    media = (
      <StoryblokImage
        asset={blok.poster!}
        ratio={16 / 9}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    )
  } else {
    media = (
      <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm bg-stone-100">
        Add a YouTube URL or a video from the Asset Library
      </div>
    )
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className={`self-stretch flex justify-center ${backgroundColor(blok.backgroundColor ?? 'white')}`}
    >
      <div
        className={`w-full max-w-7xl px-6 py-12 md:px-12 md:py-20 lg:px-20 flex flex-col gap-10 md:gap-16 items-center ${
          blok.videoPosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'
        }`}
      >
        <div className="flex-1 flex flex-col items-start gap-6">
          {blok.headline || blok.headlineSecondLine ? (
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {blok.headline ? (
                <span className="block text-[var(--brand-primary)]">{blok.headline}</span>
              ) : null}
              {blok.headlineSecondLine ? (
                <span className="block text-stone-800">{blok.headlineSecondLine}</span>
              ) : null}
            </h2>
          ) : null}
          {blok.description ? (
            <div className="text-lg text-stone-700 [&_.rich-text_p]:my-0">
              <RichTextView doc={blok.description} />
            </div>
          ) : null}
          {blok.buttons?.length ? (
            <div className="flex gap-3 flex-wrap">
              {blok.buttons.map((button) => (
                <Button
                  key={button._uid}
                  blok={button}
                  className="!self-start !px-8 !py-4 !text-base"
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex-1 w-full">
          <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-sm">
            {media}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoSection
