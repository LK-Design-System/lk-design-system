# Portal 검수 목록 LDS source handoff (2026-10-09)

| Field | Value |
| --- | --- |
| Type | Working source review handoff |
| Status | Source implemented; parent CUA checks below passed; exhaustive dark/touch and remaining cases unverified |
| Owner | LDS authoring owner |
| Base | main `9f5c2998204730afa9e89eb0c55676f968ff2abe` |
| Scope | R01, R11, D01–D06, V02, V03 |
| Authority | User approved the reported LDS design revisions; AGENTS Scope Escalation Gate applied to this list only |

Portal files were read only. Existing worktree contributions remain intact. The user subsequently authorized a
local main commit of these exact authored source/docs/tests after staged-list inspection. No remote push/tag,
workflow dispatch, package build, dist/package projection or visual baseline was produced. Release/deployment
remains **pending separate per-action approval**, and the parent owns the next release decision.

## Decisions and sibling visual deltas

| Finding | Source contract | Closest sibling comparison and retained difference |
| --- | --- | --- |
| R01 | DashboardShell mobile Drawer body scrolls areas → destinations/list → account | Drawer/ScrollArea/ShellPanel: one mobile body scroll replaces clipped fixed regions; desktop rail and panel behavior stays local |
| V03 | Open narrow→wide transition requests onTemporaryNavigationClose once; parent clears intent | Existing panel overlay transition and Drawer focus engine reused; desktop return target is main because the mobile trigger may disappear |
| R11 | SearchField outer control owns one keyboard outline; forced-colors Highlight | Input/MessageComposer focus: remove inner global outline and duplicate shadow; clear button retains independent keyboard outline |
| D01 | ShellPanel density=compact: title14px/20px, header40px; ListCell typography=small + verticalPadding=small gives default text row36px; spacing-token paddingX | ConversationList/SideNav child row: same type and neutral tint/bold; same 16px label inset; comfortable header56px, medium anatomy, palette and ops padding preserved |
| D02 | ShellPanel primary action 36px, idle transparent, current semibold/aria-current | ConversationList current destinations retain selected fill; creation action needs less persistent fill than the area's NavRail selection |
| D03/V02 | MessageComposer stacked input comfortable40 / compact32; new opt-in layout=inline gives 44px input/action, approximately50px simple shell; observes width | Input/SearchField/Button type, tokens and default stacked anatomy retained; inline grows with long draft, expands to full-width input/action band for attachment/utility slots, preserving 44px primary target and DOM/IME/focus/state |
| D04 | ResourceState density=compact + emptyReason=initial/search/filter delegates to EmptyState size=sm | Existing EmptyState heading/centered order, Banner freshness and live region retained; plain small icon replaces the 56px tonal tile in compact only |
| D05 | Table size=xs, header32/body minimum36, vertical padding2; public helpers also xs | sm Table and DataGrid th/td engine reused; only explicit xs gets distinct header/body sizing; wrap/tall content grows |
| D06 | ConversationList title padding8; hidden action stops reserving width; full native title | ShellPanel/ListCell/SideNav radius/type/state preserved; hover/focus/current/open reserve menu space, touch always reserves it; sibling button keeps DOM/Tab order and target |

Reading/keyboard order stays areas → panel title/action → destinations or grouped conversations → account.
Composer order stays attachments → textarea → utility band → send/stop → status. ResourceState keeps message →
preserved content → freshness. No leading stripe, extra border, new palette, custom icon or new dependency was added.

## Primary references reviewed before implementation

