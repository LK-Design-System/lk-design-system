# LK Product Frontend Workflow Coverage

| Field | Value |
| --- | --- |
| Type | Product workflow coverage contract and audit summary |
| Status | Current · LK Web Viz review in discovery |
| Owner | Product design/engineering · Design system owner |
| Last reviewed | 2026-07-12 |
| Machine-readable source | `references/product-frontends/COVERAGE_AUDIT.json` |

## 필수 LK 제품 자산 교차 검토

앞으로 신규 컴포넌트, 대규모 재설계, 도메인 컴포넌트 품질 검토는 Storybook이나 LDS 코드만 보고 완료 처리하지 않는다. 실제 LK 제품 자산의 코드와 이미 구현된 프론트엔드를 확인하여, 공유 컴포넌트가 실제 사용자 워크플로우를 조합 가능한 형태로 지원하는지 검토한다.

최소 필수 검토 대상은 다음 세 자산이다. 특정 컴포넌트와 관련이 없더라도 생략하지 않고 `not applicable`과 그 이유를 기록한다.

| 제품 자산 | 기준 소스 | 현재 증거 상태 |
| --- | --- | --- |
| LK Web Viz | `LK-ROBOTICS/lk_web_viz` · `a984def117c05acd213f494cbb8a42e990595505` · `frontend` | source pin 완료, WF-15 discovery 진행 중 |
| LK Control Full Daedeok | `LK-ROBOTICS/lkrobotics-control-full-daedeok` | `docs/references/product-frontends/COVERAGE_AUDIT.json`의 pinned revision 재사용 또는 최신화 |
| LK Context Hub | `LK-ROBOTICS/lk_context_hub` | `docs/references/product-frontends/COVERAGE_AUDIT.json`의 pinned revision 재사용 또는 최신화 |

각 컴포넌트 리뷰에는 아래 내용을 남긴다.

1. 확인한 repository, commit, frontend root, route/page/container와 핵심 source file
2. 실제 사용자 진입점, 결정, 데이터·권한 전제조건과 완료 조건
3. loading, empty, error, stale, offline, disabled, partial failure와 복구 경로
4. LDS 컴포넌트 하나로 지원되는지, 여러 primitive의 composition이 필요한지, 아니면 gap인지
5. gap이 LDS 공개 계약의 책임인지 product orchestration·backend·transport의 책임인지
6. normal/narrow/dark 환경과 실제 제품 데이터 밀도에서의 시각·상호작용 적합성

판정 값은 `supported`, `supported by composition`, `gap`, `not applicable`로 통일한다. 제품 화면을 Storybook에 복제하거나 route·backend 정책·transport 상태 머신을 공용 컴포넌트에 넣는 것은 커버리지로 인정하지 않는다. 타입, 접근성, Storybook, 픽셀 회귀 검사가 통과하더라도 이 교차 제품 워크플로우 검토를 대신할 수 없다.

이 문서는 LDS가 지원해야 하는 다섯 제품의 워크플로우를 다시 발견하고 검증하기 위한 기준 문서다. 현재 제품 화면이나 기존 LDS 컴포넌트를 정답으로 보지 않는다. Storybook에는 감사표, 와이어프레임, 완성 화면을 추가하지 않으며, 검증된 컴포넌트와 패턴의 실제 상태만 둔다.

## 현재 판정

2026-07-10에 다섯 원격 저장소의 기본 브랜치 HEAD를 새 작업공간에 다시 받아 commit과 주요 source blob을 고정했다. 기존 `34 covered / 0 partial / 0 missing` 판정은 철회한다. 그 판정은 대응 파일의 존재를 워크플로우 검증으로 잘못 취급했다.

| 단계 | 수 | 의미 |
| --- | ---: | --- |
| discovered | 1 | source만 확보하고 독립 wireframe을 만들지 않은 항목이다. |
| wireframed | 0 | 독립 low-fi까지만 있고 구현 근거가 없는 항목이다. |
| implemented | 0 | 컴포넌트와 state story는 있으나 전체 trace가 닫히지 않은 항목이다. |
| verified | 14 | source requirement, 독립 wireframe, 작은 LDS 책임, state story, 검증 근거가 연결됐다. |

여기서 `verified`는 디자인 시스템의 shared responsibility와 product-owned seam이 추적 가능하다는 뜻이다. 여섯 제품이 이 패키지를 실제로 통합했거나 production workflow가 end-to-end 검증됐다는 뜻은 아니다.

## 판단 근거의 우선순위

다음 순서를 지킨다.

1. 제품이 해결해야 하는 사용자 문제와 불변 규칙
2. backend/domain 문서와 실제 코드에서 확인되는 상태 전이, 허용 조건, 실패·복구
3. 현재 page/container 코드에서 관찰되는 사용자 행위
4. UX audit와 과거 wireframe handoff가 지적하는 문제
5. 기존 제품 레이아웃과 기존 LDS 컴포넌트

과거 wireframe 문서는 문제를 발견하는 근거이지 설계 원본이 아니다. 현재 route, DOM, sidebar, card, table, modal 배치도 보존 대상이 아니다. 기존 LDS 구현은 workflow에서 다시 도출될 때만 유지한다.

## 비목표

- 제품 화면을 LDS 토큰으로 다시 칠하는 것
- route나 page component를 같은 이름의 LDS component로 승격하는 것
- prop과 상태를 많이 추가해 화면형 컴포넌트를 재사용 가능하다고 주장하는 것
- 현재 구현과 닮았다는 이유로 workflow coverage를 완료 처리하는 것
- Storybook에 workflow, template, audit, wireframe을 올리는 것

## 원본 기준점

| 제품 | commit | 다시 읽는 중심 질문 |
| --- | --- | --- |
| DeviceOps | `41c319eb0ad863f67d73facc64f7dd2a13ab9585` | 운영자가 보드의 실제 상태를 믿고 원격 변경의 적용 여부까지 확인할 수 있는가? |
| VisionOps | `308da0c0624024ba2497cf05cda2841e4411b522` | 입력·처리·판정 evidence를 혼동하지 않고 원인과 안전한 조치를 찾을 수 있는가? |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` | 지도 point·line·region·facility와 층별 target을 의미·상태·zoom에 맞게 구분하고 편집할 수 있는가? |
| Context Hub | `de124084b7e50049350a46f92c4ea4476269c58c` | 어떤 범위와 근거가 사용됐는지 확인하면서 관계·문서·질의를 관리할 수 있는가? |
| Control | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` | 로봇을 선택하고 계획·감시·직접 제어할 때 위험한 상태 전이를 안전하게 다룰 수 있는가? |
| MLOps | `0e9f3b03fccd60ab0575b55c18035cc9f9e91521` | 선택 버전의 blocker, 다음 안전한 행동, evidence, 실제 외부 반영 범위를 판단할 수 있는가? |

