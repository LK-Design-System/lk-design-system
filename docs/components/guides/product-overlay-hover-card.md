# Hover Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Overlay |
| Owner | `HoverCard` |
| Storybook | `LDS Product/Overlay/Hover Card` |
| Source | `../component-content.json#product-overlay-hover-card` |

포인터를 둔 대상의 제목·상태·요약처럼 비필수 미리보기를 잠시 보여 줄 때 적합합니다. 반드시 읽거나 조작해야 하는 콘텐츠에는 Hover Card 대신 Popover 또는 별도 상세 화면을 사용하세요.

## 사용 판단

### 사용

- 포인터를 둔 대상의 제목·상태·요약처럼 비필수 미리보기를 잠시 보여 줄 때 적합합니다. 반드시 읽거나 조작해야 하는 콘텐츠에는 Hover Card 대신 Popover 또는 별도 상세 화면을 사용하세요.
- Escape로 닫은 trigger는 닫힌 상태를 유지합니다. 초점이 trigger에 남아 있는 동안에는 focus로 다시 열리지 않고, 포인터가 나갔다 다시 들어오거나 초점이 앵커를 떠났다 Tab으로 돌아오면 평소대로 다시 엽니다. 초점 복원이 곧바로 hover/focus 열림 규칙을 재발화해 카드가 되살아나면 키보드 사용자에게는 닫을 방법이 없어지기 때문입니다.
- open · defaultOpen · onOpenChange triad와 align · width를 지원합니다. viewport 경계에서는 위/아래를 flip하고 좌우를 clamp하며, trigger와 카드 사이를 포인터가 이동해도 유지됩니다.
- 표준 style은 HTMLAttributes 계약대로 루트 앵커에 적용합니다. 떠 있는 미리보기 표면을 조정할 때만 panelStyle을 사용합니다.

### 사용하지 않음

- Hover Card가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | HoverCard의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Trigger | 호버 시 카드를 드러내는 요소. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Open Delay | 포인터로 열릴 때의 지연(ms). @default 120 |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | Yes | 호버 시 카드를 드러내는 요소. |
| `children` | `React.ReactNode` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `align` | `'left' \| 'right'` | No | 앵커 방향. @default "left" |
| `width` | `number` | No | 너비(px). @default 280 |
| `open` | `boolean` | No | 제어된 열림 상태. |
| `defaultOpen` | `boolean` | No | 비제어 초기 열림 상태. @default false |
| `onOpenChange` | `(open: boolean) = void` | No | 열림 상태 변경 알림. |
| `openDelay` | `number` | No | 포인터로 열릴 때의 지연(ms). @default 120 |
| `closeDelay` | `number` | No | 포인터/초점이 떠난 뒤 닫히는 지연(ms). @default 120 |
| `panelStyle` | `React.CSSProperties` | No | 떠 있는 미리보기 패널에만 적용할 스타일입니다. 루트 스타일은 표준 style을 사용합니다. |

## States

| State | Contract |
| --- | --- |
| open | 제어된 열림 상태. 타입 계약: boolean |
| defaultOpen | 비제어 초기 열림 상태. @default false 타입 계약: boolean |
| onOpenChange | 열림 상태 변경 알림. 타입 계약: (open: boolean) = void |
| openDelay | 포인터로 열릴 때의 지연(ms). @default 120 타입 계약: number |
| 상호작용 · 호버·초점·Escape | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- trigger는 focusable한 단일 요소이며, children은 읽기 전용 미리보기입니다. 카드 안에 링크·버튼·입력을 넣지 않습니다. 조작이 필요하면 Popover, 짧은 한 줄 힌트면 Tooltip을 씁니다.
- hover는 openDelay 뒤 열리고 closeDelay 뒤 닫히지만 keyboard focus는 즉시 엽니다. Escape는 포인터나 초점을 옮기지 않고 닫습니다. trigger는 aria-describedby로 preview를 참조합니다.
- Escape로 닫은 trigger는 닫힌 상태를 유지합니다. 초점이 trigger에 남아 있는 동안에는 focus로 다시 열리지 않고, 포인터가 나갔다 다시 들어오거나 초점이 앵커를 떠났다 Tab으로 돌아오면 평소대로 다시 엽니다. 초점 복원이 곧바로 hover/focus 열림 규칙을 재발화해 카드가 되살아나면 키보드 사용자에게는 닫을 방법이 없어지기 때문입니다.
- open · defaultOpen · onOpenChange triad와 align · width를 지원합니다. viewport 경계에서는 위/아래를 flip하고 좌우를 clamp하며, trigger와 카드 사이를 포인터가 이동해도 유지됩니다.
- WDS에 별도 HoverCard component-set은 없으므로 새 chrome을 만들지 않고 Popover의 r12, elevated surface, line, shadow-md, 16px padding을 상속합니다. 상호작용만 hover/focus preview로 제한합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WDS에 별도 HoverCard component-set은 없으므로 새 chrome을 만들지 않고 Popover의 r12, elevated surface, line, shadow-md, 16px padding을 상속합니다. 상호작용만 hover/focus preview로 제한합니다. |
| 명시 규칙 2 | WCAG 2.2 SC 1.4.13은 hover/focus 추가 콘텐츠가 dismissible·hoverable·persistent해야 한다고 규정합니다. |
| 명시 규칙 3 | - WDS에 별도 HoverCard component-set은 없으므로 새 chrome을 만들지 않고 Popover의 r12, elevated surface, line, shadow-md, 16px padding을 상속합니다. 상호작용만 hover/focus preview로 제한합니다. - WCAG 2.2 SC 1.4.13은 hover/focus 추가 콘텐츠가 dismissible·hoverable·persistent해야 한다고 규정합니다. - WAI-ARIA Tooltip pattern은 trigger의 aria-describedby, tooltip의 비초점 상태… |

