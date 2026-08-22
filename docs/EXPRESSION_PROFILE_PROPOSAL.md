# 표현 프로파일 제안 — 하나의 Core, 두 개의 얼굴

| Field | Value |
| --- | --- |
| Type | Adopted implementation record |
| Status | Adopted — Theme runtime/provider·token contract·Storybook matrix·대표 소비자 profile wiring 완료; 행동 readiness는 별도 단계로 판정 |
| Owner | Design system owner |
| Last reviewed | 2026-08-23 |
| 선행 문서 | [`OPERATING_MODEL.md`](OPERATING_MODEL.md)(레이어 소유권) · [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md)(토큰 변경 정책) · [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md)(도메인 상태 의미) |
| 근거 | 전부 실측 — 본문 §1의 토큰 값과 컴포넌트 인용은 2026-08-16 HEAD 기준 |
| Current roadmap | [`LDS_ROADMAP.md`](LDS_ROADMAP.md) — R3A Done · R4 stable Done; continuous coverage는 machine gate가 소유 |

이 문서의 명제는 하나다 — **LK 제품은 소비자 표면(Portal)과 관제 표면(Control·Web
Viz)을 동시에 가지며, 이 차이는 컴포넌트 이중화가 아니라 Theme 레이어의 표현
프로파일 축으로 흡수한다.**

이 제안의 1차 구현과 R3A 밀도·selector 고도화는 완료됐다. 앞으로 새 component가 생길 때의
coverage와 회귀 관리는 machine contract와 continuous gate가 소유하며, 이 문서에 별도 backlog를
중복하지 않는다.

---

## 1. 문제 정의

### 1.1 LDS 표현값의 혈통은 소비자 UI다

LDS의 시각 언어는 채용 플랫폼(WDS)의 소비자용 디자인에서 왔다. 관제·산업 UI의
참조 기준은 데이터 밀도 중심 시스템과 산업 HMI 원칙(정상=무채색, 움직임=정보,
staleness 상시 노출)인데, 현행 토큰에는 소비자 혈통이 그대로 남아 있다. 실측:

| 항목 | 현행값 | 소비자 UI로서 | 관제 UI로서 |
| --- | --- | --- | --- |
| 본문 타이포 | `--body1-size: 16px` / 행간 24px, base 본문은 ~1.7 행간("for calm", `tokens/typography.css` 주석) | 적정 — 읽는 호흡 | 과다 — 감시 밀도를 깎음. 관제 기준선은 12–14px, 행 높이 24–28px |
| 카드 모션 | `--component-card-hover-transform: translateY(-4px)`, NewsCard 이미지 `scale(1.03)` | 적정 — 상호작용의 즐거움 | 노이즈 — 감시 시야에서 움직임은 데이터 변화·알람에만 허용 |
| 그림자 | `--shadow-xl: 0 40px 80px` 등 대형 연질 스케일(`tokens/effects.css`) | 적정 — 공중부양감 | 부적합 — 어두운 관제실·산업 모니터에서 뭉개짐. 평면 + 1px 경계선이 기준 |
| 컨트롤 높이 | 버튼 32/40/48px | 적정 | 과다 — 관제 컨트롤은 ~30px급 압축이 기준 |

### 1.2 산업화는 이미 시작됐는데, 원칙 없이 산발적으로 일어났다

아래 결정들은 전부 관제 UI 방향으로 옳았지만 각각 따로 내려졌고, 이를 묶는 상위
원칙 문서가 없다:

| 이미 일어난 것 | 위치 |
| --- | --- |
| 버튼 모션 전면 제거 (`--component-button-transition: none`, transform none) | `tokens/components.css` |
| "정상은 무채색, 색은 이상에만" — play 단언으로 집행 | 상태 배지 계약 |
| tabular-nums | `tokens/base.css`, MetricCard 계열 |
| staleness·연결 상태 개념 | `ConnectionBadge` 등 robotics 컴포넌트 |
| density 변형 | Card 계열, RobotStatusCard |

원칙이 없어서 같은 시스템 안에서 버튼은 정지해 있는데 카드는 떠다니고, 숫자는
tabular인데 그림자는 80px다. 문제는 일관성 위반이 아니라 **"어느 표면의 기준을
따르는가"라는 질문에 답이 없는 것**이다.

