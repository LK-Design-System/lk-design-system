# LDS 계층 아키텍처 재설계·개편안

| Field | Value |
| --- | --- |
| Type | Active architecture implementation record |
| Status | Active follow-through — 1차 taxonomy/profile·owner authority·O1/O2와 R1 계약·paired release·R2 consumer promotion 완료; R3A/R3B와 §14의 compatibility·stable gate는 roadmap으로 계속 추적 |
| Owner | Design system owner · Frontend platform |
| Required approvers | Design system owner · Frontend platform · Robotics domain owner(해당 변경) · consumer product owner(해당 migration) |
| Last reviewed | 2026-08-22 |
| Scope | Core·Theme·Product·Robotics 계층, 표현 프로파일, 패키지 계약, 소비 증거, legacy 정리 |
| Related | [`DESIGN.md`](../DESIGN.md) · [`OPERATING_MODEL.md`](OPERATING_MODEL.md) · [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md) · [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) |
| Current roadmap | [`LDS_ROADMAP.md`](LDS_ROADMAP.md) — R0·R1·R2 완료; 다음은 R3A density/selector 결정과 R3B owner/API 결정, 이후 R4 stable promotion |

이 문서는 LDS가 **LK Portal 같은 일반 B2B 제품 표면**과 **LK Web Viz·Control 같은
산업 운영 표면**을 하나의 시스템으로 지원하기 위한 목표 계층과 이행 순서를
정의한다. 개편의 목적은 새 디자인 시스템이나 저장소를 만드는 것이 아니라,
이미 존재하는 Core·Theme·Product·Robotics 경계를 실제 코드·토큰·문서·릴리스
증거가 같은 방식으로 설명하게 만드는 것이다.

이 문서는 1차 구현과 아직 닫히지 않은 완료 gate를 함께 보존하는 implementation
record다. 현재 우선순위와 후속 실행 순서는 [`LDS_ROADMAP.md`](LDS_ROADMAP.md)가
소유하며, §14의 체크가 실제 evidence로 모두 닫히기 전에는 `Completed`로 승격하지 않는다.
기존 public export와 Core 기준선을
유지하면서 Product family contract, Theme `default|ops` profile contract,
Storybook profile toolbar, 대표 consumer pin/evidence, Robotics O1/O2 readiness와
legacy active-reference guard를 실제 코드·토큰·검사에 연결했다. O3 alarm lifecycle과
O4 safety-certified HMI는 근거가 없으므로 지원 주장하지 않는다. Portal/default와 Web
Viz/ops의 workflow·accessibility·clean-clone 기술 evidence와 2026-08-22
product/design-system owner 승인이 연결되어 registry stage는 `workflow-verified`다. 이
승인은 consumer adoption에 한정되며 main integration, package stable, rollout 또는 production
deployment를 승인하지 않는다. 배포는 별도 product-owner evidence가 생길 때에만
`not-attested`에서 승격한다.

2026-08-22 checkpoint의 정본은 [`LDS_CONSUMER_REGISTRY.json`](references/adoption/LDS_CONSUMER_REGISTRY.json), [`EXPRESSION_PROFILE_MATRIX.json`](references/visual/EXPRESSION_PROFILE_MATRIX.json), [`robotics/READINESS.json`](references/robotics/READINESS.json)과 각 verifier다.

---

## 0. 결정 요약

1. **단일 저장소와 분리 패키지를 유지한다.** Core·Theme·Product를 별도
   저장소로 나누지 않고 현재 모듈형 모노레포 안에서 분리된 소비 contract를
   강화한다. 개편 기간에는 세 package를 fixed version group으로 운영한다.
2. **Core와 Product는 합치지 않는다.** Core는 어느 LK 앱에서도 의미가 성립하는
   안정적인 DOM UI와 접근성 기반, Product는 여러 Core 요소를 조합한 반복 가능한
   애플리케이션 패턴을 소유한다.
3. **Product를 새 패키지로 즉시 쪼개지 않는다.** 한 `lds-product` 안에
   `Application`, `Operations`, `Workspace` 세 owner family를 두고, 실사용과
   릴리스 주기가 분리될 때만 repository/package 분리를 재심사한다.
4. **Operations Dashboard는 Product/Operations 패턴군이다.** 별도 디자인
   시스템·저장소·테마·완성 화면 template으로 만들지 않는다.
5. **일반 제품과 운영 제품의 시각 차이는 Theme 프로파일로 해결한다.** Core와
   컴포넌트 API는 한 벌로 유지하고 `default | ops` 표현 프로파일만 둔다.
6. **도메인 중립 운영 표현은 Product, 로봇 의미와 행동은 Robotics가 소유한다.**
   transport·freshness·telemetry·equipment fact의 일반 표현은
   Product/Operations, control authority·navigation·robot safety는 Robotics다.
7. **LDS3D는 현재 외부 경계를 유지한다.** 좌표·카메라·asset·renderer lifecycle은
   LDS3D, DOM chrome과 renderer-neutral frame은 Product/Workspace가 소유한다.
8. **`console-pastel`과 퇴역 Editorial은 활성 스타일 축이 아니다.** archive 또는
   migration source로만 취급하고 새 LDS 결정의 근거·동기화 owner로 사용하지 않는다.

---

## 1. 범위와 권위

### 1.1 이 계획이 바꾸려는 것

- Core·Theme·Product·Robotics의 판정 기준과 실제 owner를 일치시킨다.
- Core의 semantic theme 의존을 명시적이고 검사 가능한 계약으로 바꾼다.
- Core의 지원 public surface와 private implementation을 분리한다.
- Product를 `Application | Operations | Workspace`로 탐색·소유·릴리스 관점에서
  재구성한다.
- `default | ops` 표현 프로파일을 Theme의 정식 축으로 만든다.
- 디자인 coverage와 실제 consumer adoption을 서로 다른 증거로 관리한다.
- 제거된 aggregate, Editorial, archive reference의 남은 활성 참조를 정리한다.
- 산업 UI 지원 범위를 monitoring, operational control, safety-critical HMI로
  구분하고 과도한 지원 주장을 막는다.

### 1.2 이 계획이 바꾸지 않는 것

- 제품 route, permission, query, threshold, transport, persistence, command
  execution과 최종 화면 composition을 LDS로 옮기지 않는다.
