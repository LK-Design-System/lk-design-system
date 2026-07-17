# Storybook 정보 구조와 설명 계약

| Field | Value |
| --- | --- |
| Type | Stable contract and current audit summary |
| Status | Current |
| Owner | Storybook information-architecture owner |
| Last reviewed | 2026-07-13 |
| Machine-readable source | `references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json` |

이 문서는 Storybook의 페이지 소유권, 스토리 역할, 공개 여부, 설명 순서를 정의한다. 전수 감사 원장은 [`references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`](references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json)에 있으며, 감사·계획·커버리지 화면을 Storybook에 추가하지 않는다.

## 현재 기준선

2026-07-17 현재 소스에서 재생성한 정적 빌드 기준으로 189개 페이지와 577개 스토리가 있다. census 판정은 모두 `keep`다.

- 공개 스토리: 441개
- 숨김 스토리: 136개
- 숨김 visual parity: 99개
- 숨김 internal contract: 37개
- 검토 완료 페이지 177/189개, 스토리 534/577개

인간 disposition 검토는 직전 177개 페이지 / 534개 스토리 기준선까지 완료돼 있다. 그 이후 Robotics Foundation 원자화로 추가·변경된 페이지(신규 12개 페이지·43개 스토리, 변경 2개 페이지)는 다음 `check:storybook-ia` 검토 패스를 기다리며, 그 전까지 아래 레이어별 진입 가이드·설명 계약 수치는 마지막 완료 검토(534개 스토리 / 공개 408개) 기준이다.

- 컴포넌트 설명이 있는 페이지: 173개(마지막 검토 기준)
- Canvas에서 안내 서문을 직접 보여 주는 페이지: 177개(마지막 검토 기준)
- 사용/비사용 판단 기준이 확인되는 페이지: 172개(Foundation 페이지는 사용 판단 대신 원리·제약 계약을 적용할 수 있음, 마지막 검토 기준)
- 목적 설명이 있는 공개 스토리: 408개(마지막 검토 기준)
- Foundation 진입 가이드: 7/7페이지, 공개 스토리 설명: 11/11개(마지막 검토 기준)
- Core 진입 가이드: 52/52페이지, 공개 스토리 설명: 81/81개(마지막 검토 기준)
- Product 진입 가이드: 86/86페이지, 공개 스토리 설명: 203/203개(마지막 검토 기준)
- Robotics 진입 가이드: 29/29페이지, 공개 스토리 설명: 108/108개(마지막 검토 기준)
- Theme 진입 가이드: 3/3페이지, 공개 스토리 설명: 3/3개(마지막 검토 기준)
- 공개 스토리 표시명 계약: 408/408개(`개요` 또는 역할 접두어, 마지막 검토 기준)
- 이름을 바꾼 페이지의 기존 story id 보존: 5/5페이지

모든 페이지는 첫 공개 스토리 `개요`의 Canvas에서 `오버라인 → 제목 → 사용 기준 또는 Foundation 제약`을 읽고, 역할 접두어로 정렬된 공개 스토리의 Docs 설명에서 상황과 확인 지점을 이어서 볼 수 있다.

## 전수 감사 판정

직전 검토 패스에서 177개 페이지와 534개 스토리를 소스 AST와 빌드 인덱스에 대조해 모두 검토했다. 최초 후보 18개 분리와 1개 병합은 `.fig`의 각 COMPONENT_SET 정의, LDS 공개 API, 스토리 상호작용 계약을 다시 확인한 뒤 다음처럼 수습했고, 후속 domain expansion 페이지도 같은 role·visibility·description 계약으로 검토했다.

