# Popover

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Overlay |
| Owner | `Popover` |
| Storybook | `LDS Product/Overlay/Popover` |
| Source | `../component-content.json#product-overlay-popover` |

클릭한 trigger 주변에서 설명·미니 폼·피커처럼 자유로운 콘텐츠를 잠시 다룰 때 적합합니다. 명령 목록이나 작업을 막는 복잡한 흐름에는 Popover 대신 Dropdown Menu 또는 Modal을 사용하세요.

## 사용 판단

### 사용

- 클릭한 trigger 주변에서 설명·미니 폼·피커처럼 자유로운 콘텐츠를 잠시 다룰 때 적합합니다. 명령 목록이나 작업을 막는 복잡한 흐름에는 Popover 대신 Dropdown Menu 또는 Modal을 사용하세요.
- open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달 Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다.
- - trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요. - open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는….
- Popover가 소유하는 Overlay 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.
- - Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. - WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.
- Popover는 route 상태, 제출 정책, 중첩 overlay orchestration을 소유하지 않습니다.
- Popover가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Popover의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Trigger | 패널을 토글하는 요소. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Aria Label | 비모달 dialog 표면의 접근 가능한 이름. @default "팝오버" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | Yes | 패널을 토글하는 요소. |
| `children` | `React.ReactNode` | Yes | 패널 콘텐츠. |
| `align` | `'left' \| 'right'` | No | 앵커 방향. @default "left" |
| `width` | `number` | No | 패널 너비(px). @default 260 |
| `open` | `boolean` | No | 제어된 열림 상태. |
| `defaultOpen` | `boolean` | No | 비제어 초기 열림 상태. @default false |
| `onOpenChange` | `(open: boolean) = void` | No | 열림 상태 변경 알림. |
| `ariaLabel` | `string` | No | 비모달 dialog 표면의 접근 가능한 이름. @default "팝오버" |

## States

| State | Contract |
| --- | --- |
| open | 제어된 열림 상태. 타입 계약: boolean |
| defaultOpen | 비제어 초기 열림 상태. @default false 타입 계약: boolean |
| onOpenChange | 열림 상태 변경 알림. 타입 계약: (open: boolean) = void |
| 상호작용 · 초점·Escape·화면 경계 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요.
- open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달 Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다.
- Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다.
- - trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요. - open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는….
- - Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. - WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Popover와 HoverCard는 anchoredPanelStyle의 elevated surface, 1px line, WDS Popover r12, shadow-md, 16px padding을 공유합니다. Dropdown Menu의 WDS r16·8×20px menu shell과는 역할과 원본 컴포넌트가 달라 radius/padding을 억지로 합치지 않습니다. |
| 명시 규칙 2 | Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. |
| 명시 규칙 3 | - Popover와 HoverCard는 anchoredPanelStyle의 elevated surface, 1px line, WDS Popover r12, shadow-md, 16px padding을 공유합니다. Dropdown Menu의 WDS r16·8×20px menu shell과는 역할과 원본 컴포넌트가 달라 radius/padding을 억지로 합치지 않습니다. - WDS component style parity는 Popover r12와 Dropdown Menu r16을 각각 원본 component-set 값으로 확인합니다. |
| 명시 규칙 4 | - Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. - WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다. |

## Responsive

- trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요.
- 패널은 선호 정렬을 유지하되 viewport 경계에서 반대쪽으로 flip하고 좌우를 clamp하며, 가용 높이를 넘는 본문만 세로 스크롤합니다.
- Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다.
- - trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요. - open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는….

## Content and writing

- WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.
- ariaLabel — 트리거에 보이는 텍스트가 없을 때 팝오버 콘텐츠의 접근성 이름을 지정합니다.
- - Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. - WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.
- - ariaLabel — 트리거에 보이는 텍스트가 없을 때 팝오버 콘텐츠의 접근성 이름을 지정합니다.

## Accessibility

- trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요.
- open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달 Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다.
- Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다.
- WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다.
- ariaLabel — 트리거에 보이는 텍스트가 없을 때 팝오버 콘텐츠의 접근성 이름을 지정합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달 Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다. |
| Don't | WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다. |
| Do | - trigger는 focusable한 단일 요소이며 DOM에 aria-haspopup="dialog"·aria-expanded· aria-controls를 전달해야 합니다. children은 패널 본문, align은 left · right, width는 선호 너비입니다. 단순 메뉴에는 DropdownMenu, 짧은 힌트에는 Tooltip을 쓰세요. - open · defaultOpen · onOpenChange controlled triad를 제공합니다. trigger click으로 열고, 바깥 pointer press 또는 Escape로 닫습니다. Escape는…. |
| Don't | - Fluent 2 Popover는 비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다. - WAI-ARIA APG Dialog Pattern의 named dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 aria-modal과 trap을 사용하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Popover의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `HoverCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Menubar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Popover trigger={<Button variant="ghost">옵션</Button>} width={280}>
  <FormField label="반경"><Slider defaultValue={30} /></FormField>
</Popover>
```

## Tokens and API

### Tokens

- `No component-specific CSS custom property; Foundation semantic tokens apply.`

### Source contracts

- `components/overlay/Popover.jsx`
- `components/overlay/Popover.d.ts`
- `components/overlay/Popover.prompt.md`
- `stories/OverlayPopover.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Popover prompt contract: `components/overlay/Popover.prompt.md`
- Storybook implementation evidence: `stories/OverlayPopover.stories.jsx`
- [Fluent 2 Popover](https://fluent2.microsoft.design/components/web/react/core/popover/usage)
- [WAI-ARIA APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