- 하나의 일반 admin template이나 완성형 dashboard screen을 만들지 않는다.
- Core 컴포넌트를 `default`와 `ops`용으로 복제하지 않는다.
- consumer·marketing·commerce 제품 전체를 LDS v1 지원 범위로 선언하지 않는다.
- 안전 인증이나 SCADA/HMI 적합성을 컴포넌트 존재만으로 주장하지 않는다.
- 개편을 이유로 Core·Theme·Product 저장소를 분리하지 않는다.
- LDS 계획이 Robotics 또는 제품 저장소의 변경 권한을 대신하지 않는다. 외부
  package 재분류와 consumer migration은 해당 owner 승인과 그 저장소의 검증
  evidence를 받아 완료한다.

### 1.3 기존 문서와의 관계

| 문서 | 현재 역할 | 이 계획과의 관계 |
| --- | --- | --- |
| [`DESIGN.md`](../DESIGN.md) | Operations Dashboard 설계 결정 계약 | 공통 Product 범위와 Operations 전용 범위를 분리해 승격 |
| [`OPERATING_MODEL.md`](OPERATING_MODEL.md) | owner layer와 허용 의존 정책 | public/private, CSS 계약, adoption 전환을 승격 |
| [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md) | token 정본과 변경 정책 | profile 축과 token owner metadata를 승격 |
| [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) | 도메인 상태·제어·viewer 계약 | Product/Operations와 Robotics 의미 경계를 승격 |
| [`EXPRESSION_PROFILE_PROPOSAL.md`](EXPRESSION_PROFILE_PROPOSAL.md) | `default | ops` 상세 제안 | Phase 4의 입력; 채택 후 핵심 계약은 Token Governance로 이동 |
| [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md) | package split 이력과 migration wave | 물리 분리 이력은 유지하고 새 논리 경계는 이 계획이 조정 |
| [`SYSTEM_PARTITION_REFORM_PLAN.md`](SYSTEM_PARTITION_REFORM_PLAN.md) | 완료된 compat·위성·수명주기 개편 기록 | 완료 이력으로 유지; 새 layer 의미를 덧붙이지 않음 |

---

## 2. 현행 진단

### 2.1 유지할 강점

- JavaScript dependency DAG는 Core ← Theme/Product ← Robotics 방향으로 설계돼
  있다.
- Operations Dashboard를 Product pattern family로 둔 결정은 올바르다.
- Portal은 Core·Theme·Product를, Web Viz는 Core·Theme·Product·Robotics·3D를
  실제 소스에서 소비한다.
- light/dark, 320px fallback, keyboard/focus, last-good-data와 상태 의미 계약이
  존재한다.
- Robotics와 3D는 DOM UI와 전문 renderer/runtime의 경계를 실제 package로
  분리했다.

### 2.2 해결해야 할 구조 불일치

| ID | 현재 관찰 | 구조 위험 |
| --- | --- | --- |
| A-01 | [`DESIGN.md`](../DESIGN.md)는 Product를 Operations 중심, Robotics를 telemetry·map·viewer owner로 설명하지만 package 계획과 machine registry는 Product를 generic application pattern owner로 사용한다. | 사람 문서와 검사기가 서로 다른 위치로 변경을 유도한다. |
| A-02 | Core source가 참조하지만 Core가 정의하지 않고 Theme가 제공하는 CSS custom property가 2026-08-22 정적 스캔에서 136개다. | Theme provider 요구가 암묵적이고 CSS 의존은 현행 layer 검사 밖에 있다. |
| A-03 | Product가 `@lk-design-system/lds-core/components/internal/*`와 overlay helper를 직접 import하고 Core export wildcard가 이를 노출한다. | `internal` 변경이 실제 public breaking change가 된다. |
| A-04 | Core·Theme·Product가 모두 `0.1.0-rc.69.30`이고 Theme/Product가 Core exact version을 의존한다. 현재 계약은 이를 fixed release group으로 선언하고 검사한다. | package group을 임의로 분리하면 tag·artifact·consumer evidence의 release identity가 다시 어긋난다. |
| A-05 | `data-lds-profile` Theme runtime과 CSS는 구현됐다. 다만 zero-specificity ops selector를 `html`에 적용하면 Core `:root` default가 이기는 finding이 있어 Web Viz candidate는 임시로 `body`에 profile을 적용한다. | target element와 selector 우선순위에 따라 profile 출력이 달라지지 않도록 R3A에서 Theme selector 계약을 정합화해야 한다. |
| A-06 | Product는 Core보다 큰 공개 표면을 가지며 일반 control, app composition, editor/viewer, telemetry/equipment를 함께 노출한다. | `Product = Core가 아닌 모든 것`이 되어 탐색·변경·릴리스 범위가 불명확하다. |
| A-07 | `ConnectionBadge`, `EquipmentStatusCard`, `TelemetryGauge` 등의 machine owner는 Product지만 prompt 분류는 Robotics다. | 중복 API, 잘못된 package 변경, compatibility re-export 장기화 위험이 있다. |
| A-08 | Portal `c2e39f3c9f89a52cdb0c5a58727050afe20a82b9`와 Web Viz `542639f2fea109e78f052e730ac30072cad79a6c`는 Core·Theme·Product `rc.69.30`을, Web Viz는 Robotics `rc.30`도 소비한다. 기술 5 gate·clean evidence와 owner 승인은 각각 approval evidence commit `50c2d9b`·`4dad154`에 연결되어 두 stage가 `workflow-verified`다. | `workflow-verified`를 main integration, stable package 또는 production deployment로 자동 확대하면 안 된다. |
| A-09 | compatibility facade는 제거됐지만 일부 migration/governance 문서에는 유지 시기의 표현이 남아 있고, 일부 consumer는 퇴역 Editorial·archive reference를 활성 owner처럼 다룬다. | 신규 코드가 퇴역 경로를 다시 도입하고 rollback 범위가 불명확해진다. |
| A-10 | staleness, arm→fire, alarm ack/shelve/flood suppression은 Theme 프로파일로 해결할 수 없는 별도 행동 계약이다. | 산업 dashboard 지원을 safety-critical HMI 지원으로 과장하게 된다. |

위 수치는 현재 상태의 진단 snapshot이며 영구 정본이 아니다. 실행 단계에서는
source, package manifest, generated audit와 consumer report를 다시 측정한다.

