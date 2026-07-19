# Deprecations

| Field | Value |
| --- | --- |
| Type | Generated register |
| Status | Generated · do not edit rows by hand |
| Owner | Component owners |
| Source | public declarations marked `@deprecated` |
| Generator | `npm run report:deprecations` |

This generated register is the release-facing inventory of public compatibility contracts marked with `@deprecated`. Update the declaration comment first, then run `npm run report:deprecations`.

| Declaration | Source | Migration |
| --- | --- | --- |
| `arrow?: boolean;` | `components/buttons/Button.d.ts` | Kept as a no-op compatibility prop. |
| `arrow?: boolean;` | `components/buttons/TextButton.d.ts` | Kept as a no-op compatibility prop. |
| `actionLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Kept only as a fallback when both message and label are absent. |
| `actionLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Kept only as a fallback when issue message and label are absent. |
| `severityLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Severity is presented once by the error or warning group heading. |
