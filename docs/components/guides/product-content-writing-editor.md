# Writing Editor

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ContentEditor` |
| Storybook | `LDS Product/Content/Writing Editor` |
| Source | `../component-content.json#product-content-writing-editor` |

공지·게시글처럼 제목과 본문, 상태, 제출 액션을 한 작성 흐름으로 묶을 때 적합합니다. 짧은 단일 입력이나 완전한 rich text 저작에는 ContentEditor 셸 대신 Textarea 또는 제품 전용 편집기를 사용하세요.

## 사용 판단

### 사용

- 맵/좌표 편집에는 CanvasEditorShell, 글 작성과 게시판 수정에는 ContentEditor를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| iconOnly | Render the icon-only square button treatment. Requires aria-label (or aria-labelledby); a development-only console warning fires when neither is supplied. |
| loadingLabel | Screen-reader label announced with the loading spinner (loading = true). @default "불러오는 중" |
| aria-label | 에디터 영역 accessible label. @default "글 작성 에디터" |
| titleLabel | 제목 필드 라벨. @default "제목" |
| titlePlaceholder | 제목 placeholder. |
| titleValue | 제어 제목 값. |
| defaultTitleValue | 비제어 제목 기본값. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `\| "primary" \| "secondary" \| "signal" \| "danger" \| "dark" \| "flat" \| "ghost" \| "on-dark" \| "solid" \| "outlined"` | No | Visual action variant mapped through LK theme tokens. Also accepts "solid" and "outlined". @default "primary" |
| `color` | `"primary" \| "assistive"` | No | color axis for solid/outlined buttons. @default "primary" |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | Control height, padding, and text size. Aliases map small/medium/large to sm/md/lg. @default "md" |
| `arrow` | `boolean` | No |  |
| `full` | `boolean` | No | Fill the available container width. @default false |
| `disabled` | `boolean` | No | Disable activation and mark the control unavailable. @default false |
| `disable` | `boolean` | No | Disable alias. @default false |
| `iconOnly` | `boolean` | No | Render the icon-only square button treatment. Requires aria-label (or aria-labelledby); a development-only console warning fires when neither is supplied. |
| `loading` | `boolean \| 'inline'` | No | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled) so keyboard focus is not lost on activation. true swaps the label for a centered spinner on the muted palette. "inline" keeps the label visible with a leading spinner and preserves the variant palette — for controls whose words must survive the wait (e.g. a safety stop reading "정지 요청 중"). Blocking semantics are identical in both modes. |
| `loadingLabel` | `string` | No | Screen-reader label announced with the loading spinner (loading = true). @default "불러오는 중" |
| `as` | `React.ElementType` | No | Render with another element or component, such as "a" for link CTAs. @default "button" |
| `children` | `React.ReactNode` | No |  |
| `aria-label` | `string` | No | 에디터 영역 accessible label. @default "글 작성 에디터" |
| `titleLabel` | `React.ReactNode` | No | 제목 필드 라벨. @default "제목" |
| `titlePlaceholder` | `string` | No | 제목 placeholder. |
| `titleValue` | `string` | No | 제어 제목 값. |
| `defaultTitleValue` | `string` | No | 비제어 제목 기본값. |
| `onTitleChange` | `(value: string, event: React.ChangeEvent) = void` | No | 제목 변경 콜백. |
| `bodyLabel` | `React.ReactNode` | No | 본문 필드 라벨. @default "본문" |
| `placeholder` | `string` | No | 본문 placeholder. |
| `value` | `string` | No | 제어 본문 값. |
| `defaultValue` | `string` | No | 비제어 본문 기본값. |
| `onValueChange` | `(value: string, event: React.ChangeEvent) = void` | No | 본문 변경 콜백. |
| `toolbar` | `React.ReactNode` | No | 툴바 전체를 대체하는 슬롯. |

## States