---

## 3. 목표 아키텍처

### 3.1 전체 조합

```text
Product application
│
├─ @lk-design-system/lds-core
│    generic DOM UI · layout mechanics · accessibility · semantic token interface
│
├─ @lk-design-system/lds-theme
│    LK brand · semantic values · typography · default|ops expression profiles
│
├─ @lk-design-system/lds-product
│    ├─ Application  general B2B application composition
│    ├─ Operations   monitoring · investigation · operational state presentation
│    └─ Workspace    editor · viewer · renderer-neutral chrome
│
├─ @lk-design-system/lds-robotics-ui       optional
│    robot authority · control · navigation · safety semantics
│
└─ @lk-design-system/lds-3d-*              optional
     coordinate · camera · asset · renderer lifecycle
```

### 3.2 저장소와 패키지 축

| 축 | 목표 결정 | 재분리 심사 조건 |
| --- | --- | --- |
| Core·Theme·Product source | 한 저장소 유지 | 기본값. 분리 자체를 목표로 삼지 않음 |
| Core·Theme·Product package | 별도 package 유지 | 합치지 않음 |
| Product family | 한 package 안의 owner/subpath family | 독립 owner, 독립 release cadence, 2개 이상 소비자, cross-repo matrix 자동화가 모두 확인될 때만 package/repo 분리 재심사 |
| Robotics | 외부 package/repository 유지 | robot-domain owner와 독립 소비·릴리스가 이미 존재 |
| LDS3D | 외부 package/repository 유지 | renderer/runtime 경계가 DOM LDS와 다름 |
| Slides | media domain pack 유지 | 스타일 프로파일이나 Product family로 흡수하지 않음 |
| Motion | renderer-independent capability layer 유지 | Slides domain pack이나 Theme profile로 흡수하지 않음 |
| console-pastel·Editorial | archive/retired | 활성 package graph에 다시 편입하지 않음 |

### 3.3 지원 범위 표현

| 범위 | 목표 상태 | 지원 주장 |
| --- | --- | --- |
| 일반 B2B·사내 제품 | Core + Theme/default + Product/Application | 대표 workflow와 current package 증거가 있을 때 supported |
| 산업 monitoring dashboard | Core + Theme/ops + Product/Operations | freshness·offline·last-good-data 계약과 대표 consumer 검증 후 supported |
| 로봇 운영·제어 UI | 위 조합 + Robotics + 필요 시 LDS3D | product가 authority·policy·command truth를 소유하는 조건부 supported |
| consumer·marketing·commerce | 명시적 근거 없음 | unverified/out of current scope |
| safety-certified HMI·SCADA | 인증·alarm lifecycle 부재 | unsupported; 컴포넌트 보유를 근거로 주장 금지 |

### 3.4 허용 dependency DAG

```text
Core ----------------------------------------------> Core only
Theme ---------------------------------------------> Core + Theme
Product -------------------------------------------> Core + Product
Robotics ------------------------------------------> Core + Product + Robotics
Product application -------------------------------> Core + Theme + Product
Product application with robotics/spatial surface -> Core + Theme + Product + Robotics + LDS3D
LDS3D package --------------------------------------> LDS package에 의존하지 않음
```

- Theme provider는 application composition의 필수 runtime style 계약이지 Core의
  역방향 npm dependency가 아니다.
- Product와 Robotics는 semantic token interface를 소비하지만 Theme package를 직접
  import하지 않는다.
- LDS3D docs 또는 example app은 versioned LDS package를 소비할 수 있지만 LDS3D
  runtime package는 DOM LDS를 의존하지 않는다.
- Core→Theme/Product/Robotics, Theme→Product/Robotics, Product→Robotics/3D,
  LDS3D package→LDS의 역방향 edge는 허용하지 않는다.

---

## 4. 계층 소유권 모델

### 4.1 판정 매트릭스

| Owner | 포함 | 제외 | 대표 예시 |
| --- | --- | --- | --- |
| Core | domain-neutral primitive, layout, focus, keyboard, accessibility, low-level feedback | route, workflow, robot meaning, product policy | Button, Input, Select, Card, Stack, Dialog foundation |
| Theme | LK brand asset, semantic value, type, effect, appearance/profile mapping | component anatomy, state machine, command semantics | color/type/effect tokens, ThemeToggle, `default|ops` overrides |
| Product/Application | 여러 B2B 제품에서 반복되는 content·data·form·navigation composition | complete screen, backend workflow | RecordHeader, DataCollectionPanel, MessageFeed, SourceDisclosure |
| Product/Operations | domain-neutral monitoring·freshness·equipment·operation presentation | robot authority, threshold calculation, alarm policy | DashboardShell, MetricCard, ConnectionBadge, TelemetryValue, EquipmentStatusCard |
| Product/Workspace | editor/viewer DOM chrome와 renderer-neutral interaction frame | renderer lifecycle, scene math, robot map semantics | CanvasEditorShell, ViewerFrame, ViewerToolbar, Scene3DFrame |
| Robotics | robot identity, control authority, command safety, navigation/map overlay semantics | generic connection fact, generic DOM chrome, WebGL lifecycle | RobotStatusCard, ManualControlSession, Joystick, RobotPoseMarker, RouteOverlay |
| LDS3D | coordinate/frame/pose, camera, picking, GLB, WebGL/R3F/Three lifecycle | DOM panel, toolbar, product command | lds-3d-core/assets/tf/markers/three/r3f |
| Product app | routes, permissions, data truth, thresholds, transport, persistence, side effects, final composition | reusable DS contract copy | Portal, Web Viz, Control implementation |

### 4.2 판정 질문

새 public surface 또는 재분류 대상은 순서대로 판단한다.

1. 제품 route·permission·transport·side effect가 없으면 의미가 성립하지 않는가?
   - 예: Product app 소유.
2. 로봇·주행·control authority·safety vocabulary를 제거하면 의미가 깨지는가?
   - 예: Robotics 소유.
3. renderer·coordinate·camera lifecycle을 직접 소유하는가?
   - 예: LDS3D 소유.
4. 여러 Core 요소를 조합해 반복되는 사용자 작업 또는 상태 표현을 완성하는가?
   - 예: Product family 소유.
