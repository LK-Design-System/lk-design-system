# Lockup

LK ROBOTICS의 공식 로고 컴포넌트입니다. `LK`는 geometry v1.0으로 동결한 커스텀 벡터 심볼이고, `ROBOTICS`는 Montserrat ExtraBold 800 v7.222에서 생성한 아웃라인입니다. 기업 표기형의 `주식회사 엘케이로보틱스`는 Noto Sans KR ExtraBold 800 v2.004-H2에서 생성합니다. 제품에서는 공식 SVG 또는 `Lockup`만 사용하며 워드마크나 법인명을 텍스트로 다시 조판하지 않습니다.

## 정본과 작도 검증

- `X`는 패딩이나 SVG `viewBox`가 아니라 LK 심볼 path의 **보이는 높이**입니다.
- 심볼의 정규화된 보이는 치수는 `W = 1.08176X`, `H = 1X`입니다.
- 투명 배경 `mark`·`stacked`·`inline`의 외부 clear space는 보이는 로고 bounds부터 사방 `0.5X`, 공동 브랜딩은 `1X`입니다. banner는 `0.5X`를 배경 안에 포함하고, 기본/기업 사각형과 favicon tile은 생성된 전체 캔버스가 보호면입니다. 타이트한 배포 SVG의 내부 패딩과 혼동하지 않습니다.
- geometry v1.0의 path, transform, visible bounds와 SHA-256이 정본입니다. 작도 도표는 검증 기준이며 심볼을 다시 그리는 템플릿이 아닙니다.
- 작은 크기용 별도 redraw는 승인되지 않았습니다. optical test와 승인 기록 전까지 모든 크기에서 v1.0을 유지합니다.

## 워드마크와 법인명

- `ROBOTICS`: 대문자, Montserrat ExtraBold 정적 weight 800 Version 7.222, 글꼴 기본 커닝, 추가 자간 0, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- `주식회사 엘케이로보틱스`: NFC, Noto Sans KR ExtraBold `wght=800` Version 2.004-H2, 글꼴 기본 커닝, 글자 사이 `0.105em`, 마지막 글자 뒤 자간 없음, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- 법인명 배치: 보이는 폭 `1.90X`, 상단 로크업과 간격 `0.21X`, 상단 로크업의 보이는 중심축에 가운데 정렬
- 배포 결과는 `<text>`와 런타임 폰트가 없는 SVG path입니다. Montserrat와 Noto Sans KR은 build-time 생성 재료이며 UI 본문 글꼴이 아닙니다.

## 변형 선택과 저장소 정책 최소 크기 (광학 승인 대기)

| 변형 | 사용 | 최소 크기 |
| --- | --- | --- |
| `mark` | 브랜드가 이미 식별되는 좁은 제품 UI | 렌더 높이 20px. 이때 보이는 심볼은 16px 이상. 최소 슬롯 폭 21.431318px |
| `stacked` | 세로형·정사각형에 가까운 독립 로크업 | 렌더 높이 64px. 최소 슬롯 폭 82.612990px |
| `inline` | TopBar·SideNav·가로 헤더 | 렌더 높이 20px. 최소 슬롯 폭 156.324048px |
| banner SVG | 서명·고정 가로 슬롯 | 렌더 높이 28px. 최소 슬롯 폭 137.019722px |
| 기본 사각형 SVG | 프로필·브랜드 타일 | 64px 정사각형, 96px 이상 권장 |
| 기업 표기형 SVG | 회사 소개·대외 문서·법인 식별 | 160px 정사각형, 192px 이상 권장, 인쇄 32mm 이상 |
| favicon tile | 브라우저 favicon | 16px 정사각형 |

favicon tile은 iOS AppIcon이나 Android adaptive icon이 아닙니다. 두 앱 아이콘은 별도 제작·승인이 필요합니다.

## 반응형 크기

`height`는 요청하는 자연 렌더 높이이며 variant별 최소값 아래에서는 최소값으로 보정됩니다. 기본 출력은 실제 variant `viewBox` 비율로 intrinsic width를 계산하고 `max-width: 100%; height: auto`를 적용해, 스타일을 재정의하지 않은 좁은 부모에서는 두 축을 같은 비율로 축소합니다. 이 반응형 축소는 overflow를 피하지만 실제 표시 높이도 낮추므로 저장소 정책 최소 크기를 대신 보장하지 않습니다. 최소 규격을 유지하려면 mark 21.431318px, stacked 82.612990px, inline 156.324048px, banner 137.019722px 이상의 슬롯 폭을 확보합니다. 더 좁으면 `inline`에서 `mark`로 전환하거나 슬롯을 넓힙니다.

기존 SVG API 호환을 위해 `width`, `viewBox`, `preserveAspectRatio` prop override는 전달되지만 브랜드 사용에서는 미승인입니다. `style.width`/`style.height`를 함께 덮어 최소 규격이나 비율 보호를 우회하지 않습니다.

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={32} decorative />
<Lockup variant="stacked" tone="mono" height={64} />
```

## 색상과 배경

- **Positive:** 흰색 또는 밝고 단순한 단색 배경에는 공식 네이비 `tone="ink"`를 사용합니다.
- **Reverse:** 공식 네이비 또는 충분히 어둡고 단순한 배경에는 `tone="white"`를 사용합니다.
- **Mono:** 단색 출력 제약이 확인된 경우에만 검정 `tone="mono"` 또는 흰색 반전을 사용합니다. 기업 표기형의 포인트 색을 임의 회색으로 바꾸지 않습니다.
- **사진 배경:** 로고와 clear space 전체에 안정적인 대비가 없으면 사진 위에 직접 놓지 않고 공식 단색 보호면을 사용합니다.
- 공식 사각형 자산은 전경과 배경이 함께 고정된 조합입니다. `tone`, `currentColor`나 UI semantic token으로 다시 칠하지 않습니다.
- 호환용 `color`와 `tone="current"`는 기존 제품 통합을 위한 escape hatch이며, 임의 색을 공식 브랜드 색으로 승인하지 않습니다.

늘임·찌그러뜨림, 회전, 임의 색, 텍스트 재조판, 그림자·외곽선·그라디언트, path 크롭과 LK/ROBOTICS 재배치는 금지합니다.

## 플랫폼 전달

- 공통 플랫폼 계약: `assets/brand/platforms/manifest.json`
- Figma 수동 import 계약: `assets/brand/platforms/figma/import-manifest.json`
- iOS/Android/Web manifest는 각 플랫폼 하위 디렉터리에 있습니다.

이 manifest들은 deterministic 전달 입력과 hash를 기록할 뿐입니다. Figma live sync, 실제 업로드, 디자이너 승인이나 제품 저장소 적용을 증명하지 않습니다. 특히 iOS AppIcon과 Android adaptive icon은 현재 제공하지 않습니다.

글꼴 출처는 [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)와 [Noto Sans KR 공식 Google Fonts 소스](https://github.com/google/fonts/tree/4efc2774c63917927efe769ca845def6bd6debae/ofl/notosanskr)이며, 모두 SIL OFL 1.1을 따릅니다. 전체 브랜드 운영 규정은 `docs/brand/LK_LOGO_STANDARD.md`를 따릅니다.
