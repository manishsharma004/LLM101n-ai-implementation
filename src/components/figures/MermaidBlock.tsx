import { useEffect, useId, useState } from 'react'
import type { MermaidFigure } from '../../content/types'

export function MermaidBlock({ figure }: { figure: MermaidFigure }) {
  const id = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          flowchart: { htmlLabels: true, useMaxWidth: true },
        })
        const { svg: out } = await mermaid.render(`mmd-${id}`, figure.source.trim())
        if (!cancelled) setSvg(out)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Mermaid render failed')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [figure.source, id])

  return (
    <figure className="mermaid-block">
      {error ? <p className="muted diagram-error">{error}</p> : null}
      {svg ? (
        <div className="mermaid-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="muted">Rendering diagram…</p>
      )}
      {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
    </figure>
  )
}
