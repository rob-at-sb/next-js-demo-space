import * as React from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { storyblokEditable } from '@storyblok/react/rsc'
import type { FooterContent, NavLinkContent } from '../content'
import { linkHref } from '../storyblok/linkHref'

export type SiteFooterProps = {
  /** Content of the `common/footer` story. */
  footer: FooterContent
}

const isExternal = (navLink: NavLinkContent) =>
  navLink.link?.linktype === 'url' && navLink.link?.target === '_blank'

function FooterLink(props: { navLink: NavLinkContent; className?: string }) {
  const { navLink } = props
  return (
    <Link
      {...storyblokEditable(navLink)}
      href={linkHref(navLink.link)}
      target={navLink.link?.target}
      rel={isExternal(navLink) ? 'noopener noreferrer' : undefined}
      className={`text-stone-200 hover:text-white hover:underline underline-offset-4 ${props.className ?? ''}`}
    >
      {navLink.label}
    </Link>
  )
}

/**
 * Global footer driven by the `common/footer` story.
 * Kept deliberately simple: link columns, partner logos, legal links, copyright.
 */
function SiteFooter(props: SiteFooterProps) {
  const footer = props.footer
  const copyright = footer.copyright?.replace('{year}', String(new Date().getFullYear()))

  return (
    <footer
      {...storyblokEditable(footer)}
      className="self-stretch bg-[#2A2A2D] text-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col gap-12">
        {footer.columns?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {footer.columns.map((column) => (
              <div
                key={column._uid}
                {...storyblokEditable(column)}
                className="flex flex-col gap-3"
              >
                <h3 className="text-xl font-bold">{column.title}</h3>
                <ul className="flex flex-col gap-3">
                  {column.links?.map((navLink) => (
                    <li key={navLink._uid}>
                      <FooterLink navLink={navLink} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {footer.partners?.length ? (
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            {footer.partnersTitle ? (
              <h3 className="text-xl font-bold shrink-0">{footer.partnersTitle}</h3>
            ) : null}
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">
              {footer.partners.map((partner) => {
                const content = (
                  <>
                    {partner.logo?.filename ? (
                      <NextImage
                        src={partner.logo.filename}
                        alt={partner.logo.alt || partner.name}
                        width={160}
                        height={54}
                        unoptimized
                        className="h-12 w-auto"
                      />
                    ) : null}
                    {partner.label ? (
                      <span className="text-stone-200 leading-snug max-w-[11rem] whitespace-pre-line">
                        {partner.label}
                      </span>
                    ) : null}
                  </>
                )
                return (
                  <li
                    key={partner._uid}
                    {...storyblokEditable(partner)}
                  >
                    {partner.link && linkHref(partner.link) !== '#' ? (
                      <Link
                        href={linkHref(partner.link)}
                        target={partner.link.target}
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 hover:opacity-80"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4">{content}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>

      {footer.legalLinks?.length || copyright ? (
        <div className="border-t border-stone-600">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footer.legalLinks?.map((navLink) => (
                <li key={navLink._uid}>
                  <FooterLink navLink={navLink} />
                </li>
              ))}
            </ul>
            {copyright ? <p className="text-stone-200 shrink-0">{copyright}</p> : null}
          </div>
        </div>
      ) : null}
    </footer>
  )
}

export default SiteFooter
