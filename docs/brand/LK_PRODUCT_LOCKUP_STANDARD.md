# LK 제품 로크업 표준 v1.2

| Field | Value |
| --- | --- |
| Type | Approved product-lockup registry standard |
| Status | Current |
| Owner | Brand owner · Design system owner · Product naming owner |
| Last reviewed | 2026-08-11 |
| Standard version | 1.3.0 |
| Registry source | [`../../assets/brand/lk-product-lockups.json`](../../assets/brand/lk-product-lockups.json) |
| Runtime | [`../../components/brand/ProductLockup.jsx`](../../components/brand/ProductLockup.jsx) |

이 표준은 LK Portal에서 사용하던 **대문자·1X·간격 리듬**을 계승하면서, LK mark가 제품명보다 먼저 읽히는 모브랜드 우선 위계를 적용합니다. `ProductLockup`은 임의 문자열을 조판하는 컴포넌트가 아니라, 제품별로 검증된 SVG outline만 제공하는 승인 registry입니다. 따라서 제품 UI가 Montserrat를 설치하거나 제품명을 runtime `<text>`로 그리지 않습니다.

## 1. `Lockup`과 `ProductLockup`의 경계

| 체계 | 구성 | 사용 | 변경 권한 |
| --- | --- | --- | --- |
| 회사 `Lockup` | 승인된 LK mark·`LK ROBOTICS`·법인명 SVG/path | 회사·법인 식별, 마케팅, 파트너, 외부 배포 | 회사 logo construction·version·hash·승인 절차 |
| `Lockup variant="portal"` | SemiBold 600 `LK Portal` 고정 SVG/path | 기존 통합과 고정 Portal 정본 | public API와 Portal 정본 생성 규칙 |
| `ProductLockup` | LK mark + registry에 승인된 SemiBold 600 제품명 outline | TopBar·SideNav 등 제품 셸의 모브랜드 우선 식별 | 제품 lockup registry·outline·hash·승인 절차 |

일반 제품 셸은 `ProductLockup`을 사용합니다. 기존 통합을 위한 `Lockup variant="portal"` 공개 API는 유지하되, 그 고정 Portal 정본도 SemiBold 600으로 갱신해 `ProductLockup product="portal"`과 path·transform·viewBox를 동기화합니다. 두 API 모두 font text를 LK mark 옆에 즉석으로 붙이는 자유 조합이 아닙니다.

## 2. 승인 registry

| Registry key | Canonical name | 보이는 outline | 상태 |
| --- | --- | --- | --- |
| `console` | `Console` | `CONSOLE` | 지원 |
| `portal` | `Portal` | `PORTAL` | 지원; 고정 `Lockup`과 registry가 같은 SemiBold 600 정본 사용 |
| — (`Web Viz` 후보) | 미확정 | 미확정 | 승인 이름·outline이 없어 지원하지 않음 |
| — (`Control` 후보) | 미확정 | 미확정 | 승인 이름·outline이 없어 지원하지 않음 |

public API는 `product: "console" | "portal"`의 닫힌 union만 허용합니다. `Web Viz`, `Control`, 고객명이나 임의 문자열을 전달하는 fallback은 없습니다. 보이는 대문자와 접근성 이름은 registry가 함께 소유하므로 호출부가 각각 다시 만들지 않습니다.

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

## 4. Runtime API

```jsx
<ProductLockup product="console" appearance="positive" />
<ProductLockup product="portal" appearance="reverse" height={20} />
<ProductLockup product="console" compact />
```

- `product`: 필수 registry key. 현재 `console | portal`만 지원합니다.
- `appearance`: `positive | reverse`. 밝은 단색 배경에는 `positive`, 공식 네이비나 충분히 어두운 단색 배경에는 `reverse`를 사용합니다.
- `height`: 전체 SVG의 자연 렌더 높이입니다. 기본 `28`, 최소 `20`이며 더 작은 값은 최소값으로 보정합니다.
- `compact`: 같은 SVG의 viewport를 LK mark 폭으로 접어 제품명 outline을 시각적으로 가립니다. 접근성 이름은 full과 같습니다.
- `decorative`: 이름을 소유한 링크·컨트롤 안에서 중복 낭독을 막습니다.
- `aria-label`: 독립 instance의 기본 `LK {canonical name}`을 문맥상 더 구체적으로 써야 할 때만 덮습니다.

