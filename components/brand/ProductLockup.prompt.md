# ProductLockup

TopBar·SideNav에서 `LK + 제품명`을 **LK 모브랜드 우선 로고 문법**으로 표시하는 제품 셸 lockup입니다. 기존 LK Portal의 대문자·1X·간격 리듬을 계승하되 제품명은 SemiBold 600으로 낮춰 LK가 먼저 읽힙니다. 자유 텍스트를 옆에 붙이는 컴포넌트가 아니라, 브랜드 승인을 거쳐 registry에 등록된 제품 워드마크만 outline SVG로 렌더합니다.

## 선택

- expanded TopBar·SideNav의 단일 제품 식별자에는 `ProductLockup`을 사용합니다.
- 회사 식별 `LK ROBOTICS`와 고정 `LK Portal` 정본은 `Lockup`을 유지합니다. 고정 Portal은 registry Portal과 같은 조형입니다.
- `product`는 현재 `console`과 `portal`만 승인되어 있습니다. Web Viz·Control은 공식 짧은 제품명 승인과 registry 등록 전까지 임의 조판하지 않습니다.
- 법인·파트너·마케팅용 새로운 공식 자산 export는 별도 브랜드 승인 절차가 필요합니다.
- 홈 hero·로그인처럼 넓은 첫인상 표면에서 회사가 앞서는 「LK ROBOTICS Portal」이 필요하면 `endorsement="company"`(회사 보증 형)를 씁니다. 현재 `portal`만 승인되어 있습니다. 같은 화면에 mark 형과 회사 보증 형을 함께 두지 않고, 셸의 좁은 브랜드 슬롯(SideNav 머리·TopBar·Drawer)은 회사 `Lockup variant="inline"`, 접힌 rail은 `Lockup variant="mark"`를 씁니다.

## 모브랜드 우선 작도

- 제품 워드마크: Montserrat SemiBold 600 v7.222의 outline path
- 표기: 대문자, 기본 kerning, 추가 자간 `0`, 가로·세로 변형과 수동 glyph 수정 없음
- 제품명 visible ink 높이: LK mark visible 높이 `1X`
- visible gap: LK mark **visible 폭의 `0.35`**. 이는 `0.35X`가 아니며, mark 폭이 `1.08176X`라 실제 간격은 `0.378616X`입니다.
- 전체 SVG 최소 높이 `20px`, 기본 높이 `28px`
- `height={20}`에서 visible X 약 `17.506px`, mark 폭 약 `18.938px`, visual gap 약 `6.628px`
- 출력은 하나의 SVG와 outline path만 사용하며 `<text>`나 런타임 Montserrat 의존성이 없습니다.

```jsx
<ProductLockup product="console" />
<ProductLockup product="portal" appearance="reverse" height={20} />
<ProductLockup product="console" compact />
```

## 회사 보증 형 (`endorsement="company"`)

회사 inline 로크업(`LK` + Montserrat Bold 700 `ROBOTICS`)을 바꾸지 않고, 그 뒤에 승인 제품명을 **canonical 대소문자**(예: `Portal`) Pretendard SemiBold 600 v1.3.9 outline으로 붙인 회사 보증 형입니다. 제품명 글꼴은 LDS UI 타이포그래피와 같은 Pretendard이며(owner 결정 2026-10-09), mark 형(「LK PORTAL」)은 Montserrat SemiBold 600 그대로입니다. 2026-10-09 owner가 family 추가와 「Portal」 표기를 승인했습니다(제품 로크업 표준 1.4.0, 로고 표준 4.1.0, registry constructionVersion 3).

- 회사 단위: `Lockup variant="inline"`과 같은 `ROBOTICS_INLINE_PATHS`·`ROBOTICS_INLINE_TRANSFORM`. 생성기가 같은 helper(`scripts/brand/inline-construction.mjs`)로 다시 계산해 동일성을 검증합니다.
- 제품명 원본: `vendor/pretendard-v1.309/Pretendard-SemiBold.woff2`(UI 글꼴 `assets/fonts/Pretendard-SemiBold.woff2`와 같은 바이트). 생성기는 fontkit `layout(text, { kern: true })`로 배치하고 `.notdef`·누락 글리프를 거부하며 golden glyph id·origin·잉크 bounds·advance를 검증합니다.
- 제품명 크기: 대문자 높이 = `ROBOTICS` 대문자 높이(`0.966851X`). 배율은 두 글꼴의 OS/2 cap height(Montserrat 700/UPM 1000, Pretendard 1448/UPM 2048)로 맞춥니다. Pretendard의 소문자 `l`은 cap과 같은 높이라 inline 세로 프레임(padding 4) 안에 듭니다. 잉크 높이로 배율을 정하지 않습니다.
- baseline: `ROBOTICS`와 공유합니다.
- 간격: `ROBOTICS` 잉크 끝에서 제품명 잉크 시작까지 LK mark 보이는 폭의 `0.35`배(`0.378616X`). LK–ROBOTICS 간격(`0.25`배)보다 넓어 회사 단위와 제품명이 구분됩니다.
- 세로 프레임: inline과 같은 viewBox 높이라 같은 `height`에서 X가 같습니다. Portal 결과는 `viewBox 342.60933 149.18987 724.266225 64.1628`, 제품명 transform `matrix(0.037501 0 0 0.037501 856.134058 208.421795)`입니다.
- 크기: 기본 `28px`, 최소 `20px`(20px에서 최소 슬롯 폭 `225.758921px`). 시작 화면은 28px 이상을 권장합니다.
- 축소: `preserveAspectRatio="xMidYMid meet"`와 `max-width:100%; height:auto`로 비례 축소만 합니다. crop·wrap·말줄임·compact가 없고, `compact`를 함께 넘기면 TypeError입니다. 슬롯이 최소 폭보다 좁으면 셸이 회사 `Lockup inline`이나 `mark`로 전환합니다.
- 색: positive 전체 `#05132B`, reverse 전체 `#FFFFFF`. 제품명만 다른 색으로 두지 않습니다.
- 접근성: 기본 이름은 보이는 글과 같은 `LK ROBOTICS {label}`입니다. 링크 안에서는 `decorative`로 두고 링크가 `LK ROBOTICS Portal 홈`처럼 목적지를 포함한 이름을 가집니다. `h1` 안에서는 장식으로 숨기지 않거나 heading 이름을 보이는 글과 같게 둡니다.
- motion: 없음. 호스트 등장 motion을 로고에 걸지 않습니다.
- 루트 자산 `assets/brand/lk-lockup-company-portal-{navy,white}.svg`를 함께 생성합니다. platform manifest에는 넣지 않습니다.
- 한글 제품명(「포털」)은 Montserrat에 글리프가 없어 이번 범위가 아닙니다. 등록하려면 Pretendard SemiBold를 pin하는 별도 개정이 필요합니다.

