**FileUpload**은 native file input을 유지하면서 클릭·키보드·drag/drop을 제공하는 파일 선택 target입니다.

```jsx
<FileUpload multiple accept=".pdf,image/*" onFiles={setFiles} hint="파일을 놓거나 선택하세요" />
```

- **onFiles(File[])** 로 허용된 선택을 받고, **onRejectedFiles(File[])** 로 `accept` 또는 단일 선택 제한에서 제외된 파일을 받습니다.
- **accept / multiple / capture** 는 picker와 drag/drop에 적용됩니다. 이 컴포넌트는 즉시 업로드 흐름을 위한 event-based picker이며 native form submission용 `name/required` 필드를 소유하지 않습니다.
- `size`를 생략하면 일반 표면은 기존 `md`(최소 144px), bounded compact component scope는 `sm`(최소 112px, 32px 아이콘 tile)을 사용합니다. 명시한 `size`가 우선하며 전체 label target과 native input의 키보드 접근은 유지됩니다.
- native `<input type="file">`은 접근성 트리와 Tab 순서에 남습니다. 연결된 label이 picker를 열고 focus는 LDS input ring으로 표시합니다.
- control name은 선택 후에도 바뀌지 않습니다. 선택 파일명은 별도 status로 알리며 helper/error는 **inputAriaDescribedBy / inputAriaInvalid** 로 실제 input에 연결합니다.
- 같은 polite status가 거부된 파일도 함께 읽습니다(`{파일명}, 허용되지 않는 파일이라 제외됨`). `accept` 불일치와 단일 선택 초과는 callback으로만 흘리지 않고 보조 기술에도 전달합니다(USWDS File input 요구). 사용자에게 보이는 오류 문구와 복구 안내는 제품이 소유합니다.
- picker와 drag/drop handler는 consumer wrapper handler와 합성합니다. 같은 파일을 다시 고를 수 있도록 처리 후 picker value를 초기화합니다.
- 선택 이후 upload/processing/retry 상태는 `FileUploadQueue`가 소유합니다. parser, storage, virus scan, retry policy는 제품 계층 책임입니다.

## 간단한 파일 선택 버튼

```jsx
<FileUpload presentation="button" size="sm" accept=".pdf,.txt" hint="파일 선택"
  inputAriaDescribedBy="file-restrictions" onFiles={prepareFiles} onRejectedFiles={showRejected} />
```

- `presentation` 기본 dropzone는 기존 표면과 112/144px 높이를 유지합니다. button은 같은 실제 input에 연결된 LDS `Button as="label"`, outlined assistive variant로 표시합니다. 기존 Button size/radius/폰트/fill을 재사용하며 label에 별도 tab stop을 만들지 않습니다.
- button의 hint 기본값은 「파일 선택」입니다. dropzone 기본 안내는 그대로입니다. 조작 이름은 선택 뒤에도 유지하고 파일 선택·거부 결과는 같은 polite status로 알립니다. 선택 파일명 목록과 upload/processing/cancel은 제품이 별도 구성합니다.
- picker·accept·multiple·capture·거부 callback·disabled·aria-describedby/invalid·동일 파일 재선택과 drag/drop handler 합성은 두 presentation에서 같습니다. focus는 실제 input이 받고 기존 input focus shadow를 Button label 표면에 표시합니다.
- button presentation의 wrapper는 보이는 Button label에 대응하는 선택 영역을 `data-lds-target`으로 선언합니다. 접근성 target-size 검사는 실제 32px 이상인 선택 표면을 측정하며, Tab 순서에 남는 숨김 1px native input을 별도 작은 pointer target으로 취급하지 않습니다. input의 위치·수명·focus·picker 동작은 그대로입니다.
- 시각 delta는 dashed target·tile·여러 줄 파일명을 짧은 button entry로 대체하는 opt-in뿐입니다. Button/FileUpload 내부 비교 결과 다른 border/radius/shadow 값을 만들지 않았습니다. `ButtonSelection` 실제 story는 320px, 허용/거부, keyboard focus, 동일 input·disabled 계약을 확인합니다.
- 구현 전 [USWDS File input](https://designsystem.digital.gov/components/file-input/)의 native input·연결된 label·형식 제한·거부 status 원칙과 [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/)의 파일 선택 이름·힌트와 오류 연결을 확인했습니다. 압축 표면 때문에 native picker를 자체 input으로 대체하지 않습니다.

제품 검토 핀: Portal `740bc9d5` ChatComposerMenus의 bounded 자료 패널은 supported by new contract이며 vendor 0.4.7에는
presentation이 없습니다. Web Viz `7e535341` MapEditScreen/TaskCreateScreen의 map/task 저작에는 같은 chat picker가 없어 not applicable,
Control Full Daedeok `d8c215fd` RobotDashboard Dashboard의 관제에는 같은 파일 선택 흐름이 없어 not applicable입니다.

### 기본 파일 선택 근거

- [USWDS File input](https://designsystem.digital.gov/components/file-input/)
- [Carbon File uploader accessibility](https://carbondesignsystem.com/components/file-uploader/accessibility/)
- [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/)
