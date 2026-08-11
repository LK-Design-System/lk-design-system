# LK ROBOTICS 브랜드 표준

| Field | Value |
| --- | --- |
| Type | Brand documentation index |
| Status | Current |
| Owner | Brand owner · Design system owner |
| Last reviewed | 2026-08-11 |

이 디렉터리는 LK ROBOTICS 로고와 승인 제품 로크업의 제작·선택·배치·승인 규칙을 소유합니다. 로고를 제품 UI에 넣는 방법만 필요하면 컴포넌트 가이드를, 브랜드 자산을 제작·배포·외부 제공하거나 변경하려면 전체 표준을 사용합니다.

| 문서 | 용도 |
| --- | --- |
| [`LK_LOGO_STANDARD.md`](LK_LOGO_STANDARD.md) | v2.0 표준 · geometry v1.0 정본, 작도 검증, 변형, 최소 크기, 여백, 색상, 오용, 인쇄, 공동 브랜딩, 승인·변경 절차 |
| [`LK_PRODUCT_LOCKUP_STANDARD.md`](LK_PRODUCT_LOCKUP_STANDARD.md) | LK 모브랜드 우선 mark + SemiBold 승인 제품명 outline registry, 작도·full/compact·색·접근성·소유권 표준 |
| [`lk-logo-governance.json`](lk-logo-governance.json) | 정본 우선순위, 승인 역할, 미승인 인쇄 색상 상태를 기록하는 기계 판독용 운영 레코드 |
| [`../components/guides/theme-brand-lk-robotics-logo.md`](../components/guides/theme-brand-lk-robotics-logo.md) | 제품 UI용 `Lockup` 선택과 API 참조 |
| [`../components/guides/theme-brand-product-lockup.md`](../components/guides/theme-brand-product-lockup.md) | 제품 UI용 `ProductLockup` 선택과 API 참조 |
| [`../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json`](../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json) | Web Viz·Control·LK Portal의 source pin, LDS/제품 소유 경계와 migration 판정 |

## 빠른 원칙

- 제공된 SVG, `Lockup` 또는 승인 registry의 `ProductLockup`만 사용하고 path·글자·간격을 다시 만들지 않습니다.
- 모브랜드 우선 `LK + 제품명`은 live text로 직접 조판하지 않고 승인 SemiBold outline registry인 `ProductLockup`을 사용합니다. 현재 `console`과 `portal`만 지원하며 Web Viz와 Control은 이름·outline 승인 전까지 미지원입니다. 고정 Portal 정본도 같은 SemiBold 조형이며 `ProductLockup product="portal"`과 생성 단계에서 동기화됩니다.
- 투명 mark·inline·stacked·제품 로크업은 보이는 로고 주위에 최소 `0.5X`, 공동 브랜딩은 최소 `1X`를 비웁니다. banner는 `0.5X`를 자산 안에 포함하고, 사각 containment 자산은 전체 canvas를 보존합니다.
- 디지털 색상은 정본 HEX/RGB만 사용합니다. CMYK와 Pantone은 실물 교정 승인 전까지 공식 값이 없습니다.
- 저장소의 자산 공개는 상표 사용 허가가 아닙니다. 외부 배포·파트너 결합·상표성 사용에는 브랜드 담당자 승인이 필요합니다.
