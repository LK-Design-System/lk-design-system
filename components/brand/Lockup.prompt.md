# Lockup

LK ROBOTICS 로고. 제공된 공식 원본 SVG의 실제 path를 사용하는 자체 완결형 SVG입니다. `stacked`는 공식 원본의 배경 없는 조합이고, `mark`와 `inline`은 공식 윤곽을 그대로 사용하는 제품 UI 파생형입니다. `tone`은 ink/white/brand/current, 크기는 `height`로 지정합니다.

`inline`은 원본 path를 변형하지 않고 ROBOTICS 8개 글자의 평균 가시 높이를 LK 심볼 높이에 광학적으로 맞추며, 두 요소 사이에는 LK 심볼 가시 폭의 30%를 둡니다. 이 비율은 컴포넌트와 `assets/brand/lk-logo-inline-{navy,white}.svg`가 함께 공유하는 기준이므로 임의로 확대·재배치하지 마세요. 로고 색도 UI 토큰으로 바꾸지 않습니다.

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
```
