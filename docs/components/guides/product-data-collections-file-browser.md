# File Browser

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Collections |
| Owner | `FileBrowser` |
| Storybook | `LDS Product/Data/Collections/File Browser` |
| Source | `../component-content.json#product-data-collections-file-browser` |

제품 안에서 원격 저장소나 작업 공간의 경로를 이동하며 대상을 고를 때 적합합니다. 로컬 파일을 한 번 첨부하거나 업로드 상태를 관리할 때는 File Browser 대신 File Upload 또는 File Upload Queue를 사용하세요.

## 사용 판단

### 사용

- 제품 안에서 원격 저장소나 작업 공간의 경로를 이동하며 대상을 고를 때 적합합니다. 로컬 파일을 한 번 첨부하거나 업로드 상태를 관리할 때는 File Browser 대신 File Upload 또는 File Upload Queue를 사용하세요.
- 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다.
- 상위 폴더 버튼은 루트에 도달하면 사용자의 활성화 결과로 비활성이 됩니다. 이때 native disabled를 쓰면 그 순간 포커스가 로 떨어지므로, 버튼은 계속 포커스 가능한 상태로 두고 aria-disabled와 클릭 가드로 활성화만 차단합니다(Button.jsx의 loading focusable-disabled 선례와 동일).
- FileBrowser는 현재 경로의 file/directory 목록, 상위 이동, directory navigation과 선택을 제공하는 표준 data component입니다.

### 사용하지 않음

- 선택 가능한 row는 aria-pressed로 선택 상태를 전달하므로 이름에 선택됨을 중복해 넣지 않습니다. 선택 callback이 없어 토글이 성립하지 않는 row만, 색에만 의존하지 않도록 이름에 상태 텍스트를 유지합니다(WCAG 1.4.1).
- - 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다. - pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다. - listLabel — 항목 목록….
- File Browser가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | FileBrowser의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Navigation Disabled | navigationDisabled 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Path Label | 보이는 경로 문자열 앞에 붙는 보조기술 전용 설명. @default "현재 경로" |
| List Label | 항목 목록(ul)의 접근 가능한 이름. @default "파일과 폴더" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `path` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `entries` | `FileBrowserEntry[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `selectedId` | `React.Key` | No | 공개 타입 계약에 정의된 속성입니다. |
| `selectionMode` | `FileBrowserSelectionMode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onNavigate` | `(directory: FileBrowserEntry) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onUp` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onSelectionChange` | `(entry: FileBrowserEntry) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `maxHeight` | `React.CSSProperties['maxHeight']` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyMessage` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loading` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loadingMessage` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `navigationDisabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `pathLabel` | `string` | No | 보이는 경로 문자열 앞에 붙는 보조기술 전용 설명. @default "현재 경로" |
| `listLabel` | `string` | No | 항목 목록(ul)의 접근 가능한 이름. @default "파일과 폴더" |

## States

| State | Contract |
| --- | --- |
| selectedId | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.Key |
| emptyMessage | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| loading | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| loadingMessage | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| navigationDisabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| 변형·상태 · 불러오기 · 오류와 빈 상태 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- directory navigation과 selection은 서로 다른 callback과 control로 노출됩니다.
- selectionMode="none"이면 directory row의 primary action은 navigation이며 file row는 비활성입니다.
- folder를 선택할 수 있는 경우 row는 선택, trailing button은 directory open을 담당합니다.
- 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다.
- pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다. |
| 명시 규칙 2 | 선택 가능한 row는 aria-pressed로 선택 상태를 전달하므로 이름에 선택됨을 중복해 넣지 않습니다. 선택 callback이 없어 토글이 성립하지 않는 row만, 색에만 의존하지 않도록 이름에 상태 텍스트를 유지합니다(WCAG 1.4.1). |
| 명시 규칙 3 | - 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다. - pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다. - listLabel — 항목 목록… |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-alternative | light: #F7F7F8; dark: #141415 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다.
- pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다.
- listLabel — 항목 목록 의 접근 가능한 이름이며 기본값은 파일과 폴더입니다. 다국어 제품은 pathLabel과 함께 번역 문자열을 주입합니다.
- 선택 가능한 row는 aria-pressed로 선택 상태를 전달하므로 이름에 선택됨을 중복해 넣지 않습니다. 선택 callback이 없어 토글이 성립하지 않는 row만, 색에만 의존하지 않도록 이름에 상태 텍스트를 유지합니다(WCAG 1.4.1).

## Accessibility

- 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다.
- pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다.
- 상위 폴더 버튼은 루트에 도달하면 사용자의 활성화 결과로 비활성이 됩니다. 이때 native disabled를 쓰면 그 순간 포커스가 로 떨어지므로, 버튼은 계속 포커스 가능한 상태로 두고 aria-disabled와 클릭 가드로 활성화만 차단합니다(Button.jsx의 loading focusable-disabled 선례와 동일).
- 선택 가능한 row는 aria-pressed로 선택 상태를 전달하므로 이름에 선택됨을 중복해 넣지 않습니다. 선택 callback이 없어 토글이 성립하지 않는 row만, 색에만 의존하지 않도록 이름에 상태 텍스트를 유지합니다(WCAG 1.4.1).
- - 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다. - pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다. - listLabel — 항목 목록….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다. |
| Don't | 선택 가능한 row는 aria-pressed로 선택 상태를 전달하므로 이름에 선택됨을 중복해 넣지 않습니다. 선택 callback이 없어 토글이 성립하지 않는 row만, 색에만 의존하지 않도록 이름에 상태 텍스트를 유지합니다(WCAG 1.4.1). |
| Do | 상위 폴더 버튼은 루트에 도달하면 사용자의 활성화 결과로 비활성이 됩니다. 이때 native disabled를 쓰면 그 순간 포커스가 로 떨어지므로, 버튼은 계속 포커스 가능한 상태로 두고 aria-disabled와 클릭 가드로 활성화만 차단합니다(Button.jsx의 loading focusable-disabled 선례와 동일). |
| Don't | - 사용자에게 보이는 문자열과 기본 accessible name은 한국어입니다. 컨테이너 기본 이름은 파일 브라우저이며 aria-label로 대체할 수 있습니다. - pathLabel — 보이는 경로 문자열 앞에 놓이는 보조기술 전용 설명이며 기본값은 현재 경로입니다. 경로는 로 표시하는데 code는 naming prohibited role이라 그 위의 aria-label은 무시되거나 보이는 텍스트와 어긋나게 낭독됩니다(ARIA in HTML, WCAG 2.5.3). 따라서 이름을 덮어쓰지 않고 실제 텍스트로 맥락을 덧붙입니다. - listLabel — 항목 목록…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 FileBrowser의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/FileBrowser.jsx`
- `components/data/FileBrowser.d.ts`
- `components/data/FileBrowser.prompt.md`
- `stories/DataFileBrowser.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- FileBrowser prompt contract: `components/data/FileBrowser.prompt.md`
- Storybook implementation evidence: `stories/DataFileBrowser.stories.jsx`