| State | Contract |
| --- | --- |
| variant | Visual action variant mapped through LK theme tokens. Also accepts "solid" and "outlined". @default "primary" |
| disabled | Disable activation and mark the control unavailable. @default false |
| loading | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled) so keyboard focus is not lost on activation. true swaps the label for a centered spinner on the muted palette. "inline" keeps the label visible with a leading spinner and preserves the variant palette — for controls whose words must survive the wait (e.g. a safety stop reading "정지 요청 중"). Blocking semantics are identical in both modes. |
| loadingLabel | Screen-reader label announced with the loading spinner (loading = true). @default "불러오는 중" |
| activeToolbarItems | 활성 툴 식별자. |
| status | 툴바 우측 저장/검수 상태. |
| invalid | 검증 오류 상태. @default false |
| disabled | 전체 비활성. @default false |
| readOnly | 읽기 전용. @default false |
| busy | 저장 중 같은 busy 상태. @default false |
| tone | 의미 기반 배경과 텍스트 톤. 알 수 없는 값은 neutral/offline으로 안전하게 처리합니다. @default "positive" |

## Behavior and interaction

- 실제 bold, link, markdown, mention 같은 편집 엔진은 제품 앱에서 연결하고, 디자인 시스템은 toolbar 위치와 상태 표시 계약만 제공합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 푸터 메타 12.5px → --caption1-size(12px)로 스냅했습니다(−0.5px, 아래 스냅). 제목(heading1)·본문(body2)·라벨/상태(label2)와 함께 전 사이트가 토큰 스케일 위에 있으며, 메타 lineHeight 1.45는 유지했습니다. |
| --body2-size | 15px |
| --border-thin | 1px |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Content and writing

- 본문만 필요한 짧은 메모는 Textarea를 쓰고, 제목/본문/저장 상태/액션이 함께 필요한 작성 화면은 ContentEditor를 쓰세요.
- toolbar button은 icon-only이므로 toolbarItems의 label을 반드시 제공합니다.
- 서식 적용 결과 announcement는 리치 텍스트 엔진을 포함하지 않는 계약상 제품 앱이 소유합니다.
- ContentEditor — 게시글, 공지, 운영 로그, 문서 초안 작성용 에디터 셸. 제목 필드, 본문 영역, 툴바, 저장 상태, 메타 정보, 액션 슬롯을 제공하되 리치 텍스트 엔진은 포함하지 않습니다.

## Accessibility

- 슬롯과 상태: titleLabel/titlePlaceholder/titleValue/defaultTitleValue/onTitleChange(제목), bodyLabel/placeholder/value/defaultValue/onValueChange/rows/maxLength/textareaProps/titleInputProps(본문), meta/helper/footer/actions(하단), status(툴바 우측, 상시 마운트된 polite status region이라 텍스트 교체가 그대로 낭독됨),…
- APG Toolbar 패턴: 기본 툴 행은 Tab stop이 하나입니다. Tab으로 툴바에 들어오면 마지막으로 쓰던 툴에 포커스가 놓이고, ←/→로 툴 사이를 이동하며 Home/End가 처음·끝으로 갑니다. 비활성 툴은 건너뜁니다. 제목 → 툴바 → 본문 → 하단 액션의 Tab 순서는 그대로입니다.
- toolbar 슬롯을 직접 넘기면 키보드 모델을 디자인 시스템이 소유할 수 없으므로 행이 role="group"으로 낮아집니다. 화살표 탐색을 약속하는 role="toolbar"는 기본 toolbarItems를 쓸 때만 선언합니다.
- 토글과 액션을 구분합니다. 서식·모드처럼 두 상태를 오가는 툴은 toggle: true를 주어 켜짐·꺼짐 모두 aria-pressed로 노출하고(activeToolbarItems로 현재 상태 전달, onToolbarAction으로 변경), 첨부 열기 같은 일회성 액션은 toggle을 주지 않아 aria-pressed를 갖지 않습니다.
- status live region은 툴바 자식이 아닙니다. 저장 상태는 툴바와 형제로 놓인 role="status" polite 영역이며, 툴바 자식은 컨트롤만 남습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 같은 페이지가 소유 |
| `Icon` | 같은 페이지가 소유 |
| `StatusBadge` | 같은 페이지가 소유 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `ReorderList` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ContentEditor
  titleValue={title}
  onTitleChange={setTitle}
  value={body}
  onValueChange={setBody}
  toolbarItems={[{ value: 'bold', label: '굵게', icon: 'bold', toggle: true }]}
  activeToolbarItems={['bold']}
  onToolbarAction={applyFormat}
  status="임시 저장됨"
  meta="최종 수정 10:42"
  actions={<Button size="sm">게시</Button>}
