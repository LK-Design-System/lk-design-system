**StatusBadge** — 운영 상태를 나타내는 컬러 점 + 라벨. `pulse`는 부드러운 링을 퍼뜨려 실시간 "감지" 신호를 줍니다.

```jsx
<StatusBadge tone="positive" pulse>가동중 3대</StatusBadge>
<StatusBadge tone="warning">점검 중</StatusBadge>
<StatusBadge tone="offline">오프라인</StatusBadge>
```

- **tone** — `positive/online · cautionary/warning · negative · offline · signal`. **pulse** — 실시간 상태용 애니메이션 링.
- 모션은 `prefers-reduced-motion`에서 정지합니다. `critical`은 모션 없이도 읽히는 이중 정적
  링과 보이는 라벨을 함께 사용하므로 negative와 pulse 하나만으로 구분하지 않습니다.
- 상태는 LK 아이코노그래피에 따라 (글리프가 아니라) 컬러 점을 씁니다.
