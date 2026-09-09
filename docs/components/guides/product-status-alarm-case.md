# Alarm Case

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `AlarmCaseBanner` |
| Storybook | `LDS Product/Status/Alarm Case` |
| Source | `../component-content.json#product-status-alarm-case` |

화재·쓰러짐·가스 임계치처럼 누군가 처리할 때까지 남아야 하는 알람 사례에 적합합니다. 한 문장짜리 공지는 Banner, 일시적 피드백은 Toast, 대상의 현재 상태 요약은 Equipment Status Card를 사용하세요.

## 사용 판단

### 사용

- AlarmCaseBanner는 화재·쓰러짐·가스 임계치처럼 운영자가 지금 처리해야 하는 알람 한 건을 보여 주는 LDS Product / Operations 부품입니다. provenance는 product-extension입니다. 무엇이 어느 대상에 일어났는지, 정보가 얼마나 오래됐는지, 사례가 lifecycle의 어디에 있는지, 누가 어떤 사유와 권한으로 확인했는지를 한 표면에 두고, 확인(acknowledge) action을 원격 명령(재개 등) 과 분리해 둡니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | What happened, e.g. "화재 감지로 정지". Becomes the heading and the start of the announcement. |
| occurredLabel | Visible occurrence time or age; falls back to occurredAt. |
| evidenceLabel | Accessible name of the evidence list. @default "확인 기록" |
| missingEvidenceLabel | Text for a missing evidence field. @default "기록 없음" |
| acknowledgePending | Acknowledgement request in flight; the button shows loading and blocks repeats. @default false |
| actions | Product-owned secondary actions (open detail, shelve, escalate). |
| remoteAction | A remote command such as resume, kept in its own labelled group apart from acknowledgement. Its eligibility and lifecycle follow WF-03. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `lifecycle` | `AlarmLifecycle` | No | Where the case sits in its lifecycle. The product owns the transitions. @default "active" |
| `severity` | `AlarmSeverity` | No | Urgency of the case; colours the surface and picks alert vs status announcement. @default "critical" |
| `title` | `React.ReactNode` | Yes | What happened, e.g. "화재 감지로 정지". Becomes the heading and the start of the announcement. |
| `target` | `React.ReactNode` | Yes | The affected target, e.g. the robot or equipment name. |
| `location` | `React.ReactNode` | No | Optional place or zone. |
| `occurredAt` | `string` | No | Machine-readable occurrence time (ISO 8601) for . |
| `occurredLabel` | `React.ReactNode` | No | Visible occurrence time or age; falls back to occurredAt. |
| `reference` | `React.ReactNode` | No | Product case identifier shown in monospace for audit follow-up. |
| `stale` | `boolean` | No | The displayed truth is older than the product's freshness window. Sets data-stale and shows staleLabel. @default false |
| `staleLabel` | `React.ReactNode` | No |  |
| `link` | `'online' \| 'offline'` | No | Transport state to the target; offline is shown as a separate chip and never as a lifecycle change. @default "online" |
| `offlineLabel` | `React.ReactNode` | No |  |
| `authority` | `'granted' \| 'view-only'` | No | Whether the current user may acknowledge. view-only disables the acknowledge action with a visible reason. @default "granted" |
| `viewOnlyLabel` | `React.ReactNode` | No |  |
| `relatedCount` | `number` | No | Number of further cases of the same type collapsed into this one (alarm flood). @default 0 |
| `evidence` | `AlarmEvidence` | No | Persisted acknowledgement/transition record. Rendered for every non-active lifecycle; absent fields are marked missing. |
| `evidenceLabel` | `string` | No | Accessible name of the evidence list. @default "확인 기록" |
| `missingEvidenceLabel` | `React.ReactNode` | No | Text for a missing evidence field. @default "기록 없음" |
| `onAcknowledge` | `React.MouseEventHandler` | No | Acknowledge handler. Rendered only while lifecycle is active. The product records actor, time, reason and authority. |
| `acknowledgeLabel` | `React.ReactNode` | No |  |
| `acknowledgePending` | `boolean` | No | Acknowledgement request in flight; the button shows loading and blocks repeats. @default false |
| `acknowledgeBlockedReason` | `React.ReactNode` | No | Visible reason why acknowledging is blocked; disables the action. Defaults to the view-only message when authority is view-only. |
| `actions` | `React.ReactNode` | No | Product-owned secondary actions (open detail, shelve, escalate). |
| `remoteAction` | `React.ReactNode` | No | A remote command such as resume, kept in its own labelled group apart from acknowledgement. Its eligibility and lifecycle follow WF-03. |

