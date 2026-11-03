import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import type { ColorsContent } from '../content'
import { brandStyle } from './brandStyle'

export type ColorsProps = {
  blok: ColorsContent
}

const swatches: {
  label: string
  bg: string
  fg: string
  field: keyof ColorsContent
}[] = [
  { label: 'Primary', bg: '--brand-primary', fg: '--brand-primary-text', field: 'primary' },
  { label: 'Secondary', bg: '--brand-secondary', fg: '--brand-secondary-text', field: 'secondary' },
  { label: 'Light', bg: '--brand-light', fg: '--brand-light-text', field: 'light' },
  { label: 'Accent', bg: '--brand-accent', fg: '--brand-primary-text', field: 'accent' },
]

/**
 * Renders the `common/colors` story as a live palette preview.
 * The CSS variables are applied from the live blok, so edits show instantly.
 */
function Colors(props: ColorsProps) {
  return (
    <div
      {...storyblokEditable(props.blok)}
      style={brandStyle(props.blok)}
      className="min-h-screen bg-white p-6 md:p-16 flex flex-col gap-10"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-stone-900">Brand colors</h1>
        <p className="mt-2 text-stone-600">
          Global palette. Used by every Hero and Button set to a Brand color.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {swatches.map((swatch) => (
          <div
            key={swatch.label}
            className="rounded-2xl overflow-hidden border border-stone-200"
          >
            <div
              className="h-40 p-6 flex items-end text-2xl font-extrabold"
              style={{
                background: `var(${swatch.bg})`,
                color: `var(${swatch.fg})`,
              }}
            >
              {swatch.label}
            </div>
            <div className="p-4 text-sm text-stone-700 font-mono">
              {String(props.blok[swatch.field] ?? '')}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-10 bg-[var(--brand-primary)] text-[var(--brand-primary-text)] flex flex-col gap-4 items-start">
        <h2 className="text-4xl font-extrabold uppercase text-[var(--brand-secondary)]">
          Sample heading
        </h2>
        <p>Body text on the primary color.</p>
        <div className="flex gap-3">
          <span className="px-6 py-3 rounded-full text-sm font-semibold bg-[var(--brand-secondary)] text-[var(--brand-secondary-text)]">
            Secondary button
          </span>
          <span className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-stone-900">
            White button
          </span>
        </div>
      </div>
      <div className="rounded-2xl p-10 bg-[var(--brand-light)] text-[var(--brand-light-text)] flex flex-col gap-4 items-start">
        <h2 className="text-3xl font-extrabold">Light section</h2>
        <span className="px-6 py-3 rounded-full text-sm font-semibold bg-[var(--brand-primary)] text-[var(--brand-primary-text)]">
          Primary button
        </span>
      </div>
    </div>
  )
}

export default Colors
