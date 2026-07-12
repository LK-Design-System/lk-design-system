**ConnectionBadge** — 연결 상태(신호 막대 + 라벨). MQTT / rosbridge 연결 표시에 씁니다.

```jsx
<ConnectionBadge status="online" />
<ConnectionBadge status="ready" />
<ConnectionBadge status="connecting" size="sm" />
<ConnectionBadge status="stale" label="마지막 수신 지연" />
<ConnectionBadge status="error" />
```

- **status** `connecting · ready · online · reconnecting · weak · stale · error · offline` · **label**(기본 한국어) · **showLabel** · **size** `sm · md`.
- `ready`는 링크가 다음 제어 게이트를 평가할 전제조건을 충족했다는 뜻입니다. 신호색(파랑)과 `연결 준비됨` 라벨을 함께 쓰며, 권한·arming·포커스까지 통과한 전체 제어 가능 상태를 뜻하지 않습니다. `online`은 기존의 정상 운영 연결(positive) 의미를 유지합니다.
- 막대 수만으로 상태를 구분하지 않습니다. 기본 라벨은 시각적으로 표시되고, `showLabel={false}`에서도 같은 상태명이 접근 가능한 이름으로 남습니다. 커스텀 비문자 라벨을 숨길 때는 `aria-label`을 함께 제공합니다.
- Badge는 간결한 현재 상태만 표시합니다. 마지막 수신 시각과 지연 설명은 `DescriptionList`, 재연결 액션은 `ActionArea`와 `Button`을 제품에서 조합합니다.
