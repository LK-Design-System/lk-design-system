**FileBrowser** — 서버 파일·디렉터리 탐색기(경로 바 + 상위 이동 + 항목 리스트). 새 primitive가 아니라 `Icon`, compact row, empty/status state를 조합한 Product/Data pattern입니다. 프레젠테이셔널: 호스트가 `path`, `entries`, 선택 상태, 탐색 핸들러를 공급합니다.

```jsx
<FileBrowser path={path} entries={entries} onOpen={cd} onUp={up} onSelect={pick} />
```

- **path** · **entries** `{id?,name,type:'dir'|'file',size?,disabled?}[]` · **selected** · **selectionMode** `file|folder|any|none` · **onOpen/onUp/onSelect** · **height** · **emptyLabel**.
- `selectionMode="file"`가 기본입니다. `folder`는 폴더 선택 패널, `any`는 파일/폴더 모두 선택, `none`은 탐색 전용에 씁니다. 폴더 row는 `onOpen`이 있으면 탐색이 우선이고, `onOpen`이 없고 선택 가능한 경우 `onSelect`로 선택됩니다.
- `selected`는 항목의 `id`가 있으면 `id`, 없으면 `name`과 비교합니다. 선택 상태는 toggle/pressed가 아니라 현재 선택 항목으로 표현하고, 타이틀 accent + trailing check 패턴을 따릅니다.
- **loading/loadingLabel**, **error**, **readOnly**를 지원합니다. loading은 `aria-busy`와 status row, error는 alert row, readOnly는 헤더 lock affordance와 비활성 interaction으로 표현합니다.
- Compare against common file browser expectations before changing it: path/breadcrumb context, parent navigation, file/folder distinction, selectable mode, disabled/read-only rows, loading/error/empty states, keyboard-readable rows, and clear selected item feedback.
- Layer: LDS Product Data extension. This is a reusable file/folder selection surface, not a full file manager or WDS primitive parity claim.
- DS 관행: `TreeSelectionPanel`처럼 compact data panel 안의 row list로 보고, hover/focus는 semantic fill과 전역 `tokens/focus.css` focus ring을 따릅니다. 아이콘은 반드시 `Icon` registry(`folder`, `document`, `arrow-up`, `chevron-right`, `check`, `hourglass`, `circle-exclamation`, `lock`)를 사용합니다.
- Modal과 함께 "폴더 선택" 또는 "파일 선택" 흐름에 씁니다. 업로드, 삭제, 이름 변경, 드래그 정렬, context menu가 필요한 완성형 파일 관리자는 별도 Product/FileManager pattern으로 둡니다.
