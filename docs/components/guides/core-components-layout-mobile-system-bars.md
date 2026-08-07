# Mobile System Bars

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `MobileSystemBars` |
| Storybook | `LDS Core/Components/Layout/Mobile System Bars` |
| Source | `../component-content.json#core-components-layout-mobile-system-bars` |

iOS·Android 화면 시안과 셸에서 상태 바와 하단 홈 영역을 포함한 전체 프레임을 검토할 때 적합합니다. 실제 웹 콘텐츠의 일반 여백은 Container나 Stack을 사용하고, 데스크톱 화면에 모바일 시스템 바를 장식처럼 추가하지 마세요.

## 사용 판단

### 사용하지 않음

- Do not use this component as production OS chrome.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `platform` | `'ios' \| 'android'` | No | Platform chrome style. @default "ios" |
| `showStatus` | `boolean` | No | Show the status bar row. @default true |
| `showHome` | `boolean` | No | Show the home indicator row. @default true |
| `time` | `string` | No | Status bar time label. @default "9:41" |

## States

| State | Contract |
| --- | --- |
| showStatus | Show the status bar row. @default true |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --fw-bold | 700 |
| --mobile-home-indicator-height | 34px |
| --mobile-status-bar-min-height | 44px |

## Responsive

- Use only in design-system examples, prototypes, and mock mobile frames.
- Keep safe-area spacing separate through --mobile-safe-area-top and --mobile-safe-area-bottom.
- MobileSystemBars renders WDS Layout/Essential status and home bars for mobile previews.

## Related components

| Component | Relationship |
| --- | --- |
| `Stack` | 대표 시나리오에서 조합 |
| `Tag` | 대표 시나리오에서 조합 |
| `AspectRatio` | 대표 시나리오에서 조합 |
| `Center` | 대표 시나리오에서 조합 |
| `Cluster` | 대표 시나리오에서 조합 |
| `Col` | 대표 시나리오에서 조합 |
| `Columns` | 대표 시나리오에서 조합 |
| `Container` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<MobileSystemBars platform="ios" />
<MobileSystemBars platform="android" showHome={false} />
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--component-system-bars-fg`
- `--component-system-bars-home-height`
- `--component-system-bars-home-width`
- `--component-system-bars-muted-fg`
- `--fw-bold`
- `--mobile-home-indicator-height`
- `--mobile-status-bar-min-height`
- `--radius-pill`
- `--space-4`

### Source contracts

- `components/layout/MobileSystemBars.jsx`
- `components/layout/MobileSystemBars.d.ts`
- `components/layout/MobileSystemBars.prompt.md`
- `stories/LayoutEssentials.stories.jsx`

## Sources

- MobileSystemBars prompt contract: `components/layout/MobileSystemBars.prompt.md`
- Storybook implementation evidence: `stories/LayoutEssentials.stories.jsx`
