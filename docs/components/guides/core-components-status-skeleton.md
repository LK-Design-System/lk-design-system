# Skeleton

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `Skeleton` |
| Storybook | `LDS Core/Components/Status/Skeleton` |
| Source | `../component-content.json#core-components-status-skeleton` |

레이아웃 이동 없이 로딩을 표현해야 할 때 적합합니다. 완료 시점을 알 수 없는 짧은 대기에는 Spinner를, 진행률을 알 수 있으면 Progress를 대신 쓰세요.

## 사용 판단

### 사용

- Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 animation:none!important로 선언되어 사용자 설정이 항상 이깁니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `"rect" \| "text" \| "circle"` | No | Shape. text renders one or more line bars; rect and circle render a single block. @default "rect" |
| `width` | `number \| string` | No | Width in px, CSS length, or percent. @default "100%" |
| `length` | `"25%" \| "50%" \| "75%" \| "100%" \| number \| string` | No | text skeleton length axis. Overrides width when provided. |
| `height` | `number \| string` | No | Height in px or CSS length. Text defaults to 14px, rect to 16px, circle to width. |
| `radius` | `number \| string` | No | Rect corner radius. Defaults to 3px (WDS); circle always uses 50%. |
| `lines` | `number` | No | Text-line count. The last line is shortened when more than one line is rendered. @default 1 |
| `align` | `"leading" \| "center" \| "trailing"` | No | Horizontal alignment for text lines. @default "leading" |
| `tone` | `"normal" \| "light" \| "white"` | No | Visual tone for normal or inverse/dark surfaces. @default "normal" |
| `color` | `string` | No | customize color axis. Use white for inverse-surface skeletons. |
| `animate` | `boolean` | No | animate axis. @default true |
| `opacity` | `number \| string` | No | customize opacity axis. |

## States

| State | Contract |
| --- | --- |
| variant | Shape. text renders one or more line bars; rect and circle render a single block. @default "rect" |
| tone | Visual tone for normal or inverse/dark surfaces. @default "normal" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-inverse-fill-normal | light: rgba(255, 255, 255, 0.12); dark: rgba(255, 255, 255, 0.12) |
| --color-semantic-inverse-line-strong | light: rgba(255, 255, 255, 0.22); dark: rgba(255, 255, 255, 0.22) |

## Responsive

- width / height / radius map to WDS customize geometry.

## Content and writing

- variant: rect, text, or circle.
- lines and align cover WDS text skeleton length and alignment examples.
- Skeleton - WDS loading placeholder for content that is not ready yet.

## Accessibility

- aria-busy 컨테이너 규약 — Skeleton 자체는 항상 aria-hidden="true"라서 보조기술에 뼈대가 콘텐츠로 읽히지 않습니다. 로딩 상태는 Skeleton이 아니라 대기 중인 영역을 감싸는 컨테이너가 알립니다. 컨테이너에 aria-busy="true"를 주고, 대기를 소리로 알려야 하면 role="status" aria-live="polite"와 짧은 텍스트 레이블(예: visually-hidden "데이터를 불러오는 중입니다")을 함께 두세요.

## Related components

| Component | Relationship |
| --- | --- |
| `Banner` | 대표 시나리오에서 조합 |
| `Callout` | 대표 시나리오에서 조합 |
| `EmptyState` | 대표 시나리오에서 조합 |
| `Spinner` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Skeleton variant="circle" width={44} />
<Skeleton variant="text" lines={3} width="75%" />
<Skeleton variant="rect" width={280} height={160} />
<Skeleton variant="rect" width={80} height={80} color="#E8EDF5" opacity={0.8} />
```

### 추가 조합 2

```jsx
<div aria-busy="true" role="status" aria-live="polite">
  <VisuallyHidden>데이터를 불러오는 중입니다</VisuallyHidden>
  <Skeleton variant="text" lines={3} />
</div>
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-fill-normal`
- `--color-semantic-inverse-line-strong`

### Source contracts

- `components/status/Skeleton.jsx`
- `components/status/Skeleton.d.ts`
- `components/status/Skeleton.prompt.md`
- `stories/StatusSkeleton.stories.jsx`

## Sources

- Skeleton prompt contract: `components/status/Skeleton.prompt.md`
- Storybook implementation evidence: `stories/StatusSkeleton.stories.jsx`
