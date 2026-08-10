# Lockup

LK ROBOTICS의 승인 로고 컴포넌트입니다. `LK`는 커스텀 벡터 심볼이고, `ROBOTICS`와 승인된 제품 워드마크 `PORTAL`은 고정된 Montserrat ExtraBold 800 v7.222 글꼴에서 생성한 아웃라인입니다. 기업 표기형의 `주식회사 엘케이로보틱스`는 Noto Sans KR ExtraBold 800 v2.004-H2에서 생성합니다. 제품에서는 승인 SVG 또는 `Lockup`만 사용하며 워드마크·제품명·법인명을 텍스트로 다시 조판하지 않습니다.

## 제작 규정

- `ROBOTICS`: 대문자, Montserrat ExtraBold 정적 weight 800 Version 7.222, 글꼴 기본 커닝, 추가 자간 0, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- `PORTAL`: 대문자, 같은 Montserrat ExtraBold 800 Version 7.222, 글꼴 기본 커닝, 추가 자간 0, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- 배포 형식: `<text>`가 없는 SVG path. 런타임 글꼴 의존성 없음
- UI 본문 글꼴은 Pretendard 유지. Montserrat와 Noto Sans KR은 로고 생성 전용

### 한글 법인명

- `주식회사 엘케이로보틱스`: NFC 텍스트, Noto Sans KR 가변 TTF의 명명된 ExtraBold `wght=800` Version 2.004-H2, 글꼴 기본 커닝, 글자 사이 자간 `0.105em`, 마지막 글자 뒤 자간 없음, 가로·세로 비율 1:1, 글리프 수동 수정 금지
- 배치: 법인명 보이는 폭 `1.90X`, 상단 로크업과의 간격 `0.21X`, 상단 로크업의 보이는 중심축에 가운데 정렬
- 최소 크기: 디지털 160px, 권장 192px 이상, 인쇄 32mm. 이보다 작으면 법인명 없는 기본형 사용

`X`는 커스텀 LK 심볼의 보이는 높이입니다. `stacked`는 워드마크 명목 cap height를 `0.25X`로 하고 심볼 보이는 폭의 `0.2배`만큼 띄워 가운데 정렬합니다. `inline`은 워드마크의 보이는 높이를 `1X`로 하고 같은 `0.2배` 간격을 둡니다. `portal`도 보이는 높이 `1X`를 쓰되 간격은 심볼 보이는 폭의 `0.35배`입니다 — 20px 사이드바 렌더에서 0.2배(약 3.8px)는 K 사선과 P가 붙어 보여 한 단어로 읽혔습니다. 배너 최소 여백은 사방 `0.5X`, 제품 UI용 inline 최소 렌더 높이는 20px입니다.

## LK Portal 제품형

- `variant="portal"`은 자유 텍스트 슬롯이 아니라 승인된 `LK Portal` 고정 조합입니다. 다른 제품명을 전달하거나 `PORTAL`만 별도 폰트 텍스트로 조판하지 않습니다.
- 가장 가까운 기존 형식은 `inline`입니다. 시각 차이는 `ROBOTICS`를 `PORTAL` 아웃라인으로 교체한 것과 `0.35배` 간격뿐이며 LK 심볼, 1X 높이, 색상과 접근성 규칙은 같습니다.
- 단독 사용 시 접근성 이름은 `LK Portal`입니다. 이미 `aria-label="LK Portal"`이 있는 링크 안에서는 `decorative`로 중복 이름을 만들지 않습니다.
- 제품 적용 범위: LK Portal 사이드바 헤더는 지원합니다. Web Viz와 Control은 LK Portal을 식별하는 화면이 아니므로 이 제품형의 적용 대상이 아닙니다.

승인 SVG와 `Lockup`은 동일한 생성 원본을 사용합니다. 개별 SVG path를 직접 편집하거나 텍스트로 다시 만들지 않습니다.

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="portal" tone="ink" height={20} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
```

글꼴 출처는 [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)와 [Noto Sans KR 공식 Google Fonts 소스](https://github.com/google/fonts/tree/4efc2774c63917927efe769ca845def6bd6debae/ofl/notosanskr)이며, 모두 SIL OFL 1.1을 따릅니다.

외부 기준 검토: [Atlassian 로고 지침](https://atlassian.design/foundations/logos)은 제품 식별 시 심볼과 설명적 제품명을 함께 쓰고 맥락이 명확할 때만 심볼 단독형을 쓰도록 안내합니다. [W3C 이미지 접근성 지침](https://www.w3.org/WAI/tutorials/images/)과 [WCAG 2.2](https://www.w3.org/TR/WCAG22/)에 따라 의미 있는 로고는 하나의 접근성 이름을 제공하고, 중복되는 내부 로고는 장식으로 숨깁니다. 이 검토 결과를 고정 제품형과 `decorative` 계약에 반영했습니다.
