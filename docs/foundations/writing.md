# Writing

| Field | Value |
| --- | --- |
| Type | Foundation guide |
| Status | Current |
| Owner | Foundation owner |
| Source | `foundation-content.json#writing` |

사용자가 빠르게 이해하고 안전하게 행동할 수 있도록 UI 문장의 어휘·문법·숫자·상태·문장부호 규칙을 제공합니다.

## 목적과 원리

- 익숙하고 구체적인 단어를 사용합니다.
- 한 문장에는 한 목적을 둡니다.
- 기능명이 아니라 사용자의 행동과 결과를 설명합니다.

## Semantic model

| 역할 | 의미 |
| --- | --- |
| Label | 짧은 명사 또는 동사, 마침표 없음 |
| Instruction | 사용자 행동을 직접 요청 |
| Status | 현재 사실과 범위 |
| Error/Recovery | 원인과 다음 행동 |
| Confirmation | 실제 확인 수준 |

## 선택 기준

| 상황 | 사용 | 피함 |
| --- | --- | --- |
| 버튼 | 구체적 동사: 저장·다시 연결 | 확인·처리 같은 모호한 말 |
| 오류 | 대상+원인+다음 행동 | error code만 표시 |
| 상태 | 사용자의 의미를 표현 | 내부 enum/HTTP 상태 |
| 긴 문장 | 한 목적씩 분리 | 괄호와 접속어로 계속 연결 |

## 정량 규칙

| 항목 | 기준 |
| --- | --- |
| Numbers | 수를 셀 때 아라비아 숫자 |
| Period | 완전한 설명·명령문에 사용, label/title/button에는 생략 |
| Abbreviation | 첫 사용에서 풀어 쓰고 승인 glossary 외 축약 금지 |
| Error length | 가능하면 원인 1문장 + 행동 1문장 |

## Do / Don't

| 구분 | 지침 |
| --- | --- |
| Do | 로봇 2대의 연결이 끊겼습니다. |
| Don't | 2 robot connection errors |
| Do | 경로를 저장하려면 충돌 구간을 수정해 주세요. |
| Don't | 저장 불가 |
| Do | 요청을 전송했습니다. 적용 여부를 확인하는 중입니다. |
| Don't | 완료되었습니다. |
| Do | 다시 연결 |
| Don't | 확인 |

## 예외

- 능동문보다 피동문이 책임 주체를 정확히 표현하면 피동문을 사용합니다.
- 자동 안전 메시지는 일반 안내보다 무게 있는 '-습니다' 문체를 사용할 수 있습니다.
- 고유 제품·프로토콜·API 이름은 원문을 유지합니다.

## 접근성

- 문구만으로 상태와 행동을 이해할 수 있어야 합니다.
- link/button label은 주변 문맥 없이도 목적을 식별할 수 있게 씁니다.
- live region 문구는 반복되는 장식 정보를 제거합니다.

## 국제화

- 문장을 단순 치환하지 않고 locale별 어순·복수형·높임말을 검토합니다.
- 숫자·날짜·단위는 International Design 규칙과 formatter를 사용합니다.
- 긴 번역에서도 button label을 임의 축약하지 않습니다.

## LDS 예시

| 상황 | 결정 |
| --- | --- |
| 필드 오류 | 속도는 0~2 m/s로 입력해 주세요. |
| 권한 부족 | 이 작업은 관리자만 실행할 수 있습니다. 관리자에게 권한을 요청해 주세요. |
| 빈 검색 | 'AMR-12'와 일치하는 로봇이 없습니다. 검색어를 확인해 주세요. |
| 파괴적 확인 | 경로 3개를 삭제합니다. 삭제한 경로는 복구할 수 없습니다. |

## 토큰과 API

### Tokens

- `typography roles`
- `status semantic tokens`

### Components and checks

- `Button labels`
- `Field helper/error`
- `Banner`
- `Callout`
- `ResourceState`

## 참고 자료
