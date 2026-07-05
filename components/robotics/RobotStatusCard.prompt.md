**RobotStatusCard** — 로봇 라이브 상태 카드(썸네일·연결 점·이름·모델·모드 칩·배터리 게이지). 로봇 선택·대시보드·목록에.

```jsx
<RobotStatusCard name="LKR-T1" model="Patrol Robot" status="online" battery={82} mode="순찰" onClick={select} />
<RobotStatusCard name="LKR-CP" status="offline" battery={14} selected />
```

- **battery** 20% 이하 레드·50% 이하 앰버로 자동. **status** 점으로 표시. **selected**로 강조, **image** 없으면 이니셜. 라이브 값은 앱에서 바인딩.