## 제품별 workflow 재추출

### DeviceOps

- fleet attention routing: 검색·필터·freshness·알림으로 조사할 보드를 찾고 상세로 이동한다.
- live board investigation: 마지막 관측값과 현재 연결 상태를 구분하고 리소스·서비스·주변기기·로그를 교차 확인한다.
- guarded remote change: 실행 가능 여부와 영향을 확인하고 명령을 보내며 `sent → accepted/ack → applied/confirmed`를 실제 상태 변화로 검증한다.
- diagnostic session: 서비스 로그나 터미널 연결을 시작하고, 끊김·재연결·follow 중단·재개를 명시적으로 다룬다.
- profile rollout: profile 변경이 여러 보드에 미치는 영향을 확인하고 push 결과와 부분 실패를 읽는다.

### VisionOps

- module attention routing: freshness와 degraded 상태로 조사할 모듈을 선택한다.
- causal investigation: 입력 telemetry → processor 상태 → decision evidence 순으로 원인을 좁히고 event·video·thermal·pipeline을 교차 확인한다.
- graph exploration: 노드 선택과 상세 열기를 분리하고 upstream/downstream 관계를 보존한 채 원인을 추적한다.
- staged configuration: current와 draft를 비교하고 변경·validation·high-risk·restart-required를 확인한 뒤 적용과 실제 반영을 구분한다.
- guarded recovery: event clear나 pipeline restart의 영향과 command lifecycle을 확인한다.

### LK Web Viz

- map object authoring: point, line, polygon region과 landmark를 선택·생성·수정하고 저장 실패 시 작업 문맥을 유지한다.
- facility semantics: elevator entry/interior, door, stair, waypoint, charger, generic POI를 같은 점 glyph로 축약하지 않고 의미와 상태를 구분한다.
- zoom-stable inspection: 작은 zoom에서도 point·line·region·label의 위계와 selection이 유지되고, 조밀한 geometry는 inspector나 이름 있는 목록으로 보완한다.
- floor-aware task targeting: 건물·층·map identity를 유지하면서 landmark 또는 좌표를 task step에 연결한다.
- product boundary: persistence, editor command, floor topology, task schema, device control은 제품이 소유하고 LDS는 renderer-neutral feature·state·selection·accessible mirror 계약만 공유한다.

### Context Hub

- scope configuration: workspace/system/domain과 repo/space/HF/board 관계를 검색·선택하고 dirty change를 저장하거나 폐기한다.
- evidence-backed briefing: attention item에서 project, GitHub, Confluence, report evidence로 이동하고 근거의 출처와 freshness를 유지한다.
- document intake and sync: 파일 선택, 변환, 검증, 동기화를 거치며 파일별 결과와 부분 실패를 복구한다.
- scoped assistance: provider availability와 실제 scope를 확인하고 질문하며, streaming/error/retry와 source를 읽고 scope 변경 시 session 의미를 재설정한다.
- sensitive credential handling: secret을 기본적으로 가리고 제한된 reveal/copy/update와 audit 가능성을 유지한다.

### Control

- robot supervision: 로봇을 선택하고 map/video/status/facility/event를 같은 시점의 truth로 읽는다.
- manual control session: target과 연결을 확인하고 control authority를 획득한 뒤 hold/release, focus loss, connection loss, emergency stop을 안전하게 처리한다.
- procedure authoring: 목적·로봇·map target을 정하고 순서형 step을 작성·검증·미리보기·template 저장 후 명시적으로 전송한다.
- schedule automation: task와 target, 시간, 반복, 우선순위를 정하고 conflict와 실행 상태를 확인한다.
- alarm investigation: 목록 문맥을 유지한 채 상세 원인으로 이동하고 조치 후 원래 triage 위치로 돌아온다.

### MLOps

- version decision: selected version의 현재 상태, blocker, next safe action, evidence readiness를 먼저 판단한다.
- preflight-to-execution: 검증 결과와 warning/blocker를 읽고 queue/rejection을 구분한 뒤 actual run을 시작한다.
- long-running operation: progress보다 result semantics와 scope를 우선해 실패 영향, artifact, retry/cancel 조건을 판단한다.
- human review gate: evidence를 보고 accept/reject/skip과 note를 기록하며 자동 job과 다른 책임으로 completion을 관리한다.
- approval and release: `preflight_ready`, `approved`, `released`를 분리하고 actor와 external publish evidence를 요구한다.
- data preparation: source authority와 recipe lineage를 이해하고 dry-run, materialization, preview/tag/export의 범위를 과장 없이 다룬다.

## 교차 제품 canonical workflow

아래 항목은 화면 이름이 아니라 사용자 결정의 반복 구조다. `docs/references/product-frontends/COVERAGE_AUDIT.json`의 `WF-*` 레코드가 source blob까지 추적한다.

| ID | workflow | 반드시 답해야 하는 질문 | 현재 단계 |
| --- | --- | --- | --- |
| WF-01 | Attention to context | 무엇을 먼저 조사해야 하며, 상세에서 돌아와도 탐색 문맥이 유지되는가? | wireframed |
| WF-02 | Live truth investigation | 최신 truth와 stale cache를 구분하고 원인 evidence를 좁힐 수 있는가? | wireframed |
| WF-03 | Guarded remote action | 실행 가능성, 영향, 전송, 수락, 적용, 확인 실패를 구분하는가? | wireframed |
| WF-04 | Staged change and apply | current/draft 차이, validation, 위험, 적용, restart/verification을 분리하는가? | wireframed |
| WF-05 | Procedure authoring | 목적과 target을 기준으로 step을 검증하고 실행 전 결과를 예측할 수 있는가? | wireframed |
| WF-06 | Long-running operation | preflight, queue/rejection, running, result scope, artifact, retry를 구분하는가? | wireframed |
| WF-07 | Human review decision | evidence와 사람의 decision·note·actor를 자동 실행과 분리하는가? | wireframed |
| WF-08 | Evidence and provenance investigation | claim에서 원본 source, 관계, freshness, gap으로 추적 가능한가? | wireframed |
| WF-09 | Manual control safety session | authority·focus·hold·release·link loss·e-stop이 안전한가? | wireframed |
| WF-10 | Scoped knowledge assistance | 실제 사용 scope와 provider truth, source, session reset 의미가 보이는가? | wireframed |
| WF-11 | Sensitive credential handling | secret 노출·복사·갱신이 최소 권한과 audit 경계를 지키는가? | wireframed |
| WF-12 | External publish | validation-only와 실제 외부 write, publish evidence를 구분하는가? | wireframed |
| WF-13 | Schedule automation | recurrence·timezone·conflict와 개별 run 상태를 구분하는가? | wireframed |
| WF-14 | Approval transition | review completion, approval, external release를 서로 다른 truth로 다루는가? | wireframed |
| WF-15 | Map navigation and facility authoring | point·line·region·facility와 층 identity가 일반 관례와 실제 LK workflow에서 구분되는가? | discovered |

