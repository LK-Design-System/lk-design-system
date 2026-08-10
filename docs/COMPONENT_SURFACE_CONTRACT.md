# Component surface contract

| Field | Value |
| --- | --- |
| Type | Stable contract |
| Status | Current |
| Owner | Design system owner · Core/Product component owners |
| Last reviewed | 2026-08-04 |
| Applies to | Public LDS React components, beginning with the 16-component refinement set |

이 문서는 LDS 컴포넌트의 public DOM surface, 스타일 대상과 ref target을 예측 가능하게
만드는 공통 계약이다. 내부 DOM 전체를 공개하는 정책이 아니라, 제품 레이아웃과 테스트에
필요한 최소한의 안정 표면을 명명한다.

## Root and native target

- `className`과 `style`은 public root에 적용한다.
- root와 native focus target이 다르면 native target은 `inputClassName`·`inputStyle`,
  `triggerClassName`·`triggerStyle`처럼 역할이 드러나는 별도 prop으로 연다.
- `ref`는 native-like control에서는 실제 focus target을, composite/surface에서는 public
  root를 가리킨다. 두 대상이 모두 필요하면 `rootRef`, `inputRef`, `triggerRef`처럼 분리한다.
- `.d.ts`는 실제 DOM element type을 선언한다. ref target 변경은 public API 변경이며
  migration note와 consumer verification이 필요하다.
- root element, focus target과 semantic role은 각 component prompt와 중앙 API/state
  matrix에 기록한다.

