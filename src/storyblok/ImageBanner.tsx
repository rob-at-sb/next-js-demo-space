import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import StoryblokImage from '../components/StoryblokImage'
import type { ImageBannerContent } from '../content'
import RichTextView from '../components/RichText'
import Button from './Button'

export type ImageBannerProps = {
  blok: ImageBannerContent
}

const heightClass = {
  small: 'md:min-h-[420px]',
  medium: 'md:min-h-[560px]',
  large: 'md:min-h-[720px]',
}

const cardJustify = {
  left: 'md:justify-start',
  center: 'md:justify-center',
  right: 'md:justify-end',
}

const highlightClass = {
  accent: 'text-[var(--brand-accent)]',
  brandPrimary: 'text-[var(--brand-primary)]',
  dark: 'text-stone-800',
}

function ImageBanner(props: ImageBannerProps) {
  const blok = props.blok
  const position = blok.cardPosition ?? 'right'

  return (
    <section
      {...storyblokEditable(blok)}
      className={`relative self-stretch flex flex-col md:flex-row md:items-center ${
        heightClass[blok.height ?? 'medium']
      } ${cardJustify[position]} md:px-12 lg:px-24 md:py-16`}
    >
      {blok.image?.filename ? (
        <div className="relative h-64 sm:h-80 md:absolute md:inset-0 md:h-auto">
          <StoryblokImage
            asset={blok.image}
            ratio={blok.height === 'large' ? 2 : blok.height === 'small' ? 3.4 : 2.6}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-stone-200" />
      )}
      <div className="relative z-10 bg-white md:rounded-xl md:shadow-sm p-8 md:p-12 w-full md:max-w-xl flex flex-col items-start gap-6">
        {blok.headline || blok.headlineHighlight ? (
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-stone-800">
            {blok.headline}{' '}
            {blok.headlineHighlight ? (
              <span className={highlightClass[blok.highlightColor ?? 'accent']}>
                {blok.headlineHighlight}
              </span>
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
    </section>
  )
}

export default ImageBanner