### 1.3 두 표면은 둘 다 실제 수요다

| 제품 | 표면 성격 |
| --- | --- |
| LK Portal | 소비자형 — 여백·호흡·브랜드 표현이 가치 |
| LK Control Full Daedeok · LK Web Viz | 관제형 — 밀도·상태 우선·모션 절제가 가치 |

한쪽 기준으로 통일하면 다른 쪽 제품이 손해를 본다. 따라서 이것은 "어느 쪽이
옳은가"의 문제가 아니라 **축의 문제**다.

## 2. 결정 — 표현 프로파일 축

### 2.1 구조

```
Core (lds-core)          컴포넌트·API·상태 의미론: 한 벌. 갈라지지 않는다
  └─ 표현은 component 토큰을 통해서만 소비

Theme (lds-theme)        표정의 집. 갈라지는 유일한 지점
  ├─ default 프로파일 = 현행값 (재앵커링으로 동결되는 LDS 자기 기준)
  └─ ops 프로파일     = HMI 원칙으로 재정의한 오버라이드 한 장

앱 (제품이 선택)
  ├─ LK Portal        → 루트 data-lds-profile="default" (생략 가능)
  └─ LK Control/Viz   → 루트 data-lds-profile="ops"
```

메커니즘은 다크모드와 동일하다 — `tokens/effects.css`가 다크에서 그림자 값을
통째로 교체하는 그 방식의 축을 하나 더 쓴다. 앱은 루트 속성 하나로 얼굴을
고르고, 컴포넌트 코드는 바뀌지 않는다.

### 2.2 ops 프로파일이 바꾸는 것

| 축 | default (현행 동결) | ops |
| --- | --- | --- |
| 밀도 | body1 16px 기준, 버튼 32/40/48 | 기준 타이포 한 단계 압축(label1 14px급), 컨트롤·행 높이 압축 |
| 모션 | 카드 hover 부양, 이미지 줌 | 장식 모션 무효화 — 움직임은 데이터 변화·알람에만 |
| 깊이 | 대형 연질 그림자 | 평면 + 1px 경계선 스케일 |
| 숫자 | tabular-nums 부분 적용 | 전면 기본 — 스트리밍 값의 폭 흔들림 금지 |

### 2.3 ops 프로파일이 건드리면 안 되는 것

- **색·상태 토큰 전체.** "정상은 무채색" 원칙은 프로파일 무관 불변이다. 상태
  의미론이 표면에 따라 달라지는 순간 같은 시스템이 아니다.
- **컴포넌트 API·상태·접근성 계약.** 프로파일은 표현값만 소유한다.

### 2.4 소유권

- 프로파일은 **Theme 레이어 소유**다. 위성이 아니다 — 위성 수명 계약상 위성은
  도메인 팩이거나 능력 레이어인데, 프로파일은 순수 표현이다.
- robotics-ui는 ops를 **기본 렌더 문맥으로 선언**만 한다. 자기 토큰 재정의는
  역방향 의존 금지에 걸린다.
- 컴포넌트는 단계(어떤 토큰을 쓰는가)를 소유하고, 매체(제품)가 값(어느
  프로파일인가)을 소유한다 — Editorial 램프 재지정과 같은 경계 원리다.

## 3. 게이트

새 게이트는 두 개면 충분하다:

| 게이트 | 단언 |
| --- | --- |
| ops 오버라이드 화이트리스트 | ops.css가 재정의하는 토큰 이름이 명시된 목록 안에 있다 — 색·상태 토큰 재정의를 기계로 차단 |
| ops 필수 항목 | "ops면 반드시 이래야 함" 목록 — 카드 모션 무효화, tabular-nums 전면화 등 |

기존 치수 baseline 기계는 default 프로파일에만 적용한다. 재앵커링이 동결하는
값이 곧 default이므로 추가 장치가 필요 없다.

## 4. 현재 구현 증거와 지원 경계

프로파일 축은 이제 문서 제안이 아니라 실제 소비·검증 경로다.

