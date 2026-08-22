# LDS UI library refinement plan

| Field | Value |
| --- | --- |
| Type | Completed implementation record |
| Status | Completed — source·type·prompt·Storybook·overlay 계약 구현; current consumer evidence는 registry가 소유 |
| Owner | Design system owner · Core/Product component owners · Frontend platform |
| Last reviewed | 2026-08-22 |
| Scope | `@lk-design-system/lds-core`, `@lk-design-system/lds-product`의 공용 UI 라이브러리 계약 |
| Evidence | 현재 component contracts · 이슈 #6~#30 · [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md) · [`LDS_CONSUMER_REGISTRY.json`](references/adoption/LDS_CONSUMER_REGISTRY.json) |
| Implementation state | LDS source·type·prompt·Storybook 완료 · Portal은 current package set `build-verified`; 제품 전체 승격 evidence는 roadmap이 소유 |
| Current roadmap | [`LDS_ROADMAP.md`](LDS_ROADMAP.md) R2 — product adoption promotion |

이 계획의 목표는 컴포넌트 수를 늘리는 것이 아니라, 자주 사용하는 LDS 컴포넌트가
제품과 레이아웃이 달라져도 같은 API·DOM·상태·접근성·스타일·overlay 계약으로
예측 가능하게 동작하도록 만드는 것이다.

현재 LDS는 토큰, 접근성, Storybook, package/release와 설계 근거 관리가 강하다.
반면 실제 이슈는 개별 컴포넌트의 상태·크기·구조·레이아웃 책임이 공통 라이브러리
계약으로 충분히 승격되지 않아 반복됐다. 따라서 이 계획은 기존 정책을 대체하지 않고,
아래 문서를 실제 컴포넌트 표면에 일관되게 적용하는 실행 계획이다.

> 아래 rc.21 수치와 구현 단계는 2026-08-02 당시 snapshot이다. 현재 package version과
> consumer 단계는 package manifest와 consumer registry를 사용한다.

- [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md): API grammar와 상태 증거
- [`API_OPENNESS_POLICY.md`](API_OPENNESS_POLICY.md): 구조 개방과 조합 보호
- [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md): semantic·keyboard·focus 계약
- [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md): semantic/component token 계약
- [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md): 구현·문서·Storybook·검증 완료 조건
- [`OPERATING_MODEL.md`](OPERATING_MODEL.md): 변경 분류, migration, immutable release

## 결론

다음 다섯 과제를 LDS source와 rc.21 package candidate에 반영했다.

1. Select·MessageFeed 레이아웃 finding을 LDS에서 수정했다.
2. 중앙 API/state matrix와 개별 prompt·타입·스토리 사이의 문서 불일치를 제거했다.
3. 핵심 컴포넌트에 공통 Styles/Slots API와 ref target 계약을 도입했다.
4. DropdownMenu 단독 수정으로 끝내지 않고 Portal/overlay를 공통 플랫폼 계약으로 만들었다.
5. 이슈에서 발견된 회귀를 컴포넌트별 수정이 아니라 공통 conformance test로 고정했다.

### 2026-08-02 구현 결과

- Select intrinsic width와 MessageFeed `viewportInset`을 source·type·prompt·Storybook·API matrix·generated package에 반영했다.
- 핵심 15개 컴포넌트에 named part, `classNames`·`styles`·`vars`, state marker와 ref target 계약을 적용했다.
- DropdownMenu·Popover·Tooltip·Select·Modal family를 공통 Portal, layer stack, light-dismiss, focus/inert/scroll-lock, owner-document, theme/direction 상속 계약으로 통합했다.
- `LdsProvider`에 color scheme, direction, locale, storage, portal target과 z-index base runtime을 추가하고 additive migration/deprecation 경로를 기록했다.
- Storybook 191페이지·669스토리, 접근성 669개 구현 스토리·396개 play·189개 Docs 가이드, 시각 회귀 36개 기준선과 생성 문서 204개를 검증했다.
- LK Portal의 rc.21 pin, 내부 workaround 제거와 실제 chat workflow 검증은 consumer 후속 작업으로 남긴다.

## 이슈가 증명한 라이브러리 결함 유형

