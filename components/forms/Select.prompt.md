# Select

커스텀 단일 선택 드롭다운(스타일된 트리거 + 플로팅 패널, 시그널 포커스) — 네이티브 `<select>`가 **아닙니다**. 옵션은 `options`(string[] 또는 `{value,label}[]`) 또는 `<option>` 자식으로 지정합니다. `onChange`는 선택된 **value**를 받습니다.

```jsx
<Select label="문의 유형"
  options={['제품 문의', '채용 문의', '기술 지원']}
  defaultValue="제품 문의"
  onChange={(v) => setType(v)} />
```
