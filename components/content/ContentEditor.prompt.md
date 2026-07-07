**ContentEditor** — 게시글, 공지, 운영 로그, 문서 초안 작성용 에디터 셸. 제목 필드, 본문 영역, 툴바, 저장 상태, 메타 정보, 액션 슬롯을 제공하되 리치 텍스트 엔진은 포함하지 않습니다.

```jsx
<ContentEditor
  titleValue={title}
  onTitleChange={setTitle}
  value={body}
  onValueChange={setBody}
  status="임시 저장됨"
  meta="최종 수정 10:42"
  actions={<Button size="sm">게시</Button>}
/>
```

- 맵/좌표 편집에는 `CanvasEditorShell`, 글 작성과 게시판 수정에는 `ContentEditor`를 사용하세요.
- 본문만 필요한 짧은 메모는 `Textarea`를 쓰고, 제목/본문/저장 상태/액션이 함께 필요한 작성 화면은 `ContentEditor`를 쓰세요.
- 실제 bold, link, markdown, mention 같은 편집 엔진은 제품 앱에서 연결하고, 디자인 시스템은 toolbar 위치와 상태 표시 계약만 제공합니다.
- toolbar button은 icon-only이므로 `label`을 반드시 제공합니다.