```jsx
<ProductLockup product="portal" endorsement="company" height={32} />
<ProductLockup product="portal" endorsement="company" appearance="reverse" />
```

외부 근거: [Atlassian logos](https://atlassian.design/foundations/logos)의 property logo(회사 logomark·wordmark 뒤 property 이름, 「회사 + 이름」 alt, 호출부 조합 금지. 이름만 neutral 색으로 두는 방식은 LK 승인 색 밖이라 채택하지 않음), [Red Hat product logos](https://www.redhat.com/en/about/brand/standards/product-logos)·[universal logos](https://www.redhat.com/en/about/brand/standards/universal-logos)(회사 로고 먼저·full 제품명, custom text lockup 금지), [GOV.UK brand hierarchy](https://brand.design-system.service.gov.uk/logo-system/brand-hierarchy)(wordmark와 이름 사이 간격을 wordmark 자체 기하로 정의 → mark 폭 `0.35`배 재사용), [W3C Images of text](https://www.w3.org/WAI/tutorials/images/textual/)(logo 대체 텍스트 = 보이는 글).

## 반응형과 조합

full lockup을 줄바꿈·말줄임·비균등 축소하지 않습니다. 폭이 부족하면 제품 셸이 자신의 breakpoint에서 `compact`로 전환합니다. SideNav rail은 compact, expanded SideNav와 일반 TopBar는 full이 기본입니다. 링크·route·click·breakpoint·tooltip은 제품 셸이 소유합니다.

`compact`와 full은 서로 다른 로고를 교체하지 않습니다. 같은 SVG·같은 LK path를 유지하고 왼쪽에 고정한 viewport 폭만 전환해, 접힐 때는 제품명 영역을 가리고 펼칠 때는 오른쪽으로 다시 드러냅니다. 그래서 LK mark의 위치·크기·DOM identity가 전환 중에도 바뀌지 않습니다. 폭 전환은 `--dur-base`와 `--ease-out`을 사용하며 `prefers-reduced-motion: reduce`에서는 즉시 완료합니다.

```jsx
<a href="/" aria-label="LK Console 홈">
  <ProductLockup product="console" decorative />
</a>
```

독립 사용은 하나의 `role="img"`와 registry label 기반 이름 `LK Console` 또는 `LK Portal`(회사 보증 형은 `LK ROBOTICS Portal`)을 제공합니다. `compact`도 같은 이름을 유지합니다. 이름을 소유한 링크·버튼 안에서는 `decorative`로 중복 낭독을 막습니다.

## Registry와 승인

등록 절차의 정본은 [`docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md`](../../docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md) 9장입니다. 제품 팀이 제출할 항목과 승인자는 9.1, 등록 전 임시 사용 규칙은 9.2에 있습니다. 보이는 wordmark는 pinned Montserrat SemiBold에서 outline을 뽑으므로 **ASCII 대문자 A–Z와 공백만** 등록할 수 있습니다 — 한글 제품명은 승인된 로마자 표기를 먼저 확정해야 합니다. 승인 후 `assets/brand/lk-product-lockups.json`에 승인 key·canonical label·대문자 wordmark·golden glyph metric을 등록하고 `node scripts/generate-product-lockups.mjs`로 path를 생성합니다. 생성기는 pinned font와 license hash, glyph IDs, kerning origins, ink bounds를 검증합니다. `product="portal"`과 고정 `Lockup variant="portal"`은 같은 SemiBold 600 path·transform·viewBox를 사용하며 생성 단계에서 동등성을 검증합니다.

제품별 화면에서 문자열, 폰트, 간격을 직접 바꾸거나 미등록 key를 우회하지 않습니다. 표시용 한국어 설명, 환경·버전·workspace·상태·tagline은 lockup 밖의 UI text로 둡니다.

전체 운영 규정은 `docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md`를 따릅니다.

동작 근거는 [Apple HIG Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)의 일관되고 예측 가능한 위치·자연스러운 전환 원칙과 [Apple HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)의 symbol 유지·label reveal 패턴을 따릅니다. 모션 비활성화는 [WCAG Technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)의 `prefers-reduced-motion` 계약을 적용합니다.
