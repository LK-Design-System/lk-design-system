# Handoff - LDS gap components + Canvas editor workflow reset

> **Current-state note (2026-07-10):** 이 문서에 기록된 작업 생성·맵 편집 공개 Storybook workflow들은 후속 구조 감사에서 제거되었다. 현재 Storybook은 `CanvasEditorShell`의 재사용 가능한 셸 변형과 Command Bar, Editor Toolbar, Layer Panel, Selection Inspector, Viewport Status Bar의 독립 컴포넌트 상태만 제공한다. 제품 workflow 근거는 `docs/EDITOR_LAYOUT_AUDIT.md`와 `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`에 남아 있다.

**Date:** 2026-07-10
**Branch:** `main`
**Push target:** `origin/main`
**Scope:** control/MLOps/web-viz gap components, DS-fit redesigns, editor primitives, and a source-first rebuild of the Canvas editor Storybook workflows.

---

## TL;DR

- Added and then design-reviewed the reusable components identified by the control/MLOps/web-viz gap analysis. Each public component has a JSX implementation, `.d.ts` contract, `.prompt.md` guidance, and Storybook coverage.
- Replaced the overly generic `TreeSelect` proposal with `TreeSelectionPanel`, which better represents a persistent hierarchical selection surface instead of a form select.
- Rebuilt `CanvasEditorShell` around shared structural slots, then split task authoring and map editing into separate workflow compositions based on the latest inspected `lk_web_viz` source.
- Removed Storybook-only `Step N` and workflow-review labels from product frames. Workflow states are separate stories; product headers contain only real document context and commands.
- Added a mandatory AGENTS rule requiring sibling-component, token, story, common-pattern, and layer-classification review before new components or major redesigns.

---

## Shipped components

