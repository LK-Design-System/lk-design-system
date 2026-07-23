**ContentEditor** — 게시글, 공지, 운영 로그, 문서 초안 작성용 에디터 셸. 제목 필드, 본문 영역, 툴바, 저장 상태, 메타 정보, 액션 슬롯을 제공하되 리치 텍스트 엔진은 포함하지 않습니다.

```jsx
<ContentEditor
  titleValue={title}
  onTitleChange={setTitle}
  value={body}
  onValueChange={setBody}
  toolbarItems={[{ value: 'bold', label: '굵게', icon: 'bold', toggle: true }]}
  activeToolbarItems={['bold']}
  onToolbarAction={applyFormat}
  status="임시 저장됨"
  meta="최종 수정 10:42"
  actions={<Button size="sm">게시</Button>}
/>
```

- 맵/좌표 편집에는 `CanvasEditorShell`, 글 작성과 게시판 수정에는 `ContentEditor`를 사용하세요.
- 본문만 필요한 짧은 메모는 `Textarea`를 쓰고, 제목/본문/저장 상태/액션이 함께 필요한 작성 화면은 `ContentEditor`를 쓰세요.
- 실제 bold, link, markdown, mention 같은 편집 엔진은 제품 앱에서 연결하고, 디자인 시스템은 toolbar 위치와 상태 표시 계약만 제공합니다.
- 슬롯과 상태: **titleLabel/titlePlaceholder/titleValue/defaultTitleValue/onTitleChange**(제목), **bodyLabel/placeholder/value/defaultValue/onValueChange/rows/maxLength/textareaProps/titleInputProps**(본문), **meta/helper/footer/actions**(하단), **status**(툴바 우측), **required/invalid/disabled/readOnly/busy**(상태), **titleId/bodyId/aria-label**(식별).
- 타입 스케일 정합: 푸터 메타 12.5px → `--caption1-size`(12px)로 스냅했습니다(−0.5px, 아래 스냅). 제목(heading1)·본문(body2)·라벨/상태(label2)와 함께 전 사이트가 토큰 스케일 위에 있으며, 메타 lineHeight 1.45는 유지했습니다.

## 툴바 계약

- toolbar button은 icon-only이므로 **toolbarItems**의 `label`을 반드시 제공합니다.
- **APG Toolbar 패턴**: 기본 툴 행은 Tab stop이 **하나**입니다. Tab으로 툴바에 들어오면 마지막으로 쓰던 툴에 포커스가 놓이고, ←/→로 툴 사이를 이동하며 Home/End가 처음·끝으로 갑니다. 비활성 툴은 건너뜁니다. 제목 → 툴바 → 본문 → 하단 액션의 Tab 순서는 그대로입니다.
- **toolbar 슬롯을 직접 넘기면** 키보드 모델을 디자인 시스템이 소유할 수 없으므로 행이 `role="group"`으로 낮아집니다. 화살표 탐색을 약속하는 `role="toolbar"`는 기본 `toolbarItems`를 쓸 때만 선언합니다.
- **토글과 액션을 구분합니다.** 서식·모드처럼 두 상태를 오가는 툴은 `toggle: true`를 주어 켜짐·꺼짐 모두 `aria-pressed`로 노출하고(**activeToolbarItems**로 현재 상태 전달, **onToolbarAction**으로 변경), 첨부 열기 같은 일회성 액션은 `toggle`을 주지 않아 `aria-pressed`를 갖지 않습니다.
- **status live region은 툴바 자식이 아닙니다.** 저장 상태는 툴바와 형제로 놓인 `role="status"` polite 영역이며, 툴바 자식은 컨트롤만 남습니다.
- `required` 별표는 장식(`aria-hidden`)이고 필수 여부는 라벨 안 숨김 텍스트 "(필수)"로 전달됩니다 — 색·기호만으로 의미를 전달하지 않습니다.
- 서식 적용 결과 announcement는 리치 텍스트 엔진을 포함하지 않는 계약상 제품 앱이 소유합니다.
