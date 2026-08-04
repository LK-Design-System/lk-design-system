# 한국어 UI 카피 체계 개편안

| Field | Value |
| --- | --- |
| Type | Plan |
| Status | Completed · additional product adoption separate |
| Owner | Foundation owner · Design system owner |
| Last reviewed | 2026-08-04 |
| Source | LK Portal `korean-ui-copy-guide.md`·`korean-ui-copy-registry.v1.json`, LDS Writing·Voice and Tone·International Design·AI Design System Guide |

## 1. 결론

LK Portal에서 가져올 핵심은 제품 용어가 아니라 **한국어 UI 문구를 작성하고, AI로 검토하고, 의미 보존을 확인하고, 위험도에 따라 승인하는 운영 체계**다.

LDS는 제품별 정식 명칭과 상태 전이를 소유하지 않는다. 대신 모든 LK 제품이 재사용할 수 있는 다음 계약을 제공한다.

1. UI 요소별 문장 형태와 문장부호
2. 로딩·빈 화면·오류·권한·성공·확인창의 정보 순서
3. 번역투와 과윤문을 함께 막는 검토 원칙
4. 고유명사·수치·placeholder·권한·보안·상태 전이의 의미 보존
5. `KEEP`·`REVISE`·`BLOCKED` 판정과 사람 승인 경계
6. 제품이 자체 용어집과 상태 사전을 연결할 수 있는 기계 판독 계약

## 2. 현재 문제

현재 LDS에는 필요한 원칙이 이미 있으나 책임이 여러 문서에 분산되어 있다.

| 현재 문서 | 갖고 있는 내용 | 부족한 내용 |
| --- | --- | --- |
| `foundations/writing.md` | 짧고 구체적인 문장, 오류와 다음 행동, 문장부호 | UI 상태별 상세 구조, 번역투·과윤문 검토, 의미 보존 절차 |
| `foundations/voice-and-tone.md` | 정확하고 차분하며 책임 있는 voice | 권한·보안·파괴 동작에서 tone이 바꾸면 안 되는 사실 경계 |
| `foundations/international-design.md` | locale, 형식, 문자열 확장, 접근성 | 한국어 윤문과 locale 변환의 책임 분리 |
| `AI_DESIGN_SYSTEM_GUIDE.md` | 한국어 종결·마침표·오류 문장 규칙 | 구조화된 입력·출력, 판정, 승인, 검증 계약 |
| `STORYBOOK_MASTHEAD_COPY_CONTRACT.md` | Storybook 문구 길이와 역할 | 제품 UI 카피에 적용할 수 없는 Storybook 전용 범위 |

LK Portal 문서는 이 빈 부분을 구체적으로 다루지만, Portal의 화면명·객체명·상태 사전과 공통 원칙이 한 문서에 함께 있다. 이를 그대로 복사하면 제품 계약이 LDS에 유입된다.

## 3. 목표와 비목표

### 목표

- 제품과 도메인에 독립적인 한국어 UI 카피 계약을 LDS에 둔다.
- 디자이너·개발자·AI가 같은 검토 순서와 판정 언어를 사용한다.
- 제품이 자체 용어집과 상태 사전을 연결하되 LDS가 제품 의미를 추측하지 않게 한다.
- 결정적으로 검사할 수 있는 항목과 사람 판단이 필요한 항목을 분리한다.
- 기존 Foundation 구조와 machine-readable surface를 유지한다.

### 비목표

- `내 펫`, `계정 및 인증 정보`, `LLM Wiki` 등 Portal 전용 명칭을 LDS 표준으로 만들지 않는다.
- Portal의 route, 권한 모델, 보존 정책, workflow lifecycle을 LDS가 소유하지 않는다.
- AI가 제품 동작을 추론하거나 사용자 문구를 자동 반영하게 하지 않는다.
- 번역기·맞춤법 검사기·형태소 분석기를 LDS runtime dependency로 추가하지 않는다.
- 이번 개편만으로 저장소 전체 카피 검사를 즉시 차단형 gate로 전환하지 않는다.

