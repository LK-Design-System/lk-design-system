# Display0 제안 — 투영 매체를 위한 램프 최상단 한 단

| Field | Value |
| --- | --- |
| Type | Plan |
| Status | Adopted — 2026-08-17 main 반영(display0 112/144, .type-display0). 릴리스·위성 재지정 대기 |
| Owner | Foundation owner |
| Last reviewed | 2026-08-16 |
| Source | 소비처: `lk-design-system-slides/tokens/slides.css`(`--slides-hero-*`) · 근거: `lk-design-system-slides/docs/references/SLIDE_SYSTEMS_COMPARISON.md` · 대상: `tokens/source.json` 타입 램프 |

타입 램프의 최상단(`display1`, 56px) **위에 한 단**(`display0`)을 추가하자는
제안이다. 소비처는 제품 UI가 아니라 투영 매체(Slides와 그 하류인 Motion)다.

## 채우는 구멍

슬라이드에는 "문장 하나·숫자 하나가 화면 전체를 감당하는" 희소 슬라이드
계열(Statement·Title·Section·End)이 있다. 업계 슬라이드 시스템 실측 조사
(Slides 레포의 `SLIDE_SYSTEMS_COMPARISON.md`)에서 이 계열의 타입은 캔버스
높이의 10~17%가 표준이었다 — Slidev `fact` 17.4%, reveal.js h1 15.0%.
LDS 램프는 display1(1280×720 캔버스의 7.8%)에서 끝나므로, 위성이 이 단을
표현할 방법이 램프 안에 없다.

## 현재의 자립 운영과 그 한계

Slides는 2026-08-16부터 `--slides-hero-*`를 **calc 조합**으로 운영한다:

```css
--slides-hero-size: calc(var(--display1-size) * 2);   /* 112px, 캔버스 15.6% */
--slides-hero-line: calc(var(--display1-line) * 2);   /* 144px */
```

업스트림 변수를 통해 해소되므로 Theme 교체는 따라온다. 다만:

- **램프 규율의 예외다.** "모든 단은 램프의 단"이라는 원칙에서, calc로 만든
  파생 단은 램프 밖의 크기다. 예외는 하나일 때만 예외다 — 다른 위성이 같은
  필요를 느끼면 각자의 배수를 만들기 시작한다.
- **배수는 앵커의 형태를 모른다.** ×2는 2026-08 시점 display1(56/72px)에서
  측정해 고른 값이다. Theme가 display1의 크기·행간 비율을 바꾸면 hero는
  산술적으로는 따라가지만, 그 결과가 여전히 옳은 투영 크기라는 보장은
  램프가 아니라 우연이 갖는다.

## 제안

`tokens/source.json` 타입 램프에 `display0`을 추가한다:

- 제안값: **size 112px · line 144px · spacing -0.034em** (display1 ×2와 동일 —
  이미 실사용 중인 값의 승격이라 소비처 시각 변화 0)
- 용도 주석: 투영·전시 매체 전용. 제품 UI 컴포넌트가 직접 소비하면 안 되는
  단이라는 것을 토큰 주석과 `check:lds-style` 계열 가드 중 실행 가능한 쪽에
  기록한다 (semantic 경유 원칙은 이 단에서도 동일).
- 승격 시 Slides 쪽 마이그레이션은 한 줄이다:
  `--slides-hero-size: var(--display0-size);` — 이 재지정이 일어나면 이 문서의
  Status를 Adopted로 올리고 calc의 근거 주석을 제거한다.

## 기각해도 되는 조건

이 제안은 긴급하지 않다. calc 자립 운영은 동작하며, 기각 비용은 "위성이
늘어날 때 파생 단이 복제될 위험"뿐이다. 투영 계열 위성이 Slides 하나로
남아 있는 동안은 보류가 합리적일 수 있다 — 그 경우에도 이 문서는 남겨서,
두 번째 위성이 같은 필요를 만났을 때 여기서 재개한다.
