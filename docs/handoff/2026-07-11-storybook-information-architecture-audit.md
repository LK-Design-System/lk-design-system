# Handoff — Storybook 정보 구조 전수 감사

Date: 2026-07-11

Branch: `main` · HEAD: `3ead26d` · 이 세션에서 커밋 없음

Worktree: `git status --porcelain` 기준 **1300 entries dirty**. 다수 에이전트의 기존·동시 작업이 섞여 있으므로 reset, checkout, 대량 포맷, 무관 파일 수정 금지. 패치 직전 대상 파일을 다시 읽고 현재 내용을 보존할 것.

선행 품질·D 트랙 기록은 [quality-audit-and-design-review.md](2026-07-11-quality-audit-and-design-review.md)에 있다. 이 문서는 그 이후 수행한 Storybook 정보 구조 감사만 이어서 기록한다.

## 사용자 문제와 이번 작업 범위

사용자 관찰은 “LDS Core/Foundation은 철학과 가이드를 보여 주지만 Product·Robotics로 내려갈수록 스토리가 불친절하고 테스트 fixture처럼 보인다”는 것이었다. 바로 설명 문구를 대량 추가하면 잘못 묶인 페이지에 중복 작성하게 되므로, 먼저 전체 Storybook의 소유권과 학습 구조를 점검했다.

이번 세션은 **감사·원장·설명 계약 작성까지만 완료**했다. 18개 페이지 분리, 1개 병합, 스토리 이동·숨김, 실제 Canvas 안내 문구 작성은 아직 구현하지 않았다.

## 완료된 전수 감사

기준은 현재 `storybook-static/index.json`과 대응하는 `stories/*.stories.jsx`, 공개 export인 `src/index.js`다.

- 150개 페이지 / 422개 스토리 전부 검토
- 현재 공개 329 / 숨김 93
- 현재 숨김 93개 중 visual parity 82 / internal state·interaction contract 11
- 모든 페이지에 `primaryOwner`, `ownerComponents`, `supportingComponents` 기록
- 모든 스토리에 역할, 현재 visibility, 권장 visibility, 소유 컴포넌트 기록
- 모든 페이지·스토리에 사람 검토 상태와 검토한 소스 SHA 기록
- 페이지 판정: `keep` 131 / `split` 18 / `merge` 1 / `hide` 0
- 공개→숨김 권장: 10개. 적용 후 권장 공개 319 / 숨김 103

사용자가 느낀 불친절함은 수치로도 확인됐다.

- 150/150 페이지에 component-level Docs 설명은 있음
- Canvas에서 안내 서문이 보이는 페이지는 6개뿐
- 언제 사용하고 피하는지 판단 기준이 확인되는 페이지는 1개뿐
- 공개 스토리별 `docs.description.story`는 2개뿐

즉 설명의 존재보다 **위치, 페이지 소유권, 진입 순서**가 문제다. `docs.description.story`만 채우면 해결되지 않으며 첫 Canvas에도 목적과 관찰 지점이 보여야 한다.

## 구조 판정

### Foundation·Core·Theme

59페이지 / 147스토리를 검토했고 45개 유지, 14개 분리다.

- `LDS Core/Foundation/Effects and Interaction` → `Effects`, `Interaction`
- `Action Controls` → `Button Group`, `Split Button`, `FAB`
- `Annotations` → `Tooltip`, `Bubble`, `Bookmark`; Divider 증거는 Layout로 회수
- `Disclosure` → `Accordion`, `Collapsible`
- `Scroll and Accessibility` → `Scroll Area`, `Center`, `Visually Hidden`; AspectRatio는 Foundation으로 회수
- `Anchored Overlay` → `Popover`, `Hover Card`, `Dropdown Menu`
- `Menu` → `Dropdown Menu`, `Menubar`
- `Toast` → `Toast`, `Toast Stack`
- `Search and Autocomplete` → `Search Field`, `Autocomplete and Combobox`, `Tag Input`
- `Segmented and Toggle` → `Segmented Control`, `Toggle Button`
- `Selection Groups` → `Select`, `Checkbox`, `Radio`; stray ChoiceCard·Switch·Input은 기존 소유 페이지로 회수
- `Text Input` → `Input`, `Password Input`, `Input Group`, `Textarea`; Select는 자체 페이지로 이동
- `Loading State` → `Skeleton`, `Spinner`
- `Progress` → 작업 진행 `Progress`, 현재 측정값 `Meter`

페이지 전체 숨김 대상은 없다. `Confirm Dialog/OverlayStackContract`는 공개 사용 예제가 아닌 공통 overlay 회귀 계약이므로 숨김 전환 권장이다. `Foundation/Iconography/ColorBrandIcons`는 Product의 `Platform Marks`로 이동해야 한다.

### Product

68페이지 / 182스토리를 검토했고 66개 유지, 2개 분리다.

- `LDS Product/Action/Utility Actions` → `Copy Button`, `Link`
- `LDS Product/Selection and Input/File Upload Queue` → `File Upload`, `File Upload Queue`

`LDS Product/Navigation/Adaptive Navigation/RouterRenderer`는 router integration 회귀 계약이므로 숨김 또는 Docs 이동 권장이다. 기존 숨김 parity 21개는 그대로 유지한다.

### Robotics

23페이지 / 93스토리를 검토했고 20개 유지, 2개 분리, 1개 병합이다.