## 4. 소유권 경계

| 영역 | LDS 소유 | 제품 소유 |
| --- | --- | --- |
| Voice | 정확성·차분함·책임성·행동 중심 | 브랜드별 어조의 제한적 변형 |
| 문장 형태 | 제목·라벨·버튼·설명·오류의 기본 형태 | 화면별 실제 문구와 정보량 |
| 상태 카피 | 로딩·빈 화면·오류 등의 정보 순서 | 상태값, 상태 전이, 복구 가능성 |
| 용어 | 기술 고유명사 보존, 문맥형 용어 선택 원칙 | 제품 정식 명칭과 도메인 용어집 |
| AI 검토 | 입력·출력·의미 보존·판정 계약 | copy set, 정책 tag, 승인자 |
| 자동 검사 | placeholder·구두점·등록된 용어의 회귀 검사 구조 | 검사 대상과 허용 예외 |
| 국제화 | locale 형식·확장·방향·접근성 계약 | 지원 locale, formatter, 번역 자산 |

제품 계약과 LDS 문구 원칙이 충돌하면 제품의 실제 동작·권한·상태 전이가 우선한다. 다만 제품이 LDS와 다른 문장 규칙을 사용하려면 제품 문서에 이유와 적용 범위를 기록한다.

## 5. 목표 문서 구조

### 5.1 `foundations/writing.md`

사람이 읽는 한국어 UI 작성 기준의 canonical entry로 유지한다. 다음 내용을 추가한다.

- UI 요소별 기본 형태와 문장부호 표
- 로딩·빈 화면·오류·권한·성공·확인창의 정보 순서
- 버튼과 링크의 대상·행동·결과 명명 기준
- 번역투 검토 신호와 전역 치환 금지
- 자연스러운 원문을 유지하는 과윤문 방지 원칙
- 제품 용어집과 상태 사전이 필요한 경우의 소유권 경계

### 5.2 `foundations/voice-and-tone.md`

상황에 따른 표현 강도와 책임 범위를 소유한다. 다음 내용을 추가한다.

- 일반·지원·긴급·파괴적 상황의 tone 변화
- 오류에서 사용자 탓, 유머, 감탄, 근거 없는 낙관을 피하는 기준
- 요청 접수·처리 성공·결과 확인을 구분하는 용어 원칙
- 보안·권한·삭제·보존 문구를 부드럽게 바꾸지 않는 규칙

### 5.3 `foundations/international-design.md`

번역과 한국어 윤문의 경계를 명시한다.

- 번역은 locale 간 의미 이전이고, 윤문은 같은 locale 안에서 자연스러움을 개선하는 작업임을 구분
- 한국어 원문도 지원 locale 중 하나로 취급하고 다른 언어의 최대 길이를 가정하지 않음
- 동적 문장을 조각으로 조합하지 않고 locale별 완성 문장으로 관리
- visible label과 accessible name의 의미 동등성 검토

### 5.4 신규 안정 계약 `COPY_REVIEW_CONTRACT.md`

AI와 자동화가 문구를 검토하는 구조를 Foundation 설명과 분리한다.

계약은 다음을 소유한다.

- copy set 입력 구조
- 보호 항목과 의미 보존 조건
- `KEEP`·`REVISE`·`BLOCKED` 출력 구조
- 위험도 하한선과 승인 책임
- source/candidate hash와 ruleset version
- 결정적 verifier와 사람 검토의 경계
- 예외의 owner·reason·expiry 기록

### 5.5 `AI_DESIGN_SYSTEM_GUIDE.md`

중복된 세부 규칙을 늘리지 않고 다음 최소 지침과 링크만 유지한다.

- 제품 의미를 추측하지 않는다.
- 자연스러운 원문은 `KEEP`한다.
- 보호 항목을 바꾸지 않는다.
- 불명확하거나 충돌하면 `BLOCKED`한다.
- 자세한 작성 규칙은 Writing, 구조화 검토는 Copy Review Contract를 따른다.

