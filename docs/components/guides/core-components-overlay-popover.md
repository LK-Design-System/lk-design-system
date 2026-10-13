# Popover

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Popover` |
| Storybook | `LDS Core/Components/Overlay/Popover` |
| Source | `../component-content.json#core-components-overlay-popover` |

클릭한 trigger 주변에서 설명·미니 폼·피커처럼 자유로운 콘텐츠를 잠시 다룰 때 적합합니다. 명령 목록이나 작업을 막는 복잡한 흐름에는 Popover 대신 Dropdown Menu 또는 Modal을 사용하세요.

## 사용 판단

### 사용

- The panel defaults to the common owner-document Portal (withinPortal=true), inherits the nearest explicit theme and dir, and uses the shared flip/clamp/topmost-dismiss stack. Use portalTarget or Provider configuration before opting out with withinPortal=false.

### 사용하지 않음

- Core-private visual presence 동안 Portal과 positioning만 유지합니다. 닫히는 즉시 trigger의 expanded/controls 및 light-dismiss stack은 실제 닫힘 상태가 되고, 퇴장 픽셀은 aria-hidden·inert·pointer-events:none으로 상호작용에서 제외합니다. 좌표를 닫힘 초기에 초기화하지 않아 offscreen으로 튀지 않습니다.
- Popover는 route 상태, 제출 정책, 중첩 overlay orchestration을 소유하지 않습니다.
- 기존 OverlayPortal의 interactionOpen에 실제 visible을 전달해 퇴장 중 자식 portal·layer·light-dismiss·menu 엔진을 즉시 비활성화합니다. 재오픈에서는 이전 immediate-unmount와 같은 자식 subtree 초기화를 적용하며 controlled 값은 소비자가 유지합니다. 부모 닫힘으로 자식 dismiss callback을 합성하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| trigger | 패널을 토글하는 요소. |
| ariaLabel | 비모달 dialog 표면의 접근 가능한 이름. @default "팝오버" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | Yes | 패널을 토글하는 요소. |
| `children` | `React.ReactNode` | Yes | 패널 콘텐츠. |
| `align` | `'left' \| 'right'` | No | 앵커 방향. @default "left" |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | Preferred side; flips when space is insufficient. @default "bottom" |
| `offset` | `number` | No | Trigger-to-panel gap in pixels. @default 8 |
| `width` | `number \| string` | No | 패널 너비(px). @default 260 |
| `open` | `boolean` | No | 제어된 열림 상태. |
| `defaultOpen` | `boolean` | No | 비제어 초기 열림 상태. @default false |
| `onOpenChange` | `(open: boolean) = void` | No | 열림 상태 변경 알림. |
| `ariaLabel` | `string` | No | 비모달 dialog 표면의 접근 가능한 이름. @default "팝오버" |
| `withinPortal` | `boolean` | No | Render in the owner-document Portal so clipping ancestors cannot cut the panel. @default true |
| `portalTarget` | `HTMLElement \| null` | No | Explicit Portal target; defaults to provider target or owner-document body. |
| `collisionBoundary` | `FloatingCollisionBoundary` | No | Element/ref whose visible viewport intersection constrains flip, shift, and available size. Defaults to the viewport. |
| `collisionPadding` | `number` | No | Inset from every collision-boundary edge in CSS pixels. @default 16 |
| `zIndex` | `number` | No | Explicit overlay layer override. |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| open | 제어된 열림 상태. |
| defaultOpen | 비제어 초기 열림 상태. @default false |
| onOpenChange | 열림 상태 변경 알림. |

## Behavior and interaction

- Fluent 2 Popover의 관계가 보이는 배치와 비모달 맥락 표면 원칙을 유지합니다. W3C Animation from Interactions의 비필수 이동 비활성화 원칙을 반영하며, 새로운 focus trap이나 배경 차단은 만들지 않습니다.
- 열림·닫힘 모션 (2026-10-13).
- 상위 overlay의 실제 닫힘.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | collisionBoundary는 element 또는 ref를 받고, 그 요소와 viewport의 보이는 교집합을 positioning 경계로 사용합니다. 생략하면 기존 viewport 경계입니다. collisionPadding 기본 16px은 모든 경계 가장자리에 적용됩니다. Portal은 계속 owner-document body/provider target에 남으므로 clipping 탈출과 chat panel 내부 geometry 제한을 동시에 충족하며, 선호 width와 style은 경계의 가용 폭·높이를 넘을 수 없습니다. |
| 명시 규칙 2 | Popover와 HoverCard는 anchoredPanelStyle의 elevated surface, 1px line, WDS Popover r12, shadow-md, 16px padding을 공유합니다. Dropdown Menu의 WDS r16·8×20px menu shell과는 역할과 원본 컴포넌트가 달라 radius/padding을 억지로 합치지 않습니다. |
| 명시 규칙 3 | Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. |
| 명시 규칙 4 | HoverCard와 공유하는 surface·radius·padding·shadow를 유지하며 opacity와 anchor 방향의 space-1 수직 이동만 --dur-fast·--ease-out으로 연결합니다. 선택·제출 상태와 콘텐츠 정책은 추가하지 않습니다. |
| --space-1 | 4px |

## Responsive

- 패널은 선호 정렬을 유지하되 collision 경계에서 반대쪽으로 flip하고 좌우를 clamp하며, 가용 높이를 넘는 본문만 세로 스크롤합니다.
- ref, className, and style target the anchor root. Stable parts are root, trigger, and panel; panel geometry is limited to --lds-popover-width and --lds-popover-max-height.

## Accessibility

- trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요.
- open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달 Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다.
- position, align, and offset are canonical placement inputs. Products own the arbitrary panel content, while LDS owns trigger ARIA, Portal positioning, outside press, Escape, and focus restoration.
- WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.
- React Aria Popover는 Portal overlay의 positioning boundary를 boundaryElement로 별도 지정하고 위치를 자동 갱신합니다. LDS의 collisionBoundary도 Portal target과 독립된 constraint라는 같은 책임 분리를 따릅니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Popover
  trigger={<Button variant="ghost">옵션</Button>}
  width={280}
  collisionBoundary={chatPanelRef}
>
  <FormField label="반경"><Slider defaultValue={30} /></FormField>
</Popover>
```

## Tokens and API

### Tokens

- `--dur-fast`
- `--ease-out`
- `--lds-popover-max-height`
- `--lds-popover-width`
- `--space-1`

### Source contracts

- `components/overlay/Popover.jsx`
- `components/overlay/Popover.d.ts`
- `components/overlay/Popover.prompt.md`
- `stories/OverlayPopover.stories.jsx`

## Sources

- Popover prompt contract: `components/overlay/Popover.prompt.md`
- Storybook implementation evidence: `stories/OverlayPopover.stories.jsx`
- [Fluent 2 Popover](https://fluent2.microsoft.design/components/web/react/core/popover/usage)
- [WAI-ARIA APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Aria Popover](https://react-spectrum.adobe.com/react-aria/Popover.html)
- [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
