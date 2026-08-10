# Status Indicator

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `StatusIndicator` |
| Storybook | `LDS Core/Components/Status/Status Indicator` |
| Source | `../component-content.json#core-components-status-status-indicator` |

온라인·재연결·데이터 지연·오프라인처럼 계속 관찰되는 신호를 표시할 때 사용합니다. 진행·마감·게시처럼 정적인 결과에는 사용하지 않고 상태 배지를 선택합니다. 점만으로 의미를 전달하거나 단순 장식으로 pulse를 켜지 마세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `StatusTone` | No | 실시간 가용성·연결·freshness를 나타내는 점 톤. @default "positive" |
| `pulse` | `boolean` | No | 실제로 변화 중인 연결·동기화 상태에만 사용하는 부드러운 펄스. @default false |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | 실시간 가용성·연결·freshness를 나타내는 점 톤. @default "positive" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | anatomy는 6px semantic dot + neutral 12px label입니다. 배경 상자를 만들지 않아 상태 라벨과 시각적으로 섞이지 않습니다. |
| 명시 규칙 2 | WCAG 2.2 Use of Color는 색만으로 정보를 전달하지 않도록 요구합니다. 따라서 label 없는 dot API는 제공하지 않습니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- Spectrum Status light는 semantic dot과 회색 label을 함께 사용하고, label을 필수로 두며 긴 텍스트는 wrap하도록 합니다. LDS도 색을 보조 단서로만 사용합니다.

## Content and writing

- 현재 결과나 수명주기 상태를 채움 라벨로 표시할 때는 StatusBadge를 사용합니다. StatusIndicator는 연결·가용성·freshness처럼 계속 관찰되는 신호에만 사용합니다.
- pulse는 연결 중·재연결 중처럼 실제 변화 중인 신호에만 명시합니다. prefers-reduced-motion에서는 멈추고 라벨만으로 의미가 유지됩니다. critical은 정적 이중 링을 보조 단서로 제공하지만 자동 pulse하지 않습니다.
- StatusIndicator는 실시간 가용성·연결·freshness를 컬러 점과 명시적 라벨로 보여주는 조용한 Core 신호입니다.
- Storybook에서 steady/pulse/offline/critical, 긴 label, light/dark와 reduced motion을 확인합니다.

## Accessibility

- dot은 aria-hidden이며 visible label이 접근 가능한 상태 이름을 제공합니다. 컴포넌트는 자동 live region을 만들지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Overline` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<StatusIndicator tone="positive">온라인</StatusIndicator>
<StatusIndicator tone="cautionary" pulse>재연결 중</StatusIndicator>
<StatusIndicator tone="offline">오프라인</StatusIndicator>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--component-status-badge-cautionary-indicator`
- `--component-status-badge-negative-indicator`
- `--component-status-badge-offline-indicator`
- `--component-status-badge-positive-indicator`
- `--component-status-badge-signal-indicator`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--space-1`
- `--space-1-5`

### Source contracts

- `components/content/StatusIndicator.jsx`
- `components/content/StatusIndicator.d.ts`
- `components/content/StatusIndicator.prompt.md`
- `stories/StatusIndicator.stories.jsx`

## Sources

- StatusIndicator prompt contract: `components/content/StatusIndicator.prompt.md`
- Storybook implementation evidence: `stories/StatusIndicator.stories.jsx`
- [Spectrum Status light](https://spectrum.adobe.com/page/status-light/)
- [WCAG 2.2 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