- `Manual Control Session` → 준비·권한 계약과 `Manual Control Stop & Recovery`로 분리
- `Viewer/Telemetry` → `Status/Telemetry Gauge`, `Status/Telemetry Value`로 분리
- `History Toolbar` 페이지 → `Command Bar`에 병합. 독립 public API는 유지

Robotics 공개→숨김 권장 8개:

- Joystick의 복수 화살표 chord 재계산
- stop 요청 직후 unmount, legacy callback alias
- Selection Inspector의 `0·false·빈 값 보존`
- 3D Scene과 Video Stream의 중복 공통 상태 contract
- Floor Selector의 문자열 shorthand
- Telemetry의 threshold 방향 호환

공통 Viewer 상태 설명의 공개 단일 소유자는 `Shared Viewer Frame`이어야 한다. `Editor Toolbar`와 `Viewer Toolbar`의 일부 스토리는 사용자용 disabled/keyboard 안내와 동적 reorder·mount 회귀 계약을 공개/숨김으로 다시 나눠야 한다.

## 작성된 파일

- [Storybook 정보 구조와 설명 계약](../STORYBOOK_INFORMATION_ARCHITECTURE.md)
  - 역할 9종, 소유권 규칙, `keep/merge/split/hide` 기준
  - Foundation/Core/Product/Robotics/Theme별 설명 순서
  - 전수 판정 요약과 적용 순서
- [전수 감사 원장](../references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json)
  - 150페이지와 422스토리의 완전한 행 단위 기록
  - 변경된 story source SHA가 검토 SHA와 달라지면 stale로 실패
- `scripts/report-storybook-information-architecture.mjs`
  - built index + TypeScript AST로 역할·소유·visibility·설명 증거를 갱신
  - `--check`에서 중복 id/title, 빈 owner, pending/stale review, 잘못된 disposition/target을 차단
- `package.json`
  - `report:storybook-ia`
  - `check:storybook-ia`
- `docs/COMPONENT_WORKFLOW.md`, `docs/REPOSITORY_INVENTORY.md`
  - 새 기준 문서와 원장 링크 추가

가드는 Scope Escalation Gate 때문에 `npm run check`나 `check:storybook`에 자동 연결하지 않았다. 사용자의 별도 승인이 있기 전에는 standalone으로 유지한다.

## 검증 결과

다음은 모두 통과했다.

```powershell
node --check scripts/report-storybook-information-architecture.mjs
npm run report:storybook-ia
npm run check:storybook-ia
npm run check:inventory
git diff --check -- scripts/report-storybook-information-architecture.mjs docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json docs/STORYBOOK_INFORMATION_ARCHITECTURE.md docs/COMPONENT_WORKFLOW.md docs/REPOSITORY_INVENTORY.md package.json
```

핵심 검증 출력:

- 150 page titles unique
- 422 story ids unique
- reviewed pages 150 / reviewed stories 422
- 빈 page/story owner 0
- stale reviewed pages 0
- 18 split 모두 target 있음, 1 merge target 있음
- inventory 192 implementations / 198 named exports / 422 stories / 329 public / 93 hidden / 82 parity

스토리 소스·컴포넌트 구현은 바꾸지 않았으므로 전체 Storybook build/a11y/pixel suite는 다시 돌리지 않았다.

## 다음 에이전트의 정확한 재개 순서

1. `AGENTS.md`, 이 핸드오프, `docs/STORYBOOK_INFORMATION_ARCHITECTURE.md`, 감사 원장을 먼저 읽는다.
2. 설명을 쓰기 전에 18개 split과 1개 merge를 좁은 영역별 배치로 적용한다. public component API를 없애는 작업으로 확대하지 않는다.
3. 공개→숨김 10개와 교차 소유 story를 이동한다. 기존 visual parity 82개는 `!dev` + `visual-parity`를 유지한다.
4. 각 새 페이지의 첫 공개 story를 `overview` 또는 Foundation reference 진입점으로 확정한다.
5. Canvas-visible 짧은 안내와 `parameters.docs.description.story`를 함께 쓴다. Product는 workflow·소유 경계·recovery, Robotics는 전제조건·안전 경계·복구를 특히 명시한다.
6. composed UI는 정상 폭과 좁은 폭에서 읽기 순서, overflow, long content, error/disabled 복합 상태를 렌더 확인한다.
7. Storybook을 다시 빌드한 뒤 `npm run report:storybook-ia`를 실행한다. 변경·신규 페이지는 pending/stale가 되는 것이 정상이다. 실제 사람 검토 후에만 해당 page/story의 `reviewStatus`, `reviewMethod`, `reviewedSourceSha256`를 갱신한다. 자동으로 reviewed 처리하지 않는다.
8. 최소 `check:storybook-ia`, `check:inventory`, `check:storybook-public`, 영향 story의 play/a11y를 통과시킨다. 최종 구조 변경이 모두 끝난 시점에만 전체 Storybook 검증을 한 번 실행한다.

## 주의할 점

- 현재 원장은 **판정과 계획**이며 story 파일에 아직 적용된 상태가 아니다.
- `npm run report:storybook-ia`는 인벤토리를 갱신하지만 사람 검토를 대신하지 않는다.
- 구조 변경 도중 감사 원장의 기존 판정을 무조건 덮어쓰지 말 것.
- shared token 값 변경, 공개 API 재구성, 대량 component redesign으로 범위를 넓히려면 사용자 승인을 먼저 받을 것.
- 현재 worktree가 매우 크게 dirty이므로 무관 변경을 정리하거나 되돌리지 말 것.

