# Handoff — 패밀리 일관성 안정화 독립 재감사 후 최종 검증 대기

Date: 2026-07-12
Branch: `main` · Current HEAD: `04eb718` · Historical full-green checkpoint: `c814576`

## 배경

이전 Codex 세션이 **패밀리 일관성 안정화**(버튼 → 입력·선택 → 오버레이 → Editor·Viewer 네 패밀리를
공통 시각·상태·동작 계약으로 수렴)의 `.jsx` 구현 변경을 마친 뒤, **검증 도중 토큰 소진으로 중단**됐다.
타입 검사만 통과한 상태였고 나머지 가드·화면 검수는 미완이었다. 후속 세션은 당시 전체 검증을
닫았지만, 이번 독립 재감사에서 놓친 P1·P2 잔여 계약이 확인되어 다시 보정했다.

## 커밋 (미커밋 상태였던 작업을 3개로 정리)

- `ff1e823` — IA·설명·네이밍 정규화 마일스톤(누적 미커밋분, 699파일). dist 빌드 산출물 제외.
- `478947a` — 끊긴 검증 1차 복구: api-drift, token-hygiene, wds-alignment.
- `c814576` — Storybook·접근성 검증 완료(이 문서의 핵심).

위 커밋은 이전 체크포인트 기록이다. 현재 `04eb718` 위의 재감사 보정분은 커밋하지 않았다.

## 독립 재감사에서 추가로 닫은 잔여 계약

1. **선택·입력** — Select가 비활성 옵션을 DOM·ARIA에 보존하면서 Arrow/Home/End 탐색과 선택에서는
   건너뛰도록 했다. disabled/readOnly 전환과 비활성 `defaultOpen`은 팝업을 닫고, 동적으로 활성 항목이
   비활성화되면 다음 유효 항목으로 이동한다.
2. **선택 계열 시각 문법** — SegmentedControl의 `interaction="inactive"`·`disable`을 disabled로 수렴하고,
   SegmentedControl·ButtonGroup의 외곽 높이를 sm/md/lg 32/40/48px로 통일했다. Radio·ChoiceCard까지
   disabled+selected를 primary 강조가 아닌 중립 상태로 맞췄다.
3. **메뉴·오버레이** — 빈 메뉴와 전체 비활성 메뉴도 Escape로 닫고 트리거 초점을 복원한다.
   SplitButton·Menubar는 협폭에서 flip/clamp되고, DropdownMenu footer는 실제 apply/cancel 계약이 있을
   때만 렌더되며 Tab·Shift+Tab·Escape 초점 계약을 갖는다. HoverCard의 `style`은 루트,
   `panelStyle`은 패널에만 적용된다.
4. **상태 긴급도** — ResourceState·ViewerFrame에서 콘텐츠가 차단되는 오류·연결 끊김·신호 없음은
   `role="alert"`/`aria-live="assertive"`, 보존 데이터나 설정 안내는 `status`/`polite`로 통일했다.
5. **공개 계층·WDS 증거** — ButtonGroup과 SplitButton을 `LDS Product/Action` 확장으로 재분류했다.
   `LAYER_CLASSIFICATION.json`, `COMPONENT_SOURCE_PDFS.json`, `COVERAGE_DETAIL_AUDIT.json`,
   `VARIANT_AUDIT_CHECKLIST.json`을 새 분류와 LDS 확장 판정에 맞췄다.

## 닫은 검증 실패 (연쇄)

끊긴 지점(api-drift) 이후 재검증하자 안정화가 남긴 문제들이 순차로 드러났다.

1. **api-drift 127건** — 신규 prop이 `.d.ts`/`.prompt.md`에 미반영. 오탐 85건은 체커가
   `extends *HTMLAttributes`를 해석 못 한 것이라 `check-api-drift.mjs`의 상속 prop 허용목록을
   표준 DOM 핸들러·`aria-*`·표준 폼 attr까지 확장. 진짜 문서 누락 42건은 11개 `.prompt.md`에 기재.
2. **token-hygiene** — 죽은 `--component-button-disabled-border`(transparent) 제거.
3. **wds-alignment** — 이름 바뀐 SegmentedControl 스토리 evidence repoint. 버튼 variant family는
   `.fig` 컴포넌트셋 직접 추출로 축이 확인돼(사용자 판정) `parity-confirmed-local-snapshot`으로 확정,
   completion gate variantCheck 46→49.
4. **inventory** — 스토리 수 갱신(공개 336→351, 전체 443→469, 4개 문서).
5. **storybook-ia** — 원장 재생성 + 검토 승격(39페이지 sha 갱신, 28개 신규 스토리). 공개 네이밍
   계약 위반 교정: 공개명 10개에서 내부어 "계약" 제거, 320px 스토리 3개 역할 interaction→responsive,
   Card Selection·Input Group 결정 가이드 복원, Hover Card 이름 라틴어→한글(호버·초점).
6. **접근성 play 3건** (브라우저 실측으로 근본 원인 규명):
   - EditorToolbar geometry play가 gap을 2px로 가정 → 실제 계약은 4px(`--space-1`). 브라우저 실측
     32px 컨트롤·4px 간격·140px 확인 후 play 상수 `*2`→`*4`. **컴포넌트가 옳고 play가 틀렸다.**
   - **Button 실제 버그**: `aria-busy={loading || undefined}`가 consumer가 넘긴 `aria-busy`를
     덮어씀. ManualControlSession의 "정지 요청 전송 중" pending 상태가 aria-busy를 잃었다.
     `aria-busy={loading || ariaBusy || undefined}`로 수정.
   - InputGroup이 비활성 시 루트에 `data-disabled`를 안 붙여 비활성 affix 텍스트가 axe color-contrast에
     걸림. `data-disabled` 추가(WCAG 1.4.3 면제, 다른 폼 컨트롤과 동일 패턴).
