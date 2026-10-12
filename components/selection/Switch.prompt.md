**Switch** — 즉시 on/off 토글(설정, 기능 플래그, 실시간 알림). 켜지면 트랙이 LK 시그널 잉크로 채워지고, 화이트 노브가 바운스 없이 차분히 이동합니다.

## State and reference basis

- Switch exposes `role="switch"` with `aria-checked`; Space and Enter toggle immediately. The control-to-label gap is 8px.
- `readOnly` remains focusable and communicates `aria-readonly`, but it suppresses pointer/keyboard changes and editable hover affordance. `disabled` is removed from the tab order.
- Reference basis: [WAI-ARIA Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/).

## 구조 결정

- **시각적으로 숨긴 네이티브 `<input type="checkbox" role="switch">`를 `<label>`이 감싸는 구조**를 씁니다(Material/Fluent/Ant와 동일한 선택). `<button role="switch">` 대신 이 방식을 고른 이유는 **폼 전송(`name`/`value`)과 브라우저 폼 복원**이 필요하고, `role="switch"`가 `input[type=checkbox]`에 허용된 역할이라 `aria-checked` 의미를 그대로 유지할 수 있기 때문입니다. 트랙과 노브는 `aria-hidden` 장식 요소입니다.
- **접근 이름은 감싸는 `<label>`의 내용에서 나옵니다.** `label`에 JSX 노드를 넘겨도 이름이 `"switch"`로 떨어지지 않습니다. 이름을 직접 지정할 때만 `aria-label`을 쓰세요.
- **Space**는 네이티브 checkbox 활성화에 맡기고, **Enter**만 `onKeyDown`에서 `preventDefault()` 후 직접 토글합니다(Switch 계약 유지 + 폼 제출 방지). 소비자 `onKeyDown`이 먼저 실행되고, `preventDefault()`를 호출하면 내부 처리를 건너뜁니다.
- `readOnly`는 네이티브 checkbox가 `readonly`를 무시하므로 change 시점에 값을 되돌려 유지합니다. 포커스와 `aria-readonly`는 그대로 남습니다.
- 트랙 지오메트리(md 52×32 · sm 40×24), 노브 이동(색이 아닌 위치로도 상태 전달), disabled `tabIndex=-1`은 변경되지 않았습니다.

```jsx
<Switch defaultChecked label="변경 알림" />
<Switch size="sm" checked={on} onChange={setOn} />
<Switch name="night-mode" value="on" label="야간 모드" />
<Switch disabled label="준비 중" />
```

- **checked / defaultChecked / onChange(next)** — 제어/비제어.
- **size** — `md`(52×32) · `sm`(40×24). **label**은 오른쪽에 위치. **disabled**는 토큰 색(회색 트랙·노브)으로 표시.
- 키보드 조작 가능: 포커스 가능, Space/Enter로 토글, 네이비 틴트 포커스 링. 텍스트 라벨이 있는 박스형 on/off는 `Checkbox`를 쓰세요.

## Motion contract

- 트랙의 색·포커스 feedback은 `--dur-fast`(default 120ms, ops 80ms), 노브 위치는 `--dur-base`(default 200ms, ops 160ms)와 `--ease-out`을 씁니다. SegmentedControl·Disclosure와 같은 기존 standard 곡선이며 bounce나 새 token을 추가하지 않습니다.
- checked·ARIA·onChange는 즉시 반영하고 노브의 시각 이동만 보간합니다. 연속 입력은 최신 위치를 향하며 label·폼 값·readOnly 계약을 바꾸지 않습니다.
- `prefers-reduced-motion: reduce`에서는 트랙·노브의 transition만 즉시 종료합니다. checked 노브의 translateX를 유지해 색 외 상태 단서를 보존합니다. default/ops와 normal/iOS 모두 같은 guard를 사용합니다.
- 근거: [WAI-ARIA Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)의 고정된 label과 즉시 읽히는 이진 상태를 유지하고, [WCAG 2.2 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)에 따라 비필수 위치 보간을 끌 수 있게 합니다. 속도와 곡선은 기존 LDS motion token을 적용한 LDS 결정입니다.
