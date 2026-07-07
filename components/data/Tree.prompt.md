**Tree** — 펼칠 수 있는 계층(조직도, 파일 트리).

```jsx
<Tree defaultExpanded={['workspace']} onSelect={pick} nodes={[
  { id: 'workspace', label: '문서', children: [{ label: '개요' }, { label: '컴포넌트' }] },
]} />
```

- **nodes** — `{ id, label, icon, children }`. **defaultExpanded** — 열린 키. **openOnHover** — hover/focus 시 임시 확장. **onSelect(node)**.
