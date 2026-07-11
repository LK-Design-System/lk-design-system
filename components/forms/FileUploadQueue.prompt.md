**FileUploadQueue**는 파일 선택 이후의 업로드·변환·검증 상태를 파일별로 표시합니다.

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
- queue frame은 중립 surface를 유지하고 header는 `대기 · 진행 · 완료 · 실패` 개수를 요약합니다. 오류나 진행 색은 해당 count와 행 상태에만 사용하며 queue 전체를 Callout처럼 칠하지 않습니다.
- retry/cancel/remove/open은 파일 행에 속하는 32px small actions이며 전역 submit CTA로 사용하지 않습니다. 진행 중 `cancel`과 완료 후 목록 `remove`는 서로 다른 callback입니다.
- 반복 action은 파일명을 accessible name에 포함하고, queue 집계 상태 변화만 하나의 polite live region으로 알립니다. 초기 행 badge와 진행률 tick은 반복해서 announce하지 않습니다.
- parser, storage, retry 구현은 앱이 소유합니다.

## External research basis

- [Carbon File uploader usage](https://carbondesignsystem.com/components/file-uploader/usage/)는 업로드 파일을 하나의 세로 목록으로 두고 loading·success·error를 파일별로 구분하며, filename과 row action을 직접 연결합니다.
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)는 remove action에 파일명을 프로그래밍 방식으로 연결할 것을 요구합니다.
- [USWDS File input](https://designsystem.digital.gov/components/file-input/)은 선택 파일명과 형식 오류가 보조 기술에도 전달되어야 한다고 설명합니다.
