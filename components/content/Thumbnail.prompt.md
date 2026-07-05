**Thumbnail** — 비율 고정 미디어 타일. 이미지를 `ratio`로 크롭하고 둥근 모서리 + 배지/재생 아이콘/재생시간용 오버레이 슬롯을 제공. `src` 없으면 중립 플레이스홀더.

```jsx
<Thumbnail src="assets/products/lkr-t1.webp" ratio={4 / 3} overlay={<Badge tone="signal">NEW</Badge>} />
<Thumbnail ratio={1} radius={false} />
```

- **ratio**는 너비/높이(정사각 1, 16:9는 `16 / 9`). **radius**: `true`(기본, `--radius-md`) · `false`(사각) · 숫자/문자열. **overlay**·**children**은 같은 코너 슬롯에 겹쳐 쌓임(`overlayAlign`으로 위치 지정).
