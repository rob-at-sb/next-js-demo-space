import type { CSSProperties } from 'react'
import type { ColorsContent } from '../content'

const isHex = (value?: string): value is string =>
  !!value && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value.trim())

/**
 * Maps the `common/colors` story to CSS custom properties.
 * Missing or invalid values fall back to the defaults in `globals.css`.
 */
export const brandStyle = (colors?: ColorsContent): CSSProperties => {
  if (!colors) return {}
  const vars: Record<string, string> = {}
  const map: [keyof ColorsContent, string][] = [
    ['primary', '--brand-primary'],
    ['primaryText', '--brand-primary-text'],
    ['secondary', '--brand-secondary'],
    ['secondaryText', '--brand-secondary-text'],
    ['light', '--brand-light'],
    ['lightText', '--brand-light-text'],
    ['accent', '--brand-accent'],
  ]
  for (const [field, cssVar] of map) {
    const value = colors[field]
    if (typeof value === 'string' && isHex(value)) vars[cssVar] = value.trim()
  }
  return vars as CSSProperties
}
