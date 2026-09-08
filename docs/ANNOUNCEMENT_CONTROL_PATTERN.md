# 안내방송 제어 패턴

| Field | Value |
| --- | --- |
| Type | Cross-component pattern guide |
| Status | Current |
| Owner | Design system owner · Robotics domain owner |
| Last reviewed | 2026-09-08 |

로봇 스피커나 현장 PA로 안내방송을 **재생·정지·음소거**하는 운영 control을 `Select`,
`Button`, `ConfirmDialog`, `StatusIndicator`, `StatusBadge`, `Banner`로 조합하는 공식 규칙이다.
이 문서는 각 컴포넌트의 계약이 아니라 **그 사이의 합성 계약** — 방송 종류 선택, 실행 전
확인, 우선순위 표시, 범위·유효시간이 있는 음소거, 지금 무엇이 왜 나가는지의 상태 줄 — 을
소유한다. 방송 종류 어휘, 전송(MQTT/STOMP), 우선순위 판정, 유효시간 상한, 권한은 제품이
소유하며 화면형 `AnnouncementPanel` 컴포넌트는 만들지 않는다.

## 기본 조합

```jsx
<section aria-labelledby="pa-heading">
  <h3 id="pa-heading">안내방송</h3>
  <p role="status">
    <StatusIndicator tone={playing ? 'positive' : 'neutral'} pulse={playing} /> {nowPlayingLine}
  </p>
  <Select label="방송 종류" options={ANNOUNCEMENT_TYPES} value={type} onChange={setType} disabled={mutedAll} />
  <Button onClick={() => setConfirm('PLAY')} disabled={mutedAll || !connected}>방송</Button>
  <Button variant="outlined" color="assistive" onClick={() => setConfirm('STOP')} disabled={!playing}>정지</Button>
  <Button variant="ghost" aria-pressed={muted} onClick={muted ? unmute : () => setConfirm('MUTE_ALL')}>
    {muted ? '음소거 해제' : '전체 음소거'}
  </Button>
  <ConfirmDialog open={confirm != null} tone={confirm === 'MUTE_ALL' ? 'warning' : 'default'} … />
</section>
```

1. **상태 줄이 먼저다.** `지금 무엇이 왜 나가는가`를 한 줄로 항상 보여 준다: `화재 (이벤트)`,
   `이동 안내 (수동)`, `방송 없음`, `음소거(30분) · 12:40 남음`. 정지를 눌렀는데 다음 순위 방송이
   올라오는 것을 "안 꺼졌다"로 읽지 않게 하는 장치다. `StatusIndicator`의 점과 라벨을 함께 쓰고
   색만으로 상태를 전달하지 않는다.
2. **방송 종류는 항상 보이는 `Select`다.** 비개발자 운영자가 쓰는 화면이므로 팝업 메뉴 뒤에
   숨기지 않는다. 종류 어휘와 라벨(`첫인사`, `이동 안내`, `화재`, `쓰러짐`, `침입자`, `화기 엄금`
   등)은 제품 계약이다.
3. **재생·정지·전체 음소거는 실행 전 `ConfirmDialog`로 한 번 더 확인한다.** 방송은 현장에 즉시
   들리는 되돌릴 수 없는 action이다. 확인 본문에 방송 종류·대상 로봇·(음소거라면) 유효시간을
   그대로 적는다.
4. **음소거 해제는 범위와 무관하게 하나의 action이다.** 되돌리는 길이 여럿이면 어느 것을 눌러야
   풀리는지 헷갈린다. 해제는 확인 없이 즉시 실행한다(소리를 되살리는 동작은 막지 않는다).

## 우선순위와 전체 음소거

- 방송에는 우선순위가 있다: **경보(화재·쓰러짐·침입) > 수동 안내 > 평시 안내**. 상위 방송이 나가면
  하위 방송은 끊기거나 대기한다. 상태 줄은 그 결과를 그대로 보여 주고, 제품은 우선순위 판정을
  보드·서버에 둔다.
- **전체 음소거는 경보 방송까지 막는다.** 따라서 `ConfirmDialog tone="warning"`으로 확인하고,
  **유효시간이 필수**다(15분·30분·1시간처럼 정비·시연 길이에 맞춘 선택지; 상한은 서버가 강제).
  무기한 음소거는 관리자 권한에서만 노출하고 별도 문구로 경고한다.
