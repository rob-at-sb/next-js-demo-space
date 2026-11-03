import * as React from 'react'
import type { HeaderContent } from '../content'
import AppBar from '../components/AppBar'

export type HeaderProps = {
  blok: HeaderContent
}

/**
 * Renders the `common/header` story on its own, so editors get a live preview
 * of the global header in the Visual Editor.
 */
function Header(props: HeaderProps) {
  return (
    <div className="flex flex-col items-stretch min-h-screen bg-stone-100">
      <AppBar header={props.blok} />
      <p className="p-10 text-center text-stone-500 text-sm">
        Global header. Changes here appear on every page.
      </p>
    </div>
  )
}

export default Header
