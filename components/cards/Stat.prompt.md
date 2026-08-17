**Stat** — 마일스톤 / KPI를 위한 큰 ExtraBold 숫자 + 캡션.

```jsx
<Stat value="2024" label="LK ROBOTICS 설립" accent="signal" />
<Stat value="7" label="보유 핵심기술" stacked />
<Stat value="99.7" unit="%" label="검증 완료율" stacked />
```

- 단위는 `value` 문자열에 넣지 않고 `unit`으로 분리합니다. `% · ‰ · °`는 값에 붙고,
  문자 단위는 한 칸의 optical gap을 둡니다.

## 매체 재지정 훅 (`--lk-stat-*`)

수치·단위·라벨의 타입은 `--lk-stat-value-size/line/spacing`,
`--lk-stat-unit-size`, `--lk-stat-label-size` 훅을 경유하며 **폴백이 곧 기존
램프 값**(display2 / body2)이라 제품 화면은 바이트 동일하게 렌더됩니다.
Table 셀·Timeline과 같은 계약의 네 번째 사례로, 기본 미정의 이유도
같습니다(TOKEN_GOVERNANCE 예외).

유래: 슬라이드 매체의 지표 개수 적응 — 지표가 2개 이하면 수치가 한 단
올라간다 — 이 이 훅의 요청 소비자입니다
(lk-design-system-slides `ADAPTIVE_CONTRACTS_PROPOSAL.md` 변경 3). 재지정하는
것은 크기가 아니라 단(rank)이며, 매체는 자기 램프의 단으로 옮깁니다.
