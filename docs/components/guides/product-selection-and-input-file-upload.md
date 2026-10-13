# File Upload

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `FileUpload` |
| Storybook | `LDS Product/Selection and Input/File Upload` |
| Source | `../component-content.json#product-selection-and-input-file-upload` |

사용자가 로컬 파일 하나 이상을 선택해 업로드 흐름을 시작할 때 적합합니다. 선택 이후의 progress·retry·부분 실패를 관리해야 하면 File Upload Queue와 조합하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| inputAriaLabel | Actual file input의 접근 가능한 이름을 별도로 지정합니다. |
| inputAriaDescribedBy | Helper/error element IDs applied to the actual file input. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `onFiles` | `(files: File[]) = void` | No | 선택된 File[]을 받음. |
| `onRejectedFiles` | `(files: File[]) = void` | No | accept 또는 단일 선택 제한으로 제외된 파일. |
| `accept` | `string` | No | 네이티브 picker와 drag/drop에 함께 적용되는 파일 형식 규칙. |
| `multiple` | `boolean` | No |  |
| `capture` | `boolean \| 'user' \| 'environment'` | No |  |
| `inputAriaLabel` | `string` | No | Actual file input의 접근 가능한 이름을 별도로 지정합니다. |
| `inputAriaDescribedBy` | `string` | No | Helper/error element IDs applied to the actual file input. |
| `inputAriaInvalid` | `React.AriaAttributes['aria-invalid']` | No |  |
| `hint` | `React.ReactNode` | No | 안내 문구. |
| `presentation` | `'dropzone' \| 'button'` | No | 선택 진입점의 표면. button은 동일한 native picker를 LDS Button label로 표시합니다. @default 'dropzone' |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No | drop target 또는 button 크기. compact component scope에서는 기본 sm, 그 밖에서는 md. |
| `disabled` | `boolean` | No |  |

## Behavior and interaction

- onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다.
- 선택 이후 upload/processing/retry 상태는 FileUploadQueue가 소유합니다. parser, storage, virus scan, retry policy는 제품 계층 책임입니다.
- 간단한 파일 선택 버튼.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size를 생략하면 일반 표면은 기존 md(최소 144px), bounded compact component scope는 sm(최소 112px, 32px 아이콘 tile)을 사용합니다. 명시한 size가 우선하며 전체 label target과 native input의 키보드 접근은 유지됩니다. |
| 명시 규칙 2 | presentation 기본 dropzone는 기존 표면과 112/144px 높이를 유지합니다. button은 같은 실제 input에 연결된 LDS Button as="label", outlined assistive variant로 표시합니다. 기존 Button size/radius/폰트/fill을 재사용하며 label에 별도 tab stop을 만들지 않습니다. |
| 명시 규칙 3 | 시각 delta는 dashed target·tile·여러 줄 파일명을 짧은 button entry로 대체하는 opt-in뿐입니다. Button/FileUpload 내부 비교 결과 다른 border/radius/shadow 값을 만들지 않았습니다. ButtonSelection 실제 story는 320px, 허용/거부, keyboard focus, 동일 input·disabled 계약을 확인합니다. |
| 명시 규칙 4 | 제품 검토 핀: Portal 740bc9d5 ChatComposerMenus의 bounded 자료 패널은 supported by new contract이며 vendor 0.4.7에는 presentation이 없습니다. Web Viz 7e535341 MapEditScreen/TaskCreateScreen의 map/task 저작에는 같은 chat picker가 없어 not applicable, Control Full Daedeok d8c215fd RobotDashboard Dashboard의 관제에는 같은 파일 선택 흐름이 없어 not applicable입니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- picker와 drag/drop handler는 consumer wrapper handler와 합성합니다. 같은 파일을 다시 고를 수 있도록 처리 후 picker value를 초기화합니다.

## Content and writing

- accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다.
- control name은 선택 후에도 바뀌지 않습니다. 선택 파일명은 별도 status로 알리며 helper/error는 inputAriaDescribedBy / inputAriaInvalid 로 실제 input에 연결합니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다({파일명}, 허용되지 않는 파일이라 제외됨). accept 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.
- button의 hint 기본값은 「파일 선택」입니다. dropzone 기본 안내는 그대로입니다. 조작 이름은 선택 뒤에도 유지하고 파일 선택·거부 결과는 같은 polite status로 알립니다. 선택 파일명 목록과 upload/processing/cancel은 제품이 별도 구성합니다.

## Accessibility

- native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- picker·accept·multiple·capture·거부 callback·disabled·aria-describedby/invalid·동일 파일 재선택과 drag/drop handler 합성은 두 presentation에서 같습니다. focus는 실제 input이 받고 기존 input focus shadow를 Button label 표면에 표시합니다.
- Carbon File uploader accessibility.
- FileUpload은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |
| `PropertyField` | 대표 시나리오에서 조합 |
| `SearchableMultiSelect` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FileUpload multiple accept=".pdf,image/*" onFiles={setFiles} hint="파일을 놓거나 선택하세요" />
```

### 추가 조합 2

```jsx
<FileUpload presentation="button" size="sm" accept=".pdf,.txt" hint="파일 선택"
  inputAriaDescribedBy="file-restrictions" onFiles={prepareFiles} onRejectedFiles={showRejected} />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--component-input-bg`
- `--component-input-border-color-focus`
- `--component-input-focus-shadow`
- `--component-input-radius`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--radius-md`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-6`

### Source contracts

- `components/forms/FileUpload.jsx`
- `components/forms/FileUpload.d.ts`
- `components/forms/FileUpload.prompt.md`
- `stories/FormFileUpload.stories.jsx`

## Sources

- FileUpload prompt contract: `components/forms/FileUpload.prompt.md`
- Storybook implementation evidence: `stories/FormFileUpload.stories.jsx`
- [USWDS File input](https://designsystem.digital.gov/components/file-input/)
- [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/)
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)