### 5.6 Machine-readable reference

기계 판독 기준은 Foundation guide 본문과 분리해 `docs/references/quality/` 아래에 둔다.

권장 구조:

```text
docs/references/quality/
  KOREAN_UI_COPY_CONTRACT.schema.json
  KOREAN_UI_COPY_BASELINE.json
```

LDS 파일은 공통 role, 위험도 축, 판정값, reason code, schema만 정의한다. 제품별 canonical name, 상태 사전, route와 copy set은 각 제품 저장소가 소유한다.

## 6. 공통 작성 규칙

### 6.1 UI 요소별 기본 형태

| UI 요소 | 기본 형태 | 문장부호 |
| --- | --- | --- |
| 페이지·섹션 제목 | 짧은 명사구 또는 결과 중심 제목 | 마침표 없음 |
| 탭·필드 라벨 | 짧은 명사구 | 마침표 없음 |
| 버튼·텍스트 링크 | 구체적 행동 또는 결과 | 마침표 없음 |
| 상태 배지 | 상태 명사 또는 짧은 상태 | 마침표 없음 |
| 로딩 상태 | 대상과 실제 작업 + `중…` | 말줄임표 사용 |
| 설명·도움말 | 완전한 문장 | 마침표 사용 |
| 요청·복구 안내 | 실제로 가능한 행동 + `-해 주세요.` | 마침표 사용 |
| 빈 화면의 가벼운 제안 | 가능한 탐색 행동 + `-해 보세요.` | 마침표 사용 |
| 확인창 본문 | 대상·결과·복구 가능성을 밝힌 문장 | 마침표 사용 |

### 6.2 상태별 정보 순서

| 상태 | 필수 정보 |
| --- | --- |
| Loading | 실제 대상과 작업, 필요하면 예상 대기·취소 가능성 |
| Empty | 첫 사용·검색 결과 없음·필터 결과 없음·권한 없음 구분, 가능한 다음 행동 |
| Error | 실패한 대상 → 알려진 원인 → 실제 복구 행동 또는 남은 대안 |
| Permission | 볼 수 없는 대상 또는 실행할 수 없는 행동 → 요청 가능한 주체·경로 |
| Success | 실제로 적용·저장·발급·전송된 결과와 확인 위치 |
| Confirmation | 대상 → 실행 결과 → 외부 영향 → 복구 가능성 → 구체적 확인 버튼 |

오류와 빈 화면을 같은 상태로 표현하지 않는다. 원인이나 복구 방법을 모르면 만들어 내지 않는다. HTTP 성공이나 요청 접수만으로 도메인 결과가 완료됐다고 표현하지 않는다.

### 6.3 번역투와 과윤문

다음은 자동 금지어가 아니라 검토 신호다.

- 반복되는 `~을 통해`, `~에 대한`, `~의 경우`
- 불필요한 피동·이중 피동
- 직접적인 동사로 바꿀 수 있는 명사화
- 일반 UI에 노출된 내부 모델 용어와 raw enum
- 확인되지 않은 `혁신적인`, `강력한`, `원활한` 같은 수식어
- 제목과 설명의 의미 반복

다음 수정은 하지 않는다.

- 수정률을 높이기 위한 동의어 교체
- 짧은 라벨과 상태를 긴 설명문으로 확장
- 보안·권한·파괴적 결과의 의미 약화
- 기술 표준어와 고유명사의 임의 순화
- UI에 문학적 리듬·은유·의인화 추가

## 7. AI 카피 검토 계약

### 7.1 작업 단위

문자열 하나가 아니라 같은 사용자 흐름의 문구를 copy set으로 묶는다. 최소 입력은 다음을 포함한다.

