# LK 제품 로크업 표준 v1.4

| Field | Value |
| --- | --- |
| Type | Approved product-lockup registry standard |
| Status | Current |
| Owner | Brand owner · Design system owner · Product naming owner |
| Last reviewed | 2026-10-09 |
| Standard version | 1.4.0 |
| Registry source | [`../../assets/brand/lk-product-lockups.json`](../../assets/brand/lk-product-lockups.json) |
| Runtime | [`../../components/brand/ProductLockup.jsx`](../../components/brand/ProductLockup.jsx) |

이 표준은 LK Portal에서 사용하던 **대문자·1X·간격 리듬**을 계승하면서, LK mark가 제품명보다 먼저 읽히는 모브랜드 우선 위계를 적용합니다. `ProductLockup`은 임의 문자열을 조판하는 컴포넌트가 아니라, 제품별로 검증된 SVG outline만 제공하는 승인 registry입니다. 따라서 제품 UI가 Montserrat를 설치하거나 제품명을 runtime `<text>`로 그리지 않습니다.

제품 로크업은 두 형태가 있습니다. **mark 형**(`LK` mark + 대문자 제품명, 예: 「LK PORTAL」)은 제품 셸의 좁은 브랜드 슬롯에 씁니다. **회사 보증 형**(회사 inline 워드마크 `LK ROBOTICS` + 제품명, 예: 「LK ROBOTICS Portal」)은 시작 화면처럼 넓은 첫인상 표면에 씁니다. 두 형태 모두 같은 승인 registry의 outline만 렌더하며 호출부에서 조합하지 않습니다.

## 1. `Lockup`과 `ProductLockup`의 경계

| 체계 | 구성 | 사용 | 변경 권한 |
| --- | --- | --- | --- |
| 회사 `Lockup` | 승인된 LK mark·`LK ROBOTICS`·법인명 SVG/path | 회사·법인 식별, 마케팅, 파트너, 외부 배포 | 회사 logo construction·version·hash·승인 절차 |
| `Lockup variant="portal"` | SemiBold 600 `LK Portal` 고정 SVG/path | 기존 통합과 고정 Portal 정본 | public API와 Portal 정본 생성 규칙 |
| `ProductLockup` | LK mark + registry에 승인된 SemiBold 600 제품명 outline | TopBar·SideNav 등 제품 셸의 모브랜드 우선 식별 | 제품 lockup registry·outline·hash·승인 절차 |
| `ProductLockup endorsement="company"` | 회사 inline 로크업(`LK` + Bold 700 `ROBOTICS`, 변경 없음) + registry에 승인된 SemiBold 600 제품명 outline(canonical label 대소문자) | 홈 hero·로그인 등 넓은 첫인상 표면의 회사 보증 제품 식별 | 같은 registry의 `company` 항목·outline·hash·승인 절차 |

일반 제품 셸은 `ProductLockup`을 사용합니다. 기존 통합을 위한 `Lockup variant="portal"` 공개 API는 유지하되, 그 고정 Portal 정본도 SemiBold 600으로 갱신해 `ProductLockup product="portal"`과 path·transform·viewBox를 동기화합니다. 두 API 모두 font text를 LK mark 옆에 즉석으로 붙이는 자유 조합이 아닙니다.

## 2. 승인 registry

| Registry key | Canonical name | mark 형 outline | 회사 보증 형 outline | 상태 |
| --- | --- | --- | --- | --- |
| `console` | `Console` | `CONSOLE` | — (미등록) | mark 형 지원 |
| `portal` | `Portal` | `PORTAL` | `Portal` | 두 형태 지원; mark 형은 고정 `Lockup variant="portal"`과 같은 SemiBold 600 정본 |
| — (`Web Viz` 후보) | 미확정 | 미확정 | — | 승인 이름·outline이 없어 지원하지 않음 |
| — (`Control` 후보) | 미확정 | 미확정 | — | 승인 이름·outline이 없어 지원하지 않음 |
| — (궁릉순찰로봇 관제 후보) | 미확정 | 미확정 | — | 승인 로마자 이름이 없어 지원하지 않음. 제품명이 한글이므로 9.1의 ASCII 제약에 따라 승인된 로마자 표기 확정이 선행 조건 |

public API는 `product: "console" | "portal"`의 닫힌 union만 허용하며, `endorsement="company"`는 회사 보증 형이 승인된 key(현재 `portal`)만 받습니다. `Web Viz`, `Control`, 고객명이나 임의 문자열을 전달하는 fallback은 없습니다. 보이는 대문자와 접근성 이름은 registry가 함께 소유하므로 호출부가 각각 다시 만들지 않습니다.

