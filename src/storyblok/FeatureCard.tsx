import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import Link from 'next/link'
import StoryblokImage from '../components/StoryblokImage'
import type { FeatureCardContent, FeatureCardsContent } from '../content'
import { linkHref } from './linkHref'

export type FeatureCardProps = {
  blok: FeatureCardContent
  /** Set by the parent Feature Cards section. */
  imageBackground?: FeatureCardsContent['imageBackground']
}

export const imageBackgroundClass = {
  brandPrimary: 'bg-[var(--brand-primary)]',
  brandSecondary: 'bg-[var(--brand-secondary)]',
  brandLight: 'bg-[var(--brand-light)]',
  grey: 'bg-[#f5f5f7]',
}

function FeatureCard(props: FeatureCardProps) {
  const blok = props.blok
  const href = blok.link ? linkHref(blok.link) : '#'
  const hasLink = href !== '#' && href !== ''

  const inner = (
    <>
      {/* Without an image the card is text-only (e.g. a list of quick links). */}
      {blok.image?.filename ? (
        <div
          className={`relative aspect-[16/9] overflow-hidden ${
            imageBackgroundClass[props.imageBackground ?? 'brandPrimary']
          }`}
        >
          <StoryblokImage
            asset={blok.image}
            ratio={blok.imageFit === 'cover' ? 16 / 9 : undefined}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`${
              blok.imageFit === 'cover' ? 'object-cover' : 'object-contain'
            } transition-transform duration-300 group-hover:scale-105`}
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={`h-1.5 ${imageBackgroundClass[props.imageBackground ?? 'brandPrimary']}`}
        />
      )}
      <div className="flex flex-col gap-3 p-6 md:p-8">
        <h3 className="text-2xl font-extrabold text-stone-900">
          {blok.title}
          {hasLink ? (
            <span
              aria-hidden="true"
              className="inline-block ml-2 text-xl transition-transform duration-200 group-hover:translate-x-1"
            >
              ›
            </span>
          ) : null}
        </h3>
        {blok.description ? (
          <p className="text-lg text-stone-700 leading-relaxed">{blok.description}</p>
        ) : null}
      </div>
    </>
  )

  const cardClass =
    'group flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]'

  return hasLink ? (
    <Link
      {...storyblokEditable(blok)}
      href={href}
      target={blok.link?.target}
      rel={blok.link?.linktype === 'url' ? 'noopener noreferrer' : undefined}
      className={cardClass}
    >
      {inner}
    </Link>
  ) : (
    <article
      {...storyblokEditable(blok)}
      className={cardClass}
    >
      {inner}
    </article>
  )
}

export default FeatureCard
