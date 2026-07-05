**TextButton** — 크롬 없는 텍스트 액션. 인라인 링크, 카드 푸터, "더보기"에 씁니다.

```jsx
<TextButton arrow>전체 보기</TextButton>
<TextButton tone="neutral" underline>취소</TextButton>
<TextButton as="a" href="/products">제품 보기</TextButton>
```

- **tone** `signal · neutral · danger`. **size** `sm · md · lg`. **arrow**는 호버 시 움직임. **underline**은 링크 스타일. **as="a"**는 앵커용.
- 채워진 CTA에는 `Button`을 쓰세요; 이것은 낮은 강조의 형제입니다.
