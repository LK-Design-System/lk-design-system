# Voice and Tone

| Field | Value |
| --- | --- |
| Type | Foundation guide |
| Status | Current |
| Owner | Foundation owner |
| Source | `foundation-content.json#voice-and-tone` |

LK 운영 제품이 정확하고 차분하며 책임 있게 말하도록 고정된 voice와 상황별 tone 변화를 정의합니다.

## 목적과 원리

- 정확성은 친근함보다 우선합니다.
- 사용자의 다음 안전한 행동을 돕습니다.
- 시스템 능력과 확인 수준을 과장하지 않습니다.

## Semantic model

| 역할 | 의미 |
| --- | --- |
| Voice | precise·calm·dependable·operational |
| Neutral tone | 일반 안내·설명 |
| Urgent tone | 안전·중단·데이터 손실 위험 |
| Supportive tone | 복구·학습·빈 상태 |

## 선택 기준

| 상황 | 사용 | 피함 |
| --- | --- | --- |
| 일반 상태 | 간결한 사실형 | 마케팅 표현 |
| 안전 경고 | 직접적이며 영향·행동 명시 | 유머·완곡어 |
| 복구 가능 오류 | 원인+다음 행동 | 사용자 탓 |
| 성공 | 검증된 결과만 확인 | 요청 접수를 완료로 표현 |

## 정량 규칙

| 항목 | 기준 |
| --- | --- |
| Error | 원인 1문장 + 다음 행동 1문장 |
| Critical | 대상·영향·즉시 행동을 첫 화면에 |
| Terminology | sent·accepted·applied·confirmed를 구분 |

## Do / Don't

| 구분 | 지침 |
| --- | --- |
| Do | 로봇 A의 연결이 끊겼습니다. 네트워크를 확인한 뒤 다시 연결해 주세요. |
| Don't | 오류가 발생했습니다! |
| Do | 설정 요청을 전송했습니다. 적용 여부를 확인하는 중입니다. |
| Don't | 설정이 완료되었습니다. |

## 예외

- 법적·보안 문구는 승인된 원문과 tone을 우선합니다.
- 현장 안전 절차는 간결성을 이유로 필수 단계를 생략하지 않습니다.

## 접근성

- 긴급성은 색·느낌표·motion이 아니라 heading·명시적 문구·순서로 전달합니다.
- screen reader announcement도 같은 의미와 urgency를 사용합니다.

## 국제화

- voice는 유지하되 존대·문장 구조는 locale 문화와 glossary에 맞춥니다.
- 직역으로 책임 주체나 시제가 사라지지 않게 검토합니다.

## LDS 예시

| 상황 | 결정 |
| --- | --- |
| Offline | 현재 사실→영향→복구 행동 순서 |
| Empty | 없음의 종류를 구분하고 가능한 다음 행동만 제시 |

## 토큰과 API

### Tokens

- `status color roles`
- `typography hierarchy`

### Components and checks

- `DESIGN.md`
- `AI_DESIGN_SYSTEM_GUIDE.md`
- `Writing foundation`

## 참고 자료

- [SEED Foundations benchmark](https://seed-design.io/foundations)
- [SEED Voice and Tone](https://seed-design.io/foundations/voice-and-tone)