## States

| State | Contract |
| --- | --- |
| stale | The displayed truth is older than the product's freshness window. Sets data-stale and shows staleLabel. @default false |

## Behavior and interaction

- EquipmentStatusCard·RobotStatusCard와의 차이: 그것들은 대상의 현재 상태를 요약합니다. 이 컴포넌트는 대상에 일어난 사건 한 건과 그 처리 이력을 보여 줍니다. 로봇 카드 안에 넣지 말고 목록·배너 영역에 두세요.
- lifecycle은 active · acknowledged · shelved · escalated · cleared 다섯 값이며 전이는 제품이 수행합니다. LDS는 상태를 만들어 내지 않으며 onAcknowledge도 콜백일 뿐 내부 상태를 바꾸지 않습니다.
- severity(critical · warning · notice)와 lifecycle, stale, link, authority, relatedCount는 독립 축입니다. 연결이 끊겨도 lifecycle은 그대로이고, 권한이 없어도 사례는 보입니다. 하나의 색이나 error 상태로 합치지 않습니다.
- evidence는 제품이 영속 저장소에서 읽어 온 마지막 전이 기록입니다. active가 아닌데 evidence가 없거나 칸이 비면 data-evidence="missing|partial"과 기록 없음으로 드러냅니다. 브라우저 로컬 상태만으로 acknowledged를 그리면 이 표시가 남으므로, 제품은 확인을 저장한 뒤에만 lifecycle을 바꾸어야 합니다.
- ISA-18.2 / IEC 62682 alarm management lifecycle: 알람 상태를 unacknowledged·acknowledged·shelved·suppressed·returned-to-normal로 구분하고 shelving과 suppression을 운영자 행위로 기록하라는 표준입니다. 다섯 lifecycle 값과 확인 기록 필드(처리자·시각·사유·권한)의 근거입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 반복 문제: 긴급 알람이 뜨면 운영자는 (1) 무엇이 어디서 났는지, (2) 이미 누가 보고 있는지, (3) 내가 확인해도 되는지, (4) 확인과 로봇 재개가 별개인지를 몇 초 안에 판단해야 합니다. 궁릉 관제의 긴급 배너는 이 네 가지를 한 줄에 두지만 확인 상태가 브라우저 메모리에만 남아 새로고침이나 다른 관제 화면에서 사라집니다. 이 컴포넌트는 확인 기록이 없다는 사실도 표면에 드러내어 그런 공백이 숨지 않게 합니다. |
| 명시 규칙 2 | remoteAction은 별도 labelled 그룹(data-slot="remote")에 들어갑니다. 확인이 원격 명령을 대신하지 않고, 원격 명령의 eligibility·lifecycle은 WF-03을 따릅니다. 확인 전에는 원격 명령을 막을지 여부도 제품 정책입니다. |
| 명시 규칙 3 | 바탕은 statusToneStyle surface, 왼쪽 띠는 같은 톤의 foreground입니다. Banner처럼 테두리 없는 틴트 표면이지만 radius-lg와 4px 띠로 목록 안에서 사례 경계를 만듭니다. |
| 명시 규칙 4 | 확인 button은 sm 크기이며 critical이면 danger, 그 외 primary입니다. 원격 명령 그룹은 왼쪽 1px 구분선과 캡션 라벨로 분리됩니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Content and writing