- 13개 구조 분리 실행: `Effects and Interaction`, `Action Controls`, `Annotations`, `Anchored Overlay`, `Menu`, `Segmented and Toggle`, `Selection Groups`, `Text Input`, `Loading State`, `Progress`, `Utility Actions`, `File Upload Queue`, `Telemetry`
- 5개 분리 기각·keep 정정: `Scroll and Accessibility`, `Disclosure`, `Search and Autocomplete`, `Toast`, `Manual Control Session`
- 1개 병합 기각·keep 정정: `History Toolbar`
- 공개 내부 계약 10개를 `!dev`로 전환하고 신규 Communication·VirtualKeypad·Robotics Navigation 실컴포넌트 회귀 표면 7개를 더해 그 검토 시점 visual parity를 89개로 유지했다(이후 Robotics Foundation 원자 페이지 회귀 표면이 더해져 현재 census는 99개다)

최종 구조에서는 분리된 각 페이지가 독립 소유자를 가지므로 census 판정은 `keep` 189개, `split` 0개, `merge` 0개, `hide` 0개다. 직전 검토 패스는 177개 페이지·534개 스토리를 완료했고 공개·숨김 권고 불일치는 0개였다. 이후 Robotics Foundation 원자화로 추가된 12개 페이지·43개 스토리와 변경된 2개 페이지는 아직 재검토 전이며, `check:storybook-ia`가 이 재검토를 회귀 방지한다. Communication 2페이지와 Navigation 5페이지는 직전 검토에서 source hash, 공개 이름, 역할, 표적 play/Axe 결과로 재검토했다.

정정 근거는 다음과 같다.

- `ToastStack`은 별도 사용자 선택이 아니라 Toast의 배치·집계 wrapper이므로 공개 `Stack and placement` 예제를 Toast 페이지가 소유한다.
- `Manual Control Session`은 준비, 권한, 입력, stop, recovery가 하나의 안전 상태 머신이므로 stop 전용 페이지로 끊지 않는다.
- `HistoryToolbar`는 Command Bar가 합성하더라도 독립 public API, prompt, keyboard contract를 가지므로 병합하지 않는다.
- `Scroll and Accessibility`, `Disclosure`, `Search and Autocomplete`는 수락된 `.fig` 내부 component-set에서 독립 WDS 축을 확인할 수 없어 WDS 분리 근거로 승격하지 않는다.
- `Meter`는 Progress와 학습 소유권을 분리했지만 현재 `ProgressBar` 합성으로 `role="progressbar"`가 노출되는 호환성 한계를 스토리에 명시하며, 엄격한 meter semantics가 필요한 제품에는 해소 전 권장하지 않는다.

상세한 페이지별 소유자, 스토리 역할, 공개 여부와 검토 해시는 감사 원장을 기준으로 한다. `npm run check:storybook-ia`는 전 레이어의 첫 진입 가이드, 사용·비사용 기준(Foundation은 원리·제약), 모든 공개 스토리 설명, 공개 이름·역할 순서, 공개·숨김 권고 일치를 회귀 방지한다.

## 페이지 소유권

모든 페이지는 하나 이상의 `ownerComponents`와 하나의 `primaryOwner`를 가져야 한다.

- `primaryOwner`: 페이지의 이름과 공개 계약을 소유하는 컴포넌트 또는 Foundation/Theme 주제
- `ownerComponents`: 같은 페이지에서 공동으로 설명하는 동일 계열 컴포넌트
- `supportingComponents`: 예제를 구성하지만 페이지의 주제가 아닌 Button, Icon, StatusBadge 등의 보조 컴포넌트

보조 컴포넌트를 소유자로 세지 않는다. 같은 컴포넌트의 공개 홈을 여러 페이지에 만들지 않으며, 다른 페이지에서 사용할 때는 일반 명사로 설명하고 정식 소유 페이지를 연결한다.

## 스토리 역할

모든 스토리는 다음 중 정확히 하나의 역할을 가진다.

