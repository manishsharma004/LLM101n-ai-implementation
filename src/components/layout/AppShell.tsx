import { Outlet } from 'react-router-dom'
import { CollapsibleSidebar } from './CollapsibleSidebar'
import { FloatingTutor } from './FloatingTutor'

export function AppShell() {
  return (
    <div className="app-shell-v2">
      <CollapsibleSidebar />
      <div className="app-main-column">
        <Outlet />
      </div>
      <FloatingTutor />
    </div>
  )
}
