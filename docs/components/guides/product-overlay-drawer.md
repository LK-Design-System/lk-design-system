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

### 사용

- 기본 withinPortal=true이며 LdsProvider.portalTarget 또는 명시적 portalTarget에 렌더링됩니다. 가까운 theme scope와 dir을 상속하고 clipping ancestor를 벗어납니다.
- Fluent 2 Drawer: overlay Drawer는 중요한 짧은 보조 작업에 사용하고, header/body/footer anatomy와 스크롤 body, 예측 가능한 edge 배치를 유지했습니다. LDS의 두 density도 anatomy와 sticky region 순서는 공유하고 spacing/type만 바꾸며, 여러 overlay Drawer 동시 노출은 제외했습니다.

### 사용하지 않음

- 테스트·특수 embedding에서만 withinPortal=false를 사용하며 이 경우 background inert는 적용하지 않습니다.
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
| title | Drawer 본문 안의 보이는 하위 제목. |
| description | 제목 아래의 짧은 설명. |
| actions | 제목 행 우측의 보조 액션. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 열림 상태. @default false |
| `side` | `'left' \| 'right'` | No | 슬라이드인 방향. @default "right" |
| `width` | `number` | No | 패널 너비(px). @default 380 |
| `density` | `'comfortable' \| 'compact'` | No | Drawer의 chrome/body 밀도. body의 density-aware 자식은 이를 상속하며 명시적 size/padding/density가 우선합니다. @default "comfortable" |
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
| `withinPortal` | `boolean` | No | Render at the owner-document Portal boundary. @default true |
| `portalTarget` | `HTMLElement \| null` | No |  |
| `zIndex` | `number` | No |  |
| `bodyStyle` | `React.CSSProperties` | No | 스크롤 body의 padding·layout을 조합별로 조정합니다. |
| `style` | `React.CSSProperties` | No |  |
| `title` | `React.ReactNode` | Yes | Drawer 본문 안의 보이는 하위 제목. |
| `description` | `React.ReactNode` | No | 제목 아래의 짧은 설명. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No | 문서 구조에 맞는 제목 레벨. @default 3 |
| `actions` | `React.ReactNode` | No | 제목 행 우측의 보조 액션. |

## States

| State | Contract |
| --- | --- |
| open | 열림 상태. @default false |

## Behavior and interaction

- density="comfortable"이 기본값이며 기존 Drawer 출력과 동일합니다. 검토처럼 읽기 여유가 필요한 보조 표면에 사용합니다.
- 자식의 명시적 size, padding, density가 항상 상속값보다 우선합니다. Drawer 밖과 comfortable Drawer의 기존 기본 출력은 유지됩니다.
- 닫히면 trigger로 복원하며 returnFocusRef로 논리적 다음 지점을 지정할 수 있습니다. restoreFocus 기본값은 true입니다.
- overlay Drawer를 여러 개 겹치지 않습니다. Drawer 위에 확인 Modal이 불가피할 때는 Modal만 활성화되고, 닫힌 뒤 Drawer 내부 trigger로 돌아갑니다.
- 필터 query 직렬화, 변경 유실 경고 조건, route 상태와 반응형으로 inline surface로 전환하는 정책은 제품 레이어가 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Modal과 달리 좌/우 edge에 붙고, side, 380px 기본 폭, 92vw 상한, slide transition을 유지합니다. 이 차이는 본문 맥락과 나란히 연결되는 보조 작업이라는 기능으로 정당화됩니다. |
| 명시 규칙 2 | 시각 delta inventory: headline typography, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 유지합니다. comfortable은 기존과 동일하게 header/body space-5 space-6, footer space-4 space-6, body body2/1.7을 사용합니다. |
| 명시 규칙 3 | bodyStyle은 기본 body padding과 scroll contract를 유지하되, DashboardShell temporaryNavigation처럼 edge-attached 자식이 자체 padding·divider를 소유할 때만 padding: 0 같은 layout override를 전달합니다. |
| 명시 규칙 4 | header 닫기와 footer는 scope 밖에 있습니다. footer CTA와 보조 액션은 기존 md 40px를 유지하며 body 안의 행 단위 액션도 의미상 필요할 때만 명시적으로 size="sm"을 선택합니다. |
| --body2-line | 22px |

