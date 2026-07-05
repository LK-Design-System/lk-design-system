**PinInput** — 코드 / OTP용 단일 문자 박스 행.

```jsx
<PinInput length={6} onComplete={verify} />
<PinInput length={4} mask onChange={setPin} />
```

- **length** — 박스 수. **value / defaultValue / onChange** — 문자열. **onComplete** — 다 채워지면 발생. **mask** — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다.
