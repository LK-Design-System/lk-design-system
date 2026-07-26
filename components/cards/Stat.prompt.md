**Stat** — 마일스톤 / KPI를 위한 큰 ExtraBold 숫자 + 캡션.

```jsx
<Stat value="2024" label="LK ROBOTICS 설립" accent="signal" />
<Stat value="7" label="보유 핵심기술" stacked />
<Stat value="99.7" unit="%" label="검증 완료율" stacked />
```

- 단위는 `value` 문자열에 넣지 않고 `unit`으로 분리합니다. `% · ‰ · °`는 값에 붙고,
  문자 단위는 한 칸의 optical gap을 둡니다.
