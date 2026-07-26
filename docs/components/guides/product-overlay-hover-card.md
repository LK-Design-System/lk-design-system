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

- 표준 style은 HTMLAttributes 계약대로 루트 앵커에 적용합니다. 떠 있는 미리보기 표면을 조정할 때만 panelStyle을 사용합니다.
- HoverCard의 정보는 비필수여야 하며 touch-only 사용자가 반드시 알아야 할 내용을 숨기지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| trigger | 호버 시 카드를 드러내는 요소. |
| openDelay | 포인터로 열릴 때의 지연(ms). @default 120 |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | Yes | 호버 시 카드를 드러내는 요소. |
| `children` | `React.ReactNode` | Yes |  |
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
| open | 제어된 열림 상태. |
| defaultOpen | 비제어 초기 열림 상태. @default false |
| onOpenChange | 열림 상태 변경 알림. |
| openDelay | 포인터로 열릴 때의 지연(ms). @default 120 |

## Behavior and interaction

- HoverCard — 링크나 focusable 항목의 비필수 미리보기를 hover와 keyboard focus에서 보여 주는 LK Product Extension입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WDS에 별도 HoverCard component-set은 없으므로 새 chrome을 만들지 않고 Popover의 r12, elevated surface, line, shadow-md, 16px padding을 상속합니다. 상호작용만 hover/focus preview로 제한합니다. |
| 명시 규칙 2 | WCAG 2.2 SC 1.4.13은 hover/focus 추가 콘텐츠가 dismissible·hoverable·persistent해야 한다고 규정합니다. |

## Responsive

- open · defaultOpen · onOpenChange triad와 align · width를 지원합니다. viewport 경계에서는 위/아래를 flip하고 좌우를 clamp하며, trigger와 카드 사이를 포인터가 이동해도 유지됩니다.

## Accessibility

- trigger는 focusable한 단일 요소이며, children은 읽기 전용 미리보기입니다. 카드 안에 링크·버튼·입력을 넣지 않습니다. 조작이 필요하면 Popover, 짧은 한 줄 힌트면 Tooltip을 씁니다.
- hover는 openDelay 뒤 열리고 closeDelay 뒤 닫히지만 keyboard focus는 즉시 엽니다. Escape는 포인터나 초점을 옮기지 않고 닫습니다. trigger는 aria-describedby로 preview를 참조합니다.
- Escape로 닫은 trigger는 닫힌 상태를 유지합니다. 초점이 trigger에 남아 있는 동안에는 focus로 다시 열리지 않고, 포인터가 나갔다 다시 들어오거나 초점이 앵커를 떠났다 Tab으로 돌아오면 평소대로 다시 엽니다. 초점 복원이 곧바로 hover/focus 열림 규칙을 재발화해 카드가 되살아나면 키보드 사용자에게는 닫을 방법이 없어지기 때문입니다.
- WAI-ARIA Tooltip pattern은 trigger의 aria-describedby, tooltip의 비초점 상태, Escape 닫기와 trigger focus 유지를 정의합니다.
- WAI-ARIA Dialog pattern과 달리 HoverCard는 focus를 받거나 가두지 않습니다. 링크·버튼처럼 조작 가능한 콘텐츠가 필요하면 Popover 또는 명시적인 dialog를 사용합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Menubar` | 대표 시나리오에서 조합 |
| `Popover` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<HoverCard trigger={<Link>문서 A</Link>}>
  <b>문서 A</b> · 검토 중 · 오늘 업데이트됨.
</HoverCard>
```

## Tokens and API

### Source contracts

- `components/overlay/HoverCard.jsx`
- `components/overlay/HoverCard.d.ts`
- `components/overlay/HoverCard.prompt.md`
- `stories/OverlayHoverCard.stories.jsx`

## Sources

- HoverCard prompt contract: `components/overlay/HoverCard.prompt.md`
- Storybook implementation evidence: `stories/OverlayHoverCard.stories.jsx`
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [WAI-ARIA Tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Spectrum Tooltip](https://react-spectrum.adobe.com/Tooltip)