```json
{
  "schemaVersion": "1",
  "rulesetVersion": "<version>",
  "id": "<product-owned-copy-set-id>",
  "surface": "<route-or-workflow>",
  "audience": "<audience>",
  "task": "<user-task>",
  "roles": ["heading", "description", "button"],
  "items": [],
  "protected": {
    "machine": [],
    "humanReview": []
  }
}
```

### 7.2 보호 항목

- 제품·회사·프로토콜·API의 고유명사
- 숫자·날짜·기간·단위·제한
- placeholder, URL, route, ID 중 의도적으로 사용자에게 노출하는 값
- 부정·한정·필수·선택·최대·직후 같은 의미 제한
- 권한·보안·보존·외부 시스템 영향
- 상태 전이, 인과관계, 복구 가능성

`machine` 항목은 결정적으로 비교한다. 제품 동작·권한·생명주기처럼 구조만으로 판정할 수 없는 `humanReview` 항목은 필수 담당자가 확인한다.

### 7.3 판정

| 판정 | 조건 |
| --- | --- |
| `KEEP` | 자연스럽고 기준을 만족하며 의미 변화가 없음 |
| `REVISE` | 자연스러움·명확성·UI 적합성을 국소 수정할 수 있고 의미 변화가 없음 |
| `BLOCKED` | 실제 동작이 불명확하거나 기준이 충돌하거나 보호 항목을 보존할 수 없음 |

copy set 중 한 항목이라도 `BLOCKED`이면 전체 적용을 중단하고 확인 질문을 남긴다. AI는 위험도를 낮추거나 승인자를 생략할 수 없다.

### 7.4 위험도

| 등급 | 예 | 최소 처리 |
| --- | --- | --- |
| LOW | 확정적인 구두점·등록된 표기 수정 | 결정적 verifier 통과 후 제품 정책에 따라 자동화 가능 |
| MEDIUM | 설명·도움말·빈 화면·복구 문구의 의미 동일 재작성 | 카피 또는 제품 검토 |
| HIGH | 이름·권한·보안·삭제·보존·상태 전이·수치·외부 영향 | 제품 담당자와 필요한 전문 담당자 승인 |
| BLOCKED | 의미 불명확·계약 충돌·보호 항목 위반 | 수정하지 않고 제품 결정을 요청 |

## 8. 자동 검사 경계

### 결정적으로 차단할 수 있는 항목

- ASCII `...`처럼 명백한 구두점 위반
- copy set 전후 placeholder 집합 불일치
- 보호한 고유명사·숫자·단위 불일치
- 제품이 등록한 canonical name·상태 사전과의 불일치
- 사용자 UI에 raw enum·내부 식별자가 노출되는 명백한 경우

### 경고 또는 사람 검토로 남길 항목

- 번역투, 피동, 명사화, 추상어
- 대상 없는 모호한 행동명
- 설명문 문장부호와 정보량
- 과도한 길이 증가와 대규모 재작성
- tone과 정보 위계

새 검사를 도입할 때는 기존 위반을 먼저 report-only baseline으로 수집한다. 차단형 gate 전환은 영향 범위와 소비 제품을 제시하고 별도 승인을 받은 뒤 진행한다.

## 9. 제품 채택 계약

각 제품은 LDS 공통 schema를 소비하고 다음 파일 또는 동등한 source of truth를 소유한다.

```text
docs/product-copy/
  canonical-names.json
  state-dictionaries.json
  copy-sets.json
  exceptions.json
```

제품 채택 시 다음을 확인한다.

1. 모든 사용자 노출 route와 workflow를 inventory에 등록한다.
2. 제품 정식 명칭·상태 사전·권한·보존·외부 영향 tag를 제품이 정의한다.
3. 사용자에게 직접 노출되는 API 오류와 background job 상태를 포함한다.
4. 사용자 작성 내용·외부 서비스 원문·로그·코드 식별자를 자동 윤문에서 제외한다.
5. 보고서·채팅·PDF는 고정 템플릿과 생성 본문의 계약을 분리한다.
6. 자동 적용 전 제품·카피·보안 등 필수 승인자를 정한다.