`children`, raw 제품명, font family/weight/size, mark와 wordmark 사이 간격을 public customization axis로 제공하지 않습니다.

## 5. Full과 compact

full은 LK mark와 승인 제품명 outline을 모두 표시하는 기본형입니다. compact는 물리적으로 좁은 rail에서 LK mark만 시각적으로 남깁니다. 두 모드는 별도 로고나 React tree를 교체하지 않고 같은 SVG·같은 LK path를 유지합니다. 왼쪽에 고정한 viewport의 폭만 바뀌므로 LK mark의 위치·크기·DOM identity는 고정되고 제품명만 오른쪽으로 reveal/conceal 됩니다.

- TopBar와 expanded SideNav: full
- collapsed SideNav rail: compact
- 같은 셸에서 TopBar와 SideNav 중 한 곳만 제품 로크업을 소유
- 컴포넌트는 부모 폭을 추측해 자동 전환하지 않음; breakpoint와 전환 시점은 제품 셸 소유
- full의 최소 높이와 intrinsic width를 확보하지 못하면 축소·wrap·임의 crop하지 않고 compact로 명시 전환
- 전환은 `--dur-base`와 `--ease-out`을 사용하고 `prefers-reduced-motion: reduce`에서는 즉시 완료

compact가 홈 링크라면 hover/focus 사용자가 제품명을 확인해야 하는 문맥에서 셸이 `Tooltip`을 조합할 수 있습니다. tooltip은 canonical name이나 route의 source가 아닙니다.

## 6. 색과 배경

- `appearance="positive"`: 흰색 또는 밝고 단순한 단색 배경의 LK Navy `#05132B`
- `appearance="reverse"`: LK Navy 또는 충분히 어둡고 단순한 단색 배경의 White `#FFFFFF`
- mark와 제품명은 항상 같은 appearance
- 사진·영상·데이터 시각화·복잡한 gradient 위에는 직접 배치하지 않고 단색 containment 사용
- 임의 제품색, semantic primary color, gradient, shadow, glow, outline, opacity 차등 금지

투명 full 로크업의 보호 여백은 완성된 보이는 bounds부터 사방 최소 `0.5X`입니다. shell 안의 일반 layout gap과 브랜드 보호 여백을 혼동하지 않습니다.

## 7. 접근성

독립 `ProductLockup`은 하나의 `role="img"`와 registry canonical name에서 만든 접근성 이름 `LK {canonical name}`을 제공합니다. 예를 들어 `product="console"`은 `LK Console`, `product="portal"`은 `LK Portal`입니다. 내부 mark와 wordmark path는 별도로 낭독되지 않으며 compact도 같은 이름을 유지합니다.

홈 링크에서는 링크가 목적지를 포함한 이름을 소유하고 자식 로크업은 장식으로 둡니다.

```jsx
<a href="/" aria-label="LK Console 홈">
  <ProductLockup product="console" decorative />
</a>
```

시각적인 대문자 `CONSOLE`·`PORTAL`을 접근성 이름에도 강제로 대문자로 복제하지 않습니다. registry의 canonical 표기를 사용합니다.

## 8. 금지 사례

- LK mark 옆에 Montserrat 또는 UI font의 live text를 붙여 새 제품 로크업 만들기
- registry에 없는 `Web Viz`, `Control`, 고객명, 지점명, 환경명 등을 우회 렌더링하기
- `LK | CONSOLE`, slash, dot, badge로 로크업 내부를 분할하기
- 제품마다 mark·gap·font·weight·case·appearance를 바꾸거나 제품명만 ExtraBold 800으로 되돌리기
- full을 좁은 슬롯에서 찌그러뜨리거나 compact 계약 밖에서 임의 crop·wrap·ellipsis하기
- 페이지 제목, workspace, 버전, `DEV`·`STG`, beta, 상태, 슬로건을 제품명 outline에 합치기
- ProductLockup을 기능 icon, 반복 pattern, watermark로 사용하기
- repository에 runtime 컴포넌트가 있다는 이유만으로 외부 상표 사용 승인을 추정하기

## 9. Registry 변경과 제품 적용

LDS는 registry key, canonical name, mark+wordmark geometry, outline path, appearance, height, compact와 접근성 계약을 소유합니다. 제품은 TopBar/SideNav 중 소유 위치, home route와 클릭, breakpoint, tooltip, 배포 시점을 소유합니다.