| Family | Components | Main contract work |
| --- | --- | --- |
| Action | `SpeedDial` | explicit open state, labeled actions, keyboard/focus behavior, destructive action treatment |
| Content | `LogViewer`, `ReorderList` | operational filtering/search/follow controls; ordered-item movement with clear disabled states and accessible commands |
| Data | `FileBrowser`, `Legend`, `LineChart`, `TreeSelectionPanel` | reusable data browsing, chart/legend composition, and persistent hierarchical selection rather than app-specific screens |
| Forms | `PropertyField` | label/help/error ownership, typed editors, read-only/disabled/invalid states |
| Layout | `DockPanel` | docked/collapsed/resizable panel contract with editor-oriented keyboard and accessibility behavior |
| Robotics | `DirectionalPad` | pressed/disabled direction states and robotics-specific control semantics |
| Selection | `IconPicker`, `WheelPicker` | selection semantics, disabled options, keyboard support, and LDS-aligned visual hierarchy |
| Editor | `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, `ViewportStatusBar` | shared command, layer, object-inspection, and passive viewport status primitives |

Generated package entry points and `dist/` were rebuilt after the public surface changed. WDS reference classification and inventory files were updated to keep automated coverage gates aligned.

---

## Canvas editor reset

### Product evidence

The workflow audit used `LK-ROBOTICS/lk_web_viz` commit `a984def117c05acd213f494cbb8a42e990595505`, especially:

- `frontend/src/screens/TaskCreateScreen.tsx`
- `frontend/src/screens/MapEditScreen.tsx`
- `frontend/src/components/editor/PcdMap3DPanel.tsx`
- `frontend/docs/TASK_DESIGN.md`
- `docs/images/task_edit.png`
- `docs/images/map_edit_randmarks.png`
- `docs/images/map_eit_pgm.png`

### Resulting structure

- `CanvasEditorShell` shares only structural relationships: document header, optional subheader, tool rail, optional layers, viewport, docked/drawer contextual panel, and passive status.
- Task authoring remains a task form/step workflow: a left form and step list with topology and floor-map target selection on the right.
- Map editing remains an objects/PGM workflow: header commands, mode tabs, left tool rail, center viewport, and persistent right properties panel.
- PCD 3D is a split assist panel inside map editing, not a separate crop/classification workspace.
- Document save and undo/redo live in the header. Draw completion/cancel stays local to the transient canvas task. Selection clearing and deletion stay in the inspector.
- Map editing does not receive a default `LayerPanel`; the original product workflow does not expose one there.

### Current Storybook component states

| Component page | Public state coverage |
| --- | --- |
| Canvas Shell | 기본 셸, 작업 영역 슬롯, 컨텍스트 드로어 |
| Command Bar | 문서 명령, 비활성 히스토리, 뷰 명령 전용 |
| Editor Toolbar | 세로 도구 레일, 가로 도구 막대, 전체 비활성 |
| Layer Panel | 레이어 상호작용, 레이어 없음, 전체 비활성 |
| Selection Inspector | 선택 객체 속성, 선택 객체 없음, 액션 푸터 |
| Viewport Status Bar | 기본 상태, 상태 톤, 후행 슬롯 |

The audit rationale and source hierarchy are recorded in `docs/EDITOR_LAYOUT_AUDIT.md` and `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`.

---

## Key decisions

- `CanvasEditorShell` and its workspace compositions are **LK Robotics Extension** work, not WDS parity components. WDS remains the source for lower-level control styling and interaction conventions only.
- A Storybook story may name a workflow state, but that name must not be rendered as an in-product header or overlay.
- Different workspaces may compose the shell differently. Shared slots do not imply shared workflow, persistent panels, CTA placement, or layer ownership.
- Selected map-object properties are docked in the source workflow. Drawer support remains an optional shell capability for genuinely temporary context.
- Small muted text was raised to AA-safe semantic label tokens across touched editor/navigation surfaces.
- `.claude/` is ignored because it contains machine-local launch settings, nested worktrees, and dependency copies; it is not a repository deliverable.

---

## Validation completed

- `pnpm run build`
- `pnpm run check:fast` - all package, WDS alignment, generated-entry, type, token, parity, and consumer gates passed
- `pnpm run check:types`
- `pnpm run check:storybook`
  - Storybook static build passed
  - 263 total implementation stories
  - 171 public stories
  - 92 hidden stories, including 82 visual-parity stories
  - 0 missing story names, 0 implicit button types, 0 console errors in the structural guard
- `pnpm run check:type-surface` - 173 implementations, 173 type contracts, 177 named exports, 0 public `any` leaks
- `pnpm run check:contracts`
- `pnpm run check:consumer`
- `pnpm run check:tokens`
- `pnpm run check:publish-policy`
- `pnpm run check:visual-token-drift` - 0 undocumented hardcoded visual values
- `git diff --check`
- Manual Storybook axe scan across all 9 public Canvas editor states: 0 violations in every state
- Manual interaction checks: mode tabs, selection clearing, PCD split open/close, and toolbar Arrow/Home/End roving focus
- Final Storybook reload: product story rendered, 0 new runtime errors, 0 product-frame `Step N` metadata

---

## Known boundaries / follow-ups

- Storybook map, topology, PGM, and point-cloud graphics are representative DS fixtures. They do not replace the production renderer or backend-connected product implementation.
- Backend persistence, ROS data flow, map mutation, and task execution are outside this repository and still require application integration tests.
- PCD conversion/cleanup screens and site authoring are separate product workflows; they should receive their own source-first audits before being added to this shell family.
- Continue applying the new `AGENTS.md` fit-review rule before adding components. Similar visual shape alone is not enough reason to share a component contract.

---

## Local verification environment

`node` and `pnpm` may be absent from the default PATH in Codex desktop. Use:

```powershell
$env:PATH = "C:\Users\MSI\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\MSI\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;$env:PATH"
pnpm run build
pnpm run check:fast
pnpm run check:storybook
```

The development Storybook used during review remains configured for `http://localhost:6006/` when started with the repository `storybook` script.

---

## 2026-07-10 DS convention audit of today's additions

This section supersedes the earlier claim that the newly added surfaces had already completed a design-system review. Build, type-surface, inventory, and axe checks passed, but those gates did not prove LDS composition, spacing, CTA hierarchy, responsive behavior, or interaction-contract parity.

### Scope and method

