import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useMobileWorkspace } from '../../hooks/useMediaQuery'
import { CollapsibleSidebar } from './CollapsibleSidebar'
import { FloatingTutor } from './FloatingTutor'

export function AppShell() {
  const isMobile = useMobileWorkspace()
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  return (
    <div className={`app-shell-v2 ${navOpen ? 'nav-open' : ''}`}>
      {isMobile ? (
        <>
          <button
            type="button"
            className="mobile-nav-toggle"
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Close course menu' : 'Open course menu'}
            onClick={() => setNavOpen((o) => !o)}
          >
            {navOpen ? '✕' : '☰'}
          </button>
          {navOpen ? (
            <button
              type="button"
              className="mobile-nav-scrim"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
            />
          ) : null}
        </>
      ) : null}
      <CollapsibleSidebar />
      <div className="app-main-column">
        <Outlet />
      </div>
      <FloatingTutor />
    </div>
  )
}