## 독립 설계 원칙

1. workflow state machine과 화면의 공간 배치를 분리한다. 같은 workflow가 modal, page, drawer에서 쓰인다고 같은 layout component가 되는 것은 아니다.
2. entity 명사보다 사용자의 결정 동사를 우선한다. `DatasetExplorer`보다 “다음 안전한 action을 선택하기 위한 evidence 조사”가 먼저다.
3. 읽기 truth와 write intent를 분리한다. stale data 위에서는 위험 action이 활성화되지 않아야 한다.
4. transport success와 domain success를 분리한다. HTTP 200, MQTT publish, ACK는 실제 적용 완료가 아니다.
5. human gate와 runner execution을 분리한다. review와 approval을 job stage처럼 표현하지 않는다.
6. current implementation의 panel 수와 정보량을 보존하지 않는다. 필요한 decision hierarchy에 따라 줄이거나 재배치한다.
7. 단일 제품에서만 보이는 흐름은 즉시 LDS compound component로 승격하지 않는다. 안전·접근성상 공용 계약이 필요한 최소 단위만 추출한다.

## 1차 독립 wireframe 계약

아래 wireframe은 현재 제품 화면의 panel 배치를 옮긴 것이 아니다. 여러 제품에서 동일하게 발생하는 판단 순서를 기준으로 정보의 선후 관계만 고정한다. 구체적인 page, modal, drawer 배치는 소비 제품이 결정한다.

### WF-03 Guarded remote action

핵심 판단은 “버튼을 눌렀는가”가 아니라 “의도한 원격 상태가 실제로 확인됐는가”다.

```text
┌ Target truth ───────────────────────────────────────────┐
│ 대상 · 현재 상태 · freshness · control eligibility     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Intent and impact ──────────────────────────────────────┐
│ 하려는 일 · 영향 범위 · 가역성 · 외부 변경 · 차단 이유 │
└─────────────────────────────────────────────────────────┘
                         ↓ explicit confirmation
┌ Lifecycle ──────────────────────────────────────────────┐
│ Requested → Sent → Accepted/ACK → Applied → Confirmed   │
│                 ↘ Failed / Timed out / Superseded       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Outcome and recovery ───────────────────────────────────┐
│ 실제 결과 · 확인 근거 · retry 가능성 · 다음 안전한 행동│
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- action row나 button은 진입점일 뿐 lifecycle 전체를 소유하지 않는다.
- 제품이 제공하지 않는 `applied`나 `confirmed` 단계를 LDS가 만들어내지 않는다.
- ACK와 실제 상태 변화 검증을 같은 성공 표시로 합치지 않는다.
- emergency stop처럼 지연 자체가 위험한 action은 이 confirmation 흐름 밖에 둔다.
- 결과는 transient toast만으로 끝내지 않고 command identity와 함께 다시 확인할 수 있어야 한다.

이 구조는 DeviceOps service/reboot, VisionOps config/restart, Control task dispatch에 적용되지만 각 명령의 phase와 확인 watcher는 제품이 제공한다.

### WF-04 Staged change and apply

핵심 판단은 “폼을 저장했는가”가 아니라 “무엇이 바뀌고, 어느 범위까지 실제 반영됐는가”다.

```text
┌ Context truth ──────────────────────────────────────────┐
│ 편집 대상 · 현재 revision/freshness · 편집 권한         │
└─────────────────────────────────────────────────────────┘
┌ Change summary ─────────────────────────────────────────┐
│ 변경 N · 오류 N · high-risk N · restart/external impact│
└─────────────────────────────────────────────────────────┘
┌ Editable content ───────────────────────────────────────┐
│ section                                                 │
│   current value → draft value        field validation   │
│ section                                                 │
│   current value → draft value        impact             │
└─────────────────────────────────────────────────────────┘
┌ Persistent actions ─────────────────────────────────────┐
│ Discard/Reset        Save draft        Apply change      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Post-save truth ────────────────────────────────────────┐
│ Saved ≠ Applied ≠ Restarted ≠ Verified                  │
│ command/result evidence와 다음 필요한 행동              │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- field renderer와 change workflow를 한 screen-sized component에 묶지 않는다.
- `current`, `draft`, `saved`, `applied`, `verified`를 별도 truth로 다룬다.
- sticky action은 긴 폼을 위한 layout 선택이며 domain schema를 소유하지 않는다.
- 오류는 field, section, global mutation 중 실제 소유 범위에 남긴다.
- Context Hub 관계 편집, DeviceOps profile rollout, VisionOps config, MLOps run configuration은 같은 change grammar를 쓰되 같은 form layout을 강제하지 않는다.

이 구조에서 우선 검토할 최소 LDS 단위는 change summary, dirty-leave guard, persistent action bar다. `SchemaConfigEditor` 같은 전체 화면형 컴포넌트는 구현 근거로 인정하지 않는다.

### WF-06 Long-running operation

핵심 판단은 progress 숫자가 아니라 “무슨 검증을 통과했고 어떤 결과 범위를 얻었으며 무엇을 해야 하는가”다.

