**FileBrowser**는 현재 경로의 file/directory 목록, 상위 이동, directory navigation과 선택을 제공하는 표준 data component입니다.

```jsx
<FileBrowser
  path="/maps"
  entries={entries}
  selectionMode="folder"
  selectedId={selectedId}
  onSelectionChange={selectEntry}
  onNavigate={openDirectory}
  onUp={goUp}
/>
```

- directory navigation과 selection은 서로 다른 callback과 control로 노출됩니다.
- 목록 조회, path 계산, permission, pagination은 제품이 소유합니다.
- `selectionMode="none"`이면 directory row의 primary action은 navigation이며 file row는 비활성입니다.
- folder를 선택할 수 있는 경우 row는 선택, trailing button은 directory open을 담당합니다.
