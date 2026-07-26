**Thumbnail** — WDS Thumbnail. 일정한 비율로 이미지/비디오/플레이스홀더 콘텐츠를 미리 보여주는 미디어 타일입니다.

```jsx
<Thumbnail ratio="16/9" overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />
<Thumbnail ratio="4/5" radius={false} border />
<Thumbnail src="assets/products/lkr-t1.webp" ratio="4/3" alt="LKR-T1" />
```

- WDS ratio presets: `1/1 · 5/4 · 4/3 · 3/2 · 16/10 · 1.618/1 · 16/9 · 2/1 · 21/9 · 4/5 · 3/4 · 2/3 · 10/16 · 1/1.618 · 9/16 · 1/2 · 9/21`.
- **radius** is `true` by default and can be disabled or replaced with a custom length. **border** is `false` by default and maps to the WDS border toggle.
- Use `overlay`/`children` only for real content badges, play glyphs, duration, or state labels.

## 대체 텍스트 (`alt`)

`alt` 는 기본값이 빈 문자열이므로, **아무것도 주지 않으면 장식 이미지로 취급**됩니다.

- **정보 전달 이미지** — 이미지가 주변 텍스트에 없는 정보를 담고 있으면 반드시 `alt` 를 쓰세요. 무엇이 보이는지 짧게 서술합니다: `alt="3층 창고 구역 미니맵"`. 파일명, "이미지", "썸네일" 같은 말은 넣지 않습니다.
- **장식 이미지** — 옆의 제목·설명이 이미 같은 정보를 주면 `alt=""`(기본값)로 두어 중복 낭독을 막습니다. 카드 안에서 제목과 짝을 이루는 대표 이미지가 여기에 해당합니다.
- `src` 가 없는 플레이스홀더 타일은 아이콘이 `aria-hidden` 이라 접근성 트리에 아무것도 남기지 않습니다 — 별도 `alt` 가 필요 없습니다.

## 오버레이 대비 (`overlayScrim`)

- 오버레이는 임의의 사진 위에 놓이므로, 사진이 밝으면 라벨 대비가 예고 없이 무너집니다. 그래서 오버레이가 있고 실제 이미지(`src`)가 있으면 오버레이 쪽 모서리에서 시작하는 **그라디언트 스크림**을 자동으로 깝니다(`overlayScrim="auto"`, 기본값). 피사체 전체를 어둡게 하지 않는 Material/영상 플레이어 관례입니다.
- 플레이스홀더 타일(`src` 없음)은 대비가 이미 결정된 토큰 표면이라 스크림을 넣지 않습니다. `overlayScrim` 에 `true`/`false` 를 직접 주면 이 판단을 덮어씁니다.
- 스크림은 보험이지 면제권이 아닙니다. **중요한 상태를 오버레이에만 의존하지 말고** 카드 텍스트에도 남기세요.