- 전체 음소거 중에는 `Banner tone="cautionary"`를 control 위에 고정해 남은 시간과 해제 action을
  두고, 방송 `Select`와 재생 `Button`은 비활성화한다. 남은 시간은 보드가 보내는 남은 초로
  1초 단위 카운트다운을 그리며 처음 관측한 값을 담는 가장 작은 선택지 라벨(`음소거(1시간)`)을
  고정한다.
- 평시 음소거(`ambient`)와 전체 음소거(`all`/`forever`)는 라벨로 구분한다. 색이 같은 두 상태를
  하나의 아이콘으로 합치지 않는다.

## Acceptance matrix

| 상황 | 상태 줄 | Select | 방송 | 정지 | 음소거 |
| --- | --- | --- | --- | --- | --- |
| 연결 확인 중 | `상태 확인 중` | 비활성 | 비활성 | 비활성 | 비활성 |
| 방송 없음 | `방송 없음` | 활성 | 활성(확인) | 비활성 | `전체 음소거`(확인) |
| 수동 방송 중 | `이동 안내 (수동)` | 활성 | 활성(확인) | 활성(확인) | `전체 음소거`(확인) |
| 경보 방송 중 | `화재 (이벤트)` | 활성 | 활성(확인) | 활성(확인) | `전체 음소거`(확인) |
| 전체 음소거 | `음소거(30분) · 12:40 남음` + Banner | 비활성 | 비활성 | 비활성 | `음소거 해제`(즉시) |
| 무기한 음소거 | `음소거(영구)` + Banner | 비활성 | 비활성 | 비활성 | `음소거 해제`(즉시) |

## 좁은 화면

- 320px에서는 상태 줄 → Select → action 순서로 세로 쌓임을 유지하고 action은 `Button full`로
  한 줄씩 둔다. Banner는 항상 control 묶음 바로 위에 있다.
- 로봇 여러 대를 나란히 두는 화면에서는 로봇마다 하나의 control 묶음을 두고 상태 줄을 묶음
  안에 둔다. 전체 로봇 일괄 음소거는 이 패턴의 범위 밖이다.

## 외부 근거

- [ASL EN 54-16 Integra system design guide](https://www.zenitel.com/sites/default/files/2024-01/EN%2054%20Integra%20System%20Dersign%20Guide%20T-0667-231_Iss2.5.pdf):
  음성 경보는 항상 다른 PA·배경음보다 우선하고, 진행 중인 안내는 끊기며 배경음은 음소거된다.
  상태 줄이 우선순위 결과를 보여 주고 전체 음소거를 경보까지 막는 위험 action으로 다루는
  근거다.
- [Zenitel Exigo EN 54-16 technical manual](https://www.zenitel.com/sites/default/files/A100K11592-Exigo-EN54-Manual-1-7.pdf):
  운영자 패널은 존별 점유 상태와 우선순위에 따라 방송 가능 여부를 판단하고 마이크·경보 제어를
  분리한다. 재생과 정지를 별도 action으로 두고 실행 가능 여부를 상태에서 도출하는 근거다.
- [WAI-ARIA APG Alert and Message Dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/):
  되돌릴 수 없는 action 전의 확인 dialog는 초점을 dialog 안에 두고 명시적 확인/취소를 제공한다.
  `ConfirmDialog` 사용 근거다.

## 제품 커버리지

- **LK Control Gungneung** (`LK-ROBOTICS/lkrobotics-control-gungneung` · `9298e1c0`):
  `supported by composition`. `frontend/src/views/dashboard/RobotDashboard/components/LiveMonitoring/index.jsx`가
  방송 종류 6개, PLAY/STOP/MUTE/UNMUTE, `all`/`forever` 범위와 15분·30분·1시간 유효시간, 이벤트·수동·
  평시 source 라벨, 남은 시간 카운트다운을 증명한다. STOMP 전송과 `announcementStore` 상태 반영은
  제품이 소유한다.
- **LK Control Full Daedeok**·**LK Web Viz**·**LK Portal**: `not applicable`. pinned source에 안내방송
  control이 없다.

## 관련 계약

- [`ConfirmDialog`](../components/overlay/ConfirmDialog.prompt.md) · [`Banner`](../components/status/Banner.prompt.md) · [`StatusIndicator`](../components/content/StatusIndicator.prompt.md) · [`Select`](../components/forms/Select.prompt.md)
- 경보 acknowledgement·escalation·shelve lifecycle은 이 패턴의 범위 밖이며 [`LDS_ROADMAP.md`](LDS_ROADMAP.md) R5(O3)의 진입 조건을 따른다.
