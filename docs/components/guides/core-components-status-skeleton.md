# Skeleton

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `Skeleton` |
| Storybook | `LDS Core/Components/Status/Skeleton` |
| Source | `../component-content.json#core-components-status-skeleton` |

Skeleton - WDS loading placeholder for content that is not ready yet.

## 사용 판단

### 사용

- Skeleton - WDS loading placeholder for content that is not ready yet.
- Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 animation:none!important로 선언되어 사용자 설정이 항상 이깁니다.
- - variant: rect, text, or circle. - width / height / radius map to WDS customize geometry. - lines and align cover WDS text skeleton length and alignment examples. - color / opacity cover WDS rectangle/circle customize axes. - Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 anim….
- Skeleton가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Skeleton가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Skeleton의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

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
| variant | Shape. text renders one or more line bars; rect and circle render a single block. @default "rect" 타입 계약: "rect" \| "text" \| "circle" |
| tone | Visual tone for normal or inverse/dark surfaces. @default "normal" 타입 계약: "normal" \| "light" \| "white" |

## Behavior and interaction

- aria-busy 컨테이너 규약 — Skeleton 자체는 항상 aria-hidden="true"라서 보조기술에 뼈대가 콘텐츠로 읽히지 않습니다. 로딩 상태는 Skeleton이 아니라 대기 중인 영역을 감싸는 컨테이너가 알립니다. 컨테이너에 aria-busy="true"를 주고, 대기를 소리로 알려야 하면 role="status" aria-live="polite"와 짧은 텍스트 레이블(예: visually-hidden "데이터를 불러오는 중입니다")을 함께 두세요.
- - variant: rect, text, or circle. - width / height / radius map to WDS customize geometry. - lines and align cover WDS text skeleton length and alignment examples. - color / opacity cover WDS rectangle/circle customize axes. - Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 anim….
- Skeleton의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Skeleton는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-inverse-fill-normal | light: rgba(255, 255, 255, 0.12); dark: rgba(255, 255, 255, 0.12) |
| --color-semantic-inverse-line-strong | light: rgba(255, 255, 255, 0.22); dark: rgba(255, 255, 255, 0.22) |

## Responsive

- width / height / radius map to WDS customize geometry.
- - variant: rect, text, or circle. - width / height / radius map to WDS customize geometry. - lines and align cover WDS text skeleton length and alignment examples. - color / opacity cover WDS rectangle/circle customize axes. - Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 anim….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- variant: rect, text, or circle.
- lines and align cover WDS text skeleton length and alignment examples.
- aria-busy 컨테이너 규약 — Skeleton 자체는 항상 aria-hidden="true"라서 보조기술에 뼈대가 콘텐츠로 읽히지 않습니다. 로딩 상태는 Skeleton이 아니라 대기 중인 영역을 감싸는 컨테이너가 알립니다. 컨테이너에 aria-busy="true"를 주고, 대기를 소리로 알려야 하면 role="status" aria-live="polite"와 짧은 텍스트 레이블(예: visually-hidden "데이터를 불러오는 중입니다")을 함께 두세요.
- Skeleton - WDS loading placeholder for content that is not ready yet.

## Accessibility

- aria-busy 컨테이너 규약 — Skeleton 자체는 항상 aria-hidden="true"라서 보조기술에 뼈대가 콘텐츠로 읽히지 않습니다. 로딩 상태는 Skeleton이 아니라 대기 중인 영역을 감싸는 컨테이너가 알립니다. 컨테이너에 aria-busy="true"를 주고, 대기를 소리로 알려야 하면 role="status" aria-live="polite"와 짧은 텍스트 레이블(예: visually-hidden "데이터를 불러오는 중입니다")을 함께 두세요.
- - variant: rect, text, or circle. - width / height / radius map to WDS customize geometry. - lines and align cover WDS text skeleton length and alignment examples. - color / opacity cover WDS rectangle/circle customize axes. - Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 anim….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 animation:none!important로 선언되어 사용자 설정이 항상 이깁니다. |
| Don't | Skeleton가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - variant: rect, text, or circle. - width / height / radius map to WDS customize geometry. - lines and align cover WDS text skeleton length and alignment examples. - color / opacity cover WDS rectangle/circle customize axes. - Motion respects prefers-reduced-motion. shimmer는 inline style로 적용되므로 reduced-motion 규칙은 anim…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Skeleton의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Banner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Callout` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `EmptyState` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Spinner` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Skeleton prompt contract: `components/status/Skeleton.prompt.md`
- Storybook implementation evidence: `stories/StatusSkeleton.stories.jsx`
- [SEED Skeleton benchmark](https://seed-design.io/components/skeleton)