## 10. 단계별 실행안

### Phase 0 — 기준선과 소유권 확정

- 기존 Writing·Voice and Tone·International Design·AI guide의 중복 규칙을 inventory한다.
- Portal 규칙을 공통 원칙과 제품 전용 규칙으로 분류한다.
- Foundation owner, copy contract owner, 제품 adapter owner를 지정한다.
- 현재 문구 위반은 수정하지 않고 baseline으로만 수집한다.

완료 기준: 규칙별 canonical owner와 이동 대상이 표로 확정된다.

### Phase 1 — 문서 재구성

- Writing에 UI 요소·상태·번역투·과윤문 규칙을 추가한다.
- Voice and Tone에 안전·권한·파괴적 동작의 의미 보존을 추가한다.
- International Design에 번역과 윤문 책임 경계를 추가한다.
- `COPY_REVIEW_CONTRACT.md`를 작성한다.
- AI guide의 중복 문구를 canonical 문서 링크로 바꾼다.
- Foundation structured content와 LLM bundle을 함께 갱신한다.

완료 기준: 같은 규칙이 여러 문서에서 서로 다른 표현으로 중복되지 않는다.

### Phase 2 — Schema와 report-only verifier

- copy set JSON Schema와 reason code를 정의한다.
- placeholder·숫자·단위·canonical term·raw enum 검사를 구현한다.
- 기존 위반을 baseline에 기록하고 신규 회귀만 보고한다.
- verifier 자체의 positive·negative fixture를 추가한다.

완료 기준: 동일 입력에 결정적인 결과를 내고 자연스러움은 차단하지 않는다.

### Phase 3 — 제품 adapter 시범 적용

- LK Portal 한 workflow를 시범 소비자로 연결한다.
- 이후 LK Web Viz와 LK Control에서 동일 schema 적용 가능성을 검토한다.
- 제품별 용어·상태·권한이 LDS 저장소로 역류하지 않는지 확인한다.
- API 오류와 background job 상태까지 copy inventory에 포함한다.

완료 기준: 한 제품의 copy set이 `KEEP`·`REVISE`·`BLOCKED` 흐름과 승인 기록을 끝까지 통과한다.

### Phase 4 — 회귀 gate 활성화

- 소비 제품과 ruleset version 정합을 확인한다.
- baseline과 예외의 owner·expiry를 검증한다.
- 영향 범위를 검토하고 별도 승인 후 신규 회귀에 한해 차단한다.
- 자동 수정은 LOW allowlist와 결정적 verifier가 있는 항목으로 제한한다.

완료 기준: 문구 변경이 실패 원인과 해결 위치를 명확히 보고하고 기존 제품을 무관하게 차단하지 않는다.

## 11. Portal 규칙 이관표

| Portal 문서 영역 | LDS 반영 | 처리 |
| --- | --- | --- |
| 적용 범위·우선순위 | Copy Review Contract | 공통화 |
| 제품 목소리 | Voice and Tone | 공통 원칙만 이관 |
| 문장 형태·문장부호 | Writing | 이관 |
| 이름 체계 | 제품 adapter | Portal에 유지 |
| 문맥형 용어집 | 제품 adapter + LDS 선택 원칙 | 용어는 유지, 선택 방법만 공통화 |
| 버튼과 링크 | Writing | 공통화 |
| 상태 용어 | 제품 adapter | 상태 구조만 공통화 |
| UI 상태별 문구 | Writing·Voice and Tone | 이관 |
| 폼과 접근성 | Writing·Accessibility Contracts | 책임별 분리 |
| 숫자·날짜·단위 | International Design | 기존 규칙과 병합 |
| 번역투와 AI식 한국어 | Writing | 이관 |
| AI 윤문 절차·출력 계약 | Copy Review Contract | 제품 ID를 제거해 공통화 |
| 사실 보존·과윤문 방지 | Copy Review Contract | 이관 |
| 위험도와 승인 | Copy Review Contract + 제품 adapter | 공통 하한선과 제품 승인자 분리 |
| 기계 검사 | Quality reference·verifier | report-only부터 도입 |
| 배포 전 검토 | Component Workflow 또는 별도 copy workflow | 필요한 항목만 연결 |
| 외부 도구 조사 | 참고 자료 | runtime dependency로 채택하지 않음 |

