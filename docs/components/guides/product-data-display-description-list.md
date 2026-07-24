# Description List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Display |
| Owner | `DescriptionList` |
| Storybook | `LDS Product/Data/Display/Description List` |
| Source | `../component-content.json#product-data-display-description-list` |

한 객체의 제원·담당자·점검일처럼 소수의 용어와 값을 설명할 때 적합합니다. 많은 행을 정렬·탐색하거나 여러 객체를 비교해야 하면 Description List 대신 Table 또는 Data Grid를 사용하세요.

## 사용 판단

### 사용

- 한 객체의 제원·담당자·점검일처럼 소수의 용어와 값을 설명할 때 적합합니다. 많은 행을 정렬·탐색하거나 여러 객체를 비교해야 하면 Description List 대신 Table 또는 Data Grid를 사용하세요.
- Description List가 소유하는 Display 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 DescriptionList API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Description List가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DescriptionList의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Items | items 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `DescriptionItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `columns` | `number` | No | 쌍의 그리드 컬럼 수. @default 1 |
| `variant` | `'default' \| 'stacked'` | No | stacked는 좁은 패널·카드용으로 용어를 값 위에 쌓고 값을 regular 굵기로 표시합니다. @default "default" |

## States

| State | Contract |
| --- | --- |
| variant | stacked는 좁은 패널·카드용으로 용어를 값 위에 쌓고 값을 regular 굵기로 표시합니다. @default "default" 타입 계약: 'default' \| 'stacked' |

## Behavior and interaction

- variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행). 넓은 사양·제원 표면에는 기본형을 유지합니다.
- - items — { term, description }. columns — 쌍의 반응형 그리드. - 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다. - variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행….
- DescriptionList의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 DescriptionList는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다. |
| 명시 규칙 2 | - items — { term, description }. columns — 쌍의 반응형 그리드. - 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다. - variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행… |
| --body2-line | 22px |
| --body2-size | 15px |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- items — { term, description }. columns — 쌍의 반응형 그리드.
- variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행). 넓은 사양·제원 표면에는 기본형을 유지합니다.
- - items — { term, description }. columns — 쌍의 반응형 그리드. - 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다. - variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- items — { term, description }. columns — 쌍의 반응형 그리드.
- 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다.
- DescriptionList — 키/값 쌍(사양, 제원).
- - items — { term, description }. columns — 쌍의 반응형 그리드. - 타입 스케일 정합: 값(dd) 14.5px → --body2-size(15px)로 스냅했습니다. 14px 용어(dt)보다 한 단계 위를 유지해 term/description 위계가 살아 있습니다. - variant="stacked" — 좁은 상세 패널·카드용. 용어를 값 위에 쌓아 고정 용어 열의 폭 낭비를 없애고, 값을 regular 굵기로 두어 일부 값(badge 등)만 강조가 살도록 합니다(Salesforce·Jira 상세 패널의 stacked field 관행….

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Description List가 소유하는 Display 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Description List가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 제품별 구현 대신 공개 DescriptionList API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DescriptionList의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DescriptionList columns={2} items={[
  { term: '주행 속도', description: '최대 1.5 m/s' },
  { term: '운영 시간', description: '8시간 (연속)' },
  { term: '방수·방진', description: 'IP65' },
]} />
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--font-sans`
- `--fw-semibold`
- `--label1-size`
- `--space-1`
- `--space-4`

### Source contracts

- `components/data/DescriptionList.jsx`
- `components/data/DescriptionList.d.ts`
- `components/data/DescriptionList.prompt.md`
- `stories/DataDescriptionList.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DescriptionList prompt contract: `components/data/DescriptionList.prompt.md`
- Storybook implementation evidence: `stories/DataDescriptionList.stories.jsx`
