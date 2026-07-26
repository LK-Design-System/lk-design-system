# Breadcrumb

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `Breadcrumb` |
| Storybook | `LDS Product/Navigation/Breadcrumb` |
| Source | `../component-content.json#product-navigation-breadcrumb` |

세 단계 이상 중첩된 콘텐츠·관리 화면에서 상위 경로로 돌아갈 때 적합합니다. 순차 작업의 진행 상태에는 Breadcrumb 대신 Steps나 Wizard를 사용하세요.

## 사용 판단

### 사용하지 않음

- Classification: LK Product Extension. 현재 페이지의 상위 경로를 보여주는 로컬 웨이파인딩이며, TopBar·SideNav·NavRail·BottomNav 같은 주 탐색을 대신하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | Yes | 경로 항목, 상위 → 현재(마지막은 굵고 링크 없음). |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 내비 텍스트 13.5px → --label2-size(13px)로 스냅했습니다. 경로 트레일은 웨이파인딩 메타라 한 단계 아래로 정렬합니다. |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --fw-bold | 700 |

## Accessibility

- items — { label, href }[]; 마지막 항목은 현재 페이지로 렌더됩니다(링크 없음, aria-current="page").
- 접근성 — APG 패턴대로 nav ol li 구조로 렌더되고, 셰브론 구분자는 장식(aria-hidden)입니다. nav의 기본 aria-label은 '현재 위치'이며 aria-label을 넘기면 덮어씁니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Footer` | 대표 시나리오에서 조합 |
| `LanguageSwitcher` | 대표 시나리오에서 조합 |
| `NavRail` | 대표 시나리오에서 조합 |
| `SideNav` | 대표 시나리오에서 조합 |
| `Steps` | 대표 시나리오에서 조합 |
| `Toolbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Breadcrumb items={[
  { label: '홈', href: '/' },
  { label: '제품', href: '/products' },
  { label: 'LKR-T1' },
]} />
```

## Tokens and API

### Tokens

- `--color-semantic-label-assistive`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label2-size`

### Source contracts

- `components/navigation/Breadcrumb.jsx`
- `components/navigation/Breadcrumb.d.ts`
- `components/navigation/Breadcrumb.prompt.md`
- `stories/NavigationBreadcrumb.stories.jsx`

## Sources

- Breadcrumb prompt contract: `components/navigation/Breadcrumb.prompt.md`
- Storybook implementation evidence: `stories/NavigationBreadcrumb.stories.jsx`