7. **접근성 target-size** — Card Selection의 시각적 숨김 1×1 input(카드가 실제 타깃)을 TARGET_SIZE
   baseline에 래칫(89개).
8. **visual-regression** — segmented 스토리 rename으로 끊긴 baseline을 후속 스토리로 repoint 후
   해당 baseline만 재생성(나머지 노이즈 재캡처는 되돌려 diff를 정직하게 유지).

## 이전 전체 검증 스냅샷 — 현재 보정 전

- **`npm run check` 전체 통과** (check:fast + check:storybook + check:pack, EXIT 0).
- 접근성: **469 스토리 / 153 play / 469 axe, 0 violations**, 이름 누락·implicit button·console error 0.
- 시각 스모크: 37 baseline 모두 임계값 내(0.000%~0.434%).
- 브라우저 화면 검수: 4개 패밀리 대표 스토리(버튼·segmented·input group·popover·selection inspector·
  manual control) **320px 가로 overflow 0**, 데스크톱 렌더 정상.

위 결과는 `c814576` 체크포인트에 대한 기록이다. 현재 미커밋 보정분의 전체 검증 결과로 재사용하면 안 된다.

## 현재 표적 검증 상태

다음 표적 검사는 현재 보정분에서 통과했다.

- `check:types`, `check:type-consumer`, `check:api-drift`, `check:api-grammar`
- `check:prompt-contracts`, `check:dimension-literals`, `check:contracts`
- `check:storybook-public`, `check:story-coverage`, `check:story-subjects`, `check:wds-alignment`

Storybook dev 화면에서는 다음을 대표 점검했다.

- ButtonGroup single/multiple의 sm/md/lg 외곽 높이 32/40/48px, 320px overflow 없음.
- Select 잠금·비활성 옵션, SplitButton 빈/전체 비활성 Escape와 협폭 배치, Menubar flip/clamp,
  DropdownMenu footer Tab·Shift+Tab·Escape 및 트리거 초점 복원.
- ResourceState의 보존 데이터는 `status`/`polite`, 차단 상태는 `alert`/`assertive`.
- ViewerFrame의 표시 오류·연결 끊김·신호 없음은 `alert`/`assertive`, 설정 안내는 `status`/`polite`.
- HoverCard는 루트 `style`과 패널 `panelStyle`이 분리되고 320px 가로 overflow가 없다.

브라우저 로그에는 이전 127.0.0.1 allowed-host 부팅 시점의 오래된 오류가 남아 있지만, 현재 대표 화면
탐색 중 새 컴포넌트 런타임 오류는 관찰되지 않았다.

## 메커니즘 메모 (다음 작업자용)

- **스토리 소스를 편집하면 그 페이지가 다시 stale-reviewed가 된다.** `report:storybook-ia`(--update) 뒤
  reviewedSourceSha256 = sourceSha256 재설정이 필요하다(이 세션은 반복 스크립트로 처리).
- **스토리 이름 변경은 storybook 재빌드 필수**(IA 리포트가 `storybook-static/index.json`에서 이름을 읽음).
  설명·결정 가이드 변경은 소스에서 읽으므로 재빌드 불필요.
- **공개 스토리명 규칙**(`report-storybook-information-architecture.mjs`): 첫 스토리 `개요`, 이후 역할
  접두어, 금지어 `계약/검증/핸들러/플레이그라운드`, 라틴어는 `ALLOWED_LATIN_STORY_TOKENS`만.
- **visual baseline 단일 갱신 불가** — `--update-baseline`은 37개 전체 재생성. 노이즈 재캡처는
  `git checkout`으로 되돌리고 manifest의 해당 항목만 손봐 diff를 최소화한다.
- dev 서버(`preview_start` storybook)와 `storybook build`를 **동시에 돌리지 말 것**(캐시 충돌).

## 다음 턴의 단일 최종 체크포인트

사용자가 이번 턴에는 전체 검증을 하지 말라고 명시했으므로 여기서 중단한다. 현재 Storybook dev 서버는
`127.0.0.1:6006`에 열려 있다. 작업트리는 미커밋·dirty 상태이며, 현재 tracked 수정 49건과
untracked `dist` 항목 813건이 있다. 다음 턴에는 아래 순서만 실행한다.

1. Storybook dev 서버를 중지한다. dev와 static build를 동시에 실행하지 않는다.
2. `npm run build:storybook`
3. `npm run report:storybook-ia`
4. 변경된 페이지를 실제 검토한 뒤 `reviewedSourceSha256`를 새 `sourceSha256`으로 승격한다.
5. `npm run check:storybook-ia`
6. `npm run check`를 한 번 실행한다.

모두 통과한 뒤에만 이 패밀리 안정화 goal을 완료로 표시한다. 그 다음 후보가
`docs/QUALITY_AUDIT_PLAN.md`의 P3 또는 D 트랙 medium 23 + low 10이다. origin push는 미실행이다.
