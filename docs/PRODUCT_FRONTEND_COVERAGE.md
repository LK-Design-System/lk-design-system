# LK Product Frontend Workflow Coverage

| Field | Value |
| --- | --- |
| Type | Product workflow coverage contract and audit summary |
| Status | Current · all 16 shared-responsibility workflow traces verified |
| Owner | Product design/engineering · Design system owner |
| Last reviewed | 2026-08-11 |
| Machine-readable source | `references/product-frontends/COVERAGE_AUDIT.json` |
| Current Portal baseline | `LK-ROBOTICS-AX/lk_portal@4b462cae4840c5f554366298bc75392df667e3af` · `references/package-split/consumers/portal.json` |

> **Current identity policy.** This contract identifies the product as **LK Portal** (`portal`, `LK-ROBOTICS-AX/lk_portal`) and pins its current source separately from the package-split release history. Files below `docs/references/package-split/` retain their original identifiers and hashes as immutable 2026-07 migration evidence; they are not a current consumer-policy input.

> **Coverage is observation, not product IA authority.** 이 문서와 audit JSON은 고정 source에서 실제로 확인한 LDS 지원·소비 현황을 기록한다. 특정 제품 화면에 Card, grid, section surface 또는 완성 page anatomy를 강제하는 규격이 아니다. 제품이 정보구조를 바꾸면 해당 화면의 소비자 판정과 source evidence를 갱신하되, LDS가 제품의 section 경계나 시각적 표면을 대신 결정하지 않는다.

## Card · FeatureCard · RecordHeader console density · 2026-08-09

정보가 많은 데스크톱 콘솔이 한 화면에서 더 많은 비교 대상을 보여 주되, 읽기 화면과 기존 소비자의 출력은 바꾸지 않도록 명시적인 opt-in 축을 추가한다. Core `Card`와 Product `FeatureCard`는 `density="comfortable|compact"`를, Product `RecordHeader`는 기존 `PageHeader` 문법과 같은 `size="sm|md"`를 제공한다. 기본값은 각각 `comfortable`, `md`이며 `Card`의 명시적 `padding`과 WDS `platform="mobile"` 계약이 우선한다. 밀도는 공간과 아이콘 타일 크기만 바꾸고 본문 타이포, DOM/읽기 순서, heading, interactive 의미, 색과 elevation은 바꾸지 않는다.

이 축은 WDS parity가 아닌 명시적 LDS 확장이다. 로컬 `.fig`의 `Card/Card` component set에는 `Platform=Desktop|Mobile`, `Skeleton=False|True`만 있고 density는 없으며, `FeatureCard`와 `RecordHeader` component set도 없다. [Material UI Density](https://mui.com/material-ui/customization/density/)의 component-level opt-in과 전역 강제 회피, [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)의 toolbar/header/row size pairing, [Carbon Spacing](https://carbondesignsystem.com/elements/spacing/overview/)과 [Fluent Layout](https://fluent2.microsoft.design/layout)의 일관된 spacing ramp·근접성 원칙을 적용하되 외부 시스템의 시각값은 복제하지 않는다.

| 제품 자산 | 고정 source | 판정 | LDS와 제품의 책임 경계 |
| --- | --- | --- | --- |
| LK Portal | `LK-ROBOTICS-AX/lk_portal` · `4b462cae4840c5f554366298bc75392df667e3af` · `src/components/catalog/DatasetDetailPage.tsx` (`04035df094eff76b16c6f0f2318cafb798b64552`) · `src/components/catalog/ModelDetailPage.tsx` (`d25129db12f0f1d286138d666daa0dcabc612d37`) · `src/components/catalog/detail/CatalogResourceDetail.tsx` (`f45a916f8fda239ba64fc00bb8f6d170a4840029`) · `src/app/sources/page.tsx` (`7907f949fe8ef9c96c527a93208f77f752c3b14e`) · `src/components/shared/DetailHeader.tsx` (`18ed116e3b0f7a9fb0f1a16737f88d7018ae320d`) | supported by composition | 데이터셋·모델 상세는 각 활성 탭 패널의 최상위 정보 표면으로 `compact` Card 하나를 사용하고 내부 Card는 중첩하지 않는다. 일반 카탈로그 상세의 정보 Card, 다섯 destination FeatureCard와 공용 record identity도 compact 축을 실제로 소비한다. route, 권한, provider 어휘, record 데이터·action, 탭·section 선택과 보고서 읽기 화면의 comfortable 예외는 Portal이 소유한다. |
| LK Web Viz | `LK-ROBOTICS/lk_web_viz` · `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable to compact adoption | 고정 source는 편안한 destination/status surface를 쓰는 flat dashboard이며 반복되는 dense record-detail stack이나 RecordHeader가 없다. 기존 comfortable 기본값을 유지한다. |
| LK Control Full Daedeok | `LK-ROBOTICS/lkrobotics-control-full-daedeok` · `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx` (`b0fd86a6b4c735aca390cd6dd179f766fa071f08`) | Card supported by composition · FeatureCard/RecordHeader not applicable | 한 viewport의 여러 감시 영역은 optional compact Card로 조합할 수 있다. telemetry truth, command, breakpoint와 완성 화면은 Control이 소유하며 feature launcher와 record identity 계약은 현재 source가 요구하지 않는다. |

LK Portal의 `DatasetDetailPage`와 `ModelDetailPage`는 각 활성 탭 패널에 `density="compact"`, `elevation="sm"`인 Card를 정확히 하나 사용하고 Card 안에는 Card를 중첩하지 않는 실제 소비자다. 내부 의미 계층은 native semantic section 또는 제품 `DetailSection`과 `Divider`·`DescriptionList`·`Table` 같은 primitive를 조합한다. 이는 현재 고정 source에서 관찰한 소비 증거이지 제품 IA 규격이 아니다. 탭 수, section 경계·간격·강조, 데이터와 액션, 이후 Card 채택 여부는 계속 Portal이 소유한다.

Storybook은 Card/FeatureCard comfortable 대 compact, RecordHeader md 대 sm을 normal/narrow에서 함께 렌더하고, spacing만 변하며 heading·설명 typography와 읽기 순서가 유지되는지 검증한다. 새 icon이나 asset은 추가하지 않는다.

## Drawer · compact product-form density · 2026-08-09

`Drawer`는 기존 `comfortable` 출력을 기본값으로 유지하면서, 짧고 반복적인 데스크톱 폼이 페이지의 14/20px·32px control 밀도와 이어지도록 명시적인 `compact` chrome/body-type 축을 추가한다. Drawer는 **body에만** 내부 `ComponentDensityScope`를 두며, `compact`일 때 그 안의 `Input`·`Select`·`Textarea`·`Checkbox`/`CheckboxGroup`·`Radio`/`RadioGroup`·`ChoiceCard`·`Callout`·`FileUpload`·`SecretField`가 각자의 기존 유한 축에서 implicit compact 값을 해석한다. `comfortable`은 기존 자식 기본값을 그대로 해석하고, 자식이 명시한 `size`·`padding`·`density`는 항상 상속값보다 우선한다. 이 범위는 전역 density나 `LdsProvider` 설정이 아니며 header의 제목·닫기 control과 footer는 scope 밖에 있다. `Button`은 inherited density를 소비하지 않으므로 body 안에서도 기존 크기를 유지하고 footer CTA도 `md` 그대로다.

`DrawerSection`은 body 안의 의미 있는 하위 구획을 위해 제목, 짧은 설명, actions, 선택적 divider와 section rhythm을 소유하고 같은 bounded density를 상속한다. 폼의 field 간격, validation, mutation, 제출 정책, 문구와 어떤 자식에 명시적 크기 override가 필요한지는 계속 제품이 소유한다.

이 경계는 [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)의 header/body/footer anatomy와 보조적이고 빠른 작업 범위, [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)의 inert·focus containment·Escape·focus restore 계약, [WCAG 2.2 SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)의 24×24 CSS px 최소 target을 근거로 한다. 밀도는 anatomy나 상호작용 순서를 바꾸지 않고 body의 공간·타입과 eligible 자식의 기존 compact 축만 조정한다.

| 제품 자산 | 고정 source | 판정 | LDS와 제품의 책임 경계 |
| --- | --- | --- | --- |
| LK Portal | `LK-ROBOTICS-AX/lk_portal` · `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/ui/Drawer.tsx` (`3ab04513b73f8ade528bfc43657dde6c7f6d8a97`) · `src/components/reports/ReportsWorkspace.tsx` (`65d76daaf751605a4ccf3d196e7790b8fdec6c0e`) | supported by shared contract | 공용 adapter와 보고서 작성 Drawer가 반복형 제한 폭 폼을 증명한다. LDS compact body scope와 `DrawerSection`을 조합할 수 있으며 명시적 child override, field 간격, validation, mutation과 footer action 의미는 Portal이 소유한다. |
| LK Web Viz | `LK-ROBOTICS/lk_web_viz` · `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/ConnectionSettingsScreen.tsx` (`b04f91a96fc49b399dddfd89b5c23b785f8349b0`) | not applicable | 고정 source는 full-page 연결 설정이며 제한 폭 overlay form이 아니다. 현재 Drawer compact opt-in 근거로 사용하지 않고 기존 full-page field density는 제품 composition으로 유지한다. |
| LK Control Full Daedeok | `LK-ROBOTICS/lkrobotics-control-full-daedeok` · `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/layout/MainLayout/index.jsx` (`2436725e49f6364fdb99f2047907f300ca367865`) | not applicable | 고정 source의 narrow Drawer는 계층형 navigation이며 짧은 form Drawer가 아니다. 기존 comfortable Drawer/navigation composition을 유지하고 destination hierarchy, breakpoint와 route는 Control이 소유한다. |

Storybook의 compact Drawer contract는 header/body 16×20px, footer 12×20px, 14/20px body와 함께 implicit 32px `Input`/`Select`/`Textarea`, `sm` ChoiceCard·FileUpload·CheckboxGroup, compact Callout·`DrawerSection`, 최소 24×24px Checkbox target을 검증한다. 명시적 `size="md"` Input은 48px로 상속을 이기고 footer CTA는 40px `md`를 유지한다. Radio는 같은 WCAG 근거의 24×24px native target을 컴포넌트 계약으로 유지한다. focus trap, Escape, accessible name/description, focus restore와 narrow overflow 계약은 density와 무관하게 기존 Drawer 계약을 공유한다.

## ConnectionRow · connected account/resource surface · 2026-08-08

`ConnectionRow`는 LK Portal의 `SynologyChatWorkspace`, `PetWorkspace`, `ConfluenceConnections`, `CatalogResourceDetail`, `RepositoryDrawer`, `ProjectWorkspace`에서 반복되는 계정·자원 연결 행을 하나의 LK Product Extension으로 묶는다. LDS는 `visual → name/status → detail → actions` 순서, visible 상태, 보조 액션 강조와 320px reflow만 소유한다. 계정 cardinality, 연결·해제 mutation, 권한, 확인, route와 문구는 Portal이 소유한다.

Storybook은 connected/pending/disconnected 상태, 320px action reflow, 장식 visual의 접근성 트리 제외, named part와 visual parity를 검증한다. 공개 표면은 Product entry에만 추가하며 Core `StatusIndicator`, `Avatar`, `Button`을 조합한다.

## DataCollectionPanel · collection surface composition · 2026-08-04

`DataCollectionPanel`은 반복되는 `DataToolbar → ResourceState → Table/DataGrid 또는 제품 작성 compact content → Pagination` 순서를 하나의 연속 표면으로 묶는 LK Product Extension이다. 패널은 perimeter, 읽기 순서, blocking 상태의 footer 억제, container 기반 wide/compact 전환만 소유한다. query, fetch, 권한, 행 의미와 action, compact item markup, pagination 상태는 제품이 소유한다.

| 제품 자산 | 고정 source | 판정 | LDS와 제품의 책임 경계 |
| --- | --- | --- | --- |
| LK Web Viz | `4701e1dcfb0d0e9163c74c227da2d6feb801cb30` · `frontend/src/screens/TaskHistoryScreen.tsx` (`a529eb93bfdd51d77298f18c13e78bbc2a1b9631`) | not applicable | 현재 작업 이력은 실행별 command와 event log를 포함한 card feed이며 공통 table-shaped collection perimeter가 없다. |
| LK Control Full Daedeok | `3bdce49ec6868f016f4ec2cdbd12aabbf8a04f19` · `frontend/src/views/user/index.jsx` (`1c6c8446e723207a9bd5f4daa991a0b266ccc279`) | supported by composition | filter, loading/error/empty, table, pagination 순서를 조합할 수 있다. fetch, permission, dialog, mutation, row action과 route는 Control 소유다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/catalog/ProjectDirectory.tsx` (`36d8244ec33a50a07d3e71716d899354185fd74c`) | supported by composition | 반복되는 Card, embedded toolbar, resource state, desktop Table, mobile list, Pagination plumbing을 패널로 대체할 수 있다. query, domain count, 행 action과 compact markup은 LK Portal 소유다. |

Storybook은 실제형 긴 프로젝트명·설명·상태·연결 수를 사용해 normal/320px, native Table overflow fallback, loading/empty/stale, DOM 순서와 숨겨진 중복 focus target 제거를 검증한다. 신규 아이콘이나 제품 asset은 추가하지 않는다.

## FieldAction · field + action 조합 계약 · 2026-08-02

`FieldAction`은 기본 `Input` 48px와 기본 `Button` 40px를 같은 행에 놓을 때 생기는 높이 불일치를 제품별 CSS 없이 해소하는 LK Product Extension이다. 전역 Input/Button scale은 유지하고, 조합 안에서 `sm/md/lg`를 32/48/52px field 높이에 맞춘다. label·helper·error는 `FormField`, field 시각 상태는 `Input`, action 상태와 loading width는 `Button`이 계속 소유한다. DOM·Tab 순서는 field → action이며 360px 이하에서는 action이 다음 줄의 전체 너비 control로 reflow한다.

| 제품 자산 | 고정 source | 판정 | LDS와 제품의 책임 경계 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/ConnectionSettingsScreen.tsx` (`b04f91a96fc49b399dddfd89b5c23b785f8349b0`) | not applicable | 검토 surface는 full-width 하단 submit action과 `- / input / +` stepper를 사용한다. 하나의 field + 하나의 인접 action 계약이 아니며 연결·저장 상태는 제품 소유다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/facility/robotmanager/robot/index.jsx` (`fbb06c5b01b92926ff2f1b3e994c032fcda32f73`) · `frontend/src/views/user/index.jsx` (`8912b51c6eb612bd2beb2ed0206ee78ae6f03f2d`) | supported by composition | 검색 TextField와 Button의 밀도·reflow는 FieldAction이 지원한다. filter 값, query, pagination과 등록 action은 Control 소유다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/context/PersonalContextPage.tsx` (`285d02aa17fb626ccddaf2cbb22d6b24331bcacc`) · `src/components/admin/AdminWorkspace.tsx` (`8b0800cc7f5446f0a27cc1f1bae41ace222afa31`) | supported by composition | 연결 코드 발급 Input+Button 두 곳을 지원한다. 이름 검증, 권한, busy, API 호출, token 표시·폐기는 Portal 소유다. |

아이콘·asset은 추가하지 않는다. Storybook의 기본/disabled/loading/긴 문구·오류/320px/native Enter 제출/Tab 순서가 조합 계약의 검증 근거다.

## Select · DropdownMenu 계열 팝업 밀도 정렬 · 2026-08-02

`Select`는 form-field trigger와 `combobox/listbox/option` 의미를 유지하면서 팝업 표면과 option row만 공통 menu 문법에 맞춘 Core 재설계다. panel은 radius 12px·padding 8px·gap 4px, option은 radius 10px을 사용한다. `sm`은 shared-menu `default`의 40px·14/20px, `md/lg`는 `comfortable`의 48px·16/24px에 대응한다. 선택 상태는 지속 배경과 check로, 키보드 탐색 상태는 별도 inset focus ring으로 구분한다. Select trigger·trigger 폭을 따르는 panel·단일 값 유지·listbox keyboard 계약은 DropdownMenu와 합치지 않는다.

| 제품 자산 | 고정 source | 판정 | LDS와 제품의 책임 경계 |
| --- | --- | --- | --- |
| LK Web Viz | `LK-ROBOTICS/lk_web_viz` · `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/ConnectionSettingsScreen.tsx` (`b04f91a96fc49b399dddfd89b5c23b785f8349b0`) | supported by composition | full-width controlled robot-type 선택을 size-aware Select로 조합할 수 있다. robot-type vocabulary, config hydration·저장, connect/disconnect와 transport 상태는 Web Viz가 소유한다. |
| LK Control Full Daedeok | `LK-ROBOTICS/lkrobotics-control-full-daedeok` · `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/user/index.jsx` (`8912b51c6eb612bd2beb2ed0206ee78ae6f03f2d`) | supported by composition | `small` 120px role/status filter와 `medium` full-width required form field를 각각 `sm/default`와 `md/comfortable`로 조합할 수 있다. filter 적용·query·pagination, validation과 user mutation은 Control이 소유한다. |
| LK Portal | `LK-ROBOTICS-AX/lk_portal` · `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/chat/FloatingChat.tsx` (`ce48afb3f7ed0c7a7bad01d6a02e3a75006b74d4`) | supported by composition | 제한 폭의 동적 project selector와 loading disabled 상태를 지원한다. project option·scope resolution·session policy, provider/RAG·persistence와 chat-header reflow는 LK Portal이 소유한다. |

필수 세 제품의 판정은 모두 `supported by composition`이다. LK Portal의 현재 source pin은 선택기·채팅 범위 배치와 그 ownership seam을 함께 증명한다. 제품 source는 component 필요성, 크기·폭 제약, 상태와 ownership seam만 증명하며 LDS anatomy·색·token 값의 설계 authority로 사용하지 않는다.

## 필수 LK 제품 자산 교차 검토

앞으로 신규 컴포넌트, 대규모 재설계, 도메인 컴포넌트 품질 검토는 Storybook이나 LDS 코드만 보고 완료 처리하지 않는다. 실제 LK 제품 자산의 코드와 이미 구현된 프론트엔드를 확인하여, 공유 컴포넌트가 실제 사용자 워크플로우를 조합 가능한 형태로 지원하는지 검토한다.

최소 필수 검토 대상은 다음 세 자산이다. 특정 컴포넌트와 관련이 없더라도 생략하지 않고 `not applicable`과 그 이유를 기록한다.

| 제품 자산 | 기준 소스 | 현재 증거 상태 |
| --- | --- | --- |
| LK Web Viz | `LK-ROBOTICS/lk_web_viz` · `a984def117c05acd213f494cbb8a42e990595505` · `frontend` | WF-15 navigation과 WF-16 flat header-first dashboard composition 확인 · `DashboardScreen.tsx`의 live connection truth를 WF-02에 반영 |
| LK Control Full Daedeok | `LK-ROBOTICS/lkrobotics-control-full-daedeok` · `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend` | WF-16 fixed header + wide/temporary SideNav + supervision composition 확인 · hierarchical narrow navigation은 제품 소유 Drawer composition으로 경계 확정 |
| LK Portal | `LK-ROBOTICS-AX/lk_portal` · `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src` | WF-16 full-height SideNav + offset main + card/collection composition 확인 · LDS narrow anatomy는 flat BottomNav로 한정 |

### LK Portal LDS 요청 감사 · 2026-08-01

LK Portal의 작업 중 parity ledger(`docs/working/product-ui-parity-ledger-20260726.md`)에 모인 요청을 commit `e5ee99d5062170e26abe63d9105c2b8a024ce710`의 제품 source와 기존 WF-16 경계에 대조했다. ledger와 `Sidebar.tsx`는 검토 시점에 수정 중이므로 화면 구조를 복제하는 canonical source가 아니라 gap intake로만 사용했다.

| 제품 자산 | 판정 | 이번 LDS 계약 | 제품이 계속 소유하는 것 |
| --- | --- | --- | --- |
| LK Portal | supported by shared contract | `SideNav`의 expanded brand 정렬·footer render state/gap·collapsed rail scroll·자식 아이콘·비제어 runtime overlay 동기화·활성 그룹 자동 펼침 분리·레일/패널 세로 치수 안정화, `DashboardShell`의 계층형 temporary navigation modal coordination, `DataToolbar`의 검색/field 필터 밀도 전달, `Tabs`의 안쪽 2px 지표·길이형 padding, `Drawer` subtitle, `Table` row metadata/style helper, `Card` title wrap, `Callout` heading, polymorphic action type, reading line utility | 제품명·브랜드 조합, route·권한, footer 내용, controlled open/collapse 정책, 실제 filter 값/query, table row 의미, 출처 분쟁/권위 판정, 실제 페이지 padding |
| LK Web Viz | not applicable to the request source | 기존 다크 theme scope, `Fab`, table/card/callout 계약을 필요할 때 조합 가능 | viewer/map shell, telemetry truth, route와 command |
| LK Control Full Daedeok | not applicable to the request source | 기존 SideNav/Drawer/Table 계약과 DashboardShell temporary navigation을 필요할 때 조합 가능 | fixed shell breakpoint, destination hierarchy·route, supervision state와 command |

`Tag tone="neutral"`, `ListCell divider`, GitHub/Hugging Face `BrandLogo`, floating action용 `Fab`, `data-theme="dark"`는 이미 공개되어 있어 중복 API를 만들지 않았다. Confluence 공식 마크와 새 graph glyph는 승인된 source asset이 확보되기 전까지 레지스트리에 추정 경로를 넣지 않는다. `SourceDisclosure`의 분쟁 여부와 `DescriptionList`의 권위 필드 묶음은 제품 데이터 의미이므로 공용 컴포넌트 축으로 올리지 않는다. 상태색·translucent state처럼 공유 토큰 값을 바꾸는 요청은 token governance의 별도 영향 검토와 승인을 거친다.

### RecordHeader · PageHeader 책임 분리 판정 · 2026-07-27

페이지의 위치와 업무를 설명하는 `PageHeader`에서 사람·로봇·주문 같은 대상 정체성
구조를 분리했습니다. `RecordHeader`는 visual, 대상 이름, badge, description, details와
대상 actions의 안정된 읽기 순서만 소유하는 Product Extension입니다. Web Viz와
Control에는 이 전체 해부학을 재사용할 현재 workflow가 없고, LK Portal은 공용
`DetailHeader`를 통해 여러 record 상세 화면에서 이미 조합합니다.

| 제품 자산 | 고정 source | 판정 | 이유 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable | 선택 로봇과 연결 상태는 있지만 이름·식별 visual·세부 통계·대상 actions를 함께 가진 재사용 레코드 헤더는 없습니다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/layout/MainLayout/index.jsx` (`2436725e49f6364fdb99f2047907f300ca367865`) · `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx` (`b0fd86a6b4c735aca390cd6dd179f766fa071f08`) | not applicable | 셸·탐색·로봇 감시 화면을 조합하지만 일반화 가능한 레코드 정체성 헤더 해부학은 없습니다. |
| LK Portal | `4b462cae4840c5f554366298bc75392df667e3af` · `src/components/shared/DetailHeader.tsx` (`18ed116e3b0f7a9fb0f1a16737f88d7018ae320d`) | supported by composition | 데이터셋·모델·카탈로그·프로젝트·서비스·개발자 상세가 공용 adapter에서 RecordHeader를 조합합니다. compact `size="sm"`만 LDS가 소유하고 뒤로가기, route, 권한, 데이터와 action은 Portal이 소유합니다. |

대상 데이터 fetch, route, 권한, 실제 설정·공유·팔로우 mutation, 통계 계산과 포맷은
제품이 소유합니다. 이 분리는 제품 화면을 복제하거나 새 workflow를 주장하지 않고,
외부 category 근거와 기존 LDS sibling 비교로 공용 컴포넌트 책임만 좁힙니다.

### StatusBadge · StatusIndicator 책임 분리 판정 · 2026-07-27

정적인 lifecycle/result 상태는 dot 없는 20px soft semantic `StatusBadge`로,
실시간 가용성·연결·freshness 신호는 dot+visible label `StatusIndicator`로
분리했습니다. 세 필수 제품은 상태 truth와 transport를 각자 소유하며 이번 변경은
공통 Core의 표현 책임만 나누므로 adoption 판정은 모두 `not applicable`입니다.

| 제품 자산 | 고정 source | 판정 | 이유 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable | live connection truth는 존재하지만 transport state, polling, route와 recovery는 그대로 제품이 소유하며 이번 변경은 generic 표현 분리입니다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx` (`b0fd86a6b4c735aca390cd6dd179f766fa071f08`) | not applicable | 설비·연결 상태를 소비하지만 telemetry truth, diagnosis와 recovery workflow는 제품 소유이며 공통 badge anatomy의 설계 근거가 아닙니다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/app/page.tsx` (`719f69413e2e06c4d887d044696ba98cd90686f4`) | not applicable | destination metadata는 있지만 공통 live availability indicator workflow는 없고 route·상태 계약을 새로 만들지 않습니다. |

제품은 canonical tone과 visible label을 제공하고, 실시간 여부와 pulse 필요성을
판단합니다. LDS는 상태를 계산하거나 badge를 live region으로 자동 승격하지 않습니다.

### ScrollArea · 네이티브 스크롤 정책 판정 · 2026-07-27

세 제품 모두 내부 스크롤 표면을 사용하지만 표현 방식은 서로 달랐습니다. LDS는 제품별
스크롤 위치나 높이를 가져오지 않고, 브라우저 네이티브 동작을 기본으로 유지하는
`ScrollArea`와 공통 `.lk-scroll-surface` 계약만 제공합니다. 일반 표면은 OS 설정을
존중하는 `auto`, 폭이 제한된 메뉴·패널은 `compact`, 레이아웃 변동을 줄일 곳은
`gutter="stable"`을 조합합니다. 공용 API에는 숨김을 제공하지 않으며 Top Bar 단일 행과
Wheel Picker 선택면처럼 별도 이동 수단이 있는 패턴만 저장소 검사에 이유를 등록합니다.

| 제품 자산 | 고정 source | 판정 | 이유 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/index.css` (`f8d004ed0fdb625fd72b068a6396bfbca5417859`) | supported by composition | 전역 6px WebKit 스크롤바와 숨김 유틸리티가 섞여 있습니다. LDS의 표준 속성 기반 native/compact 계약으로 교체할 수 있으며 화면별 overflow 위치와 지도·목록 상태는 제품이 소유합니다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/assets/scss/style.scss` (`d676ba495386f45ca7b8bbf309df92409327e5c1`) | supported by composition | `react-perfect-scrollbar`의 5px rail/thumb을 여러 셸에 적용합니다. LDS는 네이티브 스크롤 표면과 접근성 계약을 제공하고 JS scrollbar 제거 여부와 단계적 migration은 제품이 결정합니다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/app/globals.css` (`5f82644ed126d4d8c484d49b86c73835cec680fc`) | supported by composition | Tailwind overflow 표면과 일부 `scrollbar-gutter: stable` 사용이 확인됩니다. LDS class/ScrollArea로 표현과 키보드 도달성을 통일할 수 있고 markdown·table·editor의 실제 overflow 경계는 제품이 소유합니다. |

W3C CSS Scrollbars Level 1의 표준 속성만 사용하며, `compact`도 폭만 `thin`으로
줄이고 색은 사용자 에이전트에 맡깁니다. forced-colors에서는 폭도 기본값으로 돌아가고,
Storybook axe 검사에는 `scrollable-region-focusable`을 포함합니다.

### PageIndicator · Carousel media 조합 판정 · 2026-07-26

이번 `Carousel` 재설계는 독자적인 dot button과 span을 그리지 않고 Core
`PageIndicator presentation="media"`를 조합하도록 경계를 닫습니다. PageIndicator는
dot geometry, target, item name, current state와 reduced motion을 소유하고 Carousel은
slide state, viewport, 이전/다음·자동 회전, scrim rail 배치를 소유합니다. 세 필수
frontend에는 순차 미디어나 slide-picker workflow가 없어 adoption은 모두
`not applicable`입니다.

| 제품 자산 | 고정 source | 판정 | 이유 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable | 선택 로봇, 연결 상태, destination card와 지도 진입점은 있지만 ordered media나 slide picker가 없습니다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/layout/MainLayout/index.jsx` (`2436725e49f6364fdb99f2047907f300ca367865`) | not applicable | fixed header, responsive SideNav, breadcrumb, route outlet과 footer를 조합하며 순차 미디어나 page indicator 동작이 없습니다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/app/page.tsx` (`719f69413e2e06c4d887d044696ba98cd90686f4`) | not applicable | destination card와 project chip collection을 제공하지만 ordered media sequence나 slide picker가 없습니다. |

이 판정은 Carousel을 제품 workflow로 확장하지 않는 근거입니다. 미디어 fetch,
analytics, slide 내용, 권한, CTA 결과와 자동 회전 사용 여부는 계속 제품이 소유합니다.

### LanguageSwitcher 제품 자산 판정 · 2026-07-26

`LanguageSwitcher`는 WF-16의 TopBar utility로 분류하되, 고정된 세 필수 frontend source에는 locale state, 번역 route 또는 언어 변경 control이 없습니다. 따라서 현재 제품 adoption은 모두 `not applicable`이며, 번역 readiness·URL·persistence·`<html lang>` 갱신과 좁은 화면의 설정 Drawer 이동은 검증되지 않은 product-owned integration seam으로 남깁니다.

| 제품 자산 | 고정 source | 판정 | 이유 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable | 제품 logo와 utility header는 있지만 locale state, translation route, 언어 선택 action은 없습니다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/layout/MainLayout/index.jsx` (`2436725e49f6364fdb99f2047907f300ca367865`) | not applicable | fixed header와 responsive SideNav는 있지만 locale control이나 언어별 route evidence가 없습니다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/layout/Sidebar.tsx` (`3b5d05b472b5e6346401ee673936c29211595a8c`) · `src/components/layout/AppShell.tsx` (`bd252534bcf44be11e2afa35bc2e6ed3f4e6edab`) | not applicable | 제품 identity shell은 있지만 locale control이나 번역 readiness state가 없습니다. |

이 판정은 컴포넌트가 route나 i18n provider를 소유해야 한다는 뜻이 아닙니다. LDS 공개 계약은 현재 언어 표시, native-name radio menu, keyboard/focus와 controlled `onChange`까지만 제공하고 실제 언어 변경 결과는 소비 제품이 책임집니다.

### DropdownMenu 밀도·적응형 너비 재설계 제품 자산 판정 · 2026-07-26

`DropdownMenu`는 trigger에 연결된 명령·선택 목록까지만 소유합니다. 이번 변경은
DropdownMenu·TopBar·LanguageSwitcher의 기본 시각 밀도를 `8px shell / 40px row /
10px 16px row padding`으로 통일하고, 기본 폭을 콘텐츠 기반 `176–320px` 범위로 제한합니다.
고정 폭은 제품 레이아웃 정렬이 요구하는 명시적 예외이며, 제품별 action, mutation, confirmation,
persistence를 공용 컴포넌트로 끌어오지 않습니다.

| 제품 자산 | 고정 source | 판정 | 이유 |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable | 검토한 dashboard에는 연결 로봇 전환과 navigation은 있지만 trigger-bound command menu가 없습니다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/user/index.jsx` (`8912b51c6eb612bd2beb2ed0206ee78ae6f03f2d`) | not applicable | 확인된 `MenuItem`은 form Select option이므로 command DropdownMenu로 대체하지 않습니다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/app/confluence/page.tsx` (`d12598d529e2f194e6b6eb0a68b47eaba8755400`) | supported by composition | 표 행의 이름 변경·동기화 제외·삭제 메뉴는 normal DropdownMenu와 danger item으로 구성할 수 있습니다. 실제 mutation과 확인 절차는 제품 소유입니다. |

각 컴포넌트 리뷰에는 아래 내용을 남긴다.

1. 확인한 repository, commit, frontend root, route/page/container와 핵심 source file
2. 실제 사용자 진입점, 결정, 데이터·권한 전제조건과 완료 조건
3. loading, empty, error, stale, offline, disabled, partial failure와 복구 경로
4. LDS 컴포넌트 하나로 지원되는지, 여러 primitive의 composition이 필요한지, 아니면 gap인지
5. gap이 LDS 공개 계약의 책임인지 product orchestration·backend·transport의 책임인지
6. normal/narrow/dark 환경과 실제 제품 데이터 밀도에서의 시각·상호작용 적합성

판정 값은 `supported`, `supported by composition`, `gap`, `not applicable`로 통일한다. 제품 화면을 Storybook에 복제하거나 route·backend 정책·transport 상태 머신을 공용 컴포넌트에 넣는 것은 커버리지로 인정하지 않는다. 타입, 접근성, Storybook, 픽셀 회귀 검사가 통과하더라도 이 교차 제품 워크플로우 검토를 대신할 수 없다.

이 문서는 LDS가 지원해야 하는 다섯 제품의 워크플로우를 다시 발견하고 검증하기 위한 기준 문서다. 현재 제품 화면이나 기존 LDS 컴포넌트를 정답으로 보지 않는다. Storybook에는 감사표, 와이어프레임, 완성 화면을 추가하지 않으며, 검증된 컴포넌트와 패턴의 실제 상태만 둔다.

여기서 제품 source의 authority는 필요한 component 종류, workflow·state·failure/recovery, 실제 데이터 밀도와 product-owned seam에 한정된다. anatomy, 배치, 치수, 색, token, prop 이름, public API와 LDS component lifecycle은 제품 source에서 도출하지 않는다. 이 설계 결정은 WDS evidence, LDS sibling·token, 공식 외부 category reference와 design-owner review에서 독립적으로 닫은 뒤 제품 source로 조합 가능성만 확인한다.

## 현재 판정

2026-07-10에 다섯 원격 저장소의 기본 브랜치 HEAD를 새 작업공간에 다시 받아 commit과 주요 source blob을 고정했다. 기존 `34 covered / 0 partial / 0 missing` 판정은 철회한다. 그 판정은 대응 파일의 존재를 워크플로우 검증으로 잘못 취급했다.

| 단계 | 수 | 의미 |
| --- | ---: | --- |
| discovered | 0 | source만 확보하고 독립 wireframe을 만들지 않은 항목이다. |
| wireframed | 0 | 독립 low-fi만 닫히고 shared responsibility가 미확정인 항목은 없다. |
| implemented | 0 | 컴포넌트와 state story만 있고 전체 trace가 열려 있는 항목은 없다. |
| verified | 16 | source requirement, 독립 wireframe, 작은 LDS 책임, state story, 검증 근거가 연결됐다. |

여기서 `verified`는 디자인 시스템의 shared responsibility와 product-owned seam이 추적 가능하다는 뜻이다. 여섯 제품이 이 패키지를 실제로 통합했거나 production workflow가 end-to-end 검증됐다는 뜻은 아니다.

## 판단 근거의 우선순위

다음 순서를 지킨다.

1. 제품이 해결해야 하는 사용자 문제와 불변 규칙
2. backend/domain 문서와 실제 코드에서 확인되는 상태 전이, 허용 조건, 실패·복구
3. 현재 page/container 코드에서 관찰되는 사용자 행위
4. UX audit와 과거 wireframe handoff가 지적하는 문제
5. 기존 제품 레이아웃과 기존 LDS 컴포넌트

과거 wireframe 문서는 문제를 발견하는 근거이지 설계 원본이 아니다. 현재 route, DOM, sidebar, card, table, modal 배치도 보존 대상이 아니다. 기존 LDS 구현은 workflow에서 다시 도출될 때만 유지한다.

## 비목표

- 제품 화면을 LDS 토큰으로 다시 칠하는 것
- route나 page component를 같은 이름의 LDS component로 승격하는 것
- prop과 상태를 많이 추가해 화면형 컴포넌트를 재사용 가능하다고 주장하는 것
- 현재 구현과 닮았다는 이유로 workflow coverage를 완료 처리하는 것
- Storybook에 workflow, template, audit, wireframe을 올리는 것

## 원본 기준점

| 제품 | commit | 다시 읽는 중심 질문 |
| --- | --- | --- |
| DeviceOps | `41c319eb0ad863f67d73facc64f7dd2a13ab9585` | 운영자가 보드의 실제 상태를 믿고 원격 변경의 적용 여부까지 확인할 수 있는가? |
| VisionOps | `308da0c0624024ba2497cf05cda2841e4411b522` | 입력·처리·판정 evidence를 혼동하지 않고 원인과 안전한 조치를 찾을 수 있는가? |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` | 지도 point·line·region·facility와 층별 target을 의미·상태·zoom에 맞게 구분하고 편집할 수 있는가? |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` | 어떤 범위와 근거가 사용됐는지 확인하면서 관계·문서·질의를 관리할 수 있는가? |
| Control | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` | 로봇을 선택하고 계획·감시·직접 제어할 때 위험한 상태 전이를 안전하게 다룰 수 있는가? |
| MLOps | `0e9f3b03fccd60ab0575b55c18035cc9f9e91521` | 선택 버전의 blocker, 다음 안전한 행동, evidence, 실제 외부 반영 범위를 판단할 수 있는가? |

## 제품별 workflow 재추출

### DeviceOps

- fleet attention routing: 검색·필터·freshness·알림으로 조사할 보드를 찾고 상세로 이동한다.
- live board investigation: 마지막 관측값과 현재 연결 상태를 구분하고 리소스·서비스·주변기기·로그를 교차 확인한다.
- guarded remote change: 실행 가능 여부와 영향을 확인하고 명령을 보내며 `sent → accepted/ack → applied/confirmed`를 실제 상태 변화로 검증한다.
- diagnostic session: 서비스 로그나 터미널 연결을 시작하고, 끊김·재연결·follow 중단·재개를 명시적으로 다룬다.
- profile rollout: profile 변경이 여러 보드에 미치는 영향을 확인하고 push 결과와 부분 실패를 읽는다.

### VisionOps

- module attention routing: freshness와 degraded 상태로 조사할 모듈을 선택한다.
- causal investigation: 입력 telemetry → processor 상태 → decision evidence 순으로 원인을 좁히고 event·video·thermal·pipeline을 교차 확인한다.
- graph exploration: 노드 선택과 상세 열기를 분리하고 upstream/downstream 관계를 보존한 채 원인을 추적한다.
- staged configuration: current와 draft를 비교하고 변경·validation·high-risk·restart-required를 확인한 뒤 적용과 실제 반영을 구분한다.
- guarded recovery: event clear나 pipeline restart의 영향과 command lifecycle을 확인한다.

### LK Web Viz

- dashboard connection triage: 실제 제품 로고와 utility header 아래에서 선택 로봇, ROS Bridge·관제서버·MQTT의 개별 연결 truth, 마지막 갱신, reconnect action을 확인한 뒤 map·task·history 진입점을 고른다.
- map object authoring: point, line, polygon region과 landmark를 선택·생성·수정하고 저장 실패 시 작업 문맥을 유지한다.
- facility semantics: elevator entry/interior, door, stair, waypoint, charger, generic POI를 같은 점 glyph로 축약하지 않고 의미와 상태를 구분한다.
- zoom-stable inspection: 작은 zoom에서도 point·line·region·label의 위계와 selection이 유지되고, 조밀한 geometry는 inspector나 이름 있는 목록으로 보완한다.
- floor-aware task targeting: 건물·층·map identity를 유지하면서 landmark 또는 좌표를 task step에 연결한다.
- product boundary: persistence, editor command, floor topology, task schema, device control은 제품이 소유하고 LDS는 renderer-neutral feature·state·selection·accessible mirror 계약만 공유한다.

### LK Portal

- workspace orientation: full-height 제품 identity SideNav에서 현재 목적지를 확인하고 home의 destination card와 project collection으로 이동한다. pinned source에는 narrow navigation 전환이 없다.
- scope configuration: workspace/system/domain과 repo/space/HF/board 관계를 검색·선택하고 dirty change를 저장하거나 폐기한다.
- evidence-backed briefing: attention item에서 project, GitHub, Confluence, report evidence로 이동하고 근거의 출처와 freshness를 유지한다.
- document intake and sync: 파일 선택, 변환, 검증, 동기화를 거치며 파일별 결과와 부분 실패를 복구한다.
- scoped assistance: provider availability와 실제 scope를 확인하고 질문하며, streaming/error/retry와 source를 읽고 scope 변경 시 session 의미를 재설정한다.
- sensitive credential handling: secret을 기본적으로 가리고 제한된 reveal/copy/update와 audit 가능성을 유지한다.

### Control

- dashboard shell navigation: fixed utility header와 wide/temporary SideNav 사이에서 현재 목적지를 유지하고 supervision main으로 이동한다. narrow Drawer의 focus/Escape/restore/background inert는 DashboardShell의 temporary navigation 계약이 소유한다.
- robot supervision: 로봇을 선택하고 map/video/status/facility/event를 같은 시점의 truth로 읽는다.
- manual control session: target과 연결을 확인하고 control authority를 획득한 뒤 hold/release, focus loss, connection loss, emergency stop을 안전하게 처리한다.
- procedure authoring: 목적·로봇·map target을 정하고 순서형 step을 작성·검증·미리보기·template 저장 후 명시적으로 전송한다.
- schedule automation: task와 target, 시간, 반복, 우선순위를 정하고 conflict와 실행 상태를 확인한다.
- alarm investigation: 목록 문맥을 유지한 채 상세 원인으로 이동하고 조치 후 원래 triage 위치로 돌아온다.

### MLOps

- version decision: selected version의 현재 상태, blocker, next safe action, evidence readiness를 먼저 판단한다.
- preflight-to-execution: 검증 결과와 warning/blocker를 읽고 queue/rejection을 구분한 뒤 actual run을 시작한다.
- long-running operation: progress보다 result semantics와 scope를 우선해 실패 영향, artifact, retry/cancel 조건을 판단한다.
- human review gate: evidence를 보고 accept/reject/skip과 note를 기록하며 자동 job과 다른 책임으로 completion을 관리한다.
- approval and release: `preflight_ready`, `approved`, `released`를 분리하고 actor와 external publish evidence를 요구한다.
- data preparation: source authority와 recipe lineage를 이해하고 dry-run, materialization, preview/tag/export의 범위를 과장 없이 다룬다.

## 교차 제품 canonical workflow

아래 항목은 화면 이름이 아니라 사용자 결정의 반복 구조다. `docs/references/product-frontends/COVERAGE_AUDIT.json`의 `WF-*` 레코드가 source blob까지 추적한다.

| ID | workflow | 반드시 답해야 하는 질문 | 현재 단계 |
| --- | --- | --- | --- |
| WF-01 | Attention to context | 무엇을 먼저 조사해야 하며, 상세에서 돌아와도 탐색 문맥이 유지되는가? | wireframed |
| WF-02 | Live truth investigation | 최신 truth와 stale cache를 구분하고 원인 evidence를 좁힐 수 있는가? | wireframed |
| WF-03 | Guarded remote action | 실행 가능성, 영향, 전송, 수락, 적용, 확인 실패를 구분하는가? | wireframed |
| WF-04 | Staged change and apply | current/draft 차이, validation, 위험, 적용, restart/verification을 분리하는가? | wireframed |
| WF-05 | Procedure authoring | 목적과 target을 기준으로 step을 검증하고 실행 전 결과를 예측할 수 있는가? | wireframed |
| WF-06 | Long-running operation | preflight, queue/rejection, running, result scope, artifact, retry를 구분하는가? | wireframed |
| WF-07 | Human review decision | evidence와 사람의 decision·note·actor를 자동 실행과 분리하는가? | wireframed |
| WF-08 | Evidence and provenance investigation | claim에서 원본 source, 관계, freshness, gap으로 추적 가능한가? | wireframed |
| WF-09 | Manual control safety session | authority·focus·hold·release·link loss·e-stop이 안전한가? | wireframed |
| WF-10 | Scoped knowledge assistance | 실제 사용 scope와 provider truth, source, session reset 의미가 보이는가? | wireframed |
| WF-11 | Sensitive credential handling | secret 노출·복사·갱신이 최소 권한과 audit 경계를 지키는가? | wireframed |
| WF-12 | External publish | validation-only와 실제 외부 write, publish evidence를 구분하는가? | wireframed |
| WF-13 | Schedule automation | recurrence·timezone·conflict와 개별 run 상태를 구분하는가? | wireframed |
| WF-14 | Approval transition | review completion, approval, external release를 서로 다른 truth로 다루는가? | wireframed |
| WF-15 | Map navigation and facility authoring | point·line·region·facility와 층 identity가 일반 관례와 실제 LK workflow에서 구분되는가? | verified |
| WF-16 | Dashboard shell and navigation composition | 제품 identity·utility·현재 위치·우선 콘텐츠가 wide/narrow shell에서 중복 없이 유지되는가? | verified |

## 독립 설계 원칙

1. workflow state machine과 화면의 공간 배치를 분리한다. 같은 workflow가 modal, page, drawer에서 쓰인다고 같은 layout component가 되는 것은 아니다.
2. entity 명사보다 사용자의 결정 동사를 우선한다. `DatasetExplorer`보다 “다음 안전한 action을 선택하기 위한 evidence 조사”가 먼저다.
3. 읽기 truth와 write intent를 분리한다. stale data 위에서는 위험 action이 활성화되지 않아야 한다.
4. transport success와 domain success를 분리한다. HTTP 200, MQTT publish, ACK는 실제 적용 완료가 아니다.
5. human gate와 runner execution을 분리한다. review와 approval을 job stage처럼 표현하지 않는다.
6. current implementation의 panel 수와 정보량을 보존하지 않는다. 필요한 decision hierarchy에 따라 줄이거나 재배치한다.
7. 단일 제품에서만 보이는 흐름은 즉시 LDS compound component로 승격하지 않는다. 안전·접근성상 공용 계약이 필요한 최소 단위만 추출한다.

## 1차 독립 wireframe 계약

아래 wireframe은 현재 제품 화면의 panel 배치를 옮긴 것이 아니다. 여러 제품에서 동일하게 발생하는 판단 순서를 기준으로 정보의 선후 관계만 고정한다. 구체적인 page, modal, drawer 배치는 소비 제품이 결정한다.

### WF-16 Dashboard shell and navigation composition

이 workflow의 재사용 가능한 결과는 루트 `DESIGN.md`에서 **Operations Dashboard** 패턴군으로 관리한다. 기존 `DashboardShell`·`DashboardGrid` API는 유지하며, 일반 어드민 템플릿이나 별도 디자인 시스템으로 범위를 넓히지 않는다.

핵심은 하나의 “표준 대시보드 화면”을 만드는 것이 아니라 제품 identity, utility, 목적지, 현재 위치와 우선 콘텐츠의 소유권을 분리하는 것이다.

```text
wide · hierarchical
┌ Product identity ───────────────┬ Global utilities ───────────────┐
├ Docked destinations ────────────┼ Page title · primary action ───┤
│ active path · max 2 levels      │ highest-priority status/task   │
│ explicit collapse              │ analysis or stable collection  │
└─────────────────────────────────┴─────────────────────────────────┘

wide · flat launcher
┌ Product identity ───────────────┬ Global utilities ───────────────┐
├ Current entity and live truth ───────────────────────────────────┤
├ Destination cards / status composition ─────────────────────────┤
└──────────────────────────────────────────────────────────────────┘

narrow
┌ Utility bar · explicit navigation trigger ───────────────────────┐
├ Temporary destinations ─ open / Escape / focus restore ─────────┤
├ Unchanged main-content destination and reading context ─────────┤
└──────────────────────────────────────────────────────────────────┘
```

설계 결정:

- 제품 identity는 TopBar 또는 SideNav 중 한 곳만 소유한다. SideNav가 로고·제품명을 가지면 TopBar에는 workspace, search, notification, help, account 같은 utility만 둔다.
- 제품 identity의 full 시각 자산은 `ProductLockup` 승인 레지스트리가 소유한다. 초기 key는 `console`, `portal`뿐이며 둘 다 LK가 먼저 읽히는 SemiBold 600 outlined path다. 고정 Portal 정본도 registry Portal과 같은 path를 사용한다. 자유 문자열로 LK+제품명을 합성하지 않고, collapsed rail은 같은 승인 key의 `ProductLockup compact`로 명시 전환해 full과 같은 `LK {제품명}` 접근성 이름을 유지한다. 제품은 canonical short lockup name의 제안·승인, identity 소유 region, home route·click과 breakpoint를 소유한다.
- `DashboardShell topology="header-first"`는 전폭 header 아래에 navigation/main을 두는 호환 기본값이고, `topology="side-first"`는 wide 화면에서 full-height navigation 옆에 utility header/main을 둔다. 두 topology는 narrow에서 동일한 단일 열 navigation handoff로 수렴한다.
- 계층형 desktop navigation은 `SideNav surface="docked"`를 기본 조합으로 삼고, 기존 카드형 표면은 명시적인 `surface="floating"`으로 보존한다. persistent 접기/펼치기는 브랜드와 분리되어 논리적 끝 divider 안쪽 같은 위치를 유지하는 36px control이 정식 진입점이다. 64px rail에서도 control·브랜드·현재 부모 맥락을 유지하고, hover overlay와 overlay inline control은 별도 보조 기능으로 다룬다. 접힘 영속화는 제품이 controlled state로 소유한다.
- 작은 화면에서는 wide SideNav를 그대로 축소하지 않는다. 계층형 temporary navigation은 DashboardShell의 modal Drawer 계약으로 전환하고, dismiss 때 persistent trigger로 focus를 복구하며 route 선택 뒤 main 이동은 제품이 소유한다.
- `DashboardGrid`는 동급 요약이나 destination 반복을 배치할 뿐 중요도와 의미를 만들지 않는다. 서로 다른 우선순위는 section heading과 명시적인 span 조합으로 표현한다.
- 세 pinned 제품에서 공통 KPI 요구는 확인되지 않았다. `MetricCard`는 선택적 composition이고 `DashboardShell`의 필수 anatomy가 아니다.
- loading, empty, error, stale, offline, restricted는 데이터를 소유한 Card, `ResourceState`, `ChartFrame`, `DataGrid`에 남긴다. shell이 제품 workflow state machine이나 screen-sized template이 되어서는 안 된다.

필수 세 자산의 source-backed 판정은 다음과 같다.

| 제품 자산 | 고정 revision과 source blob | 판정 | workflow seam |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | supported by composition | 실제 logo + TopBar utility + current robot Card + ROS Bridge/관제서버/MQTT Status + destination Card launcher를 조합한다. 계층형 SideNav, KPI, table, chart는 이 pinned 화면에 없으므로 not applicable이다. robot switching, poll/reconnect, map launch와 route는 제품 소유다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/layout/MainLayout/index.jsx` (`2436725e49f6364fdb99f2047907f300ca367865`) · `MainLayout/Sidebar/index.jsx` (`749805a966552f957a61359c1b892a44f06af0a4`) · `RobotDashboard/pages/Dashboard.jsx` (`b0fd86a6b4c735aca390cd6dd179f766fa071f08`) | supported by composition | fixed TopBar, permanent/persistent/temporary SideNav, status·chart·table-like collection을 LDS 조합으로 지원한다. narrow Drawer의 focus/Escape/restore/background inert는 DashboardShell 계약으로 검증하며 map/video renderer, telemetry truth, facility state machine, command와 action eligibility는 제품 소유다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/layout/Sidebar.tsx` (`3b5d05b472b5e6346401ee673936c29211595a8c`) · `AuthShell.tsx` (`bd252534bcf44be11e2afa35bc2e6ed3f4e6edab`) · `src/app/page.tsx` (`719f69413e2e06c4d887d044696ba98cd90686f4`) | supported by composition | full-height product SideNav, offset main, destination Card와 project collection을 조합한다. pinned source에는 narrow navigation이 없어 adaptive collapse/drawer가 gap이다. project ranking, attention truth, routes, permissions, chat 위치와 query는 제품 소유다. |

### WF-03 Guarded remote action

핵심 판단은 “버튼을 눌렀는가”가 아니라 “의도한 원격 상태가 실제로 확인됐는가”다.

```text
┌ Target truth ───────────────────────────────────────────┐
│ 대상 · 현재 상태 · freshness · control eligibility     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Intent and impact ──────────────────────────────────────┐
│ 하려는 일 · 영향 범위 · 가역성 · 외부 변경 · 차단 이유 │
└─────────────────────────────────────────────────────────┘
                         ↓ explicit confirmation
┌ Lifecycle ──────────────────────────────────────────────┐
│ Requested → Sent → Accepted/ACK → Applied → Confirmed   │
│                 ↘ Failed / Timed out / Superseded       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Outcome and recovery ───────────────────────────────────┐
│ 실제 결과 · 확인 근거 · retry 가능성 · 다음 안전한 행동│
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- action row나 button은 진입점일 뿐 lifecycle 전체를 소유하지 않는다.
- 제품이 제공하지 않는 `applied`나 `confirmed` 단계를 LDS가 만들어내지 않는다.
- ACK와 실제 상태 변화 검증을 같은 성공 표시로 합치지 않는다.
- emergency stop처럼 지연 자체가 위험한 action은 이 confirmation 흐름 밖에 둔다.
- 결과는 transient toast만으로 끝내지 않고 command identity와 함께 다시 확인할 수 있어야 한다.

이 구조는 DeviceOps service/reboot, VisionOps config/restart, Control task dispatch에 적용되지만 각 명령의 phase와 확인 watcher는 제품이 제공한다.

### WF-04 Staged change and apply

핵심 판단은 “폼을 저장했는가”가 아니라 “무엇이 바뀌고, 어느 범위까지 실제 반영됐는가”다.

```text
┌ Context truth ──────────────────────────────────────────┐
│ 편집 대상 · 현재 revision/freshness · 편집 권한         │
└─────────────────────────────────────────────────────────┘
┌ Change summary ─────────────────────────────────────────┐
│ 변경 N · 오류 N · high-risk N · restart/external impact│
└─────────────────────────────────────────────────────────┘
┌ Editable content ───────────────────────────────────────┐
│ section                                                 │
│   current value → draft value        field validation   │
│ section                                                 │
│   current value → draft value        impact             │
└─────────────────────────────────────────────────────────┘
┌ Persistent actions ─────────────────────────────────────┐
│ Discard/Reset        Save draft        Apply change      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Post-save truth ────────────────────────────────────────┐
│ Saved ≠ Applied ≠ Restarted ≠ Verified                  │
│ command/result evidence와 다음 필요한 행동              │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- field renderer와 change workflow를 한 screen-sized component에 묶지 않는다.
- `current`, `draft`, `saved`, `applied`, `verified`를 별도 truth로 다룬다.
- sticky action은 긴 폼을 위한 layout 선택이며 domain schema를 소유하지 않는다.
- 오류는 field, section, global mutation 중 실제 소유 범위에 남긴다.
- LK Portal 관계 편집, DeviceOps profile rollout, VisionOps config, MLOps run configuration은 같은 change grammar를 쓰되 같은 form layout을 강제하지 않는다.

이 구조에서 우선 검토할 최소 LDS 단위는 change summary, dirty-leave guard, persistent action bar다. `SchemaConfigEditor` 같은 전체 화면형 컴포넌트는 구현 근거로 인정하지 않는다.

### WF-06 Long-running operation

핵심 판단은 progress 숫자가 아니라 “무슨 검증을 통과했고 어떤 결과 범위를 얻었으며 무엇을 해야 하는가”다.

```text
┌ Operation intent ───────────────────────────────────────┐
│ 입력 · 예상 출력 · 비용/시간 · external effect         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Preflight evidence ─────────────────────────────────────┐
│ Pass · Warning requiring judgment · Blocker · Unknown   │
└─────────────────────────────────────────────────────────┘
                         ↓ explicit actual-run intent
┌ Admission ──────────────────────────────────────────────┐
│ Queued/Reserved  또는  Rejected + reason                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Runtime ────────────────────────────────────────────────┐
│ current phase · elapsed/estimate · cancelability        │
│ progress/log는 보조 evidence                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Outcome statement ──────────────────────────────────────┐
│ process result · result semantics · scope · freshness   │
│ artifact/item results · impact · recovery               │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- preflight CTA와 actual execution CTA는 같은 시각적 무게와 문구를 사용하지 않는다.
- queued와 rejected를 pending 하나로 합치지 않는다.
- `success`는 process 종료일 뿐 external publish 완료를 의미하지 않는다.
- partial result는 성공 badge 옆의 작은 경고가 아니라 outcome의 핵심 상태다.
- log와 raw progress는 운영 판단에 필요한 outcome, impact, recovery보다 뒤에 둔다.
- LK Portal 파일 처리와 MLOps 장기 job은 같은 상태 어휘를 일부 공유하지만 같은 layout component를 사용하지 않는다.

따라서 전체 preflight+execution 화면을 `RunAction` 하나로 소유하지 않는다. 검토 후보는 preflight evidence list, operation admission state, outcome summary처럼 독립 책임을 가진 단위다.

### WF-07 Human review decision

핵심 판단은 “다음 stage를 실행했는가”가 아니라 “사람이 충분한 evidence를 보고 책임 있는 결정을 남겼는가”다.

```text
┌ Session context ────────────────────────────────────────┐
│ 대상 · 진행률 · 현재 candidate · decision policy       │
└─────────────────────────────────────────────────────────┘
┌ Primary evidence ───────────────────────────────────────┐
│ 판단에 직접 필요한 image/document/change/result         │
└─────────────────────────────────────────────────────────┘
┌ Supporting evidence and gaps ───────────────────────────┐
│ provenance · 비교값 · 관련 source · missing/uncertain   │
└─────────────────────────────────────────────────────────┘
┌ Decision bar ───────────────────────────────────────────┐
│ Accept      Reject      Skip      required reason/note  │
└─────────────────────────────────────────────────────────┘
                         ↓ persist before advance
┌ Recorded decision ──────────────────────────────────────┐
│ actor · time · reason · undo policy · next candidate    │
└─────────────────────────────────────────────────────────┘
                         ↓ session complete
┌ Completion and later transition ────────────────────────┐
│ decision counts · unresolved gaps · approval eligibility│
│ Approved와 Released는 별도 transition                   │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- review decision과 approval transition을 하나의 표면으로 합치지 않는다.
- decision 저장이 확인되기 전에 자동으로 다음 candidate로 이동하지 않는다.
- evidence layout은 MLOps anomaly와 LK Portal report patch가 서로 달라도 된다.
- 공유 가능한 것은 decision controls, required reason, progress, actor 기록 같은 작은 계약이다.
- `approved`를 completion success처럼, `released`를 approval badge처럼 표현하지 않는다.

이 wireframe은 review를 runner stage처럼 보이게 했던 기존 접근을 명시적으로 폐기한다.

### WF-01 Attention to context

핵심은 많은 카드를 보여주는 것이 아니라 조사 우선순위와 왕복 문맥을 보존하는 것이다.

```text
┌ Scope and trust ────────────────────────────────────────┐
│ 현재 범위 · 데이터 기준 시각 · freshness · 연결 상태   │
└─────────────────────────────────────────────────────────┘
┌ Attention summary ──────────────────────────────────────┐
│ 즉시 확인 필요 · blocked/degraded · 새로 들어온 항목   │
└─────────────────────────────────────────────────────────┘
┌ Narrowing controls ─────────────────────────────────────┐
│ search · filter · sort · saved/active query             │
└─────────────────────────────────────────────────────────┘
┌ Stable collection ──────────────────────────────────────┐
│ item · attention reason · freshness · next useful fact  │
│ live insertion은 현재 읽기 위치를 자동 이동시키지 않음 │
└─────────────────────────────────────────────────────────┘
                         ↓ open / back
┌ Return context ─────────────────────────────────────────┐
│ query · page · selection · scroll · revealed-new state  │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- Dashboard summary와 collection을 항상 한 컴포넌트로 묶지 않는다.
- 빈 결과, 아직 로드되지 않음, 요청 실패를 구분한다.
- live item은 사용자가 `새 항목 보기`를 선택할 때 현재 정렬 문맥에 합친다.
- `DatasetExplorer`처럼 source rail, sample grid, bulk action, pagination을 고정한 domain component를 기본 해법으로 쓰지 않는다.

### WF-02 Live truth investigation

핵심은 마지막 payload를 보기 좋게 나열하는 것이 아니라 “지금 믿을 수 있는 사실”과 원인 evidence를 분리하는 것이다.

```text
┌ Truth statement ────────────────────────────────────────┐
│ entity · live/stale/offline · last trustworthy time    │
│ 현재 표시값의 source와 신뢰 가능 범위                  │
└─────────────────────────────────────────────────────────┘
┌ Why attention is needed ────────────────────────────────┐
│ changed/degraded signal · impact · uncertainty          │
└─────────────────────────────────────────────────────────┘
┌ Causal evidence order ──────────────────────────────────┐
│ connection → input → processing/service → decision     │
│ 제품이 실제로 제공하는 계층만 표시                      │
└─────────────────────────────────────────────────────────┘
┌ Safe next actions ──────────────────────────────────────┐
│ refresh/resync · inspect detail · recovery              │
│ stale truth에서 위험 write는 차단                       │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- status badge 하나로 freshness와 domain health를 동시에 표현하지 않는다.
- VisionOps의 source/processor/decision, DeviceOps의 connection/service, Control의 robot/facility 계층은 같은 순서를 강제하지 않고 causal order만 공유한다.
- 복구 후에는 REST/authoritative source로 resync하기 전 위험 action을 다시 켜지 않는다.

`EquipmentStatusCard` 재설계의 필수 자산 검토는 다음과 같다. 이 표는 필요한 정보 종류와 조합 가능성만 판정하며 제품 화면의 ledger row, 치수, `ringLabel`·`chips` 같은 local API를 설계 근거로 사용하지 않는다.

| 제품 자산 | 고정 revision과 관련 source | 판정 | workflow seam |
| --- | --- | --- | --- |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx` | supported by composition | 설비 identity, primary condition, motion·connection 같은 supporting facts의 필요는 확인된다. LDS는 독립적으로 설계한 status label + labeled facts anatomy를 제공하고, telemetry truth·health 판정·recovery와 설비별 state machine은 Control이 소유한다. |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` | supported by composition | 선택 로봇과 ROS Bridge·관제서버·MQTT의 개별 truth, last-updated, connect/disconnect recovery가 실제로 존재한다. LDS status/freshness/labeled facts/action 조합을 사용하되 polling, endpoint 설정, health 판정, reconnect와 authoritative resync는 Web Viz가 소유한다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/chat/FloatingChat.tsx` | not applicable | 고정 source는 project/evidence scope와 assistant conversation을 소유하며 물리 설비 identity·condition·telemetry surface가 없다. |

### WF-05 Procedure authoring

핵심은 step 목록 자체가 아니라 목적, target, 순서, 예상 결과를 실행 전에 이해시키는 것이다.

```text
┌ Operational intent ─────────────────────────────────────┐
│ 목적 · target robot/map/floor · 현재 target truth      │
└─────────────────────────────────────────────────────────┘
┌ Ordered outline ────────────────────────────────────────┐
│ 1 step summary      valid/error                         │
│ 2 step summary      valid/error                         │
│ 3 step summary      valid/error                         │
└─────────────────────────────────────────────────────────┘
┌ Selected step editor ───────────────────────────────────┐
│ type-specific fields · target picker entry · validation │
└─────────────────────────────────────────────────────────┘
┌ Procedure preview ──────────────────────────────────────┐
│ resolved order · target summary · warnings/blockers     │
└─────────────────────────────────────────────────────────┘
┌ Intent split ───────────────────────────────────────────┐
│ Save template                    Submit now              │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- map picking은 별도 subflow이며 편집 중 step과 scroll 위치로 반드시 복귀한다.
- template 저장, 즉시 제출, schedule 생성은 서로 다른 intent다.
- 공용 LDS 단위는 reorderable outline, step validation summary, target summary 정도이며 완성 task editor를 컴포넌트로 만들지 않는다.

### WF-08 Evidence and provenance investigation

핵심은 renderer가 아니라 evidence가 어떤 주장과 결정을 지지하는지다.

```text
┌ Claim or question ──────────────────────────────────────┐
│ 지금 확인하려는 사실 · 결정에 필요한 기준              │
└─────────────────────────────────────────────────────────┘
┌ Provenance ─────────────────────────────────────────────┐
│ source · produced at · freshness · authority · scope    │
└─────────────────────────────────────────────────────────┘
┌ Primary evidence slot ──────────────────────────────────┐
│ log / image / video / document / graph / artifact       │
│ renderer 실패 시 readable fallback                      │
└─────────────────────────────────────────────────────────┘
┌ Related evidence ───────────────────────────────────────┐
│ corroborating source · upstream/downstream · comparison │
└─────────────────────────────────────────────────────────┘
┌ Gaps and decision link ─────────────────────────────────┐
│ missing/stale/uncertain · 다음 확인 또는 decision       │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- image overlay, Markdown, graph, terminal을 하나의 universal viewer API로 통합하지 않는다.
- LDS가 공유할 수 있는 것은 provenance header, availability/fallback, related-evidence navigation, accessible summary다.
- `AnnotatedImage`는 image annotation renderer만 소유하고, provenance chrome은 `SourceDisclosure`, 문서 렌더링은 제품 renderer가 소유한다.

### WF-09 Manual control safety session

핵심은 control widget을 보여주는 것이 아니라 continuous intent가 사라지는 모든 순간 안전 정지를 보장하는 것이다.

```text
┌ Target and authority ───────────────────────────────────┐
│ robot/device · live connection · current controller     │
└─────────────────────────────────────────────────────────┘
                         ↓ acquire / arm
┌ Active control boundary ────────────────────────────────┐
│ focus/hold truth · speed limit · command cadence        │
│                                                       │
│               primary control surface                  │
│                                                       │
│ live feedback · last accepted command                  │
└─────────────────────────────────────────────────────────┘
┌ Safety exits ───────────────────────────────────────────┐
│ release · blur · unmount · link loss → immediate stop   │
│ emergency stop은 항상 직접 접근 가능                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌ Re-entry ───────────────────────────────────────────────┐
│ stop evidence · reason · deliberate re-arm              │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- UI의 `armed`와 실제 control authority를 같은 boolean으로 가정하지 않는다.
- keyboard, pointer, joystick, D-pad, PTZ가 같은 control UI를 쓸 필요는 없지만 safety boundary는 공유해야 한다.
- e-stop은 confirmation이나 일반 command queue 뒤에 놓지 않는다.

### WF-10 Scoped knowledge assistance

핵심은 채팅창이 아니라 모델이 실제로 어떤 범위와 source를 사용했는지 신뢰할 수 있게 하는 것이다.

최소 세 제품 자산의 source 기반 판정은 다음과 같다.

| 제품 자산 | 고정 revision과 관련 source | 판정 | workflow seam |
| --- | --- | --- | --- |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/chat/FloatingChat.tsx` · `src/modules/chat/context.ts` | supported by composition | 관찰된 user/assistant turn, rich response, loading/error, source link, provider/project scope는 LDS message/feed/composer/source primitive로 조합할 수 있다. route·retrieval·provider transport·citation truth와 session policy는 LK Portal이 소유하며, 제품의 bubble 색·폭·citation disclosure와 local prop은 LDS 설계 근거가 아니다. |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/MapEditScreen.tsx` · `frontend/src/screens/TaskCreateScreen.tsx` | not applicable | 현재 고정 frontend는 map/floor geometry 편집과 task target authoring을 소유하며 evidence-backed conversation 진입점이 없다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx` · `frontend/src/views/dashboard/RobotDashboard/components/TaskCommandModal/index.jsx` | not applicable | 현재 고정 frontend는 supervision·task command·manual control workflow를 소유하며 scoped-knowledge chat 또는 citation UI가 없다. |

```text
┌ Scope truth ────────────────────────────────────────────┐
│ provider availability · resolved project/scope · source │
└─────────────────────────────────────────────────────────┘
┌ Conversation ───────────────────────────────────────────┐
│ user intent                                              │
│ assistant response                                      │
│ expandable supporting sources                           │
│ streaming/error/retry는 message 단위                    │
└─────────────────────────────────────────────────────────┘
┌ Composer ───────────────────────────────────────────────┐
│ input · current scope reminder · unavailable reason     │
└─────────────────────────────────────────────────────────┘
                         ↓ scope/provider change
┌ Session boundary ───────────────────────────────────────┐
│ 유지 가능한가? 아니라면 reset 영향과 새 session 명시   │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- scope chip을 실제 backend evidence와 무관한 장식으로 쓰지 않는다.
- 전체 `ScopedConversation`을 한 컴포넌트로 유지하지 않고 message, source disclosure, composer state, reset guard로 분해한다.
- retrieval, citation truth, persistence, provider bridge는 앱 소유다.
- 제품 source는 위 capability의 필요성만 확인한다. message anatomy와 시각은 Ant Design X Bubble/Sender/Attachments, Carbon AI Chat, WAI-ARIA `log`, LDS `Avatar`·`Button`·input·source sibling에서 독립적으로 다시 도출한다.
- AI assistant 기본은 긴 assistant 응답을 borderless document로 보여 준다. 짧은 발화는 화자별로 구분해 user는 solid primary bubble(`--color-semantic-primary-heavy` + `--color-semantic-static-white`), human-agent는 neutral fill bubble(`--color-semantic-fill-strong`), system은 중앙 neutral 칩(`--color-semantic-fill-normal`)으로 렌더한다. 역할 구분은 색·정렬만이 아니라 이름 옆 role 배지(AI/상담원)로도 전달하며, `presentation="document|bubble"`은 content hierarchy override로 유지한다.
- `MessageFeed`는 named log·history/follow만 소유하는 투명하고 chrome-free한 영역이다. app header/sidebar와 outer surface는 제품이 제공한다. `MessageComposer`는 attachments → full-width textarea → 하단 leading/trailing action과 send-or-stop의 elevated one-shell을 제공하되 sticky 위치, virtual-keyboard inset과 transport policy는 제품 shell이 소유한다.
- source는 `ConversationMessage`의 generic React slot에 `SourceDisclosure`를 명시적으로 조합한다. LK Portal의 `근거 N개` 접힘 UI를 공용 `sourcePresentation` API로 승격하지 않는다.
- 대표 검토는 약 760px reading column과 320px narrow에서 수행하며 dark, 긴 rich assistant document, multiline user solid primary bubble, human-agent neutral fill bubble, streaming/error message, disabled composer를 포함한다. identity·content·source·action이 겹치거나 card-within-card로 읽히지 않아야 한다.

[`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md)의 Track C 후속 gate는 완료했다.
`ConversationMessage`, `MessageFeed`, `MessageComposer`가 각각 canonical AI source/action anatomy·history/follow와 날짜/첫 미읽음 경계·IME-safe compose의
독립 시각·접근성 계약을 소유한다. general conversation role의 document/bubble 기본값과 optional placement override는 LDS가 소유하고, 정확한
participant role·provider/stream transport·route·retrieval·RAG·persistence와 session reset은 product-owned seam이다.
완료된 Product extension을 전체 `ScopedConversation` wrapper로 되돌리지 않는다.

### WF-11 Sensitive credential handling

핵심은 secret을 보여주는 것이 아니라 가능한 한 secret을 보여주지 않고 목적을 달성하는 것이다.

```text
┌ Credential identity ────────────────────────────────────┐
│ label · provider · scope · status · last updated        │
└─────────────────────────────────────────────────────────┘
┌ Masked value ───────────────────────────────────────────┐
│ ••••••••  Copy reference / Reveal / Replace / Revoke   │
└─────────────────────────────────────────────────────────┘
                         ↓ reveal only when necessary
┌ Re-auth and timed disclosure ───────────────────────────┐
│ permission result · visible timeout · audit notice      │
└─────────────────────────────────────────────────────────┘
┌ Return to masked truth ─────────────────────────────────┐
│ auto-hide · copy feedback · update/revoke result        │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- credential table, edit form, secret reveal을 하나의 `SecretField`가 소유하지 않는다.
- downstream workflow에는 raw secret보다 credential reference를 전달한다.
- copy feedback은 secret 값을 다시 렌더링하지 않는다.

### WF-12 External publish

핵심은 publish 버튼이 아니라 외부 target과 actual write intent, 완료 evidence를 명확히 연결하는 것이다.

```text
┌ Publish target truth ───────────────────────────────────┐
│ provider · repo/path · privacy · credential reference   │
└─────────────────────────────────────────────────────────┘
┌ Validation-only preflight ──────────────────────────────┐
│ blockers · warnings · planned writes · expected evidence│
└─────────────────────────────────────────────────────────┘
                         ↓ separate actual intent
┌ External impact confirmation ───────────────────────────┐
│ 무엇이 생성/변경되는지 · 되돌리기 범위 · actor          │
└─────────────────────────────────────────────────────────┘
┌ Publish attempt ────────────────────────────────────────┐
│ queued/running · target-scoped progress                  │
└─────────────────────────────────────────────────────────┘
┌ External result evidence ───────────────────────────────┐
│ remote id/url/revision · partial/failed items · retry    │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- credential reveal과 publish confirmation을 합치지 않는다.
- `published`와 `released`도 정책상 같은 의미라고 가정하지 않는다.
- 외부 URL/revision 같은 product-provided evidence 없이 완료 상태를 만들지 않는다.

### WF-13 Schedule automation

핵심은 날짜 입력 폼이 아니라 operation rule과 실제 occurrence의 상태를 구분하는 것이다.

```text
┌ Operation reference ────────────────────────────────────┐
│ 기존 task/action · target · owner · priority            │
└─────────────────────────────────────────────────────────┘
┌ Time rule ──────────────────────────────────────────────┐
│ once/recurring · timezone · start/end · recurrence      │
└─────────────────────────────────────────────────────────┘
┌ Conflict and availability ──────────────────────────────┐
│ overlapping operation · unavailable target · policy     │
└─────────────────────────────────────────────────────────┘
┌ Save rule ──────────────────────────────────────────────┐
│ summary · next occurrence · enabled/paused              │
└─────────────────────────────────────────────────────────┘
┌ Occurrence history ─────────────────────────────────────┐
│ scheduled/run/missed/failed occurrence는 rule과 별도    │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- schedule rule state와 개별 실행 상태를 하나의 status로 합치지 않는다.
- recurrence control은 공유 가능하지만 conflict 계산과 task semantics는 앱 소유다.
- recurrence editor는 현재 한 workflow의 폼 조합이므로 public component로 고정하지 않는다. 제품이 `DatePicker`, `TimePicker`, `Select`, `CheckboxGroup`, `ValidationSummary`를 조합하고 두 번째 독립 소비자가 확인될 때 계약화를 재검토한다.

### WF-14 Approval transition

핵심은 상태 버튼이 아니라 어떤 evidence로 어떤 transition을 누가 승인하는지다.

```text
┌ Current truth ──────────────────────────────────────────┐
│ entity/version · current state · requested transition   │
└─────────────────────────────────────────────────────────┘
┌ Gate evidence ──────────────────────────────────────────┐
│ pass · block · pending · insufficient · evidence source │
└─────────────────────────────────────────────────────────┘
┌ Human transition intent ────────────────────────────────┐
│ allowed target · required note · actor                  │
└─────────────────────────────────────────────────────────┘
                         ↓ server-confirmed transition
┌ Recorded state change ──────────────────────────────────┐
│ from/to · actor · time · note · rejection if any        │
└─────────────────────────────────────────────────────────┘
┌ Separate release truth ─────────────────────────────────┐
│ approved ≠ released · external evidence required        │
└─────────────────────────────────────────────────────────┘
```

설계 결정:

- review queue completion과 approval transition을 분리한다.
- disabled target을 선택 가능한 옵션처럼 보이지 않게 한다.
- transition을 optimistic UI로 먼저 성공 표시하지 않는다.
- approval UI를 별도 public component로 고정하지 않는다. 제품이 policy와 persistence를 소유하고, LDS의 evidence·form·action 요소를 조합하되 approval과 external release를 별도 축으로 유지한다.

### WF-15 Map navigation and facility authoring

현재 단계는 `verified`다. `LK-ROBOTICS/lk_web_viz`의 authoring source와 `TaskRunScreen`·`Map2DViewer` runtime source를 함께 pin해 point·line·region·landmark·층별 task target, observed path와 robot pose의 분리를 다시 읽었다. 구현·스토리 증거는 외부 `@lk-design-system/lds-robotics-ui` revision `0ae058d`에 있다. 이 작업은 **LK Robotics Extension**이며 WDS Core parity로 주장하지 않는다.

필수 세 자산의 이번 Robotics Navigation 교차 판정은 다음과 같다. `supported` 계열 판정은 실제 component-level source mapping이 닫힌 경우에만 사용한다.

| 제품 자산 | 고정 revision과 관련 source | 판정 | workflow seam |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/MapEditScreen.tsx` · `frontend/src/screens/TaskRunScreen.tsx` · `frontend/src/components/Map2DViewer.tsx` | supported by composition | authoring point/line/region/facility와 runtime observed trajectory가 LDS 조합으로 지원된다. runtime은 history line과 robot pose를 분리하므로 progress head는 pose를 대체하지 않는다. planned Route segment geometry·fraction feed, `forbidden` line, stair/stair-slope는 gap이다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/routes/MainRoutes.jsx` · `frontend/src/views/dashboard/RobotDashboard/components/LiveMonitoring/index.jsx` · `frontend/src/views/dashboard/RobotDashboard/components/InteractiveMap/index.jsx` | supported by composition | observed path history와 current robot+heading이 분리되어 Trajectory progress head 조합이 닫혔다. pinned workflow에는 planned Route feed가 없어 Route는 not applicable이며 나머지 Navigation renderer mapping은 계속 unverified다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/app/projects/page.tsx` · `src/components/projects/ProjectWorkspace.tsx` · `src/components/chat/FloatingChat.tsx` | not applicable | 현재 고정 frontend는 project/evidence scope, document intake, assistance, credential workflow를 소유하며 map·floor·robot navigation 진입점이나 geometry authoring 책임이 없다. |

라벨 조정은 같은 제품 판정을 바꾸지 않는다. Web Viz의 authoring/runtime 지도와
Control의 live monitoring 지도는 `NavigationAnnotationLayer`의 명시적
`overview`/`standard`/`detail` 밀도, 8px screen-space obstacle buffer, 우선순위
숨김을 조합할 수 있다. 제품은 화면 목적에 맞는 밀도 단계, feature selection,
alarm/focus truth, map chrome과 semantic mirror를 소유하고 LDS는 라벨 배치만
소유한다. LK Portal에는 지도 진입점이 없으므로 계속 `not applicable`이다.

독립 low-fi의 읽기·키보드 순서는 다음과 같다.

```text
┌ Floor / map identity · load / stale / save feedback ───────────────┐
├ Product-owned authoring tools · active tool · unsaved indicator ──┤
│ Map viewport                                                       │
│   regions → graph/reference lines → route → trajectory             │
│   → point/facility symbols → selection/focus                       │
├ Named feature list ───────────────┬ Selection inspector ───────────┤
│ same identity/state as the map    │ type · floor · state · details │
└ Product-owned validation · save/retry actions ─────────────────────┘
```

지도 geometry는 pointer 탐색을 제공하되 dense SVG를 Tab 순서로 만들지 않는다. 키보드는 같은 identity와 상태를 가진 named list를 따라가고, DOM·keyboard 순서는 floor/map context → authoring tool → map → named list → inspector → save/recovery 순서를 유지한다. 좁은 폭에서는 지도 아래에 list와 inspector가 이어지며, 지도 내부 label을 여러 card로 분해하지 않는다.

제품 source와 LDS 책임을 대조한 결과는 다음과 같다.

| 제품 요구 | 판정 | LDS / 제품 경계 |
| --- | --- | --- |
| floor와 map identity, 층별 task target | supported by composition | `Map2DCanvas`를 소유하는 제품 renderer와 ordinary-text list/inspector가 identity를 공유한다. floor topology와 task schema는 제품 소유다. |
| generic waypoint, goal, charger, POI | supported | `WaypointMarker`가 role·annotation·availability·invalid/stale을 zoom-stable symbol과 accessible name으로 제공한다. 제품 landmark type을 그대로 public enum으로 복제하지 않는다. |
| navigation graph lane | supported | `LaneOverlay`는 방향·통행 제약·폐쇄·충돌을 가진 graph edge다. facility 실시간 상태는 `FacilityTransition`에 남긴다. |
| 제품의 `forbidden` line | gap | 현재 제품 line은 금지 경계이고 `LaneOverlay`와 의미가 다르다. 이를 graph lane으로 매핑하지 않으며, 별도 renderer 계약은 후속 Robotics audit에서 판단한다. |
| observed/predicted trajectory | supported by composition | `TrajectoryOverlay`는 current sample 이전의 strong line, 이후의 recessed line, path-tangent open head를 제공한다. `Map2DViewer`와 `InteractiveMap`의 robot pose/heading/footprint는 제품 layer에 남긴다. |
| planned route | gap | `RouteOverlay` 계약은 준비되어 있지만 pinned Web Viz/Control source에서 segment geometry와 `segmentId`+`fraction` feed를 찾지 못했다. goal/lane ordinal을 route geometry로 추론하지 않는다. |
| forbidden/work/speed-limit region | supported by composition | `SpatialRegion`의 behavior-region geometry와 제품 label/value를 조합한다. 속도 값과 편집 정책은 제품 소유다. |
| stair와 stair-slope region | gap | 현재 public `SpatialRegion` kind가 이 terrain 의미를 소유하지 않는다. generic behavior region으로 위장하지 않고 후속 semantic-kind 검토 대상으로 남긴다. |
| elevator entry/interior, door, dock | supported by composition | `FacilityTransition` endpoint/state와 `SpatialRegion`의 lift lobby/cabin grammar를 조합한다. 현재 제품의 동일 Material elevator glyph를 복제하지 않고 entry/interior를 관계·label·region으로 구분한다. |
| selection, focus, unavailable, invalid, stale | supported by composition | map symbol의 shape/pattern/glyph와 named list/`SelectionInspector` text를 함께 사용한다. circular pointer target은 24×24 CSS square를 포함하도록 최소 약 34px 지름을 확보한다. |
| multi-overlay label density and collision | supported by composition | `NavigationAnnotationLayer`가 danger > focus > selection > current context 우선순위, 종류별 후보 위치, 8px obstacle buffer, 24px fine nudge, `overview`/`standard`/`detail` 밀도를 제공한다. 제품은 feature truth와 density 선택을 소유하고 숨겨진 시각 라벨의 identity는 named list/accessible name에 남긴다. |
| edit handles, commands, save/unsaved/error, persistence | not applicable | LDS renderer 상태가 아니라 `ZoneEditor`와 화면 state machine이 소유한다. 실패 시 draft와 선택을 유지하고 save/retry evidence를 같은 product workflow에 남긴다. |

근거가 된 외부 category reference는 Open-RMF의 waypoint/lane/facility event 분리, Nav2 Route Server의 sparse route graph와 dense path 분리, MapLibre의 line/symbol layer 및 placement 분리, WCAG 2.2의 target-size 요구다. 구체 링크와 각 결론은 여섯 Navigation component의 `.prompt.md`에 기록했다.

Storybook에서는 Waypoint, Lane, Route/Trajectory, SpatialRegion, FacilityTransition의 compound state를 1280px에서, 각 narrow story를 320–360px에서 확인했다. Route의 current-segment label과 progress text 충돌을 분리하고 Route 개요를 `overview` 밀도로 통합했다. Light/Dark에서 현재 구간·42% 진행·active trajectory를 유지하고 완료 구간 라벨만 숨겼으며, annotation density/priority stories는 긴 한국어 라벨, danger+focus+selection, 8px collision buffer, 24px fine-nudge 상한을 검증한다. 320px annotation surface는 `scrollWidth === clientWidth`이고 접근성 스캔은 violation 0을 유지했다. invalid/stale route·trajectory는 `!`/`~` glyph가 남고, point-like interactive geometry는 24×24 CSS square를 포함하는 hit core를 갖는다.

독립 wireframe과 mapping은 닫혔다. 외부 Robotics 패키지의 `HazardMarker`가 stairs/ramp/dropoff/obstacle을, `SpatialRegion`이 slope terrain을 소유한다. 제품의 `forbidden` line은 navigation lane이 아니라 제품 authoring renderer의 편집 geometry이므로 새 LDS semantic primitive로 승격하지 않는다. 이 명시적 경계와 normal/narrow interaction evidence로 `verified`를 닫는다.

## 현재 신규 컴포넌트 disposition

이 표는 현재 구현을 보존하기 위한 목록이 아니다. 새 workflow 계약에 비춰 public component 경계를 다시 판단한 당시 결과다. 현재 화면이나 wireframe에 반복된다는 사실만으로 component를 만들지 않으며, 고유 interaction·accessibility contract 또는 둘 이상의 제품에서 반복되는 상태 문법이 없으면 product-owned composition으로 남긴다. 또한 이 표와 `componentDisposition`은 제품 coverage만으로 새 public lifecycle 결정을 승인하지 않는다. 각 keep/redesign/split/remove는 LDS sibling·WDS·권위 있는 외부 근거와 design-owner decision으로 독립 확인해야 하며, 이를 repository-wide checker에서 분리하는 후속 작업은 `DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md` R-04로 추적한다.

| 판정 | 수 | 의미 |
| --- | ---: | --- |
| keep | 15 | 책임이 작고 일반적인 component category와 일치한다. 구현 검토 후 재사용한다. |
| redesign | 6 | 개념은 필요하지만 현재 API가 상태 축을 합치거나 화면 구조를 과도하게 소유한다. |
| split | 6 | 현재 compound component를 제거하고 더 작은 책임으로 다시 도출한다. |
| remove | 22 | LDS public component로 둘 근거가 없으며 기존 primitives/product renderer 조합으로 돌린다. |
| separate-audit | 6 | 제품 workflow coverage만으로 anatomy를 결정할 수 없는 editor·viewer 계열로 별도 LDS sibling·공식 category-reference 감사를 요구한다. |

### Keep

| 컴포넌트 | 근거 |
| --- | --- |
| `SpeedDial` | 공개 action category가 명확하고 workflow/page 구조를 소유하지 않는다. |
| `LogViewer` | log renderer가 아니라 filter/follow/scroll 상태를 가진 bounded content component다. |
| `ReorderList` | 같은 레벨 항목의 순서 변경이라는 작은 계약이다. |
| `Legend` | 시각 encoding과 label 연결만 소유한다. |
| `LineChart` | lightweight presentational chart 범위가 명시돼 있다. |
| `PropertyField` | field 하나의 current/draft/apply grammar로 제한할 수 있다. direct-WDS 분류는 수정해야 한다. |
| `DockPanel` | dock/collapse/resize라는 layout behavior만 소유한다. |
| `DirectionalPad` | discrete momentary control로 `Joystick`과 구분된다. |
| `IconPicker` | 단일 icon 선택이라는 표준 category다. |
| `WheelPicker` | generic product picker로 WDS Date/Time parity를 주장하지 않는다. |
| `FileUploadQueue` | 파일별 upload/processing/result와 retry/remove만 소유한다. WF-06 전체를 소유하지 않는다. |
| `SearchableMultiSelect` | async searchable multi-selection이라는 표준 input category다. |
| `SecretField` | masked/reveal/copy의 좁은 계약으로 유지한다. credential CRUD나 publish를 포함하지 않는다. |

### Redesign

| 컴포넌트 | 문제와 새 경계 |
| --- | --- |
| `ScrollArea` | 7px WebKit 전용 스크롤바를 제거하고 OS 기본 `auto`, 제한 표면용 표준 `compact`, stable gutter와 조건부 키보드 focus 계약으로 재설계했다. 공용 hidden API는 제공하지 않는다. |
| `FileBrowser` | 재설계했다. 표준 file browser category는 유지하되 directory navigation과 file/folder selection을 별도 callback과 control로 분리했다. |
| `TreeSelectionPanel` | 제거하고 `TreePicker`로 교체했다. 화면 panel 책임을 버리고 controlled selection/expansion/search와 descendant 범위 선택만 남겼다. 조회는 기존 `Tree`가 소유한다. |
| `EvidenceViewer` | 제거하고 `AnnotatedImage`로 교체했다. normalized image annotation과 접근성 요약만 남기고 provenance, metric, review action은 분리했다. |
| `ManualControlGuard` | 실제 안전을 보장한다고 오해할 수 있는 이름을 제거하고 `ManualControlSession`으로 교체했다. link, authority, UI armed, dead-man, focus를 분리하며 blur/unmount/link-loss release 요청과 re-arm을 계약화했다. |

### Split

| 현재 컴포넌트 | 분해 방향 |
| --- | --- |
| `DocumentSurface` | 제거했다. provenance/availability는 `SourceDisclosure`, renderer와 patch decision은 product-owned `ChoiceCard`/`Textarea`/`ActionArea` 조합으로 분리한다. |
| `ScopedConversation` | 완성 workflow wrapper는 제거했다. 재사용 가능한 message anatomy·feed history/follow·IME-safe compose는 `ConversationMessage`, `MessageFeed`, `MessageComposer`가 소유하고, provenance는 `SourceDisclosure`, scope selection은 `TreePicker`, reset guard는 `ConfirmDialog`로 분리한다. retrieval, transport, persistence, session policy는 제품이 소유한다. |
| `RunAction` | 제거했다. preflight evidence는 `ValidationSummary`/`DescriptionList`, confirmation은 `ConfirmDialog`, admission/actual-run intent는 product-owned `Button`/`ActionArea` 조합으로 분리한다. |
| `SchemaConfigEditor` | 제거했다. field renderer는 제품에 남기고 `PropertyField`, `DescriptionList`, `ValidationSummary`, `DockPanel`, `ActionArea`로 current/draft evidence와 persistent action layout을 조합한다. |
| `StepComposer` | 제거했다. `ReorderList`, `ValidationSummary`, `DescriptionList`와 product-owned target/step editor composition으로 돌린다. |
| `TransitionGate` | 제거했다. gate evidence는 `ValidationSummary`/`DataGrid`/`SourceDisclosure`, state facts는 `DescriptionList`/`StatusBadge`, note와 submit은 `Textarea`/`ActionArea`로 분리한다. transition policy와 persistence는 제품 소유다. |

### Remove as public LDS component

| 컴포넌트 | 이유 |
| --- | --- |
| `ArtifactBrowser` | artifact table/detail page 구조를 고정한다. collection primitives와 provenance/evidence chrome으로 조합한다. |
| `DatasetExplorer` | source rail, search, grid/list, bulk action, pagination을 한 화면형 component로 고정한다. WF-01/WF-08 composition으로 돌린다. |
| `LineageExplorer` | `TopologyInspector` wrapper가 product graph 의미와 layout을 LDS가 소유하게 만든다. lineage renderer는 앱에 둔다. |
| `AlertCollection` | alert inbox page 구조다. `DataGrid`, filters, pagination, stable live insertion 계약을 조합한다. |
| `ServiceControlRow` | systemd-like status/action 기본값과 confirm flow를 행 안에 결합한다. status + command primitives를 제품에서 조합한다. |
| `TopologyInspector` | node/edge layout과 inspector를 고정해 VisionOps/MLOps renderer 책임을 침범한다. LDS는 evidence/selection chrome만 제공한다. |
| `CommandAction` | `Button`에 eligibility와 request 문구를 붙인 domain wrapper다. 가능 여부와 request error는 제품 상태로 두고 `Button`, `ActionArea`, `Callout`을 조합한다. |
| `ConversationMessages` | LK Portal의 message 배열과 streaming/retry 표현을 public component로 고정한다. 제품이 semantic message list와 `Callout`, `SourceDisclosure`를 조합한다. |
| `ConversationComposer` | `form`, `Textarea`, `Button`의 단순 조합이며 별도 interaction contract가 없다. draft와 submit policy는 제품이 소유한다. |
| `ApprovalTransition` | 한 MLOps transition의 eligibility와 submit 가능 여부를 내부에서 판단해 제품 policy를 침범한다. evidence/form/action primitives로 조합한다. |
| `TerminalFrame` | 실제 interactive terminal 소비자는 DeviceOps 하나뿐이며 renderer와 transport를 제외하면 session header와 overlay 조합이다. DeviceOps가 `ConnectionBadge`, `DescriptionList`, `Callout`, `Button`으로 구성한다. |
| `EditorPanel` | `DockPanel`, form, `ActionArea`, dirty-close `ConfirmDialog`를 고정 조합하며 별도 interaction primitive가 없다. form state와 닫기 정책은 제품이 소유한다. |
| `ExecutionStatus` | activity/outcome/freshness 객체를 `StatusBadge`, `ProgressBar`, `Timeline`, `Callout`에 배치하는 product status block이다. polling과 recovery 의미도 제품이 소유한다. |
| `MetricComparison` | 43줄의 table wrapper가 threshold verdict까지 계산해 제품 평가 정책을 침범한다. `DataGrid` 또는 제품 table renderer로 돌린다. |
| `ReviewDecision` | decision draft, required reason, persistence state와 submit을 한 workflow control로 묶는다. `ChoiceCard`, `Textarea`, `ActionArea`를 제품에서 조합한다. |
| `BatchOperationSummary` | count/progress/failure row를 고정한 결과 화면 조각이다. `ProgressBar`, `StatusBadge`, list row, `ActionArea` 조합으로 충분하다. |
| `ChangeSummary` | current/proposed/impact schema를 고정한 읽기 전용 목록이다. `DescriptionList`, `DataGrid`, `ValidationSummary` 조합으로 충분하다. |
| `CommandLifecycle` | 제품 phase schema를 `Timeline`과 badge에 재배치하는 wrapper다. accepted/applied/confirmed 의미와 late ACK 정책은 제품 계약으로 남긴다. |
| `ConnectionStatus` | `ConnectionBadge`, 세 개의 fact row와 reconnect action을 고정 조합한다. freshness/health 판정과 recovery는 제품이 소유한다. |
| `PreflightSummary` | 검사 outcome/check/recovery/recheck를 하나의 product workflow block으로 고정한다. `ValidationSummary`, `DescriptionList`, `ActionArea`로 조합한다. |
| `SafetyConfirmDialog` | `ConfirmDialog`에 영향 목록과 typed phrase를 붙인 convenience wrapper다. 위험 작업 정책과 typed input은 제품 composition으로 남긴다. |
| `TimeRuleEditor` | 현재 확인된 소비자가 하나뿐이고 once/weekly schema를 public API로 고정한다. 공통 form controls 조합으로 되돌리고 반복 소비자 확인 전에는 승격하지 않는다. |

### Separate editor and viewer audit

`CanvasEditorShell`, `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, `ViewportStatusBar`는 LDS sibling과 공식 editor·accessibility reference를 기준으로 별도 감사하고, `lk_web_viz`는 workflow coverage만 확인한다. `ViewerFrame`도 같은 원칙으로 map·3D·video sibling과 공식 viewer·map·accessibility reference를 기준으로 별도 감사한다. 제품 source는 renderer truth와 LDS/product seam만 확인하며 현재 화면의 anatomy나 style을 복제하는 근거가 아니다.

ViewerFrame 교차 판정은 LK Web Viz revision `a984def117c05acd213f494cbb8a42e990595505`의 `Map2DViewer.tsx`·`MapPreview.tsx`·`PcdMap3DPanel.tsx`, LK Control Full Daedeok revision `93802fc2aa5d29f930380ae58d51dcb68322b5e7`의 `InteractiveMap3D/index.jsx`·`manual-control/index.jsx`, LK Portal revision `e5ee99d5062170e26abe63d9105c2b8a024ce710`의 project/chat entry를 pin했다. Web Viz와 Control은 renderer-owned pan/zoom·source/transport·robot authority를 제품에 남기는 `supported by composition`, LK Portal은 viewport-local navigation contract가 없어 `not applicable`이다. ViewerFrame은 소스 식별, 로컬 명령 배치, 차단/가용자리 상태 표현만 소유한다.

## Elevator fleet overview coverage

`ElevatorFleetOverview`는 여러 건물의 엘리베이터 위치를 건물별 병렬 승강로로
비교하는 `LK Product Extension`이다. 외부 공식 category reference의
position/direction/status anatomy를 LDS `ScrollArea`, card surface,
설비별 live availability의 `StatusIndicator`, 건물·fleet attention 집계의
`StatusBadge`와 조합하며, 제품 화면이나 원격 제어 workflow를 복제하지 않는다.

| 제품 자산 | 고정 revision과 source | 판정 | LDS / 제품 seam |
| --- | --- | --- | --- |
| LK Web Viz | `a984def117c05acd213f494cbb8a42e990595505` · `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`) | not applicable | pinned dashboard에는 selected robot과 connection truth는 있지만 다중 건물 elevator fleet가 없다. 향후 조합 시 polling, stale 판정, grouping과 detail navigation은 Web Viz가 소유한다. |
| LK Control Full Daedeok | `93802fc2aa5d29f930380ae58d51dcb68322b5e7` · `frontend/src/views/dashboard/RobotDashboard/pages/Dashboard.jsx` (`b0fd86a6b4c735aca390cd6dd179f766fa071f08`) | supported by composition | equipment identity, condition, direction-like facts와 freshness 필요를 확인했다. LDS는 독립적으로 설계한 위치 projection을 제공하고 Control은 telemetry truth, alert policy, permission, route와 command를 소유한다. |
| LK Portal | `e5ee99d5062170e26abe63d9105c2b8a024ce710` · `src/components/chat/FloatingChat.tsx` (`ce48afb3f7ed0c7a7bad01d6a02e3a75006b74d4`) | not applicable | pinned project/chat workflow에는 물리 설비 fleet monitoring 진입점이 없다. |

대표 Storybook 검토는 `통합 현황`의 정상·점검·고장·연결 끊김 compound state,
`좁은 화면`의 390px horizontal overflow, `다크 테마`, `빈 현황`, 읽기 전용
contract를 대상으로 한다. 실제 building membership, floor calibration, telemetry,
alert threshold, filtering, drawer, route와 원격 명령은 제품 소유다.

## Workflow implementation verification

아래 표는 화면을 재현한 목록이 아니다. 각 workflow를 처음부터 끝까지 다시 읽고, LDS가 공유할 책임과 제품이 끝까지 소유할 책임을 분리한 closure matrix다.

| Workflow | 검증된 LDS 책임 | 제품에 남는 seam |
| --- | --- | --- |
| WF-01 | `DataGrid`, `DataToolbar`, `FileBrowser`, `TreePicker`의 resource/selection/filter/navigation 계약 | ranking, query, route, scroll·page 복원 |
| WF-02 | `ConnectionBadge`, `DescriptionList`, `LogViewer`, chart/legend, `Button`/`ActionArea` 조합 | telemetry transport, freshness/health 판정, diagnosis, reconnect resync |
| WF-03 | `ValidationSummary`, `DescriptionList`, `ConfirmDialog`, `Timeline`, `Button`/`ActionArea` 조합의 결정 단계 분리 | eligibility, authorization, payload, idempotency, typed phrase policy, confirmation watcher |
| WF-04 | `PropertyField`, `DescriptionList`, `ValidationSummary`, `DockPanel`, `ActionArea`, dirty-close `ConfirmDialog` 조합 | schema rendering, mutation, business validation, restart policy |
| WF-05 | `ReorderList`, `ValidationSummary`, `DescriptionList`, `DockPanel`, `ActionArea`의 ordering/validation/preview 조합 | command schema, map target picker, task payload, submit policy |
| WF-06 | `FileUploadQueue`, `ProgressBar`, `StatusBadge`, `Button`/`ActionArea` 조합 | runner, slot, batch result schema, upload/convert side effect, cancel/retry execution |
| WF-07 | `SourceDisclosure`, `AnnotatedImage`, `DataGrid`, `ChoiceCard`, `Textarea`, `ActionArea` 조합 | review policy, metric verdict, authorization, persistence, queue navigation |
| WF-08 | `SourceDisclosure`, `AnnotatedImage`, `LogViewer`, `FileBrowser`, chart/legend의 renderer chrome | Markdown/media decoder, graph layout, artifact access, claim semantics |
| WF-09 | `ManualControlSession`, `ConnectionBadge`, `Joystick`, `DirectionalPad`의 authority/arm/hold/release 분리 | authority policy, freshness/health 판정, cadence, STOP transport, robot watchdog |
| WF-10 | `ConversationMessage`, `MessageFeed`, `MessageComposer`, `SourceDisclosure`, `TreePicker`, `ConfirmDialog`의 document/bubble message anatomy, completed/streaming/failed AI action recipe, chrome-free log, 날짜/첫 미읽음 separator, 읽기 위치와 viewport keyboard 이동, elevated one-shell compose, source/scope 계약 | participant role truth, provider/stream transport, route, retrieval/RAG, unread/date truth, scope resolution, persistence, session reset |
| WF-11 | `SecretField`, `ConfirmDialog`, `Callout`의 masked/reveal/copy/re-auth composition | encryption, permission, audit logging, update/revoke API |
| WF-12 | `ValidationSummary`, `ConfirmDialog`, `ProgressBar`, `SourceDisclosure`, `ActionArea`의 external-impact/result 조합 | target validation, credential use, upload, outcome schema, external release truth |
| WF-13 | `DatePicker`, `TimePicker`, `CheckboxGroup`, `ValidationSummary`, `SearchableMultiSelect`, `Button`/`ActionArea` 조합 | recurrence schema, eligibility, conflict calculation, task lookup, persistence, occurrence execution |
| WF-14 | `DataGrid`, `SourceDisclosure`, `ValidationSummary`, `DescriptionList`, `Textarea`, `ActionArea` 조합으로 eligibility/approval/release를 구분 | metric verdict policy, authorization, persistence, external release evidence |
| WF-15 | 외부 Robotics 패키지의 point/lane/route/trajectory/region/facility/hazard renderer와 named semantic mirror 계약 | projection, floor topology, editor commands, persistence, robot pose, product-only forbidden-line geometry |
| WF-16 | `ProductLockup`의 승인 key·SemiBold outlined path·모브랜드 우선 hierarchy·layout·appearance·접근성 계약과 `DashboardShell`, `SideNav`, `TopBar`, `BottomNav`의 landmark, wide/narrow/temporary slot, collapse, modal focus/Escape/restore/inert 계약 | canonical short lockup name 제안·승인, identity 배치, route/click, breakpoint, destination hierarchy, permission, query, Drawer open state |

WF-15는 외부 Robotics 패키지 revision `0ae058d`의 navigation/hazard/terrain renderer와 normal/narrow stories로 닫혔다. `forbidden` authoring line은 제품 geometry로 남겨 `LaneOverlay`로 위장하지 않는다.

WF-16은 세 필수 제품의 pinned shell/navigation source와 독립 anatomy를 연결하고, `ProductLockup` story에서 초기 승인 key인 `console`·`portal`의 parent-brand-first SemiBold outlined output과 고정 Portal 정본의 exact parity를 검증한다. 세 필수 제품 중 Portal만 full lockup 이름과 600 위계 정본이 승인되었으며 제품 package upgrade가 남아 있다. Web Viz·Control은 canonical short name 승인과 registry 등록이 남은 migration gap이다. `SideNav`의 docked/floating, controlled collapse, active-group auto expansion 분리, reduced motion, keyboard overlay open/close/Escape/focus restore, `DashboardShell` normal/narrow reflow와 hierarchical temporary Drawer의 focus/Escape/restore/inert, TopBar overflow, landmark 계약은 interaction stories로 검증했다. 네 개 이하 flat destination은 `BottomNav`, 계층형 destination은 `temporaryNavigation`에 전달한 `SideNav`를 사용하며 route·permission·open state는 제품이 소유한다.

검증 범위는 2026-07-14 기준 다음과 같다.

- 유지·split·redesign 컴포넌트의 loading/error/empty/blocked/pending/result 등 state story를 실제 Storybook 6006에서 확인한다. product-owned composition은 Storybook에 workflow story를 추가하지 않고 이 문서와 source-pinned audit에서 경계를 검증한다.
- Communication family는 약 760px reading column과 320px narrow, dark, 긴 rich assistant document, multiline user solid primary bubble, human-agent neutral fill bubble, system 중앙 칩, completed/streaming/failed AI action recipe, 날짜/첫 미읽음 separator, viewport keyboard 이동과 disabled composer에서 role hierarchy, wrapping, DOM order, transparent-feed/outer-shell 경계와 bubble/칩 대비를 확인한다.
- `ManualControlSession`은 활성 상태에서 link loss를 발생시켜 `link-unavailable` release 요청, armed 해제, control 비활성화를 확인했다.
- `npm run check:storybook`으로 정적 build, implementation story guard, public/hidden 분류, console error를 검증한다.
- `npm run check:product-frontends`, `npm run check:wds-alignment`, `npm run check:types`, `npm run check:type-surface`, `npm run check:consumer`, `npm run check:pack`을 통과했다.
- VCS cleanliness를 보는 `check:entry`와 `check:generated`는 현재 변경을 아직 commit하지 않았으므로 HEAD 차이를 의도대로 보고한다. 생성기를 반복 실행한 결과는 동일하다.

기계 판정의 source of truth는 `docs/references/product-frontends/COVERAGE_AUDIT.json`이며, `npm run check:product-frontends`가 source pin, stage evidence, component disposition, 제거·교체 경계를 검증한다.

## LK 브랜드 자산 적용 감사

로고 규격화는 LDS 저장소 안에서 SVG를 생성하는 것으로 끝나지 않는다. 실제 제품이 같은 정본을 소비하는지 확인하기 위해 `web-viz`, `control`, `portal`의 현재 소스를 별도로 고정했다. 기계 판정 원본은 `docs/references/brand/PRODUCT_BRAND_ASSET_AUDIT.json`이며 `npm run check:brand-products`는 세 제품의 필수 pin, revision·blob SHA 형식, 문서 인용, 최소 크기와 LDS/제품 소유권 경계를 검증한다. 외부 저장소의 Git object 자체는 감사 시점에 직접 대조해 pin했으며 이 명령이 원격 저장소를 다시 조회한다고 주장하지 않는다.

| 제품 | 고정 revision | 판정 | 다음 적용 |
| --- | --- | --- | --- |
| `web-viz` | `a984def117c05acd213f494cbb8a42e990595505` | migration required · registry-name-approval pending | 로컬 gradient `logo.png`는 즉시 승인 `Lockup` mark로 교체할 수 있지만 full 제품 lockup은 지원되지 않는다. 제품이 canonical short lockup name을 제안·승인한 뒤 LDS가 outlined path와 key를 등록해야 한다. 로그인은 승인 mark 80px를 쓴다. |
| `control` | `3bdce49ec6868f016f4ec2cdbd12aabbf8a04f19` | migration required · registry-name-approval pending | `로봇 관제 시스템`을 자유 텍스트 lockup으로 합성하지 않는다. 제품이 canonical short lockup name을 제안·승인한 뒤 LDS 등록을 요청하며, 그 전 collapsed rail은 승인 mark를 쓴다. 100px 로그인은 approved official square를 사용할 수 있고 기존 55px standalone square는 64px 최소보다 작다. |
| `portal` | `546f11e4640b5a9ec81fc210a5085581b9d277bc` | composition compatible, package upgrade required | 고정 `Lockup variant="portal"`과 `ProductLockup product="portal"`은 같은 SemiBold 600 정본이다. ProductLockup constructionVersion 2·brand constructionVersion 5를 포함한 릴리스로 올리고 collapsed rail은 `compact`의 승인 mark로 전환한다. |

LDS는 LK 심볼·ROBOTICS 워드마크·승인 variant·색·최소 크기·clear space·플랫폼 export와 `ProductLockup`의 승인 key registry, parent-brand-first SemiBold outlined path, hierarchy, layout, positive/reverse appearance, 최소 크기와 접근성 계약을 소유한다. 각 제품은 canonical short lockup name의 제안·승인, identity를 한 번 소유할 TopBar/SideNav, route·click, full-to-mark breakpoint와 배포 시점을 소유한다. 승인 전 이름을 free-form prop으로 넘기거나 제품에서 path·색·효과·간격을 다시 만들 수 없다. 현재 Web Viz·Control의 두 migration gap은 name approval과 registry 등록 전까지 `current`나 `supported`로 올리지 않는다.
