**AspectRatio** — 미디어 / 지도 타일 / 비디오용 비율 고정 박스.

```jsx
<AspectRatio ratio={16/9}><img src="site.jpg" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></AspectRatio>
```

- **ratio** — 너비/높이(예: `16/9`, `1`, `4/3`). 자식이 채우고, 넘치면 잘립니다.