## 3. 작도와 수치

`X`는 padding이나 SVG `viewBox`가 아니라 LK mark path의 **보이는 높이**입니다. LK mark의 보이는 폭은 `1.08176X`입니다.

| 항목 | 표준 |
| --- | --- |
| LK mark | 회사 `Lockup`과 같은 geometry v1.0 path |
| 제품명 원본 | Montserrat SemiBold 600 v7.222, 대문자, 기본 kerning, 추가 자간 `0` |
| 제품명 크기 | 제품명 outline의 보이는 높이 `1X` |
| 내부 visual gap | `0.35 × LK mark의 보이는 폭` = 약 `0.378616X` |
| 정렬 | mark와 제품명 outline의 보이는 bounds를 기준으로 세로 정렬 |
| scale | 수평·수직 `1:1`; glyph 수동 수정·condense·stretch 금지 |
| 배포 | 단일 SVG의 outline path; `<text>`와 runtime font 의존성 없음 |
| 전체 렌더 높이 | 최소 `20px`, 기본 `28px` |

내부 간격은 **`0.35X`가 아닙니다.** mark의 보이는 폭에 `0.35`를 곱합니다. LK mark 폭이 `1.08176X`이므로 높이 기준으로 환산한 간격은 약 `0.378616X`입니다.

제품명은 한 줄의 완성된 SemiBold outline입니다. LK mark 도형은 바꾸지 않고 제품명 획만 낮춰 모브랜드가 먼저 읽히게 합니다. 줄바꿈, 말줄임, crop, 글자별 이동, 별도 letter spacing, 비균일 scale로 폭을 맞추지 않습니다. registry 결과의 path·transform·visible bounds·viewBox·hash를 생성 결과로 검증합니다.

### 3.1 회사 보증 형 작도

| 항목 | 표준 |
| --- | --- |
| 회사 단위 | 회사 `Lockup variant="inline"`과 같은 path·transform(LK mark + Montserrat Bold 700 `ROBOTICS`). 재작도·재배치 금지 |
| 제품명 원본 | mark 형과 같은 Montserrat SemiBold 600 v7.222, 기본 kerning, 추가 자간 `0` |
| 표기 | canonical name과 같은 대소문자(예: `Portal`). ASCII 글자와 단어 사이 공백 하나. 각 단어는 대문자로 시작 |
| 제품명 크기 | 제품명 cap height = `ROBOTICS` cap height(`0.966851X`). 소문자 어센더는 이를 넘을 수 있음 |
| baseline | `ROBOTICS`와 같은 baseline |
| 간격 | `ROBOTICS` 잉크 끝에서 제품명 잉크 시작까지 `0.525 × LK mark의 보이는 폭`(약 `0.567924X`). 「ROBOTICS Portal」을 글자로 조판했을 때의 잉크 간격(약 `0.550X`)에 맞춘 값으로, 제품명이 회사명 뒤의 별도 단어로 읽힘(owner 결정 2026-10-09). mark 형의 `0.35배`·LK–ROBOTICS `0.25배`와 별도 값이며, generator는 LK–ROBOTICS 간격보다 넓은지 검증 |
| 세로 프레임 | inline과 같은 viewBox 높이. 렌더 `height`가 같으면 X가 같음 |
| 전체 렌더 높이 | 최소 `20px`, 기본 `28px`. 시작 화면 권장 `28px` 이상 |
| 축소 | 비례 축소만. crop·wrap·말줄임·compact 없음. full 폭(20px에서 약 `237.24px`)을 확보할 수 없으면 셸이 회사 `Lockup inline` 또는 `mark`로 전환 |
| 색 | mark 형과 같음(positive navy / reverse white, 단색). 제품명만 다른 색으로 두지 않음 |

Portal 회사 보증 형의 생성 결과는 `viewBox 342.60933 149.18987 761.091156 64.1628`, 제품명 transform `matrix(0.077573 0 0 0.077573 864.499368 208.421795)`, 최소 슬롯 폭 `237.237513`(보이는 폭 약 `13.409X`)이며, generator가 회사 단위와 `ROBOTICS_INLINE_*`의 동일성, path·transform·viewBox, 잉크의 세로 프레임 포함 여부를 검증합니다. 루트 자산 `assets/brand/lk-lockup-company-portal-navy.svg`·`-white.svg`도 같은 generator가 만들며 platform manifest에는 넣지 않습니다.

