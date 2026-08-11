# ProductLockup

TopBar·SideNav에서 `LK + 제품명`을 **LK 모브랜드 우선 로고 문법**으로 표시하는 제품 셸 lockup입니다. 기존 LK Portal의 대문자·1X·간격 리듬을 계승하되 제품명은 SemiBold 600으로 낮춰 LK가 먼저 읽힙니다. 자유 텍스트를 옆에 붙이는 컴포넌트가 아니라, 브랜드 승인을 거쳐 registry에 등록된 제품 워드마크만 outline SVG로 렌더합니다.

## 선택

- expanded TopBar·SideNav의 단일 제품 식별자에는 `ProductLockup`을 사용합니다.
- 회사 식별 `LK ROBOTICS`와 고정 `LK Portal` 호환 자산은 `Lockup`을 유지합니다.
- `product`는 현재 `console`과 `portal`만 승인되어 있습니다. Web Viz·Control은 공식 짧은 제품명 승인과 registry 등록 전까지 임의 조판하지 않습니다.
- 법인·파트너·마케팅용 새로운 공식 자산 export는 별도 브랜드 승인 절차가 필요합니다.

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

## 반응형과 조합

full lockup을 줄바꿈·말줄임·비균등 축소하지 않습니다. 폭이 부족하면 제품 셸이 자신의 breakpoint에서 `compact`로 전환합니다. SideNav rail은 compact, expanded SideNav와 일반 TopBar는 full이 기본입니다. 링크·route·click·breakpoint·tooltip은 제품 셸이 소유합니다.

```jsx
<a href="/" aria-label="LK Console 홈">
  <ProductLockup product="console" decorative />
</a>
```

독립 사용은 하나의 `role="img"`와 registry label 기반 이름 `LK Console` 또는 `LK Portal`을 제공합니다. `compact`도 같은 이름을 유지합니다. 이름을 소유한 링크·버튼 안에서는 `decorative`로 중복 낭독을 막습니다.

## Registry와 승인

새 제품은 `assets/brand/lk-product-lockups.json`에 승인 key·canonical label·대문자 wordmark·golden glyph metric을 등록하고 `node scripts/generate-product-lockups.mjs`로 path를 생성합니다. 생성기는 pinned font와 license hash, glyph IDs, kerning origins, ink bounds를 검증합니다. `product="portal"`도 새 모브랜드 우선 SemiBold 규격을 따르며, ExtraBold 800인 기존 `Lockup variant="portal"`은 비교·호환용 고정 자산으로 별도 보존합니다.

제품별 화면에서 문자열, 폰트, 간격을 직접 바꾸거나 미등록 key를 우회하지 않습니다. 표시용 한국어 설명, 환경·버전·workspace·상태·tagline은 lockup 밖의 UI text로 둡니다.

전체 운영 규정은 `docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md`를 따릅니다.
