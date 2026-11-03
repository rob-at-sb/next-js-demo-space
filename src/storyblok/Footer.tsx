import * as React from 'react'
import type { FooterContent } from '../content'
import SiteFooter from '../components/SiteFooter'

export type FooterProps = {
  blok: FooterContent
}

/**
 * Renders the `common/footer` story on its own, so editors get a live preview
 * of the global footer in the Visual Editor.
 */
function Footer(props: FooterProps) {
  return (
    <div className="flex flex-col justify-end min-h-screen bg-stone-100">
      <p className="p-10 text-center text-stone-500 text-sm">
        Global footer. Changes here appear on every page.
      </p>
      <SiteFooter footer={props.blok} />
    </div>
  )
}

export default Footer
