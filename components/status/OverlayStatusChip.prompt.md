# OverlayStatusChip

Surface-anchored, non-blocking status pill for an interaction surface that
stays up while inert or busy.

```jsx
<div style={{ position: 'relative' }}>
  <OverlayStatusChip>연속 활성화 입력 대기</OverlayStatusChip>
  <div inert>{/* the surface the chip describes */}</div>
</div>

<OverlayStatusChip tone="cautionary">제어 포커스 해제</OverlayStatusChip>
<OverlayStatusChip tone="negative" style={{ top: 'auto', bottom: 'var(--space-4)' }}>
  동기화 실패
</OverlayStatusChip>
```

- **분류**: runtime owner `core` (Status). 설계 provenance `robotics-extension`
  — LK Robotics `ManualControlSession`의 내부 구현(활성화 장치 대기·포커스 상실
  두 소비처, CI play 계약 포함)에서 승격. 제안·근거:
  `docs/OVERLAY_STATUS_CHIP_PROPOSAL.md`.
- **sibling 경계**: Banner·Callout은 in-flow 블록(삽입이 표면을 밀어냄),
  Notification은 화면 구석의 일시 알림, Tooltip은 호버 트리거, StatusBadge·
  StatusIndicator는 개체의 라벨/신호(표면 앵커 없음). 이 칩만이 "표면 위,
  레이아웃 불참, 상시"를 만족한다.
- **계약**: `position: absolute`(기본 상단 중앙, `style`로 재배치) ·
  `pointer-events: none`(칩은 컨트롤을 설명할 뿐, 재활성화 입력을 가로채면 안
  된다) · `role="status"` · 호출부는 `inert` 서브트리 **밖**에 배치한다.
- **tone**: `neutral`(기본, 상태색 없음 — 휴지 상태는 결함이 아니다) ·
  `cautionary` · `negative`. 글리프·색은 `status-presentation.js`의
  STATUS_TONE_STYLE을 그대로 소비한다 — 제2의 톤 어휘를 만들지 않는다.
- **icon**: 톤이 정하는 기본 글리프를 특정 Icon 이름으로 교체한다. 바꾸는 것은
  글리프뿐이며 톤의 색과 의미는 그대로다 — 도메인 기호가 톤보다 빨리 읽히는
  경우(예: 견인·충전)를 위한 것이지, 톤이 말하는 심각도를 바꾸는 손잡이가 아니다.
- **외부 근거**: [WAI-ARIA `status` role](https://www.w3.org/TR/wai-aria-1.2/#status)
  — 비차단 상태 표면의 라이브 시맨틱; [Material 3 Snackbar](https://m3.material.io/components/snackbar/guidelines)
  — 콘텐츠 위 비차단 오버레이는 조작을 가로막지 않고 핵심 UI를 가리지 않아야
  한다는 카테고리 기대치(단, Snackbar는 일시적·화면 기준이고 이 칩은 상시·표면
  기준이라는 차이를 의도적으로 유지). 형태(반투명/유리 위 알약 HUD)는 관제·
  플레이어 계열 오버레이 관례를 따르되 값은 LDS 토큰으로만 구성.
- **제품 boundary**: 어떤 상태를 언제 띄울지는 제품 소유. 칩은 표현만 소유하며
  타이머·전이·큐잉을 내장하지 않는다.
- **의도적 제외**: 어두운 영상 위 스크림 변형(공유 오버레이 표면 모듈의
  soft 레벨)은 소비처가 생길 때까지 추가하지 않는다 — 제안 문서의 확장 지점.
  `positive` 톤도 동일(성공은 대개 표면이 스스로 보여준다).