| 역할 | 목적 | 기본 공개 여부 |
| --- | --- | --- |
| `foundation-reference` | 원리, 토큰, 의미 모델, 참조 맵 | 공개 |
| `overview` | 무엇이며 언제 선택하는지 알려 주는 진입점 | 공개 |
| `usage` | anatomy, 구성, 배치, 사용·비사용 기준 | 공개 |
| `variants-states` | variant, size, tone, disabled/loading/empty/error 상태 | 공개 |
| `interaction` | keyboard, focus, pointer, controlled state, lifecycle | 공개 |
| `responsive` | narrow/mobile/compact/wide, wrapping과 overflow | 공개 |
| `scenario` | 재사용 계약을 설명하는 Product/Robotics 상황 | 공개 |
| `visual-parity` | 실제 컴포넌트 표면의 시각 회귀 | `!dev` 숨김 |
| `internal-contract` | 사용자 탐색보다 자동 검증이 주목적인 상태·상호작용 계약 | `!dev` 숨김 |

페이지의 공개 순서는 `overview → foundation-reference → usage → variants-states → interaction → responsive → scenario`다. 첫 공개 스토리는 페이지 진입점인 `개요`이고, 같은 Foundation 페이지의 추가 참조만 그 뒤에 온다. 숨김 역할은 순서와 무관하게 sidebar에 노출하지 않는다.

## 사이드바 네이밍과 정렬 계약

- 레이어와 그룹은 `LDS Core`, `LDS Theme`, `LDS Product`, `LDS Robotics`처럼 영문 소유권 어휘를 사용한다.
- 단일 컴포넌트 페이지는 공식 영문 API 명칭을 쓴다. 여러 컴포넌트를 함께 소유하는 공개 페이지는 `Primitives` 또는 `Patterns`처럼 묶음임을 이름에서 밝힌다.
- 페이지를 더 명확한 이름으로 바꾸더라도 기존 meta `id`를 명시해 공개 story id와 저장된 링크를 유지한다.
- 모든 페이지의 첫 공개 스토리 표시명은 `개요`다. 이후 표시명은 역할에 맞춰 `참조 · …`, `사용법 · …`, `변형·상태 · …`, `상호작용 · …`, `반응형 · …`, `시나리오 · …` 문법을 사용한다.
- 공개 스토리명은 사용자에게 관찰되는 한국어 상황과 결과를 적는다. 브랜드, 표준, 키 이름, `2D`·`3D`·`320px` 같은 단위 외에는 일반 영문이나 `계약`·`검증`·`핸들러` 같은 내부 작성 용어를 노출하지 않는다.
- 병렬 절은 ` · `로 구분하고, `라이트·다크`처럼 하나의 짝을 이루는 낱말은 붙여 쓸 수 있다.
- 그룹 순서는 명시적으로 유지하고, 그룹 안 페이지는 Foundation의 학습 순서 예외를 제외하면 숫자를 인식하는 자연 알파벳순으로 정렬한다. 공개 스토리는 위 역할 순서로 정렬한다.
- `visual-parity`와 `internal-contract` 숨김 스토리는 사용자 탐색 대상이 아니므로 공개 표시명 문법의 적용 대상에서 제외한다.

## 공개 페이지 최소 계약

모든 public 페이지는 다음을 충족해야 한다.

1. 첫 공개 스토리는 페이지의 진입점이며 한 문장 정의를 Canvas에서 보여 준다.
2. “언제 사용하고 언제 피하는가”를 함께 설명한다.
3. 핵심 anatomy 또는 정보·상호작용 읽기 순서를 밝힌다.
4. 중요한 variant/state와 keyboard/focus 계약으로 이어지는 순서를 제공한다.
5. 개별 스토리는 `parameters.docs.description.story`에 “상황”과 “확인할 점”을 1~2문장으로 기록한다.
6. 좁은 폭, 긴 콘텐츠, 오류, disabled 같은 복합 상태는 왜 별도 스토리인지 설명한다.
7. 관련 컴포넌트와 선택 기준, DS 계층에서 의도적으로 제외한 범위를 연결한다.

설명은 긴 에세이가 아니라 의사결정을 돕는 짧은 문장이어야 한다. play 함수나 테스트 오류 문구는 사용자 가이드의 대체물이 아니다.

