**PageIndicator** - compact WDS page counter or dot indicator.

```jsx
<PageIndicator page={1} count={10} />
<PageIndicator variant="dot" page={2} count={5} />
```

- Use the counter form for onboarding or carousel pages with numeric context.
- Use dots for lightweight page/slide position. Use full `Pagination` for table paging.
- 접근성: 비상호작용 도트는 장식(`aria-hidden`)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 `"{page}번째 / 전체 {count}"` 형태로 현재 위치를 알립니다. 그룹 이름은 `groupLabel`(기본값 `페이지 표시기`)로 지역화하세요.
- `onChange`를 넘기면 도트가 버튼이 되어 각각 `"{n}페이지로 이동"` 레이블과 24×24px 최소 히트 영역(WCAG 2.5.8)을 가집니다. 시각적 도트 크기는 그대로이며 투명한 히트 박스만 커집니다.
- 카운터는 보이는 `{page} / {count}` 텍스트를 그대로 읽는 일반 텍스트입니다(별도 `role`·`aria-label` 없음).