- Audit base: `049f072b8b560126051d0100ac57a44659d2c987`, the last commit before 2026-07-10 KST.
- Scope: component implementations added after that base, including current untracked additions.
- Completeness: 23 Git-added `components/**/*.jsx` files; the matrix below contains exactly 23 component rows.
- Evidence checked: the implementation, public type contract, prompt, public Storybook stories, `AGENTS.md`, `AI_DESIGN_SYSTEM_GUIDE.md`, `TOKEN_GOVERNANCE.md`, `COMPONENT_API_STATE_MATRIX.md`, `ACCESSIBILITY_CONTRACTS.md`, existing `Button`, `IconButton`, and `ActionArea`, plus rendered Storybook geometry at normal and narrow viewports.
- This is an LDS extension-fit audit, not WDS parity analysis. No new WDS variant-axis claim is made.

### Rating

| Rating | Meaning |
| --- | --- |
| **Fail** | A reusable contract, safety/accessibility behavior, primitive reuse rule, or responsive requirement is violated. Do not treat the current surface as the approved LDS pattern. |
| **Needs change** | The component concept is valid, but composition, tokenization, responsive layout, or Storybook usage needs correction. |
| **Pass with minor follow-up** | The core contract and action hierarchy are reasonable; remaining issues are documentation, local spacing cleanup, or additional evidence states. |

### Authoritative checks applied

1. Compose exported LDS primitives before drawing another button, input, checkbox, badge, chip, or action container.
2. Treat existing spacing, divider, radius, icon, focus, disabled, and Storybook conventions as constraints, per `AGENTS.md`.
3. Use semantic/component tokens and do not consume primitive tokens or invent control dimensions in a reusable surface.
4. Use `ActionArea` and the Button size scale for persistent/global CTAs. In the current baseline, `Button` is 32/40/48 px for sm/md/lg; the rendered default `ActionArea` uses 40 px actions, 8 px action gap, and 20 px horizontal padding. Small 32 px actions are appropriate for row-level retry/remove/open commands, not automatically for a panel's primary commit action.
5. Verify keyboard/focus semantics, non-color status meaning, blocked-action behavior, and source truth in addition to axe output.
6. Verify narrow-width behavior; passing a full-width Storybook render is not responsive evidence.

### Component-by-component result

