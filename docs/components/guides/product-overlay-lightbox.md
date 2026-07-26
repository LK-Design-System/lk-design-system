# Lightbox

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Overlay |
| Owner | `Lightbox` |
| Storybook | `LDS Product/Overlay/Lightbox` |
| Source | `../component-content.json#product-overlay-lightbox` |

사진·스크린샷 같은 미디어를 원본 맥락에서 확대해 집중 검토할 때 적합합니다. 긴 문서, 편집 폼, 확인 작업에는 Lightbox 대신 전용 페이지나 Dialog를 사용하세요.

## 사용 판단

### 사용하지 않음

- Arrow 키는 dialog 자체에서 처리합니다. document 전역 리스너가 아니므로 위에 열린 overlay가 키를 먼저 가져가고, 이미 처리된(defaultPrevented) 키는 다시 소비하지 않습니다.
- zoom·pan 컨트롤은 이 계약에 포함하지 않습니다. 확대가 필요한 검토 흐름은 전용 뷰어 화면을 씁니다.

## Anatomy

| Part | Contract |
| --- | --- |
| ariaLabel | 다이얼로그의 접근 가능한 이름. @default "이미지 뷰어" |
| closeLabel | 닫기 버튼의 접근 가능한 이름. @default "닫기" |
| previousLabel | 이전 이미지 버튼의 접근 가능한 이름. @default "이전 이미지" |
| nextLabel | 다음 이미지 버튼의 접근 가능한 이름. @default "다음 이미지" |
| positionLabel | 위치 표시와 슬라이드 알림 문구를 만드는 formatter. @default (n, total) = 이미지 ${n} / ${total} |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No |  |
| `images` | `LightboxImage[]` | Yes |  |
| `index` | `number` | No | 현재 인덱스. @default 0 |
| `onClose` | `() = void` | No |  |
| `onIndexChange` | `(index: number) = void` | No |  |
| `initialFocusRef` | `React.RefObject` | No |  |
| `returnFocusRef` | `React.RefObject` | No |  |
| `restoreFocus` | `boolean` | No |  |
| `ariaLabel` | `string` | No | 다이얼로그의 접근 가능한 이름. @default "이미지 뷰어" |
| `closeLabel` | `string` | No | 닫기 버튼의 접근 가능한 이름. @default "닫기" |
| `previousLabel` | `string` | No | 이전 이미지 버튼의 접근 가능한 이름. @default "이전 이미지" |
| `nextLabel` | `string` | No | 다음 이미지 버튼의 접근 가능한 이름. @default "다음 이미지" |
| `positionLabel` | `(position: number, total: number) = string` | No | 위치 표시와 슬라이드 알림 문구를 만드는 formatter. @default (n, total) = 이미지 ${n} / ${total} |
| `style` | `React.CSSProperties` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 이미지가 2장 이상이면 화살표 컨트롤과 위치 표시가 함께 나타납니다. 위치 표시는 시각 장식이며 같은 문구를 상시 마운트된 role="status" live region이 polite로 전달합니다. 슬라이드가 바뀌면 위치와 대체 텍스트가 함께 발표됩니다. |
| --color-semantic-inverse-fill-normal | light: rgba(255, 255, 255, 0.12); dark: rgba(255, 255, 255, 0.12) |
| --color-semantic-inverse-icon-muted | light: rgba(255, 255, 255, 0.75); dark: rgba(255, 255, 255, 0.75) |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |
| --component-dialog-scrim-blur | 2px |

## Content and writing

- 문자열 URL 이미지는 alt를 선언할 수단이 없으므로 positionLabel 결과를 대체 텍스트로 사용합니다. 장식 이미지를 의도한다면 { src, alt: '' }처럼 alt를 명시적으로 넘깁니다.
- 사용자에게 보이거나 읽히는 문자열은 모두 한국어 기본값이며 prop으로 교체합니다: ariaLabel(다이얼로그 이름), closeLabel, previousLabel, nextLabel, positionLabel(position, total). 표준 style은 dialog 루트에 병합됩니다.

## Accessibility

- images — URL 또는 { src, alt }. open / index / onClose / onIndexChange — 제어형. 화살표 키 / Esc 지원. 기본 초점은 닫기 버튼이며 Tab 순환과 닫힘 후 trigger focus 복원을 공용 modal 계약으로 제공합니다. 필요하면 initialFocusRef·returnFocusRef·restoreFocus를 지정합니다.
- 화살표는 다음 이미지가 디코딩되는 동안에도 마운트를 유지하고 aria-disabled로만 잠급니다. 같은 구간 동안 dialog는 aria-busy="true"입니다. 초점을 가진 컨트롤을 unmount하면 초점이 로 떨어지기 때문에 사라지게 하지 않습니다.
- WAI-ARIA Modal Dialog Pattern — 전체 화면 뷰어도 aria-modal을 선언하면 바깥으로 Tab이 빠지지 않아야 하며 명시적 닫기 버튼과 Escape, trigger 복원이 필요합니다.
- WAI-ARIA Carousel Pattern — 슬라이드가 바뀌면 현재 위치를 전달해야 합니다. Lightbox는 위치 문구를 시각적으로 표시하고 같은 문구를 polite live region으로 발표합니다.
- React Aria Modal — modal overlay의 focus containment와 복원 책임을 컴포넌트가 소유합니다. Lightbox의 화살표 이미지 이동은 유지하고 focus/Escape는 Modal·Drawer와 같은 useDialogFocus가 담당합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `CommandPalette` | 대표 시나리오에서 조합 |
| `Drawer` | 대표 시나리오에서 조합 |
| `Sheet` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Lightbox open={open} images={photos} index={idx} onClose={close} onIndexChange={setIdx} />
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-fill-normal`
- `--color-semantic-inverse-icon-muted`
- `--color-semantic-inverse-label`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--font-sans`
- `--fw-semibold`
- `--label2-size`
- `--material-control-dimmer`
- `--radius-lg`
- `--radius-pill`
- `--shadow-xl`

### Source contracts

- `components/overlay/Lightbox.jsx`
- `components/overlay/Lightbox.d.ts`
- `components/overlay/Lightbox.prompt.md`
- `stories/OverlayLightbox.stories.jsx`

## Sources

- Lightbox prompt contract: `components/overlay/Lightbox.prompt.md`
- Storybook implementation evidence: `stories/OverlayLightbox.stories.jsx`
- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
