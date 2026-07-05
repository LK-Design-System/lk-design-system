**SplitButton** — 기본 액션에 관련 액션을 여는 캐럿이 붙은 버튼.

```jsx
<SplitButton variant="signal" onClick={save} items={[
  { label: '임시 저장', onClick: draft },
  { label: '내보내기', onClick: exp },
]}>저장</SplitButton>
```

- **onClick** — 메인 액션. **items** — 드롭다운 `{ label, icon, onClick }`. **variant** `primary · signal · dark`.
