**ReorderList** — 드래그로 순서를 바꾸는 리스트(핸들 + 시퀀스 배지). 태스크 스텝·파이프라인 단계.

```jsx
<ReorderList items={steps} onReorder={setOrder} />
```

- **items** `{id,label,detail}[]` · **onReorder(nextIds)**. 키보드: 행 포커스 후 Alt+↑/↓.