## Responsive

- density="compact"은 데스크톱의 짧고 반복적인 필터·설정 폼에서 Drawer가 소유하는 header/body/footer chrome과 body typography만 조밀하게 만듭니다. 제목 단계, 닫기 target, footer action 크기는 바꾸지 않습니다.
- body의 bounded component-density scope는 Input, Select, Textarea, Checkbox/CheckboxGroup, Radio/RadioGroup, ChoiceCard, Callout, FileUpload처럼 밀도 상속 계약을 가진 자식에 compact를 전달합니다. 중첩 깊이나 DrawerField 같은 직접 자식 복제에 의존하지 않습니다.
- DrawerSection은 본문 하위 제목, 설명, 선택적 divider와 간격을 소유합니다. 제품은 type-headline1, pt-6, 직접 구분선으로 같은 해부학을 다시 만들지 않습니다. compact에서는 divider 상단 16px, 제목·설명 다음 8px을 사용하고 comfortable에서는 기존 읽기 여유를 유지합니다.
- 데스크톱 Drawer footer는 버튼 수와 관계없이 inline end 정렬합니다. 단독 확정 CTA도 full을 쓰지 않으며, 취소·보조 액션은 variant="outlined" color="assistive"로 Modal과 같은 WDS 문법을 씁니다. full-width 액션은 작은 화면의 Sheet에 한정합니다.

## Content and writing

- 제품 맥락에 맞는 닫기 명령은 closeLabel로 제공하며 inline/overlay 표현을 바꾸어도 같은 이름을 유지할 수 있습니다.
- 조밀화는 정보 위계나 상호작용 의미를 바꾸지 않습니다. Checkbox와 Radio의 실제 target은 시각 glyph보다 넓은 최소 24×24px이며, ChoiceCard와 FileUpload의 전체 label target도 유지됩니다.
- WAI-ARIA APG Modal Dialog Pattern: modal Drawer에도 내부 focus trap, Escape, 복원, 이름 있는 dialog 계약을 적용했습니다. 밀도는 이 interaction/semantic 계약을 변경하지 않습니다.
- Subtitle contract.

## Accessibility

- Modal, Sheet, ConfirmDialog를 sibling으로 확인했습니다. focus/keyboard 계약은 ConfirmDialog와 공유하되 표면은 기존 Drawer 그대로입니다.
- 제목이 있으면 aria-labelledby, 없으면 ariaLabel을 사용합니다.
- DrawerSection.headingLevel은 실제 문서 계층에 맞춰 26을 선택하고 기본값은 3입니다. 짧은 보조 명령은 actions에 두며, headerStyle과 contentStyle은 고유한 레이아웃 조합에만 사용합니다. 이 style escape hatch로 제목 크기·밀도·divider 간격을 다시 정의하지 않습니다.
- zIndex는 예외적 명시 override입니다. 평상시에는 공통 overlay stack이 중첩 순서, topmost Escape, background inert, body scroll lock과 focus 복원을 소유합니다.
- initialFocusRef → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Callout` | 대표 시나리오에서 조합 |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `ChoiceCard` | 대표 시나리오에서 조합 |
| `DrawerSection` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `Input` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
const firstFilterRef = useRef(null);

<Drawer
  open={open}
  side="right"
  density="compact"
  title="필터"
  initialFocusRef={firstFilterRef}
  onClose={close}
  footer={<Button variant="signal">적용</Button>}
>
  <Input ref={firstFilterRef} aria-label="현장 검색" />
  <DrawerSection
    divider
    title="활동 기록 (선택)"
    description="선택하지 않으면 입력 내용과 맞는 기록을 자동으로 찾습니다."
  >
    <CheckboxGroup options={activityOptions} />
  </DrawerSection>
</Drawer>
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-solid-alternative`
- `--color-semantic-line-solid-normal`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--dur-base`
- `--dur-slow`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--headline1-size`
- `--label1-line`
- `--label1-reading-line`
- `--label1-size`
- `--label1-spacing`
- `--shadow-xl`
- `--space-1`
- `--space-2`
- `--space-3`
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
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage)
