**ToastStack** — 모서리에 `Toast` 자식을 쌓는 고정 뷰포트.

```jsx
<ToastStack position="bottom-right">
  {toasts.map((t) => <Toast key={t.id} tone={t.tone} onClose={() => dismiss(t.id)}>{t.msg}</Toast>)}
</ToastStack>
```

- **position** — `bottom-right · bottom-left · top-right · top-left · bottom-center`. **gap** — 토스트 간 px.
- 다섯 position 모두 기존 가장자리 여백 20px을 유지하며 가용 폭은 `calc(100% - 40px)`로
  제한합니다. 320px 뷰포트에서는 280px까지 줄어들고, 넓은 화면에서는 콘텐츠에 따른 Toast의
  기존 335~520px 폭과 모서리·가운데 정렬을 유지합니다. `position: absolute`로 배치하는 경우에는
  동일한 제한을 containing block에 적용합니다. 긴 메시지 줄바꿈 근거는 `Toast.prompt.md`를 따릅니다.
- 스택 자체에도 `min(335px, calc(100% - 40px))` 최소 폭을 둡니다. 이 percentage는 자식의
  intrinsic 폭 대신 containing block을 기준으로 계산되므로 짧은 메시지나 action이 없는 경우에도
  데스크톱의 335px 최소 폭을 보장하고, 좁은 화면에서는 20px 여백 안으로 줄어듭니다.
- ToastStack은 위치·간격과 **라이브 영역 호스팅**을 소유합니다. 자동 해제 시간(`duration`)과 hover/focus
  일시정지, action 포함 Toast의 유지 규칙은 `Toast`가 소유하며 기준은 `Toast.prompt.md`를 따릅니다.
- **liveRegion**(기본 `true`) — 스택이 살아 있는 동안 비어 있는 polite/assertive 라이브 영역 한 쌍을
  계속 mount해 두고, 하위 `Toast`는 자기 메시지 텍스트를 그쪽으로 밀어 넣습니다. 내용과 함께 삽입된
  `role="status"`는 announce되지 않는 경우가 많다는 문제를 피하기 위한 Material·Polaris 관례입니다.
  `negative` Toast는 assertive, 나머지는 polite 영역을 씁니다.
- 동시에 많은 알림을 쌓아 핵심 작업을 가리지 않도록 제품은 보이는 Toast 수를 제한하고 나머지는
  queue에 보존합니다. 중요한 기록은 알림 센터나 영구 상태 표면에서도 다시 찾을 수 있어야 합니다.
