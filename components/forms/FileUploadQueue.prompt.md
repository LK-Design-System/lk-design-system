**FileUploadQueue**는 파일 선택 **이후**의 업로드 항목을 파일별로 표시하는 **LK Product Extension**입니다. WDS Core parity를 주장하지 않습니다.

이름은 처리 큐에서 출발했지만, 실제로는 성격이 다른 **두 표면**을 덮습니다. 새로 쓸 때는 "무엇을 보여주는가"가 아니라 "어디에 놓이는가"로 고르세요.

| `layout` | 무엇인가 | 어디에 놓이나 |
| --- | --- | --- |
| `list`(기본) | 문서·리포트의 업로드·변환·검증 **상태 패널** | 테두리 있는 독립 영역. 결과를 지켜보는 자리 |
| `grid` | 사진·영상 **첨부 스트립** | 폼 안 인라인. 입력의 일부라 크롬이 없음 |

**두 표면 모두 선택 동작은 소유하지 않습니다.** 파일을 고르는 일은 언제나 `FileUpload`이 소유하며, `grid`의 `trigger`는 그 컨트롤을 스트립 맨 앞자리에 **배치만** 해 주는 슬롯입니다. 슬롯이 필요한 이유는 트리거와 썸네일이 **한 줄에서 함께 wrap**되어야 하기 때문이고, 바깥 형제로 두면 그 흐름을 만들 수 없습니다.

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
- **layout** — 항목을 어떻게 **보여줄지만** 고릅니다. 상태 어휘·진행률·재시도/취소/제거 의미와 접근 이름은 두 값이 동일합니다.
  - `list`(기본) — 문서·리포트용. 파일은 개별 카드가 아니라 하나의 queue 안에서 divider 행으로 표시하고, 아이콘 · 이름 · 상태 · 크기를 읽는 순서로 둡니다.
  - `grid` — 사진·영상 첨부용 **스트립**. 정사각 썸네일을 한 줄로 깔고 넘치면 wrap합니다. 미디어는 파일명보다 그림으로 식별되므로 행 목록이 아니라 타일이고, **파일명·상태 텍스트를 화면에 쌓지 않습니다**(대신 타일마다 시각적으로 숨긴 `이름, 상태` 텍스트를 둬 보조기기에는 그대로 전달합니다).
    - **크롬 없음** — 미디어 첨부는 폼 안에 인라인으로 놓이는 **입력**이라 패널 테두리·배경·제목 바를 렌더하지 않습니다. `title`은 영역의 접근 이름으로만 남고, 집계 상태를 알리는 polite 라이브 리전은 그대로 유지됩니다. (문서 큐인 `list`는 계속 테두리 있는 상태 패널입니다.)
    - **컨트롤은 타일 위에** — 진행률은 이미지 위 스크림 오버레이, 실패는 스크림 위 다시 시도, 제거/취소는 **타일 모서리에 걸친 흰 원형 버튼**입니다. 그래서 `grid`에서는 컨테이너에 `overflow: hidden`을 걸지 않습니다.
    - **항목은 자기를 식별하는 것으로 그려집니다** — `thumbnailSrc`가 있으면 **정사각 미디어 타일**(사진 자체가 라벨이므로 이름·상태 텍스트 없음, 이미지는 장식 `alt=""`), 없으면 **가로 파일 칩**(문서는 이름으로 식별되므로 아이콘 + 파일명 + `sizeLabel`을 눈에 보이게). 그래서 사진과 문서를 한 스트립에 섞어도 각자 맞는 형태로 섭니다.
    - `primary`는 미디어 타일 하단 스크림 밴드로 대표 항목을 표시합니다(`primaryLabel`, 기본 "대표").
    - **trigger** — 스트립 맨 앞에 선택 타일(카메라+개수)을 놓는 슬롯입니다. 첨부가 아니라 컨트롤이므로 목록 항목으로 세지 않으며(`role="presentation"` 셀), **선택 동작 자체는 `FileUpload`가 소유**합니다.
    - `onOpen`은 `grid`에서 렌더하지 않습니다 — 좁은 타일에 별도 열기 어포던스를 넣으면 중첩 인터랙티브가 됩니다. 원본 보기는 `Lightbox`로 조립하세요.
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

## 비교와 결정 근거

첨부 입력을 하나의 컴포넌트로 묶는 시스템도 있습니다 — [seed-design `Attachment Input`](https://seed-design.io/components/attachment-input)은 trigger(선택 버튼)와 preview(썸네일·진행률·삭제/재시도)를 한 컴포넌트에 담고 **media / file variant**로 나눕니다. 이 저장소는 선택과 큐를 이미 나눠 각자 계약을 갖고 있으므로 그 형태를 그대로 들여오지 않았습니다.

- **`AttachmentInput`을 신설하지 않음** — 선택·드롭존은 `FileUpload`, 진행·재시도·취소·제거는 이 컴포넌트가 이미 소유합니다. 새 wrapper는 두 계약을 통째로 중복시킵니다.
- **대신 프리뷰 표현만 variant로** — seed가 나눈 media/file 구분은 결국 **프리뷰 쪽 변형**이므로, 같은 위치인 이 컴포넌트의 `layout`으로 받았습니다. 업로드 항목 상태를 두 컴포넌트가 나눠 소유하는 일이 없습니다.
- **재정렬은 범위 밖** — 첨부 순서 바꾸기가 필요하면 `ReorderList`로 조립합니다. 큐가 정렬 상호작용까지 소유하지 않습니다.
