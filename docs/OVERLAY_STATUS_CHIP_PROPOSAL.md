# Overlay Status Chip 제안 — 표면 앵커 비차단 상태 칩

| Field | Value |
| --- | --- |
| Type | Adopted implementation record |
| Status | Adopted and completed — `0.1.0-rc.2`에서 Core Status family 편입, current Robotics rc.29에서 소비 |
| Owner | Design system owner |
| Last reviewed | 2026-08-22 |
| Source | 구현: `components/status/OverlayStatusChip.jsx` (편입 완료) · 소비 규약: `lk-design-system-robotics/docs/OVERLAY_STATUS_CHIP.md`. 근거였던 Robotics 내부 모듈은 편입과 함께 삭제됨 |
| Current roadmap | 종결 — 새 backlog 없음 |

상호작용 표면(캔버스, 뷰어, 제어 영역)이 떠 있는 채로 비활성이거나 배경
작업 상태를 알려야 할 때, **레이아웃에 참여하지 않고 표면 위에 앵커되는**
알약형 상태 표시를 코어 `Status` 가족(Banner·Callout·Spinner 옆)에 추가하자는
제안이다.

## 채우는 구멍

기존 Status 가족은 전부 다음 중 하나다: 흐름 내 블록(Banner·Callout —
삽입하면 콘텐츠를 민다), 화면 구석의 일시 알림(Notification), 호버 트리거
(Tooltip), 라벨형 신호(StatusBadge·StatusIndicator — 앵커 개념이 없다).
"이 표면이 지금 왜 이런 상태인지"를 **그 표면 위에서, 지오메트리를 건드리지
않고** 말하는 자리가 비어 있다.

## 근거 (구현 완료된 소비처)

Robotics `ManualControlSession`이 내부 모듈로 두 자리를 운영 중이다:

1. **활성화 장치(deadman) 대기** — 초당 수회 반복되는 press/release 상태.
   흐름 내 노티스로 표현하면 매 사이클 컨트롤이 출렁인다(안전 HMI에서 비상
   정지·조작 컨트롤의 위치 불변은 요구사항이다).
2. **제어 포커스 상실** — 기존 상단 노티스 바 방식은 포커스 복귀 시 컨트롤을
   위로 당기는 레이아웃 시프트가 있었고, 칩 전환으로 시프트 0을 실측 확인.

play 단언이 계약(absolute·pointer-events none·inert 밖·role=status)을 CI에서
고정하고 있다.

## 코어에서 예상되는 소비처

- **캔버스 편집기** — "저장 중", "동기화 지연"을 캔버스 위에 비차단으로.
- **Map2DCanvas / ViewerFrame** — "지도 불러오는 중", "경로 재계산 중".
- **드래그·조작 모드 힌트** — 조작 중 레이아웃이 움직이면 안 되는 모든 표면.

## API 스케치

```jsx
<OverlayStatusChip tone="neutral | cautionary | negative" icon={optional}>
  라벨
</OverlayStatusChip>
```

- 톤→글리프는 `STATUS_TONE_STYLE` 재사용(제2 매핑 금지). neutral은 무채색 —
  hold-to-run의 휴지 상태처럼 "정상인 대기"에 상태색을 낭비하지 않는다.
- 배치는 호출부 소유(기본 상단 중앙). 칩은 자기 위치를 모른다.
- 내장 계약: `role="status"`, `pointer-events: none`, 레이아웃 불참, inert 밖
  배치 가이드.

## 확장 지점 (이번 범위 아님)

어두운 영상·지도 위 변형(translucent scrim + blur — Robotics VIEWER_OVERLAY
계열, ViewerToolbar on-dark와 같은 가족). Robotics에서 소비처가 생기면 그
구현을 근거로 추가한다. 소비처 없는 분기를 미리 만들지 않는다.

## 심사 시 결정할 것

1. 이름(`OverlayStatusChip` 가칭)과 Storybook 위치(`LDS Core/Status`).
2. 배치 프리셋(top/bottom)을 API로 열지, 호출부 style로 남길지.
3. `StatusIndicator`와의 경계 서술 — 칩은 "표면의 상태", 인디케이터는
   "개체의 신호".
4. 편입 시 Robotics 내부 모듈 삭제 및 교체(소비처가 내부 import뿐이라 공개
   API 파손 없음).
