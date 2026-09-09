# AlarmCaseBanner

`AlarmCaseBanner`는 화재·쓰러짐·가스 임계치처럼 **운영자가 지금 처리해야 하는 알람 한 건**을 보여 주는 **LDS Product / Operations** 부품입니다. provenance는 `product-extension`입니다. 무엇이 어느 대상에 일어났는지, 정보가 얼마나 오래됐는지, 사례가 lifecycle의 어디에 있는지, 누가 어떤 사유와 권한으로 확인했는지를 한 표면에 두고, **확인(acknowledge)** action을 **원격 명령(재개 등)** 과 분리해 둡니다. 알람 진실, lifecycle 정책, 확인 기록의 영속 저장, 사이렌·음성, 원격 전송은 제품이 소유합니다. 전체 계약은 [`docs/ALARM_LIFECYCLE_CONTRACT.md`](../../docs/ALARM_LIFECYCLE_CONTRACT.md)에 있습니다.

```jsx
<AlarmCaseBanner
  severity="critical"
  lifecycle="acknowledged"
  title="화재 감지로 정지"
  target="순찰 로봇 2호"
  location="서오릉 1층 전시실"
  occurredAt="2026-09-09T02:14:31+09:00"
  occurredLabel="11:14:31 · 40초 전"
  reference="alert-1842"
  evidence={{ actor: '관제사 김하늘', at: '11:15:02', reason: '현장 확인 요청 완료', authority: 'ADMIN' }}
  remoteAction={<Button size="sm" variant="secondary" onClick={resume}>순찰 재개</Button>}
/>
```

## Problem and duplication check

- 반복 문제: 긴급 알람이 뜨면 운영자는 (1) 무엇이 어디서 났는지, (2) 이미 누가 보고 있는지, (3) 내가 확인해도 되는지, (4) 확인과 로봇 재개가 별개인지를 몇 초 안에 판단해야 합니다. 궁릉 관제의 긴급 배너는 이 네 가지를 한 줄에 두지만 확인 상태가 브라우저 메모리에만 남아 새로고침이나 다른 관제 화면에서 사라집니다. 이 컴포넌트는 확인 기록이 **없다는 사실**도 표면에 드러내어 그런 공백이 숨지 않게 합니다.
- **`Banner`·`Callout`과의 차이**: 그것들은 문장 하나짜리 공지이며 lifecycle, 대상, 증거, action 분리를 모릅니다. 한 줄 안내면 `Banner`를 쓰세요.
- **`Notification`·`Toast`와의 차이**: 그것들은 일시적 피드백입니다. 알람 사례는 누군가 처리할 때까지 남아야 하고, 처리한 뒤에도 기록으로 남습니다.
- **`EquipmentStatusCard`·`RobotStatusCard`와의 차이**: 그것들은 대상의 *현재 상태*를 요약합니다. 이 컴포넌트는 대상에 일어난 *사건 한 건*과 그 처리 이력을 보여 줍니다. 로봇 카드 안에 넣지 말고 목록·배너 영역에 두세요.
- 기존 primitive 조합(`StatusBadge` + `Button` + `DescriptionList`)으로도 그릴 수는 있지만, 축 분리(심각도·lifecycle·신선도·연결·권한)와 확인/원격 분리, 확인 기록 누락 표시는 매번 다시 설계되어 어긋났습니다. 이를 한 번 고정하기 위해 부품으로 둡니다.

## Anatomy and reading order

1. 숨김 live 문장: active면 `role="alert"`, 그 외는 `role="status"` (제목 · 대상 · lifecycle · 처리자)
2. `header`: 제목(heading) → 대상 · 위치 · `<time>` 발생 시각 · reference → 오른쪽 chip 묶음(lifecycle 배지 → 신선도 → 연결 → 권한 → 같은 유형 +N건)
3. 확인 기록 `dl` (active가 아닐 때만): 처리자 · 시각 · 사유 · 권한. 비어 있는 칸은 `기록 없음`
4. action 줄: 확인 button(+ 차단 사유) → 제품 secondary action → 구분선 뒤 `원격 명령` 그룹

DOM 순서와 시각 순서가 같습니다. 배지는 색뿐 아니라 텍스트로 축을 전달하고, 왼쪽 4px 띠와 바탕색은 **심각도**만 표현합니다(lifecycle은 배지 텍스트가 표현). `cleared`·`shelved`는 중립 바탕으로 물러납니다.

## Contract

