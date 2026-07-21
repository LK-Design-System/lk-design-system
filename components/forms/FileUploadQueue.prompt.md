**FileUploadQueue**는 파일 선택 이후의 업로드·변환·검증 상태를 파일별로 표시하는 **LK Product Extension**입니다. WDS Core parity를 주장하지 않습니다.

```jsx
<FileUploadQueue
  items={uploads}
  onRetry={retryUpload}
  onCancel={cancelUpload}
  onRemove={removeUpload}
  onOpen={openDocument}
/>
```

- 파일 선택 dropzone에는 `FileUpload`을 사용합니다.
- `uploading`과 `processing`을 구분해 전송 완료를 최종 완료처럼 표시하지 않습니다.
- 파일은 개별 카드가 아니라 하나의 queue 안에서 divider 행으로 표시합니다.
- 개별 상태 badge는 파일명 바로 옆의 정보 영역에 두고, 오른쪽 trailing은 action만 소유합니다. busy 행은 6px progress track과 tabular percentage를 같은 줄에 배치합니다.
- queue frame과 header는 중립 surface를 유지하고, header에는 제목만 표시합니다. 목록이 바로 이어지므로 `대기 · 진행 · 완료 · 실패` 개수를 시각적으로 반복하지 않으며, 오류나 진행 색은 행 상태에만 사용합니다.
- retry/cancel/remove/open은 파일 행에 속하는 32px small actions이며 전역 submit CTA로 사용하지 않습니다. 진행 중 `cancel`과 완료 후 목록 `remove`는 서로 다른 callback입니다.
- 반복 action은 파일명을 accessible name에 포함하고, queue 집계 상태 변화는 시각적으로 숨긴 하나의 polite live region으로 알립니다. 초기 행 badge와 진행률 tick은 반복해서 announce하지 않습니다.
- parser, storage, retry 구현은 앱이 소유합니다.

## Internal LDS comparison

- `FileUpload`은 파일 선택과 dropzone만 소유하며, 선택 이후의 파일별 비동기 lifecycle은 `FileUploadQueue`가 소유합니다.
- `StatusBadge`, `ProgressBar`, `Button`, 공통 상태 토큰의 크기·색·상태·focus 계약을 재사용합니다. queue 전용 badge, progress, action 문법을 만들지 않습니다.
- 리딩 문서 아이콘은 파일의 정체성을 나타내므로 상태와 무관한 중립 전경·타일을 유지합니다. 완료·진행·실패 색상은 `StatusBadge`, `ProgressBar`, 오류 문구처럼 상태를 직접 설명하는 요소에만 사용합니다.
- `ValidationSummary`는 제출을 막는 field 오류의 수정 경로이고, 이 컴포넌트는 파일별 처리 activity와 결과를 표시하므로 서로 대체하지 않습니다.

## External research basis

- [Carbon File uploader usage](https://carbondesignsystem.com/components/file-uploader/usage/)는 업로드 파일을 하나의 세로 목록으로 두고 loading·success·error를 파일별로 구분하며, filename과 row action을 직접 연결합니다.
- [Carbon File uploader style](https://carbondesignsystem.com/components/file-uploader/style/)은 파일명·행 배경·기본 아이콘을 중립 토큰으로 두고 complete·invalid 색상을 별도 state container와 오류 표식에 적용합니다. 따라서 문서 아이콘보다 상태 배지와 메시지가 상태색을 소유합니다.
- [Apple HIG Icons](https://developer.apple.com/design/human-interface-guidelines/icons)는 문서 아이콘을 파일 또는 문서 유형을 나타내는 일관된 상징으로 설명합니다. 일시적인 처리 상태와 파일 정체성의 시각 역할을 분리하는 근거로 사용합니다.
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)는 remove action에 파일명을 프로그래밍 방식으로 연결할 것을 요구합니다.
- [USWDS File input](https://designsystem.digital.gov/components/file-input/)은 선택 파일명과 형식 오류가 보조 기술에도 전달되어야 한다고 설명합니다.
