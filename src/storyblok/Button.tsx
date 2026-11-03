import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import Link from 'next/link'
import type { ButtonContent } from '../content'
import { linkHref } from './linkHref'

export type ButtonProps = {
  blok: ButtonContent
  className?: string
}

const isBrand = (content: ButtonContent): boolean =>
  content.color === 'brandPrimary' || content.color === 'brandSecondary'

const classFromContent = (content: ButtonContent): string =>
  `self-center px-6 py-3 ${
    isBrand(content) ? 'rounded-full' : 'rounded-lg'
  } inline-flex flex-col items-end gap-3 overflow-hidden text-right justify-center text-sm font-semibold leading-tight transition-all duration-300 ease-in-out ${colorStyles(
    content,
  )}`

const colorStyles = (content: ButtonContent): string => {
  switch (content.color) {
    case 'primary':
      return 'bg-stone-900 hover:bg-stone-800 text-white hover:border-stone-800'
    case 'secondary':
      return 'bg-white text-stone-900 hover:bg-stone-100 hover:border-stone-900'
    // Brand colors come from the `common/colors` story via CSS variables
    case 'brandPrimary':
      return 'bg-[var(--brand-primary)] text-[var(--brand-primary-text)] hover:brightness-90'
    case 'brandSecondary':
      return 'bg-[var(--brand-secondary)] text-[var(--brand-secondary-text)] hover:brightness-95'
    default:
      return 'bg-stone-900 hover:bg-stone-800 text-white'
  }
}

function Button(props: ButtonProps) {
  const link = props.blok.link
  if (!link) return null
  const isExternal = link.linktype === 'url' || link.linktype === 'asset'
  return (
    <Link
      {...storyblokEditable(props.blok)}
      href={linkHref(link)}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={link.linktype === 'email' ? undefined : link.target}
      className={`${classFromContent(props.blok)} ${props.className ?? ''}`}
    >
      {props.blok.text}
    </Link>
  )
}

export default Button
