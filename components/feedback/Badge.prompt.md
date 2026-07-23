**Badge** — 작은 상태/카운트 토큰. `dot`은 톤 색상의 상태 점을 라벨 앞에 붙입니다.

```jsx
<Badge tone="signal">3</Badge>
<Badge tone="red" dot>장애</Badge>
<Badge tone="red" dot aria-label="장애" />
<Badge tone="signal" max={99}>128</Badge>
```

- **tone** — `signal` · `navy` · `steel` · `amber` · `red`.
- **dot** — 점만으로 의미를 전달하지 않습니다([WCAG 1.4.1 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)).
  - `children`이 있으면 점 + 텍스트가 함께 보입니다(`<Badge tone="red" dot>장애</Badge>` → 점과 "장애"가 같이 읽힘).
  - `children`이 없는 단독 점은 기본적으로 장식이며 `aria-hidden="true"`가 됩니다. 옆에 이미 같은 의미의 텍스트가 있을 때만 쓰세요.
  - 단독 점 자체가 유일한 의미 전달 수단이면 `aria-label`(또는 `aria-labelledby`)을 반드시 전달하세요. 이 경우 `role="img"`로 이름이 노출됩니다.
- **max** — 숫자(또는 숫자 문자열) children의 오버플로 클램프. 기본 `99`이며 초과 시 `"99+"`로 표시합니다. `max={null}`이면 클램프하지 않고, 텍스트 라벨("점검" 등)은 영향을 받지 않습니다. `PushBadge`의 `max`와 같은 규칙입니다.
