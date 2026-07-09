**FileBrowser** — 서버 파일·디렉터리 탐색기(경로 바 + 상위 이동 + 항목 리스트). 프레젠테이셔널: 호스트가 path/entries 공급.

```jsx
<FileBrowser path={path} entries={entries} onOpen={cd} onUp={up} onSelect={pick} />
```

- **path** · **entries** `{name,type:'dir'|'file',size}[]` · **selected** · **onOpen/onUp/onSelect** · **height**. Modal과 함께 "폴더 선택"에.
