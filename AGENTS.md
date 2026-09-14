# LLM101n browser course

## What this is

Static Vite + React app implementing the [karpathy/LLM101n](https://github.com/karpathy/LLM101n) syllabus: 17 chapters + appendix, in-browser labs, and a **Storyteller** flow. **No backend and no in-app LLM API.** AI help uses **search-engine redirects** (Google AI search, Duck.ai, Perplexity)—same pattern as `manishsharma004/system-design-copilot` (`src/lib/llm/providers.js`).

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm test`

## Agent instructions (owner preference)

- **Do not use Cursor subagents** (`Task` tool: `computerUse`, `explore`, `debug`, `generalPurpose`, `bugbot`, etc.). They run on separate Claude models and consume the owner’s API quota.
- Do all work in the main agent: shell commands, direct file edits, `curl`/preview servers, and existing unit tests for verification. Skip GUI walkthrough videos unless the user explicitly asks and allows subagents.

## Conventions

- Chapter prose: `src/content/chapters.ts`
- Six-phase learner roadmap (11 Karpathy resources): `src/content/learningRoadmap.ts`, UI `/learning-plan`, mirror `docs/LEARNING_ROADMAP.md`
- UI shell v2: `components/layout/*` (phased sidebar, top bar, floating tutor), home dashboard (`curriculumPhases.ts`), chapter split + `/chapter/:slug/focus` IDE view
- Prerequisites subpath: `#/prerequisites` hub + `#/prerequisites/:slug` (Units 0.0–0.5), content `src/content/prerequisites/`, docs `docs/PREREQUISITES.md`
- Labs: `src/labs/pythonLabStarters.ts` + `src/labs/microgradStarterPython.ts` + `src/components/LabPanel.tsx` → `PyodideCodeLab` + Monaco
- Architecture map: `bash scripts/architecture-deliver.sh` ([Archify](https://github.com/tt-a1i/archify)) → `public/architecture/llm101n-runtime.architecture.html`
- Search prompts: `src/lib/llm/providers.ts`
- Deploy `dist/` to static hosting (`base: './'`, `HashRouter` for GitHub Pages).
