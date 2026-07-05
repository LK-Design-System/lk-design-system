**SpecRow** — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 `data-theme="dark"` 래퍼 안에 쌓으세요.

```jsx
<SpecRow label="크기" value="520 × 420 × 490 mm" />
<SpecRow label="배터리" value="20Ah · 25.6V" />

// 네이비 제품 무대 위:
<div data-theme="dark">
  <SpecRow label="작동 시간" value="습식 3.5h · 건식 8h" />
</div>
```