## 영역별 설명 계약

### Foundation

순서는 `철학/원리 → semantic model → token/reference map → 제약 → 시각 예시`다.

- 왜 이 foundation이 존재하는지 먼저 설명한다.
- 토큰 이름보다 의미 역할과 계층을 앞세운다.
- 값·스케일·방향을 실제 표면 예시와 연결한다.
- LK Theme override와 WDS에서 계승한 구조를 구분한다.
- 특정 컴포넌트 사용법으로 범위를 확장하지 않는다.

### Core Components

순서는 `정의 → 사용/비사용 기준 → anatomy → variants/states → interaction/accessibility → 관련 컴포넌트`다.

- 기본 상태만 보여 주지 말고 선택 기준을 제시한다.
- WDS Core인지 LK Theme override인지 밝힌다.
- 역할이 겹치는 sibling과 차이를 설명한다.
- keyboard, focus, disabled, error 계약을 눈에 보이는 예제와 연결한다.
- parity와 내부 contract 스토리는 숨기되 실제 사용자 상태는 공개한다.

### Product

순서는 `사용자 문제 → 재사용 가능한 업무 맥락 → composition/ownership → states/recovery → responsive → 제외 범위`다.

- 앱 화면이나 완성 workflow가 아니라 재사용 가능한 Product 패턴임을 설명한다.
- 어떤 Core 컴포넌트를 조합하고 어떤 계약을 새로 소유하는지 밝힌다.
- loading/empty/error/stale/permission 상태에서 사용자가 다음에 할 일을 보여 준다.
- 정상 폭과 좁은 폭의 정보 우선순위 차이를 설명한다.
- 제품별 데이터·권한·정책은 consumer가 제공해야 함을 명시한다.

### Robotics

순서는 `운영자 목표 → 연결/권한/안전 전제 → 읽기·제어 순서 → 상태 전이 → 실패/복구 → 현장·좁은 폭 제약`이다.

- 장비 상태와 조작 가능 상태를 분리한다.
- authority, connectivity, arming, safe release 같은 선행 조건을 먼저 설명한다.
- 위험하거나 되돌리기 어려운 동작의 확인·중단·복구 경로를 밝힌다.
- 색·아이콘·모션만으로 안전 상태를 전달하지 않는다.
- 포커스 상실, 연결 끊김, 지연, 입력 장치 해제 같은 비정상 경로를 정상 예제만큼 친절하게 설명한다.

### Theme 보조 계약

Theme 페이지는 `브랜드 역할 → 허용 표면 → variant → contrast/asset 제약 → 피해야 할 사용` 순서를 따른다. Theme 자산을 Foundation 원리나 Product workflow처럼 설명하지 않는다.

## 페이지 판정 규칙

각 페이지는 감사 원장에서 정확히 하나의 판정을 가진다.

- `keep`: 고유한 소유자와 재사용 계약이 있으며 현재 페이지 경계가 적절함
- `merge`: 같은 소유자·같은 선택 질문을 다른 페이지와 중복 설명함. `dispositionTarget` 필수
- `split`: 서로 독립적으로 선택되는 복수 계약이 한 페이지에 묶임. 새 페이지 목표를 `dispositionTarget`에 기록
- `hide`: 공개 학습 가치가 없고 visual parity 또는 internal contract만 남음

페이지를 유지하더라도 개별 스토리의 공개 여부는 바꿀 수 있다. “테스트가 있다”는 공개 사유가 아니며, “복합 예제다”라는 이유만으로 분리하지 않는다.

## 감사와 갱신

```powershell
npm run report:storybook-ia
npm run check:storybook-ia
```

새 스토리를 추가하거나 title, tags, 소유 컴포넌트를 변경하면 원장을 갱신한 뒤 새 역할과 페이지 판정을 사람이 검토한다. `--update`는 인벤토리를 동기화할 뿐, 새 페이지를 자동으로 유지 판정해도 검토가 끝났다는 뜻은 아니다.
