# Component Workflow

This repository now has three layers of validation:

1. Package build: `npm run build`
2. Static documentation: `npm run build:storybook`
3. Token source validation: `npm run check:tokens`
4. CI gate: `.github/workflows/ci.yml`

## Local Development

Install dependencies once:

```powershell
npm install
```

Run Storybook:

```powershell
npm run storybook
```

Build everything that CI checks:

```powershell
npm run check
npm run check:audit
```

## Adding A Component

1. Add the React component under the matching `components/<group>/` directory.
2. Add or update the matching `.d.ts` contract.
3. Add component-specific tokens to `tokens/components.css` when the component has reusable visual decisions.
4. Add the structured token entries to `tokens/source.json`.
5. Run `npm run build` to regenerate `src/` and `dist/`.
6. Add a representative Storybook story under `stories/`.
7. Run `npm run check` before pushing.

## Token Source Scope

The AI/Figma-readable token map lives in `tokens/source.json`.
The runtime component token layer lives in `tokens/components.css`.
Read `docs/AI_DESIGN_SYSTEM_GUIDE.md` before asking an AI tool to generate UI from this repository, and read `docs/FIGMA_TOKEN_WORKFLOW.md` before exporting or importing Figma Variables.

## Storybook Scope

Storybook should document practical component states, not every implementation detail.
Prioritize:

- default state
- disabled or error state
- dense dashboard state
- inverse/dark state when relevant
- robotics-specific operational state

## CI Scope

The GitHub Actions workflow runs on push to `main`, pull requests, and manual dispatch.
It verifies:

- dependency installation with `npm ci`
- package build
- machine-readable token source validation
- TypeScript typecheck
- generated source and `dist/` drift
- Storybook static build
- package dry run
- runtime dependency audit