| 증거 | 현재 결과 |
| --- | --- |
| Theme runtime | `LdsProvider`가 `default|ops`를 선택하고 `data-lds-profile`을 설정한다. |
| 대표 소비자 | Portal/default `949a1261e8f61842a42d07ca4b62c7ff71cc45da`와 Web Viz/ops `8f493fd3475eb6c7516fdf7d3aca3265c2b7db87`가 Core·Theme·Product stable `0.1.0`을 실제 registry tgz로 검증했고, Web Viz는 Robotics `0.1.0-rc.33`도 함께 고정했다. |
| 시각 회귀 | [`EXPRESSION_PROFILE_MATRIX.json`](references/visual/EXPRESSION_PROFILE_MATRIX.json)이 `default|ops × light|dark × normal|320px × 4 stories` 32개 capture를 보존한다. |
| 소비자 registry | [`LDS_CONSUMER_REGISTRY.json`](references/adoption/LDS_CONSUMER_REGISTRY.json)이 package pin, artifact checksum, repo SHA, 기술 5 gate와 clean-clone evidence를 보존한다. |
| active legacy guard | `check:legacy-active`가 aggregate·Editorial·console-pastel의 활성 소스 참조를 0으로 확인한다. |

현재 registry stage는 두 소비자 모두 `workflow-verified`다. workflow/accessibility를
포함한 기술 5 gate와 clean-clone 재현에 더해 Portal stable approval evidence
`b48795660c85698b1326ae48c12bdaf92e5a25e3`, Web Viz stable approval evidence
`301970943d9e2c72c8e78e6ebb7f2246377d456f`가 2026-08-23 product/design-system owner
승인을 기록한다. 이 승인은 exact stable consumer adoption에만 해당하며 main integration,
rollout 또는 production deployment를 승인하지 않는다. production deployment는 별도
product-owner evidence가 없어 `not-attested`다.

R3A에서 Theme의 HTML-root selector를 Core `:root`와 정합화했고, Web Viz는
`<html data-lds-profile="ops">`를 사용하도록 전환했다. Full-surface verifier는 HTML root profile을
필수로 하고 body-level workaround를 금지하며, production build와 대표 Playwright workflow가
같은 계약을 검증한다.

## 5. 프로파일로 풀 수 없는 것 — 행동 트랙

아래는 스킨이 아니라 **행동**이라 토큰 오버라이드로 해결되지 않는다. 별도
후속 트랙으로 명시하고 이 문서는 범위에서 제외한다:

1. **staleness 상시 표시** — "스트리밍 값은 나이를 가진다"를 Product 레이어
   계약으로 승격 (씨앗: ConnectionBadge)
2. **arm→fire 2단계 명령** — 위험 명령 패턴 계약화 + play 단언 (씨앗:
   ManualControlSession의 비상정지 개념)
3. **알람 워크플로(ack/shelve/홍수 억제)** — 현재 부재, 신규 컴포넌트 트랙

## 6. 실행 순서

| 단계 | 내용 | 선행 조건 |
| --- | --- | --- |
| 0 | LDS 재앵커링 — default 값의 자기 기준 동결 | 완료 (`0.1.0-rc.69.19`) |
| 1 | 표현 프로파일 원칙을 이 문서에서 확정, `OPERATING_MODEL.md` 소유권 표에 프로파일 행 추가 | 완료 — runtime contract와 machine contract 반영 |
| 2 | ops 토큰 오버라이드 작성 + 화이트리스트·필수 항목 게이트 | 완료 — `tokens/profiles.css`, `check:expression-profile` |
| 3 | Storybook 프로파일 토글과 profile/theme/viewport 회귀 matrix 연결 | 완료 — 32 capture, `check:expression-profile-visual` |
| 4 | Portal/default·Web Viz/ops 대표 소비자 wiring과 adoption promotion | 완료 — stable `0.1.0` 재검증과 owner approval evidence 연결, registry `workflow-verified`; deployment `not-attested` |
| 5 | 행동 트랙(§5) 착수 판단 — 각각 독립 제안으로 | Conditional — O1/O2 ready; O3 unverified, O4 unsupported |

## 7. 비범위 (명시적으로 하지 않는 것)

- 컴포넌트 이중화 — Core는 한 벌이다. "ops용 Button" 같은 분기는 이 제안의
  실패 조건이다.
- 위성 신설 — 프로파일은 패키지가 아니다.
- 색 체계 변경 — 무채색 정상 원칙은 이 제안 이전부터 있었고 프로파일과 무관하게
  유지된다.
- 소비자 표면의 재설계 — default는 현행값 동결이지 개선 트랙이 아니다.
