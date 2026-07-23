**Dimmer** — 가장 가까운 포지션드 조상을 채우는 스크림 오버레이(부모에 `position: relative` 설정).

```jsx
<div style={{ position: 'relative' }}>
  <Card>…</Card>
  <Dimmer open={loading}><Spinner color="#fff" /></Dimmer>
</div>
```

- **open** — 표시 여부. **blur** — 뒤 블러. **onClick** — 예: 닫기. 전체 화면 모달 스크림에는 `Modal` / `Alert`를 쓰세요.
- **blockInteraction**(기본 `true`) — 열려 있는 동안 같은 컨테이너의 형제 요소에 `inert`를 걸어 가려진
  버튼·입력을 Tab 순서와 접근성 트리에서 함께 제거합니다. **busy**(기본 `true`) — 컨테이너에
  `aria-busy="true"`를 걸고 children을 `role="status"`로 노출합니다.

### 키보드 · 보조기기 계약

- Dimmer는 **차단 범위를 컨테이너 하나로 한정**합니다. 페이지 전체를 막아야 하면 Dimmer가 아니라
  `Modal`·`ConfirmDialog`처럼 `useDialogFocus`를 쓰는 다이얼로그 표면을 사용하세요.
- 열려 있는 동안 가려진 콘텐츠는 `inert`이므로 **Tab / Shift+Tab으로 도달할 수 없고** 포인터 입력도
  받지 않습니다. "가려 보이지만 조작되는" 상태를 만들지 않는 것이 이 컴포넌트의 핵심 계약입니다.
- Dimmer는 **포커스를 옮기지도, 가두지도 않습니다.** 스크림이 열리기 직전에 형제 요소에 있던 초점은
  `inert`로 인해 브라우저가 컨테이너 바깥으로 이동시킵니다. 처리 후 특정 요소로 초점을 되돌려야 하는
  흐름은 제품이 소유합니다.
- Dimmer 자체에는 초점 가능한 요소가 없습니다. 스크림 안에 버튼(예: 취소)을 두어야 하면 그 버튼은
  `inert` 대상이 아니므로 그대로 도달할 수 있지만, 스크린 리더 사용자에게 그 존재를 알리는 문구를
  children에 함께 넣으세요.
- 상태 안내: children에 "처리 중", "동기화 중" 같은 **텍스트 레이블**을 포함하세요. `role="status"`로
  정중하게 announce되며, 컨테이너의 `aria-busy="true"`가 진행 중임을 함께 노출합니다. 아이콘·스피너만
  두면 보조기기에는 아무것도 전달되지 않습니다.
- Escape는 처리하지 않습니다(차단 상태를 사용자가 임의로 해제하면 안 되는 경우가 기본). 해제 가능한
  차단이면 `onClick`과 스크림 안의 명시적 취소 버튼을 함께 제공하세요.
