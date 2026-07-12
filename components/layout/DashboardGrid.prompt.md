**DashboardGrid** — 지표·요약·상태 카드를 읽기 가능한 최소 폭에 맞춰 자동 배치하는 LK Product 패턴입니다.

Classification: **LK Product Extension**. WDS의 새로운 Grid 축이 아닙니다. 기존 `Grid`/`Columns`가 임의의 컬럼과 span을 제공하는 기반이라면, `DashboardGrid`는 대시보드 카드 반복에 필요한 기본값만 고정합니다.

```jsx
<DashboardGrid minCardWidth={220}>
  <MetricCard label="가동 로봇" value={24} />
  <MetricCard label="대기 작업" value={7} />
</DashboardGrid>
```

- **minCardWidth** — 기본 220px. 트랙은 `auto-fit`과 `min(100%, minCardWidth)`를 사용해 320px 이하의 좁은 컨테이너에서도 가로 overflow를 만들지 않습니다.
- **gap** — 기본 `--grid-gutter`. 카드는 표면·radius·내부 padding을 직접 소유하며 이 패턴은 테두리, 배경, 그림자를 추가하지 않습니다.
- 열 수나 카드 span을 고정해야 하는 분석 레이아웃은 `Columns`/`Col`, 일반 반복 목록은 `Grid`를 사용합니다.

### 내부 시각 차이 점검

- `Grid`와 동일하게 `display: grid`, 무표면, 무테두리, 무radius이며 간격은 `--grid-gutter`를 그대로 씁니다.
- 유지한 차이는 `auto-fill` 대신 빈 트랙을 남기지 않는 `auto-fit`, 기본 최소 카드 폭 220px, 자식 `min-width: 0`뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다.
- 카드의 typography, fill, divider, active/focus/disabled 표현은 카드 컴포넌트의 계약이며 DashboardGrid가 재정의하지 않습니다.

### 외부 기준과 적용 결론

- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/) — 관련 KPI를 일관된 카드 단위로 묶고 화면 크기에 맞춰 재배치합니다. LDS는 카드 내용이 아니라 반복 배치 계약만 소유합니다.
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — 셸과 본문을 분리하고 좁은 폭에서 탐색 구조를 전환합니다. DashboardGrid는 셸이 제공한 본문 폭 안에서만 반응합니다.
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 640px 이하에서 내비게이션 표면을 전환하는 원칙을 참고했지만, 카드 열 전환은 고정 breakpoint가 아니라 실제 사용 가능한 폭과 최소 카드 폭으로 결정합니다.

데이터 fetching, 카드 순서 저장, drag-and-drop 개인화, 권한 판정은 제품의 책임이며 이 패턴에는 포함하지 않습니다.
