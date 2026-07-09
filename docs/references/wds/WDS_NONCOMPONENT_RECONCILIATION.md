# WDS non-component content → LDS reconciliation

Answers "did we carry over the non-component parts of WDS — principles, guidelines,
foundations, assets — not just component pixels?" Every WDS row below was read from
the source `.fig` (`docs/references/wds/Wanted Design System (Community).fig`), page
by page, not from screenshots.

## Full page inventory (26 pages)

| WDS page | Kind | Code-DS relevance | LDS status |
|---|---|---|---|
| Overview | Intro / marketing | low | n/a |
| Internal Only Canvas | Raw icon glyphs | via Icon system | see Icons below |
| **Ⓜ Makers' Principle** | Authoring principles | partial (see below) | ⚠ partial |
| ———— Guideline ———— | Figma doc template (Dummy) + voice/tone | Figma-authoring | △ prompt.md analogue |
| ⓪ Foundation → Color/Type/Grid | Token systems | high | ✅ ported this cycle |
| ② Element → Basic / Spacing / Decorate | Aspect-ratio keeper, safe-area spacers, gradient/mask primitives | mostly Figma aids | n/a (Decorate gradients optional) |
| ① Theme → Icon / Logo | Icon set, brand logos | high | ✅ see Icons/Logos below |
| Work, Example, Updates | Example screens, changelog | low | n/a |

Takeaway: apart from the three token foundations (already ported), WDS's
non-component pages are **overwhelmingly Figma-authoring scaffolding** (how to build
and document components *inside the Figma file*), which does not transfer to a React
component library. The genuinely portable content is the Makers' Principles, the
icon set, and the logo/brand system — reconciled below.

## Makers' Principle → LDS

Six making principles + a release-message principle, read from the Makers' Principle
page:

| WDS principle | Transferable? | LDS reflection |
|---|---|---|
| 1. Plan with minimal features first, ship fast, iterate | ✅ yes | Implicit in `OPERATING_MODEL.md` change categories; **not stated as an explicit principle** → minor gap |
| 2. Unify component naming (`Component/Component`, `Component/Resource/Component`) | ✅ spirit | LDS uses flat React export names + `components/<group>/`; the WDS `Resource/Control` nesting is the Figma internal we now resolve in the deep extractor. Naming *consistency* holds; convention **not explicitly documented** → minor gap |
| 3. Inherit properties from similar components for consistency | ✅ yes | `COMPONENT_API_STATE_MATRIX.md` + `.d.ts` contracts enforce consistent prop/state naming |
| 4. Design a findable, unique name hierarchy | ⚠ Figma-specific | Page/Section hierarchy is a Figma concern; LDS analogue is the `components/<group>/` grouping |
| 5. Apply "simplify all instances" for uniform components | ❌ Figma-only | No code analogue (instance-override control is a Figma feature) |
| 6. Keep Variant toggles minimal | ⚠ Figma-specific | Spirit = keep prop surface small; not a documented rule |
| 7. Release messages: consistent tone, fast, readable, avoid jargon | ✅ yes | `OPERATING_MODEL.md` has migration/release format but **not the readable-tone guidance** → worth adopting |

Voice/tone convention (from the Guideline page): **principles use the "-합니다" register,
usage examples use "-해요"**. LDS `*.prompt.md` files play the WDS "Dummy" documentation
role but do not codify this register split.

### Genuine, code-relevant gaps (small)

1. No explicit **naming convention** note for LDS components/props.
2. No explicit **minimal-first / small-prop-surface** principle.
3. Release/PR docs lack the **readable-release-note tone** guidance.

These are documentation gaps, not implementation drift. They are candidates to fold
into `OPERATING_MODEL.md` / `COMPONENT_WORKFLOW.md` if the team wants WDS's authoring
principles restated for the code library.

## Icons

WDS ships **101 distinct icon glyphs** (`Icon/Normal/*`, `Icon/Color/*`). LDS `Icon`
exposes **228** named icons — a 2.2× superset. Coverage of the WDS set: **99/101** by
name or direct equivalent. The two not present as-is are **Message Text** and
**Bookmark New**; LDS carries the near-equivalents `message-fill` and `bookmark-fill`.
("View" in WDS = LDS `eye`.) No meaningful icon gap; adding the two exact glyphs is
optional.

## Logos

WDS `Logo/*` are **Wanted's own brand logos** (Wanted / Wanted Space / Wanted Gigs, in
Horizontal / Vertical / Symbol / Combination). LDS instead ships **LK ROBOTICS's own**
mark (`Lockup`, `BrandLogo`) plus third-party social logos (`apple`, `google`, `github`,
`huggingface`, … for `SocialButton`). Different company by design — a 1:1 name match is
not expected; the logo *system* is covered with LK's identity, which is correct for a
fork.

## Net

- **Foundations** (color / type / grid): ported.
- **Icons**: complete superset coverage (99/101; 2 optional glyphs).
- **Logos**: LK identity substituted appropriately.
- **Principles/guidelines**: WDS's are mostly Figma-authoring; LDS has its own code
  governance docs. Three small documentation gaps identified (naming convention,
  minimal-first, release-note tone) — optional to adopt.
- Everything else on the non-component pages is Figma-authoring scaffolding with no
  code-DS counterpart.
