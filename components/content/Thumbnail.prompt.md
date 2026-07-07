**Thumbnail** — WDS Thumbnail. 일정한 비율로 이미지/비디오/플레이스홀더 콘텐츠를 미리 보여주는 미디어 타일입니다.

```jsx
<Thumbnail ratio="16/9" overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />
<Thumbnail ratio="4/5" radius={false} border />
<Thumbnail src="assets/products/lkr-t1.webp" ratio="4/3" alt="LKR-T1" />
```

- WDS ratio presets: `1/1 · 5/4 · 4/3 · 3/2 · 16/10 · 1.618/1 · 16/9 · 2/1 · 21/9 · 4/5 · 3/4 · 2/3 · 10/16 · 1/1.618 · 9/16 · 1/2 · 9/21`.
- **radius** is `true` by default and can be disabled or replaced with a custom length. **border** is `false` by default and maps to the WDS border toggle.
- Use `overlay`/`children` only for real content badges, play glyphs, duration, or state labels.
