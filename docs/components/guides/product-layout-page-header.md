# Page Header

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Layout |
| Owner | `PageHeader` |
| Storybook | `LDS Product/Layout/Page Header` |
| Source | `../component-content.json#product-layout-page-header` |

제품 화면의 breadcrumb, 제목, 설명, 상태, 메타데이터, 주요 액션을 일관된 상단 영역으로 묶을 때 적합합니다. 카드나 작은 섹션 제목에는 PageHeader 대신 해당 영역의 heading과 필요한 액션만 사용하세요.

## 사용 판단

### 사용

- 제품 화면의 breadcrumb, 제목, 설명, 상태, 메타데이터, 주요 액션을 일관된 상단 영역으로 묶을 때 적합합니다. 카드나 작은 섹션 제목에는 PageHeader 대신 해당 영역의 heading과 필요한 액션만 사용하세요.
- eyebrow·meta는 화면 이해에 필요한 텍스트이므로 label-neutral 색과 label2 타이포 토큰을 사용합니다. AA 미달인 label-assistive·label-disable을 필수 텍스트에 쓰지 않습니다.
- 1. 기능으로 이름 붙은 화면 헤더 — 제목이 업무입니다(“사용자 관리”). breadcrumb·eyebrow로 위치를 잡고 actions로 다음 작업을 제시합니다. 2. 대상으로 이름 붙은 레코드·정체성 헤더 — 제목이 대상 그 자체입니다(사람·로봇·주문). avatar로 정체성 이미지를, status로 인증·상태 표식을, meta로 라벨 붙은 스탯 행(StatList)을 답니다. 프로필·계정·멤버·레코드 상세가 여기 속합니다.
- Page Header가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(StatList), 설정·공유=actions. 이는 Lightning이 레코드 상세 헤더를 page header의 변형(record home)으로 두는 것과 같은….
- WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다.
- WAI Landmarks Pattern의 고수준 구조 원칙에 따라 PageHeader는 main 안의 로컬 이며, TopBar의 전역 banner나 Storybook 설명 chrome을 대체하지 않습니다.
- - title은 필수입니다. breadcrumb, eyebrow, avatar, description, status, meta, actions는 슬롯입니다. - avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(S….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | PageHeader의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Avatar | 제목 앞 정체성 이미지 슬롯(Avatar·Thumbnail 등). 프로필·계정·레코드 마스트헤드에서 이름 왼쪽에 놓입니다. 슬롯이므로 레이아웃이 아바타 구현에 의존하지 않습니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | 제목 아래 설명. |
| Actions | 우측 액션 영역. |
| Align | 액션 영역과 본문 수직 정렬. @default "start" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `eyebrow` | `React.ReactNode` | No | 제목 위 보조 라벨. |
| `breadcrumb` | `React.ReactNode` | No | Breadcrumb 등 제목 위 경로 슬롯. |
| `avatar` | `React.ReactNode` | No | 제목 앞 정체성 이미지 슬롯(Avatar·Thumbnail 등). 프로필·계정·레코드 마스트헤드에서 이름 왼쪽에 놓입니다. 슬롯이므로 레이아웃이 아바타 구현에 의존하지 않습니다. |
| `title` | `React.ReactNode` | Yes | 페이지 제목. |
| `description` | `React.ReactNode` | No | 제목 아래 설명. |
| `status` | `React.ReactNode` | No | 제목 옆 상태 badge/chip 슬롯. |
| `meta` | `React.ReactNode` | No | 설명 아래 metadata 슬롯. |
| `actions` | `React.ReactNode` | No | 우측 액션 영역. |
| `align` | `'start' \| 'center'` | No | 액션 영역과 본문 수직 정렬. @default "start" |
| `size` | `'sm' \| 'md'` | No | 제목 크기. @default "md" |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 제목의 문서 heading 단계. @default 1 |

## States

| State | Contract |
| --- | --- |
| status | 제목 옆 상태 badge/chip 슬롯. 타입 계약: React.ReactNode |
| 변형·상태 · 레코드 헤더(프로필) | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 긴 제목과 복수 액션 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- actions 슬롯에는 버튼·가로형 SegmentedControl처럼 헤더 한 줄 높이에 맞는 컨트롤만 배치합니다. 세로형 FloorSelector 같은 tall 컨트롤은 헤더가 아니라 맵·뷰어 옆 오버레이에 둡니다.
- breadcrumb·eyebrow는 제목 위의 전용 풀폭 컨텍스트 행입니다. 넓은 컨테이너에서 actions는 컨텍스트 행이 아니라 제목 행에 정렬되어 좌측 스택 옆에 뜬 공백을 만들지 않습니다. 좁은 컨테이너에서는 DOM과 읽기 순서를 바꾸지 않은 채 actions가 다음 행으로 내려가고 내부 버튼도 wrap합니다. 긴 제목·설명은 단어를 자르지 않는 것을 우선하되 끊을 수 없는 문자열은 컨테이너 밖으로 넘치지 않게 줄바꿈합니다.
- PageHeader — 페이지 상단에서 제목, 설명, 상태 badge, breadcrumb, 정체성 이미지, primary action을 정렬하는 계약.
- 1. 기능으로 이름 붙은 화면 헤더 — 제목이 업무입니다(“사용자 관리”). breadcrumb·eyebrow로 위치를 잡고 actions로 다음 작업을 제시합니다. 2. 대상으로 이름 붙은 레코드·정체성 헤더 — 제목이 대상 그 자체입니다(사람·로봇·주문). avatar로 정체성 이미지를, status로 인증·상태 표식을, meta로 라벨 붙은 스탯 행(StatList)을 답니다. 프로필·계정·멤버·레코드 상세가 여기 속합니다.
- - title은 필수입니다. breadcrumb, eyebrow, avatar, description, status, meta, actions는 슬롯입니다. - avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(S….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(StatList), 설정·공유=actions. 이는 Lightning이 레코드 상세 헤더를 page header의 변형(record home)으로 두는 것과 같은… |
| 명시 규칙 2 | 앱 화면마다 hero를 새로 만들지 말고 반복되는 앱 헤더에는 PageHeader를 쓰세요. 기본 headingLevel={1}로 한 화면에 하나만 배치합니다. 문서·비교 도구처럼 상위 제목이 이미 있는 합성 표면에서만 headingLevel={2..6}으로 주변 heading 구조에 연결합니다. |
| 명시 규칙 3 | WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다. |
| 명시 규칙 4 | 1. 기능으로 이름 붙은 화면 헤더 — 제목이 업무입니다(“사용자 관리”). breadcrumb·eyebrow로 위치를 잡고 actions로 다음 작업을 제시합니다. 2. 대상으로 이름 붙은 레코드·정체성 헤더 — 제목이 대상 그 자체입니다(사람·로봇·주문). avatar로 정체성 이미지를, status로 인증·상태 표식을, meta로 라벨 붙은 스탯 행(StatList)을 답니다. 프로필·계정·멤버·레코드 상세가 여기 속합니다. |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(StatList), 설정·공유=actions. 이는 Lightning이 레코드 상세 헤더를 page header의 변형(record home)으로 두는 것과 같은….
- actions 슬롯에는 버튼·가로형 SegmentedControl처럼 헤더 한 줄 높이에 맞는 컨트롤만 배치합니다. 세로형 FloorSelector 같은 tall 컨트롤은 헤더가 아니라 맵·뷰어 옆 오버레이에 둡니다.
- breadcrumb·eyebrow는 제목 위의 전용 풀폭 컨텍스트 행입니다. 넓은 컨테이너에서 actions는 컨텍스트 행이 아니라 제목 행에 정렬되어 좌측 스택 옆에 뜬 공백을 만들지 않습니다. 좁은 컨테이너에서는 DOM과 읽기 순서를 바꾸지 않은 채 actions가 다음 행으로 내려가고 내부 버튼도 wrap합니다. 긴 제목·설명은 단어를 자르지 않는 것을 우선하되 끊을 수 없는 문자열은 컨테이너 밖으로 넘치지 않게 줄바꿈합니다.
- WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다.

## Content and writing

- title은 필수입니다. breadcrumb, eyebrow, avatar, description, status, meta, actions는 슬롯입니다.
- avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(StatList), 설정·공유=actions. 이는 Lightning이 레코드 상세 헤더를 page header의 변형(record home)으로 두는 것과 같은….
- 앱 화면마다 hero를 새로 만들지 말고 반복되는 앱 헤더에는 PageHeader를 쓰세요. 기본 headingLevel={1}로 한 화면에 하나만 배치합니다. 문서·비교 도구처럼 상위 제목이 이미 있는 합성 표면에서만 headingLevel={2..6}으로 주변 heading 구조에 연결합니다.
- eyebrow·meta는 화면 이해에 필요한 텍스트이므로 label-neutral 색과 label2 타이포 토큰을 사용합니다. AA 미달인 label-assistive·label-disable을 필수 텍스트에 쓰지 않습니다.

## Accessibility

- WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다.
- - WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다. - WAI Landmarks Pattern의 고수준 구조 원칙에 따라 PageHeader는 main 안의 로컬 이며, TopBar의 전역 banner나 Storybook 설명 chrome을 대체하지 않습니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | eyebrow·meta는 화면 이해에 필요한 텍스트이므로 label-neutral 색과 label2 타이포 토큰을 사용합니다. AA 미달인 label-assistive·label-disable을 필수 텍스트에 쓰지 않습니다. |
| Don't | avatar — 제목 앞 정체성 이미지 슬롯입니다(위 2번 갈래). Avatar(또는 Thumbnail)를 넣으면 이름 왼쪽에 놓이고, 좁은 폭에서도 제목 블록과 함께 정렬됩니다. 슬롯이라 레이아웃이 아바타 구현에 의존하지 않습니다. 정체성 헤더는 별도 컴포넌트를 만들지 말고 이 슬롯으로 조립하세요 — 이름=title, 인증 배지=status, 한 줄 소개=description, 팔로워 등 스탯=meta(StatList), 설정·공유=actions. 이는 Lightning이 레코드 상세 헤더를 page header의 변형(record home)으로 두는 것과 같은…. |
| Do | 1. 기능으로 이름 붙은 화면 헤더 — 제목이 업무입니다(“사용자 관리”). breadcrumb·eyebrow로 위치를 잡고 actions로 다음 작업을 제시합니다. 2. 대상으로 이름 붙은 레코드·정체성 헤더 — 제목이 대상 그 자체입니다(사람·로봇·주문). avatar로 정체성 이미지를, status로 인증·상태 표식을, meta로 라벨 붙은 스탯 행(StatList)을 답니다. 프로필·계정·멤버·레코드 상세가 여기 속합니다. |
| Don't | WCAG 2.2 Reflow에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 PageHeader의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Avatar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Breadcrumb` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SegmentedControl` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatusBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<PageHeader
  breadcrumb={<Breadcrumb items={[{ label: '관리' }, { label: '사용자' }]} />}
  title="사용자 관리"
  status={<StatusBadge tone="signal">검토 중</StatusBadge>}
  description="계정 상태와 최근 변경 이력을 확인합니다."
  actions={<Button>사용자 추가</Button>}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--heading1-line`
- `--heading1-size`
- `--heading1-spacing`
- `--heading2-line`
- `--heading2-size`
- `--heading2-spacing`
- `--label1-reading-line`
- `--label1-size`
- `--label1-spacing`
- `--label2-line`
- `--label2-size`
- `--label2-spacing`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/layout/PageHeader.jsx`
- `components/layout/PageHeader.d.ts`
- `components/layout/PageHeader.prompt.md`
- `stories/LayoutPageHeader.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- PageHeader prompt contract: `components/layout/PageHeader.prompt.md`
- Storybook implementation evidence: `stories/LayoutPageHeader.stories.jsx`
- [WCAG 2.2 Reflow](https://www.w3.org/TR/WCAG22/#reflow)
- [WAI Landmarks Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