5. 어느 LK 앱에서도 같은 이름·상태·접근성 계약으로 독립 사용 가능한가?
   - 예: Core 후보.
6. 색·타입·효과·브랜드·표현 profile 값만 소유하는가?
   - 예: Theme 소유.

consumer 수는 재사용 가능성과 우선순위를 보조하는 증거지만 owner를 자동으로
결정하지 않는다. anatomy·state·접근성 의미가 domain-neutral인지가 먼저다.

### 4.3 우선 재판정 목록

| 대상 | 제안 owner | 이유 |
| --- | --- | --- |
| ConnectionBadge | Product/Operations | transport 사실만 표현하고 freshness·health·operability를 추론하지 않음 |
| BatteryGauge | Product/Operations 후보 | generic equipment energy readout; Core Meter와 중복 축은 별도 감사 |
| EquipmentStatusCard | Product/Operations | generic equipment fact composition; product state machine은 외부 소유 |
| TelemetryGauge / TelemetryValue | Product/Operations | domain-neutral numeric/unit/freshness presentation |
| ViewerFrame / ViewerToolbar / VideoStreamTile | Product/Workspace | renderer-neutral viewport chrome |
| Scene3DFrame | Product/Workspace | 3D renderer를 소유하지 않는 DOM preset |
| Map2DCanvas | Product/Workspace | generic viewport와 transform frame; robot overlay는 Robotics |
| CanvasEditorShell / editor panels | Product/Workspace | general editor chrome; robot-specific tools/data는 Robotics 또는 app |
| Link, Popover, Date/Number/Password input, Progress family | Core 재분류 감사 | domain-neutral 기본 UI에 가까우나 API·상태·consumer 사용을 개별 검증해야 함 |

재판정은 이름만 바꾸는 작업이 아니다. public API, CSS token, Storybook owner,
prompt, generated guide, package export, compatibility re-export와 소비 import를 한
변경 단위로 다룬다.

---

## 5. Core·Theme·Product package contract

### 5.1 Theme provider 계약

권장 목표는 **Core가 semantic token interface와 component mapping을 선언하고,
Theme가 그 interface의 값을 제공**하는 방식이다. 현재 LDS는 LK Theme 없이 완성된
시각 제품을 제공한다고 주장하지 않는다. 중립 palette를 Core에 추가해 두 번째
foundation을 만드는 대신, 이미 존재하는 provider 관계를 명시적이고 검사 가능한
계약으로 바꾼다.

```text
Core styles
├─ primitive/layout scale
├─ component anatomy tokens
└─ required semantic token interface

Theme styles
├─ LK semantic values: required interface implementation
├─ brand/type/effect values
└─ default|ops expression overrides
```

이 구조는 다음을 동시에 만족해야 한다.

- Core package manifest 또는 design-system manifest가 필요한 Theme contract version을
  선언한다.
- Core·Product·Robotics는 package별 `requiresSemanticContractVersion`과 required
  variable manifest를 제공하고 Theme은 `providesSemanticContractVersion`을 선언한다.
- Core CSS만 로드한 diagnostic fixture는 누락 provider를 탐지하고, 정식 consumer
  fixture는 Core 뒤에 conforming Theme을 반드시 조합한다.
- consumer matrix는 `Core+Theme`, `Core+Theme+Product`,
  `Core+Theme+Product+Robotics` 조합을 각각 검사한다.
- Core + Theme/default의 computed style과 screenshot은 개편 전 기준선과 같다.
- Theme가 Core component anatomy를 복사하지 않는다.
- semantic status 의미와 light/dark mapping은 profile과 독립적이다.
- Core가 Theme package를 역방향 npm dependency로 선언하지 않는다.

향후 Core-only visual product가 실제로 필요해지면 별도의 neutral Theme provider를
같은 contract 구현체로 제안한다. 그 요구가 확인되기 전에는 Core에 암묵적 두 번째
palette를 만들지 않는다.

### 5.2 CSS dependency와 token owner

- `tokens/source.json`에 각 token 또는 token group의 `ownerLayer`를 둔다.
- Core/Product/Theme package projection은 이름 prefix나 주석 regex가 아니라
  owner metadata로 생성한다.
- Core가 요구하는 semantic variable 목록을 generated contract로 만든다.
- Product와 Robotics가 추가로 요구하는 semantic variable도 package owner manifest에
  생성하고 동일 Theme provider와 대조한다.
- `check:layers` 또는 conformance sibling check가 JavaScript import와 함께 CSS
  variable definition/reference graph도 검증한다.
- unresolved 필수 variable, 중복 owner, 역방향 token reference를 실패로 처리한다.

### 5.3 public과 private surface

- 다른 package가 소비하는 `surface`, `density`, `dialog-focus`, `overlay-platform`
  helper는 검토 후 `headless`, `platform`, `density` 같은 명시적 supported subpath로
  승격한다.
- 진짜 internal module은 package export map에서 차단한다.
- `./components/*` wildcard가 `components/internal/*`까지 노출하지 않게 한다.
- Product source에서 금지된 Core internal deep import가 0이어야 한다.
- public 승격 API에는 types, SSR, keyboard/focus fixture와 semver 정책을 둔다.

### 5.4 dependency와 version 정책

- Core·Theme·Product는 이 개편과 stable v1 동안 **fixed version group**으로
  운영하고 release set 안에서는 exact version을 사용한다.
- 세 package를 별도로 설치·tree-shake·문서화할 수 있다는 사실을 독립 versioning과
  혼동하지 않는다.
- Robotics는 지원 Core/Product range를, LDS3D docs는 검증된 LDS package set을
  compatibility matrix에 기록한다.
- Core·Theme·Product 독립 versioning은 Product의 Core private import 0, CSS provider
  contract 안정화, minimum/current compatibility CI, 독립 변경 빈도와 owner가 모두
  확인된 뒤 별도 결정으로만 연다.
- 저장소를 나누지 않아도 package별 public API diff, deprecation, artifact checksum과
  rollback evidence를 유지한다.

