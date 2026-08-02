# Drawer

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Overlay |
| Owner | `Drawer` |
| Storybook | `LDS Product/Overlay/Drawer` |
| Source | `../component-content.json#product-overlay-drawer` |

넓은 화면에서 필터·속성·상세처럼 주 콘텐츠를 보조하는 작업을 옆 패널에 유지할 때 적합합니다. 작은 화면의 짧은 선택에는 Drawer 대신 Sheet를, 집중이 필요한 확인에는 Dialog를 사용하세요.

## 사용 판단

### 사용하지 않음

- scrim 클릭 닫기는 closeOnScrim으로 제어하지만, 유일한 dismiss 수단으로 사용하지 않습니다.
- Fluent 2 Dialog: 확인이 필요한 작업은 Drawer를 중첩 확장하지 않고 별도 확인 dialog로 구분합니다.
- Drawer는 현재 화면과 관련된 필터, 상세, 설정을 한쪽 edge에서 보조하는 modal side panel입니다. 분류는 LDS Product Extension이며 WDS variant axis를 추가하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| subtitle | 제목 아래의 짧은 보조 설명. dialog의 aria-describedby와 연결됩니다. |
| ariaLabel | title이 없을 때 사용할 접근 가능한 이름. @default "서랍 패널" |
| closeLabel | 닫기 버튼의 접근 가능한 이름. @default "닫기" |
| bodyStyle | 스크롤 body의 padding·layout을 조합별로 조정합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 열림 상태. @default false |
| `side` | `'left' \| 'right'` | No | 슬라이드인 방향. @default "right" |
| `width` | `number` | No | 패널 너비(px). @default 380 |
| `title` | `React.ReactNode` | No |  |
| `subtitle` | `React.ReactNode` | No | 제목 아래의 짧은 보조 설명. dialog의 aria-describedby와 연결됩니다. |
| `children` | `React.ReactNode` | No |  |
| `footer` | `React.ReactNode` | No |  |
| `onClose` | `() = void` | No | Escape, scrim, 닫기 액션이 호출하는 controlled dismiss callback. |
| `closeOnScrim` | `boolean` | No | scrim 클릭으로 닫기. @default true |
| `initialFocusRef` | `React.RefObject` | No | 열릴 때 우선 초점을 받을 Drawer 내부 요소. |
| `returnFocusRef` | `React.RefObject` | No | 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. |
| `restoreFocus` | `boolean` | No | 닫힌 뒤 trigger 또는 returnFocusRef로 초점을 복원합니다. @default true |
| `ariaLabel` | `string` | No | title이 없을 때 사용할 접근 가능한 이름. @default "서랍 패널" |
| `closeLabel` | `string` | No | 닫기 버튼의 접근 가능한 이름. @default "닫기" |
| `bodyStyle` | `React.CSSProperties` | No | 스크롤 body의 padding·layout을 조합별로 조정합니다. |
| `style` | `React.CSSProperties` | No |  |

## States

| State | Contract |
| --- | --- |
| open | 열림 상태. @default false |

## Behavior and interaction

- overlay Drawer를 여러 개 겹치지 않습니다. Drawer 위에 확인 Modal이 불가피할 때는 Modal만 활성화되고, 닫힌 뒤 Drawer 내부 trigger로 돌아갑니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Modal과 달리 좌/우 edge에 붙고, side, 380px 기본 폭, 92vw 상한, slide transition을 유지합니다. 이 차이는 본문 맥락과 나란히 연결되는 보조 작업이라는 기능으로 정당화됩니다. |
| 명시 규칙 2 | 시각 delta inventory: headline/body typography, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 유지합니다. header/body는 space-5 space-6, footer는 space-4 space-6, action gap은 space-2로 Modal과 맞춥니다. radius와 선택/활성 marker는 추가하지 않고 side 방향만 기존 public axis로 유지합니다. |
| 명시 규칙 3 | bodyStyle은 기본 body padding과 scroll contract를 유지하되, DashboardShell temporaryNavigation처럼 edge-attached 자식이 자체 padding·divider를 소유할 때만 padding: 0 같은 layout override를 전달합니다. |
| 명시 규칙 4 | Fluent 2 Drawer: overlay Drawer는 중요한 짧은 보조 작업에 사용하고, header/body/footer anatomy와 스크롤 body, 예측 가능한 edge 배치를 유지했습니다. 여러 overlay Drawer 동시 노출은 제외했습니다. |
| --body2-size | 15px |

## Responsive

- 데스크톱 Drawer footer는 버튼 수와 관계없이 inline end 정렬합니다. 단독 확정 CTA도 full을 쓰지 않으며, 취소·보조 액션은 variant="outlined" color="assistive"로 Modal과 같은 WDS 문법을 씁니다. full-width 액션은 작은 화면의 Sheet에 한정합니다.
- 필터 query 직렬화, 변경 유실 경고 조건, route 상태와 반응형으로 inline surface로 전환하는 정책은 제품 레이어가 소유합니다.

## Content and writing

- 제품 맥락에 맞는 닫기 명령은 closeLabel로 제공하며 inline/overlay 표현을 바꾸어도 같은 이름을 유지할 수 있습니다.
- Subtitle contract.
- Use subtitle for one short, visible sentence that clarifies the scope or consequence of the Drawer. When present it is rendered directly below title and associated with the dialog through aria-describedby.

## Accessibility

- Modal, Sheet, ConfirmDialog를 sibling으로 확인했습니다. focus/keyboard 계약은 ConfirmDialog와 공유하되 표면은 기존 Drawer 그대로입니다.
- 제목이 있으면 aria-labelledby, 없으면 ariaLabel을 사용합니다.
- initialFocusRef → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다.
- 최상위 Drawer만 Tab/Shift+Tab 순환, 외부 focus containment, Escape dismiss를 소유합니다.
- 닫히면 trigger로 복원하며 returnFocusRef로 논리적 다음 지점을 지정할 수 있습니다. restoreFocus 기본값은 true입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Sheet` | 대표 시나리오에서 조합 |
| `CommandPalette` | 대표 시나리오에서 조합 |
| `Lightbox` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
const firstFilterRef = useRef(null);

<Drawer
  open={open}
  side="right"
  title="필터"
  initialFocusRef={firstFilterRef}
  onClose={close}
  footer={<Button variant="signal">적용</Button>}
>
  <input ref={firstFilterRef} aria-label="현장 검색" />
</Drawer>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--dur-base`
- `--dur-slow`
- `--ease-out`
- `--font-sans`
- `--fw-extra`
- `--headline1-size`
- `--label1-reading-line`
- `--label1-size`
- `--shadow-xl`
- `--space-1`
- `--space-2`
- `--space-4`
- `--space-5`
- `--space-6`

### Source contracts

- `components/overlay/Drawer.jsx`
- `components/overlay/Drawer.d.ts`
- `components/overlay/Drawer.prompt.md`
- `stories/OverlayDrawer.stories.jsx`

## Sources

- Drawer prompt contract: `components/overlay/Drawer.prompt.md`
- Storybook implementation evidence: `stories/OverlayDrawer.stories.jsx`
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage)