```text
┌ Operation intent ───────────────────────────────────────┐
│ 입력 · 예상 출력 · 비용/시간 · external effect         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Preflight evidence ─────────────────────────────────────┐
│ Pass · Warning requiring judgment · Blocker · Unknown   │
└─────────────────────────────────────────────────────────┘
                         ↓ explicit actual-run intent
┌ Admission ──────────────────────────────────────────────┐
│ Queued/Reserved  또는  Rejected + reason                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Runtime ────────────────────────────────────────────────┐
│ current phase · elapsed/estimate · cancelability        │
│ progress/log는 보조 evidence                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Outcome statement ──────────────────────────────────────┐
│ process result · result semantics · scope · freshness   │
│ artifact/item results · impact · recovery               │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- preflight CTA와 actual execution CTA는 같은 시각적 무게와 문구를 사용하지 않는다.
- queued와 rejected를 pending 하나로 합치지 않는다.
- `success`는 process 종료일 뿐 external publish 완료를 의미하지 않는다.
- partial result는 성공 badge 옆의 작은 경고가 아니라 outcome의 핵심 상태다.
- log와 raw progress는 운영 판단에 필요한 outcome, impact, recovery보다 뒤에 둔다.
- Context Hub 파일 처리와 MLOps 장기 job은 같은 상태 어휘를 일부 공유하지만 같은 layout component를 사용하지 않는다.

따라서 전체 preflight+execution 화면을 `RunAction` 하나로 소유하지 않는다. 검토 후보는 preflight evidence list, operation admission state, outcome summary처럼 독립 책임을 가진 단위다.

### WF-07 Human review decision

핵심 판단은 “다음 stage를 실행했는가”가 아니라 “사람이 충분한 evidence를 보고 책임 있는 결정을 남겼는가”다.

```text
┌ Session context ────────────────────────────────────────┐
│ 대상 · 진행률 · 현재 candidate · decision policy       │
└─────────────────────────────────────────────────────────┘
┌ Primary evidence ───────────────────────────────────────┐
│ 판단에 직접 필요한 image/document/change/result         │
└─────────────────────────────────────────────────────────┘
┌ Supporting evidence and gaps ───────────────────────────┐
│ provenance · 비교값 · 관련 source · missing/uncertain   │
└─────────────────────────────────────────────────────────┘
┌ Decision bar ───────────────────────────────────────────┐
│ Accept      Reject      Skip      required reason/note  │
└─────────────────────────────────────────────────────────┘
                         ↓ persist before advance
┌ Recorded decision ──────────────────────────────────────┐
│ actor · time · reason · undo policy · next candidate    │
└─────────────────────────────────────────────────────────┘
                         ↓ session complete
┌ Completion and later transition ────────────────────────┐
│ decision counts · unresolved gaps · approval eligibility│
│ Approved와 Released는 별도 transition                   │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- review decision과 approval transition을 하나의 표면으로 합치지 않는다.
- decision 저장이 확인되기 전에 자동으로 다음 candidate로 이동하지 않는다.
- evidence layout은 MLOps anomaly와 Context Hub report patch가 서로 달라도 된다.
- 공유 가능한 것은 decision controls, required reason, progress, actor 기록 같은 작은 계약이다.
- `approved`를 completion success처럼, `released`를 approval badge처럼 표현하지 않는다.

이 wireframe은 review를 runner stage처럼 보이게 했던 기존 접근을 명시적으로 폐기한다.

### WF-01 Attention to context

핵심은 많은 카드를 보여주는 것이 아니라 조사 우선순위와 왕복 문맥을 보존하는 것이다.

```text
┌ Scope and trust ────────────────────────────────────────┐
│ 현재 범위 · 데이터 기준 시각 · freshness · 연결 상태   │
└─────────────────────────────────────────────────────────┘
┌ Attention summary ──────────────────────────────────────┐
│ 즉시 확인 필요 · blocked/degraded · 새로 들어온 항목   │
└─────────────────────────────────────────────────────────┘
┌ Narrowing controls ─────────────────────────────────────┐
│ search · filter · sort · saved/active query             │
└─────────────────────────────────────────────────────────┘
┌ Stable collection ──────────────────────────────────────┐
│ item · attention reason · freshness · next useful fact  │
│ live insertion은 현재 읽기 위치를 자동 이동시키지 않음 │
└─────────────────────────────────────────────────────────┘
                         ↓ open / back
┌ Return context ─────────────────────────────────────────┐
│ query · page · selection · scroll · revealed-new state  │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- Dashboard summary와 collection을 항상 한 컴포넌트로 묶지 않는다.
- 빈 결과, 아직 로드되지 않음, 요청 실패를 구분한다.
- live item은 사용자가 `새 항목 보기`를 선택할 때 현재 정렬 문맥에 합친다.
- `DatasetExplorer`처럼 source rail, sample grid, bulk action, pagination을 고정한 domain component를 기본 해법으로 쓰지 않는다.

### WF-02 Live truth investigation

핵심은 마지막 payload를 보기 좋게 나열하는 것이 아니라 “지금 믿을 수 있는 사실”과 원인 evidence를 분리하는 것이다.

```text
┌ Truth statement ────────────────────────────────────────┐
│ entity · live/stale/offline · last trustworthy time    │
│ 현재 표시값의 source와 신뢰 가능 범위                  │
└─────────────────────────────────────────────────────────┘
┌ Why attention is needed ────────────────────────────────┐
│ changed/degraded signal · impact · uncertainty          │
└─────────────────────────────────────────────────────────┘
┌ Causal evidence order ──────────────────────────────────┐
│ connection → input → processing/service → decision     │
│ 제품이 실제로 제공하는 계층만 표시                      │
└─────────────────────────────────────────────────────────┘
┌ Safe next actions ──────────────────────────────────────┐
│ refresh/resync · inspect detail · recovery              │
│ stale truth에서 위험 write는 차단                       │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- status badge 하나로 freshness와 domain health를 동시에 표현하지 않는다.
- VisionOps의 source/processor/decision, DeviceOps의 connection/service, Control의 robot/facility 계층은 같은 순서를 강제하지 않고 causal order만 공유한다.
- 복구 후에는 REST/authoritative source로 resync하기 전 위험 action을 다시 켜지 않는다.

### WF-05 Procedure authoring

핵심은 step 목록 자체가 아니라 목적, target, 순서, 예상 결과를 실행 전에 이해시키는 것이다.

