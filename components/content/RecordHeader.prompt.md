**RecordHeader** — 사람·로봇·주문처럼 “대상 자체”가 제목인 화면에서 시각 식별자, 이름, 배지, 설명, 세부 정보와 대상 액션을 묶는 제품 확장 컴포넌트입니다.

```jsx
<RecordHeader
  visual={<Avatar name="장진혁" size="xlarge" />}
  title="장진혁"
  badge={<StatusBadge tone="positive">인증됨</StatusBadge>}
  description="Physical AI Engineer · 신입 · 개발"
  details={<StatList items={profileStats} />}
  actions={<Button variant="outlined">설정</Button>}
/>
```

## 분류와 책임

- **Product Extension**입니다. WDS Core의 직접 대응 컴포넌트가 아니라 반복되는 제품 레코드 정체성 구조를 LDS 조합 규칙으로 닫습니다.
- `PageHeader`는 breadcrumb·eyebrow·페이지 제목·페이지 상태·메타·주요 액션으로 **현재 화면의 맥락과 업무**를 설명합니다. `RecordHeader`는 visual·대상 이름·인증/상태 배지·세부 정보·대상 액션으로 **현재 보고 있는 대상**을 식별합니다.
- `StatList`는 라벨-값 목록만 소유합니다. 레코드 제목, 시각 식별자, 설명, 액션을 소유하지 않으며 필요할 때 `details`에 조합합니다.
- 한 화면에 두 헤더가 모두 필요하면 `PageHeader`가 먼저 페이지 맥락을 설명하고, 본문 레코드 영역의 `RecordHeader`는 주변 문서 구조에 맞춘 `headingLevel`을 사용합니다. 같은 이름과 액션을 두 헤더에 반복하지 않습니다.

## 공개 계약

- **title**은 필수입니다. **visual**, **badge**, **description**, **details**, **actions**는 선택 슬롯입니다.
- 읽기·DOM 순서는 `visual → title/badge → description → details → actions`입니다. CSS reflow가 순서를 바꾸지 않습니다.
- **visual**은 `Avatar`·`Thumbnail` 같은 대상 식별자입니다. 장식 이미지면 대체 텍스트를 비우고, 식별에 필요한 이미지면 슬롯 컴포넌트가 대상 이름을 제공합니다.
- **badge**는 제목에 붙는 인증 또는 현재 상태입니다. 색이나 아이콘만 두지 말고 visible text, `aria-label`, 또는 동등한 비색상 이름을 제공합니다.
- **details**는 `StatList`나 짧은 속성 묶음처럼 한 번에 훑을 정보만 둡니다. 설명형 표, 편집 폼, 탭, 활동 내역은 본문으로 내립니다.
- **actions**는 대상에 직접 적용되는 설정·공유·팔로우 같은 짧은 액션만 둡니다. route, 권한, mutation, 확인 절차와 완료/실패 상태는 제품이 소유합니다.
- 기본 `headingLevel={1}`입니다. 상위 `PageHeader`나 문서 제목이 이미 있으면 실제 heading 계층에 맞춰 2–6을 명시합니다.
- 좁은 폭에서는 visual과 내용이 먼저 읽히고 actions가 다음 flex line으로 내려갑니다. 긴 이름과 설명은 320 CSS px에서도 가로 스크롤을 만들지 않습니다.
- cover image, 탭, breadcrumb, 전역 navigation, fetch/loading 상태 머신은 이 컴포넌트에 넣지 않습니다.

## 비교와 외부 근거

- [Primer PageHeader](https://primer.style/product/components/page-header/guidelines/)는 페이지 제목·설명·상태·탐색·액션을 중심으로 하고 leading visual은 작은 보조 요소로 제한합니다. LDS는 통계와 대상 액션까지 갖는 풍부한 정체성 구조를 별도 계약으로 둡니다.
- [Shopify Page](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page)와 [Atlassian Page Header](https://atlassian.design/components/page-header/)도 페이지 제목, breadcrumb와 page-wide action을 화면 헤더의 중심 책임으로 둡니다.
- [PatternFly Page Header](https://www.patternfly.org/component-groups/content-containers/page-header/)는 title·subtitle·label·action의 로컬 콘텐츠 헤더이고, [PatternFly Masthead](https://www.patternfly.org/components/masthead/design-guidelines/)는 logo·global navigation·utility가 있는 전역 셸입니다. 따라서 프로필 전용 공개 이름으로 `Masthead`를 쓰지 않습니다.
- [WCAG 2.2 Reflow](https://www.w3.org/TR/WCAG22/#reflow)에 맞춰 320 CSS px 상당의 폭에서 양방향 스크롤 없이 재배치합니다.

## 필수 제품 자산 판정

- **LK Web Viz** — `not applicable`. 고정된 Dashboard 화면에는 선택 로봇과 연결 상태가 있지만, 이름·식별 이미지·세부 통계·대상 액션을 함께 가진 재사용 레코드 헤더가 없습니다.
- **LK Control Full Daedeok** — `not applicable`. 고정된 MainLayout과 Robot Dashboard는 셸·탐색·감시 화면을 조합하며 일반화 가능한 레코드 정체성 헤더를 제공하지 않습니다.
- **LK Context Hub** — `not applicable`. 고정된 AuthShell과 홈 화면에는 계정/제품 identity가 있지만 레코드 상세용 visual·이름·details·actions 묶음은 없습니다.

대상 데이터 fetch, 실제 팔로우·설정·공유 결과, 권한, route, 통계 계산과 포맷은 제품이 소유합니다. 새 icon이나 이미지 자산을 추가하지 않고 기존 `Avatar`, `Thumbnail`, `Icon`, `StatusBadge`를 슬롯으로 조합합니다.