| # | Component | Rating | Priority | DS/CTA finding |
| ---: | --- | --- | --- | --- |
| 1 | `SourceDisclosure` | Needs change | P2 | Provenance and availability are reusable, but the source action is a hand-built native button/link style instead of `TextButton` or a documented link primitive. The fixed `h2` and local micro-spacing also escape composition control. |
| 2 | `TreePicker` | **Fail** | P1 | Reimplements search, expand, checkbox, and row controls. Rendered controls are 36, 22, and 20 px; every row exposes multiple Tab stops while `treeitem` itself has no roving focus or Arrow-key contract. This does not satisfy the Tree/TreePicker keyboard contract. |
| 3 | `CanvasEditorCommandBar` | **Fail** | P1 | Draws native 34x34 icon buttons with custom 4/6 px gaps and consumes `--lk-accent-tint` directly. The 34 px size is neither the 32 px small nor 40 px medium LDS control. Compose `IconButton`/`Button` and expose an explicit toolbar density instead. |
| 4 | `LayerPanel` | **Fail** | P1 | Reimplements visibility, lock, and selection controls. Rendered visibility/lock actions are 26x26 px and some nested row targets are 22 px; it also consumes `--lk-accent-tint`. The layer hierarchy has no unified roving-focus/tree navigation model. |
| 5 | `SelectionInspector` | **Fail** | P1 | The public field `tone` is ignored. The status/kind badge is hand-built, and the action footer bypasses `ActionArea`: rendered footer actions are 32 px with 6 px gap and 12x16 px padding, versus the documented default action-area 40 px actions, 8 px gap, and 20 px horizontal padding. Right alignment is reasonable; the sizing/density contract is not. |
| 6 | `ViewportStatusBar` | Needs change | P2 | Passive readouts are valid, but the tone is expressed by an `aria-hidden` 6 px color dot without equivalent status text. Local gaps and separator geometry need a status-bar contract. |
| 7 | `FileUploadQueue` | Pass with minor follow-up | P3 | Correctly composes `Button`, `StatusBadge`, and `ProgressBar`. Small retry/remove/open actions are row-local and appropriately 32 px. Add broader queue-state evidence and replace the remaining one-off spacing. |
| 8 | `SearchableMultiSelect` | **Fail** | P1 | Uses `Input`, but redraws selected chips and a 20x20 remove control and consumes `--lk-accent-tint-2`. `aria-activedescendant` is mixed with native option buttons, creating extra Tab stops instead of one coherent combobox/listbox focus model. |
| 9 | `SecretField` | **Fail** | P1 | CTA composition is good, but copy failure is swallowed and still sets `copied=true` and calls `onCopy`, producing false success feedback. A DS component must not report an operation as successful without source truth. |
| 10 | `ValidationSummary` | Needs change | P2 | Error/warning structure and return paths are useful, but the return action repeats the same underlined native-button treatment as `SourceDisclosure` instead of composing the existing text/link action primitive. |
| 11 | `EditorPanel` | **Fail** | P1 | The close control uses a literal `×` instead of the icon registry, and `role="dialog" aria-modal="false"` lacks a complete non-modal-dialog focus/Escape contract. Its persistent cancel/save footer bypasses `ActionArea`; rendered commit actions are 32 px. The right-aligned placement is acceptable, but the primary action density is undocumented. |
| 12 | `ExecutionStatus` | Pass with minor follow-up | P3 | Correctly separates activity, outcome, and freshness and composes status primitives. Consolidate repeated local gaps/heading behavior and add a bounded Storybook context so full-width rendering is not mistaken for the component's intended layout. |
| 13 | `MetricComparison` | **Fail** | P1 | The comparison semantics are useful, but responsive behavior fails. At a 480 px viewport, a 616 px grid is clipped inside a 385 px `overflow: hidden` container, hiding columns rather than scrolling or adapting. |
| 14 | `ReviewDecision` | Pass with minor follow-up | P3 | Correctly composes `Button`, `Textarea`, `Callout`, and `StatusBadge`. The primary CTA renders at the default 40 px and is right-aligned; this is the clearest example among the additions of the intended global action hierarchy. |
| 15 | `AnnotatedImage` | Needs change | P2 | Renderer scope and accessible text summary are sound, but unrestricted public `region.color`/`point.color` strings bypass token governance. Define semantic annotation tones or explicitly document a data-color escape hatch. |
| 16 | `BatchOperationSummary` | Needs change | P2 | Partial-result semantics and row-level 32 px retry are appropriate. The fixed four-column summary needs a narrow-width rule, and the Storybook global `결과 내보내기` action is also 32 px; a post-run primary action should use the 40 px default unless an explicit compact action-area contract is chosen. |
| 17 | `ChangeSummary` | Needs change | P2 | Evidence and per-field return actions are useful, but the fixed current/proposed two-column layout has no narrow-width fallback and the footer/action slot has no shared action-area alignment contract. |
| 18 | `CommandLifecycle` | Pass with minor follow-up | P3 | Correctly keeps lifecycle phase, outcome, and late evidence explicit and textual. Remaining work is local spacing/heading normalization and broader composition evidence. |
| 19 | `ConnectionStatus` | Pass with minor follow-up | P3 | Correctly separates transport, freshness, and optional domain health. The small reconnect action is contextual and appropriate; only repeated local spacing and evidence breadth remain. |
| 20 | `ManualControlSession` | **Fail** | P0 | The blocked-control wrapper only applies `pointer-events: none`; keyboard-focusable descendants remain operable when ordinary children are supplied. This breaks the safety boundary the component claims to enforce. The emergency-stop button also invents a `color-mix` treatment instead of using an approved danger action contract. |
| 21 | `PreflightSummary` | Pass with minor follow-up | P3 | Evidence/result separation and the default 40 px recheck action are appropriate. Bound the Storybook example width so the right-aligned action is not visually detached on very wide canvases. |
| 22 | `SafetyConfirmDialog` | Pass with minor follow-up | P3 | Correctly composes typed confirmation, blockers, pending prevention, `ConfirmDialog`, `Input`, and `Callout`. Remaining work is to tokenise the local list spacing/max width and confirm the default warning tone policy. |
| 23 | `TimeRuleEditor` | Pass with minor follow-up | P3 | Correctly composes LDS form controls and owns no workflow action. Normalize optional values before merging defaults and replace remaining local spacing; its responsive auto-fit field layout is otherwise sound. |

### Quantitative summary

