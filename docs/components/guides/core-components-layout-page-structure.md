# Page Structure

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `Container` |
| Storybook | `LDS Core/Components/Layout/Page Structure` |
| Source | `../component-content.json#core-components-layout-page-structure` |

헤더·본문·보조 영역처럼 화면 전체의 구조와 너비 관계를 정할 때 사용합니다. 바깥 골격은 header·main·footer 랜드마크로 선언하고 main은 하나만 둡니다. 반복 헤더에는 첫 포커스 대상인 skip link를 두고, 반복 항목은 Grid·Columns, 한 방향 간격은 Stack을 사용하세요. 작은 내부 정렬에는 이 페이지 구조를 사용하지 말고 각 컴포넌트에서 해결하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `size` | `'default' \| 'read' \| 'wide'` | No | 폭 단계: - default — 반응형 컬럼(lg까지 ≤1100, xl에서 1440) - read — 좁은 리딩 밴드(1100) - wide — 풀블리드 레일(1500) |
| `children` | `React.ReactNode` | No |  |
| `surface` | `'subtle' \| 'band' \| 'raised' \| 'inverse'` | No | 밴드의 배경 서피스. 생략하면 투명. |
| `py` | `number \| string` | No | 반응형 세로 패딩 재정의(숫자 = px). 기본값 --gap-section. |
| `container` | `boolean` | No | 자식을 중앙 정렬 반응형 컨테이너로 감싸기. @default true |
| `innerStyle` | `React.CSSProperties` | No | 내부 컨테이너 요소의 스타일. |
| `children` | `React.ReactNode` | No |  |
| `template` | `string` | No | 브레이크포인트 위에서 적용되는 grid-template-columns. @default "1fr 1fr" |
| `at` | `'md' \| 'lg'` | No | 두 패널이 나뉘는 브레이크포인트; 그 아래에서는 쌓임. @default "md" |
| `gap` | `number \| string` | No | 패널 사이 갭(숫자 = px). 기본값 --gap-lg(24). |
| `children` | `React.ReactNode` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size — default 1280 · read 1080 · wide 1500. 거터 포함. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-background-normal-alternative | light: #F7F7F8; dark: #0F0F10 |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Related components

| Component | Relationship |
| --- | --- |
| `Section` | 같은 페이지가 소유 |
| `Split` | 같은 페이지가 소유 |
| `AspectRatio` | 대표 시나리오에서 조합 |
| `Center` | 대표 시나리오에서 조합 |
| `Cluster` | 대표 시나리오에서 조합 |
| `Col` | 대표 시나리오에서 조합 |
| `Columns` | 대표 시나리오에서 조합 |
| `Divider` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Container>…</Container>          {/* 1280 */}
<Container size="read">…</Container>   {/* 1080 텍스트 밴드 */}
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--container-read`
- `--container-wide`
- `--grid-margin`

### Source contracts

- `components/layout/Container.jsx`
- `components/layout/Container.d.ts`
- `components/layout/Container.prompt.md`
- `components/layout/Section.jsx`
- `components/layout/Section.d.ts`
- `components/layout/Section.prompt.md`
- `components/layout/Split.jsx`
- `components/layout/Split.d.ts`
- `components/layout/Split.prompt.md`
- `stories/Layout.stories.jsx`

## Sources

- Container prompt contract: `components/layout/Container.prompt.md`
- Storybook implementation evidence: `stories/Layout.stories.jsx`
