import type { AssetContent } from '../delivery-api'

/**
 * Storyblok Image Service helpers.
 * Docs: https://www.storyblok.com/docs/api/image-service
 *
 * - Resize/crop:  {filename}/m/{W}x{H}         (0 keeps the aspect ratio)
 * - Focal point:  /filters:focal(X1xY1:X2xY2)  (from the asset's `focus` property)
 * - Filters are chained with a colon:  /filters:focal(...):quality(80)
 */

const STORYBLOK_ASSET = /^https:\/\/a(-[a-z]+)?\.storyblok\.com\/f\//

/** SVGs (and non-Storyblok URLs) are served as-is. */
export const isTransformable = (filename?: string): filename is string =>
  !!filename && STORYBLOK_ASSET.test(filename) && !/\.svg(\?|$)/i.test(filename)

/** Original dimensions, encoded by Storyblok in the asset URL: /f/{space}/{W}x{H}/... */
export const assetSize = (filename?: string): { width: number; height: number } | undefined => {
  const match = filename?.match(/\/f\/\d+\/(\d+)x(\d+)\//)
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined
}

/**
 * Normalises the asset `focus` value to the Image Service format `X1xY1:X2xY2`.
 * Accepts the documented format and the `x1:y1-x2:y2` variant defensively.
 */
export const focalPoint = (focus?: string | null): string | undefined => {
  if (!focus) return undefined
  const value = focus.trim()
  if (/^\d+x\d+:\d+x\d+$/.test(value)) return value
  const alt = value.match(/^(\d+):(\d+)-(\d+):(\d+)$/)
  return alt ? `${alt[1]}x${alt[2]}:${alt[3]}x${alt[4]}` : undefined
}

/** CSS object-position matching the focus point (used as a fallback for CSS cropping). */
export const focusObjectPosition = (asset?: AssetContent): string => {
  const size = assetSize(asset?.filename)
  const focal = focalPoint(asset?.focus)?.match(/^(\d+)x(\d+):(\d+)x(\d+)$/)
  if (!size || !focal) return '50% 50%'
  const x = ((Number(focal[1]) + Number(focal[3])) / 2 / size.width) * 100
  const y = ((Number(focal[2]) + Number(focal[4])) / 2 / size.height) * 100
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`
}

export type ImageServiceOptions = {
  width: number
  /** 0 or undefined keeps the original aspect ratio (no crop). */
  height?: number
  focus?: string | null
  quality?: number
}

/** Builds an Image Service URL. Crops around the focal point when both sizes are set. */
export const storyblokImageUrl = (filename: string, options: ImageServiceOptions): string => {
  if (!isTransformable(filename)) return filename
  // Never upscale, and stay within the Image Service limit (4000 x 4000).
  const original = assetSize(filename)
  const ratio = options.height ? options.width / options.height : 0
  let width = Math.min(options.width, original?.width ?? options.width, 4000)
  let height = ratio ? width / ratio : 0
  if (height && original && height > original.height) {
    height = original.height
    width = height * ratio
  }
  if (height > 4000) {
    height = 4000
    width = height * ratio
  }
  width = Math.round(width)
  height = Math.round(height)
  const filters: string[] = []
  const focal = height > 0 ? focalPoint(options.focus) : undefined
  if (focal) filters.push(`focal(${focal})`)
  filters.push(`quality(${options.quality ?? 80})`)
  return `${filename}/m/${width}x${height}/filters:${filters.join(':')}`
}
