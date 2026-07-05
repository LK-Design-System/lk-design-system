**StatusBadge** — 운영 상태를 나타내는 컬러 점 + 라벨. `pulse`는 부드러운 링을 퍼뜨려 실시간 "감지" 신호를 줍니다.

```jsx
<StatusBadge tone="positive" pulse>가동중 3대</StatusBadge>
<StatusBadge tone="warning">점검 중</StatusBadge>
<StatusBadge tone="offline">오프라인</StatusBadge>
```

- **tone** — `positive/online · cautionary/warning · negative · offline · signal`. **pulse** — 실시간 상태용 애니메이션 링.
- 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다.
