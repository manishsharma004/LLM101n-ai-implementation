# Runtime architecture (Archify)

Interactive map of how **LLM101n-ai-implementation** runs in the browser.

- **Live diagram:** `public/architecture/llm101n-runtime.architecture.html` (copied into `dist/` on build)
- **Source:** `docs/architecture/llm101n-runtime.architecture.json`
- **Tool:** [Archify](https://github.com/tt-a1i/archify)

## Regenerate

```bash
bash scripts/install-archify-skill.sh   # once
bash scripts/architecture-deliver.sh
```

Validate only:

```bash
node .cursor/skills/archify/bin/archify.mjs validate architecture docs/architecture/llm101n-runtime.architecture.json
```