```text
┌ Operational intent ─────────────────────────────────────┐
│ 목적 · target robot/map/floor · 현재 target truth      │
└─────────────────────────────────────────────────────────┘
┌ Ordered outline ────────────────────────────────────────┐
│ 1 step summary      valid/error                         │
│ 2 step summary      valid/error                         │
│ 3 step summary      valid/error                         │
└─────────────────────────────────────────────────────────┘
┌ Selected step editor ───────────────────────────────────┐
│ type-specific fields · target picker entry · validation │
└─────────────────────────────────────────────────────────┘
┌ Procedure preview ──────────────────────────────────────┐
│ resolved order · target summary · warnings/blockers     │
└─────────────────────────────────────────────────────────┘
┌ Intent split ───────────────────────────────────────────┐
│ Save template                    Submit now              │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- map picking은 별도 subflow이며 편집 중 step과 scroll 위치로 반드시 복귀한다.
- template 저장, 즉시 제출, schedule 생성은 서로 다른 intent다.
- 공용 LDS 단위는 reorderable outline, step validation summary, target summary 정도이며 완성 task editor를 컴포넌트로 만들지 않는다.

### WF-08 Evidence and provenance investigation

핵심은 renderer가 아니라 evidence가 어떤 주장과 결정을 지지하는지다.

```text
┌ Claim or question ──────────────────────────────────────┐
│ 지금 확인하려는 사실 · 결정에 필요한 기준              │
└─────────────────────────────────────────────────────────┘
┌ Provenance ─────────────────────────────────────────────┐
│ source · produced at · freshness · authority · scope    │
└─────────────────────────────────────────────────────────┘
┌ Primary evidence slot ──────────────────────────────────┐
│ log / image / video / document / graph / artifact       │
│ renderer 실패 시 readable fallback                      │
└─────────────────────────────────────────────────────────┘
┌ Related evidence ───────────────────────────────────────┐
│ corroborating source · upstream/downstream · comparison │
└─────────────────────────────────────────────────────────┘
┌ Gaps and decision link ─────────────────────────────────┐
│ missing/stale/uncertain · 다음 확인 또는 decision       │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- image overlay, Markdown, graph, terminal을 하나의 universal viewer API로 통합하지 않는다.
- LDS가 공유할 수 있는 것은 provenance header, availability/fallback, related-evidence navigation, accessible summary다.
- `AnnotatedImage`는 image annotation renderer만 소유하고, provenance chrome은 `SourceDisclosure`, 문서 렌더링은 제품 renderer가 소유한다.

### WF-09 Manual control safety session

핵심은 control widget을 보여주는 것이 아니라 continuous intent가 사라지는 모든 순간 안전 정지를 보장하는 것이다.

```text
┌ Target and authority ───────────────────────────────────┐
│ robot/device · live connection · current controller     │
└─────────────────────────────────────────────────────────┘
                         ↓ acquire / arm
┌ Active control boundary ────────────────────────────────┐
│ focus/hold truth · speed limit · command cadence        │
│                                                       │
│               primary control surface                  │
│                                                       │
│ live feedback · last accepted command                  │
└─────────────────────────────────────────────────────────┘
┌ Safety exits ───────────────────────────────────────────┐
│ release · blur · unmount · link loss → immediate stop   │
│ emergency stop은 항상 직접 접근 가능                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Re-entry ───────────────────────────────────────────────┐
│ stop evidence · reason · deliberate re-arm              │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- UI의 `armed`와 실제 control authority를 같은 boolean으로 가정하지 않는다.
- keyboard, pointer, joystick, D-pad, PTZ가 같은 control UI를 쓸 필요는 없지만 safety boundary는 공유해야 한다.
- e-stop은 confirmation이나 일반 command queue 뒤에 놓지 않는다.

### WF-10 Scoped knowledge assistance

핵심은 채팅창이 아니라 모델이 실제로 어떤 범위와 source를 사용했는지 신뢰할 수 있게 하는 것이다.

```text
┌ Scope truth ────────────────────────────────────────────┐
│ provider availability · resolved project/scope · source │
└─────────────────────────────────────────────────────────┘
┌ Conversation ───────────────────────────────────────────┐
│ user intent                                              │
│ assistant response                                      │
│ expandable supporting sources                           │
│ streaming/error/retry는 message 단위                    │
└─────────────────────────────────────────────────────────┘
┌ Composer ───────────────────────────────────────────────┐
│ input · current scope reminder · unavailable reason     │
└─────────────────────────────────────────────────────────┘
                         ↓ scope/provider change
┌ Session boundary ───────────────────────────────────────┐
│ 유지 가능한가? 아니라면 reset 영향과 새 session 명시   │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- scope chip을 실제 backend evidence와 무관한 장식으로 쓰지 않는다.
- 전체 `ScopedConversation`을 한 컴포넌트로 유지하지 않고 message, source disclosure, composer state, reset guard로 분해한다.
- retrieval, citation truth, persistence, provider bridge는 앱 소유다.

