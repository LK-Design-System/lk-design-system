**Button** — 브랜드의 기본 콜투액션(CTA). 기본은 그래파이트이고, 가장 클릭을 유도하고 싶은 단 하나의 CTA에는 `variant="signal"`(LK 시안)을, 네이비 섹션 위에는 `variant="on-dark"`를 씁니다.

```jsx
<Button variant="primary">도입 문의</Button>
<Button variant="signal" size="lg">제품 보기</Button>
<Button variant="ghost">자세히 보기</Button>
<Button variant="on-dark">Learn more</Button>
<Button as="a" href="contact.html" variant="primary" full>문의 보내기</Button>
```

- **variant** — `primary`(그래파이트) · `signal`(시안 잉크, 브랜드 강조) · `dark`(네이비) · `flat`(쿨 그레이, 낮은 강조) · `ghost`(헤어라인 아웃라인) · `on-dark`(반투명 화이트, 히어로/다크 카드용).
- **size** — `sm` 44px · `md` 52px · `lg` 52px+. **full**은 컨테이너 폭까지 늘립니다. **as="a"**는 링크 CTA로 렌더합니다.
- **arrow** — 이전 호환성 때문에 prop은 남아 있지만 더 이상 시각 요소를 렌더하지 않습니다. 새 버튼에는 쓰지 마세요.
- 차분한 상태 변화: 호버 시 배경/테두리 톤만 바뀌고, 버튼 위치나 크기는 움직이지 않습니다.

**IconButton**(형제 컴포넌트) — 글리프 하나를 위한 정사각/원형 컨트롤; 동일한 variant(`soft`/`solid`/`signal`/`ghost`/`on-dark`). 항상 `label`을 전달하세요.
