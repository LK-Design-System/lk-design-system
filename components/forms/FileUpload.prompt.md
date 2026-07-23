**FileUpload**은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.

```jsx
<FileUpload multiple accept=".pdf,image/*" onFiles={setFiles} hint="파일을 놓거나 선택하세요" />
```

- **onFiles(File[])** 로 허용된 선택을 받고, **onRejectedFiles(File[])** 로 `accept` 또는 단일 선택 제한에서 제외된 파일을 받습니다.
- **accept / multiple / capture** 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 `name/required` 필드를 소유하지 않습니다.
- native `<input type="file">`은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- control name은 선택 후에도 바뀌지 않습니다. 선택 파일명은 별도 status로 알리며 helper/error는 **inputAriaDescribedBy / inputAriaInvalid** 로 실제 input에 연결합니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다(`{파일명}, 허용되지 않는 파일이라 제외됨`). `accept` 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.
- picker와 drag/drop handler는 consumer wrapper handler와 합성합니다. 같은 파일을 다시 고를 수 있도록 처리 후 picker value를 초기화합니다.
- 선택 이후 upload/processing/retry 상태는 `FileUploadQueue`가 소유합니다. parser, storage, virus scan, retry policy는 제품 계층 책임입니다.

## External research basis

- [USWDS File input](https://designsystem.digital.gov/components/file-input/)
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)
- [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/)
