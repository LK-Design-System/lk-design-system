**Lightbox** — 거의 검정에 가까운 스크림 위 전체 화면 이미지 뷰어.

```jsx
<Lightbox open={open} images={photos} index={idx} onClose={close} onIndexChange={setIdx} />
```

- **images** — URL 또는 `{ src, alt }`. **open / index / onClose / onIndexChange** — 제어형. 화살표 키 / Esc 지원.
