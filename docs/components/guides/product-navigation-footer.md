# Footer

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `Footer` |
| Storybook | `LDS Product/Navigation/Footer` |
| Source | `../component-content.json#product-navigation-footer` |

랜딩·콘텐츠의 법적 링크나 대시보드의 작은 제품 정보를 일관되게 제공할 때 적합합니다. 핵심 작업이나 현재 위치 탐색에는 Footer 대신 본문 CTA나 Navigation을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| contact | 연락 행 — 기본값: 실제 LK 대표전화 · 사업자등록번호. |
| locations | 거점 행 — 기본값: 실제 본사(대전) · R&D 센터(서울) · 공장(고양). |
| columns | (확장) 링크 컬럼 — 실사이트 푸터에는 없음. |
| links | (확장) 정책 링크 — 저작권 줄 옆 / compact 우측. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `contact` | `FooterEntry[]` | No | 연락 행 — 기본값: 실제 LK 대표전화 · 사업자등록번호. |
| `locations` | `FooterEntry[]` | No | 거점 행 — 기본값: 실제 본사(대전) · R&D 센터(서울) · 공장(고양). |
| `copyright` | `React.ReactNode` | No | 저작권 줄. @default "Copyright ⓒ 2024 - 2026 LK ROBOTICS Inc. All rights reserved." |
| `brand` | `React.ReactNode` | No | (확장) 브랜드 노드 — 실사이트 푸터에는 없음. |
| `columns` | `FooterColumn[]` | No | (확장) 링크 컬럼 — 실사이트 푸터에는 없음. |
| `links` | `FooterLink[]` | No | (확장) 정책 링크 — 저작권 줄 옆 / compact 우측. |
| `compact` | `boolean` | No | 한 줄 앱 푸터 — 헤어라인 탑 + 뮤트 텍스트, 대시보드 바닥용. @default false |
| `backToTop` | `boolean` | No | 실사이트 푸터에 포함된 '맨 위로' 플로팅 버튼(스크롤 600px 후 표시). @default false |
| `maxWidth` | `number` | No | 콘텐츠 컬럼 최대 폭(px). 실사이트 값. @default 1280 |
| `style` | `React.CSSProperties` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | contact / locations — { label, value }[]. 라벨은 흰색 62%·700, 값은 45%. EN 페이지는 { label: 'Tel', value: '02-3159-2865' }처럼 번역해 전달. |
| 명시 규칙 2 | copyright — 기본 Copyright ⓒ 2024 - 2026 LK ROBOTICS Inc. All rights reserved. |
| 명시 규칙 3 | backToTop — 푸터와 함께 렌더하는 플로팅 버튼(스크롤 600px 후 표시, 부드러운 상단 이동). |
| 명시 규칙 4 | 서피스는 --color-semantic-inverse-background(라이트에서 0E1329, 다크에선 페이지에서 떠 보이는 raised 네이비), 텍스트는 고정 화이트 알파(0.62 / 0.45 / 0.38)를 사용합니다. |
| --body2-size | 15px |

## Responsive

- (확장, 실사이트엔 없음) brand · columns — 마케팅 푸터가 커질 때만. compact는 페이지 서피스 위 한 줄 변형.
- Footer — 사이트 푸터. 네이비 밴드 + 정보 블록(대표전화·사업자등록번호 → 본사·R&D·공장 주소 → 저작권)을 일관된 토큰으로 렌더합니다. compact는 대시보드 바닥용 한 줄 버전.
- Classification: LK Product Extension. 전체형 Footer는 랜딩·콘텐츠 사이트에서 TopBar와 조합하고, compact는 대시보드의 보조 메타데이터에만 사용합니다. 어느 변형도 주 탐색을 대신하지 않습니다.

## Content and writing

- 타입 스케일 정합: 저작권·법적 링크 12.5px → --caption1-size(12px), 컬럼 링크 13.5px → --label2-size(13px)로 스냅했습니다. 파인 프린트는 한 단계 아래로, 컬럼 링크는 15px 헤딩(body2)과의 위계를 유지합니다.

## Accessibility

- 접근성 — 컬럼 제목은 role="heading" + aria-level=3으로 헤딩 시맨틱을 갖고, 링크 그룹(컬럼·정책 링크)은 ul/li로 렌더됩니다. href가 없는 링크 항목은 href="" 폴백 없이 일반 텍스트로 렌더됩니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Breadcrumb` | 대표 시나리오에서 조합 |
| `LanguageSwitcher` | 대표 시나리오에서 조합 |
| `NavRail` | 대표 시나리오에서 조합 |
| `SideNav` | 대표 시나리오에서 조합 |
| `Steps` | 대표 시나리오에서 조합 |
| `Toolbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Footer />                                {/* 기본 푸터 */}
<Footer backToTop />                      {/* '맨 위로' 플로팅 버튼 포함 */}

<Footer compact copyright="© 2026 LK ROBOTICS Inc. · Design System" links={[{ label: '고객지원', href: '#' }]} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-ink`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-alternative-soft`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-inverse-label-strong-soft`
- `--color-semantic-inverse-line-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--label2-size`
- `--radius-pill`
- `--shadow-md`
- `--space-0-5`
- `--space-4-5`

### Source contracts

- `components/navigation/Footer.jsx`
- `components/navigation/Footer.d.ts`
- `components/navigation/Footer.prompt.md`
- `stories/NavigationFooter.stories.jsx`

## Sources

- Footer prompt contract: `components/navigation/Footer.prompt.md`
- Storybook implementation evidence: `stories/NavigationFooter.stories.jsx`
