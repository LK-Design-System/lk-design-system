**DirectionalPad** — PTZ·짐벌·조그용 D-pad. 누르고 있으면 rate Hz로 반복 스텝, 탭은 1회. 아날로그는 Joystick.

```jsx
<DirectionalPad onStep={jog} rate={8} center="HOME" onCenter={home} />
```

- **onStep(dir)** (`up·down·left·right`) · **rate**(Hz) · **size** · **disabled** · **center / onCenter**. 화살표 키 지원.
