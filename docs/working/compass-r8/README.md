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
