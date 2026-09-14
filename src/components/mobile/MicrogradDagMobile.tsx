import { usePinchZoom } from '../../hooks/usePinchZoom'

/** Static micrograd example: a=-4, b=2 → d = a*b + (a+b)² with backward grads from Karpathy demo. */

const NODES = [
  { id: 'a', label: 'a', data: -4.0, grad: 138.0, x: 12, y: 18 },
  { id: 'b', label: 'b', data: 2.0, grad: 645.0, x: 12, y: 72 },
  { id: 'mul', label: '×', op: true, x: 50, y: 45 },
  { id: 'c', label: 'c', data: -8.0, grad: -8.0, x: 88, y: 18 },
  { id: 'add1', label: '+', op: true, x: 50, y: 18 },
  { id: 'pow', label: '**2', op: true, x: 88, y: 72 },
  { id: 'add2', label: '+', op: true, x: 126, y: 45 },
  { id: 'd', label: 'd', data: 24.7, grad: 1.0, x: 164, y: 45, out: true },
] as const

const EDGES = [
  ['a', 'add1'],
  ['b', 'add1'],
  ['add1', 'c'],
  ['c', 'pow'],
  ['a', 'mul'],
  ['b', 'mul'],
  ['mul', 'add2'],
  ['pow', 'add2'],
  ['add2', 'd'],
] as const

export function MicrogradDagMobile() {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
  const pinch = usePinchZoom()

  return (
    <section className="mobile-rich-panel micrograd-dag" aria-label="Micrograd computation graph">
      <p className="muted micrograd-dag-hint">
        Expression: <code>d = a * b + (a + b)²</code> — pinch to zoom, drag to pan the DAG.
      </p>
      <div className="micrograd-dag-toolbar">
        <button type="button" className="btn-text" onClick={pinch.reset}>Reset view</button>
      </div>
      <div
        ref={pinch.surfaceRef}
        className="micrograd-dag-canvas pinch-zoom-surface"
        onPointerDown={pinch.onPointerDown}
        onPointerMove={pinch.onPointerMove}
        onPointerUp={pinch.onPointerUp}
        onPointerCancel={pinch.onPointerUp}
      >
        <div className="pinch-zoom-inner" style={{ transform: pinch.transform }}>
        <svg viewBox="0 0 200 100" className="micrograd-dag-svg" aria-hidden>
          {EDGES.map(([from, to]) => {
            const a = byId[from]
            const b = byId[to]
            if (!a || !b) return null
            const x1 = a.x + ('op' in a && a.op ? 8 : 14)
            const y1 = a.y + 8
            const x2 = b.x + ('op' in b && b.op ? 8 : 0)
            const y2 = b.y + 8
            return (
              <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} className="dag-edge" />
            )
          })}
        </svg>
        {NODES.map((n) => (
          <div
            key={n.id}
            className={`dag-node ${'op' in n && n.op ? 'dag-node-op' : ''} ${'out' in n && n.out ? 'dag-node-out' : ''}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            {'op' in n && n.op ? (
              <span>{n.label}</span>
            ) : (
              <>
                <strong>{n.label}</strong>
                {'data' in n ? <span className="dag-data">data={n.data}</span> : null}
                {'grad' in n ? <span className="dag-grad">grad={n.grad}</span> : null}
              </>
            )}
          </div>
        ))}
        </div>
      </div>
      <pre className="micrograd-terminal panel-surface">
        [Output] d.data = 24.7 | a.grad = 138.0 | b.grad = 645.0 | Backward pass ~0.4ms
      </pre>
    </section>
  )
}
