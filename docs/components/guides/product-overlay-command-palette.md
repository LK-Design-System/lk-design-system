# Command Palette

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Overlay |
| Owner | `CommandPalette` |
| Storybook | `LDS Product/Overlay/Command Palette` |
| Source | `../component-content.json#product-overlay-command-palette` |

명령과 이동 대상이 많고 이름으로 찾아 실행하는 숙련 사용자 흐름에 적합합니다. 선택지가 적거나 항상 보여야 하는 핵심 액션에는 CommandPalette 대신 Button, Menu 또는 명시적인 탐색을 사용하세요.

## 사용 판단

### 사용

- React Aria Menu — 복합 명령 목록은 방향키 탐색과 활성 항목 전달을 제공해야 합니다. 검색 입력을 combobox로 유지하고 aria-activedescendant로 listbox의 활성 명령을 연결해 입력 흐름을 끊지 않습니다.

### 사용하지 않음

- 전역 ⌘K wiring은 제품이 소유합니다. 컴포넌트는 전역 단축키를 등록하지 않습니다. 제품에서 keydown을 듣고 (event.metaKey || event.ctrlKey) && event.key === 'k'일 때 event.preventDefault() 후 open을 켜세요. 팔레트가 어떤 화면에서 열려야 하는지는 제품의 라우팅 맥락이 결정합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| ariaLabel | 다이얼로그의 접근 가능한 이름. @default "명령 팔레트" |
| resultsLabel | 필터 결과 요약 문구를 만드는 formatter. 결과 없음 문구도 여기서 나옵니다. @default (count) = count 0 ? 명령 ${count}개 : "결과 없음" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No |  |
| `onClose` | `() = void` | No |  |
| `commands` | `Command[]` | Yes |  |
| `placeholder` | `string` | No |  |
| `initialFocusRef` | `React.RefObject` | No |  |
| `returnFocusRef` | `React.RefObject` | No |  |
| `restoreFocus` | `boolean` | No |  |
| `ariaLabel` | `string` | No | 다이얼로그의 접근 가능한 이름. @default "명령 팔레트" |
| `resultsLabel` | `(count: number) = string` | No | 필터 결과 요약 문구를 만드는 formatter. 결과 없음 문구도 여기서 나옵니다. @default (count) = count 0 ? 명령 ${count}개 : "결과 없음" |
| `style` | `React.CSSProperties` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Escape는 2단계입니다. 검색어가 남아 있으면 1차 Escape가 검색어만 비우고, 빈 필드에서 누른 Escape만 dialog를 닫습니다. VS Code·Spotlight·Slack의 ⌘K 관습입니다. |
| --body2-size | 15px |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Accessibility

- open / onClose — 제어형(Esc·스크림으로 닫힘). commands — { label, icon, shortcut, onSelect }. 입력하면 라벨로 필터링됩니다. 입력 초점을 유지한 채 Arrow Up/Down, Home/End로 활성 명령을 이동하고 Enter로 실행합니다. Tab은 modal 안에서 순환하고 닫힌 뒤 trigger로 돌아갑니다.
- 활성 명령은 aria-activedescendant로만 이동하므로 목록이 스크롤될 때 컴포넌트가 활성 항목을 다시 보이는 위치로 끌어옵니다. listbox의 자식은 option뿐이고, 결과 없음 문구와 결과 수 알림은 listbox 바깥에 둡니다.
- 필터 결과 수는 상시 마운트된 role="status" live region이 polite로 전달합니다. 문구는 resultsLabel(count)로 바꿉니다. 같은 formatter가 결과 없음 문구도 만듭니다.
- 초점 계약은 initialFocusRef·returnFocusRef·restoreFocus로 조정하고, 이름은 ariaLabel, 검색 필드 안내는 placeholder로 지정합니다. 표준 style은 dialog 표면에 병합됩니다.
- WAI-ARIA Modal Dialog Pattern — CommandPalette는 aria-modal 표면이므로 초기 초점, 내부 Tab 순환, Escape, focus 복원을 공용 계약으로 제공합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Drawer` | 대표 시나리오에서 조합 |
| `DrawerSection` | 대표 시나리오에서 조합 |
| `Lightbox` | 대표 시나리오에서 조합 |
| `Sheet` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<CommandPalette open={open} onClose={close} commands={[
  { label: '제품 보기', shortcut: 'P', onSelect: goProducts },
  { label: '도입 문의', shortcut: 'C', onSelect: goContact },
]} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--headline2-size`
- `--label1-size`
- `--radius-2xl`
- `--radius-md`
- `--shadow-xl`
- `--space-8`

### Source contracts

- `components/overlay/CommandPalette.jsx`
- `components/overlay/CommandPalette.d.ts`
- `components/overlay/CommandPalette.prompt.md`
- `stories/OverlayCommandPalette.stories.jsx`

## Sources

- CommandPalette prompt contract: `components/overlay/CommandPalette.prompt.md`
- Storybook implementation evidence: `stories/OverlayCommandPalette.stories.jsx`
- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [React Aria Menu](https://react-aria.adobe.com/Menu)