| 결함 유형 | 관련 이슈 | 공통 원인 | 계획의 대응 |
| --- | --- | --- | --- |
| 상태 소유와 제어 API | #13, #14 | controlled/uncontrolled 상태와 외부 동기화 계약이 컴포넌트마다 달랐음 | 공통 state grammar와 상태 전환 conformance |
| 의미론과 조합성 | #15, #17, #18, #20, #22 | 필요한 slot·semantic root·조합 단위가 public API로 충분히 표현되지 않았음 | 명명 slot, semantic root, FieldAction 같은 제한된 조합 primitive |
| 크기·밀도·폭 | #6, #7, #11, #12, #16, #23, #24, #25 | size가 높이·타이포그래피·padding·overflow에 주는 영향과 조건부 레이아웃 불변식이 분산됨 | 맥락별 density 계약, width policy, conditional-layout test |
| Overlay와 반응형 containment | #8, #9, #10, #26 | Portal, focus, inert, stacking, scroll-container 탈출 정책이 surface별로 달랐음 | 공통 overlay engine과 public Portal 정책 |
| 릴리스·검증 상태 | #21 및 rc.6~rc.15 후속 | 코드 수정, package 발행, 소비 앱 검증과 이슈 종료가 한 상태로 취급됨 | immutable release와 consumer verification 단계를 분리 |

`#7`처럼 전역 높이 척도를 합치지 않은 결정은 유지한다. Field control, action control,
data density는 의미가 다르며, 필요한 조합만 `FieldAction` 같은 제한된 primitive가
높이를 중재한다.

## P0-A. 현재 follow-up 완료

### Select intrinsic-width 측정기

