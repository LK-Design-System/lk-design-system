# Timeline orientation 제안 — 가로 레일

| Field | Value |
| --- | --- |
| Type | Adopted implementation record |
| Status | Adopted and completed — Core horizontal Timeline 반영, Slides NarrativeTimeline의 hand-rolled row 분기 철거·위임 완료 |
| Owner | Design system owner |
| Last reviewed | 2026-08-22 |
| Source | 소비처: `lk-design-system-slides/src/components/editorial/NarrativeTimeline.jsx`(Core Timeline 위임) · 대상: `components/content/Timeline` |
| Current roadmap | 종결 — 새 backlog 없음 |

이 제안은 채택되어 Core와 Slides 소비처까지 구현을 마쳤다. 아래 문제·API·마이그레이션
서술은 구현 전 결정 근거로 보존하며 현재 public 계약은 source와 generated guide를 우선한다.

`Timeline`에 `orientation: 'vertical' | 'horizontal'`(기본 vertical)을 추가하자는
제안이다. 현재 Timeline은 세로 전용이고(".d.ts 자체가 '세로 이벤트 타임라인'"),
가로 레일 프리미티브는 Core 어디에도 없다(StepList는 편집형 저작 UI라 용도가
다르다).

## 채우는 구멍

투영 매체에서 연대기는 좌→우로 읽힌다. 세로 레일은 흐르는 문서의 관용구라,
고정 캔버스에 올리면 좌측 뭉침 + 우측 절반 공백이 된다(Slides 실덱 리뷰
2026-08-16에서 RoadmapSlide가 두 번째로 나쁜 슬라이드로 판정된 원인).
Slides는 당장 필요해서 NarrativeTimeline 안에 row 레일을 자체 렌더한다 —
ol/li/`<time>` 시맨틱과 톤 노드를 위성이 복제하고 있는 상태이며, 이 복제가
이 제안의 비용 근거다.

## 제안

- `orientation="horizontal"`: 노드·레일을 가로로, 항목은 `minmax(0, 1fr)`
  등분(항목이 적을수록 한 칸이 넓어지는 공간 적응). 마지막 노드 뒤 레일
  세그먼트는 그리지 않는다 — 연대기가 거기서 끝나는데 선이 계속되면
  거짓말이다(위성 구현에서 채택한 규칙).
- ol/li/`<time>` 시맨틱, tone 어휘, 항목 API는 세로와 동일 — 방향은 표현
  축이지 의미 축이 아니다.
- 승격 시 위성 마이그레이션: NarrativeTimeline의 row 분기를 지우고
  `<Timeline orientation="horizontal">` 위임으로 복귀. 이 문서 Status를
  Adopted로 올린다.

## 기각해도 되는 조건

가로 연대기 소비자가 Slides 하나뿐인 동안은 보류가 합리적일 수 있다.
다만 display0(TYPE_RAMP_DISPLAY0_PROPOSAL.md)와 달리 이쪽은 위성이 업스트림
시맨틱을 실제로 복제 중이므로, 두 번째 소비자가 아니라 **복제 유지 비용**이
재개 트리거다.

## 후속 — 타입 재지정 훅 (2026-08-17)

`orientation`만으로는 위성의 복제를 지울 수 없었다: NarrativeTimeline이 가로
레일을 자체 렌더한 **두 번째 이유가 타입 고정**이었기 때문이다(제품 램프
직결이라 매체가 단을 재지정할 수 없었다). Table 셀과 같은 관용구로 훅을
열었다 — `--lk-timeline-time/title/desc-size|line|spacing`, 폴백이 곧 기존
제품 램프 값이라 제품 화면은 바이트 동일하다. 스토리 `변형·상태 · 매체
재지정`이 두 매체를 나란히 놓고, **재지정해도 시각 표기가 제목보다 조용한지**
(옮기는 것은 크기가 아니라 단)를 play로 단언한다.

이로써 위성 마이그레이션의 업스트림 선행 조건이 모두 충족됐다. 실제 철거는
이 계약이 담긴 코어 릴리스를 위성이 소비한 뒤다.
