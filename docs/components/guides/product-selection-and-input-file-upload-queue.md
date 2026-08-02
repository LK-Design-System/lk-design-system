# File Upload Queue

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `FileUploadQueue` |
| Storybook | `LDS Product/Selection and Input/File Upload Queue` |
| Source | `../component-content.json#product-selection-and-input-file-upload-queue` |

여러 파일이 업로드·변환·검증을 거치고 일부 항목만 다시 시도하거나 취소해야 할 때 적합합니다. 파일 하나를 고르는 진입점만 필요하면 File Upload를 사용하세요.

## 사용 판단

### 사용

- Carbon Progress bar는 label을 track 위에 두고 determinate value를 가까운 helper text로 제공하며, text를 track 안에 넣거나 멀리 떼지 않도록 안내합니다.
- Adobe Spectrum Progress bar는 작업 label을 왼쪽, percentage를 오른쪽에 둔 하나의 header 행을 track 위에 배치하는 기본 문법을 사용합니다. LDS queue는 공용 ProgressBar label + showValue를 그대로 사용해 이 관계를 보존합니다.
- 이름은 처리 큐에서 출발했지만, 실제로는 성격이 다른 두 표면을 덮습니다. 새로 쓸 때는 "무엇을 보여주는가"가 아니라 "어디에 놓이는가"로 고르세요.

### 사용하지 않음

- uploading과 processing을 구분해 전송 완료를 최종 완료처럼 표시하지 않습니다.
- queue frame과 header는 중립 surface를 유지하고, header에는 제목만 표시합니다. 목록이 바로 이어지므로 대기 · 진행 · 완료 · 실패 개수를 시각적으로 반복하지 않으며, 오류나 진행 색은 행 상태에만 사용합니다.
- ValidationSummary는 제출을 막는 field 오류의 수정 경로이고, 이 컴포넌트는 파일별 처리 activity와 결과를 표시하므로 서로 대체하지 않습니다.
- AttachmentInput을 신설하지 않음 — 선택·드롭존은 FileUpload, 진행·재시도·취소·제거는 이 컴포넌트가 이미 소유합니다. 새 wrapper는 두 계약을 통째로 중복시킵니다.

## Anatomy

| Part | Contract |
| --- | --- |
| trigger | layout="grid"에서 스트립 맨 앞에 놓을 선택 트리거(카메라 타일 등). 첨부가 아니라 컨트롤이므로 목록 항목으로 세지 않습니다. 선택 동작 자체는 FileUpload가 소유하며, 이 슬롯은 배치만 제공합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `FileUploadQueueItem[]` | No |  |
| `title` | `React.ReactNode` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `layout` | `'list' \| 'grid'` | No | 항목 표현 방식. list는 문서·리포트용 행 목록(아이콘·이름·상태·크기), grid는 사진·영상 첨부용 썸네일 타일(이미지 위에 진행률 오버레이). 상태 어휘·진행률·재시도/취소/제거 의미와 접근 이름은 둘이 동일합니다. |
| `trigger` | `React.ReactNode` | No | layout="grid"에서 스트립 맨 앞에 놓을 선택 트리거(카메라 타일 등). 첨부가 아니라 컨트롤이므로 목록 항목으로 세지 않습니다. 선택 동작 자체는 FileUpload가 소유하며, 이 슬롯은 배치만 제공합니다. |
| `onRetry` | `(item: FileUploadQueueItem) = void` | No |  |
| `onCancel` | `(item: FileUploadQueueItem) = void` | No | 업로드·처리 중인 행의 명시적 취소 요청. |
| `onRemove` | `(item: FileUploadQueueItem) = void` | No |  |
| `onOpen` | `(item: FileUploadQueueItem) = void` | No |  |

## Behavior and interaction

- 파일 선택 dropzone에는 FileUpload을 사용합니다.
- FileUpload은 파일 선택과 dropzone만 소유하며, 선택 이후의 파일별 비동기 lifecycle은 FileUploadQueue가 소유합니다.
- 리딩 문서 아이콘은 파일의 정체성을 나타내므로 상태와 무관한 중립 전경·타일을 유지합니다. 완료·진행·실패 색상은 StatusBadge, ProgressBar, 오류 문구처럼 상태를 직접 설명하는 요소에만 사용합니다.
- Carbon File uploader style은 파일명·행 배경·기본 아이콘을 중립 토큰으로 두고 complete·invalid 색상을 별도 state container와 오류 표식에 적용합니다. 따라서 문서 아이콘보다 상태 배지와 메시지가 상태색을 소유합니다.
- Apple HIG Icons는 문서 아이콘을 파일 또는 문서 유형을 나타내는 일관된 상징으로 설명합니다. 일시적인 처리 상태와 파일 정체성의 시각 역할을 분리하는 근거로 사용합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 개별 상태 badge는 파일명 바로 옆의 정보 영역에 두고, 오른쪽 trailing은 action만 소유합니다. busy 행은 ProgressBar의 기본 label/value 문법을 재사용해 작업 설명은 왼쪽, tabular percentage는 오른쪽에 같은 header 행으로 묶고 6px track은 그 아래에서 가용 폭 전체를 사용합니다. 진행률을 모르면 percentage 없이 label과 indeterminate track만 표시합니다. |
| 명시 규칙 2 | retry/cancel/remove/open은 파일 행에 속하는 32px small actions이며 전역 submit CTA로 사용하지 않습니다. 진행 중 cancel과 완료 후 목록 remove는 서로 다른 callback입니다. |
| 명시 규칙 3 | SAP Fiori Upload Set은 파일별 action을 동일한 trailing 위치에 수직 정렬하고, 좁은 폭에서는 파일명을 truncate하면서도 action의 위치와 가용성을 유지하도록 안내합니다. LDS는 이 원칙을 따라 360px를 넘는 queue에서 cancel을 progress 아래로 조기에 내리지 않습니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- grid — 사진·영상 첨부용 스트립. 정사각 썸네일을 한 줄로 깔고 넘치면 wrap합니다. 미디어는 파일명보다 그림으로 식별되므로 행 목록이 아니라 타일이고, 파일명·상태 텍스트를 화면에 쌓지 않습니다(대신 타일마다 시각적으로 숨긴 이름, 상태 텍스트를 둬 보조기기에는 그대로 전달합니다).
- 컨트롤은 타일 위에 — 진행률은 이미지 위 스크림 오버레이, 실패는 스크림 위 다시 시도, 제거/취소는 타일 모서리에 걸친 흰 원형 버튼입니다. 그래서 grid에서는 컨테이너에 overflow: hidden을 걸지 않습니다.
- onOpen은 grid에서 렌더하지 않습니다 — 좁은 타일에 별도 열기 어포던스를 넣으면 중첩 인터랙티브가 됩니다. 원본 보기는 Lightbox로 조립하세요.
- 빈 list queue는 별도의 큰 고정 높이를 만들지 않습니다. 다만 그리드 stretch나 소비자 높이 지정으로 본문 여백이 생기면 헤더를 제외한 가용 본문 중앙에 짧은 empty message를 배치합니다. 작은 카드형 상태이므로 장식 아이콘이나 중첩 EmptyState 카드를 추가하지 않습니다.

