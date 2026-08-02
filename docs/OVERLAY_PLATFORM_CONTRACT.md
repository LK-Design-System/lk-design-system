# Overlay platform contract

| Field | Value |
| --- | --- |
| Type | Stable contract |
| Status | Current |
| Owner | Design system owner · Frontend platform · Accessibility reviewer |
| Last reviewed | 2026-08-02 |
| Applies to | DropdownMenu, Popover, Tooltip/HoverCard, Select/Combobox popup, Modal/Drawer/Sheet/ConfirmDialog |

이 문서는 anchored surface와 modal surface가 공통으로 따르는 Portal, layer, focus와
dismiss 계약이다. 각 컴포넌트의 시각 anatomy는 유지하되, clipping·theme·Escape·focus
복원처럼 제품마다 다시 구현하면 안 되는 동작을 플랫폼이 소유한다.

## Portal and runtime scope

- 기본 `withinPortal`은 `true`다. target은 명시적 `portalTarget`, provider default,
  trigger의 owner document body 순으로 결정한다.
- `withinPortal={false}`는 clipping을 의도적으로 감수하는 inline embedding에만 쓴다.
- Portal wrapper는 trigger에서 가장 가까운 명시적 `data-theme` 또는
  `.theme-light|dark|auto`, `dir`을 상속한다. React context와 event propagation도
  React tree 기준으로 유지된다.
- SSR에서는 `document`가 없으면 portal node를 만들지 않는다. client에서는 explicit
  target 또는 anchor owner document를 안전하게 확인한 뒤 portal을 mount한다.
- [React `createPortal`](https://react.dev/reference/react-dom/createPortal)은 DOM의 물리적
  위치를 옮겨도 context와 React event propagation이 원래 tree를 따른다는 근거다.
- [Floating UI `FloatingPortal`](https://floating-ui.com/docs/floatingportal)은 clipping
  ancestor를 탈출하고 nested portal hierarchy를 보존하기 위해 open일 때만 portal을
  렌더하는 방식을 설명한다.

## Anchored overlays

- viewport 기준 fixed positioning, requested placement의 반대편 flip, edge shift와
  available-size constraint를 공통 engine이 계산한다.
- 공개 이름은 `open`, `defaultOpen`, `onOpenChange`, `withinPortal`, `portalTarget`,
  `zIndex`, `position`, `align`, `offset`으로 통일한다. 지원하지 않는 축은 component type에
  억지로 열지 않는다.
- outside press와 Escape는 전역 overlay stack의 topmost surface만 처리한다. Escape는
  trigger focus를 복원하고 pointer dismiss는 pointer target의 focus를 방해하지 않는다.
- trigger와 portalled content의 `aria-controls`, `aria-describedby`, label 관계는 DOM
  위치와 무관하게 유지한다.
- [Floating UI `useDismiss`](https://floating-ui.com/docs/usedismiss)의 outside press,
  Escape와 nested bubbling 모델을 family behavior의 비교 기준으로 사용한다.

## Modal overlays

- topmost modal만 Escape와 Tab containment를 소유한다.
- open 시 `initialFocusRef`, 첫 focusable, dialog root 순으로 focus하고, close 시
  `returnFocusRef` 또는 invoker로 복원한다.
- modal이 열려 있는 동안 body scroll을 중첩 카운트로 잠그고, portalled modal host 밖의
  body sibling은 `inert` 처리한다. nested modal이 닫히면 이전 inert 상태를 정확히 복원한다.
- z-index는 공통 open-order stack이 배정하며 explicit `zIndex`는 제한된 override다.
- [WAI-ARIA APG modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  의 inert background, trapped Tab, Escape, initial focus와 invoker focus return을 따른다.
- [Floating UI `FloatingFocusManager`](https://floating-ui.com/docs/floatingfocusmanager)는
  modal/non-modal focus 관리, return/restore focus와 outside inert behavior의 비교 근거다.

## Ownership boundary

- focus trap, positioning engine, overlay stack 교체 hook은 공개하지 않는다.
- 제품은 열림 상태와 실제 action side effect를 소유할 수 있지만 ARIA role, keyboard,
  focus 이동과 dismiss 순서를 바꾸지 않는다.
- component style API는 panel chrome을 조정할 수 있어도 Portal target, focus boundary와
  semantic role을 제거할 수 없다.

## Required evidence

- overflow-hidden/scroll container 안 trigger에서 panel clipping 없음
- nearest theme와 RTL direction inheritance
- normal 및 320px viewport의 flip/shift/size constraint
- nested anchored/modal topmost Escape와 focus restore
- modal background inert와 nested body scroll lock
- SSR render와 React 18/19 package consumer type check
