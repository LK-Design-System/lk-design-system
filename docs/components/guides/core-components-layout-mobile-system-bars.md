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

### 사용

- iOS·Android 화면 시안과 셸에서 상태 바와 하단 홈 영역을 포함한 전체 프레임을 검토할 때 적합합니다. 실제 웹 콘텐츠의 일반 여백은 Container나 Stack을 사용하고, 데스크톱 화면에 모바일 시스템 바를 장식처럼 추가하지 마세요.
- Use only in design-system examples, prototypes, and mock mobile frames.
- MobileSystemBars renders WDS Layout/Essential status and home bars for mobile previews.
- Mobile System Bars가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Do not use this component as production OS chrome.
- - Use only in design-system examples, prototypes, and mock mobile frames. - Keep safe-area spacing separate through --mobile-safe-area-top and --mobile-safe-area-bottom. - Do not use this component as production OS chrome.
- Mobile System Bars가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | MobileSystemBars의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

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
| showStatus | Show the status bar row. @default true 타입 계약: boolean |

## Behavior and interaction

- MobileSystemBars의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 MobileSystemBars는 표시·입력 상태만 소유합니다.

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
- - Use only in design-system examples, prototypes, and mock mobile frames. - Keep safe-area spacing separate through --mobile-safe-area-top and --mobile-safe-area-bottom. - Do not use this component as production OS chrome.

## Content and writing

- 사용자에게 보이는 Mobile System Bars 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use only in design-system examples, prototypes, and mock mobile frames. |
| Don't | Do not use this component as production OS chrome. |
| Do | MobileSystemBars renders WDS Layout/Essential status and home bars for mobile previews. |
| Don't | - Use only in design-system examples, prototypes, and mock mobile frames. - Keep safe-area spacing separate through --mobile-safe-area-top and --mobile-safe-area-bottom. - Do not use this component as production OS chrome. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 MobileSystemBars의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AspectRatio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Center` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Cluster` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Col` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Columns` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Container` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Divider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Grid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--radius-xs`
- `--space-4`

### Source contracts

- `components/layout/MobileSystemBars.jsx`
- `components/layout/MobileSystemBars.d.ts`
- `components/layout/MobileSystemBars.prompt.md`
- `stories/LayoutEssentials.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- MobileSystemBars prompt contract: `components/layout/MobileSystemBars.prompt.md`
- Storybook implementation evidence: `stories/LayoutEssentials.stories.jsx`
