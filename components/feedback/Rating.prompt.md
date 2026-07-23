**Rating** — 뮤트 오커 색의 별점. 입력용과 표시용이 서로 다른 접근성 계약을 가집니다.

```jsx
<Rating defaultValue={4} label="사용 만족도" onChange={setScore} />
<Rating value={4} readOnly size={16} />
```

- **value / defaultValue / onChange** — 제어/비제어. 값이 실제로 바뀔 때만 `onChange`가 호출됩니다.
- **max** — 별 개수이자 만점. **size** — 별 크기(px). **readOnly** — 표시 전용.
- **label** — 입력 모드의 접근 이름(기본 `평점`). 무엇에 대한 평가인지 알 수 있게 항상 지정하세요. `aria-label` / `aria-labelledby`가 있으면 그쪽이 우선입니다.
- **valueText** — 값 문구 생성기. 기본은 `(v, max) => "${max}점 만점에 ${v}점"`이며, 도메인 문구가 필요할 때만 재정의합니다.

## 접근성 계약

- **입력 모드**는 WAI-ARIA APG `slider`입니다. tab stop 하나(`tabIndex=0`)에 `aria-valuemin=0` / `aria-valuemax={max}` / `aria-valuenow` / `aria-valuetext`를 싣고, `ArrowRight`·`ArrowUp`은 +1, `ArrowLeft`·`ArrowDown`은 −1, `Home`은 0, `End`는 `max`로 이동합니다. 별 각각은 `aria-hidden`이라 값은 항상 한 번만 낭독됩니다.
- **읽기 전용 모드**는 `role="img"`이고 접근 이름이 곧 값(`5점 만점에 4점`)입니다. 포커스를 받지 않고 호버 미리보기도 없습니다. 값을 시각적으로만 전달하지 않기 위한 텍스트 대안입니다.
- 별을 radio 5개로 나누지 않은 이유: 값 문구(`aria-valuetext`)를 실을 곳이 없고, 20px 별 하나하나가 24×24 최소 타깃 크기(WCAG 2.5.8) 아래의 개별 타깃이 됩니다. 같은 이유로 `Stepper`도 값에 `role="spinbutton"`을 씁니다.
- **반개 별은 없습니다.** 글리프가 `star` / `star-fill` 두 종류뿐이라 소수 값은 `Math.floor`로 채우고(4.5 → 별 4개), 낭독되는 값은 소수를 그대로 유지합니다. 반개 표시가 필요하면 값을 정수로 반올림해 전달하세요.
