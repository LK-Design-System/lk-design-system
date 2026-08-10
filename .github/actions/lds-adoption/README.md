# LDS UI adoption action

This composite action validates a consumer-owned LDS adoption report against
the selected scope mode. `full-surface` (the contract default) inspects every
in-scope source file, including unchanged legacy UI; `changed-ui` inspects only
the relevant changed lines for an explicitly bounded incremental adoption. It
reads the pinned contract and report schema from the LDS checkout; the consumer
keeps repository-specific scan settings in `.lds/adoption.config.json` and
attestations in the configured report directory.

The base commit must be present locally. Use a full checkout for pull requests:

```yaml
steps:
  - uses: actions/checkout@v6
    with:
      fetch-depth: 0

  - uses: lk-design-system/lk-design-system/.github/actions/lds-adoption@<full-commit-sha>
    with:
      root: .
      config: .lds/adoption.config.json
      report: .lds/adoption-report.json
      base: ${{ github.event.pull_request.base.sha }}
      head: ${{ github.event.pull_request.head.sha }}
      storybook-index: storybook-static/index.json
      artifact-name: control-ui-lds-adoption
```

Pin the action to a full commit SHA. The action installs the conformance
runtime from its committed package lock with lifecycle scripts disabled. The
machine-readable result is uploaded even when the adoption check fails; omit
`artifact-name` to use
`lds-adoption-<job>-<run id>-<run attempt>`. Matrix jobs and workflows that
invoke the action more than once must pass a unique `artifact-name` for each
invocation. Artifact names are limited to 1–120 ASCII letters, digits, dots,
underscores, and hyphens. The action rejects control characters in every input
and rejects output paths that traverse links, reparse points, or directories.
A regular prior result file is replaced atomically, so rerunning the check is
safe.

## Consumer config

The config is deliberately separate from the adoption report. A minimal file
looks like this:

```json
{
  "schemaVersion": 1,
  "kind": "lds-ui-adoption-config",
  "repository": "control-ui",
  "uiRoots": ["src/**/*"],
  "styleEntry": "src/styles.css",
  "requiredStyleImports": [
    "@lk-design-system/lds-core/styles.css",
    "@lk-design-system/lds-theme/styles.css"
  ],
  "excludedPaths": ["src/generated/**/*", "vendor/**/*"],
  "reportDirectory": ".lds"
}
```

Config paths are repository-relative. The checker also ignores comments,
tests, stories, snapshots, generated output, vendored code, and build output
when it evaluates UI debt. A pull request cannot change an existing config's
scan roots or exclusions and use that new config for its own review. A strict,
config-only first setup is allowed; introducing the config together with UI
changes fails closed.

Copy both the report example and its schema into `.lds/`; do not copy the report
alone. The report's relative `$schema` must resolve inside the consumer
repository, and that local schema copy must be byte-identical to the report
schema pinned by the action. For example:

```text
.lds/
  adoption-report.json
  adoption-report.schema.json
  adoption.config.json
```

Set `adoption-report.json`'s `$schema` to
`./adoption-report.schema.json`. The source files are
`docs/references/adoption/LDS_UI_ADOPTION_REPORT.example.json` and
`docs/references/adoption/LDS_UI_ADOPTION_REPORT.schema.json` in the pinned LDS
checkout.

Every analyzed UI file must resolve to exactly one `surfaces[*].paths` entry or
one documented `scope.excluded` entry. A reviewed facet records every stable
contract decision ID exactly once, with a concrete outcome and typed evidence.
Verification records distinct normal/narrow widths, light+dark (or an exclusive
not-applicable disposition), ready plus a canonical non-ready state, and
observable visual, story, or check evidence.

Accepted evidence references are deliberately reproducible:

- `source`, `asset`, `visual`, `copy-catalog`, and `check` reference an existing
  repository-relative file or artifact in the consumer or pinned LDS checkout.
- `token` is either a CSS custom property present in canonical
  `tokens/source.json` or an existing repository-relative inventory file.
- `story` is a Storybook index entry ID. Any story evidence—and any active
  trigger that requires story evidence—requires `--storybook-index` (or the
  action's `storybook-index` input).
- `decision` records a semantic disposition, but cannot be the only evidence
  for a required decision outcome.

## Local command

```sh
node packages/conformance/src/cli.mjs check-adoption \
  --root ../consumer \
  --lds-root . \
  --config .lds/adoption.config.json \
  --report .lds/adoption-report.json \
  --base origin/main \
  --head HEAD \
  --output visual-artifacts/adoption/check-result.json
```

Use `verify-adoption-contract` to validate the pinned schemas and
`verify-adoption-fixtures` to run the positive/negative conformance matrix.
