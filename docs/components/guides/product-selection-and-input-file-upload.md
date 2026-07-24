# File Upload

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `FileUpload` |
| Storybook | `LDS Product/Selection and Input/File Upload` |
| Source | `../component-content.json#product-selection-and-input-file-upload` |

FileUpload은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.

## 사용 판단

### 사용

- FileUpload은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다({파일명}, 허용되지 않는 파일이라 제외됨). accept 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.
- File Upload가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 FileUpload API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다.
- - onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다. - accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다. - native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input….
- File Upload가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | FileUpload의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Input Aria Label | Actual file input의 접근 가능한 이름을 별도로 지정합니다. |
| Input Aria Described By | Helper/error element IDs applied to the actual file input. |
| Input Aria Invalid | inputAriaInvalid 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `onFiles` | `(files: File[]) = void` | No | 선택된 File[]을 받음. |
| `onRejectedFiles` | `(files: File[]) = void` | No | accept 또는 단일 선택 제한으로 제외된 파일. |
| `accept` | `string` | No | 네이티브 picker와 drag/drop에 함께 적용되는 파일 형식 규칙. |
| `multiple` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `capture` | `boolean \| 'user' \| 'environment'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `inputAriaLabel` | `string` | No | Actual file input의 접근 가능한 이름을 별도로 지정합니다. |
| `inputAriaDescribedBy` | `string` | No | Helper/error element IDs applied to the actual file input. |
| `inputAriaInvalid` | `React.AriaAttributes['aria-invalid']` | No | 공개 타입 계약에 정의된 속성입니다. |
| `hint` | `React.ReactNode` | No | 안내 문구. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| inputAriaInvalid | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.AriaAttributes['aria-invalid'] |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다.
- accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다.
- native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- control name은 선택 후에도 바뀌지 않습니다. 선택 파일명은 별도 status로 알리며 helper/error는 inputAriaDescribedBy / inputAriaInvalid 로 실제 input에 연결합니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다({파일명}, 허용되지 않는 파일이라 제외됨). accept 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |

## Responsive

- picker와 drag/drop handler는 consumer wrapper handler와 합성합니다. 같은 파일을 다시 고를 수 있도록 처리 후 picker value를 초기화합니다.
- - onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다. - accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다. - native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다.
- native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- control name은 선택 후에도 바뀌지 않습니다. 선택 파일명은 별도 status로 알리며 helper/error는 inputAriaDescribedBy / inputAriaInvalid 로 실제 input에 연결합니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다({파일명}, 허용되지 않는 파일이라 제외됨). accept 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.

## Accessibility

- native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- Carbon File uploader accessibility.
- FileUpload은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.
- - onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다. - accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다. - native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input….
- - USWDS File input - Carbon File uploader accessibility - GOV.UK File upload.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 같은 polite status가 거부된 파일도 함께 읽습니다({파일명}, 허용되지 않는 파일이라 제외됨). accept 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다. |
| Don't | accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다. |
| Do | File Upload가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | - onFiles(File[]) 로 허용된 선택을 받고, onRejectedFiles(File[]) 로 accept 또는 단일 선택 제한에서 제외된 파일을 받습니다. - accept / multiple / capture 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 name/required 필드를 소유하지 않습니다. - native 은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 FileUpload의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PropertyField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- FileUpload prompt contract: `components/forms/FileUpload.prompt.md`
- Storybook implementation evidence: `stories/FormFileUpload.stories.jsx`
- [USWDS File input](https://designsystem.digital.gov/components/file-input/)
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)
- [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/)
- [SEED File Upload benchmark](https://seed-design.io/components/attachment-input)