## 12. 완료 기준

- Writing, Voice and Tone, International Design, AI guide, Copy Review Contract의 책임이 중복 없이 설명된다.
- 제품 전용 명칭·상태·route가 LDS 공통 source에 포함되지 않는다.
- UI 상태별 문구와 번역투·과윤문 원칙이 Foundation 구조와 machine-readable content에 반영된다.
- copy set schema가 보호 항목과 `KEEP`·`REVISE`·`BLOCKED`를 검증한다.
- verifier는 결정적인 오류만 검사하고 자연스러움은 사람 판단으로 남긴다.
- 최소 한 제품이 product-owned adapter로 시범 적용을 완료한다.
- 차단형 gate 활성화 전에 영향 범위와 기존 위반 처리 방식이 별도 승인된다.

## 13. 승인된 구현 범위

첫 작업에서는 Phase 0과 Phase 1 문서 재구성까지만 수행했다. 이후 사용자가 schema·verifier·Portal adapter·차단 gate까지 명시적으로 승인해 Phase 2~4를 이어서 구현했다.

차단 범위는 LDS의 계약·fixture와 Portal의 등록된 copy set 및 기존 결정적 정적 검사로 한정했다. LK Web Viz·LK Control 등 다른 제품 채택은 각 제품 영향 검토와 별도 승인 대상으로 남긴다.

## 14. 구현 상태

2026-08-04 기준 Phase 0부터 Phase 4까지 반영했다.

- `foundations/writing.md`에 UI 상태·번역투·과윤문·제품 소유권 기준을 추가했다.
- `foundations/voice-and-tone.md`에 권한·보안·파괴적 동작의 의미 보존 기준을 추가했다.
- `foundations/international-design.md`에 번역과 같은 locale 안의 윤문 경계를 추가했다.
- `COPY_REVIEW_CONTRACT.md`를 안정 계약으로 추가했다.
- `AI_DESIGN_SYSTEM_GUIDE.md`의 상세 카피 규칙을 canonical Foundation과 Copy Review Contract로 연결했다.
- `foundation-content.json`과 생성된 Foundation guide·LLM bundle을 동기화했다.
- `KOREAN_UI_COPY_CONTRACT.schema.json`에 copy set·보호 항목·review·approval 구조와 공통 reason code를 정의했다.
- `check-korean-ui-copy.mjs`에 canonical hash·판정 정합·보호 값·approval binding 검사를 구현하고 positive `KEEP`·`REVISE`·`BLOCKED` 및 negative fixture를 연결했다.
- `KOREAN_UI_COPY_BASELINE.json`을 신규 finding ratchet으로 추가하고 `check:korean-ui-copy`를 LDS `check:fast`에 연결했다.
- LK Portal이 `docs/product-copy/`에서 canonical name·상태 사전·copy set·baseline·예외를 제품 소유로 관리하도록 분리했다.
- Portal `/work/context`의 AI 도구 연결 코드 발급 workflow와 사용자 반환 API 오류를 `context.ai-tool-credential` copy set으로 등록했다.
- Portal `copy:verify`가 source mapping·ruleset·hash·필수 tag·role·예외 만료·baseline 이후 승인 여부를 검사하도록 확장했고 `automation_status`를 `enabled`로 전환했다.

LDS 공통 source에는 Portal route·정식 명칭·상태 enum을 넣지 않았다. 현재 gate는 기존 source hash를 baseline으로 수용하고 신규 회귀와 미승인 hash만 차단하며, 자연스러움은 사람 판단으로 남긴다.
