**PinInput** — 코드 / OTP용 단일 문자 박스 행.

```jsx
<PinInput length={6} onComplete={verify} />
<PinInput length={4} mask onChange={setPin} />
```

- **length** — 박스 수. **value / defaultValue / onChange** — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. **onComplete**는 공백 없는 완성 문자열로 발생합니다. **mask** — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다.
- 각 cell은 group `aria-label`을 위치와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다.

## External research basis

- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다.
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다.
