# Density and expression-profile contract

| Field | Value |
| --- | --- |
| Type | Contract |
| Status | Active — R3A stable contract |
| Owner | Foundation owner |
| Last reviewed | 2026-08-22 |
| Required reviewers | Design-system owner · Core/Product component owners · Portal/Web Viz product owners |
| Machine inventory | [`DENSITY_COVERAGE_CONTRACT.json`](references/architecture/DENSITY_COVERAGE_CONTRACT.json) |
| Runtime authority | [`EXPRESSION_PROFILE_CONTRACT.json`](references/architecture/EXPRESSION_PROFILE_CONTRACT.json) |
| Visual/behavior evidence | [`EXPRESSION_PROFILE_MATRIX.json`](references/visual/EXPRESSION_PROFILE_MATRIX.json) |

`default | ops`는 별도 컴포넌트 세트가 아니라 같은 API·DOM·semantic meaning을 다른 작업 밀도로
표현하는 Theme 축이다. `ops`는 데스크톱의 반복 관찰·비교·조작 화면에 opt-in하고, attribute를
생략한 출력은 `default`와 같다.

## 축과 우선순위

1. Drawer 안의 bounded local density는 prop이 생략된 자식의 축 기본값만 선택한다.
2. 명시적 component `size`/`density`가 local density보다 우선한다.
3. expression profile은 선택된 size의 token 값을 정한다. 따라서 `ops` 안의 명시적 `md`는
   API상 계속 `md`이지만 `ops-md` geometry token을 읽는다.
4. profile과 density는 semantic status, color meaning, type-ramp meaning, DOM anatomy, focus order를
   바꾸지 않는다.

`LdsProvider`의 기본 target은 `document.documentElement`다. Theme는 nested scope의 낮은
specificity selector와 `:root:where([data-lds-profile='ops'], .lds-profile-ops)`를 함께 제공한다.
Core `:root` 기본값 뒤에 Theme profile stylesheet를 로드하면 HTML root와 nested scope가 같은
값을 낸다. `body`에 attribute를 옮기는 consumer workaround는 지원 계약이 아니다.

## 첫 stable 포함 범위

| Family | Stable 결정 | 계약 |
| --- | --- | --- |
| Table | include | `sm | md`가 profile-aware cell padding token을 선택한다. 기존 `--lk-table-*` 매체 override가 최우선이다. |
| DataGrid | include | cell/header/detail geometry가 profile-aware다. 선택 checkbox는 16px glyph를 유지하면서 실제 label/input target을 24×24px로 제공한다. |
| ListCell | include | 기존 `verticalPadding` 문법은 유지하고 `sm | md | lg` token 값만 profile-aware로 만든다. |
| Tree | include | row min-height, padding, gap, indent가 profile-aware다. treeitem keyboard/selection semantics는 동일하다. |
| DataToolbar · FilterBar | include | 각 `sm | md` chrome gap/padding이 profile-aware이며, search/query ownership은 제품에 남는다. |
| DropdownMenu | include | explicit `compact | default | comfortable`가 우선하고, default menu token은 profile-aware다. 모든 항목 target은 24px 이상이다. |
| SideNav · Toolbar | include | navigation row/child row와 toolbar chrome이 profile-aware다. 목적지·활성 상태·roving focus는 동일하다. |
| Drawer | include | 기존 bounded density provider는 유지한다. header/body/footer token만 profile-aware이며 전역 density provider로 일반화하지 않는다. |

## 명시적 연기

| Candidate | Decision | Owner | Review trigger | Next review |
| --- | --- | --- | --- | --- |
| DockPanel chrome | defer | Product layout owner | Portal 또는 Web Viz가 동일 panel을 stable package로 두 번째 채택하거나 fixed 48px chrome이 실제 ops task throughput을 막는 증거가 생김 | 2026-11-22 |
| Layer/editor panel chrome | defer | Product editor owner | 독립 consumer 또는 narrow/keyboard 회귀 증거가 생김 | 2026-11-22 |
| Global density provider | stay absent | Foundation owner | Drawer 밖에서 동일 bounded inheritance가 필요한 두 개 이상 stable consumer composition이 확인됨 | 2026-11-22 |

연기는 미분류가 아니다. 각 public component의 현재 결론과 재검토 조건은 machine inventory가
exact-one으로 관리하고, 새 public component가 분류 없이 추가되면 `check:density`가 실패한다.

## 측정 게이트

- `data-dense`와 `navigation/overlay` real-component fixture를
  `default | ops × light | dark × 1280 | 320`에서 검사한다.
- HTML-root selector, geometry delta, horizontal overflow 0, semantic label color invariance,
  reduced-motion 0ms, 24×24px target, checkbox/Tree keyboard, Drawer focus 진입·Escape 복원을 함께
  검증한다.
- default의 기존 값은 token fallback과 동일하다. 승인된 변경은 DataGrid 선택 target 확대뿐이며
  public prop과 DOM semantics는 유지된다.
- Portal/default와 Web Viz/ops는 같은 immutable package candidate를 install/build/workflow 검증해야
  stable evidence로 승격할 수 있다.

## 외부 기준과 LDS 결론

- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum/) —
  조밀한 UI도 실제 pointer target을 24×24 CSS px 이상으로 유지한다. LDS는 간격 예외를 추정하지
  않고 DataGrid 선택 target 자체를 확장했다.
- [Fluent compact sizing](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/compact-sizing) —
  compact sizing은 mouse/keyboard 중심의 정보 집약적 화면에 한정하고 기본 touch 최적화 표현을
  대체하지 않는다. LDS의 `ops`도 opt-in이다.
- [Fluent layout](https://fluent2.microsoft.design/layout) — 조밀화는 일관된 spacing ramp를 사용하고
  정보 위계와 touch target을 보존한다.
- [Carbon Data table](https://carbondesignsystem.com/components/data-table/style/)과
  [Tree view](https://carbondesignsystem.com/components/tree-view/usage/) — 반복 데이터와 tree row를
  24/32/40px 계열의 명시적 size로 관리한다. LDS는 기존 API를 rename하지 않고 profile-aware token으로
  같은 원칙을 적용한다.