- **9 Fail**, including one P0 safety issue and eight P1 contract/accessibility/responsive issues.
- **6 Needs change**.
- **8 Pass with minor follow-up**.
- Six implementations draw native buttons that overlap exported LDS action primitives; together they contain 11 native `<button>` elements.
- Three implementations directly consume primitive accent tokens: `CanvasEditorCommandBar`, `LayerPanel`, and `SearchableMultiSelect`.
- A coarse source scan finds 58 numeric `gap` declarations across 21 of the 23 implementations. Not every local gap is independently a defect, but the concentration proves that spacing was not consistently resolved through an extension-family contract.
- All 23 have `.d.ts`, `.prompt.md`, and at least one Storybook file. Seven components have only one public story despite multi-state contracts; this is evidence coverage, not proof that those states are implemented correctly.

### CTA and control-size conclusion

The main problem is not that every action is positioned incorrectly. Most persistent actions are sensibly right-aligned, and row-level retry/remove actions are sensibly small. The problem is that the additions do not consistently express that hierarchy through LDS primitives:

- **Approved direction:** global/persistent primary action uses default md/40 px and shared action-area spacing; row-local action uses sm/32 px; icon toolbar controls use an existing 32 or 40 px LDS density.
- **Current drift:** Inspector and EditorPanel commit actions are 32 px without an explicit compact action-area contract; Batch export is demonstrated at 32 px; Command Bar invents 34 px; Layer Panel invents 26/22 px; TreePicker and MultiSelect invent 20/22 px controls.
- **Remediation:** first fix the P0/P1 interaction and responsive failures, then replace duplicated controls with LDS primitives, then introduce only the smallest necessary extension tokens/compact variants. Do not solve the drift by adding another wrapper for every component.

### Remediation order

