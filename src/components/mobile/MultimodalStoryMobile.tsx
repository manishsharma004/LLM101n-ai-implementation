import { useState } from 'react'
import { SearchAssistPanel } from '../SearchAssistPanel'

const STORY =
  'In an enchanted forest, a tiny dragon named Pippin discovered a glowing storybook. Each page whispered new adventures…'

const CODEBOOK = [
  { id: 1024, hue: '#38bdf8' },
  { id: 881, hue: '#a855f7' },
  { id: 412, hue: '#4ade80' },
]

export function MultimodalStoryMobile() {
  const [timestep, setTimestep] = useState(500)

  return (
    <section className="mobile-rich-panel multimodal-mobile" aria-label="Multimodal story lab">
      <div className="mobile-subtabs multimodal-tabs" role="tablist">
        <button type="button" className="active" role="tab" aria-selected>Prompt lab</button>
        <button type="button" role="tab" aria-selected={false} disabled className="muted">
          Theory (scroll below)
        </button>
      </div>

      <article className="multimodal-story-card panel-surface glow-cyan">
        <h3>Generated story</h3>
        <p className="multimodal-story-text">{STORY}</p>
      </article>

      <figure className="multimodal-illustration-card panel-surface glow-purple">
        <div className="multimodal-illustration-preview" aria-hidden />
        <figcaption className="muted">Illustration preview (VQ-VAE + diffusion pipeline)</figcaption>
      </figure>

      <div className="multimodal-codebook panel-surface">
        <h3>VQ-VAE codebook inspector</h3>
        <p className="muted">Discrete patch indices z = argmin ‖e − cₖ‖²</p>
        <div className="codebook-chips">
          {CODEBOOK.map((c) => (
            <div key={c.id} className="codebook-chip" style={{ borderColor: c.hue }}>
              <span className="codebook-id">[{c.id}]</span>
              <span className="codebook-patch" style={{ background: `linear-gradient(135deg, ${c.hue}55, #0f172a)` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="multimodal-dit panel-surface">
        <h3>Diffusion transformer (DiT)</h3>
        <label className="rail-slider">
          <span>Noise timestep t = {timestep} / 1000</span>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={timestep}
            onChange={(e) => setTimestep(Number(e.target.value))}
          />
        </label>
        <div className="dit-noise-preview">
          <span className="muted">t=1000</span>
          <div className="dit-noise-bar" style={{ opacity: 0.25 + (timestep / 1000) * 0.75 }} />
          <span className="muted">t=0</span>
        </div>
      </div>

      <SearchAssistPanel
        label="Search AI prompt assist"
        defaultQuestion="Write an illustration prompt for Pippin the dragon in an enchanted forest."
      />
    </section>
  )
}
