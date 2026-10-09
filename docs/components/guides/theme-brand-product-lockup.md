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
- full lockup을 줄바꿈·말줄임·비균등 축소하지 않습니다. 폭이 부족하면 제품 셸이 자신의 breakpoint에서 compact로 전환합니다. SideNav rail은 compact, expanded SideNav와 일반 TopBar는 full이 기본입니다. 링크·route·click·breakpoint·tooltip은 제품 셸이 소유합니다.
- compact와 full은 서로 다른 로고를 교체하지 않습니다. 같은 SVG·같은 LK path를 유지하고 왼쪽에 고정한 viewport 폭만 전환해, 접힐 때는 제품명 영역을 가리고 펼칠 때는 오른쪽으로 다시 드러냅니다. 그래서 LK mark의 위치·크기·DOM identity가 전환 중에도 바뀌지 않습니다. 폭 전환은 --dur-base와 --ease-out을 사용하며 prefers-reduced-motion: reduce에서는 즉시 완료합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| aria-label | 독립 사용 시 기본 이름(mark 형 LK {label}, 회사 보증 형 LK ROBOTICS {label})을 문맥에 맞게 덮습니다. |
| endorsement | 회사 inline 로크업(LK ROBOTICS) 뒤에 승인 제품명을 붙인 회사 보증 형. 홈 hero·로그인 같은 넓은 첫인상 표면용입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `appearance` | `'positive' \| 'reverse'` | No | 밝은 단색 배경의 공식 네이비 또는 어두운 단색 배경의 반전 화이트. @default "positive" |
| `height` | `number` | No | 전체 SVG의 자연 높이. 20px 미만은 20px로 보정됩니다. @default 28 |
| `aria-label` | `string` | No | 독립 사용 시 기본 이름(mark 형 LK {label}, 회사 보증 형 LK ROBOTICS {label})을 문맥에 맞게 덮습니다. |
| `decorative` | `boolean` | No | 이름을 소유한 링크·컨트롤 안에서 중복 낭독을 막습니다. @default false |
| `product` | `ProductLockupProduct` | Yes | 브랜드 승인을 거쳐 outline registry에 등록된 제품 key. |
| `endorsement` | `'mark'` | No | LK mark를 모브랜드로 우선하는 제품 셸 형태. @default "mark" |
| `compact` | `boolean` | No | 같은 SVG에서 제품 워드마크 영역을 접어 LK mark만 표시합니다. 접근성 이름은 유지됩니다. @default false |
| `product` | `ProductLockupCompanyProduct` | Yes | 회사 보증 형이 승인된 registry key. |
| `endorsement` | `'company'` | Yes | 회사 inline 로크업(LK ROBOTICS) 뒤에 승인 제품명을 붙인 회사 보증 형. 홈 hero·로그인 같은 넓은 첫인상 표면용입니다. |
| `compact` | `false` | No | 회사 보증 형은 compact가 없습니다. 좁은 슬롯은 Lockup variant="inline"이나 "mark"로 전환합니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 제품 워드마크: Montserrat SemiBold 600 v7.222의 outline path |
| 명시 규칙 2 | 표기: 대문자, 기본 kerning, 추가 자간 0, 가로·세로 변형과 수동 glyph 수정 없음 |
| 명시 규칙 3 | visible gap: LK mark visible 폭의 0.35. 이는 0.35X가 아니며, mark 폭이 1.08176X라 실제 간격은 0.378616X입니다. |
| 명시 규칙 4 | 전체 SVG 최소 높이 20px, 기본 높이 28px |

## Responsive

- 홈 hero·로그인처럼 넓은 첫인상 표면에서 회사가 앞서는 「LK ROBOTICS Portal」이 필요하면 endorsement="company"(회사 보증 형)를 씁니다. 현재 portal만 승인되어 있습니다. 같은 화면에 mark 형과 회사 보증 형을 함께 두지 않고, 셸의 좁은 브랜드 슬롯(SideNav 머리·TopBar·Drawer)은 회사 Lockup variant="inline", 접힌 rail은 Lockup variant="mark"를 씁니다.
- 제품명 visible ink 높이: LK mark visible 높이 1X.
- height={20}에서 visible X 약 17.506px, mark 폭 약 18.938px, visual gap 약 6.628px.
- 제품명 크기: 대문자 높이 = ROBOTICS 대문자 높이(0.966851X). 두 글꼴 모두 cap 700/UPM 1000이라 배율이 inline과 같습니다. 소문자 l의 어센더는 cap보다 0.041X 솟지만 inline 세로 프레임(padding 4) 안에 듭니다. 잉크 높이로 배율을 정하지 않습니다.

