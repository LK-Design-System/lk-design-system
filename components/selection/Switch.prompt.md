**Switch** — 즉시 on/off 토글(설정, 기능 플래그, 실시간 알림). 켜지면 트랙이 LK 시그널 잉크로 채워지고, 화이트 노브가 바운스 없이 차분히 이동합니다.

```jsx
<Switch defaultChecked label="실시간 관제 알림" />
<Switch size="sm" checked={on} onChange={setOn} />
<Switch disabled label="준비 중" />
```

- **checked / defaultChecked / onChange(next)** — 제어/비제어.
- **size** — `md`(52×32) · `sm`(40×24). **label**은 오른쪽에 위치. **disabled**는 50%로 흐려짐.
- 키보드 조작 가능: 포커스 가능, Space/Enter로 토글, 네이비 틴트 포커스 링. 텍스트 라벨이 있는 박스형 on/off는 `Checkbox`를 쓰세요.