| 제품 | 현재 적용 기준 |
| --- | --- |
| LK Console | `ProductLockup product="console"`; expanded shell은 full, collapsed rail은 compact |
| LK Portal | `ProductLockup product="portal"`과 `Lockup variant="portal"`이 같은 SemiBold 600 정본을 사용; 제품은 이 정본을 포함한 LDS release로 upgrade |
| LK Web Viz | registry 이름과 outline 승인 전까지 `ProductLockup` 미지원; raw text fallback 금지 |
| LK Control Full Daedeok | registry 이름과 outline 승인 전까지 `ProductLockup` 미지원; raw text fallback 금지 |

새 제품을 registry에 추가할 때는 다음을 한 변경으로 검토합니다.

1. 제품 naming owner가 canonical name과 보이는 대문자 문자열을 승인합니다.
2. Montserrat SemiBold 600 v7.222의 고정 font hash와 기본 kerning으로 [`generate-product-lockups.mjs`](../../scripts/generate-product-lockups.mjs)에서 outline을 생성합니다.
3. 보이는 높이 `1X`, mark 보이는 폭의 `0.35배` gap, 세로 정렬, viewBox와 path hash를 검증합니다.
4. `20px`·`28px`, positive·reverse, full·compact를 시각 검수합니다.
5. 접근성 이름, Storybook, visual regression, 제품 적용 audit와 문서를 함께 갱신합니다.

Web Viz와 Control은 1단계가 완료되지 않았으므로 이름이나 대문자 표기를 추정해 먼저 구현하지 않습니다. 기계 판정 source pin은 [`PRODUCT_BRAND_ASSET_AUDIT.json`](../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json)이 소유합니다.

## 10. 근거와 의도적 적용

- [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)는 pinned build-time wordmark source입니다. 회사 `ROBOTICS`는 ExtraBold 800을, 고정 Portal과 ProductLockup 승인 제품명은 SemiBold 600을 사용합니다. 배포 결과는 outline이므로 소비자 runtime에 글꼴을 요구하지 않습니다.
- [Atlassian logos](https://atlassian.design/foundations/logos)는 제품 식별과 고정 attribution 자산을 구분하고 승인 로고의 임의 합성을 금지합니다. LDS는 자유 조합 대신 닫힌 outline registry를 선택했습니다.
- [W3C functional images](https://www.w3.org/WAI/tutorials/images/functional/)와 [WCAG Technique H2](https://www.w3.org/WAI/WCAG22/Techniques/html/H2)는 이미지 링크의 목적 이름과 중복 대체 텍스트 회피 근거입니다.
- [Apple HIG Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)는 맥락을 보존하고 콘텐츠·컨트롤을 일관되고 예측 가능한 위치에 두며 자연스러운 애니메이션으로 전환을 이해시키라고 설명합니다. LDS는 LK mark를 고정하고 제품명 영역만 reveal하는 방식으로 적용합니다.
- [Apple HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)는 compact 상태에서도 symbol을 유지하고 expanded 상태에서 label을 드러내는 패턴을 제공합니다. LDS는 이 구조를 제품 lockup에 적용하되 Apple의 수치나 조형은 복사하지 않습니다.
- [WCAG Technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)는 interaction-triggered motion을 `prefers-reduced-motion`으로 비활성화하는 근거입니다.

일반 UI shell이 native text 제품명을 사용하는 사례와 달리, LK는 기존 Portal의 대문자·높이·간격 리듬을 유지하되 제품명만 SemiBold로 낮춰 모브랜드 우선 위계를 채택합니다. raw string API를 열지 않고 승인 registry, deterministic outline과 hash로 오용 범위를 제한합니다. 외부 자료의 geometry나 수치는 LK에 복사하지 않습니다.

## 11. 변경 절차

- canonical name 또는 보이는 문자열 변경: product naming owner와 brand owner 승인, 새 outline/hash, 접근성·제품 migration 검토
- geometry·font version·gap·appearance·height 변경: brand/design-system owner 검토, standard version과 construction/hash 갱신, `20px`·`28px` 시각 회귀
- registry key 추가: 지원 제품 union, generated paths, 문서, Storybook, 타입, 제품 audit를 같은 변경에서 갱신
- 기존 key 제거·이름 변경: public API migration과 폐기 일정을 먼저 제공하고 조용히 덮어쓰지 않음
- 변경 후 최소 `npm run check:product-lockups`, brand product coverage, product frontend coverage, type/layer, Storybook accessibility와 visual 검사를 기록