Message·feed·composer의 독립 시각·접근성 계약을 Product extension으로 다시 검토하는 후속 gate는
[`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md)의 Track C에 기록한다. 해당 gate가
통과하기 전까지 이 문서의 product-owned workflow 판정은 유지한다.

### WF-11 Sensitive credential handling

핵심은 secret을 보여주는 것이 아니라 가능한 한 secret을 보여주지 않고 목적을 달성하는 것이다.

```text
┌ Credential identity ────────────────────────────────────┐
│ label · provider · scope · status · last updated        │
└─────────────────────────────────────────────────────────┘
┌ Masked value ───────────────────────────────────────────┐
│ ••••••••  Copy reference / Reveal / Replace / Revoke   │
└─────────────────────────────────────────────────────────┘
                         ↓ reveal only when necessary
┌ Re-auth and timed disclosure ───────────────────────────┐
│ permission result · visible timeout · audit notice      │
└─────────────────────────────────────────────────────────┘
┌ Return to masked truth ─────────────────────────────────┐
│ auto-hide · copy feedback · update/revoke result        │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- credential table, edit form, secret reveal을 하나의 `SecretField`가 소유하지 않는다.
- downstream workflow에는 raw secret보다 credential reference를 전달한다.
- copy feedback은 secret 값을 다시 렌더링하지 않는다.

### WF-12 External publish

핵심은 publish 버튼이 아니라 외부 target과 actual write intent, 완료 evidence를 명확히 연결하는 것이다.

```text
┌ Publish target truth ───────────────────────────────────┐
│ provider · repo/path · privacy · credential reference   │
└─────────────────────────────────────────────────────────┘
┌ Validation-only preflight ──────────────────────────────┐
│ blockers · warnings · planned writes · expected evidence│
└─────────────────────────────────────────────────────────┘
                         ↓ separate actual intent
┌ External impact confirmation ───────────────────────────┐
│ 무엇이 생성/변경되는지 · 되돌리기 범위 · actor          │
└─────────────────────────────────────────────────────────┘
┌ Publish attempt ────────────────────────────────────────┐
│ queued/running · target-scoped progress                  │
└─────────────────────────────────────────────────────────┘
┌ External result evidence ───────────────────────────────┐
│ remote id/url/revision · partial/failed items · retry    │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- credential reveal과 publish confirmation을 합치지 않는다.
- `published`와 `released`도 정책상 같은 의미라고 가정하지 않는다.
- 외부 URL/revision 같은 product-provided evidence 없이 완료 상태를 만들지 않는다.

### WF-13 Schedule automation

핵심은 날짜 입력 폼이 아니라 operation rule과 실제 occurrence의 상태를 구분하는 것이다.

```text
┌ Operation reference ────────────────────────────────────┐
│ 기존 task/action · target · owner · priority            │
└─────────────────────────────────────────────────────────┘
┌ Time rule ──────────────────────────────────────────────┐
│ once/recurring · timezone · start/end · recurrence      │
└─────────────────────────────────────────────────────────┘
┌ Conflict and availability ──────────────────────────────┐
│ overlapping operation · unavailable target · policy     │
└─────────────────────────────────────────────────────────┘
┌ Save rule ──────────────────────────────────────────────┐
│ summary · next occurrence · enabled/paused              │
└─────────────────────────────────────────────────────────┘
┌ Occurrence history ─────────────────────────────────────┐
│ scheduled/run/missed/failed occurrence는 rule과 별도    │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- schedule rule state와 개별 실행 상태를 하나의 status로 합치지 않는다.
- recurrence control은 공유 가능하지만 conflict 계산과 task semantics는 앱 소유다.
- recurrence editor는 현재 한 workflow의 폼 조합이므로 public component로 고정하지 않는다. 제품이 `DatePicker`, `TimePicker`, `Select`, `CheckboxGroup`, `ValidationSummary`를 조합하고 두 번째 독립 소비자가 확인될 때 계약화를 재검토한다.

### WF-14 Approval transition

핵심은 상태 버튼이 아니라 어떤 evidence로 어떤 transition을 누가 승인하는지다.

```text
┌ Current truth ──────────────────────────────────────────┐
│ entity/version · current state · requested transition   │
└─────────────────────────────────────────────────────────┘
┌ Gate evidence ──────────────────────────────────────────┐
│ pass · block · pending · insufficient · evidence source │
└─────────────────────────────────────────────────────────┘
┌ Human transition intent ────────────────────────────────┐
│ allowed target · required note · actor                  │
└─────────────────────────────────────────────────────────┘
                         ↓ server-confirmed transition
┌ Recorded state change ──────────────────────────────────┐
│ from/to · actor · time · note · rejection if any        │
└─────────────────────────────────────────────────────────┘
┌ Separate release truth ─────────────────────────────────┐
│ approved ≠ released · external evidence required        │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- review queue completion과 approval transition을 분리한다.
- disabled target을 선택 가능한 옵션처럼 보이지 않게 한다.
- transition을 optimistic UI로 먼저 성공 표시하지 않는다.
- approval UI를 별도 public component로 고정하지 않는다. 제품이 policy와 persistence를 소유하고, LDS의 evidence·form·action 요소를 조합하되 approval과 external release를 별도 축으로 유지한다.

### WF-15 Map navigation and facility authoring

현재 단계는 `discovered`다. `LK-ROBOTICS/lk_web_viz`의 `MapEditScreen`, `ZoneEditor`, `TaskCreateScreen`을 pin했고, point·line·region·landmark·층별 task target의 실제 workflow를 확인했다.

검토에서 답해야 할 질문:

- elevator entry/interior, door, stair, charger, waypoint와 generic POI가 형태·label·상태에서 충분히 구분되는가?
- point, lane/line, route/trajectory, facility region이 한 지도에서 올바른 paint order와 zoom-stable hierarchy를 갖는가?
- 현재 제품의 Material icon 이름을 그대로 복제하지 않고 LK `Icon` registry와 지도 symbol grammar로 일관되게 번역할 수 있는가?
- selection, focus, invalid, unavailable, stale이 색상만이 아니라 shape·pattern·text로도 전달되는가?
- 제품 편집·저장·task schema는 product-owned로 남기면서 LDS renderer를 실제 화면에 조합할 수 있는가?

이 workflow는 아직 independent wireframe, LDS mapping, Storybook visual review가 닫히지 않았으므로 `verified`로 승격하지 않는다.

## 현재 신규 컴포넌트 disposition

이 표는 현재 구현을 보존하기 위한 목록이 아니다. 새 workflow 계약에 비춰 public component 경계를 다시 판단한 결과다. 현재 화면이나 wireframe에 반복된다는 사실만으로 component를 만들지 않으며, 고유 interaction·accessibility contract 또는 둘 이상의 제품에서 반복되는 상태 문법이 없으면 product-owned composition으로 남긴다.

| 판정 | 수 | 의미 |
| --- | ---: | --- |
| keep | 13 | 책임이 작고 일반적인 component category와 일치한다. 구현 검토 후 재사용한다. |
| redesign | 4 | 개념은 필요하지만 현재 API가 상태 축을 합치거나 화면 구조를 과도하게 소유한다. |
| split | 6 | 현재 compound component를 제거하고 더 작은 책임으로 다시 도출한다. |
| remove | 22 | LDS public component로 둘 근거가 없으며 기존 primitives/product renderer 조합으로 돌린다. |
| separate-audit | 5 | 다섯 제품 workflow와 무관한 Robotics editor 계열로 별도 source-first 감사를 요구한다. |

### Keep

| 컴포넌트 | 근거 |
| --- | --- |
| `SpeedDial` | 공개 action category가 명확하고 workflow/page 구조를 소유하지 않는다. |
| `LogViewer` | log renderer가 아니라 filter/follow/scroll 상태를 가진 bounded content component다. |
| `ReorderList` | 같은 레벨 항목의 순서 변경이라는 작은 계약이다. |
| `Legend` | 시각 encoding과 label 연결만 소유한다. |
| `LineChart` | lightweight presentational chart 범위가 명시돼 있다. |
| `PropertyField` | field 하나의 current/draft/apply grammar로 제한할 수 있다. direct-WDS 분류는 수정해야 한다. |
| `DockPanel` | dock/collapse/resize라는 layout behavior만 소유한다. |
| `DirectionalPad` | discrete momentary control로 `Joystick`과 구분된다. |
| `IconPicker` | 단일 icon 선택이라는 표준 category다. |
| `WheelPicker` | generic product picker로 WDS Date/Time parity를 주장하지 않는다. |
| `FileUploadQueue` | 파일별 upload/processing/result와 retry/remove만 소유한다. WF-06 전체를 소유하지 않는다. |
| `SearchableMultiSelect` | async searchable multi-selection이라는 표준 input category다. |
| `SecretField` | masked/reveal/copy의 좁은 계약으로 유지한다. credential CRUD나 publish를 포함하지 않는다. |

### Redesign

| 컴포넌트 | 문제와 새 경계 |
| --- | --- |
| `FileBrowser` | 재설계했다. 표준 file browser category는 유지하되 directory navigation과 file/folder selection을 별도 callback과 control로 분리했다. |
| `TreeSelectionPanel` | 제거하고 `TreePicker`로 교체했다. 화면 panel 책임을 버리고 controlled selection/expansion/search와 descendant 범위 선택만 남겼다. 조회는 기존 `Tree`가 소유한다. |
| `EvidenceViewer` | 제거하고 `AnnotatedImage`로 교체했다. normalized image annotation과 접근성 요약만 남기고 provenance, metric, review action은 분리했다. |
| `ManualControlGuard` | 실제 안전을 보장한다고 오해할 수 있는 이름을 제거하고 `ManualControlSession`으로 교체했다. link, authority, UI armed, dead-man, focus를 분리하며 blur/unmount/link-loss release 요청과 re-arm을 계약화했다. |

### Split

| 현재 컴포넌트 | 분해 방향 |
| --- | --- |
| `DocumentSurface` | 제거했다. provenance/availability는 `SourceDisclosure`, renderer와 patch decision은 product-owned `ChoiceCard`/`Textarea`/`ActionArea` 조합으로 분리한다. |
| `ScopedConversation` | 완성 workflow wrapper는 제거했다. 재사용 가능한 message anatomy·feed history/follow·IME-safe compose는 `ConversationMessage`, `MessageFeed`, `MessageComposer`가 소유하고, provenance는 `SourceDisclosure`, scope selection은 `TreePicker`, reset guard는 `ConfirmDialog`로 분리한다. retrieval, transport, persistence, session policy는 제품이 소유한다. |
| `RunAction` | 제거했다. preflight evidence는 `ValidationSummary`/`DescriptionList`, confirmation은 `ConfirmDialog`, admission/actual-run intent는 product-owned `Button`/`ActionArea` 조합으로 분리한다. |
| `SchemaConfigEditor` | 제거했다. field renderer는 제품에 남기고 `PropertyField`, `DescriptionList`, `ValidationSummary`, `DockPanel`, `ActionArea`로 current/draft evidence와 persistent action layout을 조합한다. |
| `StepComposer` | 제거했다. `ReorderList`, `ValidationSummary`, `DescriptionList`와 product-owned target/step editor composition으로 돌린다. |
| `TransitionGate` | 제거했다. gate evidence는 `ValidationSummary`/`DataGrid`/`SourceDisclosure`, state facts는 `DescriptionList`/`StatusBadge`, note와 submit은 `Textarea`/`ActionArea`로 분리한다. transition policy와 persistence는 제품 소유다. |

### Remove as public LDS component

| 컴포넌트 | 이유 |
| --- | --- |
| `ArtifactBrowser` | artifact table/detail page 구조를 고정한다. collection primitives와 provenance/evidence chrome으로 조합한다. |
| `DatasetExplorer` | source rail, search, grid/list, bulk action, pagination을 한 화면형 component로 고정한다. WF-01/WF-08 composition으로 돌린다. |
| `LineageExplorer` | `TopologyInspector` wrapper가 product graph 의미와 layout을 LDS가 소유하게 만든다. lineage renderer는 앱에 둔다. |
| `AlertCollection` | alert inbox page 구조다. `DataGrid`, filters, pagination, stable live insertion 계약을 조합한다. |
| `ServiceControlRow` | systemd-like status/action 기본값과 confirm flow를 행 안에 결합한다. status + command primitives를 제품에서 조합한다. |
| `TopologyInspector` | node/edge layout과 inspector를 고정해 VisionOps/MLOps renderer 책임을 침범한다. LDS는 evidence/selection chrome만 제공한다. |
| `CommandAction` | `Button`에 eligibility와 request 문구를 붙인 domain wrapper다. 가능 여부와 request error는 제품 상태로 두고 `Button`, `ActionArea`, `Callout`을 조합한다. |
| `ConversationMessages` | Context Hub의 message 배열과 streaming/retry 표현을 public component로 고정한다. 제품이 semantic message list와 `Callout`, `SourceDisclosure`를 조합한다. |
| `ConversationComposer` | `form`, `Textarea`, `Button`의 단순 조합이며 별도 interaction contract가 없다. draft와 submit policy는 제품이 소유한다. |
| `ApprovalTransition` | 한 MLOps transition의 eligibility와 submit 가능 여부를 내부에서 판단해 제품 policy를 침범한다. evidence/form/action primitives로 조합한다. |
| `TerminalFrame` | 실제 interactive terminal 소비자는 DeviceOps 하나뿐이며 renderer와 transport를 제외하면 session header와 overlay 조합이다. DeviceOps가 `ConnectionBadge`, `DescriptionList`, `Callout`, `Button`으로 구성한다. |
| `EditorPanel` | `DockPanel`, form, `ActionArea`, dirty-close `ConfirmDialog`를 고정 조합하며 별도 interaction primitive가 없다. form state와 닫기 정책은 제품이 소유한다. |
| `ExecutionStatus` | activity/outcome/freshness 객체를 `StatusBadge`, `ProgressBar`, `Timeline`, `Callout`에 배치하는 product status block이다. polling과 recovery 의미도 제품이 소유한다. |
| `MetricComparison` | 43줄의 table wrapper가 threshold verdict까지 계산해 제품 평가 정책을 침범한다. `DataGrid` 또는 제품 table renderer로 돌린다. |
| `ReviewDecision` | decision draft, required reason, persistence state와 submit을 한 workflow control로 묶는다. `ChoiceCard`, `Textarea`, `ActionArea`를 제품에서 조합한다. |
| `BatchOperationSummary` | count/progress/failure row를 고정한 결과 화면 조각이다. `ProgressBar`, `StatusBadge`, list row, `ActionArea` 조합으로 충분하다. |
| `ChangeSummary` | current/proposed/impact schema를 고정한 읽기 전용 목록이다. `DescriptionList`, `DataGrid`, `ValidationSummary` 조합으로 충분하다. |
| `CommandLifecycle` | 제품 phase schema를 `Timeline`과 badge에 재배치하는 wrapper다. accepted/applied/confirmed 의미와 late ACK 정책은 제품 계약으로 남긴다. |
| `ConnectionStatus` | `ConnectionBadge`, 세 개의 fact row와 reconnect action을 고정 조합한다. freshness/health 판정과 recovery는 제품이 소유한다. |
| `PreflightSummary` | 검사 outcome/check/recovery/recheck를 하나의 product workflow block으로 고정한다. `ValidationSummary`, `DescriptionList`, `ActionArea`로 조합한다. |
| `SafetyConfirmDialog` | `ConfirmDialog`에 영향 목록과 typed phrase를 붙인 convenience wrapper다. 위험 작업 정책과 typed input은 제품 composition으로 남긴다. |
| `TimeRuleEditor` | 현재 확인된 소비자가 하나뿐이고 once/weekly schema를 public API로 고정한다. 공통 form controls 조합으로 되돌리고 반복 소비자 확인 전에는 승격하지 않는다. |

### Separate Robotics editor audit

`CanvasEditorShell`, `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, `ViewportStatusBar`는 `lk_web_viz` 및 실제 editor 제품 source를 기준으로 별도 감사한다. 다섯 제품 workflow coverage 근거로 사용하지 않는다. 이 격리는 유지 판정이 아니다.

## Workflow implementation verification

아래 표는 화면을 재현한 목록이 아니다. 각 workflow를 처음부터 끝까지 다시 읽고, LDS가 공유할 책임과 제품이 끝까지 소유할 책임을 분리한 closure matrix다.

| Workflow | 검증된 LDS 책임 | 제품에 남는 seam |
| --- | --- | --- |
| WF-01 | `DataGrid`, `DataToolbar`, `FileBrowser`, `TreePicker`의 resource/selection/filter/navigation 계약 | ranking, query, route, scroll·page 복원 |
| WF-02 | `ConnectionBadge`, `DescriptionList`, `LogViewer`, chart/legend, `Button`/`ActionArea` 조합 | telemetry transport, freshness/health 판정, diagnosis, reconnect resync |
| WF-03 | `ValidationSummary`, `DescriptionList`, `ConfirmDialog`, `Timeline`, `Button`/`ActionArea` 조합의 결정 단계 분리 | eligibility, authorization, payload, idempotency, typed phrase policy, confirmation watcher |
| WF-04 | `PropertyField`, `DescriptionList`, `ValidationSummary`, `DockPanel`, `ActionArea`, dirty-close `ConfirmDialog` 조합 | schema rendering, mutation, business validation, restart policy |
| WF-05 | `ReorderList`, `ValidationSummary`, `DescriptionList`, `DockPanel`, `ActionArea`의 ordering/validation/preview 조합 | command schema, map target picker, task payload, submit policy |
| WF-06 | `FileUploadQueue`, `ProgressBar`, `StatusBadge`, `Button`/`ActionArea` 조합 | runner, slot, batch result schema, upload/convert side effect, cancel/retry execution |
| WF-07 | `SourceDisclosure`, `AnnotatedImage`, `DataGrid`, `ChoiceCard`, `Textarea`, `ActionArea` 조합 | review policy, metric verdict, authorization, persistence, queue navigation |
| WF-08 | `SourceDisclosure`, `AnnotatedImage`, `LogViewer`, `FileBrowser`, chart/legend의 renderer chrome | Markdown/media decoder, graph layout, artifact access, claim semantics |
| WF-09 | `ManualControlSession`, `ConnectionBadge`, `Joystick`, `DirectionalPad`의 authority/arm/hold/release 분리 | authority policy, freshness/health 판정, cadence, STOP transport, robot watchdog |
| WF-10 | `ConversationMessage`, `MessageFeed`, `MessageComposer`, `SourceDisclosure`, `TreePicker`, `ConfirmDialog`의 message/feed/compose/source/scope 계약 | role policy, provider/stream transport, retrieval, scope resolution, persistence, session reset |
| WF-11 | `SecretField`, `ConfirmDialog`, `Callout`의 masked/reveal/copy/re-auth composition | encryption, permission, audit logging, update/revoke API |
| WF-12 | `ValidationSummary`, `ConfirmDialog`, `ProgressBar`, `SourceDisclosure`, `ActionArea`의 external-impact/result 조합 | target validation, credential use, upload, outcome schema, external release truth |
| WF-13 | `DatePicker`, `TimePicker`, `CheckboxGroup`, `ValidationSummary`, `SearchableMultiSelect`, `Button`/`ActionArea` 조합 | recurrence schema, eligibility, conflict calculation, task lookup, persistence, occurrence execution |
| WF-14 | `DataGrid`, `SourceDisclosure`, `ValidationSummary`, `DescriptionList`, `Textarea`, `ActionArea` 조합으로 eligibility/approval/release를 구분 | metric verdict policy, authorization, persistence, external release evidence |

WF-15는 source discovery만 완료됐으므로 위 verified closure matrix에 포함하지 않는다. navigation component·symbol review와 실제 product-density 검증이 끝난 뒤 LDS 책임과 제품 seam을 확정한다.

검증은 2026-07-10 기준 다음 범위로 수행했다.

- 유지·split·redesign 컴포넌트의 loading/error/empty/blocked/pending/result 등 state story를 실제 Storybook 6006에서 확인한다. product-owned composition은 Storybook에 workflow story를 추가하지 않고 이 문서와 source-pinned audit에서 경계를 검증한다.
- `ManualControlSession`은 활성 상태에서 link loss를 발생시켜 `link-unavailable` release 요청, armed 해제, control 비활성화를 확인했다.
- `npm run check:storybook`으로 정적 build, implementation story guard, public/hidden 분류, console error를 검증한다.
- `npm run check:product-frontends`, `npm run check:wds-alignment`, `npm run check:types`, `npm run check:type-surface`, `npm run check:consumer`, `npm run check:pack`을 통과했다.
- VCS cleanliness를 보는 `check:entry`와 `check:generated`는 현재 변경을 아직 commit하지 않았으므로 HEAD 차이를 의도대로 보고한다. 생성기를 반복 실행한 결과는 동일하다.

기계 판정의 source of truth는 `docs/references/product-frontends/COVERAGE_AUDIT.json`이며, `npm run check:product-frontends`가 source pin, stage evidence, component disposition, 제거·교체 경계를 검증한다.
