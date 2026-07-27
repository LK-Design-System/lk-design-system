**RobotStatusCard** — 로봇 라이브 상태 카드(썸네일·연결 점·이름·모드 칩·배터리 게이지). 로봇 선택·대시보드·목록에.

```jsx
<RobotStatusCard name="LKR-T1" status="online" battery={82} mode="순찰" onClick={select} />
<RobotStatusCard name="LKR-CP" status="offline" battery={14} selected />
```

## LDS reuse boundary

- Compose the surface and anatomy from Core `Card`, `ListCell`, `Avatar`, and `ContentBadge`; retain Product `ConnectionBadge` and `BatteryGauge` for telemetry.
- `RobotStatusCard` owns robot-specific selection and telemetry composition only. It must not recreate generic card, list-row, avatar, or badge primitives.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) defines the Enter/Space and `aria-pressed` contract for selectable cards. [Spectrum Cards](https://spectrum.adobe.com/page/cards/) informs the card anatomy, while [Fluent Avatar](https://fluent2.microsoft.design/components/web/react/core/avatar/usage) supports using the shared avatar primitive for image/fallback identity.

- **battery** 20% 이하 레드·50% 이하 앰버로 자동. **status** 점으로 표시. **mode**는 운영 모드 칩. **selected**로 강조, **image** 없으면 이니셜. 라이브 값은 앱에서 바인딩.
- `onClick`을 주면 카드 전체가 선택 대상(`role="button"`, 키보드 활성화)이 되고, 없으면 순수 표시 카드다. 로봇의 하드웨어 모델·타입을 별도로 보여줄 필요가 있으면 앱에서 `name`이나 caption에 합쳐 표기하고, 이 컴포넌트는 별도 model 필드를 두지 않는다.
