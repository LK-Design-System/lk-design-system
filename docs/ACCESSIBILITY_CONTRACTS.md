# Accessibility contracts

LK 디자인 시스템의 접근성 기준은 컴포넌트를 사용하는 제품 팀이 매번 새로 판단하지 않도록 하는 계약입니다. 모든 interactive 컴포넌트는 아래 항목을 Storybook 예시, 코드, 또는 테스트 근거로 증명해야 합니다.

## Required contract

| 항목 | 기준 | 증거 |
| --- | --- | --- |
| Semantic | 가능한 경우 native HTML element를 우선 사용한다. custom role은 native로 표현할 수 없을 때만 쓴다. | 컴포넌트 JSX, Storybook accessibility 패널 |
| Keyboard | Tab 순서, Enter/Space, Escape, Arrow key 동작을 명시한다. | Storybook interaction 또는 prompt 문서 |
| Focus | focus visible, focus trap, focus restore, disabled focus 정책을 명시한다. | 컴포넌트 예시와 수동 QA |
| Screen reader | accessible name, aria state, live region 문구를 명시한다. | JSX와 Storybook text |
| State | default, hover, focus, active, selected, disabled, loading, invalid 상태를 가능한 범위에서 노출한다. | 상태 매트릭스 |
| Motion | 중요한 상태 변화는 색상만으로 전달하지 않는다. motion은 prefers-reduced-motion을 존중한다. | CSS token 또는 component style |

## Keyboard baseline

| 컴포넌트 계열 | 필수 키보드 동작 |
| --- | --- |
| Button, IconButton, SplitButton | Tab으로 진입, Enter/Space로 실행, disabled는 실행 불가 |
| Checkbox, Switch, Radio | Space로 토글, RadioGroup은 Arrow key로 이동 |
| Select, Combobox, AutoComplete | Arrow key로 옵션 이동, Enter로 선택, Escape로 닫기 |
| Tabs, SegmentedControl | Arrow key로 인접 항목 이동, Home/End는 첫/마지막 항목 |
| Modal, Drawer, Sheet, Alert | Escape 닫기, 내부 focus trap, 닫힌 뒤 trigger로 focus restore |
| Toast, Notification, Banner, Callout | 자동 소멸 정보는 live region 정책을 명시, 중요한 알림은 수동 dismiss 제공 |
| DataGrid, Table, Tree, TopicTree | row/cell/treeitem focus 기준, 확장/축소 키, 선택 상태를 명시 |
| ContentEditor | 제목 input, 본문 textarea, toolbar button, 상태 live region 순서가 자연스러워야 함 |
| CanvasEditorShell, ViewerToolbar | viewport와 toolbar 사이 이동 순서, 단축키 충돌, undo/redo 상태 announce |

## Focus policy

- Focus ring은 브랜드 색상보다 `semantic.control.focusRing` 또는 동등한 component token을 우선 사용한다.
- Focus ring은 hover style과 별도로 보여야 한다.
- Disabled control은 focusable하지 않게 두는 것을 기본값으로 한다. 설명이 필요한 disabled 항목은 tooltip이나 adjacent text로 이유를 제공한다.
- Modal 계열은 열린 순간 첫 interactive element 또는 heading에 focus를 보낸다.
- Overlay가 닫히면 원래 trigger로 focus를 복귀시킨다.

## Screen reader policy

- icon-only button은 `aria-label` 또는 visible hidden label이 필요하다.
- 상태 badge는 색상과 텍스트를 함께 제공한다.
- loading은 `aria-busy` 또는 live text를 제공한다.
- progress는 `aria-valuemin`, `aria-valuemax`, `aria-valuenow`를 갖는다.
- domain safety state는 축약어만 쓰지 않는다. 예: 긴급 정지, 위치 기준, 연결 상태는 주변 문맥에서 풀어 쓴다.

## Release gate

새 컴포넌트 또는 interactive 상태를 추가할 때 PR은 아래를 충족해야 한다.

- Storybook에 keyboard/focus가 확인 가능한 예시가 있다.
- component prompt 문서에 접근성 계약이 있다.
- `pnpm run check:a11y` 또는 Storybook accessibility 패널에서 blocking violation이 없다.
- icon-only control은 accessible name이 있다.
- 색상만으로 상태를 전달하지 않는다.