## Content and writing

- layout — 항목을 어떻게 보여줄지만 고릅니다. 상태 어휘·진행률·재시도/취소/제거 의미와 접근 이름은 두 값이 동일합니다.
- list(기본) — 문서·리포트용. 파일은 개별 카드가 아니라 하나의 queue 안에서 divider 행으로 표시하고, 아이콘 · 이름 · 상태 · 크기를 읽는 순서로 둡니다.
- 크롬 없음 — 미디어 첨부는 폼 안에 인라인으로 놓이는 입력이라 패널 테두리·배경·제목 바를 렌더하지 않습니다. title은 영역의 접근 이름으로만 남고, 집계 상태를 알리는 polite 라이브 리전은 그대로 유지됩니다. (문서 큐인 list는 계속 테두리 있는 상태 패널입니다.).
- 항목은 자기를 식별하는 것으로 그려집니다 — thumbnailSrc가 있으면 정사각 미디어 타일(사진 자체가 라벨이므로 이름·상태 텍스트 없음, 이미지는 장식 alt=""), 없으면 가로 파일 칩(문서는 이름으로 식별되므로 아이콘 + 파일명 + sizeLabel을 눈에 보이게). 그래서 사진과 문서를 한 스트립에 섞어도 각자 맞는 형태로 섭니다.

## Accessibility

- trigger — 스트립 맨 앞에 선택 타일(카메라+개수)을 놓는 슬롯입니다. 첨부가 아니라 컨트롤이므로 목록 항목으로 세지 않으며(role="presentation" 셀), 선택 동작 자체는 FileUpload가 소유합니다.
- 반복 action은 파일명을 accessible name에 포함하고, queue 집계 상태 변화는 시각적으로 숨긴 하나의 polite live region으로 알립니다. 초기 행 badge와 진행률 tick은 반복해서 announce하지 않습니다.
- StatusBadge, ProgressBar, Button, 공통 상태 토큰의 크기·색·상태·focus 계약을 재사용합니다. queue 전용 badge, progress, action 문법을 만들지 않습니다.
- Carbon File uploader accessibility는 remove action에 파일명을 프로그래밍 방식으로 연결할 것을 요구합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FileUpload` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<FileUploadQueue
  items={uploads}
  onRetry={retryUpload}
  onCancel={cancelUpload}
  onRemove={removeUpload}
  onOpen={openDocument}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-alternative`
- `--color-semantic-line-normal-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-negative-text`
- `--font-sans`
- `--fw-bold`
- `--label1-line`
- `--label1-size`
- `--radius-lg`
- `--radius-md`
- `--scrim-dark`
- `--shadow-md`
- `--space-1`
- `--space-16`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-6`

### Source contracts

- `components/forms/FileUploadQueue.jsx`
- `components/forms/FileUploadQueue.d.ts`
- `components/forms/FileUploadQueue.prompt.md`
- `stories/FormFileUploadQueue.stories.jsx`

## Sources

- FileUploadQueue prompt contract: `components/forms/FileUploadQueue.prompt.md`
- Storybook implementation evidence: `stories/FormFileUploadQueue.stories.jsx`
- [Carbon File uploader usage](https://carbondesignsystem.com/components/file-uploader/usage/)
- [Carbon File uploader style](https://carbondesignsystem.com/components/file-uploader/style/)
- [Apple HIG Icons](https://developer.apple.com/design/human-interface-guidelines/icons)
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)
- [USWDS File input](https://designsystem.digital.gov/components/file-input/)
- [Carbon Progress bar](https://carbondesignsystem.com/components/progress-bar/usage/)
- [Adobe Spectrum Progress bar](https://spectrum.adobe.com/page/progress-bar/)
- [SAP Fiori Upload Set](https://experience.sap.com/fiori-design-web/upload-set/)
