import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import type { FeatureCardsContent } from '../content'
import FeatureCard from './FeatureCard'

export type FeatureCardsProps = {
  blok: FeatureCardsContent
}

function FeatureCards(props: FeatureCardsProps) {
  const blok = props.blok
  return (
    <section
      {...storyblokEditable(blok)}
      className="self-stretch flex justify-center bg-white"
    >
      <div className="w-full max-w-7xl px-5 py-12 md:px-12 md:py-20 flex flex-col gap-10">
        {blok.title || blok.description ? (
          <div className="flex flex-col gap-4">
            {blok.title ? (
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-800">
                {blok.title}
              </h2>
            ) : null}
            {blok.description ? (
              <p className="text-lg md:text-xl text-stone-700 max-w-3xl">{blok.description}</p>
            ) : null}
          </div>
        ) : null}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            blok.cards?.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          } gap-6 md:gap-8 items-stretch`}
        >
          {blok.cards?.map((card) => (
            <FeatureCard
              key={card._uid}
              blok={card}
              imageBackground={blok.imageBackground}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards
