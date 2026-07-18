# LDS 패키지 및 저장소 분리 계획

| Field | Value |
| --- | --- |
| Type | Architecture and migration plan |
| Status | In progress — Wave 0 inventory와 의사결정 gate 실행 중 |
| Owner | Design system owner · Frontend platform · Robotics domain owner |
| Last reviewed | 2026-07-19 |
| Audit snapshot | `356432581964feb5af101da9688e02cff6e22aa7` (detached `main` candidate; clean-main baseline 아님) |

이 계획은 현재 단일 패키지인 `@lk-robotics/design-system-core`를 소비 경계에
맞는 패키지로 나누고, 검증 결과에 따라 Robotics UI를 별도 저장소로 추출하는
순서와 완료 조건을 정의한다. 패키지 분리는 확정 목표이고, Robotics 저장소
분리는 package boundary와 독립 운영 능력을 먼저 증명한 뒤 실행하는 조건부
목표다. 기존 `lk-design-system-3d`는 계속 독립 형제 저장소로 유지한다.

이 문서는 실행 순서를 소유한다. 계층 의존 정책은
[`OPERATING_MODEL.md`](OPERATING_MODEL.md), 컴포넌트 재분류와 제품 검토는
[`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md), 실제 소비자 pin과 workflow
증거는 [`PRODUCT_FRONTEND_COVERAGE.md`](PRODUCT_FRONTEND_COVERAGE.md)를
각각 우선한다.

## 1. 목표 상태와 핵심 결정

패키지 경계와 저장소 경계는 같은 개념이 아니다.

- **패키지**는 소비자가 설치하고 import하는 dependency·version 경계다.
- **저장소**는 owner, release cadence, CI, 이슈와 변경 승인 경계다.
- 하나의 저장소에 여러 패키지가 있는 것은 정상이며, 패키지가 나뉘었다는
  이유만으로 저장소도 바로 나누지 않는다.

권장 목표 구조는 다음과 같다.

```text
lk-design-system                         # 계속 유지
  @lk-robotics/lds-core                 # 범용 foundation·DOM UI
  @lk-robotics/lds-theme                # LK brand·theme
  @lk-robotics/lds-product              # 범용 LK product pattern
  @lk-robotics/design-system-core       # 한시적 legacy compatibility facade

lk-design-system-robotics               # Wave 4 gate 통과 시에만 신설
  @lk-robotics/lds-robotics-ui          # Robotics DOM·SVG·2D domain UI

lk-design-system-3d                     # 기존 형제 저장소 유지
  @lk-robotics/design-system-3d-*        # 좌표·scene·asset·renderer package

product repositories
  LDS package + Robotics UI + LDS3D를 필요한 조합으로 소비
```

`@lk-robotics/lds-*` 이름은 기존 aggregate 패키지
`@lk-robotics/design-system-core`와 새 실제 Core를 충돌 없이 병행하기 위한 권장안이다.
Wave 0에서 registry namespace를 최종 승인하되, 새 이름을 바꾸더라도 compatibility
facade와 단계적 migration 원칙은 유지한다.

### 확정하는 것

- 먼저 `lk-design-system` 한 저장소 안에서 Core, Theme, Product, Robotics UI를
  실제 package artifact로 분리한다.
- 기존 aggregate root와 `components/*` deep path는 migration 기간 동안 facade로
  유지하고 신규 사용을 차단한다.
- LDS3D는 LDS나 Robotics UI에 병합하지 않는다.
- Core는 Product, Robotics UI, LDS3D에 의존하지 않는다.
- 제품 route, transport, command, permission, workflow state는 어느 공용
  패키지나 저장소로도 이동하지 않는다.

### 아직 확정하지 않는 것

- 현재 `/robotics` export 32개를 그대로 새 저장소로 옮기지 않는다.
- 독립 owner와 release cadence가 증명되기 전에는 Robotics 저장소를 만들지 않는다.
- 분리를 shared token 값 변경이나 component redesign과 묶지 않는다.
- LDS와 LDS3D 사이에 별도 integration package를 지금 만들지 않는다.

## 2. 현재 기준선

현재 `npm run check:layers` 기준은 다음과 같다.

| Layer | Public source entries | Classified modules | 허용된 교차 계층 edge |
| --- | ---: | ---: | --- |
| Core | 81 | 88 | Core 내부만 |
| Theme | 2 | 2 | Theme → Core 2건 |
| Product | 90 | 92 | Product → Core 115건 |
| Robotics | 31 | 43 | Robotics → Core 31건, Product 1건 |
| Aggregate | 204 | 225 total | 네 layer export의 정확한 합집합 |

좋은 출발점은 이미 있다.

- `core`, `theme`, `product`, `robotics` subpath와 explicit owner classification이 있다.
- 역방향 의존과 layer cycle을 `check:layers`가 차단한다.
- ESM, CJS, declaration, React 18/19 consumer와 package artifact smoke가 있다.
- 여섯 제품 저장소가 commit으로 고정되어 있어 migration inventory를 만들 수 있다.

그러나 물리적 분리의 blocker도 남아 있다.

- `package.json`과 release/version은 하나다.
- `styles.css`가 foundation, LK theme, product와 viewer token을 모두 import한다.
- Core-owned `Spinner variant="brand"`가 LK wordmark geometry helper를 직접 소비한다.
  이는 현재 호환 surface를 유지하기 위한 경계 debt이며, Wave 1 전에 brand variant를
  Theme adapter로 분리할지 명시적 Core 예외로 유지할지 owner 승인이 필요하다.
- aggregate root와 compiled `components/*`가 모든 계층을 한 package에서 노출한다.
- package smoke와 publish policy가 단일 package의 정확한 합집합을 전제로 한다.
- CI 설치 정책은 npm으로 고정했고 local `main@626756b`에서 legacy pnpm lockfile을
  제거했다. `origin/main` 동기화와 baseline tag는 아직 수행하지 않았다.
- 현재 consumer smoke는 실제 product stack 전체와 Windows/Linux matrix를 대체하지 않는다.
- Git tag와 독립 package release 기준점이 아직 없다.
- LDS3D `apps/docs`의 로컬 통합은 현재 sibling `link:`에 의존하므로 portable
  package compatibility 증거가 아니다.

LDS3D의 Accepted ADR과 committed architecture는 분리 근거로 사용할 수 있지만,
현재 local working tree는 안정 release 근거로 사용하지 않는다. 확인 시점의 LDS3D는
`main` HEAD `a7b4780f68ba4dbe169ef37500246a5eec166c9a` 위에 audit snapshot 당시
frozen report에 tracked 86개와 untracked file 78개 변경이 있고, committed package
6개와 working-tree
package 8개가 다르다. 이 숫자는 계속 변할 수 있는 local observation이다. `tf`,
`markers`와 CI가 commit되고 package release group·artifact 검증이 정합해지기 전에는
working tree 그래프를 지원 계약으로 인용하지 않는다.

## 3. 책임과 의존 경계

### 소유권 매트릭스

| Surface | Target owner | 포함 | 제외 |
| --- | --- | --- | --- |
| Core | `lds-core` | generic token contract, layout, form, action, feedback, accessibility behavior | LK brand, robot/map semantics, product workflow |
| Theme | `lds-theme` | LK color, typography, font, brand asset, theme mapping | generic component anatomy, product state |
| Product | `lds-product` | 여러 LK 제품에서 반복되는 generic application pattern | robot-specific semantics, route와 backend policy |
| Robotics UI | `lds-robotics-ui` | robot status/control, telemetry presentation, DOM/SVG 2D robotics visualization | WebGL lifecycle, coordinate math, ROS transport, complete screen |
| LDS3D | 기존 `design-system-3d-*` | coordinate, frame, pose, camera, picking, GLB, WebGL, renderer lifecycle | DOM chrome, LDS component CSS, product command |
| Product | 각 제품 저장소 | route, store, transport, permission, command, persistence, final composition | reusable DS contract의 복사본 |

### 허용 의존 방향

```text
Theme ---------> Core
Product -------> Core
Robotics UI ---> Core
Robotics UI ---> Product       # 실제 composition이 필요한 경우만

Product app ---> Core / Theme / Product / Robotics UI / LDS3D
LDS3D docs ----> versioned LDS packages + LDS3D packages

Core ----------X Product / Robotics UI / LDS3D
LDS3D package -X LDS / Robotics UI
LDS package ---X LDS3D
```

현재 Robotics → Product 1건은 `CanvasEditorShell`이 Product-owned `DockPanel`을
조합하는 edge다. 패키지 분리 뒤에도 이 조합을 유지하면 `lds-robotics-ui`가
`lds-product`에 명시적으로 의존한다. 해당 editor chrome을 Product로 재분류하면
edge를 제거할 수 있지만, 재분류는 API 사용 범위와 제품 근거를 검토한 별도
결정이어야 한다.

LDS3D의 확정 경계상 `Scene3DFrame`, `ViewerToolbar`, `ViewportStatusBar`,
`CanvasEditorShell`, panel과 inspector는 renderer가 아니라 LDS-owned DOM chrome이다.
따라서 이들은 이름에 3D나 editor가 있어도 LDS3D로 이동하지 않는다. 현재
`PUBLIC_EXPORT_CLASSIFICATION.json`과 각 prompt는 이들을 포함한 Robotics 31개 public
source module을 모두 `LK Robotics Extension`으로 분류하므로, Wave 0의 안전한 target은
전부 `lds-robotics-ui`다. editor/viewer 13개를 Product로 옮기는 안은 pinned 제품에서
robotics 밖 재사용 근거와 owner 승인이 생기기 전까지 후보로만 남긴다. 저장소는 Wave 3
go/no-go 전까지 기존 LDS 안에 유지한다.

### `/robotics` 추출 전 필수 재분류

현재 Robotics entry는 다음 네 책임을 한데 포함한다.

| 현재 묶음 | 예시 | Wave 0 질문 |
| --- | --- | --- |
| Editor chrome | `CanvasEditorShell`, `LayerPanel`, `SelectionInspector` | robotics 밖에서도 재사용되는 Product pattern인가 |
| Viewer chrome | `ViewerFrame`, `Scene3DFrame`, `ViewerToolbar` | renderer-neutral UI shell인가, robotics 전용 vocabulary인가 |
| Robot operation UI | `RobotStatusCard`, `ManualControlSession`, `Joystick` | Robotics UI 소유가 명확한가 |
| 2D spatial UI | `WaypointMarker`, `RouteOverlay`, `LaneOverlay`, `SpatialRegion` | SVG/DOM 표현과 LDS3D spatial contract의 seam이 명확한가 |

현재 public source module 31개와 Robotics internal module 12개는 모두
`move-to-robotics-ui`로 판정했다. 이는 package owner 판정이며, 저장소 추출은 아직
`keep-in-lds-repository`다. `owned-by-lds3d`는 현재 React 컴포넌트를 그대로 이동한다는
뜻이 아니라, 실제 좌표·scene·renderer 책임이 LDS3D에 있다는 뜻이다. 현재 225개 LDS
module과 380개 asset 중 LDS3D로 이동할 항목은 없다. DOM/SVG와 WebGL 구현을 이름만
보고 합치지 않는다.
예를 들어 2D `WaypointMarker`와 3D waypoint primitive는 렌더링 매체별 구현을 유지하며,
양 package가 서로의 runtime type이나 renderer handle을 import하지 않는다. 제품
adapter가 serializable view model을 각 표면에 매핑한다.

## 4. Package와 CSS 계약

### 새 package 표면

각 package는 다음을 독립적으로 가져야 한다.

- `package.json`, version, changelog와 deprecation register
- ESM과 declaration entry; CJS 유지 여부는 Wave 0 consumer inventory로 결정
- React와 React DOM peer range
- package 단위 `exports`, `files`, side effects와 tarball smoke
- owner별 Storybook evidence와 API report
- 다른 package의 source path가 아닌 public package import

기존 `@lk-robotics/design-system-core`는 한시적 compatibility facade로 남긴다.

- 기존 root, `/core`, `/theme`, `/product`, `/robotics`, `components/*`를 보존한다.
- 구현은 새 package의 public export를 재수출한다.
- 신규 코드에서 facade import를 금지하고 migration warning을 문서화한다.
- facade 제거 시점은 Wave 5 gate로만 결정한다.

### CSS와 asset 분리

분리 자체가 시각 변경이 되지 않도록 첫 migration에서는 token 값과 selector를
바꾸지 않고 소유 파일과 import graph만 나눈다.

| Entry | 초기 책임 |
| --- | --- |
| `lds-core/styles.css` | spacing, grid, 일반 component token, 일반 focus selector와 `base.css`의 generic reset/layout slice |
| `lds-theme/styles.css` | font, typography, LK atomic/semantic/component color, LK effects 값과 `base.css`의 theme/brand slice |
| `lds-product/styles.css` | 현재 전용 slice 없음; Wave 1에서 실제 Product selector가 생길 때만 추가 |
| `lds-robotics-ui/styles.css` | `--component-viewer-*` 12개와 map geometry focus 예외; 이후 실제 Robotics selector |
| legacy `styles.css` | 위 entry를 기존 cascade 순서로 import하는 facade |

Asset은 generic icon은 Core, logo와 brand image는 Theme, robotics SVG vocabulary는
Robotics UI, GLB와 3D manifest는 LDS3D가 소유한다. 같은 migration에서 token
rename, brand color 조정, selector redesign이나 asset geometry 변경을 하지 않는다.

`tokens/source.json`은 현재 package 하나에 통째로 귀속할 수 없는 단일 build
authority다. JSON subtree를 package projection으로 분류하되, 기존 전체 파일은
compatibility facade에서 유지한다. `components.css`와 `focus.css`는 혼합 소유 파일이므로
Wave 1에서 slice를 물리적으로 나눠야 한다. `base.css`도 generic reset/layout과
theme/brand selector가 섞여 있어 split 대상이며, `html` rule은
`-webkit-text-size-adjust`는 Core, `color-scheme`은 Theme인 declaration 단위 split이다.
`effects.css`는 generic token 이름을 Core가 계약으로 소비하지만 현재 선언값 자체는
LK Theme가 제공하는 value layer로 기록한다.

## 5. 단계별 실행 계획

### Wave 0 — 의사결정과 baseline 고정

목적은 이동 전에 책임, 소비자와 회귀 기준을 확정하는 것이다.

작업:

- [x] package namespace와 최종 package 이름을 승인한다.
- [x] Core, Theme, Product, Robotics UI와 LDS3D의 accountable owner를
      `Jinhyuk Jang`으로 지정한다.
- [x] 현재 204개 public source module, 210개 public symbol과 총 225개 module의 target
      package를 기록한다.
- [x] Robotics 31개 public source module을 앞 절의 네 묶음으로 재검토하고, 현재
      target을 `lds-robotics-ui`로 고정한다.
- [x] `Spinner variant="brand"`의 LK wordmark helper를 Theme adapter로 분리하기로
      승인한다. 실제 API 이동은 Wave 1 compatibility 작업에서 수행한다.
- [x] 여섯 product repository와 LDS3D docs의 root/subpath/deep/CSS import를 commit
      pin과 함께 inventory한다.
- [ ] ESM/CJS, React 18/19, SSR, tree-shaking, tarball size와 Storybook visual baseline을
      고정한다.
- [x] package별 fixed release-set, GitHub Packages registry, 2 stable release/최소 90일
      compatibility window와 owner 승인 규칙을 정한다.
- [x] canonical package manager·lockfile·frozen CI 정책을 npm, `package-lock.json`,
      `npm ci`로 정하고 CI에 적용한다.
- [x] legacy secondary `pnpm-lock.yaml`을 local main에서 제거한다.
- [ ] clean `main` baseline tag, 현재 aggregate
      `@lk-robotics/design-system-core` tarball checksum과 last-known-good release set을 만든다.
- [x] 실행 증거 원장 `references/package-split/MIGRATION_AUDIT.json`의 schema와
      verifier 책임을 정한다.

2026-07-19 실행 현황:

- `docs/references/package-split/MIGRATION_AUDIT.json`과 schema를 추가했다.
- `scripts/check-package-migration.mjs`가 repository-owned module target digest, mixed
  CSS slice, token projection과 380개 asset rule을 직접 검증하고, 여섯 제품 pin과
  LDS3D docs legacy import는 repository-tracked snapshot의 schema·합계·migration target을
  검증한다. 여섯 product의 pinned scan과 LDS3D의 hash-fixed volatile observation을
  Wave 0 evidence로 고정했으며, stable versioned artifact portability 검증은 Wave 2에서
  수행한다.
- CI의 canonical install을 npm + `package-lock.json` + `npm ci`로 일치시켰다.
- `Jinhyuk Jang`을 Design System, Frontend Platform, Robotics와 LDS3D maintainer
  approver로 지정했다. namespace/package names, fixed release-set, compatibility window,
  CJS facade, conditional Robotics repository와 Theme-owned brand Spinner adapter를 승인했다.
- 여섯 product pin을 모두 clean checkout에서 동일 scanner로 확인했다. 여섯 제품 모두
  LDS/LDS3D dependency·root/subpath/deep/CSS/asset/CJS 사용이 0건이며, migration 완료가
  아니라 아직 `not-adopted` 상태다.
- LDS3D docs의 hash-fixed volatile observation은 mutable sibling `link:`, aggregate root
  12개 파일·86개 binding, deep import 11종, CSS 1건, asset filesystem path 1건을
  기록했다. 이 `link:`는 `LK Design System`이라는 로컬 Windows junction을 거쳐
  local `lk-design-system main@626756b`를 가리키는 것을 재확인했다. 이는 현재 상태
  증거이지 portable package 증거가 아니다.
- 일곱 consumer evidence report는 이 변경에서 Git 추적 상태로 고정해 consumer evidence
  blocker를 닫았다. RobotMarker 변경을 제외한 layer infrastructure와 Wave 0 candidate는
  승인에 따라 local `main@626756b`까지 fast-forward했다. origin 동기화와 clean main/tag,
  full regression evidence와 canonical immutable tarball/LKG capture가 남아 있어 Wave 0
  완료 gate는 계속 `blocked`다. accountable person과 package/CJS/support·brand boundary
  결정은 이후 사용자 승인으로 닫혔다.
- local `main@626756b`의 `npm run check:fast`와 `npm run check:pack`은 build, type,
  layer, migration, consumer 계약과 실제 tarball 설치, ESM/CJS/deep/type,
  SSR, tree-shaking과 bundle-size 검증을 통과했다. 다만 실행 환경이 canonical
  Node 22/npm 10.9.2가 아닌 Node 24.18.0/npm 11.16.0이므로 이 tarball은 진단값일 뿐
  Wave 0 baseline으로 승인하지 않는다.
- `npm run check`는 기존 Storybook IA human-review 미완료에서 멈췄다.
  `npm run check:storybook-ci`는 579개 story 접근성 검사를 0 violation으로 통과했지만
  Waypoint/state glyph 8개 capture가 visual baseline과 달랐다. 같은 8개 diff가 변경 전
  `main@0aa7f8d`에서도 동일 비율로 재현되고 후보에는 해당 source/baseline diff가 없으므로,
  package 분리 회귀가 아니라 기존 main 품질 부채로 기록한다. 이후 사용자가 해당 범위를
  승인했으며, IA review 승격과 visual baseline 갱신은 실제 human/visual review 결과에만
  근거해 수행한다.

Wave 0의 artifact baseline은 아직 존재하는 현재 aggregate package 한 개만 대상으로
한다. 미래의 Core, Theme, Product, Robotics UI, compatibility package 다섯 개를 이 gate에
요구하면 Wave 1을 시작하기 전에 Wave 1 산출물이 필요해지는 순환 조건이 생긴다. 다섯
package의 개별 tarball/API/type 검증은 Wave 1 완료 gate에서 추가한다.

`cleanMain.commit`은 full check와 aggregate artifact를 만든 tagged source baseline이다.
그 SHA를 원장에 기록한 commit은 필연적으로 다른 SHA가 되므로 ready 검사에서 둘을 같은
commit으로 요구하지 않는다. 대신 attestation HEAD가 clean `main === origin/main`인지,
baseline tag가 ancestor인지, baseline 이후 변경이 원장과 tracked evidence report뿐인지
검증한다.

완료 gate:

- 모든 export와 module이 정확히 한 target package를 갖는다.
- CSS token, selector와 asset도 owner가 정해져 있다.
- 소비자별 현재 import와 migration target이 누락 없이 기록돼 있다.
- 현재 `check`, package smoke와 visual baseline이 green이며 실패 예외가 문서화돼 있다.
- clean `main`, frozen install과 baseline artifact checksum이 재현된다.
- shared token 값 변경이나 component redesign이 이 migration scope에 섞이지 않았다.

### Wave 1 — 한 저장소 안에서 package 분리

목적은 저장소를 나누지 않고 실제 artifact와 dependency boundary를 증명하는 것이다.

작업:

- [ ] `packages/core`, `packages/theme`, `packages/product`, `packages/robotics-ui`,
      `packages/compat` workspace를 만든다.
- [ ] source와 declaration 생성기를 package owner 기준으로 바꾼다.
- [ ] 현재 layer graph를 package dependency와 boundary check로 승격한다.
- [ ] package별 CSS, asset와 side-effect entry를 만든다.
- [ ] compatibility facade가 기존 export와 CSS cascade를 보존하게 한다.
- [ ] package별 changelog, changeset, API report와 tarball test를 추가한다.
- [ ] `check-publish-policy`, `check-package-artifact`, `check-consumer-smoke`,
      `check-type-surface`, `check-layer-boundaries`를 workspace package 기준으로 바꾼다.
- [ ] Storybook은 한 app에서 모든 package를 versioned public export로 소비한다.

완료 gate:

- package별 ESM/type entry와 선택된 CJS entry가 실제 tarball install에서 동작한다.
- Core tarball에는 Product, Robotics UI와 LDS3D 코드·asset·CSS가 없다.
- Core → extension과 package cycle이 자동으로 차단된다.
- legacy import와 새 package import가 같은 API reference, 동작과 렌더 결과를 낸다.
- legacy `styles.css`와 새 CSS 조합의 computed style·light/dark·normal/narrow
  visual regression이 승인된 차이 없이 일치한다.
- React 18과 19 strict consumer typecheck, SSR와 Vite/Next bundler smoke가 package별로
  통과하며 package/consumer matrix는 Windows와 Linux에서 검증된다.

### Wave 2 — versioned artifact와 소비자 migration

목적은 sibling source나 같은 worktree 없이 package 경계가 실제 소비자에서
유효함을 증명하는 것이다.

권장 migration 순서는 낮은 도메인 결합부터 Theme/Core 소비자, Product pattern
소비자, Robotics UI 소비자 순이다. 제품별 변경은 각 제품 owner가 승인하며 이
저장소가 제품 코드를 직접 변경하지 않는다.

작업:

- [ ] immutable tarball 또는 승인된 registry version으로 canary release한다.
- [ ] 같은 source commit에서 package별 immutable RC를 dependency 순서로 만들고
      release-set ID와 artifact checksum을 기록한다.
- [ ] DeviceOps, VisionOps, Context Hub, MLOps에서 Core/Theme/Product를 먼저 검증한다.
- [ ] Web Viz와 Control에서 Robotics UI를 검증한다.
- [ ] LDS3D `apps/docs`의 sibling `link:`를 versioned LDS artifact로 교체해 별도
      checkout에서도 build·interaction·visual test를 수행한다.
- [ ] legacy root와 `components/*` import를 새 package public export로 이전한다.
- [ ] package minimum/current version matrix와 product pin을 machine-readable하게
      기록한다.
- [ ] UI candidate × stable LDS3D, stable UI × LDS3D candidate, minimum UI × LDS3D
      candidate, 양쪽 candidate 조합을 artifact CI로 검증한다.
- [ ] React/React DOM과 Three/R3F의 중복 runtime이 없는지 install tree와 bundle로
      확인한다.

완료 gate:

- 여섯 제품의 pinned revision에서 install, production build와 관련 workflow
  smoke 결과가 남아 있다.
- 신규 package는 상대 경로나 sibling `src/`, `components/`, `.storybook`을 참조하지 않는다.
- LDS3D renderer package는 LDS를 import하지 않고, docs integration만 두 시스템을
  versioned artifact로 함께 소비한다.
- 제품 source에서 legacy aggregate/deep import가 0이거나 승인된 예외와 제거
  release가 기록돼 있다.
- 서로 같은 날 배포해야만 작동하는 cross-package 변경이 없다.
- 실제 `Scene3DFrame` 안에서 LDS3D WebGL을 실행해 lifecycle, camera, picking,
  context recovery와 DOM focus/recovery mapping을 검증한다.

### Wave 3 — Robotics 저장소 분리 go/no-go

Package 분리가 성공해도 아래 조건을 모두 만족하지 않으면 Robotics UI는
`lk-design-system` monorepo에 유지한다. 유지 결정은 실패가 아니라 정상적인
최종 구조다.

Go 조건:

- [ ] Robotics UI에 독립 release와 breaking change를 승인할 accountable owner가 있다.
- [ ] Core/Product source 없이 package artifact만으로 build, Storybook, test가 된다.
- [ ] 별도 API, type, accessibility, visual, tarball와 consumer CI를 독립 운영할 수 있다.
- [ ] 최소 두 번의 release cycle에서 Core와 같은 commit으로만 고칠 수 있는
      atomic change가 없었다.
- [ ] Core breaking change가 deprecation과 minimum/current matrix로 선행 호환된다.
- [ ] Web Viz와 Control이 같은 Robotics UI release를 소비할 수 있다.
- [ ] 이슈, CODEOWNERS, release duty와 보안 대응 owner가 실제로 배정돼 있다.

No-go 신호:

- Core와 Robotics UI의 selector/token/source를 동시에 수정해야만 배포할 수 있다.
- Robotics Storybook이 LDS 내부 story나 decorator를 복사해야 한다.
- independent release보다 cross-repo coordination 비용이 반복해서 더 크다.
- 한 제품만 실질 소비하고 다른 제품은 fork나 local patch를 요구한다.

### Wave 4 — Robotics UI 저장소 추출

Wave 3가 Go일 때만 `lk-design-system-robotics`를 만든다.

작업:

- [ ] `packages/robotics-ui`의 관련 history를 보존해 새 저장소 `main`으로 추출한다.
- [ ] package, docs, Storybook, changeset, CI, CODEOWNERS와 release workflow를 함께 옮긴다.
- [ ] `lds-core`와 필요한 `lds-product`를 versioned dependency로 선언한다.
- [ ] LDS, LDS3D 또는 제품 source를 상대 경로로 참조하지 못하게 boundary gate를 둔다.
- [ ] Robotics Storybook은 실제 package를 소비하고 LDS visual grammar를 side-by-side
      검증한다.
- [ ] 첫 Robotics artifact를 배포하고 Web Viz, Control, LDS3D docs consumer smoke를
      통과시킨 뒤에만 원 저장소 source 제거를 수행한다.
- [ ] 원 저장소 문서와 compatibility facade가 새 repository/version을 가리키게 한다.

완료 gate:

- 새 저장소의 clean checkout에서 install부터 full release gate까지 재현된다.
- Core/Product 저장소는 Robotics UI에 runtime 또는 test dependency를 갖지 않는다.
- 새 Robotics package는 LDS3D package를 runtime dependency로 갖지 않는다.
- 제품 또는 integration app만 Robotics UI와 LDS3D를 함께 import한다.
- 원 저장소 제거 commit 전후 API, CSS와 visual parity가 승인된 차이 없이 일치한다.
- 이전 package release pin과 source-removal revert commit으로 rollback할 수 있다.

### Wave 5 — compatibility facade 종료

작업:

- [ ] legacy root와 `components/*`에 deprecation notice와 migration guide를 배포한다.
- [ ] 모든 pinned product, LDS3D docs와 example에서 legacy import 0을 확인한다.
- [ ] 최소 두 migration release 동안 facade를 유지한다.
- [ ] 기본 support window는 stable release 2회와 90일 중 더 긴 기간으로 두며,
      Wave 0에서 승인된 더 긴 정책이 있으면 그 정책을 따른다.
- [ ] removal을 major/breaking release note와 함께 별도 변경으로 수행한다.

완료 gate:

- compatibility facade가 없어도 모든 supported consumer matrix가 green이다.
- aggregate package 제거가 product rollback을 막지 않는다.
- README, changelog, deprecation register, package metadata와 docs index가 최종 구조와 일치한다.

## 6. 검증 매트릭스

| Gate | Wave 0 | Wave 1 | Wave 2 | Wave 4 |
| --- | :---: | :---: | :---: | :---: |
| export/module ownership completeness | 필수 | 필수 | 필수 | 필수 |
| forbidden dependency와 cycle | 현재 layer | package graph | packaged consumer | cross-repo graph |
| API/type report | baseline | package별 | min/current | repo별 |
| React 18/19 + SSR | baseline | package별 | consumer별 | repo별 |
| package pack/install | 단일 | 모든 package | registry/tarball | 새 저장소 clean checkout |
| CSS computed style | baseline | legacy↔new | 실제 제품 | source removal 전후 |
| Storybook visual/a11y | baseline | 통합 Storybook | consumer seam | LDS↔Robotics side-by-side |
| LDS3D boundary | 현황 기록 | import prohibition | versioned integration | cross-repo matrix |
| product workflow | pin만 | 해당 없음 | 여섯 제품 smoke | Web Viz·Control smoke |

새 검사는 기존 위반 전체를 갑자기 공개하는 repository-wide gate로 만들지 않는다.
현재 위반이 발견되면 baseline을 고정하고 신규 regression부터 차단할지, 분리 scope에서
모두 고칠지 영향 범위를 제시해 별도 승인받는다.

다음 중 하나라도 발생하면 해당 RC의 stable 전환과 다음 Wave 진행을 중단한다.

- public export나 declaration 누락, package owner 중복 또는 금지 dependency
- CSS custom property·selector·asset 누락이나 승인되지 않은 visual regression
- baseline에서 승인한 예산을 넘는 tarball·consumer bundle 증가
- 대표 product의 install, production build, runtime workflow 또는 rollback 실패
- React/React DOM, Three/R3F 중복 runtime
- stable/candidate cross-repository matrix 실패 또는 동시 배포 강제
- LDS3D working-tree 상태처럼 commit되지 않은 source나 local `link:`에만 의존하는 증거

## 7. Version과 release 규칙

- Core, Theme, Product, Robotics UI와 LDS3D는 lockstep versioning하지 않는다.
- Theme와 Product는 지원 Core range를, Robotics UI는 지원 Core/Product range를
  package metadata와 compatibility matrix에 선언한다.
- Core breaking change는 additive API와 deprecation release가 먼저 나와야 하며,
  Robotics UI의 minimum/current CI가 green이 되기 전 제거하지 않는다.
- RC와 stable artifact는 Core → Theme/Product → Robotics UI → compatibility facade
  순서로 배포하고 facade는 호환 release set을 exact version으로 pin한다.
- 모든 package artifact는 source commit, release-set ID와 checksum을 남긴다. 이미
  배포한 version을 덮어쓰거나 unpublish해 rollback을 구현하지 않는다.
- stable release에는 package version, changelog, deprecation ledger와 Git tag가
  같은 release set을 가리켜야 한다.
- legacy deprecation은 prose만 남기지 않고 package, `introducedIn`,
  `removeNotBefore`, `replacement`와 consumer adoption 상태를 원장에 기록한다.
- cross-repository 동시 배포만 가능한 변경은 허용하지 않는다.
- package build 성공은 product adoption 증거가 아니다. 제품 pin과 workflow smoke를
  별도로 남긴다.
- 임시 feature branch를 만들면 완료 전에 `main`에 통합하고 로컬·원격 branch와
  관련 PR을 정리하는 현재 repository policy를 따른다.

## 8. Rollback 계획

| 시점 | Rollback |
| --- | --- |
| Wave 1 package 분리 | compatibility facade와 기존 `styles.css`로 소비 경로를 되돌리고 새 package publish를 중지한다. token 값과 API를 함께 바꾸지 않았으므로 source 이동만 revert한다. |
| Wave 2 제품 migration | 제품별로 직전 검증 package version을 pin한다. 다른 제품의 migration과 독립적으로 되돌릴 수 있어야 한다. |
| Wave 4 저장소 추출 | 원 저장소 source 제거 전에는 새 artifact를 폐기한다. 제거 후에는 직전 artifact pin과 명시적인 source-removal revert commit을 사용한다. history rewrite나 force push를 rollback으로 사용하지 않는다. |
| LDS3D integration | versioned LDS package pin을 직전 supported 조합으로 되돌린다. LDS3D renderer package 코드는 LDS 변경과 함께 rollback하지 않는다. |

Rollback 가능성은 실패를 숨기는 수단이 아니다. 좌표, renderer, safety command,
product workflow 문제가 발견되면 공용 package에 조건문을 넣기보다 해당 package
release나 제품 adapter를 되돌리고 원인을 owner 경계에서 수정한다.

## 9. 실행 산출물

Wave별 최소 산출물은 다음과 같다.

- Wave 0: export/module/CSS/asset ownership inventory, consumer import inventory,
  package naming 결정, baseline report, package-manager/lockfile 결정
- Wave 1: workspace package, compatibility facade, package boundary checker,
  package별 API/type/pack report, CSS parity evidence
- Wave 2: migration guide, compatibility matrix, 여섯 제품과 LDS3D docs의 pinned
  consumer report, release-set checksum과 rollback version
- Wave 3: go/no-go decision record와 owner sign-off
- Wave 4: history-preserving repository extraction record, 새 repository CI와 첫
  release, cross-repo consumer report
- Wave 5: legacy import zero report, final deprecation/removal release note

실행 원장은 `docs/references/package-split/MIGRATION_AUDIT.json`에 두는 것을
기본안으로 하며, package/version/artifact checksum, source commit, consumer별
현재·목표 import, 검증 commit, last-known-good release set과 rollback version을
기록한다. `scripts/check-package-migration.mjs`는 이 원장과 실제 package metadata를
검증한다. 기존 product coverage JSON은 workflow와 product-owned seam의 근거로
유지하고 package adoption 원장으로 재사용하지 않는다.

Wave 0 완료를 주장하는 full-check, consumer-matrix, aggregate-artifact report는 repository에
추적되는 JSON이어야 하고 원장에 SHA-256을 기록한다. verifier는 파일 존재뿐 아니라
source commit, command/result, 고정된 React 18/19·SSR·tree-shaking·Windows/Linux·visual·size
matrix 전 항목을 대조한다. 실제 aggregate artifact는 경로·크기·checksum뿐 아니라 gzip
tar 형식, 내부 package name/version, 현재 publish manifest와 export/file contents도 확인한다.

artifact 재현 계약은 tracked JSON attestation과 ignored tarball 재생성을 분리한다.
`scripts/check-package-artifact.mjs`의 capture/verify 모드는 정확히 고정한 Windows x64,
Node 22.17.1, npm 10.9.2에서만 동작한다. capture는
`references/package-split/baselines/WAVE0_AGGREGATE_ARTIFACT.json`에 source tag/commit,
release-set ID, lockfile·verifier checksum, tarball byte size/SHA-256과 smoke 결과를 남기고,
verify는 fresh checkout에서 tarball을 `visual-artifacts/`에 다시 만든 뒤 byte-for-byte로
대조한다. capture와 canonical verify package lifecycle은 기록된 `npm ci`를 실제로 먼저
실행하며, baseline mode를 Node script에 직접 전달하는 호출은 authoritative run으로
인정하지 않는다. Git에는 8MB tarball을 넣지 않는다.

tracked attestation은 Draft 2020-12 schema로 실제 검증한다. schema는 필수 시각·모듈 smoke
필드와 unknown field 차단, 안전한 단일 tarball 경로, migration 원장의 captured/not-captured
조건을 포함한다. 구현은 공식 [Ajv JSON Schema 2020-12 지원](https://ajv.js.org/json-schema.html)과
[ajv-formats 날짜 형식 검증](https://ajv.js.org/guide/formats.html)을 정확한 devDependency로
고정한다.

`check:pack:baseline`이 성공하면 ignored artifact root에 현재 HEAD, 원장 bytes, tracked
attestation bytes, verifier와 실제 tarball checksum에 묶인 임시 proof를 쓴다.
`check:package-migration:wave0`는 반드시 이 verifier를 먼저 실행하며, readiness checker는
proof와 실제 ignored tarball을 다시 읽는다. 따라서 metadata-only 직접 명령은 Wave 0
승인을 통과할 수 없다. npm의 frozen install·pack 동작은 공식
[npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci/)와
[npm pack](https://docs.npmjs.com/cli/v10/commands/npm-pack/) 계약을 따른다. Node 22.17.1은
공식 [Node.js archive](https://nodejs.org/en/download/archive/v22.23.1)에 기록된 npm 10.9.2
동봉 release 중 최신 patch로 선택했다. 실제 baseline JSON과 checksum은 clean-main tag가
생긴 뒤 해당 source commit에서 capture한다.

각 Wave를 완료로 표시하려면 작업 목록이 아니라 해당 완료 gate의 실제 artifact,
command output, consumer pin 또는 rendered evidence를 확인해야 한다. 다음 Wave가
시작됐다는 사실은 이전 Wave의 완료 증거가 아니다.

## 10. 바로 다음 작업

Wave 0 원장과 integrity checker는 구현됐다. 다음 순서는 다음과 같다.

1. RobotMarker 시각 변경이 없는 세 candidate를 local `main@626756b`까지 통합했고,
   LDS3D current-state scan도 해당 main 기준으로 다시 고정했다. 이 증거 변경을 검증·커밋한다.
2. `Jinhyuk Jang`을 package별 accountable person과 필수 승인 역할로 지정했고,
   namespace/name, fixed release-set·versioning, support window, CJS, Spinner brand
   boundary와 conditional repository policy를 승인했다. editor/viewer Product 후보는
   별도 owner review로 유지한다.
3. local main에서 `pnpm-lock.yaml` 제거를 확인했으므로 canonical npm frozen install을
   재현하고, 별도 승인 후 origin/main 동기화 정책을 확정한다.
4. 기존 main의 IA human-review와 Waypoint/state-glyph visual drift를 승인 범위에서 실제
   검토한다. clean checkout에서 artifact를 재생성하는 baseline 도구와 schema는 구현됐고,
   source baseline tag 이후 evidence를 capture한다.
5. clean-main tag, full check, package tarball/checksum, React 18/19 runtime, SSR,
   tree-shaking, Windows/Linux와 visual/size baseline을 만든다.
6. 위 blocker가 모두 닫힌 뒤에만 Wave 1 workspace scaffold를 시작한다.

이 여섯 항목이 닫히기 전에는 source 대량 이동, package rename, 새 repository 생성이나
legacy export 제거를 시작하지 않는다.
