# Alarm lifecycle contract

| Field | Value |
| --- | --- |
| Type | Contract |
| Status | Active · LDS-side contract for roadmap R5 (O3). O3 readiness stays `unverified` until a product supplies persisted evidence. |
| Owner | LDS Product owner · Robotics domain owner |
| Since | 2026-09-09 |
| Machine authority | [`references/robotics/READINESS.json`](references/robotics/READINESS.json) (O3 stage), [`references/product-frontends/COVERAGE_AUDIT.json`](references/product-frontends/COVERAGE_AUDIT.json) (WF-17) |

이 문서는 운영 알람 한 건이 **발생 → 확인 → (보류·상위 보고) → 해제**로 움직일 때 LDS가 소유하는 **표시·상호작용 계약**을 고정한다. 알람 진실(무엇이 알람인가), 전이 정책(누가 언제 확인·보류·해제할 수 있는가), 확인 기록의 영속 저장, 사이렌·음성, 원격 명령 전송은 제품이 소유한다. LDS는 상태를 만들어 내지 않으며, 제품이 저장한 사실을 빠짐없이 그리고 빠진 사실을 숨기지 않는다.

관련 부품: [`AlarmCaseBanner`](../components/robotics/AlarmCaseBanner.prompt.md) (사례 한 건), `ConfirmDialog` + `Textarea` (확인 사유 입력), `Timeline` (사례 이력), `StatusBadge` (축 배지). 원격 명령의 lifecycle은 [WF-03 Guarded remote action](PRODUCT_FRONTEND_COVERAGE.md#wf-03-guarded-remote-action)을 따른다.

## 1. Lifecycle states

| State | 의미 | 진입 | 표시 |
| --- | --- | --- | --- |
| `active` | 발생했고 아직 아무도 확인하지 않음 | 제품이 알람을 확정 | 심각도 바탕, `미확인` 배지, `alert` live 문장, 확인 button |
| `acknowledged` | 운영자가 인지했고 기록이 저장됨 | 확인 기록이 **저장된 뒤** | `확인됨` 배지, 확인 기록 dl, 확인 button 없음 |
| `shelved` | 운영자가 기간을 정해 잠시 내려 둠 | 사유·기간과 함께 저장 | 중립 바탕, `보류됨` 배지, 기록 dl |
| `escalated` | 상위 담당·외부 기관으로 넘김 | 사유·대상과 함께 저장 | 심각도 바탕, `상위 보고됨` 배지, 기록 dl |
| `cleared` | 원인이 사라졌음을 제품 또는 운영자가 확정 | 자동 해제 또는 운영자 해제 저장 | 중립 바탕, `해제됨` 배지, 기록 dl |

- 전이는 제품이 한다. `AlarmCaseBanner`의 `onAcknowledge`는 콜백일 뿐 내부 상태를 바꾸지 않는다.
- `acknowledged`는 **저장 완료 뒤**에만 그린다. 낙관적 갱신으로 먼저 바꾸면 기록이 비어 `기록 없음`이 보이며, 이는 버그가 아니라 계약이 드러내는 공백이다.
- `cleared`는 시간 창이 지나 화면에서 사라지는 것과 다르다. 사례가 목록에서 사라지는 규칙(예: 1분 신선도 창)은 제품 정책이고, LDS는 사라지기 전까지 lifecycle을 그대로 보여 준다.
- ISA-18.2의 `returned-to-normal but unacknowledged`는 `active` + 제품이 넘기는 `title`/`location` 문구로 표현하며 별도 상태를 만들지 않는다.

## 2. Independent axes

하나의 색이나 `error` 상태로 합치지 않는다. 각 축은 텍스트 배지 또는 별도 슬롯으로 읽힌다.

| Axis | Prop | 표현 | 합치면 안 되는 이유 |
| --- | --- | --- | --- |
| 심각도 | `severity` | 바탕색·왼쪽 띠·확인 button 톤 | lifecycle이 바뀌어도 사건의 심각도는 그대로다 |
| lifecycle | `lifecycle` | `StatusBadge` 텍스트 | 색만으로는 확인됨과 미확인을 구분할 수 없다 |
| 신선도 | `stale` | `정보 오래됨` 배지, `data-stale` | 오래된 정보를 정상처럼 보이게 하지 않는다 (WF-02) |
| 연결 | `link` | `연결 끊김` 배지, `data-link` | 연결 끊김은 알람이 해제된 것이 아니다 |
| 권한 | `authority` | `확인 권한 없음` 배지 + 확인 button 비활성·사유 | 권한이 없어도 사례는 보여야 한다 |
| 홍수 | `relatedCount` | `같은 유형 +N건` 배지 | 같은 유형이 쏟아져도 lifecycle 하나로 접지 않는다 (EEMUA 191) |

## 3. Acknowledgement evidence

제품은 확인·보류·상위 보고·해제마다 다음 네 가지를 **영속 저장소**에 남기고 읽어서 `evidence`로 넘긴다.

| Field | 내용 | 없으면 |
| --- | --- | --- |
| `actor` | 처리한 사람 또는 시스템 | `기록 없음` |
| `at` | 서버가 기록한 시각(표시용으로 포맷) | `기록 없음` |
| `reason` | 운영자가 입력한 사유 | `기록 없음` |
| `authority` | 처리 당시 검증된 권한·역할 | `기록 없음` |

- 넷 다 있으면 `data-evidence="recorded"`, 일부면 `partial`, 전부 없으면 `missing`이다. 감사·회귀 검사는 이 값을 읽는다.
- 브라우저 로컬 상태, 클라이언트 로그 한 줄, 서버 로그 파일은 영속 evidence가 아니다. 새로고침·다른 관제 화면·다음 근무자가 같은 기록을 읽을 수 있어야 한다.
- 사유 입력은 `ConfirmDialog` + `Textarea` 조합으로 받는다. 사유가 비면 `confirmDisabled`, 저장 중에는 `confirmLoading`과 `acknowledgePending`으로 중복 실행을 막는다. 처리자·시각·권한은 클라이언트가 채우지 않고 서버가 기록한다.

## 4. Acknowledge is not a remote command

- **확인**은 "내가 봤다"는 기록이며 로봇·설비에 아무 것도 보내지 않는다. **재개·정지·해제 명령**은 원격 명령이며 `remoteAction` 슬롯의 별도 그룹(`원격 명령` 라벨)에 둔다.
- 원격 명령의 eligibility(연결·권한·확인 선행 여부), 확인 다이얼로그, `sent → accepted → applied → confirmed/failed/timed-out` lifecycle은 WF-03을 따르고 제품이 소유한다. 확인 배지가 명령 성공을 뜻하지 않는다.
- 같은 사례에 대해 재개를 두 번 눌러도 같은 요청으로 식별되도록 명령 identity는 사례 `reference`에서 파생한다(제품 소유). LDS는 `reference`를 보여 줄 뿐이다.
- 비상 정지처럼 지연 자체가 위험한 명령은 이 배너에 넣지 않고 `ManualControlSession` 계열의 즉시 경로를 쓴다.

## 5. Keyboard, screen reader, focus recovery

- 사례 root는 `section[aria-labelledby=heading]`이다. 목록에서 사례를 heading 탐색으로 건널 수 있다.
- `active` 사례는 숨김 `role="alert"` 문장(제목 · 대상 · 신선도)으로 초점 이동 없이 알린다. 그 외 lifecycle은 `role="status"`다. 사이렌·음성은 제품이 재생하며 `alert`와 중복 낭독을 피하려면 제품이 `announce={false}`를 넘기고 자체 live region을 둔다.
- 확인 button은 일반 button이며 차단 시 `aria-describedby`로 사유를 연결한다. 비활성 대신 사례 자체를 숨기지 않는다.
- 사례가 사라질 때(해제·목록 이동) 제품은 초점을 다음 사례 heading 또는 목록 heading으로 옮긴다. `AlarmCaseBanner`는 `ref`를 root에 전달한다.
- 320px에서 제목·대상·배지·기록·action이 줄바꿈으로 내려가고 가로 overflow를 만들지 않는다.

## 6. Product evidence required to open O3

[`LDS_ROADMAP.md`](LDS_ROADMAP.md) R5의 entry trigger는 아래 묶음 전체다. 하나라도 빠지면 [`READINESS.json`](references/robotics/READINESS.json)의 O3는 `unverified`로 남고 `supportedClaim`은 `false`다.

1. 알람 사례별 확인·보류·상위 보고·해제 기록(처리자·서버 시각·사유·권한)을 저장하는 테이블 또는 컬럼과, 그것을 읽는 API.
2. 인증·권한 검사를 거치는 확인 API. 프론트 로컬 상태나 로그 한 줄로 대체하지 않는다.
3. 재개 등 원격 명령의 감사 기록(발행자·시각·사례 id·결과)과 사유 필드의 서버 전달.
4. 운영에 실제로 쓰는 `cleared`·`escalated`·`shelved` 정의와 전이 규칙.

이 묶음이 pinned source로 제출되면 WF-17의 제품 review를 `supported by composition`에서 O3 evidence로 승격하고 R5 감사를 다시 연다.

## 7. Verification

- `stories/RoboticsAlarmCase.stories.jsx`: 개요(alert/status 분리, 기록 있음/없음), 상호작용(사유 입력 → 저장 → lifecycle 전환 → 원격 재개 분리), 변형·상태(권한·연결·신선도·홍수·보류·상위 보고·해제), 반응형 320px, visual parity.
- `npm run check:product-frontends` (WF-17 pin·stage), `npm run check:robotics-readiness` (O3 `unverified` 유지), `npm run check:storybook-a11y` (Axe), `npm run check:prompt-contracts`.
