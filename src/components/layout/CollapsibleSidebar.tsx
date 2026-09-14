import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { chaptersInPhase, curriculumPhases } from '../../content/curriculumPhases'
import { isChapterComplete } from '../../lib/progress'

export function CollapsibleSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [openPhase, setOpenPhase] = useState<string | null>(() => {
    const m = location.pathname.match(/\/chapter\/([^/]+)/)
    if (!m) return 'foundations'
    const slug = m[1]
    const phase = curriculumPhases.find((p) =>
      chaptersInPhase(p.id).some((c) => c.slug === slug),
    )
    return phase?.id ?? 'foundations'
  })

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/'
    return location.pathname.includes(path)
  }

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-head">
        <Link to="/" className="brand-mark" title="LLM101n Storyteller">
          <span className="brand-icon" aria-hidden>S</span>
          {!collapsed ? (
            <span className="brand-text">LLM101n — Build a Storyteller</span>
          ) : null}
        </Link>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar-primary">
        <Link
          to="/"
          className={
            isActive('/') &&
            !location.pathname.includes('chapter') &&
            !location.pathname.includes('prerequisites')
              ? 'active'
              : ''
          }
        >
          Course modules
        </Link>
        <Link to="/prerequisites" className={isActive('prerequisites') ? 'active' : ''}>
          Prerequisites
        </Link>
        <Link to="/learning-plan" className={isActive('learning-plan') ? 'active' : ''}>
          Learning plan
        </Link>
        <Link to="/appendix" className={isActive('appendix') ? 'active' : ''}>
          Resources
        </Link>
      </nav>

      {!collapsed ? (
        <div className="sidebar-phases">
          {curriculumPhases.map((phase) => {
            const open = openPhase === phase.id
            return (
              <div key={phase.id} className={`phase-nav phase-theme-${phase.theme}`}>
                <button
                  type="button"
                  className="phase-nav-toggle"
                  onClick={() => setOpenPhase(open ? null : phase.id)}
                  aria-expanded={open}
                >
                  Phase {phase.number}: {phase.title}
                </button>
                {open ? (
                  <ul className="phase-chapters">
                    {chaptersInPhase(phase.id).map((ch) => {
                      const path = `/chapter/${ch.slug}`
                      const active = location.pathname === path || location.pathname.startsWith(`${path}/`)
                      const done = isChapterComplete(ch.id)
                      return (
                        <li key={ch.id}>
                          <Link to={path} className={active ? 'active' : undefined}>
                            <span className="ch-dot" aria-hidden />
                            Ch{String(ch.number).padStart(2, '0')} {ch.title}
                            {done ? <span className="ch-check" aria-label="Completed">✓</span> : null}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </aside>
  )
}
