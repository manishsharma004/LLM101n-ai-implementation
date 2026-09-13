import katex from 'katex'
import type { MathFigure } from '../../content/types'

export function MathBlock({ figure }: { figure: MathFigure }) {
  const html = katex.renderToString(figure.latex, {
    displayMode: true,
    throwOnError: false,
    strict: 'ignore',
  })
  return (
    <figure className="math-block">
      <div className="math-render" dangerouslySetInnerHTML={{ __html: html }} />
      {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
    </figure>
  )
}
