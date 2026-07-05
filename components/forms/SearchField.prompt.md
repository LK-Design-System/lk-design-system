**SearchField** — 앞에 돋보기, 지우기 어포던스가 있는 검색 입력.

```jsx
<SearchField placeholder="제품·산업 검색" onSearch={run} />
<SearchField value={q} onChange={setQ} size="sm" />
```

- **value / defaultValue / onChange** — 제어/비제어. **onSearch** — Enter. **size** `sm · md`. 시그널 잉크 포커스 링.
