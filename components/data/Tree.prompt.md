**Tree** — 펼칠 수 있는 계층(조직도, 파일 트리).

```jsx
<Tree defaultExpanded={['fleet']} onSelect={pick} nodes={[
  { id: 'fleet', label: '로봇', children: [{ label: 'LKR-T1' }, { label: 'LKR-CP' }] },
]} />
```

- **nodes** — `{ id, label, icon, children }`. **defaultExpanded** — 열린 키. **onSelect(node)**.
