import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { chapters } from './content/chapters'
import { AppendixPage, ChapterPage } from './pages/ChapterPage'
import { HomePage } from './pages/HomePage'
import './index.css'

export function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <Link to="/">LLM101n</Link>
          </div>
          <nav className="sidebar-nav">
            <Link to="/">Storyteller</Link>
            <Link to="/appendix">Appendix</Link>
            {chapters.map((ch) => (
              <Link key={ch.id} to={`/chapter/${ch.slug}`}>
                {ch.number}. {ch.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chapter/:slug" element={<ChapterPage />} />
            <Route path="/appendix" element={<AppendixPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
