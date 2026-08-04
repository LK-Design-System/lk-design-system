# Lockup

LK ROBOTICS 로고. 제공된 공식 원본 SVG의 실제 path를 사용하는 자체 완결형 SVG입니다. `stacked`는 공식 원본의 배경 없는 조합이고, `mark`와 `inline`은 공식 윤곽을 그대로 사용하는 제품 UI 파생형입니다. `tone`은 ink/white/brand/current, 크기는 `height`로 지정합니다. 워드마크를 임의로 확대·재배치하거나 로고 색을 UI 토큰으로 바꾸지 마세요.

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
```
