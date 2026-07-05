**FileUpload** — 드롭존; 대시 타일에 클릭하거나 파일을 드래그합니다.

```jsx
<FileUpload multiple accept=".pdf,image/*" onFiles={setFiles} hint="도면·사양서를 올려주세요" />
```

- **onFiles(File[])** — 선택. **accept / multiple** — 네이티브 제약. **hint** — 안내 문구. 드래그 중에는 시안으로 강조됩니다.