React의 공식 ref 안내처럼 focus·selection·measurement가 필요한 DOM node만 ref로
노출하며, React 18과 19를 함께 지원하는 현재 package에서는 `forwardRef`를 호환
경계로 사용한다. ([React `forwardRef`](https://react.dev/reference/react/forwardRef))

## Named parts

복잡한 컴포넌트만 `classNames`와 `styles`를 제공한다.

```tsx
<Select
  classNames={{ root: 'scope-select', trigger: 'scope-trigger' }}
  styles={{ dropdown: { maxHeight: 240 } }}
  vars={{ '--lds-select-min-width': '16rem' }}
/>
```

- part key는 컴포넌트별 string union으로 제한된 public API다.
- 같은 part의 DOM node에는 `data-slot="<part>"`를 둔다.
- `classNames`는 class만, `styles`는 inline style만 합성한다. root의 직접 `className`과
  `style`, native target의 직접 prop이 마지막 consumer override다.
- `data-state`, `data-disabled`, `data-invalid`, `data-open`, `data-readonly`는 실제 semantic
  state만 반영한다. 내부 hover 계산이나 임시 측정 node를 공개 상태로 승격하지 않는다.
- DOM 순서, 내부 구현 class와 `:nth-child` selector는 public 계약이 아니다.

Mantine Styles API의 named selector와 component variable 모델을 참고하되, LDS는 part를
실제 필요가 확인된 anatomy로 제한하고 모든 내부 node를 selector로 노출하지 않는다.
([Mantine Styles API](https://mantine.dev/styles/styles-api/))

## Component variables

- `vars`는 해당 컴포넌트가 문서화한 `--lds-<component>-*` key만 허용한다.
- 런타임에서도 다른 prefix의 key를 버려 arbitrary custom-property 통로로 확장되지 않게 한다.
- semantic color, spacing foundation과 global density token은 `vars`로 재정의하지 않는다.
- 새 variable은 fallback token, 적용 part, 허용 값과 narrow/dark evidence를 함께 기록한다.

## Composition boundary

- 반복·계층 구조는 typed `items`/`groups`로 표현한다.
- 임의 콘텐츠는 목적이 명확한 소수의 named slot만 사용한다.
- `asChild`, 무제한 render prop, 내부 focus target 교체를 기본 escape hatch로 제공하지 않는다.
- Button, Menu, Dialog 등 LDS가 keyboard/ARIA를 소유하는 컴포넌트는 slot이나 style API가
  semantic ownership을 바꾸지 못한다.

## Conformance checklist

첫 적용 대상은 Button, Input, Textarea, SearchField, Select, FieldAction,
SegmentedControl, Tabs, Card, DataToolbar, DataCollectionPanel, SideNav, DropdownMenu, Popover, Tooltip, Modal이다.
각 컴포넌트는 다음을 type, prompt와 Storybook contract에서 증명한다.

| Area | Required evidence |
| --- | --- |
| DOM | root·focus target·semantic element·ref target |
| State | controlled/uncontrolled 및 지원하는 disabled/readOnly/loading/invalid/open state |
| Geometry | size·width·overflow·conditional layout·narrow behavior |
| Styling | root props·named parts·data attributes·허용 component vars |
| Accessibility | accessible name·role·keyboard·focus 이동/복원·ARIA state |
| Composition | 허용 slot·sibling·금지 nesting·product-owned state |

## Initial 16-component conformance register

| Component | Root / default ref | State and accessibility | Public styling and geometry | Composition boundary |
| --- | --- | --- | --- | --- |
| Button | polymorphic root / 같은 root | native button·anchor 의미, disabled·loading·busy | `root`, `content`, `loader`; `--lds-button-*` | 내용·아이콘은 허용하되 activation은 Button 소유 |
| Input | field stack / native input (`rootRef` 분리) | disabled·readOnly·invalid, label·description 병합 | 9 parts; `--lds-input-*` | leading/trailing/action slot만 허용, 값은 native input 소유 |
| Textarea | field stack / native textarea (`rootRef` 분리) | disabled·readOnly·invalid, label·description 병합 | 6 parts; `--lds-textarea-*` | multiline 입력 외 제품 counter 정책은 consumer 소유 |
| SearchField | field stack / native search input (`rootRef` 분리) | Enter search, Escape/clear, clear 후 focus 복원 | 8 parts; `--lds-search-field-*` | query·검색 실행 결과는 제품 소유 |
| Select | field stack / combobox trigger (`rootRef` 분리) | controlled/uncontrolled, listbox keyboard, close 후 focus 복원 | root·trigger·dropdown·option 등; `--lds-select-*` | options만 입력, Portal·positioning은 LDS 소유 |
| FieldAction | polymorphic root / 같은 root | native form·field-before-action Tab 순서 | 5 parts; `--lds-field-action-gap` | field/action 각각 하나, 값·submit·loading은 제품 소유 |
| SegmentedControl | radiogroup / radiogroup | controlled/uncontrolled, radio roving focus, disabled skip | 5 parts; `--lds-segmented-control-*` | 짧은 상호 배타 보기만 허용 |
| Tabs | tablist / tablist | controlled/uncontrolled, tab roving focus·Arrow/Home/End | 6 parts; `--lds-tabs-*` | tab panel DOM과 콘텐츠는 consumer 소유 |
| Card | polymorphic surface / 같은 root | interactive opt-in keyboard, heading 의미 | 9 parts; `--lds-card-*` | 구조화 slot만 허용, 중첩 interactive surface 금지 |
| DataToolbar | toolbar root / 같은 root | header·controls 조건부 행, empty면 `null` | named rows·actions; `--lds-data-toolbar-*` | query·selection·bulk policy는 제품/DataGrid 소유 |
| DataCollectionPanel | polymorphic collection surface / 같은 root | toolbar → state/content → freshness → footer 순서, wide/compact 중 하나만 노출 | 6 parts; `--lds-data-collection-panel-*` | embedded perimeter와 slot 전환은 LDS, query·row 의미·compact markup·pagination state는 제품 소유 |
| SideNav | native `nav` / 같은 root | selected·collapsed·disclosure, link/button 의미, overlay dismiss | 12 parts; `--lds-side-nav-*` | route·permission·외부 collapse control은 제품 shell 소유 |
| DropdownMenu | anchor root / 같은 root | controlled/uncontrolled, menu keyboard, topmost Escape·restore | `root`·`trigger`·`panel`·`menu`·`item`·`divider`·`actionArea`; `--lds-dropdown-menu-*` | item model만 허용, nested Portal stack은 LDS 소유 |
| Popover | anchor root / 같은 root | controlled/uncontrolled, outside press·Escape·restore | `root`·`trigger`·`panel`; `--lds-popover-*` | content slot 허용, Portal·positioning은 LDS 소유 |
| Tooltip | trigger wrapper / 같은 root | hover·focus, `aria-describedby`, non-interactive surface | `root`·`bubble`·`surface`·`content`·`shortcut`; `--lds-tooltip-*` | 짧은 설명만 허용, interactive content 금지 |
| Modal | portalled dialog / dialog root | controlled/uncontrolled, modal name, trap·inert·topmost Escape·restore | `backdrop`·`root`·`header`·`title`·`close`·`body`·`footer`; `--lds-modal-*` | title/body/footer 허용, Portal·focus·background inert는 LDS 소유 |

각 행의 surface/ref Storybook contract는 ref target, `data-slot`, part class/style, component variable을
실제 DOM과 computed style로 검증한다. overlay 행은 추가로 clipping escape, theme/`dir` 상속,
중첩 topmost dismiss와 modal background inert를 검증한다.

새 part나 ref를 추가할 때 canonical source, declaration, prompt, API/state matrix, Storybook,
generated workspace package와 consumer type fixture를 한 변경에서 맞춘다.
