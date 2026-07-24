# Page Indicator

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Navigation |
| Owner | `PageIndicator` |
| Storybook | `LDS Core/Components/Navigation/Page Indicator` |
| Source | `../component-content.json#core-components-navigation-page-indicator` |

캐러셀이나 단계별 콘텐츠처럼 앞뒤 이동은 다른 제어가 담당하고 현재 위치만 간결하게 알려줄 때 적합합니다. 사용자가 특정 페이지를 직접 선택해야 하면 Pagination을, 업무 단계의 이름과 완료 상태를 설명해야 하면 Stepper를 사용하세요.

## 사용 판단

### 사용

- 캐러셀이나 단계별 콘텐츠처럼 앞뒤 이동은 다른 제어가 담당하고 현재 위치만 간결하게 알려줄 때 적합합니다. 사용자가 특정 페이지를 직접 선택해야 하면 Pagination을, 업무 단계의 이름과 완료 상태를 설명해야 하면 Stepper를 사용하세요.
- Use the counter form for onboarding or carousel pages with numeric context.
- Use dots for lightweight page/slide position. Use full Pagination for table paging.
- - Use the counter form for onboarding or carousel pages with numeric context. - Use dots for lightweight page/slide position. Use full Pagination for table paging. - 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요. - onChange를 넘….

### 사용하지 않음

- Page Indicator가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | PageIndicator의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Group Label | Accessible name of the dot group container. @default "페이지 표시기" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `page` | `number` | No | Current page, 1-based. @default 1 |
| `count` | `number` | No | Total pages. @default 1 |
| `variant` | `"counter" \| "dot" \| "dots"` | No | Counter pill or dot indicator. @default "counter" |
| `size` | `"small" \| "sm" \| "medium" \| "md"` | No | size axis: counter small 26, counter medium 34; dot small 6, dot medium 10. @default "medium" |
| `alternative` | `boolean` | No | Alternative dark counter/dot treatment. @default false |
| `onChange` | `(page: number) = void` | No | Enables clickable dots when variant="dot". Each dot becomes a button labeled "{n}페이지로 이동" with a 24x24px minimum hit area (WCAG 2.5.8) around the unchanged visual dot. |
| `groupLabel` | `string` | No | Accessible name of the dot group container. @default "페이지 표시기" |

## States

| State | Contract |
| --- | --- |
| variant | Counter pill or dot indicator. @default "counter" 타입 계약: "counter" \| "dot" \| "dots" |
| 상호작용 · 도트 클릭 이동과 히트 영역 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Use dots for lightweight page/slide position. Use full Pagination for table paging.
- onChange를 넘기면 도트가 버튼이 되어 각각 "{n}페이지로 이동" 레이블과 24×24px 최소 히트 영역(WCAG 2.5.8)을 가집니다. 시각적 도트 크기는 그대로이며 투명한 히트 박스만 커집니다.
- - Use the counter form for onboarding or carousel pages with numeric context. - Use dots for lightweight page/slide position. Use full Pagination for table paging. - 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요. - onChange를 넘….
- PageIndicator의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | onChange를 넘기면 도트가 버튼이 되어 각각 "{n}페이지로 이동" 레이블과 24×24px 최소 히트 영역(WCAG 2.5.8)을 가집니다. 시각적 도트 크기는 그대로이며 투명한 히트 박스만 커집니다. |
| 명시 규칙 2 | - Use the counter form for onboarding or carousel pages with numeric context. - Use dots for lightweight page/slide position. Use full Pagination for table paging. - 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요. - onChange를 넘… |
| --body2-size | 15px |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Responsive

- PageIndicator - compact WDS page counter or dot indicator.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Use the counter form for onboarding or carousel pages with numeric context.
- 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요.
- 카운터는 보이는 {page} / {count} 텍스트를 그대로 읽는 일반 텍스트입니다(별도 role·aria-label 없음).
- - Use the counter form for onboarding or carousel pages with numeric context. - Use dots for lightweight page/slide position. Use full Pagination for table paging. - 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요. - onChange를 넘….

## Accessibility

- 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요.
- onChange를 넘기면 도트가 버튼이 되어 각각 "{n}페이지로 이동" 레이블과 24×24px 최소 히트 영역(WCAG 2.5.8)을 가집니다. 시각적 도트 크기는 그대로이며 투명한 히트 박스만 커집니다.
- 카운터는 보이는 {page} / {count} 텍스트를 그대로 읽는 일반 텍스트입니다(별도 role·aria-label 없음).
- - Use the counter form for onboarding or carousel pages with numeric context. - Use dots for lightweight page/slide position. Use full Pagination for table paging. - 접근성: 비상호작용 도트는 장식(aria-hidden)으로 처리하고, 그룹 안의 시각적으로 숨긴 텍스트가 "{page}번째 / 전체 {count}" 형태로 현재 위치를 알립니다. 그룹 이름은 groupLabel(기본값 페이지 표시기)로 지역화하세요. - onChange를 넘….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use the counter form for onboarding or carousel pages with numeric context. |
| Don't | Page Indicator가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | Use dots for lightweight page/slide position. Use full Pagination for table paging. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 PageIndicator의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Category` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Pagination` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Tabs` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<PageIndicator page={1} count={10} />
<PageIndicator variant="dot" page={2} count={5} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-disable-soft`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fw-semibold`
- `--label2-size`
- `--radius-pill`

### Source contracts

- `components/navigation/PageIndicator.jsx`
- `components/navigation/PageIndicator.d.ts`
- `components/navigation/PageIndicator.prompt.md`
- `stories/NavigationPageIndicator.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- PageIndicator prompt contract: `components/navigation/PageIndicator.prompt.md`
- Storybook implementation evidence: `stories/NavigationPageIndicator.stories.jsx`