## 4. Runtime API

```jsx
<ProductLockup product="console" appearance="positive" />
<ProductLockup product="portal" appearance="reverse" height={20} />
<ProductLockup product="console" compact />
<ProductLockup product="portal" endorsement="company" height={32} />
```

- `product`: 필수 registry key. 현재 `console | portal`만 지원합니다.
- `appearance`: `positive | reverse`. 밝은 단색 배경에는 `positive`, 공식 네이비나 충분히 어두운 단색 배경에는 `reverse`를 사용합니다.
- `height`: 전체 SVG의 자연 렌더 높이입니다. 기본 `28`, 최소 `20`이며 더 작은 값은 최소값으로 보정합니다.
- `compact`: 같은 SVG의 viewport를 LK mark 폭으로 접어 제품명 outline을 시각적으로 가립니다. 접근성 이름은 full과 같습니다.
- `decorative`: 이름을 소유한 링크·컨트롤 안에서 중복 낭독을 막습니다.
- `aria-label`: 독립 instance의 기본 `LK {canonical name}`을 문맥상 더 구체적으로 써야 할 때만 덮습니다.
- `endorsement`: `mark | company`. 기본 `mark`. `company`는 회사 보증 형이며 `compact`와 함께 쓸 수 없습니다(TypeError).

`children`, raw 제품명, font family/weight/size, 간격, 제품명 색을 public customization axis로 제공하지 않습니다. 두 형태 모두 같습니다.

## 5. Full과 compact

full은 LK mark와 승인 제품명 outline을 모두 표시하는 기본형입니다. compact는 물리적으로 좁은 rail에서 LK mark만 시각적으로 남깁니다. 두 모드는 별도 로고나 React tree를 교체하지 않고 같은 SVG·같은 LK path를 유지합니다. 왼쪽에 고정한 viewport의 폭만 바뀌므로 LK mark의 위치·크기·DOM identity는 고정되고 제품명만 오른쪽으로 reveal/conceal 됩니다.

- TopBar와 expanded SideNav: full
- collapsed SideNav rail: compact
- 같은 셸에서 TopBar와 SideNav 중 한 곳만 제품 로크업을 소유
- 컴포넌트는 부모 폭을 추측해 자동 전환하지 않음; breakpoint와 전환 시점은 제품 셸 소유
- full의 최소 높이와 intrinsic width를 확보하지 못하면 축소·wrap·임의 crop하지 않고 compact로 명시 전환
- 전환은 `--dur-base`와 `--ease-out`을 사용하고 `prefers-reduced-motion: reduce`에서는 즉시 완료

compact가 홈 링크라면 hover/focus 사용자가 제품명을 확인해야 하는 문맥에서 셸이 `Tooltip`을 조합할 수 있습니다. tooltip은 canonical name이나 route의 source가 아닙니다.

회사 보증 형은 compact가 없습니다. 내비게이션 rail·TopBar처럼 폭이 제한된 슬롯에는 쓰지 않고, 그런 슬롯은 회사 `Lockup inline`(보증 형의 앞 단위)이나 mark 형을 씁니다.

## 6. 색과 배경

- `appearance="positive"`: 흰색 또는 밝고 단순한 단색 배경의 LK Navy `#05132B`
- `appearance="reverse"`: LK Navy 또는 충분히 어둡고 단순한 단색 배경의 White `#FFFFFF`
- mark와 제품명은 항상 같은 appearance
- 사진·영상·데이터 시각화·복잡한 gradient 위에는 직접 배치하지 않고 단색 containment 사용
- 임의 제품색, semantic primary color, gradient, shadow, glow, outline, opacity 차등 금지

투명 full 로크업의 보호 여백은 완성된 보이는 bounds부터 사방 최소 `0.5X`입니다. 회사 보증 형의 투명 보호 여백도 완성된 보이는 bounds(소문자 어센더 포함)에서 사방 `0.5X`입니다. shell 안의 일반 layout gap과 브랜드 보호 여백을 혼동하지 않습니다.

## 7. 접근성

독립 `ProductLockup`은 하나의 `role="img"`와 registry canonical name에서 만든 접근성 이름 `LK {canonical name}`을 제공합니다. 예를 들어 `product="console"`은 `LK Console`, `product="portal"`은 `LK Portal`입니다. 내부 mark와 wordmark path는 별도로 낭독되지 않으며 compact도 같은 이름을 유지합니다.