- [WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): all modal content must be reachable; Escape closes; return focus must resolve to an available invoking/logical element. Applied to R01/V03.
- [WCAG Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) and [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): visible keyboard location and minimum 24px controls. Existing 24–32px menu/send controls stay intact while blank space shrinks.
- [Carbon Data Table](https://carbondesignsystem.com/components/data-table/usage/): density is explicit, tall/wrapped content may grow; hover/focus overflow action still appears on touch. LDS xs deliberately uses 32px header and 36px body rather than Carbon's equal header/body height, because the body contains controls.
- [Carbon Empty States](https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states): first-use and no-search-results have different cause/recovery; small contexts need less illustration. LDS retains its existing centered EmptyState alignment rather than adopting Carbon's left block alignment.
- [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver): observe element dimensions, disconnect on cleanup. Composer watches width only so its height writes cannot cause repeated resize calculations.
- [OpenAI UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines): the system composer lets people continue naturally in the current conversation context. No composer pixel specification. Used for the inline continuation principle, not sizing.
- [Claude Academy](https://academy.claude.com/tutorials/getting-started-with-claude): plain-language draft, follow-up and optional document attachment flows. No pixel contract.
- [Claude product overview](https://claude.com/ko/product/overview): parent observed the marketing AskCTA textarea rows=1, 36px, placeholder “오늘 무엇을 도와드릴까요?”. This is a marketing CTA, **not the signed-in Claude home**; signed-in layout was unavailable behind login. User-supplied ChatGPT 1920×900 screenshot was reported by the parent as approximately54px single-row pill with plus/model/mic/voice; this is supplied-image observation, not an official dimension or an LDS baseline.

Numbers come from existing LDS label1/spacing/row/action tokens and the approved bounded revision, not copied external styling.
`docs/references/lds-baseline` values and shared semantic tokens were inspected and not changed.

## Product coverage

Machine evidence: `docs/references/product-frontends/COVERAGE_AUDIT.json.incrementalAuthoringReviews`.

| Product / actual revision | Read-only frontend seam | Verdict |
| --- | --- | --- |
| LK Portal `09e8cf23b451e45b4153efe07b8fd95c2f6d3631` plus concurrent parent patch | Sidebar/AppShell; ChatWorkspace; RepositoryDirectory | supported by composition at source-contract level; release and live adoption pending. Product owns routes, query, controlled state, fetch/retry and data identity |
| LK Web Viz `7e53534197dbad6a165d86379ee0a0eac2be22cf` | frontend/src/screens/DashboardScreen.tsx | not applicable to Portal rail-panel workflow; maintenance-only flat robot-card dashboard, no new migration |
| LK Control Full Daedeok `d8c215fd5fef8633c7b740dc4ec3f6d980db12d4` | frontend/src/layout/MainLayout/index.jsx; themes/compStyleOverride.jsx | not applicable to this adoption; independent MUI shell/downMD/table contract, no control-plane changes |

## Parent adoption examples

Existing installed 0.4.7 API: `MessageComposer density="compact" minRows={1}` is already adopted by the parent.
ShellPanel `primaryAction.current` can be omitted to suppress persistent current fill in 0.4.7. Public ListCell titleStyle
can express label1 without private CSS, but parent explicitly chose to await the named typography preset instead.
Table's existing sm/profile and style helper APIs do not provide the independent 32px-header/36px-row preset.

After the approved release only:

```jsx
<ShellPanel title="장치" density="compact">
  <ListCell title={item.label} typography="small" verticalPadding="small"
    paddingX="var(--space-2)" selectedPresentation="tint" selected={current} />
</ShellPanel>
<ResourceState state="empty" density="compact"
  emptyReason={query ? 'search' : hasFilters ? 'filter' : 'initial'}
  title={productTitle} description={productGuidance} />
<Table size="xs" columns={columns} rows={rows} />
<MessageComposer layout="inline" density="compact" minRows={1} maxRows={6}
  value={draft} onValueChange={setDraft} onSubmit={send}
  placeholder="무엇을 도와드릴까요?" />
getTableHeaderCellStyle({ size: 'xs' });
getTableDataCellStyle({ size: 'xs' });
```

R01/R11/D02/V02/V03/D06 and the D03 stacked density correction need no new consumer props after release;
retain the existing controlled close callback. **D03 simple-home one-row anatomy requires the new
`layout="inline"` opt-in after release.** Installed0.4.7 compact alone remains stacked; do not put `layout` in
live Portal code until the released package/types support it.
Inline without slots stays on one grid row as text grows (send anchored at the bottom); attachment or utility slots
expand into the established stacked anatomy. Requested inline keeps a44px primary target in both structures.
Input stays16px; consumer utility slots must provide44px mobile targets. Width-only autosize applies to both layouts.
`data-layout` records the requested axis and `data-composer-layout` the resolved anatomy. Empty inline shell
is50px from44px content+2px inset each side+1px border each side, confirmed by parent CUA.
LDS does not guess query/filter reason from data. The parent must choose it and keep product-specific text/actions.

## Source Storybook and verification

Dev server: `http://127.0.0.1:6006`, source mode, PID 30736 (this session created it; no existing server restarted).
The initial direct bin path failed; the actual installed Storybook dispatcher then started successfully.
Direct review links:

- [Inline composer](http://127.0.0.1:6006/?path=/story/lds-product-communication-message-composer--inline-layout)
- [Compact shell destinations](http://127.0.0.1:6006/?path=/story/lds-product-layout-shell-panel--compact-destinations)
- [Low mobile navigation / responsive close](http://127.0.0.1:6006/?path=/story/lds-product-layout-dashboard-shell--low-height-navigation)

The server index confirms these focused IDs:

- `lds-core-components-selection-and-input-search-and-autocomplete--search-single-focus`
- `lds-core-components-content-lists--small-destination-typography`
- `lds-product-layout-shell-panel--primary-action-current`
- `lds-product-layout-shell-panel--compact-destinations`
- `lds-product-layout-dashboard-shell--low-height-navigation`
- `lds-product-communication-message-composer--width-autosize`
- `lds-product-communication-message-composer--inline-layout`
- `lds-product-data-display-resource-state--compact-empty-reasons`
- `lds-product-data-collections-table--compact-rows`
- `lds-product-communication-conversation-list--long-title-space`

Final focused source checks: `node --test scripts/portal-density-source.test.mjs` **9/9 passed** (5.83s).
Source-only SSR/story parse/metadata checks include inline default/opt-in and slot expansion, native send/stop,
disabled/live-region semantics, strict authoring declarations on React18/19 and negative tests for unsupported
typography/reason/size/panel density/layout. `node scripts/check-product-frontend-coverage.mjs` passed:
17 existing workflows and70 dispositions preserved, incremental source review separately recorded.
`git diff --check` passed. No additional worker test reruns after the parent began CUA review.
CUA visible IAB is unavailable in this subagent; hidden-tab navigation timed out. The following evidence was
reported by the parent from source Storybook CUA review; this worker did not capture or copy the screenshots.

| Scope | Parent CUA proof |
| --- | --- |
| D03/V02 | Empty inline shell50px versus compact stacked72px, input16px. Same55-character draft textarea desktop44px→390px viewport88px, value preserved with no content clipping/overflow; attachments resolve to stacked anatomy |
| D05 | xs header32px/body row36px versus sm44px |
| R01 | At568×320 the mobile scroll surface is247px with661px content; account reachable by keyboard, modal focus wraps |
| V03 | Narrow→768→767 leaves modal closed and returns focus to main |
| R11 | Pointer/keyboard focused input outline none and shadow none; keyboard outer outline2px. Forced-colors uses Highlight on the outer control only |
| D01 | Compact destinations row36px versus previous40px |
| D06 | Native full title, idle padding8px and menu keyboard access passed |

Screenshot collection: parent `ui-improvement/`; exact supplied D03 reference:
`ui-improvement/composer-inline-comparison.jpg`. Review scope is **normal light plus focus and SearchField
forced-colors checks**, not exhaustive dark or touch validation. D02/D04 rendered states, dark, touch menu
visibility, additional wrapped/control row combinations and remaining responsive cases are not declared passed.
The incremental review remains `implemented`; prior17 workflow verdicts are not retroactively extended by this proof.

Generated docs depend on prompt hashes. `scripts/generate-component-docs.mjs` computes sourceFingerprint from
the promptSha256 entries and writes `docs/components/component-content.json` plus the component guide index. Prompt/API/story additions
make these derived records stale. Parent must refresh them through the approved Linux generation/export path,
including package sources/types/docs, dist and any required central source hash ledger; this authoring patch
does not hand-edit generated fingerprints or visual baselines.

## Source metadata follow-up (2026-10-09)

The user authorized this bounded source correction after `894625c7`, without generation, builds, stamp updates,
commit or remote mutation. The parent owns `.github/workflows/ci.yml`, imported Linux projections and the next commit.

- [InlineLayout source](../../stories/CommunicationMessageComposer.stories.jsx) now uses
  `상호작용 · 한 행 작성과 구조 확장`, matching the interaction role and existing sidebar order.
  Export `InlineLayout`, story ID `lds-product-communication-message-composer--inline-layout`, render and play are retained.
- [Density owner decisions](../../scripts/check-density-coverage.mjs) move only `shell-panel`/`resource-state`
  to explicit `density` and `empty-state` to explicit `size`; the same 214 IDs, thresholds and validation rules remain.
  The generated [density register](../references/architecture/DENSITY_COVERAGE_CONTRACT.json) and its fingerprints are untouched.
- Source Storybook `http://127.0.0.1:6006/index.json` was read as metadata, without browser automation or server restart.
  Its 792 stories / public556 / hidden236 / Docs201 match the preserved IA's 783 IDs plus exactly the nine
  source exports added in `894625c7`; removed IDs and existing visibility changes are both zero. The baseline IA
  ID/visibility hashes also match the previous dedup contract exactly. This permits the bounded census facts in
  [the dedup contract](../references/quality/STORYBOOK_DOCS_DEDUP_CONTRACT.json), [inventory](../REPOSITORY_INVENTORY.md)
  and [visual inventory](../VISUAL_PARITY_LEDGER.md) to advance without claiming human IA approval or a new full run.
  The historical `reviewedExtension` from2026-10-05 is preserved exactly. The nine new census facts live in
  `pendingSourceExtension` with `status: "review-pending"` and a census-only reason; expected machine facts remain792/public556.
  The existing local `storybook-static/index.json` is older (762/public527/Docs199) and must not be used for this source.
- [Stat parity fixture](../../stories/CardsExtended.shared.jsx) now displays public556. Its owner is
  `LDS Product/Data/Display/Metric Card`, hidden story `lds-product-data-display-metric-card--stat-card` from
  `stories/DataAndStatus.stories.jsx`. The shared dependency is not included in that page's machine review hash;
  its factual digit change needs parent review and can change a visual capture. The parent's earlier74 zero-diff
  images apply to `894625c7`, precede this digit change and do not verify it. The one-value change is retained because
  [the inventory checker](../../scripts/report-inventory.mjs) explicitly requires this fixture to display the current
  public-story count (line233); reverting it would make `check:inventory` fail at792/public556. No threshold was changed.

The eight pages whose source differs from the preserved `reviewedSourceSha256` are:

| Story source | Page |
| --- | --- |
| [ContentListsMedia](../../stories/ContentListsMedia.stories.jsx) | LDS Core/Components/Content/Lists |
| [FormSearchAutocomplete](../../stories/FormSearchAutocomplete.stories.jsx) | LDS Core/Components/Selection and Input/Search and Autocomplete |
| [CommunicationConversationList](../../stories/CommunicationConversationList.stories.jsx) | LDS Product/Communication/Conversation List |
| [CommunicationMessageComposer](../../stories/CommunicationMessageComposer.stories.jsx) | LDS Product/Communication/Message Composer |
| [DataTable](../../stories/DataTable.stories.jsx) | LDS Product/Data/Collections/Table |
| [DataResourceState](../../stories/DataResourceState.stories.jsx) | LDS Product/Data/Display/Resource State |
| [LayoutShellPanel](../../stories/LayoutShellPanel.stories.jsx) | LDS Product/Layout/Shell Panel |
| [LayoutDashboardShell](../../stories/LayoutDashboardShell.stories.jsx) | LDS Product/Operations Dashboard/Dashboard Shell |

Keep the IA stamps unchanged until the owner reviews exact Linux source, page dispositions, public visibility,
and the nine new story roles. `InlineLayout`, `WidthAutosize`, `SearchSingleFocus`, `LowHeightNavigation` are
interaction specimens; `LongTitleSpace`, `SmallDestinationTypography`, `CompactRows`, `CompactEmptyReasons`,
`CompactDestinations` are variants/states specimens. The default classifier's `compact` heuristic selects responsive
for the last three, so the owner must explicitly review their variants/states role in the IA register. These are
proposed role decisions, not stamps written by this follow-up. Primary-description sentence decisions are unchanged.

The single focused run passed **3/3** (1.40s):
`node --test --test-name-pattern="metadata follow-up|focused story modules parse" scripts/portal-density-source.test.mjs`.
It verifies the stable inline export/public prefix, the unchanged density ID census with only three reclassifications,
the existing public type axes, and source JSX parsing. No generator CLI, full check or browser test ran locally.
After the user required historical review preservation, only the changed inline/census metadata test was rerun:
`node --test --test-name-pattern="metadata follow-up: inline story" scripts/portal-density-source.test.mjs`
passed **1/1** (0.82s). Density and JSX results above were reused; the test now requires review-pending metadata
and keeps the old reviewed extension separate.

This worker's uncommitted file set is limited to:

- `stories/CommunicationMessageComposer.stories.jsx`
- `scripts/check-density-coverage.mjs`
- `scripts/portal-density-source.test.mjs`
- `docs/references/quality/STORYBOOK_DOCS_DEDUP_CONTRACT.json`
- `docs/REPOSITORY_INVENTORY.md`
- `docs/STORYBOOK_INFORMATION_ARCHITECTURE.md`
- `docs/VISUAL_PARITY_LEDGER.md`
- `stories/CardsExtended.shared.jsx`
- `docs/handoff/2026-10-09-portal-density-source-review.md`

Parent's Linux sequence, using a new exact-source static index rather than the old local index:

```sh
npm run build:storybook
npm run report:storybook-ia
# Human review: eight page stamps and nine new story roles; also review the Stat shared fixture.
npm run report:storybook-ia
npm run generate:components
node scripts/check-component-coverage.mjs --update-dedup-baseline
# The workflow wrapper rejects looser ceilings and retains the previous reviewed ceilings.
npm run update:density-coverage
npm run build
```

The parent must include the generated density register in the Linux export/import set. Component registry refresh
must precede density refresh so the three new public props are present. No blanket `--review-current` is needed.

## Approved remote run and local repair evidence (2026-10-09)

- The approved push placed `894625c7` on remote main. [Automatic CI 37931148503](https://github.com/LK-Design-System/lk-design-system/actions/runs/37931148503)
  failed at the stale `docs/components/component-content.json` check; [Pages 37931148454](https://github.com/LK-Design-System/lk-design-system/actions/runs/37931148454) succeeded.
- The approved [export run 37931220112](https://github.com/LK-Design-System/lk-design-system/actions/runs/37931220112)
  completed its Linux export job. The parallel full-check job failed at the same stale registry. This is export success, **not a green full CI**.
- Parent imported 115 changed/new files from that Linux artifact and removed its 52 replaced dist chunks.
  Every imported file matched the downloaded SHA-256. No generated files were produced on the Windows host.
- All 74 visual captures for `894625c7` had zero meaningful pixel differences at the repository's comparator settings.
  Eight encoding/antialiasing-only differences were left out. No visual baselines or expression matrix were replaced.
  This result predates the Stat fixture digit update above; that candidate still needs Linux visual verification.
- The local workflow repair builds the source Storybook index, refreshes IA inventory without altering review stamps,
  refreshes component docs and density records, preserves dedup thresholds, then builds package projections.
  It exports the root records together with package artifacts and the Linux index as review evidence. Its embedded
  JavaScript and step/heredoc structure passed the scoped static check; no full YAML parser was available locally.
- The source correction and workflow repair are local review candidates. A new push and export dispatch need
  separate per-action owner approval. Eight changed page reviews and nine new story-role decisions remain pending;
  the export job is intentionally unable to approve them automatically. No tag, publish or Portal deployment occurred.
