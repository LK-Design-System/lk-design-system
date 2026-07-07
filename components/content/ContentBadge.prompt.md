**ContentBadge** — WDS Content Badge. 특정 콘텐츠의 상태나 속성을 짧게 강조하는 작은 라벨입니다.

```jsx
<ContentBadge variant="solid" color="accent">Android</ContentBadge>
<ContentBadge variant="outlined" color="neutral" leading={<Icon name="webinar" />}>Web</ContentBadge>
<ContentBadge color="accent" accentBackgroundColor="#E4F6FB" accentContentColor="#007A9A">텍스트</ContentBadge>
```

- WDS axes: **variant** `solid · default · outlined`, **size** `xsmall · small · medium`, **color** `neutral · accent`, **icon** via `icon`, `leading`, or `trailing`.
- Legacy LDS aliases still work: `variant="soft"` maps to WDS `default`, `variant="outline"` maps to `outlined`, and `tone` can still be used for status-flavoured labels.
- Count/dot badges belong to `Badge`; live status with dot/text belongs to `StatusBadge`.
