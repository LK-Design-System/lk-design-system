**TreeSelect** — 검색·체크 가능한 트리(다중 선택). Tree/TopicTree의 pick-many 보완재.

```jsx
<TreeSelect nodes={topics} defaultChecked={['/odom']} onChange={setIds} />
```

- **nodes** `{id,label,children}[]` · **checked / defaultChecked** · **onChange(ids)** · **placeholder**. 검색 시 매칭 가지 자동 펼침.
