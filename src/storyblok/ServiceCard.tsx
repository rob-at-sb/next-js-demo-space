import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import Link from 'next/link'
import StoryblokImage from '../components/StoryblokImage'
import type { NavLinkContent, ServiceCardContent } from '../content'
import RichTextView from '../components/RichText'
import { linkHref } from './linkHref'

export type ServiceCardProps = {
  blok: ServiceCardContent
  className?: string
}

const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const icons: Record<string, React.ReactNode> = {
  send: (
    <svg {...iconProps}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  ),
  mailbox: (
    <svg {...iconProps}>
      <path d="M4 20V11a4 4 0 0 1 8 0v9" />
      <path d="M8 7h9a4 4 0 0 1 4 4v9H4" />
      <path d="M15 3v8" />
      <path d="M15 3h3v2h-3" />
      <path d="M8 20v2M17 20v2" />
    </svg>
  ),
  parcel: (
    <svg {...iconProps}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  ),
  search: (
    <svg {...iconProps}>
      <circle
        cx="11"
        cy="11"
        r="7"
      />
      <path d="m21 21-5-5" />
    </svg>
  ),
}

function ArrowLink(props: { navLink: NavLinkContent; strong?: boolean }) {
  const { navLink } = props
  return (
    <Link
      {...storyblokEditable(navLink)}
      href={linkHref(navLink.link)}
      target={navLink.link?.target}
      className={`group inline-flex items-center gap-1.5 text-[var(--brand-primary)] hover:underline underline-offset-4 ${
        props.strong ? 'text-lg font-bold' : 'text-lg'
      }`}
    >
      {navLink.label}
      <span
        aria-hidden="true"
        className="text-sm transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  )
}

function ServiceCard(props: ServiceCardProps) {
  const blok = props.blok
  const footer = blok.footerLink?.[0]
  const icon = blok.footerIcon && blok.footerIcon !== 'none' ? icons[blok.footerIcon] : null

  return (
    <article
      {...storyblokEditable(blok)}
      className={`flex flex-col bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden ${props.className ?? ''}`}
    >
      <div className="flex-1 flex flex-col gap-4 p-6 md:p-8">
        {blok.image?.filename ? (
          <div className="relative h-44 md:h-52 mb-4">
            <StoryblokImage
              asset={blok.image}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-contain object-left"
            />
          </div>
        ) : null}
        <h3 className="text-2xl font-extrabold text-stone-900">{blok.title}</h3>
        {blok.description ? (
          <div className="text-lg text-stone-700 leading-relaxed [&_.rich-text_p]:my-0 [&_.rich-text_ul]:my-2 [&_.rich-text_li]:my-2">
            <RichTextView doc={blok.description} />
          </div>
        ) : null}
        {blok.links?.length ? (
          <ul className="flex flex-col gap-4 mt-2">
            {blok.links.map((navLink) => (
              <li key={navLink._uid}>
                <ArrowLink navLink={navLink} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {footer ? (
        <div className="border-t border-stone-200 px-6 md:px-8 py-6 flex items-center gap-3 text-[var(--brand-primary)]">
          {icon}
          <ArrowLink
            navLink={footer}
            strong
          />
        </div>
      ) : null}
    </article>
  )
}

export default ServiceCard
