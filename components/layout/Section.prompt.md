**Section** — 페이지를 나누는 전체 폭 밴드. 반응형 세로 리듬(`--gap-section`)과 선택적 배경 서피스, 중앙 정렬 컨테이너를 제공.

```jsx
<Section surface="subtle">
  <h2>주요 제품</h2>
</Section>
<Section surface="inverse" py={80}>
  <p>다크 밴드, 패딩 재정의</p>
</Section>
```

- **surface**: "subtle" · "band" · "raised" · "inverse"(네이비, 텍스트 자동 반전) — 생략하면 투명. **container={false}**로 중앙 정렬 래퍼 없이 자식을 그대로 렌더. **py**로 세로 패딩 재정의(기본 `--gap-section`).
