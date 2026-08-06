# File Browser

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Collections |
| Owner | `FileBrowser` |
| Storybook | `LDS Product/Data/Collections/File Browser` |
| Source | `../component-content.json#product-data-collections-file-browser` |

제품 안에서 원격 저장소나 작업 공간의 경로를 이동하며 대상을 고를 때 적합합니다. 로컬 파일을 한 번 첨부하거나 업로드 상태를 관리할 때는 File Browser 대신 File Upload 또는 File Upload Queue를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| pathLabel | 보이는 경로 문자열 앞에 붙는 보조기술 전용 설명. @default "현재 경로" |
| listLabel | 항목 목록(ul)의 접근 가능한 이름. @default "파일과 폴더" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `path` | `string` | No |  |
| `entries` | `FileBrowserEntry[]` | No |  |
| `selectedId` | `React.Key` | No |  |
| `selectionMode` | `FileBrowserSelectionMode` | No |  |
| `onNavigate` | `(directory: FileBrowserEntry) = void` | No |  |
| `onUp` | `() = void` | No |  |
| `onSelectionChange` | `(entry: FileBrowserEntry) = void` | No |  |
| `maxHeight` | `React.CSSProperties['maxHeight']` | No |  |
| `emptyMessage` | `React.ReactNode` | No |  |
| `loading` | `boolean` | No |  |
| `loadingMessage` | `React.ReactNode` | No |  |
| `error` | `React.ReactNode` | No |  |
| `disabled` | `boolean` | No |  |
| `navigationDisabled` | `boolean` | No |  |
| `pathLabel` | `string` | No | 보이는 경로 문자열 앞에 붙는 보조기술 전용 설명. @default "현재 경로" |
| `listLabel` | `string` | No | 항목 목록(ul)의 접근 가능한 이름. @default "파일과 폴더" |

## Behavior and interaction

- directory navigation과 selection은 서로 다른 callback과 control로 노출됩니다.
- selectionMode="none"이면 directory row의 primary action은 navigation이며 file row는 비활성입니다.
- folder를 선택할 수 있는 경우 row는 선택, trailing button은 directory open을 담당합니다.
- FileBrowser는 현재 경로의 file/directory 목록, 상위 이동, directory navigation과 선택을 제공하는 표준 data component입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다. |
| 명시 규칙 2 | 선택 가능한 row는 aria-pressed로 선택 상태를 전달하므로 이름에 선택됨을 중복해 넣지 않습니다. 선택 callback이 없어 토글이 성립하지 않는 row만, 색에만 의존하지 않도록 이름에 상태 텍스트를 유지합니다(WCAG 1.4.1). |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-alternative | light: #F7F7F8; dark: #141415 |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Content and writing

- listLabel — 항목 목록 의 접근 가능한 이름이며 기본값은 파일과 폴더입니다. 다국어 제품은 pathLabel과 함께 번역 문자열을 주입합니다.

## Accessibility

- 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다.
- 상위 폴더 버튼은 루트에 도달하면 사용자의 활성화 결과로 비활성이 됩니다. 이때 native disabled를 쓰면 그 순간 포커스가 로 떨어지므로, 버튼은 계속 포커스 가능한 상태로 두고 aria-disabled와 클릭 가드로 활성화만 차단합니다(Button.jsx의 loading focusable-disabled 선례와 동일).

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FileBrowser
  path="/maps"
  entries={entries}
  selectionMode="folder"
  selectedId={selectedId}
  onSelectionChange={selectEntry}
  onNavigate={openDirectory}
  onUp={goUp}
/>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-alternative`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-normal-strong`
- `--font-mono`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--label2-size`
- `--radius-md`
- `--radius-sm`
- `--space-0-5`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/FileBrowser.jsx`
- `components/data/FileBrowser.d.ts`
- `components/data/FileBrowser.prompt.md`
- `stories/DataFileBrowser.stories.jsx`

## Sources

- FileBrowser prompt contract: `components/data/FileBrowser.prompt.md`
- Storybook implementation evidence: `stories/DataFileBrowser.stories.jsx`
