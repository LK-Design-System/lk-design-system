# Icon

Use `Icon` for every product glyph before introducing a new drawing.

## Source

- The base registry is imported from Wanted Design System Community icon exports.
- Normal and navigation icons are normalized to `currentColor`.
- Color brand icons keep their original WDS fills and are exposed with the `color-` prefix.
- LK Robotics-only glyphs remain as a small extension set when WDS has no matching asset.

## Usage

```jsx
import { Icon } from '@lk-design-system/design-system-core';

// 장식용(기본값) — aria-hidden="true"로 렌더되어 보조기술이 건너뜁니다.
<Icon name="search" />
<Icon name="route" color="var(--color-semantic-primary-normal)" />
<Icon name="color-logo-kakao" size={32} />

// 정보 전달용 — 명시적 이름을 주면 role="img"로 승격됩니다.
<Icon name="triangle-exclamation" aria-label="주의" />
<Icon name="battery-charging" title="충전 중" />
```

## Accessibility: 장식용 vs 정보 전달용

`Icon`의 기본값은 **장식(decorative)** 입니다. `aria-label`이나 `title` 없이 쓰면
`aria-hidden="true"`가 붙고 `role`은 붙지 않아 접근성 트리에서 제외됩니다.
registry key(`chevron-right`, `square` 등)는 절대 접근 가능한 이름으로 노출되지
않습니다. 이는 Material, Carbon, Polaris, Fluent가 공유하는 기본값과 같습니다.

| 상황 | 작성법 | 결과 |
| --- | --- | --- |
| 보이는 텍스트 옆의 보조 글리프 | `<Icon name="download" />` | `aria-hidden="true"`, 이름 없음 |
| 라벨이 있는 아이콘 전용 컨트롤 | `<IconButton label="내보내기" icon="download" />` | 이름은 버튼이 제공, 글리프는 장식 |
| 글리프 자체가 유일한 정보 | `<Icon name="circle-check" aria-label="검증 완료" />` | `role="img"` + 해당 이름 |

규칙:

- 아이콘이 옆의 텍스트를 반복한다면 장식입니다. 이름을 붙이면 스크린리더가 같은
  내용을 두 번 읽습니다.
- 아이콘 전용 컨트롤의 이름은 **컨트롤**이 갖습니다. `IconButton`·`Button`·`Fab`의
  `label` prop을 쓰고, 내부 글리프는 기본값(장식) 그대로 둡니다.
- `aria-label`/`title`은 글리프가 유일한 정보 전달 수단일 때만 씁니다. 이때
  이름은 아이콘 모양이 아니라 **의미**를 적습니다("삼각형 느낌표"가 아니라 "주의").
- `aria-hidden`을 직접 넘기면 그 값이 우선합니다. 기본값이 이미 장식이므로 새
  코드에서 `aria-hidden="true"`를 반복해 적을 필요는 없습니다.

## Rules

- Check `ICON_NAMES` first. Do not hand-draw an inline SVG for a common action, status, editor, navigation, or brand glyph.
- Use semantic names from the registry instead of inventing local aliases.
- Prefer WDS icons for general UI. Use LK Robotics extension icons only for robotics-specific concepts such as robot, route, waypoint, LiDAR, battery, or joystick.
- Monochrome icons inherit `currentColor`; set color on the parent or with the `color` prop.
- WDS Content/Icon evidence shows icons as supplemental content glyphs. Keep sizing explicit (`16`, `20`, `24`, `32`, or `40`).
- 아이콘은 기본이 장식입니다. 위 "Accessibility: 장식용 vs 정보 전달용"을 따르세요.
- Icon-only controls must provide an accessible label through the wrapping control (`IconButton`/`Button`/`Fab`의 `label`) or an explicit `aria-label`.
- New icons must be added to the source icon inventory and regenerated with `scripts/generate-icons.mjs`; do not edit `Icon.jsx` by hand. 접근성 기본값은 `scripts/generate-icons.mjs`의 컴포넌트 템플릿에도 함께 반영되어야 합니다.

## Evidence

- Source assets: `assets/icons/*.svg`
- Inventory: `assets/icons/manifest.json`
- Public registry: `components/icon/Icon.jsx`
- Storybook: `stories/Iconography.stories.jsx`
