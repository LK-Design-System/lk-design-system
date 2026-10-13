# Compass R8 변경 사항과 후속 작업

R8의 컨트롤 피드백과 Overlay 수정은 authoring source에 적용해 원격으로 업로드했습니다. 공유 그림자·글자 굵기·모서리의 채택 결정과 Linux에서 생성 산출물을 갱신한 뒤 수행하는 검증은 남아 있습니다. 이 기록은 2026-10-13의 source snapshot이며 R8 완료나 제품 배포를 뜻하지 않습니다.

| Field | Value |
| --- | --- |
| Type | Working source handoff |
| Status | Source applied and uploaded; shared shape decision and Linux generated qualification pending |
| Owner | Design system owner · Foundation owner |
| Last reviewed | 2026-10-13 |
| Roadmap | [LDS Roadmap R8](../../LDS_ROADMAP.md#121-r8--컨트롤-피드백과-모션대표-예제-개선) |
| Source commit | [`be26eae8`](https://github.com/LK-Design-System/lk-design-system/commit/be26eae86d62799c2851de6f16792311198d9d1d) · includes `b06f51c7` |

## 데모와 형태 시안

- [변경 사항 임시 데모](../../../assets/reviews/compass-r8/index.html) · [Pages 공개 경로](https://lk-design-system.github.io/lk-design-system/assets/reviews/compass-r8/)
- [공유 형태 비교 시안](../../../assets/reviews/compass-r8/shape-comparison.html)

임시 데모는 기존 Storybook 예제를 iframe으로 불러옵니다. 12개 story ID, 스크립트 문법, 상대 링크와 폰트 경로를 정적으로 확인했습니다. 로컬 브라우저가 데모 접근을 차단해 새 데모 페이지의 화면·조작 검토는 완료하지 못했습니다. 아래의 컴포넌트 UI 검증 기록은 기존 source Storybook에서 확인한 결과입니다. 공개 경로의 게시 여부는 이 snapshot 이후 Pages 실행 결과와 실제 응답을 기준으로 판단합니다.

형태 비교는 실제 Button/Input `size="lg"`와 Card/ListCell 기본값을 SSR로 렌더한 **미채택 정적 시안**입니다. 기존 default/ops의 높이와 간격을 유지하면서 그림자 제거, 600→500 굵기 변경, 모서리 +4px를 각각 한 축씩 비교합니다. 공유 형태 값은 변경하지 않았습니다. 시안 생성 시점에 실제 font 로드와 브라우저 layout 검토는 완료하지 않았으며 hover·focus·모션 검증도 이 정적 시안의 범위가 아닙니다.

## 적용한 변경

- Button 계열의 색·테두리 피드백을 기존 fast timing으로 맞췄습니다. 공유 alias를 사용하는 13개 소비 경로를 확인했고, Combobox field의 base 전환은 유지했습니다.
- solid SegmentedControl의 선택면이 이동합니다. 선택 값과 radio state는 즉시 반영하며 키보드, disabled, 긴 문구, resize, RTL과 사용자 지정 paint를 보존합니다.
- Switch·Accordion·Collapsible은 reduced-motion에서 보간을 제거하면서 최종 상태와 위치를 유지합니다. Sheet·Modal·Popover는 퇴장 화면을 잠시 유지해도 초점·입력·모달 상태의 해제를 늦추지 않습니다.
- Motion의 재생·정지·프로필 전환 예제와 AvatarGroup·PageIndicator·Lightbox의 첫 예제를 보강했습니다. PIN·WheelPicker·PrimaryDetail·Carousel은 기존 공개 예제의 적합성을 확인했습니다.
- 승인된 Overlay 수정은 부모 닫힘과 자식 interaction을 함께 처리하고, 재열기에서 이전 즉시 unmount와 같은 자식 local-state 초기화를 보존합니다. 부모 Menu가 자식 Modal의 키 이벤트를 먼저 처리하던 경로도 수정했습니다.

## 승인된 Overlay 계약

`OverlayPortal.open`은 렌더 수명, 선택적 `interactionOpen?: boolean`은 자식 LDS overlay의 interaction 수명을 제어합니다. `interactionOpen`의 기본값은 `open`입니다. false이면 생성된 Portal host가 `aria-hidden`, `inert`, `pointer-events: none` 상태가 됩니다. `withinPortal=false`에서는 DOM host를 추가하지 않으므로 inline 표면 소유자가 숨김·inert·pointer 차단과 modal ARIA 해제를 적용해야 합니다.

실제 open이 false가 되면 dismiss·focus trap·background inert·scroll lock을 해제하고 호출 지점으로 초점을 복원합니다. 재열기는 자식 subtree를 재생성하지만 consumer-controlled 값과 callback을 덮어쓰지 않으며 부모 닫힘으로 자식 dismiss callback을 합성하지 않습니다. DropdownMenu의 두 region handler와 shared keyboard handler는 `isTopmost`와 `defaultPrevented`를 확인해 자식에서 처리한 이벤트를 부모가 다시 처리하지 않도록 합니다.

이 선택적 공개 prop과 Menu key guard는 2026-10-13 사용자 승인으로 별도 승격해 `be26eae8`에 분리했습니다. 기존 named export와 hook signature/return은 유지합니다. 자세한 소유권은 [Overlay platform contract](../../OVERLAY_PLATFORM_CONTRACT.md)를 따릅니다.

## 검증한 범위

| 범위 | 결과 |
| --- | --- |
| Control source 회귀 | 17/17 통과. 반복 선택, 사용자 지정 paint, 방향 변경과 reduced-motion 등 변경 대상의 회귀를 확인했습니다. |
| Overlay source 회귀 | 실제 적용 source에서 27/27 통과. 부모 닫힘, controlled/subtree-owned 재열기, 자식 우선 Escape, 초점·scroll lock·inert 복원을 확인했습니다. |
| 추가 Overlay probe | 34개 통과. Menu 부모 action에서 연 Modal, inline/Popover 부모, 독립 root, 세 단계 Escape, StrictMode 등을 확인했습니다. 검증한 9개 runtime 파일의 hash가 적용 source와 같아 증거를 재사용합니다. |
| 좁은 source 계약 검사 | engine reuse, prompt contracts, design system contracts와 변경 d.ts의 strict 타입 검사 통과. 생성 package를 읽는 검사는 source 검증 근거에 포함하지 않았습니다. |
| 대표 desktop UI | 1280px light/default Button, 1280px dark/default Modal, 적용 후 1280×720 light/default 중첩 Modal의 자식 우선 Escape와 초점 복원을 확인했습니다. |
| 대표 narrow UI | 390px의 Button·SegmentedControl·Switch·Disclosure·Sheet·Popover·대표 예제, 320px Modal을 확인했습니다. 적용 후 390×844 dark/ops의 긴 Sheet와 Popover에서 화면 내 배치와 가로 넘침 없음을 확인했습니다. |

상태·프로필별 상세 조합은 [R8 검증 기록](../../LDS_ROADMAP.md#r8-로컬-source-검증-기록--2026-10-13)에 있습니다. 이는 Chromium authoring source의 대표 검토이며 전체 story/appearance 조합, SSR/hydration, 다른 브라우저, custom portal target이나 packed package 검증을 대신하지 않습니다.

[CI 38321662277](https://github.com/LK-Design-System/lk-design-system/actions/runs/38321662277)은 `docs/foundations/motion.md`의 stale 생성 문서로 실패했습니다. [Pages 38321662285](https://github.com/LK-Design-System/lk-design-system/actions/runs/38321662285)는 성공했습니다. Pages 성공과 source 검사 통과는 Linux 생성 산출물 검증 완료나 패키지 발행·제품 배포의 근거가 아닙니다.

## 제품과 LDS의 책임

Portal은 기간별 조회, 권한, 응답 방식과 controlled 상태를 소유하고 LDS는 선택면·전환·키보드·초점을 소유합니다. Portal의 패키지 채택은 남아 있습니다. Web Viz는 기존 LdsDialog와 Button/IconButton 계약을 소비할 수 있지만 maintenance-only 참조이며 제품 migration은 승인 범위가 아닙니다. Full Daedeok의 MUI Switch와 실시간 명령·별도 창 수명은 독립 control plane으로 이번 LDS 변경의 소비자가 아닙니다.

제품 revision과 파일 근거는 [제품 소비 경계](../../PRODUCT_FRONTEND_COVERAGE.md#r8-컨트롤overlay-모션-소비-경계--2026-10-13)와 [coverage audit](../../references/product-frontends/COVERAGE_AUDIT.json)에 있습니다. ActivityHeatmap·녹음·서명·국제 전화 입력은 사용 제품과 문제, 기존 조합의 부족함이 확인될 때 여는 Conditional 항목입니다.

## 남은 작업과 승인

1. 형태 시안의 font·layout을 브라우저에서 검토하고 owner가 공유 그림자·굵기·모서리 채택 여부를 결정합니다. 공유 값은 승인 후 별도 변경으로 진행합니다.
2. 승인된 Linux canonical workflow에서 `motion.md`를 포함한 필요한 생성 projection을 갱신하고 해당 source SHA의 필수 CI를 확인합니다. Windows에서 generated source/dist/baseline을 만들거나 전체 gate를 중복 실행하지 않습니다.
3. 검증된 패키지 발행 후 제품 owner가 pin 갱신과 제품 검토·배포를 진행합니다. source 업로드만으로 소비 제품에 변경이 적용되지는 않습니다.

이번 source·데모·핸드오프 업로드 승인을 후속 push, 수동 dispatch, 태그, 발행, 제품 배포나 서버 변경의 승인으로 확장하지 않습니다. 각 행위는 기존 [운영 정책](../../OPERATIONS.md)과 사용자 승인을 따릅니다. 승인된 `interactionOpen` 외의 새 공개 API, 브랜드 색 변경과 repository 전체 motion gate 확대는 R8 범위에 포함하지 않습니다.

## 후속 검토 — 2026-10-13

대상은 원격 `main@1b710f8031c8f0fc57f11aa69cfe406a5c8bacec`입니다. 아래는 최초 source 검증과 구분한 공개 Pages 후속 관측입니다.

- [Pages 38323004212](https://github.com/LK-Design-System/lk-design-system/actions/runs/38323004212)는 해당 SHA에서 성공했고, 임시 데모와 형태 비교 페이지의 실제 렌더를 확인했습니다.
- 데모의 Light/Default 첫 화면, Dark/Ops 전환과 최대 390px iframe 폭 선택을 확인했습니다. Dark/Ops 중첩 Modal에서 자식 창을 연 뒤 첫 Escape는 자식만 닫고, 다음 Escape는 부모를 닫으며 `환경 설정 열기` 호출 버튼으로 초점이 돌아왔습니다. 이는 대표 조합의 확인이며 12개 예제 전체, 실제 모바일 viewport, 다른 브라우저 또는 reduced-motion 검증 완료를 뜻하지 않습니다.
- 형태 비교는 Light/Default와 Dark/Ops desktop에서 네 안의 배치와 문구 잘림 없음을 확인했습니다. 공유 형태 값은 미채택 상태입니다. 실제 사용 font face의 로드·적용 여부, 나머지 테마/프로필 조합과 좁은 viewport는 아직 검증하지 않았으므로 font·layout 검토 전체를 완료로 표시하지 않습니다.
- [CI 38323004292](https://github.com/LK-Design-System/lk-design-system/actions/runs/38323004292)의 `Design system checks`는 `check:foundations`에서 `Generated foundation artifact is stale: docs/foundations/motion.md`로 실패했습니다. Linux conformance는 성공했고 Windows package 소비 검사는 skipped입니다. 이 run에는 다운로드할 artifact가 없습니다.

### 승인된 Linux export 실행 결과

사용자의 행위별 승인으로 `.github/workflows/ci.yml`을 원격 `main@1b710f80`에서 `export_dist=true`, `export_visual_baseline=false`로 정확히 한 번 실행했습니다. [실행 38333772289](https://github.com/LK-Design-System/lk-design-system/actions/runs/38333772289)의 `headSha`는 승인된 전체 SHA와 일치합니다. 2026-10-13 10:47:02 KST에 시작해 마지막 job이 10:48:10 KST에 종료됐습니다.

| 대상 | 결과 |
| --- | --- |
| Export canonical Linux artifacts | 실패. Storybook build는 성공했지만 `report:storybook-ia`에서 `Built Storybook must retain 794 stories; found 802.`로 중단했습니다. 후속 foundation 생성과 artifact 업로드에 도달하지 못했습니다. |
| Design system checks | 기존 `docs/foundations/motion.md` stale 오류로 실패했습니다. |
| Conformance fixtures (Linux) | 성공했습니다. |
| Windows workspace package consumers | skipped입니다. 통과 증거로 사용하지 않습니다. |
| Artifact 및 diff | GitHub artifact 목록은 0개입니다. `canonical-linux-generated`가 없으므로 산출물 diff 검토는 수행할 수 없었습니다. 재실행하지 않았습니다. |

원인은 [Storybook 목록 계약](../../references/quality/STORYBOOK_DOCS_DEDUP_CONTRACT.json)의 오래된 794개 census입니다. 동일 SHA에서 성공한 Linux Pages의 `index.json`을 기존 IA audit과 대조해 794개 ID와 공개 상태가 모두 유지됨을 확인했습니다. 삭제 0개, 기존 공개 상태 변경 0개이며, `a8c46f0d`의 hidden Input/Select 예제 2개와 `0fbfbeb4`의 public 채팅/첨부 예제 6개가 추가됐습니다. 모두 R8 이전 변경입니다. 현재 관측은 802 stories / 201 Docs / 564 public / 238 hidden입니다.

로컬 복구안은 이 목록의 정확한 수와 두 해시를 갱신하고 8개 ID·출처를 `pendingExportSourceExtension`으로 기록합니다. 기존 equality/hash 검증과 사람 검토 stamp는 유지합니다. 실제 검증 함수를 관측 index에 적용해 통과했고 ID 삭제·ID 변경·공개 상태 변경·Docs 삭제를 각각 거부하는 것도 확인했습니다. 관련 Docs source 테스트 11/11과 `git diff --check`가 통과했습니다. Linux 생성물, visual baseline, 공유 형태 값은 변경하지 않았습니다.

이 수정의 원격 push와 수정 SHA의 새 export 실행은 각각 별도 승인 대상입니다. 새 export가 성공하면 해당 실행의 source SHA를 확인하고 artifact diff를 검토합니다. 기존 컴포넌트 registry도 R8 이전 일부 변경을 아직 투영하지 않은 상태라 채팅/첨부·Input/Select의 파생 변경이 함께 나올 수 있으며, 이를 R8 변경과 구분해 검토합니다. 생성된 IA audit에서 미검토 source가 드러나더라도 사람 검토 stamp를 자동 승격하지 않습니다.

### 수정 SHA의 Linux export와 산출물 검토

사용자가 `c4209276`의 원격 `main` push와 같은 입력의 export 1회를 별도로 승인했습니다. 원격 SHA를 확인한 뒤 [실행 38334450818](https://github.com/LK-Design-System/lk-design-system/actions/runs/38334450818)을 시작했고, 실행의 `headSha`와 artifact의 `workflow_run.head_sha` 모두 `c4209276e89d99ec9987b6b81b53a33dc4906023`입니다. 2026-10-13 10:55:39 KST에 시작해 10:56:41 KST에 종료됐습니다. 추가 dispatch나 재실행은 하지 않았습니다.

- **Export 성공:** `canonical-linux-generated` artifact `11783853716`이 생성됐습니다. GitHub 보고 크기는 26,976,365 bytes, digest는 `sha256:1182a8dd06b67e3759a8b7a3d0b628ccdde12a0f465ba2fd116bad2e76ad7665`입니다. 내려받아 별도 디렉터리에서 검토했으며 원본 checkout 생성물에는 아직 적용하지 않았습니다.
- **전체 CI 실패:** Linux conformance는 성공했지만 일반 `Design system checks`는 checkout의 기존 `motion.md` stale 오류로 실패했고 Windows 소비 검사는 skipped입니다. 자동 push CI [38334448547](https://github.com/LK-Design-System/lk-design-system/actions/runs/38334448547)도 실패했습니다. Pages [38334448551](https://github.com/LK-Design-System/lk-design-system/actions/runs/38334448551)은 성공했습니다. Export 성공은 전체 CI·패키지 발행·제품 배포 성공이 아닙니다.

Artifact 3,534개 파일을 해당 SHA의 Git blob과 대조했습니다. 3,054개는 동일합니다. 업로드된 파일 중 262개가 추가되고 218개가 변경됐으며, export 대상의 기존 추적 파일 중 260개가 산출물에서 사라졌습니다. 합계 740개 경로의 diff를 별도 before/after snapshot으로 검토했습니다.

| 변경 그룹 | 검토 결과 |
| --- | --- |
| Root `dist` 653개 경로 | 해시 chunk 260개 추가·260개 삭제와 기존 파일 133개 변경입니다. R8와 이전 미투영 source의 bundle/type 반영입니다. sourcemap 924개에 절대 source 경로가 없고 상대 module 참조 3,366개가 모두 해석됩니다. |
| 나머지 87개 경로 | 컴포넌트 문서/registry 38개, foundation 3개, 감사 계약 3개, Core/Theme/Product 문서 10개, package source 27개, package token 5개와 `storybook-static/index.json` 1개입니다. 마지막 index는 검토용이며 원래 Git 비추적 파일입니다. |
| R8 투영 | Button·SegmentedControl·Switch·Disclosure·Overlay source, `overlay-presence.js`, 승인된 `interactionOpen` 타입과 reduced-motion 설명이 반영됐습니다. |
| R8 이전 backlog | Input/Select focus·폭, Prose·ConversationList·MessageComposer·SourceDisclosure·FileUpload의 기존 main source 변경을 함께 투영합니다. 이를 새 R8 API나 추가 제품 작업으로 취급하지 않습니다. |
| 문서·기준 무결성 | Core 42 / Theme 13 / Product 9개 manifest 문서 hash가 파일과 일치합니다. Dedup ceilings는 `meanDuplicatedSharePercent=2`, `guidesOverSixtyPercent=0`으로 유지되고 사람 검토 stamp도 변경되지 않았습니다. |

생성 IA audit은 802 stories 중 794 reviewed / 8 pending, source hash가 바뀐 reviewed page 16개를 정확히 드러냅니다. 생성물 반영 후에는 이 실제 source/예제의 IA 검토가 별도로 필요합니다. Stamp만 갱신해 통과로 만들지 않습니다.

별도 source/IA 대조에서 기존 [MessageComposer의 FilePreparation](../../../stories/CommunicationMessageComposer.stories.jsx) 이름(`조합 · 파일 이름, 메타데이터, 준비 상태`, source 1089행)이 생성 role `variants-states`의 `변형·상태 ·` prefix와 맞지 않는 점을 확인했습니다. Built index에서도 responsive `CompactDensity` 뒤에 있어 role 순서를 위반합니다. 이는 `report-storybook-information-architecture.mjs`의 prefix/order 검사에 맞춘 실제 source 검토·수정이 필요한 후속 blocker이며, 이번 CI의 최초 실패 원인인 `motion.md` stale 오류와 구분합니다. 나머지 신규 7개 story에서는 같은 이름·순서 오류를 발견하지 않았습니다.

이 산출물 검토는 정적 무결성과 source 투영 확인이며 16개 페이지의 UI·접근성·역할 검토나 packed package·전체 CI 검증을 대신하지 않습니다. 생성물 반영, 남은 IA 검토와 그 후보의 원격 push·발행은 아직 남아 있습니다.

## 로컬 확인 명령

설치된 repository dependency를 사용해 source Storybook을 엽니다. `storybook:dev`는 생성기를 실행하지 않습니다.

```sh
npm run storybook:dev
```

변경 범위의 회귀와 source 계약만 확인할 때 사용합니다. 같은 source와 환경의 통과 증거는 재사용합니다.

```sh
npm run check:control-motion
npm run check:overlay-motion
npm run check:engine-reuse
npm run check:prompt-contracts
npm run check:contracts
node node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck false --module ESNext --moduleResolution Bundler --target ES2020 --lib ES2020,DOM,DOM.Iterable --types react components/overlay/overlay-platform.d.ts
```

## 수명주기

이 디렉터리는 R8 검토 기간의 working handoff입니다. 현재 상태의 권위는 [LDS Roadmap](../../LDS_ROADMAP.md), Overlay 계약과 운영 정책에 둡니다. R8 종료 시 필요한 결정·검증 근거를 정식 문서에 반영한 뒤 이 기록과 임시 데모를 archive하거나 삭제합니다. 과거 포인터인 `docs/HANDOFF.md`는 현재 상태 문서로 되돌리지 않습니다.
