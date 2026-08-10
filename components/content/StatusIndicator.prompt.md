**StatusIndicator**는 실시간 가용성·연결·freshness를 컬러 점과 명시적 라벨로 보여주는 조용한 Core 신호입니다.

```jsx
<StatusIndicator tone="positive">온라인</StatusIndicator>
<StatusIndicator tone="cautionary" pulse>재연결 중</StatusIndicator>
<StatusIndicator tone="offline">오프라인</StatusIndicator>
```

## Classification and boundary

- Runtime owner는 **Core**, provenance는 `StatusBadge`에서 실시간 dot anatomy를 분리한 **WDS-adjacent Core extension**입니다.
- 현재 결과나 수명주기 상태를 채움 라벨로 표시할 때는 `StatusBadge`를 사용합니다. `StatusIndicator`는 연결·가용성·freshness처럼 계속 관찰되는 신호에만 사용합니다.
- anatomy는 6px semantic dot + neutral 12px label입니다. 배경 상자를 만들지 않아 상태 라벨과 시각적으로 섞이지 않습니다.
- `pulse`는 연결 중·재연결 중처럼 실제 변화 중인 신호에만 명시합니다. `prefers-reduced-motion`에서는 멈추고 라벨만으로 의미가 유지됩니다. `critical`은 정적 이중 링을 보조 단서로 제공하지만 자동 pulse하지 않습니다.
- dot은 `aria-hidden`이며 visible label이 접근 가능한 상태 이름을 제공합니다. 컴포넌트는 자동 live region을 만들지 않습니다.

## Evidence and product boundary

- [Spectrum Status light](https://spectrum.adobe.com/page/status-light/)는 semantic dot과 회색 label을 함께 사용하고, label을 필수로 두며 긴 텍스트는 wrap하도록 합니다. LDS도 색을 보조 단서로만 사용합니다.
- [WCAG 2.2 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)는 색만으로 정보를 전달하지 않도록 요구합니다. 따라서 label 없는 dot API는 제공하지 않습니다.
- `StatusBadge`, `ConnectionBadge`, `LogViewer`, `SourceDisclosure`를 sibling으로 확인했습니다. transport 품질의 다단 신호는 `ConnectionBadge`, 긴 원인과 복구 action은 Banner/Notification이 소유합니다.

실제 connection state machine, freshness 임계값, polling과 announcement는 제품이 소유합니다. LK Web Viz, LK Control Full Daedeok, LK Portal은 이 primitive를 조합할 수 있지만 이번 분리는 제품 route나 transport 계약을 바꾸지 않으므로 세 자산 검토는 모두 **not applicable**입니다.

Storybook에서 steady/pulse/offline/critical, 긴 label, light/dark와 reduced motion을 확인합니다.
