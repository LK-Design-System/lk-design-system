# Storybook 정보 구조와 설명 계약

이 문서는 Storybook의 페이지 소유권, 스토리 역할, 공개 여부, 설명 순서를 정의한다. 전수 감사 원장은 [`references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`](references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json)에 있으며, 감사·계획·커버리지 화면을 Storybook에 추가하지 않는다.

## 현재 기준선

2026-07-11 빌드 기준으로 150개 페이지와 422개 스토리가 있다.

- 공개 스토리: 329개
- 숨김 스토리: 93개
- 숨김 visual parity: 82개
- 숨김 interaction/state contract: 11개
- 컴포넌트 설명이 있는 페이지: 150개
- Canvas에서 안내 서문을 직접 보여 주는 페이지: 6개
- 사용/비사용 판단 기준이 확인되는 페이지: 1개
- 개별 공개 스토리의 목적 설명이 확인되는 사례: 2개

즉, 메타데이터의 존재보다 설명의 위치와 학습 순서가 문제다. 설명은 Docs 탭에만 묻히지 않고 사용자가 처음 보는 Canvas에서도 목적과 관찰 지점을 알 수 있어야 한다.

## 전수 감사 판정

150개 페이지와 422개 스토리를 소스와 빌드 인덱스에 대조해 모두 검토했다. 현재 구조에 대한 페이지 판정은 `keep` 131개, `split` 18개, `merge` 1개, `hide` 0개다. 모든 페이지에 실제 디자인 시스템 표면이 하나 이상 있어 페이지 전체를 숨길 대상은 없지만, 공개 스토리 10개는 사용자 가이드가 아닌 내부 회귀 계약으로 판단해 숨김 전환을 권장한다.

분리·병합 대상은 다음과 같다. 이 판정은 컴포넌트 API를 없애는 결정이 아니라 Storybook의 공개 학습 홈과 설명 소유권을 바로잡는 결정이다.

- Foundation: `Effects and Interaction`을 `Effects`와 `Interaction`으로 분리
- Core Action/Content/Layout: `Action Controls`, `Annotations`, `Disclosure`, `Scroll and Accessibility` 분리
- Core Overlay: `Anchored Overlay`, `Menu`, `Toast` 분리
- Core Selection and Input: `Search and Autocomplete`, `Segmented and Toggle`, `Selection Groups`, `Text Input` 분리
- Core Status: `Loading State`를 `Skeleton`과 `Spinner`로, `Progress`를 작업 진행과 `Meter` 측정값으로 분리
- Product: `Utility Actions`를 `Copy Button`과 `Link`로, `File Upload Queue`를 `File Upload`와 queue 계약으로 분리
- Robotics: `Manual Control Session`의 준비·권한과 stop/recovery 계약을 분리하고, `Telemetry`를 `Telemetry Gauge`와 `Telemetry Value`로 분리
- Robotics: `History Toolbar` 페이지를 `Command Bar`에 병합하되 독립 public API는 유지

공개에서 숨김으로 옮길 10개 스토리는 다음 부류다.

- Core: 공통 overlay stack 회귀 계약 1개
- Product: adaptive navigation의 router renderer 통합 훅 1개
- Robotics: joystick chord 재계산, stop 요청 unmount·legacy callback, primitive 값 보존, 3D·Video 공통 상태 중복, 문자열 floor shorthand, threshold 방향 호환 등 8개

기존 숨김 visual parity 82개와 내부 contract 11개는 현재 위치가 적절하다. 따라서 구조 적용 후 권장 공개 수는 319개, 권장 숨김 수는 103개다. 상세한 페이지별 대상, 스토리 역할, 소유 컴포넌트, 공개 권장은 감사 원장을 기준으로 한다.

설명 확장은 다음 순서로 진행한다.

1. 18개 분리와 1개 병합을 먼저 적용해 공개 홈을 확정한다.
2. 공개→숨김 10개와 중복·교차 소유 스토리를 이동한다.
3. 각 페이지의 첫 `overview` 또는 Foundation reference 진입점을 정한다.
4. Canvas 안내와 `docs.description.story`를 영역별 계약에 맞춰 작성한다.
5. 정상 폭과 좁은 폭에서 실제 읽기 순서와 상태 설명을 확인한다.

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

페이지의 권장 공개 순서는 `overview/reference → usage → variants-states → interaction → responsive → scenario`다. 숨김 역할은 순서와 무관하게 sidebar에 노출하지 않는다.

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
