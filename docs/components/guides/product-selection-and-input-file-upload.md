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
| `disabled` | `boolean` | No |  |

## Behavior and interaction

- onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다.
- 선택 이후 upload/processing/retry 상태는 FileUploadQueue가 소유합니다. parser, storage, virus scan, retry policy는 제품 계층 책임입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |

## Responsive

- picker와 drag/drop handler는 consumer wrapper handler와 합성합니다. 같은 파일을 다시 고를 수 있도록 처리 후 picker value를 초기화합니다.

## Content and writing

- accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다.
- control name은 선택 후에도 바뀌지 않습니다. 선택 파일명은 별도 status로 알리며 helper/error는 inputAriaDescribedBy / inputAriaInvalid 로 실제 input에 연결합니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다({파일명}, 허용되지 않는 파일이라 제외됨). accept 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.

## Accessibility

- native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- Carbon File uploader accessibility.
- FileUpload은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FileUpload multiple accept=".pdf,image/*" onFiles={setFiles} hint="파일을 놓거나 선택하세요" />
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
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)
- [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/)