## Responsive

- open · defaultOpen · onOpenChange triad와 align · width를 지원합니다. viewport 경계에서는 위/아래를 flip하고 좌우를 clamp하며, trigger와 카드 사이를 포인터가 이동해도 유지됩니다.
- - trigger는 focusable한 단일 요소이며, children은 읽기 전용 미리보기입니다. 카드 안에 링크·버튼·입력을 넣지 않습니다. 조작이 필요하면 Popover, 짧은 한 줄 힌트면 Tooltip을 씁니다. - hover는 openDelay 뒤 열리고 closeDelay 뒤 닫히지만 keyboard focus는 즉시 엽니다. Escape는 포인터나 초점을 옮기지 않고 닫습니다. trigger는 aria-describedby로 preview를 참조합니다. - Escape로 닫은 trigger는 닫힌 상태를 유지합니다. 초점이 trigger에 남아 있는….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 사용자에게 보이는 Hover Card 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- trigger는 focusable한 단일 요소이며, children은 읽기 전용 미리보기입니다. 카드 안에 링크·버튼·입력을 넣지 않습니다. 조작이 필요하면 Popover, 짧은 한 줄 힌트면 Tooltip을 씁니다.
- hover는 openDelay 뒤 열리고 closeDelay 뒤 닫히지만 keyboard focus는 즉시 엽니다. Escape는 포인터나 초점을 옮기지 않고 닫습니다. trigger는 aria-describedby로 preview를 참조합니다.
- Escape로 닫은 trigger는 닫힌 상태를 유지합니다. 초점이 trigger에 남아 있는 동안에는 focus로 다시 열리지 않고, 포인터가 나갔다 다시 들어오거나 초점이 앵커를 떠났다 Tab으로 돌아오면 평소대로 다시 엽니다. 초점 복원이 곧바로 hover/focus 열림 규칙을 재발화해 카드가 되살아나면 키보드 사용자에게는 닫을 방법이 없어지기 때문입니다.
- WDS에 별도 HoverCard component-set은 없으므로 새 chrome을 만들지 않고 Popover의 r12, elevated surface, line, shadow-md, 16px padding을 상속합니다. 상호작용만 hover/focus preview로 제한합니다.
- WCAG 2.2 SC 1.4.13은 hover/focus 추가 콘텐츠가 dismissible·hoverable·persistent해야 한다고 규정합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Escape로 닫은 trigger는 닫힌 상태를 유지합니다. 초점이 trigger에 남아 있는 동안에는 focus로 다시 열리지 않고, 포인터가 나갔다 다시 들어오거나 초점이 앵커를 떠났다 Tab으로 돌아오면 평소대로 다시 엽니다. 초점 복원이 곧바로 hover/focus 열림 규칙을 재발화해 카드가 되살아나면 키보드 사용자에게는 닫을 방법이 없어지기 때문입니다. |
| Don't | Hover Card가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | open · defaultOpen · onOpenChange triad와 align · width를 지원합니다. viewport 경계에서는 위/아래를 flip하고 좌우를 clamp하며, trigger와 카드 사이를 포인터가 이동해도 유지됩니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 HoverCard의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Menubar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Popover` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<HoverCard trigger={<Link>문서 A</Link>}>
  <b>문서 A</b> · 검토 중 · 오늘 업데이트됨.
</HoverCard>
```

## Tokens and API

### Tokens

- `No component-specific CSS custom property; Foundation semantic tokens apply.`

### Source contracts

- `components/overlay/HoverCard.jsx`
- `components/overlay/HoverCard.d.ts`
- `components/overlay/HoverCard.prompt.md`
- `stories/OverlayHoverCard.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- HoverCard prompt contract: `components/overlay/HoverCard.prompt.md`
- Storybook implementation evidence: `stories/OverlayHoverCard.stories.jsx`
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [WAI-ARIA Tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Spectrum Tooltip](https://react-spectrum.adobe.com/Tooltip)