홈 링크에서는 링크가 목적지를 포함한 이름을 소유하고 자식 로크업은 장식으로 둡니다.

```jsx
<a href="/" aria-label="LK Console 홈">
  <ProductLockup product="console" decorative />
</a>
```

시각적인 대문자 `CONSOLE`·`PORTAL`을 접근성 이름에도 강제로 대문자로 복제하지 않습니다. registry의 canonical 표기를 사용합니다.

회사 보증 형의 기본 접근성 이름은 보이는 글과 같은 `LK ROBOTICS {canonical name}`(예: `LK ROBOTICS Portal`)입니다. heading 안에 둘 때는 장식으로 숨기지 않거나, heading 이름을 보이는 글과 같게 둡니다.

## 8. 금지 사례

- LK mark나 회사 `Lockup` 옆에 Montserrat 또는 UI font의 live text를 붙여 제품 로크업처럼 보이게 만들기. 회사 보증 형이 필요하면 registry의 `company` 항목을 등록하고 `endorsement="company"`를 씁니다
- registry에 없는 `Web Viz`, `Control`, 고객명, 지점명, 환경명 등을 우회 렌더링하기
- `LK | CONSOLE`, slash, dot, badge로 로크업 내부를 분할하기
- 제품마다 mark·gap·font·weight·case·appearance를 바꾸거나 제품명만 ExtraBold 800이나 Bold 700으로 되돌리기. 형태별 case(mark 형 대문자, 회사 보증 형 canonical 대소문자)는 표준이 정하며 호출부가 바꾸지 않습니다
- 한 화면에 mark 형과 회사 보증 형을 함께 두어 제품 마크 두 개가 경쟁하게 하기
- full을 좁은 슬롯에서 찌그러뜨리거나 compact 계약 밖에서 임의 crop·wrap·ellipsis하기
- 페이지 제목, workspace, 버전, `DEV`·`STG`, beta, 상태, 슬로건을 제품명 outline에 합치기
- ProductLockup을 기능 icon, 반복 pattern, watermark로 사용하기
- repository에 runtime 컴포넌트가 있다는 이유만으로 외부 상표 사용 승인을 추정하기

## 9. Registry 변경과 제품 적용

LDS는 registry key, canonical name, mark+wordmark geometry, outline path, appearance, height, compact와 접근성 계약을 소유합니다. 제품은 TopBar/SideNav 중 소유 위치, home route와 클릭, breakpoint, tooltip, 배포 시점을 소유합니다.

| 제품 | 현재 적용 기준 |
| --- | --- |
| LK Console | `ProductLockup product="console"`; expanded shell은 full, collapsed rail은 compact |
| LK Portal | 시작 화면(홈 hero)·로그인: `ProductLockup product="portal" endorsement="company"`(「LK ROBOTICS Portal」). 셸 브랜드 슬롯(SideNav 머리·모바일 TopBar·Drawer): 회사 `Lockup variant="inline"`, 접힌 rail: `Lockup variant="mark"`. mark 형 「LK PORTAL」(`product="portal"`·`Lockup variant="portal"`)은 공개 API로 유지하되 Portal 셸에서 회사 보증 형과 함께 쓰지 않음 |
| LK Web Viz | registry 이름과 outline 승인 전까지 `ProductLockup` 미지원; raw text fallback 금지 |
| LK Control Full Daedeok | registry 이름과 outline 승인 전까지 `ProductLockup` 미지원; raw text fallback 금지 |
| 궁릉순찰로봇 관제 (`lkrobotics-control-gungneung-lds`) | registry 등록 요청 접수됨. 승인 로마자 이름 확정 전까지 `ProductLockup` 미지원이며 9.2의 등록 전 임시 사용 규칙을 따릅니다 |

새 제품을 registry에 추가할 때는 다음을 한 변경으로 검토합니다.

1. 제품 naming owner가 canonical name과 형태(mark 형·회사 보증 형·둘 다)를 승인합니다. mark 형은 대문자 문자열, 회사 보증 형은 canonical 대소문자 문자열입니다.
2. Montserrat SemiBold 600 v7.222의 고정 font hash와 기본 kerning으로 [`generate-product-lockups.mjs`](../../scripts/generate-product-lockups.mjs)에서 형태별 outline을 생성합니다.
3. mark 형은 보이는 높이 `1X`·mark 폭 `0.35배` gap·보이는 bounds 정렬을, 회사 보증 형은 `ROBOTICS` cap height·baseline 공유·`ROBOTICS` 잉크 끝에서 mark 폭 `0.525배` gap·inline 세로 프레임을 검증하고, 두 형태 모두 viewBox와 path hash를 검증합니다.
4. `20px`·`28px`, positive·reverse를 시각 검수합니다. mark 형은 full·compact도, 회사 보증 형은 비례 축소도 검수합니다.
5. 접근성 이름, Storybook, visual regression, 제품 적용 audit와 문서를 함께 갱신합니다.