## Content and writing

- 회사 단위: Lockup variant="inline"과 같은 ROBOTICSINLINEPATHS·ROBOTICSINLINETRANSFORM. 생성기가 같은 helper(scripts/brand/inline-construction.mjs)로 다시 계산해 동일성을 검증합니다.
- TopBar·SideNav에서 LK + 제품명을 LK 모브랜드 우선 로고 문법으로 표시하는 제품 셸 lockup입니다. 기존 LK Portal의 대문자·1X·간격 리듬을 계승하되 제품명은 SemiBold 600으로 낮춰 LK가 먼저 읽힙니다. 자유 텍스트를 옆에 붙이는 컴포넌트가 아니라, 브랜드 승인을 거쳐 registry에 등록된 제품 워드마크만 outline SVG로 렌더합니다.
- 외부 근거: Atlassian logos의 property logo(회사 logomark·wordmark 뒤 property 이름, 「회사 + 이름」 alt, 호출부 조합 금지. 이름만 neutral 색으로 두는 방식은 LK 승인 색 밖이라 채택하지 않음), Red Hat product logos·universal logos(회사 로고 먼저·full 제품명, custom text lockup 금지), GOV.UK brand hierarchy(wordmark와 이름 사이 간격을 wordmark 자체 기하로 정의 → mark 폭 0.35배 재사용), W3C Images…
- 등록 절차의 정본은 docs/brand/LKPRODUCTLOCKUPSTANDARD.md 9장입니다. 제품 팀이 제출할 항목과 승인자는 9.1, 등록 전 임시 사용 규칙은 9.2에 있습니다. 보이는 wordmark는 pinned Montserrat SemiBold에서 outline을 뽑으므로 ASCII 대문자 A–Z와 공백만 등록할 수 있습니다 — 한글 제품명은 승인된 로마자 표기를 먼저 확정해야 합니다.

## Accessibility

- 접근성: 기본 이름은 보이는 글과 같은 LK ROBOTICS {label}입니다. 링크 안에서는 decorative로 두고 링크가 LK ROBOTICS Portal 홈처럼 목적지를 포함한 이름을 가집니다. h1 안에서는 장식으로 숨기지 않거나 heading 이름을 보이는 글과 같게 둡니다.
- 독립 사용은 하나의 role="img"와 registry label 기반 이름 LK Console 또는 LK Portal(회사 보증 형은 LK ROBOTICS Portal)을 제공합니다. compact도 같은 이름을 유지합니다. 이름을 소유한 링크·버튼 안에서는 decorative로 중복 낭독을 막습니다.
- 동작 근거는 Apple HIG Design principles의 일관되고 예측 가능한 위치·자연스러운 전환 원칙과 Apple HIG Tab bars의 symbol 유지·label reveal 패턴을 따릅니다. 모션 비활성화는 WCAG Technique C39의 prefers-reduced-motion 계약을 적용합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
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
<ProductLockup product="portal" endorsement="company" height={32} />
<ProductLockup product="portal" endorsement="company" appearance="reverse" />
```

## Tokens and API

### Tokens

- `--dur-base`
- `--ease-out`

### Source contracts

- `components/brand/ProductLockup.jsx`
- `components/brand/ProductLockup.d.ts`
- `components/brand/ProductLockup.prompt.md`
- `stories/BrandProductLockup.stories.jsx`

## Sources

- ProductLockup prompt contract: `components/brand/ProductLockup.prompt.md`
- Storybook implementation evidence: `stories/BrandProductLockup.stories.jsx`
- [Atlassian logos](https://atlassian.design/foundations/logos)
- [Red Hat product logos](https://www.redhat.com/en/about/brand/standards/product-logos)
- [universal logos](https://www.redhat.com/en/about/brand/standards/universal-logos)
- [GOV.UK brand hierarchy](https://brand.design-system.service.gov.uk/logo-system/brand-hierarchy)
- [W3C Images of text](https://www.w3.org/WAI/tutorials/images/textual/)
- [Apple HIG Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)
- [Apple HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [WCAG Technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
