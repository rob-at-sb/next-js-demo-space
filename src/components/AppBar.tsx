'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { storyblokEditable } from '@storyblok/react/rsc'
import { HamburgerIcon, BrandIcon } from './icons'
import type { HeaderContent } from '../content'
import Button from '../storyblok/Button'
import { linkHref } from '../storyblok/linkHref'

export type AppbarProps = {
  className?: string
  /** Content of the `common/header` story. Falls back to the template defaults when missing. */
  header?: HeaderContent
}

type NavItem = {
  key: string
  label: string
  href: string
  target?: string
  editable?: Record<string, string>
}

const defaultNavItems: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'services', label: 'Services', href: '/services' },
  { key: 'about', label: 'About', href: '/about' },
]

function AppBarView(props: AppbarProps) {
  const [path, setPath] = useState<string | undefined>(() => undefined)
  const [menuOpen, setMenuOpen] = useState<boolean>(() => false)

  useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  const header = props.header
  const navItems: NavItem[] = header?.navLinks?.length
    ? header.navLinks.map((navLink) => ({
        key: navLink._uid,
        label: navLink.label,
        href: linkHref(navLink.link),
        target: navLink.link?.target,
        editable: storyblokEditable(navLink) as Record<string, string>,
      }))
    : defaultNavItems
  const brandName = header ? header.brandName : 'BrightStart'
  const ctaButtons = header?.ctaButtons ?? []

  const logo = header?.logo?.filename ? (
    <NextImage
      src={header.logo.filename}
      alt={header.logo.alt || brandName || 'Logo'}
      width={84}
      height={56}
      unoptimized
      className="h-12 sm:h-14 w-auto"
    />
  ) : (
    <BrandIcon />
  )

  const defaultCta = (
    <Link
      href="mailto:connect@brightstart.com"
      className="self-center px-4 py-2 rounded-lg inline-flex flex-col items-end gap-2.5 overflow-hidden text-right justify-center text-white text-sm font-semibold leading-tight bg-stone-900 hover:bg-stone-800"
    >
      Get in touch
    </Link>
  )

  const ctas = header
    ? ctaButtons.map((button) => (
        <Button
          key={button._uid}
          blok={button}
          className="!px-4 !py-2"
        />
      ))
    : defaultCta

  return (
    <div
      {...(header ? storyblokEditable(header) : {})}
      className={`relative flex flex-col sm:flex-row items-stretch self-stretch px-4 sm:px-8 md:px-20 py-4 sm:py-0 h-auto sm:h-25 bg-white border-b ${
        header ? 'border-stone-200' : 'border-stone-900'
      } justify-between ${props.className ?? ''}`}
    >
      <div className="flex justify-between items-center py-3 sm:py-0">
        <Link
          href="/"
          className="flex items-center gap-1 sm:gap-1.5"
        >
          {logo}
          {brandName && !header?.logo?.filename ? (
            <div className="text-stone-900 text-lg sm:text-xl font-bold leading-6 sm:leading-7">
              {brandName}
            </div>
          ) : null}
        </Link>
        <div className="sm:hidden flex items-center gap-2">
          {ctas}
          <button
            aria-label="Open menu"
            onClick={(_event) => setMenuOpen(!menuOpen)}
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>
      <div className="hidden sm:flex flex-row items-stretch justify-start gap-6">
        <div className="flex flex-row items-stretch relative justify-start gap-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              {...item.editable}
              href={item.href}
              target={item.target}
              className={`flex items-center text-stone-900 text-sm font-semibold leading-tight transition-border duration-300 ease-in-out border-y-[3px] hover:border-b-[var(--brand-primary)] ${
                path === item.href
                  ? 'border-b-[var(--brand-primary)] border-t-transparent'
                  : ' border-transparent'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">{ctas}</div>
      </div>
      {menuOpen ? (
        <div className="flex flex-col sm:hidden mt-2 gap-2 z-50 absolute top-[72px] left-0 right-0 bg-white shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              target={item.target}
              onClick={(_event) => setMenuOpen(false)}
              className={`flex items-center text-stone-900 hover:text-stone-800 text-base font-semibold leading-tight px-2 py-2 rounded transition-colors duration-200 ${
                path === item.href ? 'bg-stone-100' : ''
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AppBarView
