# Icon

Use `Icon` for every product glyph before introducing a new drawing.

## Source

- The base registry is imported from Wanted Design System Community icon exports.
- Normal and navigation icons are normalized to `currentColor`.
- Color brand icons keep their original WDS fills and are exposed with the `color-` prefix.
- LK Robotics-only glyphs remain as a small extension set when WDS has no matching asset.

### AI/ML model glyph decision

- Owner and provenance: `core` / `wds-adjacent`. `model` is a public base-registry
  name, but its artwork is a licensed repository-local extension rather than WDS
  source evidence.
- Semantic role: a stored or deployed AI/ML model artifact. Keep `sparkle`,
  `magic-wand`, and `ai-review` for AI actions and review behavior.
- Registry review: `storage` already means datasets; `component`, `instance`, and
  `template` describe different objects; the `lds-legacy` `layers` glyph uses a
  stroke treatment that does not match the filled base set.
- Geometry: Material Symbols `deployed_code` (rounded, filled, 24 px) supplies the
  cube form under Apache-2.0. The path stays on its native `0 -960 960 960`
  viewBox and inherits `currentColor`.
- Naming: Carbon's official icon library exposes `Model` and `Machine learning
  model`, so LDS uses the semantic registry name `model` instead of the visual
  name `cube`.
- Intended use: catalog or navigation destinations that list model artifacts.
  It does not mean “run AI”, “generate”, “review”, or a generic software package.
- References:
  [Material Symbols source](https://github.com/google/material-design-icons/tree/master/symbols/web/deployed_code) ·
  [Material Symbols license](https://github.com/google/material-design-icons/blob/master/LICENSE) ·
  [Carbon icon library](https://v10.carbondesignsystem.com/guidelines/icons/library/)

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

## 등록되지 않은 name

registry에 없는 `name`은 저작 실수입니다. 예전에는 아무 신호 없이 빈 `<svg>`가
렌더링되어 오타가 프로덕션까지 그대로 나갔습니다(`name="warning"` — registry에는
`triangle-exclamation`/`circle-exclamation`만 있습니다). 현재 동작은 다음과 같습니다.

| 입력 | 동작 |
| --- | --- |
| registry에 있는 name | 해당 글리프 |
| registry에 없는 비어 있지 않은 name | `blank` placeholder 글리프 + `data-icon-missing="<name>"`, 개발 빌드에서 `console.warn` 1회 |
| `name` 없음/빈 문자열 | 빈 `<svg>`, 경고 없음 — "아이콘 없음"을 의도한 선택적 슬롯 |

- 경고는 사용 가능한 근접 이름을 함께 제시합니다(편집 거리 + 부분 문자열). 예:
  `Icon: "batery" is not in the icon registry … Did you mean "battery"?`
- 경고는 name당 1회만 출력되고, 번들러가 `process.env.NODE_ENV`를 치환하므로
  production 빌드에서는 분기 자체가 사라집니다.
- placeholder는 새 아트워크가 아니라 기존 registry의 `blank`(점선 사각형)입니다.
  "글리프가 들어갈 자리인데 비어 있다"로 읽히며, `circle-question` 같은 의미 있는
  글리프를 대신 그려서 의도된 아이콘으로 오해되지 않게 합니다.
- 결손 탐지는 `data-icon-missing` 속성으로 할 수 있습니다(제품 스모크 테스트에서
  `document.querySelector('[data-icon-missing]')` 확인).

## Rules

- Check `ICON_NAMES` first. Do not hand-draw an inline SVG for a common action, status, editor, navigation, or brand glyph.
- Use semantic names from the registry instead of inventing local aliases.
- Prefer WDS icons for general UI. Use LK Robotics extension icons only for robotics-specific concepts such as robot, route, waypoint, LiDAR, battery, or joystick.
- Monochrome icons inherit `currentColor`; set color on the parent or with the `color` prop.
- WDS Content/Icon evidence shows icons as supplemental content glyphs. Keep sizing explicit (`16`, `20`, `24`, `32`, or `40`).
- 아이콘은 기본이 장식입니다. 위 "Accessibility: 장식용 vs 정보 전달용"을 따르세요.
- Icon-only controls must provide an accessible label through the wrapping control (`IconButton`/`Button`/`Fab`의 `label`) or an explicit `aria-label`.
- 등록되지 않은 `name`은 개발 빌드에서 경고하고 `blank` placeholder를 그립니다. 위 "등록되지 않은 name"을 참고하세요.
- New icons must be added to the source icon inventory and regenerated with `scripts/generate-icons.mjs`; do not edit `Icon.jsx` by hand. 접근성 기본값은 `scripts/generate-icons.mjs`의 컴포넌트 템플릿에도 함께 반영되어야 합니다.

## Evidence

- Source assets: `assets/icons/*.svg`
- Inventory: `assets/icons/manifest.json`
- Public registry: `components/icon/Icon.jsx`
- Storybook: `stories/Iconography.stories.jsx`