이 결정이 채택되면 [`SYSTEM_PARTITION_REFORM_PLAN.md`](SYSTEM_PARTITION_REFORM_PLAN.md)의
workspace lockstep 결정이 현행 정책이 되고,
[`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md)
§7의 Core·Theme·Product non-lockstep 문장은 historical proposal로 명시한다.

### 5.5 현재 owner authority 이동

현행 owner authority가 역사 archive인 `docs/references/wds/`에 있는 상태를 끝낸다.

- current owner와 public/private classification의 새 정본:
  `docs/contracts/LAYER_OWNERSHIP.json`(제안 경로)
- schema와 검사 owner: `packages/conformance/schemas/`
- `docs/references/wds/`에는 WDS provenance와 역사 분류만 유지
- 전환 기간에는 새 contract → legacy provenance projection의 한 방향 generator만
  허용하고, legacy 파일 → 새 contract 역방향 입력은 금지한다.
- `check:layers`, documentation generator, Storybook owner audit와 package projection은
  모두 새 contract를 직접 읽는다.
- `PUBLIC_EXPORT_CLASSIFICATION.json`은 새 contract에서 생성되는 provenance
  projection으로 남기거나 current ownership field를 제거한다.
- public export, internal source module, token group, Storybook canonical page가 같은
  owner ID를 사용한다.

---

## 6. Product 내부 구조

### 6.1 family는 package가 아니라 owner taxonomy다

초기 개편은 기존 `@lk-design-system/lds-product` public API를 바꾸지 않고 모든
Product export에 다음 canonical owner family metadata를 부여하는 작업이다.

```text
application
operations
workspace
```

- 모든 Product public export는 세 family 중 정확히 하나의 primary family를 갖는다.
- Storybook과 generated component guide는 family 기준으로 탐색한다.
- family 간 공유 helper는 Product internal 또는 하위 Core public primitive로 두며
  복제하지 않는다.
- 현재 root와 component direct subpath는 그대로 유지한다.

아래 public subpath는 taxonomy 정착 후 실제 consumer가 family 단위 설치·문서·bundle
경계를 요구할 때 여는 **후속 additive API 후보**다. 이 계획만으로 영구 public
surface를 확정하지 않는다.

```text
@lk-design-system/lds-product/application
@lk-design-system/lds-product/operations
@lk-design-system/lds-product/workspace
```

### 6.2 Application 디자인 계약 보강

현재 Operations 중심인 [`DESIGN.md`](../DESIGN.md)만으로 일반 Product surface를
설명하지 않는다. 다음을 별도 절로 승격한다.

- primary persona: B2B knowledge, catalog, configuration, administration user
- jobs: find, inspect, compare, create/edit, recover, understand provenance
- composition: record detail, data collection, communication, guided task
- voice: precise·calm·dependable을 유지하되 control-room vocabulary를 강제하지 않음
- representative consumer: Portal의 실제 package 소비 workflow
- 비범위: marketing landing page, commerce merchandising, social consumer feed template

### 6.3 Operations 디자인 계약 유지·축소

Operations Dashboard는 다음만 공유한다.

- shell, scope/entity, attention/freshness, investigation, recovery composition
- monitoring state presentation과 density/profile 선택
- last-good-data와 narrow fallback

KPI formula, alarm policy, transport, permission, command execution, complete dashboard
screen은 계속 제품 소유다.

---

## 7. Theme 표현 프로파일

### 7.1 축과 선택

```html
<!-- default는 생략 가능 -->
<html data-lds-profile="default">

<!-- 운영 제품 -->
<html data-lds-profile="ops">
```

`data-theme="light|dark"`와 `data-lds-profile="default|ops"`는 직교 축이다.

### 7.2 profile이 바꾸는 것

- component density와 row/control spacing
- decorative elevation과 hover lift
- transition duration·distance·easing의 표현 강도
- data readout의 tabular numeral과 숫자 hierarchy
- panel·toolbar의 compact component token mapping

### 7.3 profile이 바꾸지 않는 것

- component public API와 DOM anatomy
- semantic status 의미와 상태 이름
- brand primary color와 contrast 기준
- keyboard, focus, hit target, reduced-motion 계약
- route, permission, threshold, freshness 계산, command policy
- Robotics·LDS3D domain contract

### 7.4 구현 규칙과 gate

- `default`는 profile 도입 직전 LDS 기준선을 그대로 보존한다.
- `ops`는 Theme token override 한 장으로 시작하며 component fork를 금지한다.
- component가 profile token을 소비하지 못하면 먼저 component-token indirection을
  보강하고 제품 CSS override를 추가하지 않는다.
- Storybook toolbar에서 profile과 theme를 독립 선택한다.
- 최소 회귀 matrix는 `default|ops × light|dark × normal|320px`다.
- 대표 Application story와 Operations story가 같은 Core API로 각 profile에서
  통과해야 한다.

---

## 8. 산업 행동 계약과 지원 단계

표현 profile과 domain behavior를 같은 변경으로 오해하지 않는다.

### 8.1 지원 단계

| 단계 | LDS 책임 | 완료 조건 |
| --- | --- | --- |
| O1 Monitoring | 연결, freshness, loading/error/offline, last-good-data 표현 | Web Viz 대표 monitor workflow와 current package 검증 |
| O2 Operational control | authority, eligibility, preflight, request→accepted→applied→confirmed 구분 | Robotics + 제품 fixture에서 위험·실패·timeout 상태 검증 |
| O3 Alarm management | alarm list, acknowledge, shelve, suppression/flood presentation | 별도 product evidence와 alarm semantics 계약 |
| O4 Safety-certified HMI | 제품·조직 인증 범위 | LDS 단독 범위 밖; 별도 안전·규제 프로그램 없이는 지원 주장 금지 |

### 8.2 우선 행동 트랙

1. **Freshness**: streaming 값은 관측 시각 또는 age를 갖고, stale 값을 현재값처럼
   표시하지 않는다. transport와 freshness를 분리한다.
2. **Consequential command**: command eligibility, arm, fire, transport acceptance,
   target application과 independent confirmation을 분리한다.
3. **Alarm lifecycle**: active, acknowledged, shelved, suppressed와 cleared를 별도
   의미로 정의한다. threshold와 실제 alarm truth는 제품이 계산한다.
4. **Evidence retention**: 중요한 operation 결과는 toast 소멸 뒤에도 history 또는
   result surface에서 확인 가능해야 한다.

이 트랙은 새 컴포넌트 목록을 선결하지 않는다. 먼저 semantic contract와 제품
workflow evidence를 승인한 뒤 기존 Core/Product/Robotics 조합으로 해결 가능한지
판정한다.

---

## 9. 소비 증거와 지원 판정

### 9.1 coverage와 adoption 분리

| 증거 | 답하는 질문 | 정본 |
| --- | --- | --- |
| Design coverage | 제품 workflow 요구를 LDS가 어떻게 지원하거나 제외하는가? | `references/product-frontends/COVERAGE_AUDIT.json` |
| Package release | 고정 LDS package set이 RC/stable인지, artifact/tag를 실제 사용할 수 있는가? | consumer registry의 `packageRelease`와 LDS release evidence |
| Consumer adoption | 어떤 제품 SHA가 어떤 LDS package/version을 설치·build·workflow 검증했는가? | consumer registry entry와 product-owner attestation |
| Production deployment | 어느 환경에 rollout 준비·배포·rollback했는가? | 제품 release evidence; LDS 추정 금지 |

### 9.2 중앙 consumer registry

`docs/references/adoption/LDS_CONSUMER_REGISTRY.json`과 schema가 현재 consumer
evidence register다. 승격 의미와 갱신 절차는
[`CONSUMER_ADOPTION_PROMOTION_CONTRACT.md`](references/adoption/CONSUMER_ADOPTION_PROMOTION_CONTRACT.md)가
소유한다. Registry는 다음 세 판정을 독립된 축으로 기록하며 어느 하나도 다른 축을
자동 승격하지 않는다.

- package release: `release-candidate | stable` channel과 `not-attested | verified` availability
- consumer adoption: `wired | build-verified | workflow-verified` stage
- product deployment: `not-attested | rollout-ready | deployed | rolled-back` status

각 consumer row는 최소 다음을 포함한다.

- product ID, repository, commit SHA, frontend root
- 사용 package별 version·artifact checksum
- profile과 theme 지원 범위
- 적용 surface와 제외 surface
- install, production build, workflow smoke, accessibility/viewport evidence
- 별도 production deployment 상태와 product-owner rollback source
- captured/reviewed timestamp, attestation과 evidence path
- stage: `wired | build-verified | workflow-verified`
- evidence freshness: `current | stale`과 stale reason

design coverage의 `verified`를 adoption의 `workflow-verified`로 자동 승격하지 않는다.
`workflow-verified`는 current v2 attestation, install·source·production build·대표
workflow·accessibility 통과, exact source commit의 clean-clone 재현과 product-owner 승인을
모두 요구한다. Package version, product commit 또는 evidence checksum이 달라지면 기존
evidence를 current로 재사용할 수 있는지 product owner가 다시 판정하며, `stale` evidence는
checker를 통과하지 못한다. 소비 제품 owner가 source report와 build/workflow/deployment
truth를 소유하고 LDS는 그 evidence를 임의로 재작성하지 않는다.

clean LDS clone은 외부 working tree에 의존하지 않는다. consumer CI가 발행한 immutable
attestation snapshot 또는 승인된 dispatch artifact를 LDS에 입력하고, workspace의
canonical active-consumer inventory와 대조한다. `check:adoption-registry`는 clean clone에서
schema, RC/stable identity, stage별 필수 evidence, package/version/SHA 일치와 freshness를
검증한다. `--workspace-root` 검증은 실제 consumer artifact checksum·source wiring·evidence
파일까지 대조하며, active inventory에 있으면서 registry에 없는 LDS dependency consumer를
실패로 처리한다.

### 9.3 대표 소비자 gate

- Application/default: LK Portal의 current package 업그레이드 + 대표 record/data/form
  workflow
- Operations/ops: LK Web Viz의 current package 업그레이드 + monitor/viewer workflow
- Robotics: Web Viz 또는 Control의 Robotics control/navigation workflow
- 3D: LDS3D docs와 실제 consumer의 version matrix

stable 지원 주장은 해당 축의 대표 소비자가 current candidate로 install, production
build와 workflow smoke를 모두 통과한 뒤에만 허용한다.

---

## 10. 단계별 실행 계획

### Phase 0 — 제안 승인과 기준선 고정

**작업**

- 이 계획의 결정 요약과 비범위를 applicable approver가 승인한다.
- 현행 public export, owner, CSS variable graph, package version, consumer pin과
  screenshot/computed-style 기준선을 캡처한다.
- 각 단계 owner와 변경 단위를 확정한다.

**완료 gate**

- 기준선 artifact가 commit SHA와 함께 존재한다.
- 계획 revision과 결정별 승인 기록이 존재한다. package/provider/public API는 Frontend
  Platform, Robotics owner 이동은 Robotics domain owner, consumer migration은 해당
  product owner 승인을 포함한다.
- `default` visual parity와 current consumer rollback source가 식별된다.
- 승인되지 않은 shared token value 변경이 없다.

### Phase 1 — 권위와 소유권 정규화

**작업**

- live layer ownership authority를 WDS archive 밖으로 이동한다.
- Product/Application·Operations·Workspace와 Robotics 판정표를 machine contract로
  만든다.
- prompt, DESIGN, Storybook, generated guide의 owner 충돌 목록을 확정한다.
- compatibility aggregate의 removed/retained 문서 모순을 하나의 상태로 정리한다.

**완료 gate**

- 모든 public export와 internal module은 primary owner가 정확히 하나다.
- machine owner와 canonical human contract의 충돌이 0이다.
- Robotics를 오가는 owner 변경은 Robotics domain owner가 승인했다.
- `check:layers`, docs generator, Storybook owner audit가 새 contract를 읽는다.
- WDS archive는 현재 owner 결정의 입력이 아니며, 새→legacy projection drift와
  legacy→new 역방향 입력이 모두 0이다.

### Phase 2 — Core·Theme contract 복구

**작업**

- required semantic token interface와 Theme provider contract를 도입한다.
- token owner metadata 기반 package projection으로 바꾼다.
- CSS variable graph 검사를 추가한다.
- supported Core public helper를 승격하고 private internal export를 닫는다.

**완료 gate**

- diagnostic fixture가 Theme provider 누락을 결정적으로 탐지한다.
- `Core+Theme`, `Core+Theme+Product`, `Core+Theme+Product+Robotics` fixture에서
  package별 required semantic variable 누락과 provider version mismatch가 0이다.
- Core+Theme/default가 pre-change visual/computed-style 기준선과 일치한다.
- Product의 금지된 Core internal import가 0이다.
- JS와 CSS layer graph가 모두 통과한다.

### Phase 3 — Product taxonomy와 조건부 additive API

**작업**

- Application·Operations·Workspace canonical family를 배치한다.
- Storybook/guide 탐색 구조를 family metadata로 제공한다.
- Product→Core 후보와 Product↔Robotics 후보를 component workflow로 재판정한다.
- public family subpath는 consumer 요구와 API owner 승인을 별도 기록한 경우에만
  additive로 연다.
- Robotics를 오가는 재분류는 Robotics domain owner의 승인을 받는다.

**완료 gate**

- 모든 Product public export가 정확히 하나의 family를 가지며 미분류·중복이 0이다.
- package owner, family, prompt, Storybook canonical page의 충돌이 0이다.
- 기존 supported import fixture가 통과하고, public family subpath를 실제 추가한
  경우에만 해당 subpath install/import/type fixture를 요구한다.
- complete product screen이나 route가 Product pattern으로 편입되지 않는다.

### Phase 4 — `default | ops` 프로파일

**작업**

- default 기준선을 token contract로 고정한다.
- ops density·motion·depth·numeric override를 Theme에 구현한다.
- Storybook toolbar와 profile/theme/viewport regression matrix를 연결한다.
- Portal/default, Web Viz/ops integration candidate는 해당 product owner와 함께
  만들고 LDS는 필요한 package/profile fixture와 evidence contract를 제공한다.

**완료 gate**

- `data-lds-profile` runtime fixture가 존재한다.
- attribute 생략과 `data-lds-profile="default"`의 computed style이 동등하다.
- default visual regression이 승인된 차이 외 0이다.
- ops override는 승인된 density·motion·depth·numeric whitelist에만 존재하며
  color/status semantic token override는 0이다.
- ops profile의 필수 token assertion이 누락 없이 통과한다.
- ops가 제품-local foundation override 없이 대표 Operations story를 구성한다.
- 두 profile이 동일한 component API·DOM·a11y contract를 사용한다.
- `default|ops × light|dark × normal|320px` 전 조합에서 visual, keyboard, focus와
  reduced-motion 회귀가 0이다.

### 병렬 readiness Track R — 산업 행동 계약

이 Track은 Phase 2 이후 Phase 3~5와 병렬로 진행할 수 있다. 완료 여부는
`operations-dashboard-ready` 또는 `operational-control-ready` 지원 주장에 영향을
주지만, 계층·package·profile 개편 자체의 완료를 직렬 차단하지 않는다.

**작업**

- freshness와 transport 의미를 분리해 contract와 fixture로 고정한다.
- command lifecycle과 control authority 조합을 Robotics/Product/app 경계에 맞춘다.
- alarm management는 실제 제품 근거가 확보된 경우 별도 authoring track으로 연다.

**해당 readiness 주장 gate**

- O1/O2 지원 주장이 representative workflow evidence와 연결된다.
- stale/unknown/offline/last-good-data가 색상 외 정보로 구분된다.
- accepted/applied/confirmed가 하나의 success 상태로 합쳐지지 않는다.
- 알람 근거가 없으면 O3는 명시적으로 `unverified`로 남는다.

### Phase 5 — 소비자 업그레이드와 legacy 일몰

**작업**

- Portal과 Web Viz product owner가 candidate package set 업그레이드와 source
  adoption report를 소유하고, LDS는 요구 version/profile과 evidence contract를
  제공한다.
- 중앙 consumer registry를 단일 generator로 제품 evidence에서 생성한다.
- 퇴역 aggregate·Editorial import와 `console-pastel` active sync-owner 참조를
  owner 제품의 승인 범위에서 제거한다.
- Core·Theme·Product fixed release set과 satellite compatibility matrix를 확정한다.

**완료 gate**

- 대표 Application·Operations consumer가 install + production build + workflow
  smoke를 통과하고 각 product owner가 evidence를 승인한다.
- registry schema/generator/check가 manifest·lock·repo SHA·evidence checksum mismatch를
  stale로 판정한다.
- clean-clone `check:adoption-registry`가 immutable consumer attestation과 canonical
  active-consumer inventory를 대조하고 미등록 active LDS dependency를 차단한다.
- 등록 consumer의 retired package import가 0이다.
- compatibility 문서, package graph, conformance 진단이 같은 상태를 말한다.
- stable promotion·rollback artifact와 지원 matrix가 존재한다.

---

## 11. 호환성과 rollback

- family subpath를 실제 도입하는 경우 additive로 열고 root export를 즉시 제거하지
  않는다.
- component owner 이동은 먼저 새 owner export + old owner deprecation/re-export,
  다음 consumer migration, 마지막 legacy removal 순서로 진행한다.
- owner 이동 compatibility row는 deprecation ledger에 `introducedIn`,
  `removeNotBefore`, `replacement`, affected consumer와 support window를 기록한다.
- removal은 등록 consumer의 old import 0, 최소 support window 충족, breaking release
  note와 rollback artifact가 모두 있을 때만 허용한다. 완료 시점에 남은 row는 만료일과
  owner가 있는 open debt로 명시한다.
- `default`는 기존 제품에 opt-out 없이 동일하게 적용되고 `ops`는 opt-in으로 시작한다.
- profile 도입이 실패하면 root attribute를 제거하는 것으로 default 기준선에 복귀할
  수 있어야 한다.
- Theme provider 계약화 과정에서 Core+Theme 기존 출력이 바뀌면 rollback한다.
- fixed version group 해제는 독립 versioning 승인과 minimum/current matrix가
  없으면 시도하지 않는다.
- archive/legacy 정리는 소비 제품의 vendored runtime 자산을 무단 삭제하지 않고,
  active owner 설명과 신규 동기화 경로부터 차단한다.

---

## 12. 위험과 완화

| 위험 | 완화 |
| --- | --- |
| taxonomy 변경이 대규모 API rename으로 번짐 | 먼저 metadata·Storybook 분류만 완료하고 public subpath는 별도 consumer evidence가 있을 때만 additive로 도입 |
| Theme provider 계약화가 기존 출력을 바꿈 | token 값은 유지하고 computed-style + screenshot 기준선을 Phase 0에 고정 |
| ops profile이 두 번째 component set이 됨 | token-only override와 동일 DOM/API gate 적용 |
| Product/Robotics 이동이 cross-repo release를 강제 | deprecation re-export와 compatibility matrix를 먼저 제공 |
| 문서만 바뀌고 machine owner가 낡음 | Phase 1 완료 조건에 단일 machine authority 포함 |
| coverage를 adoption으로 오판 | registry stage·freshness와 evidence type을 분리 |
| 새 거버넌스가 유지보수 비용만 늘림 | 기존 검사를 대체·통합하고 동일 사실의 수동 문서 복제를 금지 |
| 일반 제품 지원이 consumer UI 전반으로 확장됨 | Application 지원 범위와 비범위를 DESIGN에 명시 |
| 산업 dashboard가 safety HMI로 오해됨 | O1~O4 지원 단계와 unsupported claim을 문서·release note에 표시 |

---

## 13. 결정 승격과 문서 수명주기

이 계획은 완료 후 별도 architecture 정본으로 남지 않는다. 채택된 결정은 아래
durable 문서로 승격하고, 이 파일은 비규범 implementation record로 보존하거나
archive/delete한다. 제안이 active인 동안에는 top-level `docs/README.md`에 연결된
working plan으로만 유지한다.

| 결정 | durable owner |
| --- | --- |
| 일반 B2B + Operations 이중 제품 범위, 공통/비범위 | [`DESIGN.md`](../DESIGN.md) |
| layer owner, dependency, public/private, version contract | [`OPERATING_MODEL.md`](OPERATING_MODEL.md) |
| semantic token interface, Theme provider, token owner, `default|ops` profile | [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md) |
| Product/Operations와 Robotics 의미·행동 경계 | [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) |
| component별 실제 owner·API·상태 | component prompt, declaration, generated guide |
| migration import와 rollback | [`PACKAGE_MIGRATION_GUIDE.md`](PACKAGE_MIGRATION_GUIDE.md) |
| consumer status | adoption registry와 소비 제품 evidence |
| 릴리스·위성 matrix | [`OPERATIONS.md`](OPERATIONS.md)와 generated pin report |

모든 Phase가 끝나면 이 문서를 `Completed implementation record`로 보존할지,
durable 결정 승격 후 archive/delete할지 문서 수명주기 정책에 따라 판정한다.

---

## 13.1 2026-08-22 구현 checkpoint

이번 개편에서 실제로 닫힌 항목과 의도적으로 남긴 경계를 분리한다.

| 영역 | 결과 | 검증 |
| --- | --- | --- |
| Theme profile | `default|ops` runtime/provider, token whitelist와 required assertions | `check:expression-profile`, `check:expression-profile-visual` — 32 captures |
| Application consumer | Portal `default` source `c2e39f3c9f89a52cdb0c5a58727050afe20a82b9`, Core·Theme·Product `0.1.0-rc.69.30`; 기술 5 gate·clean-clone·product/design-system owner 승인 통과, approval evidence commit `50c2d9b`, `workflow-verified` | [`LDS_CONSUMER_REGISTRY.json`](references/adoption/LDS_CONSUMER_REGISTRY.json) |
| Operations consumer | Web Viz `ops` source `542639f2fea109e78f052e730ac30072cad79a6c`, Core·Theme·Product `0.1.0-rc.69.30`, Robotics `0.1.0-rc.30`; 기술 5 gate·clean-clone·product/design-system owner 승인 통과, approval evidence commit `4dad154`, `workflow-verified` | registry + Web Viz adoption verifier |
| Robotics readiness | O1 Monitoring/O2 Operational control ready; representative Storybook browser gate 8 stories/0 serious Axe; O3 unverified; O4 unsupported | [`robotics/READINESS.json`](references/robotics/READINESS.json), `check:robotics-readiness` |
| Legacy active references | aggregate, retired Editorial, console-pastel active source/config reference 0 | `check:legacy-active --workspace-root=...` |
| R2 consumer promotion | 두 representative consumer의 owner approval과 중앙 registry stage 승격 완료 | `workflow-verified`; deployment는 별도 `not-attested` 유지 |

현재 두 consumer의 `workflow-verified`는 install/build뿐 아니라 workflow/accessibility,
clean-clone과 필수 owner 승인까지 연결된 adoption 판정이다. 이를 main integration, package
stable, rollout, 제품 배포 완료 또는 safety certification으로 해석하지 않는다.

---

## 14. 완료 정의

이 개편은 다음 조건을 모두 실제 artifact로 증명해야 완료다.

- [x] Core·Theme·Product는 한 저장소의 별도 package로 유지된다.
- [x] 모든 public export, internal module, token group, canonical Storybook page가
      현재 owner authority에서 정확히 하나의 owner를 갖는다.
- [ ] Product/Application·Operations·Workspace family와 Robotics·LDS3D 경계가
      owner metadata·문서·코드·Storybook에서 일치하며 Product 미분류 export가 0이다.
- [ ] Theme provider 누락 진단과 Core+Theme·Product·Robotics 조합 fixture가 모두
      유효하고 기존 default 출력이 보존된다.
- [ ] Product가 Core private/internal path를 소비하지 않는다.
- [x] `default | ops`가 Theme runtime 축으로 동작하며 동일 Core API를 사용한다.
- [x] Portal/default와 Web Viz/ops의 current package install, production build,
      representative workflow smoke와 accessibility/clean-clone evidence는 generated 중앙
      registry에 연결됐고, 2026-08-22 product/design-system owner 승인까지 연결되어 두
      consumer가 `workflow-verified`다. deployment는 별도 `not-attested`다.
- [x] O1~O4 readiness stage와 evidence freshness가 명시되며, Track R 미완료 단계는
      지원으로 주장되지 않는다.
- [x] 제거된 aggregate, Editorial, archive reference의 활성 신규 소비 경로가 0이다.
- [ ] owner 이동 compatibility re-export는 제거 조건을 충족해 종료됐거나 owner·기한이
      있는 open deprecation debt로 등록돼 있다.
- [ ] Core·Theme·Product fixed release set과 satellite compatibility matrix가 green이다.
- [ ] 채택된 결정이 기존 durable 문서로 승격되고 이 계획의 lifecycle이 정리된다.

계획 작성, 일부 코드 이동, 새로운 Phase 착수 또는 좁은 Storybook 검증만으로 위
전체 완료를 주장하지 않는다.
