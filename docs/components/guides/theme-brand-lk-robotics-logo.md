# LK ROBOTICS Logo

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Brand |
| Owner | `Lockup` |
| Storybook | `LDS Theme/Brand/LK ROBOTICS Logo` |
| Source | `../component-content.json#theme-brand-lk-robotics-logo` |

제품 식별이 필요한 시작점과 브랜드 표면에 정해진 lockup과 여백으로 사용하는 데 적합합니다. 기능 아이콘이나 장식처럼 반복 사용하지 않으며, 비율·색상·자간을 임의로 바꾸거나 다른 문구와 재조합하지 않습니다.

## 사용 판단

### 사용

- 제품 식별이 필요한 시작점과 브랜드 표면에 정해진 lockup과 여백으로 사용하는 데 적합합니다. 기능 아이콘이나 장식처럼 반복 사용하지 않으며, 비율·색상·자간을 임의로 바꾸거나 다른 문구와 재조합하지 않습니다.
- LK ROBOTICS 로고. 에셋 파일 없이 자체 완결형 SVG입니다. variant는 mark/stacked/inline, tone은 ink/white/brand/current, 크기는 height로 지정합니다. 구성(마크·워드마크 비율)은 원본 트레이스 에셋(assets/brand/lk-logo-.svg)과 동일하게 고정 — 워드마크를 임의로 확대/재배치하지 마세요.
- LK ROBOTICS Logo가 소유하는 Brand 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Lockup API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- LK ROBOTICS Logo가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Lockup의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | 접근성 이름. @default "LK ROBOTICS" |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `'mark' \| 'stacked' \| 'inline'` | No | 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" |
| `tone` | `'ink' \| 'white' \| 'brand' \| 'current'` | No | 채움 프리셋 — 'ink' 네이비 · 'white' · 'brand' 시그널 잉크 · 'current'(currentColor). @default "ink" |
| `color` | `string` | No | 명시적 채움, tone을 재정의. |
| `height` | `number` | No | 렌더 픽셀 높이. @default 32 mark / 64 stacked / 28 inline |
| `title` | `string` | No | 접근성 이름. @default "LK ROBOTICS" |
| `decorative` | `boolean` | No | 이미지가 아니라 장식으로 표시(aria-hidden). @default false |
| `as` | `React.ElementType` | No | 렌더할 요소. @default "div" |
| `tone` | `'signal' \| 'ink' \| 'muted'` | No | 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" |
| `onDark` | `boolean` | No | 다크 서피스용 색상 사용(라이트 테마 안에서). @default false |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| variant | 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" 타입 계약: 'mark' \| 'stacked' \| 'inline' |
| tone | 채움 프리셋 — 'ink' 네이비 · 'white' · 'brand' 시그널 잉크 · 'current'(currentColor). @default "ink" 타입 계약: 'ink' \| 'white' \| 'brand' \| 'current' |
| tone | 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" 타입 계약: 'signal' \| 'ink' \| 'muted' |

## Behavior and interaction

- Lockup의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Lockup는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-inverse-label-neutral-soft | light: rgba(255, 255, 255, 0.62); dark: rgba(255, 255, 255, 0.62) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-label-strong | light: #000000; dark: #FFFFFF |

## Responsive

- LK ROBOTICS 로고. 에셋 파일 없이 자체 완결형 SVG입니다. variant는 mark/stacked/inline, tone은 ink/white/brand/current, 크기는 height로 지정합니다. 구성(마크·워드마크 비율)은 원본 트레이스 에셋(assets/brand/lk-logo-.svg)과 동일하게 고정 — 워드마크를 임의로 확대/재배치하지 마세요.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 사용자에게 보이는 LK ROBOTICS Logo 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | LK ROBOTICS 로고. 에셋 파일 없이 자체 완결형 SVG입니다. variant는 mark/stacked/inline, tone은 ink/white/brand/current, 크기는 height로 지정합니다. 구성(마크·워드마크 비율)은 원본 트레이스 에셋(assets/brand/lk-logo-.svg)과 동일하게 고정 — 워드마크를 임의로 확대/재배치하지 마세요. |
| Don't | LK ROBOTICS Logo가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | LK ROBOTICS Logo가 소유하는 Brand 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Lockup의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Overline` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |

## Examples

### 기본 조합

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fs-caption`
- `--fw-bold`
- `--ls-overline`

### Source contracts

- `components/brand/Lockup.jsx`
- `components/brand/Lockup.d.ts`
- `components/brand/Lockup.prompt.md`
- `components/content/Overline.jsx`
- `components/content/Overline.d.ts`
- `components/content/Overline.prompt.md`
- `stories/Brand.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Lockup prompt contract: `components/brand/Lockup.prompt.md`
- Storybook implementation evidence: `stories/Brand.stories.jsx`