Web Viz와 Control은 1단계가 완료되지 않았으므로 이름이나 대문자 표기를 추정해 먼저 구현하지 않습니다. 기계 판정 source pin은 [`PRODUCT_BRAND_ASSET_AUDIT.json`](../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json)이 소유합니다.

### 9.1 제품 팀이 제출하는 것 (intake)

registry 등록은 LDS 코드 변경이 아니라 **브랜드 승인**에서 시작합니다. 제품 팀은 다음을 제출합니다.

| 항목 | 내용 | 승인자 |
| --- | --- | --- |
| canonical name | 접근성 이름 `LK {canonical name}`에 쓰이는 표기(예: `Console`) | product naming owner |
| 형태 | mark 형 / 회사 보증 형 / 둘 다 | product naming owner · brand owner |
| 보이는 wordmark | mark 형: 대문자(예: `CONSOLE`). 회사 보증 형: canonical 대소문자(예: `Portal`) | product naming owner · brand owner |
| registry key | `^[a-z][a-z0-9-]*$` 소문자 kebab key | design system owner |
| 사용 위치 | TopBar / SideNav 중 셸 브랜드 슬롯과 full·compact 사용 폭 | 제품 owner |
| 상표 근거 | 외부 상표·고객사 이름을 포함한다면 사용 승인 근거 | brand owner |

승인 후의 outline 생성·검증·문서화는 위 9장 2~5단계에 따라 LDS가 수행합니다.

**표기 제약.** mark 형 wordmark는 [`generate-product-lockups.mjs`](../../scripts/generate-product-lockups.mjs)가
`^[A-Z]+(?: [A-Z]+)*$`(ASCII 대문자와 공백)로, 회사 보증 형 wordmark는
`^[A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*$`(ASCII 글자, 단어마다 대문자로 시작, canonical name과 정확히 같은 문자열)로
검증하고 pinned Montserrat SemiBold 600에서 글자별 outline을 뽑습니다. 숫자·기호는 등록할 수 없습니다.
한글 제품명은 Montserrat에 글리프가 없어 현재 등록할 수 없으며, 향후 Pretendard SemiBold 600 v1.3.9(UI 글꼴과
같은 바이트)를 pin하는 별도 개정으로만 엽니다(한글 이름은 회사 보증 형 전용, 잉크 높이 `1X`·보이는 bounds 정렬,
한 이름 안에서 문자 체계 혼용 금지). 이 제약을 우회하려고 다른 글꼴을 섞거나 글자를 직접 작도하지 않습니다.

### 9.2 등록 전 임시 사용 규칙

미등록 제품(또는 미등록 형태)은 승인 자산과 제품명을 **하나의 로크업으로 읽히게 조합하지 않습니다**. 형태가 승인되었지만 그 형태를 포함한 LDS release가 아직 없는 경우에만, brand owner가 기한(대상 release)과 표면을 지정해 governance 승인 기록에 남긴 **release 대기 예외**를 둘 수 있습니다. 예외 조합은 승인 표면 밖에서 쓰지 않고, 줄바꿈하지 않으며, 접근성 이름을 보이는 글과 같게 두고, 해당 release를 받는 즉시 `ProductLockup` 하나로 교체합니다. 8장 첫 번째
금지 사례(LK mark 옆에 live text를 붙여 새 제품 로크업 만들기)는 UI 글꼴을 쓰더라도 동일하게
적용됩니다 — 글꼴 정책 위반이 아니라 *승인되지 않은 로크업을 만든 것*이 문제입니다.

등록 전에는 다음 중 하나를 사용합니다.

- 브랜드 슬롯에는 회사 `Lockup`(또는 `Lockup variant="mark"`)만 두고, 제품 이름은 로크업 밖의
  일반 셸 텍스트(페이지 제목·workspace 라벨 등)로 분리해 배치합니다. 두 요소가 하나의 자산으로
  보이지 않도록 로크업 내부 간격 리듬(1X 높이, 0.35 gap)을 흉내 내지 않습니다.