/>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--border-thin`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-status-negative`
- `--color-semantic-status-negative-text`
- `--component-button-danger-bg`
- `--component-button-danger-bg-hover`
- `--component-button-danger-fg`
- `--component-button-dark-bg`
- `--component-button-dark-bg-hover`
- `--component-button-dark-fg`
- `--component-button-flat-bg`
- `--component-button-flat-bg-hover`
- `--component-button-flat-fg`
- `--component-button-font-size-lg`
- `--component-button-font-size-md`
- `--component-button-font-size-sm`
- `--component-button-font-weight`
- `--component-button-font-weight-assistive`
- `--component-button-gap-lg`
- `--component-button-gap-md`
- `--component-button-gap-sm`
- `--component-button-ghost-bg`
- `--component-button-ghost-bg-hover`
- `--component-button-ghost-border`
- `--component-button-ghost-border-hover`
- `--component-button-ghost-fg`
- `--component-button-height-lg`
- `--component-button-height-md`
- `--component-button-height-sm`
- `--component-button-icon-only-icon-size-lg`
- `--component-button-icon-only-icon-size-md`
- `--component-button-icon-only-icon-size-sm`
- `--component-button-icon-size-lg`
- `--component-button-icon-size-md`
- `--component-button-icon-size-sm`
- `--component-button-letter-spacing-lg`
- `--component-button-letter-spacing-md`
- `--component-button-letter-spacing-sm`
- `--component-button-line-height-lg`
- `--component-button-line-height-md`
- `--component-button-line-height-sm`
- `--component-button-on-dark-bg`
- `--component-button-on-dark-bg-hover`
- `--component-button-on-dark-border`
- `--component-button-on-dark-fg`
- `--component-button-padding-lg`
- `--component-button-padding-md`
- `--component-button-padding-sm`
- `--component-button-primary-bg`
- `--component-button-primary-bg-hover`
- `--component-button-primary-fg`
- `--component-button-radius-lg`
- `--component-button-radius-md`
- `--component-button-radius-sm`
- `--component-button-secondary-bg`
- `--component-button-secondary-bg-hover`
- `--component-button-secondary-fg`
- `--component-button-shadow-rest`
- `--component-button-signal-bg`
- `--component-button-signal-bg-hover`
- `--component-button-signal-fg`
- `--component-button-transition`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--fw-semibold`
- `--heading1-size`
- `--label2-size`
- `--radius-md`
- `--radius-pill`
- `--radius-sm`
- `--space-1-5`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/buttons/Button.jsx`
- `components/buttons/Button.d.ts`
- `components/buttons/Button.prompt.md`
- `components/content/ContentEditor.jsx`
- `components/content/ContentEditor.d.ts`
- `components/content/ContentEditor.prompt.md`
- `components/icon/Icon.jsx`
- `components/icon/Icon.d.ts`
- `components/icon/Icon.prompt.md`
- `components/content/StatusBadge.jsx`
- `components/content/StatusBadge.d.ts`
- `components/content/StatusBadge.prompt.md`
- `stories/ContentEditor.stories.jsx`

## Sources

- ContentEditor prompt contract: `components/content/ContentEditor.prompt.md`
- Storybook implementation evidence: `stories/ContentEditor.stories.jsx`