1. `ManualControlSession`: enforce keyboard as well as pointer blocking, and add a story that supplies ordinary focusable children while blocked.
2. `TreePicker` and `SearchableMultiSelect`: rebuild the composite-widget focus models and reuse search/check/chip/action primitives.
3. `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, and `EditorPanel`: converge control sizes and action containers on `IconButton`, `Button`, `StatusBadge`, icon registry, and `ActionArea`; add a documented dense variant only if the editor context genuinely requires it.
4. `MetricComparison`, `BatchOperationSummary`, and `ChangeSummary`: define narrow-width scroll/stack behavior.
5. Fix false/color-only truth in `SecretField` and `ViewportStatusBar`, then clean up the P2/P3 token and story-evidence gaps.

---

## Remediation closure — 23/23 Pass

> **Closure note (2026-07-10):** 위의 `9 Fail / 6 Needs change / 8 Pass with minor follow-up` 표는 교정 전 기준선으로 보존한다. 아래 결과는 그 지적을 구현·문서·Storybook·브라우저에서 다시 검증한 최종 상태이며, 이 섹션이 현재 승인 판단을 대체한다.

### DS fit and classification

- 23개 표면은 모두 `LDS Product` 또는 `LDS Robotics` 확장 컴포넌트다. WDS 내부 component-set에서 확인하지 않은 축을 WDS parity로 주장하지 않는다.
- 구현 전후에 대조한 기존 LDS 소유자는 `Button`, `IconButton`, `TextButton`, `ToggleIcon`, `Chip`, `Input`, `Checkbox`, `StatusBadge`, `Tag`, `ActionArea`, `ConfirmDialog`와 각 컴포넌트의 타입·prompt·Storybook 상태다.
- 기준 문서는 `AGENTS.md`, `docs/AI_DESIGN_SYSTEM_GUIDE.md`, `docs/TOKEN_GOVERNANCE.md`, `docs/COMPONENT_API_STATE_MATRIX.md`, `docs/ACCESSIBILITY_CONTRACTS.md`다.
- 공통 액션 계층은 전역/지속 CTA `md = 40px`, 행·문맥 액션 `sm = 32px`, 기본 CTA 간격 `8px`, 패널 ActionArea 가로 여백 `20px`, 우측 정렬이다.
- 유일한 의도적 밀도 차이는 편집기 Command Bar의 32px 아이콘 액션과 그룹 내부 4px 간격이다. 이는 전역 CTA가 아니라 고밀도 toolbar 명령이며 `IconButton`으로 구성한다.
- `Button`의 `danger`는 WDS 축으로 추정하지 않고 원격 명령·삭제·비상 정지에 필요한 명시적 LDS safety extension으로 분류한다.

### Final component matrix

| # | Component | Final | Closure evidence |
| ---: | --- | --- | --- |
| 1 | `SourceDisclosure` | **Pass** | `TextButton`, 조절 가능한 heading level, LDS spacing/type tokens를 사용하고 availability 상태를 별도 story로 증명한다. |
| 2 | `TreePicker` | **Pass** | LDS 입력/체크 primitives를 조합하고 tree에는 단일 roving Tab stop만 둔다. 비활성 첫 행을 건너뛰며 Arrow/Space 선택을 브라우저로 검증했다. |
| 3 | `CanvasEditorCommandBar` | **Pass** | 모든 명령을 32px `IconButton`으로 통일하고 toolbar 그룹 4px, 그룹 사이 8px을 토큰으로 표현했다. 34px 임의 크기와 native button은 제거했다. |
| 4 | `LayerPanel` | **Pass** | 48px tree row, 32px `IconButton`, 단일 roving Tab stop, 비활성 행 제외, `V`/`L` 단축키를 제공한다. ArrowDown 후 DOM focus와 `tabIndex=0`이 함께 `Geometry`로 이동함을 검증했다. |
| 5 | `SelectionInspector` | **Pass** | tone을 `StatusBadge`/`Tag`에 반영하고 footer를 `ActionArea`로 구성했다. 실측은 우측 정렬, 40px CTA, 8px gap, 20px 우측 inset이다. |
| 6 | `ViewportStatusBar` | **Pass** | 상태를 색점만이 아니라 보이는 `StatusBadge` 텍스트로 전달하고 separator/간격을 semantic/component token으로 통일했다. |
| 7 | `FileUploadQueue` | **Pass** | 행 로컬 retry/remove/open은 32px을 유지하고 queue 진행·완료·실패 상태 story를 분리했다. |
| 8 | `SearchableMultiSelect` | **Pass** | `Input`, `Chip`, `IconButton`을 조합하고 option을 비-Tab stop으로 만들었다. 비활성 option을 active descendant에서 제외하고 닫힌 listbox에는 dangling `aria-activedescendant`를 남기지 않는다. |
| 9 | `SecretField` | **Pass** | clipboard 성공 시에만 copied 상태와 `onCopy`를 알리고 실패 상태를 별도로 노출해 false-success를 제거했다. |
| 10 | `ValidationSummary` | **Pass** | return action을 `TextButton`으로 교체하고 heading level과 spacing을 상위 조합에서 제어할 수 있게 했다. |
| 11 | `EditorPanel` | **Pass** | close는 icon registry의 32px `IconButton`, 지속 action은 `ActionArea`의 40px CTA를 쓴다. docked aside 계약으로 정리하고 dirty-close 확인 경로를 문서화했다. |
| 12 | `ExecutionStatus` | **Pass** | activity/outcome/freshness 축을 독립적으로 유지하고 모든 공개 상태를 bounded story context에서 제공한다. |
| 13 | `MetricComparison` | **Pass** | 480px viewport에서 내부 scroll region 340px / table 616px / `overflow-x:auto`로 열을 보존하며 document overflow는 없다. |
| 14 | `ReviewDecision` | **Pass** | 선택, 근거 입력, pending/success/error 상태를 분리하고 지속 CTA를 우측 40px/8px ActionArea로 유지한다. |
| 15 | `AnnotatedImage` | **Pass** | 임의 시각 색상 대신 semantic annotation tone을 사용하고 모든 annotation을 비시각적 텍스트 요약으로도 제공한다. |
| 16 | `BatchOperationSummary` | **Pass** | 좁은 폭에서 summary가 auto-fit하고 행 retry는 32px, 전역 export는 우측 40px ActionArea로 구분된다. |
| 17 | `ChangeSummary` | **Pass** | current/proposed 비교가 auto-fit하며 field-return과 footer action을 shared action contract로 정렬한다. |
| 18 | `CommandLifecycle` | **Pass** | phase/outcome/late evidence를 텍스트로 분리하고 heading/spacing을 LDS token으로 정규화했다. |
| 19 | `ConnectionStatus` | **Pass** | transport/freshness/domain health를 독립 축으로 유지하며 reconnect는 문맥형 32px action이다. |
| 20 | `ManualControlSession` | **Pass** | blocked wrapper에 `inert`와 `aria-disabled`를 적용한다. 일반 focusable child의 실제 클릭이 차단되고 activation count가 0임을 브라우저로 검증했으며 비상 정지는 LDS danger Button을 쓴다. |
| 21 | `PreflightSummary` | **Pass** | evidence/result 상태를 분리하고 bounded story에서 recheck를 우측 40px/8px ActionArea로 제공한다. |
| 22 | `SafetyConfirmDialog` | **Pass** | `ConfirmDialog`, `StatusBadge`, `Input`, `Callout`, `ActionArea`를 조합한다. warning/danger 텍스트, blockers/pending 차단, cancel initial focus, focus trap/restore를 검증했다. 실측 CTA는 40px/8px이다. |
| 23 | `TimeRuleEditor` | **Pass** | optional value를 정규화하고 weekday를 중복 없이 병합하며 form field는 auto-fit한다. workflow CTA는 소유하지 않는다. |

### Quantitative closure

- 최종 결과: **23 Pass / 0 Needs change / 0 Fail**.
- 23개 구현 범위 source scan: native `<button>` 0, numeric `gap` 0, primitive `--lk-*` 소비 0, `color-mix` 0, fixed `<h2>` 0.
- 23개 모두 `.d.ts`, `.prompt.md`, 공개 Storybook 상태를 가지며, 복합 상태 계약에는 2개 이상의 state story가 있다.
- 저장소 인벤토리: 191 component implementations, 191 type contracts, 191 component entry exports, 195 named exports, 310 Storybook stories, 218 public, 92 hidden, 82 visual parity.

### Final verification

- `pnpm run build`: Pass. 생성 entry는 191개이며 두 번째 연속 build 전후 `src/index.js`, `src/index.d.ts`, `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` SHA-256이 동일했다.
- `pnpm run check:types`, `check:tokens`, `check:type-surface`, `check:contracts`, `check:consumer`: Pass.
- `pnpm run check:inventory`: Pass — 191/191/191 구현·타입·entry, 310 stories, 218 public.
- `pnpm run check:product-frontends`: Pass — 5 repositories, 14 workflows verified, 48 component dispositions.
- `pnpm run check:visual-token-drift`: Pass — 191 component files, 143 Storybook files, 0 undocumented hardcoded visual values.
- `pnpm run check:storybook-public`: Pass — 218 public, 92 hidden, 82 hidden visual parity, 공개 레이블 위반 0.
- `pnpm run check:a11y`: Pass — 310 implementation stories, missing names 0, implicit button types 0, console errors 0.
- Browser geometry/interaction: SelectionInspector `padding 12px 20px`, CTA `40px`, gap `8px`, `justify-content:flex-end`; SafetyConfirmDialog `420px` width, `24px` padding, CTA `40px`, gap `8px`, initial focus `취소`; Command Bar `32px` icon actions, toolbar gap `4px`; LayerPanel disabled-first skip 및 ArrowDown roving focus 동기화; MetricComparison narrow scroll; ManualControlSession inert click block을 확인했다.

## 2026-07-11 public-surface reduction

위 Pass 판정은 각 구현의 내부 품질만 확인했으며, “별도 public component가 필요한가”를 증명하지 못했다. 기존 LDS 조합과 독립 interaction 계약을 다시 대조한 결과 아래 11개 구현과 story를 제거했다.

- `EditorPanel`, `ExecutionStatus`, `MetricComparison`, `ReviewDecision`
- `BatchOperationSummary`, `ChangeSummary`, `CommandLifecycle`, `ConnectionStatus`
- `PreflightSummary`, `SafetyConfirmDialog`, `TimeRuleEditor`

이들은 제품 상태 스키마와 persistence/policy를 고정하거나 `ConfirmDialog`, `Timeline`, `DescriptionList`, `ValidationSummary`, `ProgressBar`, `StatusBadge`, `DockPanel`, `ActionArea`를 재배치하는 convenience wrapper였다. 따라서 위 표의 해당 Pass와 23개/191개 정량 수치는 역사적 검증 기록일 뿐 현재 공개 surface를 설명하지 않는다. 현재 disposition과 workflow closure는 `docs/PRODUCT_FRONTEND_COVERAGE.md`와 `docs/references/product-frontends/COVERAGE_AUDIT.json`을 기준으로 한다.
