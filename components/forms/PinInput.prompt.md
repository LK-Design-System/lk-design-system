**PinInput** — 코드 / OTP용 단일 문자 박스 행.

```jsx
<PinInput length={6} onComplete={verify} />
<PinInput length={4} mask onChange={setPin} />
```

- **length** — 박스 수. **value / defaultValue / onChange** — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. **onComplete**는 공백 없는 완성 문자열로 발생합니다. **mask** — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다.
- **autoComplete** — 각 cell의 자동 채우기 힌트이며 기본값은 `one-time-code`입니다. 이 값이 있어야 iOS/Android가 수신한 SMS 인증 코드를 제안하고, 플랫폼이 코드 전체를 한 cell에 넣더라도 타이핑·붙여넣기와 같은 경로로 나머지 칸에 분배합니다. OTP가 아닌 고정 PIN에는 `off`를 넘기세요.
- **charset** — 허용 문자 집합(`numeric` 기본 · `alphanumeric` · `any`). 허용되지 않는 문자는 타이핑·붙여넣기·자동 채우기 어디에서도 cell에 남지 않으며, `numeric`일 때만 `inputMode="numeric"`을 내보내 숫자 키패드를 띄웁니다.
- **invalid** — 모든 cell에 `aria-invalid`와 오류 테두리를 적용해 form 수준 오류를 개별 cell까지 전달합니다.
- 각 cell은 group `aria-label`을 위치·전체 자릿수(`인증 코드 3/6`)와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다. group `aria-label` 기본값은 `인증 코드`입니다.
- ArrowLeft/ArrowRight로 cell 사이를 이동하고 Home/End로 처음·마지막 cell로 갑니다. Backspace는 빈 cell에서 이전 cell을 지우며 뒤로 갑니다.

## External research basis

- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다.
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다.
- [HTML autofill (`one-time-code`)](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)의 OTP 토큰을 기본값으로 사용합니다.
