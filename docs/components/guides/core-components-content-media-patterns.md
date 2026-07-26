# Media Patterns

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Thumbnail` |
| Storybook | `LDS Core/Components/Content/Media Patterns` |
| Source | `../component-content.json#core-components-content-media-patterns` |

카드, 갤러리, 미리보기에서 원본 크기가 다른 미디어를 일정한 비율로 정렬할 때 적합합니다. 인물 정체성은 Avatar를, 장식용 배경은 일반 이미지나 CSS 배경을 사용하고 중요한 상태를 오버레이에만 의존하지 마세요.

## 사용 판단

### 사용

- Thumbnail — WDS Thumbnail. 일정한 비율로 이미지/비디오/플레이스홀더 콘텐츠를 미리 보여주는 미디어 타일입니다.

## Anatomy

| Part | Contract |
| --- | --- |
| placeholderIcon | 플레이스홀더 아이콘 이름. @default "image" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `src` | `string` | No | 이미지 URL. 생략하면 중립 플레이스홀더로 채움. |
| `alt` | `string` | No | 이미지의 대체 텍스트. |
| `ratio` | `ThumbnailRatio \| number \| string` | No | ratio preset or CSS/number aspect ratio. @default "1/1" |
| `radius` | `boolean \| number \| string` | No | 둥근 모서리: true = --radius-md, false = 사각, 또는 숫자/CSS 길이. @default true |
| `border` | `boolean \| string` | No | border toggle (WDS bakes a 1px hairline into every thumbnail). @default true |
| `fit` | `"cover" \| "contain"` | No | 이미지의 object-fit. @default "cover" |
| `overlay` | `React.ReactNode` | No | 오버레이 노드(배지, 재생 글리프, 재생시간). |
| `overlayAlign` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "center"` | No | 오버레이 위치. @default "top-left" |
| `overlayScrim` | `boolean \| "auto"` | No | 오버레이 뒤에 대비 보장을 위한 그라디언트 스크림을 깝니다. "auto" 는 실제 이미지(src)가 있을 때만 적용하고, 플레이스홀더 타일에는 넣지 않습니다. |
| `placeholder` | `boolean` | No | src가 없을 때 플레이스홀더 아이콘을 표시. @default true |
| `placeholderIcon` | `string` | No | 플레이스홀더 아이콘 이름. @default "image" |
| `children` | `React.ReactNode` | No |  |

## Behavior and interaction

- alt 는 기본값이 빈 문자열이므로, 아무것도 주지 않으면 장식 이미지로 취급됩니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WDS ratio presets: 1/1 · 5/4 · 4/3 · 3/2 · 16/10 · 1.618/1 · 16/9 · 2/1 · 21/9 · 4/5 · 3/4 · 2/3 · 10/16 · 1/1.618 · 9/16 · 1/2 · 9/21. |
| 명시 규칙 2 | 정보 전달 이미지 — 이미지가 주변 텍스트에 없는 정보를 담고 있으면 반드시 alt 를 쓰세요. 무엇이 보이는지 짧게 서술합니다: alt="3층 창고 구역 미니맵". 파일명, "이미지", "썸네일" 같은 말은 넣지 않습니다. |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-line-normal-normal | light: rgba(112, 115, 124, 0.22); dark: rgba(112, 115, 124, 0.32) |

## Content and writing

- Use overlay/children only for real content badges, play glyphs, duration, or state labels.
- 장식 이미지 — 옆의 제목·설명이 이미 같은 정보를 주면 alt=""(기본값)로 두어 중복 낭독을 막습니다. 카드 안에서 제목과 짝을 이루는 대표 이미지가 여기에 해당합니다.
- 오버레이는 임의의 사진 위에 놓이므로, 사진이 밝으면 라벨 대비가 예고 없이 무너집니다. 그래서 오버레이가 있고 실제 이미지(src)가 있으면 오버레이 쪽 모서리에서 시작하는 그라디언트 스크림을 자동으로 깝니다(overlayScrim="auto", 기본값). 피사체 전체를 어둡게 하지 않는 Material/영상 플레이어 관례입니다.
- 스크림은 보험이지 면제권이 아닙니다. 중요한 상태를 오버레이에만 의존하지 말고 카드 텍스트에도 남기세요.

## Accessibility

- src 가 없는 플레이스홀더 타일은 아이콘이 aria-hidden 이라 접근성 트리에 아무것도 남기지 않습니다 — 별도 alt 가 필요 없습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Overline` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Thumbnail ratio="16/9" overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />
<Thumbnail ratio="4/5" radius={false} border />
<Thumbnail src="assets/products/lkr-t1.webp" ratio="4/3" alt="LKR-T1" />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-assistive`
- `--color-semantic-line-normal-normal`
- `--material-control-dimmer`
- `--radius-md`
- `--ratio-1-1`
- `--ratio-1-2`
- `--ratio-10-16`
- `--ratio-16-10`
- `--ratio-16-9`
- `--ratio-2-1`
- `--ratio-2-3`
- `--ratio-21-9`
- `--ratio-3-2`
- `--ratio-3-4`
- `--ratio-4-3`
- `--ratio-4-5`
- `--ratio-5-4`
- `--ratio-9-16`
- `--ratio-9-21`
- `--ratio-golden`
- `--ratio-golden-vertical`
- `--space-1-5`

### Source contracts

- `components/content/Thumbnail.jsx`
- `components/content/Thumbnail.d.ts`
- `components/content/Thumbnail.prompt.md`
- `stories/ContentMedia.stories.jsx`

## Sources

- Thumbnail prompt contract: `components/content/Thumbnail.prompt.md`
- Storybook implementation evidence: `stories/ContentMedia.stories.jsx`
