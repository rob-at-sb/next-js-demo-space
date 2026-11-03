'use client'
import * as React from 'react'
import NextImage, { type ImageLoaderProps } from 'next/image'
import type { AssetContent } from '../delivery-api'
import {
  assetSize,
  focusObjectPosition,
  isTransformable,
  storyblokImageUrl,
} from '../lib/storyblokImage'

export type StoryblokImageProps = {
  asset: AssetContent
  /**
   * Aspect ratio (width / height) of the frame the image is shown in.
   * When set, the Image Service crops to this ratio around the asset's focus point.
   * When omitted, the image is only resized (no crop), e.g. for `object-contain`.
   */
  ratio?: number
  /** Use `fill` (parent must be `relative`) or pass width/height. */
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  className?: string
  quality?: number
  priority?: boolean
  alt?: string
}

/**
 * Renders a Storyblok asset through the Storyblok Image Service.
 * Every srcset entry is cropped to `ratio` with `filters:focal(...)`, so the
 * subject chosen by the editor in the Asset Library stays in frame at every size.
 */
function StoryblokImage(props: StoryblokImageProps) {
  const { asset, ratio } = props
  const filename = asset.filename
  const alt = props.alt ?? asset.alt ?? ''
  const size = assetSize(filename)

  const loader = ({ width, quality }: ImageLoaderProps) =>
    storyblokImageUrl(filename, {
      width,
      height: ratio ? width / ratio : 0,
      focus: asset.focus,
      quality: quality ?? props.quality,
    })

  const common = {
    alt,
    sizes: props.sizes,
    priority: props.priority,
    className: props.className,
    // Fallback for any remaining CSS crop (e.g. a frame that changes ratio on mobile).
    // Only when cropping, so `object-contain object-left` etc. are left alone.
    style: ratio ? { objectPosition: focusObjectPosition(asset) } : undefined,
  }

  if (!isTransformable(filename)) {
    // SVG or external URL: serve as-is.
    return props.fill ? (
      <NextImage
        {...common}
        src={filename}
        fill
        unoptimized
      />
    ) : (
      <NextImage
        {...common}
        src={filename}
        width={props.width ?? size?.width ?? 100}
        height={props.height ?? size?.height ?? 100}
        unoptimized
      />
    )
  }

  return props.fill ? (
    <NextImage
      {...common}
      loader={loader}
      src={filename}
      fill
    />
  ) : (
    <NextImage
      {...common}
      loader={loader}
      src={filename}
      width={props.width ?? size?.width ?? 1200}
      height={props.height ?? (ratio && props.width ? Math.round(props.width / ratio) : size?.height ?? 800)}
    />
  )
}

export default StoryblokImage
