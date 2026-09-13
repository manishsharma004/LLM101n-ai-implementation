# LLM101n browser course

## What this is

Static Vite + React app implementing the [karpathy/LLM101n](https://github.com/karpathy/LLM101n) syllabus: 17 chapters + appendix, in-browser labs, and a **Storyteller** flow. **No backend and no in-app LLM API.** AI help uses **search-engine redirects** (Google AI search, Duck.ai, Perplexity)—same pattern as `manishsharma004/system-design-copilot` (`src/lib/llm/providers.js`).

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm test`

## Conventions

- Chapter prose: `src/content/chapters.ts`
- Labs: `src/labs/` + `src/components/LabPanel.tsx`
- Chapter 2 micrograd: `PyodideCodeLab` + Monaco (`monaco-editor`) + starter in `src/labs/microgradStarterPython.ts`
- Architecture map: `bash scripts/architecture-deliver.sh` ([Archify](https://github.com/tt-a1i/archify)) → `public/architecture/llm101n-runtime.architecture.html`
- Search prompts: `src/lib/llm/providers.ts`
- Deploy `dist/` to static hosting (`base: './'`, `HashRouter` for GitHub Pages).