- `lifecycle`은 `active · acknowledged · shelved · escalated · cleared` 다섯 값이며 전이는 제품이 수행합니다. LDS는 상태를 만들어 내지 않으며 `onAcknowledge`도 콜백일 뿐 내부 상태를 바꾸지 않습니다.
- `severity`(`critical · warning · notice`)와 `lifecycle`, `stale`, `link`, `authority`, `relatedCount`는 **독립 축**입니다. 연결이 끊겨도 lifecycle은 그대로이고, 권한이 없어도 사례는 보입니다. 하나의 색이나 `error` 상태로 합치지 않습니다.
- `evidence`는 제품이 **영속 저장소에서 읽어 온** 마지막 전이 기록입니다. active가 아닌데 `evidence`가 없거나 칸이 비면 `data-evidence="missing|partial"`과 `기록 없음`으로 드러냅니다. 브라우저 로컬 상태만으로 `acknowledged`를 그리면 이 표시가 남으므로, 제품은 확인을 저장한 뒤에만 lifecycle을 바꾸어야 합니다.
- 확인 button은 `lifecycle="active"`이고 `onAcknowledge`가 있을 때만 렌더됩니다. `authority="view-only"` 또는 `acknowledgeBlockedReason`이 있으면 비활성화하고 사유를 `aria-describedby`로 연결합니다. `acknowledgePending`은 loading으로 중복 실행을 막습니다.
- `remoteAction`은 별도 labelled 그룹(`data-slot="remote"`)에 들어갑니다. 확인이 원격 명령을 대신하지 않고, 원격 명령의 eligibility·lifecycle은 [WF-03](../../docs/PRODUCT_FRONTEND_COVERAGE.md#wf-03-guarded-remote-action)을 따릅니다. 확인 전에는 원격 명령을 막을지 여부도 제품 정책입니다.
- 사례가 사라질 때(해제·목록 이동) 초점은 제품이 다음 사례 또는 목록 heading으로 옮깁니다. 이 컴포넌트는 `ref`를 root `section`에 전달합니다.

## Visual-delta inventory

- 바탕은 `statusToneStyle` surface, 왼쪽 띠는 같은 톤의 foreground입니다. `Banner`처럼 테두리 없는 틴트 표면이지만 `radius-lg`와 4px 띠로 목록 안에서 사례 경계를 만듭니다.
- 제목은 body1 bold(`EquipmentStatusCard` heading과 같음), 대상 줄은 label1, 기록·캡션은 caption1입니다. reference만 `--font-mono`입니다.
- 확인 button은 `sm` 크기이며 critical이면 `danger`, 그 외 `primary`입니다. 원격 명령 그룹은 왼쪽 1px 구분선과 캡션 라벨로 분리됩니다.

## External category evidence

- [ISA-18.2 / IEC 62682 alarm management lifecycle](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa18): 알람 상태를 unacknowledged·acknowledged·shelved·suppressed·returned-to-normal로 구분하고 shelving과 suppression을 운영자 행위로 기록하라는 표준입니다. 다섯 lifecycle 값과 확인 기록 필드(처리자·시각·사유·권한)의 근거입니다.
- [EEMUA 191 alarm systems guide](https://www.eemua.org/Products/Publications/Print/EEMUA-Publication-191.aspx): 알람 홍수(flood)와 stale alarm을 별도 지표로 관리하라는 권고입니다. `relatedCount`와 `stale`을 lifecycle과 분리한 근거입니다.
- [WAI-ARIA APG — Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) 및 [WCAG 2.2 SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html): 긴급 정보는 `alert`, 그 외 상태 변화는 `status`로 초점을 옮기지 않고 알리라는 지침입니다. 숨김 live 문장이 active에서만 `alert`인 이유입니다.
- [WCAG 2.2 SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html): 심각도·lifecycle·연결·권한을 색이 아니라 텍스트 배지로 전달하는 근거입니다.

## Product workflow coverage

- **LK Control Gungneung** (`LK-ROBOTICS/lkrobotics-control-gungneung` · `9298e1c0`): `supported by composition`. `frontend/src/layout/MainLayout/CriticalAlertBanner/index.jsx`는 로봇별 위급 알람 한 줄, 원인 문구(`화재 감지로 정지`), 확인 button(사이렌 정지), 재개 button, 연결 끊김 시 재개 차단, 1분 신선도 창을 증명합니다. `useCriticalAlerts.js`는 화재/쓰러짐만 위급으로 보고 같은 유형을 하나로 접는 flood 규칙을, `criticalAlertStore.ts`는 확인 상태가 메모리에만 있음을 증명합니다. 백엔드 `Alert.java`·`AlarmController.java`에는 확인 저장 컬럼·API가 없고 `SocketController.java`의 재개는 로그만 남깁니다. 따라서 이 제품은 표시·상호작용은 조합으로 덮이지만, `evidence`를 채울 영속 기록이 없어 O3 readiness 증거로는 아직 인정하지 않습니다.
- **LK Control Full Daedeok** (`3bdce49ec6868f016f4ec2cdbd12aabbf8a04f19`): `not applicable`. 알림 조회·삭제만 있습니다.
- **LK Web Viz** (`4701e1dcfb0d0e9163c74c227da2d6feb801cb30`): `not applicable`.
- **LK Portal** (`e5ee99d5062170e26abe63d9105c2b8a024ce710`): `not applicable`. Portal의 device alert ACK는 default-OFF 경계 안의 별도 표면이며 이 감사에 pin하지 않았습니다.

## Intentional exclusions

- 알람 목록·정렬·필터·페이지 이동, 사이렌·음성 재생, 지도 마커
- 확인 사유 입력 다이얼로그 자체(`ConfirmDialog` + `Textarea` 조합, 계약 문서 참고)
- escalation 대상 선택, shelve 기간 입력, suppression 규칙
- 재개·정지 등 원격 명령의 전송과 lifecycle 표시(WF-03)