[`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md)의
Work item A를 정본으로 사용한다.

- 가장 긴 option을 기준으로 안정적인 폭을 유지한다.
- hidden measurement subtree를 일반 inline flow, wrapping과 scroll overflow에서 격리한다.
- label/helper가 없는 Select에서 root와 trigger 높이가 같고 top 차이가 0~1px 이내여야 한다.
- 제한 폭에서 긴 option이 root나 상위 wrapper의 `scrollWidth`를 늘리지 않아야 한다.
- 기존 keyboard, focus, light-dismiss와 listbox alignment 계약을 유지한다.
- 공개 prop과 `.d.ts`는 변경하지 않는다.

기존 stable-width story에 width뿐 아니라 높이, y 좌표, constrained overflow 검증을
추가한다. 이 작업이 끝나기 전까지 rc.11의 폭 수정은 부분 완료로 본다.

### MessageFeed viewport inset

같은 문서의 Work item B를 정본으로 사용한다.

- `viewportInset?: 'compact' | 'comfortable'`만 공개한다.
- 기존 기본값 `compact`의 inline 8px을 유지한다.
- `comfortable`은 inline 16px이고 block 12px은 유지한다.
- raw `viewportStyle`, pixel prop이나 private selector override는 공개하지 않는다.
- 760px reading column, 460px panel과 320px narrow에서 overflow를 검증한다.
- source, `.d.ts`, prompt, Storybook, API/state matrix와 generated package를 함께 갱신한다.

두 작업은 독립 변경으로 구현하고, 새 versioned package set에서 LK Portal이 실제로
채택한 뒤 follow-up 문서의 상태를 `Completed`로 변경한다.

## P0-B. 문서와 현재 구현 동기화

현재 구조 검사는 통과하지만 의미상 불일치가 남아 있다. 다음을 코드 변경과 분리한
문서 정합성 변경으로 먼저 처리한다.

### Select

- `Select.prompt.md`의 “트리거와 옵션은 항상 16px” 설명을 size별 계약으로 고친다.
- `sm`은 component-owned `label1` 14/20px, `md`와 `lg`는 각 현재 field 계약을 따른다고 명시한다.
- API/state matrix에 stable option-driven width, constrained overflow와 compact typography를 추가한다.
- 생성 가이드와 runtime JSON을 재생성한다.

### DataToolbar

- API/state matrix에서 DataToolbar가 `selectedCount`나 `bulkActions`를 소유하는 것처럼 읽히는 표현을 제거한다.
- header 정보가 없으면 header row를 만들지 않고, search와 filter가 없으면 controls row를 만들지 않으며,
  모든 slot이 비면 surface도 렌더하지 않는다는 불변식을 prompt와 matrix에 함께 기록한다.
- controls-only, header-only, completely-empty 상태를 동일 Storybook 계약으로 유지한다.

### SegmentedControl

- API/state matrix에 독립 항목을 추가한다.
- `radiogroup`/radio, roving focus, controlled/uncontrolled value, disabled option과 `count`의
  접근 가능한 이름 계약을 기록한다.
- `count`는 표시 장식이 아니라 단일 선택 전에 결과량을 비교하는 정보라는 사용 경계를 유지한다.

### DropdownMenu

- API/state matrix에 root/flyout portal, fixed positioning, flip/shift, clipping 탈출,
  owner-document와 focus restore 증거를 추가한다.
- 가장 가까운 `data-theme` 또는 theme class가 portalled panel에 전달돼야 한다는 rc.14
  theme inheritance 계약을 prompt에 명시한다.
- DropdownMenu의 계약과 전체 overlay family의 공통 계약을 구분한다.

### 검사 보완

현재 `check:components`, `check:api-drift`, `check:api-grammar`, `check:docs`는 구조적
정합성을 검증하지만 문장과 런타임 의미의 충돌까지 판정하지 않는다.

- 중앙 API/state matrix의 핵심 컴포넌트 row 존재 여부를 ratchet한다.
- size별 typography, conditional row, portal theme처럼 machine-readable하게 표현 가능한
  계약은 Storybook play 또는 dedicated contract fixture로 검증한다.
- generated guide가 source prompt를 그대로 재생산해도 source prompt가 오래되면 실패하도록,
  변경된 token/API와 관련 prompt의 검토 여부를 PR checklist에 기록한다.

## P0-C. 공통 Component Surface Contract

새 안정 정책 문서 `COMPONENT_SURFACE_CONTRACT.md`를 만들고 핵심 컴포넌트에 먼저 적용한다.
203개 전체를 한 번에 바꾸지 않는다.

### Root contract

- `className`과 `style`은 기본적으로 public root에 적용한다.
- native focus target에 적용되는 예외는 prop 이름으로 드러낸다. 예: `inputClassName`, `inputStyle`.
- 같은 family에서 `style`은 wrapper, `className`은 내부 input처럼 서로 다른 target을 가리키지 않는다.
- root element, semantic role과 ref target을 decision guide에 명시한다.

### Named parts contract

복잡한 컴포넌트에만 아래 고급 표면을 제공한다.

```tsx
<Select
  classNames={{ root, label, input, dropdown, option }}
  styles={{ root, input, dropdown }}
  vars={{ '--select-min-width': '16rem' }}
/>
```

- part 이름은 안정된 public API이며 type으로 제한한다.
- 같은 part를 DOM에서 확인할 수 있도록 `data-slot`을 제공한다.
- `data-state`, `data-disabled`, `data-invalid`, `data-open`은 실제 의미 상태에만 사용한다.
- 내부 class 이름이나 DOM 순서를 selector 계약으로 홍보하지 않는다.
- `vars`는 component token override만 허용하고 arbitrary raw style 변수를 대체하지 않는다.
- 단순 컴포넌트에는 `className`/`style`만 유지해 API를 불필요하게 넓히지 않는다.

### Composition contract

[`API_OPENNESS_POLICY.md`](API_OPENNESS_POLICY.md)의 “구조는 열되 조합은 보호” 원칙을 유지한다.

- 반복 구조는 선언적 `items`/`groups`로 표현한다.
- 임의 배치가 필요한 경우 목적이 명확한 소수의 명명 slot만 연다.
- 범용 `asChild`, 무제한 render prop이나 내부 focus target 교체는 기본 API로 만들지 않는다.
- Button, Menu, Dialog처럼 키보드와 접근성 역할을 LDS가 소유하는 컴포넌트는 semantic ownership을 유지한다.

## P0-D. Ref target contract

인터랙티브 핵심 컴포넌트는 일관된 ref 계약을 가져야 한다.

- native-like control의 기본 ref는 실제 focus target을 가리킨다.
- composite root와 focus target이 모두 필요하면 `ref`와 `inputRef`/`triggerRef`처럼 이름을 분리한다.
- public `.d.ts`가 실제 DOM target type을 표현한다.
- 내부 ref와 consumer ref는 공통 merged-ref utility로 결합한다.
- disabled, loading, open/close와 rerender 뒤에도 ref identity와 focus target이 유지돼야 한다.
- ref target 변경은 CSS 변경이 아니라 public API 변경으로 분류하고 migration note를 남긴다.

## P0-E. Overlay/Portal platform contract

DropdownMenu의 root portal 수정과 Modal/Drawer의 dialog focus engine을 하나의 family 계약으로
정리한다. 새 안정 정책 문서 `OVERLAY_PLATFORM_CONTRACT.md`가 다음을 소유한다.

### 공통 동작

- owner document를 기준으로 Portal target을 결정한다.
- Portal 이후에도 theme, direction과 필요한 provider context가 보존된다.
- anchored overlay는 기본적으로 viewport fixed strategy, flip, shift와 size constraint를 공유한다.
- modal overlay는 topmost Escape, focus trap, focus restore, scroll lock과 background inert를 공유한다.
- overlay stack과 z-index는 component 내부 숫자 경쟁이 아니라 공통 계층으로 관리한다.
- trigger와 portalled content의 `aria-controls`/label 관계를 유지한다.
- SSR에서 `document`가 없을 때 안전하고 hydration 전후 DOM 계약이 명확해야 한다.

### 공개 API

필요한 family에 한해 이름과 기본값을 통일한다.

- `open`, `defaultOpen`, `onOpenChange`
- `withinPortal`
- `portalTarget`
- `zIndex`
- anchored surface의 `position`, `align`, `offset`
- modal surface의 `initialFocusRef`, `returnFocusRef`

소비자가 focus trap이나 positioning engine을 교체하는 저수준 escape hatch는 공개하지 않는다.

### 우선 적용 대상

1. DropdownMenu
2. Popover
3. Tooltip/HoverCard
4. Select/Combobox 계열 popup
5. Modal/Drawer/Sheet/ConfirmDialog

## P1-A. Layout와 density contract

크기 이름을 전역 픽셀값 하나로 합치지 않고 맥락별로 관리한다.

- Field controls: Input, Textarea, Select, SearchField
- Action controls: Button, IconButton
- Selection controls: SegmentedControl, FilterChip, Tabs
- Data density: DataToolbar, Table, DataGrid
- Composition adapter: FieldAction

각 `size`는 최소한 height, typography, icon, horizontal padding과 target size의 조합으로
문서화한다. 단일 높이만 바뀌고 타이포그래피가 남는 상태를 허용하지 않는다.

폭 정책도 component별로 다음 중 무엇을 지원하는지 명시한다.

- parent width에 맞추는 `fullWidth`
- consumer가 지정하는 fixed/fluid width
- content 기반 intrinsic width
- 최소·최대 폭과 overflow/wrapping

조건부 slot은 내용이 없으면 grid/flex track, gap, divider와 surface를 만들지 않는 것을
공통 layout 불변식으로 둔다.

## P1-B. Provider와 theme runtime

`LdsProvider` 또는 동등한 단일 runtime provider를 검토한다.

- light/dark/auto color scheme와 storage manager
- SSR 초기 color scheme script 또는 동등한 first-paint 계약
- default Portal target와 z-index context
- direction(`ltr`/`rtl`)과 locale-sensitive runtime 값
- component default props 또는 density scope가 필요할 경우 제한된 provider 설정

CSS의 `[data-theme]` 계약은 유지하되 React consumer가 DOM/localStorage를 직접 조작하지
않도록 한다. Provider 도입은 기존 CSS-only 사용자를 깨지 않는 additive 변경이어야 한다.

## P1-C. Public API 정리

- `small/medium/large`, `disable`처럼 남아 있는 compatibility alias는 canonical prop으로 정규화한다.
- 새 문서와 Storybook controls에서는 canonical API만 노출한다.
- alias 사용량과 제거 조건을 `DEPRECATIONS.md`에서 추적한다.
- 이벤트 callback은 API grammar의 value-first 원칙을 따른다.
- polymorphic `as`는 Card, Button/link처럼 semantic root 변경이 실제 요구되는 컴포넌트에만 제공한다.

## P1-D. Test architecture

Storybook을 실제 계약 증거로 유지하면서 다음 계층을 추가한다.

| 계층 | 책임 |
| --- | --- |
| Static/type | prop grammar, ref target type, part 이름, package export |
| Unit | controlled/uncontrolled 전환, normalization, conditional rendering |
| DOM integration | keyboard, focus, ARIA, Portal, outside click, scroll container |
| Storybook play | 사용자 흐름, normal/narrow, light/dark, compound state |
| Visual regression | geometry, density, overflow, portal theme와 stacking |
| Consumer verification | LK Portal 등 실제 product workflow와 package installation |

이슈를 닫을 때 해당 회귀를 가장 낮은 적절한 계층에 하나 이상 남긴다.

## 핵심 적용 대상

첫 단계는 아래 15개 표면으로 제한한다.

1. Button
2. Input
3. Textarea
4. SearchField
5. Select
6. FieldAction
7. SegmentedControl
8. Tabs
9. Card
10. DataToolbar
11. SideNav
12. DropdownMenu
13. Popover
14. Tooltip
15. Modal

각 컴포넌트는 다음 표를 채워야 한다.

| 계약 | 필수 내용 |
| --- | --- |
| DOM | root, focus target, semantic element, ref target |
| State | controlled/uncontrolled, disabled/readOnly/loading/invalid/empty |
| Geometry | size, width, overflow, conditional layout, narrow behavior |
| Styling | root props, named parts, data attributes, component vars |
| Accessibility | name, role, keyboard, focus 이동·복원, ARIA state |
| Composition | 허용 slot, sibling, 금지 nesting, product-owned state |
| Evidence | type, prompt, matrix, Storybook play, visual/consumer check |

## 실행 순서

### Stage 0 — 현재 정합성 회복

- Select prompt의 compact typography 설명 수정
- DataToolbar ownership/empty-row 계약 수정
- SegmentedControl·DropdownMenu matrix 항목 추가
- Portal theme inheritance 문서화
- Select/MessageFeed follow-up 구현과 검증

### Stage 1 — 공통 surface와 ref

- `COMPONENT_SURFACE_CONTRACT.md` 승인
- part naming과 `data-slot` grammar 확정
- merged-ref utility와 ref target 규칙 확정
- Button, Input, Select, Card, DataToolbar에 pilot 적용
- 기존 소비자 CSS/ref 사용을 조사하고 migration 영향 기록

### Stage 2 — Overlay platform

- `OVERLAY_PLATFORM_CONTRACT.md` 승인
- 공통 Portal/context/stacking foundation 구현
- DropdownMenu·Popover·Tooltip·Select popup부터 전환
- Modal family의 focus/inert/scroll lock 계약과 결합
- Table overflow, nested overlay, theme, narrow viewport 회귀 검증

### Stage 3 — 확장과 API 정리

- 나머지 핵심 컴포넌트에 surface/ref contract 적용
- compatibility alias를 deprecation register로 이동
- Provider/theme runtime 도입 여부 확정 및 additive 구현
- 공통 conformance suite를 release gate에 편입

## 이슈와 릴리스 운영

이슈 상태는 구현과 채택을 분리한다.

```text
triage
  -> contract-approved
  -> in-progress
  -> fixed-in-rc
  -> ready-for-consumer-verify
  -> consumer-verified
  -> closed
```

- `#17`, `#22`~`#26`은 현재 source의 대상 수정과 새 follow-up을 확인한 뒤 실제 package/consumer 상태를 기록한다.
- `fixed-in-rc`는 코드와 package artifact가 있다는 의미이며 제품 채택 완료를 뜻하지 않는다.
- release된 version bytes를 덮어쓰지 않고 변경마다 새 rc version을 사용한다.
- Storybook 통과만으로 LK Portal의 Table, toolbar, floating panel workflow가 검증됐다고 판단하지 않는다.

## 검증 명령

표적 변경 중에는 관련 component story와 가장 작은 contract 검사를 실행한다. 최종 checkpoint에서
다음을 순서대로 확인한다.

```powershell
npm run check:components
npm run check:api-drift
npm run check:api-grammar
npm run check:contracts
npm run check:docs
npm run check
npm run check:pack:ci
npm run check:workspace-consumer:windows
```

Portal/overlay와 layout 변경은 browser-backed Storybook interaction과 visual regression을
필수로 포함한다. package set이 만들어진 뒤에는 관련 LK 제품에서 실제 workflow를 확인한다.

## 완료 조건

- [x] Select·MessageFeed follow-up의 LDS 구현이 완료됐다. 문서의 `Completed` 전환은 consumer 채택 뒤에 수행한다.
- [x] Select typography 등 확인된 문서와 코드의 의미 불일치가 없다.
- [x] 핵심 15개 컴포넌트의 DOM/state/geometry/styling/accessibility/composition 표가 완성됐다.
- [x] Styles/Slots API와 ref target 정책이 stable contract로 승인됐다.
- [x] DropdownMenu, Popover, Tooltip, Select와 Modal family가 공통 overlay 정책을 따른다.
- [x] 이슈에서 확인된 density, empty layout, width, Portal/theme 회귀가 자동 검사에 남아 있다.
- [x] source, type, prompt, API/state matrix, Storybook와 generated package가 일치한다.
- [x] 미발행 rc.21 local package candidate set과 Windows React 18/19 consumer matrix가 통과했다.
- [ ] 적용 대상 LK 제품의 실제 workflow 검증이 기록됐다.
- [x] migration과 deprecation이 필요한 변경에 대체 경로와 제거 시점이 있다.

## 범위 밖

- 실제 소비 근거가 없는 Calendar, Carousel, Resizable 등 신규 컴포넌트 확장
- 모든 컴포넌트의 무제한 내부 DOM 공개
- 전역 `sm/md/lg`를 하나의 픽셀 척도로 합치는 변경
- 제품 route, backend policy, 데이터 fetching과 완성 화면을 LDS가 소유하는 변경
- 기존 203개 컴포넌트를 한 번에 재작성하는 작업
