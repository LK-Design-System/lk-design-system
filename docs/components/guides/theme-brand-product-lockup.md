# Product Lockup

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Brand |
| Owner | `ProductLockup` |
| Storybook | `LDS Theme/Brand/Product Lockup` |
| Source | `../component-content.json#theme-brand-product-lockup` |

LK mark는 그대로 두고 제품명을 Montserrat SemiBold 600 outline으로 낮춥니다. 제품명 visible height 1X와 mark visible 폭의 0.35 간격은 유지해 Portal의 리듬을 계승하면서 LK가 먼저 읽히게 합니다.

## 사용 판단

### 사용

- expanded TopBar·SideNav의 단일 제품 식별자에는 ProductLockup을 사용합니다.
- 출력은 하나의 SVG와 outline path만 사용하며 나 런타임 Montserrat 의존성이 없습니다.

### 사용하지 않음

- product는 현재 console과 portal만 승인되어 있습니다. Web Viz·Control은 공식 짧은 제품명 승인과 registry 등록 전까지 임의 조판하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| aria-label | 독립 사용 시 기본 이름 LK {registered label}을 문맥에 맞게 덮습니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `product` | `ProductLockupProduct` | Yes | 브랜드 승인을 거쳐 outline registry에 등록된 제품 key. |
| `appearance` | `'positive' \| 'reverse'` | No | 밝은 단색 배경의 공식 네이비 또는 어두운 단색 배경의 반전 화이트. @default "positive" |
| `height` | `number` | No | 전체 SVG의 자연 높이. 20px 미만은 20px로 보정됩니다. @default 28 |
| `compact` | `boolean` | No | 제품 워드마크를 생략하고 LK mark만 표시합니다. 접근성 이름은 유지됩니다. @default false |
| `aria-label` | `string` | No | 독립 사용 시 기본 이름 LK {registered label}을 문맥에 맞게 덮습니다. |
| `decorative` | `boolean` | No | 이름을 소유한 링크·컨트롤 안에서 중복 낭독을 막습니다. @default false |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 제품 워드마크: Montserrat SemiBold 600 v7.222의 outline path |
| 명시 규칙 2 | 표기: 대문자, 기본 kerning, 추가 자간 0, 가로·세로 변형과 수동 glyph 수정 없음 |
| 명시 규칙 3 | visible gap: LK mark visible 폭의 0.35. 이는 0.35X가 아니며, mark 폭이 1.08176X라 실제 간격은 0.378616X입니다. |
| 명시 규칙 4 | 전체 SVG 최소 높이 20px, 기본 높이 28px |

## Responsive

- 제품명 visible ink 높이: LK mark visible 높이 1X.
- height={20}에서 visible X 약 17.506px, mark 폭 약 18.938px, visual gap 약 6.628px.
- full lockup을 줄바꿈·말줄임·비균등 축소하지 않습니다. 폭이 부족하면 제품 셸이 자신의 breakpoint에서 compact로 전환합니다. SideNav rail은 compact, expanded SideNav와 일반 TopBar는 full이 기본입니다. 링크·route·click·breakpoint·tooltip은 제품 셸이 소유합니다.

## Content and writing

- TopBar·SideNav에서 LK + 제품명을 LK 모브랜드 우선 로고 문법으로 표시하는 제품 셸 lockup입니다. 기존 LK Portal의 대문자·1X·간격 리듬을 계승하되 제품명은 SemiBold 600으로 낮춰 LK가 먼저 읽힙니다. 자유 텍스트를 옆에 붙이는 컴포넌트가 아니라, 브랜드 승인을 거쳐 registry에 등록된 제품 워드마크만 outline SVG로 렌더합니다.
- 새 제품은 assets/brand/lk-product-lockups.json에 승인 key·canonical label·대문자 wordmark·golden glyph metric을 등록하고 node scripts/generate-product-lockups.mjs로 path를 생성합니다. 생성기는 pinned font와 license hash, glyph IDs, kerning origins, ink bounds를 검증합니다.
- 제품별 화면에서 문자열, 폰트, 간격을 직접 바꾸거나 미등록 key를 우회하지 않습니다. 표시용 한국어 설명, 환경·버전·workspace·상태·tagline은 lockup 밖의 UI text로 둡니다.

## Accessibility

- 독립 사용은 하나의 role="img"와 registry label 기반 이름 LK Console 또는 LK Portal을 제공합니다. compact도 같은 이름을 유지합니다. 이름을 소유한 링크·버튼 안에서는 decorative로 중복 낭독을 막습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Lockup` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ProductLockup product="console" />
<ProductLockup product="portal" appearance="reverse" height={20} />
<ProductLockup product="console" compact />
```

### 추가 조합 2

```jsx
<a href="/" aria-label="LK Console 홈">
  <ProductLockup product="console" decorative />
</a>
```

## Tokens and API

### Source contracts

- `components/brand/ProductLockup.jsx`
- `components/brand/ProductLockup.d.ts`
- `components/brand/ProductLockup.prompt.md`
- `stories/BrandProductLockup.stories.jsx`

## Sources

- ProductLockup prompt contract: `components/brand/ProductLockup.prompt.md`
- Storybook implementation evidence: `stories/BrandProductLockup.stories.jsx`