- 또는 브랜드 슬롯을 비우고 제품 이름만 셸 텍스트로 둡니다.

등록이 끝나면 이 임시 조합을 걷어내고 `ProductLockup product="{key}"` 하나로 교체합니다.

## 10. 근거와 의도적 적용

- [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)는 pinned build-time wordmark source입니다. 회사 `ROBOTICS`는 ExtraBold 800(세로형)과 Bold 700(가로형)을, 고정 Portal과 ProductLockup 승인 제품명은 SemiBold 600을 사용합니다. 배포 결과는 outline이므로 소비자 runtime에 글꼴을 요구하지 않습니다.
- [Atlassian logos](https://atlassian.design/foundations/logos)는 제품 식별과 고정 attribution 자산을 구분하고 승인 로고의 임의 합성을 금지합니다. LDS는 자유 조합 대신 닫힌 outline registry를 선택했습니다.
- [W3C functional images](https://www.w3.org/WAI/tutorials/images/functional/)와 [WCAG Technique H2](https://www.w3.org/WAI/WCAG22/Techniques/html/H2)는 이미지 링크의 목적 이름과 중복 대체 텍스트 회피 근거입니다.
- [Apple HIG Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)는 맥락을 보존하고 콘텐츠·컨트롤을 일관되고 예측 가능한 위치에 두며 자연스러운 애니메이션으로 전환을 이해시키라고 설명합니다. LDS는 LK mark를 고정하고 제품명 영역만 reveal하는 방식으로 적용합니다.
- [Apple HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)는 compact 상태에서도 symbol을 유지하고 expanded 상태에서 label을 드러내는 패턴을 제공합니다. LDS는 이 구조를 제품 lockup에 적용하되 Apple의 수치나 조형은 복사하지 않습니다.
- [WCAG Technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)는 interaction-triggered motion을 `prefers-reduced-motion`으로 비활성화하는 근거입니다.

- [Atlassian logos — Property logos](https://atlassian.design/foundations/logos): 회사 logomark·wordmark 뒤에 property 이름을 붙인 공식 lockup family, 「회사 + 이름」 alt, 직접 조합 금지. LDS는 구조와 alt를 채택하고, neutral 이름 색은 LK 승인 색 밖이므로 채택하지 않습니다.
- [Red Hat product logos](https://www.redhat.com/en/about/brand/standards/product-logos)·[universal logos](https://www.redhat.com/en/about/brand/standards/universal-logos): 회사 로고 먼저·full 제품명, 판매 제품에만 생성, custom text lockup 금지, 좁은 interface용 one-line 버전.
- [GOV.UK brand hierarchy](https://brand.design-system.service.gov.uk/logo-system/brand-hierarchy): wordmark와 이름 사이 간격을 wordmark 자체 기하로 정의. LDS는 mark 폭 기준 간격을 쓰되, 회사 보증 형은 회사명과 제품명이 두 단어로 읽히도록 조판 어간에 맞춘 `0.525배`를 씁니다.
- [W3C Images of text](https://www.w3.org/WAI/tutorials/images/textual/): logo 대체 텍스트는 이미지 속 글과 같게 둡니다.

일반 UI shell이 native text 제품명을 사용하는 사례와 달리, LK는 기존 Portal의 대문자·높이·간격 리듬을 유지하되 제품명만 SemiBold로 낮춰 모브랜드 우선 위계를 채택합니다. raw string API를 열지 않고 승인 registry, deterministic outline과 hash로 오용 범위를 제한합니다. 외부 자료의 geometry나 수치는 LK에 복사하지 않습니다.

## 11. 변경 절차

- canonical name 또는 보이는 문자열 변경: product naming owner와 brand owner 승인, 새 outline/hash, 접근성·제품 migration 검토
- geometry·font version·gap·appearance·height 변경: brand/design-system owner 검토, standard version과 construction/hash 갱신, `20px`·`28px` 시각 회귀
- registry key 추가: 지원 제품 union, generated paths, 문서, Storybook, 타입, 제품 audit를 같은 변경에서 갱신
- 기존 key 제거·이름 변경: public API migration과 폐기 일정을 먼저 제공하고 조용히 덮어쓰지 않음
- 변경 후 최소 `npm run check:brand`(`check:product-lockups` 포함), `npm run check:brand-products`(brand product coverage), product frontend coverage, type/layer, Storybook accessibility와 visual 검사를 기록