- 기존 primitive 조합(StatusBadge + Button + DescriptionList)으로도 그릴 수는 있지만, 축 분리(심각도·lifecycle·신선도·연결·권한)와 확인/원격 분리, 확인 기록 누락 표시는 매번 다시 설계되어 어긋났습니다. 이를 한 번 고정하기 위해 부품으로 둡니다.
- 제목은 body1 bold(EquipmentStatusCard heading과 같음), 대상 줄은 label1, 기록·캡션은 caption1입니다. reference만 --font-mono입니다.
- LK Control Gungneung (LK-ROBOTICS/lkrobotics-control-gungneung · 9298e1c0): supported by composition. frontend/src/layout/MainLayout/CriticalAlertBanner/index.jsx는 로봇별 위급 알람 한 줄, 원인 문구(화재 감지로 정지), 확인 button(사이렌 정지), 재개 button, 연결 끊김 시 재개 차단, 1분 신선도 창을 증명합니다.
- 확인 사유 입력 다이얼로그 자체(ConfirmDialog + Textarea 조합, 계약 문서 참고).

## Accessibility

- 확인 button은 lifecycle="active"이고 onAcknowledge가 있을 때만 렌더됩니다. authority="view-only" 또는 acknowledgeBlockedReason이 있으면 비활성화하고 사유를 aria-describedby로 연결합니다. acknowledgePending은 loading으로 중복 실행을 막습니다.
- 사례가 사라질 때(해제·목록 이동) 초점은 제품이 다음 사례 또는 목록 heading으로 옮깁니다. 이 컴포넌트는 ref를 root section에 전달합니다.
- WAI-ARIA APG — Alert pattern 및 WCAG 2.2 SC 4.1.3 Status Messages: 긴급 정보는 alert, 그 외 상태 변화는 status로 초점을 옮기지 않고 알리라는 지침입니다. 숨김 live 문장이 active에서만 alert인 이유입니다.
- WCAG 2.2 SC 1.4.1 Use of Color: 심각도·lifecycle·연결·권한을 색이 아니라 텍스트 배지로 전달하는 근거입니다.
- 1. 숨김 live 문장: active면 role="alert", 그 외는 role="status" (제목 · 대상 · lifecycle · 처리자) 2. header: 제목(heading) → 대상 · 위치 · 발생 시각 · reference → 오른쪽 chip 묶음(lifecycle 배지 → 신선도 → 연결 → 권한 → 같은 유형 +N건) 3. 확인 기록 dl (active가 아닐 때만): 처리자 · 시각 · 사유 · 권한. 비어 있는 칸은 기록 없음 4.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `Textarea` | 대표 시나리오에서 조합 |
| `BatteryGauge` | 대표 시나리오에서 조합 |
| `ConnectionBadge` | 대표 시나리오에서 조합 |
| `EquipmentStatusCard` | 대표 시나리오에서 조합 |
| `TelemetryGauge` | 대표 시나리오에서 조합 |
| `TelemetryValue` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--font-mono`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--radius-lg`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/robotics/AlarmCaseBanner.jsx`
- `components/robotics/AlarmCaseBanner.d.ts`
- `components/robotics/AlarmCaseBanner.prompt.md`
- `stories/RoboticsAlarmCase.stories.jsx`

## Sources

- AlarmCaseBanner prompt contract: `components/robotics/AlarmCaseBanner.prompt.md`
- Storybook implementation evidence: `stories/RoboticsAlarmCase.stories.jsx`
- [ISA-18.2 / IEC 62682 alarm management lifecycle](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa18)
- [EEMUA 191 alarm systems guide](https://www.eemua.org/Products/Publications/Print/EEMUA-Publication-191.aspx)
- [WAI-ARIA APG — Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [WCAG 2.2 SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WCAG 2.2 SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
