# Primary Detail

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Layout |
| Owner | `PrimaryDetail` |
| Storybook | `LDS Product/Layout/Primary Detail` |
| Source | `../component-content.json#product-layout-primary-detail` |

목록·표에서 선택한 항목의 상세를 넓은 화면에서는 병렬 영역, 좁은 화면에서는 focus-managed overlay로 보여 줄 때 적합합니다. 독립적인 탐색 목적지나 긴 편집 흐름에는 PrimaryDetail 대신 전용 상세 페이지를 사용하세요.

## 사용 판단

### 사용

- 목록·표에서 선택한 항목의 상세를 넓은 화면에서는 병렬 영역, 좁은 화면에서는 focus-managed overlay로 보여 줄 때 적합합니다. 독립적인 탐색 목적지나 긴 편집 흐름에는 PrimaryDetail 대신 전용 상세 페이지를 사용하세요.
- mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다.
- 목록·표·트리 같은 primary 콘텐츠와 선택 항목 상세를 연결하는 LK Product Extension입니다. 선택 state와 route는 제품이 소유하고, 컴포넌트는 데스크톱 inline region과 좁은 폭 focus-managed Drawer의 일관된 표현만 소유합니다.
- Primary Detail가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다.
- - mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다. - mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다. - closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다. - detailOpen, 선택된….
- 내부 Split, Drawer, DockPanel, DescriptionList를 비교했습니다. DockPanel은 캔버스 위 도구 패널이므로 데이터 목록 상세에는 재사용하지 않고, 일반 상세는 Drawer와 divider만 사용합니다. PatternFly Primary-detail은 선택 후 같은 맥락에서 상세를 유지하고 작은 화면에서 overlay로 전환하는 흐름을, Fluent Drawer는 현재 맥락의 보조 상세와 focus 관리를, WAI-ARIA Dialog pattern은 modal keyboard 계약을 제공합니다.
- 자동 media query와 route persistence는 의도적으로 넣지 않았습니다. shell의 breakpoint와 제품 router가 이미 가진 source of truth를 중복하지 않기 위해 mode를 controlled로 둡니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | PrimaryDetail의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Primary Label | primaryLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Detail Label | detailLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Detail Title | detailTitle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Detail Footer | detailFooter 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Close Label | closeLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Detail Body Style | detailBodyStyle 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `primary` | `React.ReactNode` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `detail` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `detailOpen` | `boolean` | No | 상세 표시 여부. @default false |
| `mode` | `'inline' \| 'overlay'` | No | 데스크톱 병렬 region 또는 좁은 폭 modal Drawer. @default "inline" |
| `primaryLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `detailLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `detailTitle` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `detailWidth` | `number` | No | inline track 및 Drawer 너비. @default 360 |
| `detailFooter` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onDetailClose` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `closeLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `initialFocusRef` | `React.RefObject` | No | overlay가 열릴 때 우선 초점을 받을 상세 내부 요소. |
| `returnFocusRef` | `React.RefObject` | No | inline close 및 overlay dismiss 뒤 초점을 돌려보낼 선택 trigger. |
| `restoreFocus` | `boolean` | No | overlay focus 복원. @default true |
| `primaryStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `detailStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `detailBodyStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| detailOpen | 상세 표시 여부. @default false 타입 계약: boolean |
| 반응형 · 좁은 폭의 겹침형 상세 영역 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다.
- closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다.
- detailOpen, 선택된 항목, URL/history, breakpoint 판정은 controlled 제품 state입니다. 레이아웃이 임의로 선택이나 route를 바꾸지 않습니다.
- inline 닫기 역시 returnFocusRef가 가리키는 선택 trigger로 초점을 돌립니다.
- 목록·표·트리 같은 primary 콘텐츠와 선택 항목 상세를 연결하는 LK Product Extension입니다. 선택 state와 route는 제품이 소유하고, 컴포넌트는 데스크톱 inline region과 좁은 폭 focus-managed Drawer의 일관된 표현만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- 제품은 normal/narrow breakpoint에서 같은 상세 콘텐츠를 두 presentation에 전달해야 합니다.
- 목록·표·트리 같은 primary 콘텐츠와 선택 항목 상세를 연결하는 LK Product Extension입니다. 선택 state와 route는 제품이 소유하고, 컴포넌트는 데스크톱 inline region과 좁은 폭 focus-managed Drawer의 일관된 표현만 소유합니다.
- - mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다. - mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다. - closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다. - detailOpen, 선택된….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다.
- closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다.
- detailFooter는 inline과 overlay(Drawer) 모두에서 우측 정렬 action 행입니다. 패널의 핵심 action은 여기에 강조 variant로 두고, "전체 보기" 같은 이동은 본문에서 TextButton/link로 낮춥니다.
- - mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다. - mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다. - closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다. - detailOpen, 선택된….

## Accessibility

- mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다.
- inline 닫기 역시 returnFocusRef가 가리키는 선택 trigger로 초점을 돌립니다.
- 목록·표·트리 같은 primary 콘텐츠와 선택 항목 상세를 연결하는 LK Product Extension입니다. 선택 state와 route는 제품이 소유하고, 컴포넌트는 데스크톱 inline region과 좁은 폭 focus-managed Drawer의 일관된 표현만 소유합니다.
- - mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다. - mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다. - closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다. - detailOpen, 선택된….
- 내부 Split, Drawer, DockPanel, DescriptionList를 비교했습니다. DockPanel은 캔버스 위 도구 패널이므로 데이터 목록 상세에는 재사용하지 않고, 일반 상세는 Drawer와 divider만 사용합니다. PatternFly Primary-detail은 선택 후 같은 맥락에서 상세를 유지하고 작은 화면에서 overlay로 전환하는 흐름을, Fluent Drawer는 현재 맥락의 보조 상세와 focus 관리를, WAI-ARIA Dialog pattern은 modal keyboard 계약을 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다. |
| Don't | mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다. |
| Do | 목록·표·트리 같은 primary 콘텐츠와 선택 항목 상세를 연결하는 LK Product Extension입니다. 선택 state와 route는 제품이 소유하고, 컴포넌트는 데스크톱 inline region과 좁은 폭 focus-managed Drawer의 일관된 표현만 소유합니다. |
| Don't | - mode="inline": 이름 있는 primary section 옆에 상세 region을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다. - mode="overlay": 기존 Drawer를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다. - closeLabel은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다. - detailOpen, 선택된…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 PrimaryDetail의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DescriptionList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatusBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TextButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DashboardGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DashboardShell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DockPanel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PageHeader` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<PrimaryDetail
  primary={<DataGrid onRowActivate={selectRow} />}
  detailOpen={selectedId != null}
  detailTitle="로봇 상세"
  detail={<RobotDetails id={selectedId} />}
  mode={isNarrow ? 'overlay' : 'inline'}
  returnFocusRef={selectedRowRef}
  onDetailClose={clearSelection}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--font-sans`
- `--fw-bold`
- `--radius-md`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/layout/PrimaryDetail.jsx`
- `components/layout/PrimaryDetail.d.ts`
- `components/layout/PrimaryDetail.prompt.md`
- `stories/LayoutPrimaryDetail.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- PrimaryDetail prompt contract: `components/layout/PrimaryDetail.prompt.md`
- Storybook implementation evidence: `stories/LayoutPrimaryDetail.stories.jsx`
- [PatternFly Primary-detail](https://www.patternfly.org/patterns/primary-detail/design-guidelines/)
- [Fluent Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
