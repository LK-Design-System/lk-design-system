# Lockup

LK ROBOTICS의 승인 로고 컴포넌트입니다. `LK`는 커스텀 벡터 심볼이고, `ROBOTICS`는 고정된 Montserrat ExtraBold 800 v7.222 글꼴에서 생성한 아웃라인입니다. 기업 표기형의 `주식회사 엘케이로보틱스`는 Noto Sans KR ExtraBold 800 v2.004-H2에서 생성합니다. 제품에서는 승인 SVG 또는 `Lockup`만 사용하며 워드마크나 법인명을 텍스트로 다시 조판하지 않습니다.

## 제작 규정

- `ROBOTICS`: 대문자, Montserrat ExtraBold 정적 weight 800 Version 7.222, 글꼴 기본 커닝, 추가 자간 0, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- 배포 형식: `<text>`가 없는 SVG path. 런타임 글꼴 의존성 없음
- UI 본문 글꼴은 Pretendard 유지. Montserrat와 Noto Sans KR은 로고 생성 전용

### 한글 법인명

- `주식회사 엘케이로보틱스`: NFC 텍스트, Noto Sans KR 가변 TTF의 명명된 ExtraBold `wght=800` Version 2.004-H2, 글꼴 기본 커닝, 글자 사이 자간 `0.105em`, 마지막 글자 뒤 자간 없음, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- 배치: 법인명 보이는 폭 `1.90X`, 상단 로크업과의 간격 `0.21X`, 상단 로크업의 보이는 중심축에 가운데 정렬
- 최소 크기: 디지털 160px, 권장 192px 이상, 인쇄 32mm. 이보다 작으면 법인명 없는 기본형 사용

`X`는 커스텀 LK 심볼의 보이는 높이입니다. `stacked`는 워드마크 명목 cap height를 `0.25X`로 하고 심볼 보이는 폭의 `0.2배`만큼 띄워 가운데 정렬합니다. `inline`은 워드마크의 보이는 높이를 `1X`로 하고 같은 `0.2배` 간격을 둡니다. 배너 최소 여백은 사방 `0.5X`, 제품 UI용 inline 최소 렌더 높이는 20px입니다.

승인 SVG와 `Lockup`은 동일한 생성 원본을 사용합니다. 개별 SVG path를 직접 편집하거나 텍스트로 다시 만들지 않습니다.

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
```

글꼴 출처는 [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)와 [Noto Sans KR 공식 Google Fonts 소스](https://github.com/google/fonts/tree/4efc2774c63917927efe769ca845def6bd6debae/ofl/notosanskr)이며, 모두 SIL OFL 1.1을 따릅니다.
