import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AppendixPage, ChapterPage } from './pages/ChapterPage'
import { HomePage } from './pages/HomePage'
import { LabFocusPage } from './pages/LabFocusPage'
import { LearningPlanPage } from './pages/LearningPlanPage'
import { PrerequisitesHubPage } from './pages/prerequisites/PrerequisitesHubPage'
import { PrerequisiteUnitPage } from './pages/prerequisites/PrerequisiteUnitPage'
import './index.css'

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learning-plan" element={<LearningPlanPage />} />
          <Route path="/prerequisites" element={<PrerequisitesHubPage />} />
          <Route path="/prerequisites/:slug" element={<PrerequisiteUnitPage />} />
          <Route path="/chapter/:slug" element={<ChapterPage />} />
          <Route path="/chapter/:slug/focus" element={<LabFocusPage />} />
          <Route path="/appendix" element={<AppendixPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
