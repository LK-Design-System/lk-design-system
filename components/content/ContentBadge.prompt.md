**ContentBadge** — WDS Content Badge. 특정 콘텐츠의 상태나 속성을 짧게 강조하는 작은 라벨입니다.

```jsx
<ContentBadge variant="solid" color="accent">Android</ContentBadge>
<ContentBadge variant="outlined" color="neutral" leading={<Icon name="webinar" />}>Web</ContentBadge>
<ContentBadge color="accent" accentBackgroundColor="#E4F6FB" accentContentColor="#007A9A">텍스트</ContentBadge>
```

- WDS axes: **variant** `solid · default · outlined`, **size** `xsmall · small · medium`, **color** `neutral · accent`, **icon** via `icon`, `leading`, or `trailing`.
- Legacy LDS aliases still work: `variant="soft"` maps to WDS `default`, `variant="outline"` maps to `outlined`, and `tone` can still be used for status-flavoured labels.
- Count/dot badges belong to `Badge`; live status with dot/text belongs to `StatusBadge`.
- ContentBadge는 비상호작용 정보 라벨 전용입니다. 클릭·선택되는 키워드에는 `Chip`, 대문자 이브로우 필에는 `Tag`를 쓰세요.

## 색 대비 규칙 (WCAG 1.4.3 AA)

- `variant="solid"` 은 채움 위에 **반전 텍스트**(`--color-semantic-background-normal-normal`)를 올립니다. 따라서 **채움색 자체가 AA 4.5:1** 을 넘어야 합니다.
- 원색 상태 토큰은 이 조건을 만족하지 않습니다 — `--color-semantic-status-positive` #13BE4C ≈ 2.5:1, `-cautionary` #EB9C33 ≈ 2.3:1, `-negative` #EE5656 ≈ 3.2:1. accent(#3878B3 ≈ 4.7:1)만 통과합니다.
- 그래서 solid 의 상태 톤 채움은 **AA `*-text` 토큰**(`--color-semantic-status-positive-text` 등)을 씁니다. 라이트에서는 진한 잉크(5.5–7.5:1), 다크에서는 밝은 톤 + 어두운 반전 텍스트로 뒤집혀 두 테마 모두 통과합니다.
- 원색 토큰은 여전히 `default`(soft) 배경 믹스와 `outlined` 테두리 믹스에 쓰입니다 — 이 두 변형의 **텍스트**는 원래부터 `*-text` 토큰입니다.
- `accentBackgroundColor` / `accentContentColor` 로 직접 색을 넣을 때는 대비를 직접 검증하세요. 컴포넌트가 보정하지 않습니다.
- 상태를 색으로만 전달하지 마세요(WCAG 1.4.1). 라벨 텍스트나 아이콘으로 의미를 함께 주세요.
