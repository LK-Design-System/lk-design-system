# Spec Row

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `SpecRow` |
| Storybook | `LDS Product/Content/Spec Row` |
| Source | `../component-content.json#product-content-spec-row` |

제품 제원이나 읽기 전용 설정처럼 짧은 label/value 쌍을 일정한 간격으로 보여 줄 때 적합합니다. 정렬·정렬 변경이 필요한 대규모 데이터나 편집 입력에는 SpecRow 대신 Table 또는 Form Field를 사용하세요.

## 사용 판단

### 사용

- 제품 제원이나 읽기 전용 설정처럼 짧은 label/value 쌍을 일정한 간격으로 보여 줄 때 적합합니다. 정렬·정렬 변경이 필요한 대규모 데이터나 편집 입력에는 SpecRow 대신 Table 또는 Form Field를 사용하세요.
- SpecRow — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 data-theme="dark" 래퍼 안에 쌓으세요.
- Spec Row가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 SpecRow API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Spec Row가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | SpecRow의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 스펙 이름(왼쪽, 뮤트 — label-alternative). dt로 렌더됩니다. |
| Label Width | 라벨 컬럼 폭. DescriptionList와 동일 비율. @default "34%" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 스펙 이름(왼쪽, 뮤트 — label-alternative). dt로 렌더됩니다. |
| `value` | `React.ReactNode` | No | 스펙 값(오른쪽 — label-normal, tabular-nums). dd로 렌더됩니다. |
| `labelWidth` | `string` | No | 라벨 컬럼 폭. DescriptionList와 동일 비율. @default "34%" |
| `divider` | `boolean` | No | 하단 헤어라인. 목록의 마지막 행에서 false로 끕니다. @default true |
| `grouped` | `boolean` | No | 여러 행이 하나의 사양표를 이룰 때 사용합니다. 호출부가 바깥에 dl을 두고 각 행에 grouped를 주면 행은 dl의 유효한 래퍼(div)로 렌더되어 사양표 전체가 하나의 정의 목록으로 읽힙니다. 기본값(false)에서는 행 자체가 단일 쌍 dl이 됩니다. |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- divider: 기본 true. 마지막 행에만 divider={false}를 주어 목록이 컨테이너 모서리에서 닫히게 하고 헤어라인이 홀로 남지 않게 합니다.
- 정렬·필터가 필요한 대규모 데이터는 Table, 편집 가능한 값은 Form Field를 쓰세요.
- SpecRow — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 data-theme="dark" 래퍼 안에 쌓으세요.
- - 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. - 그룹핑: 여러 SpecRow가 하나의 사양표를 이루면 바깥에 을 두고 각 행에 grouped를 주세요. 그러면 행은 dl의 유효한 래퍼(div)가 되고 표 전체가 하나의 정의 목록으로 읽힙니다. grouped 없이 쌓으면 행마다 별도의 단일 쌍 dl이 되며(유효하지만 목록 하나로 묶이지는 않습니다), 한두 행짜리 요약에는 그 편….
- SpecRow의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. |
| 명시 규칙 2 | labelWidth: 라벨 컬럼 폭(기본 "34%"). 라벨이 길어 두 줄로 접힐 때만 조정하고, 같은 표 안의 행들은 같은 값을 유지해 값 컬럼이 어긋나지 않게 합니다. |
| 명시 규칙 3 | SpecRow — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 data-theme="dark" 래퍼 안에 쌓으세요. |
| 명시 규칙 4 | - 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. - 그룹핑: 여러 SpecRow가 하나의 사양표를 이루면 바깥에 을 두고 각 행에 grouped를 주세요. 그러면 행은 dl의 유효한 래퍼(div)가 되고 표 전체가 하나의 정의 목록으로 읽힙니다. grouped 없이 쌓으면 행마다 별도의 단일 쌍 dl이 되며(유효하지만 목록 하나로 묶이지는 않습니다), 한두 행짜리 요약에는 그 편… |
| --body2-line | 22px |

## Responsive

- labelWidth: 라벨 컬럼 폭(기본 "34%"). 라벨이 길어 두 줄로 접힐 때만 조정하고, 같은 표 안의 행들은 같은 값을 유지해 값 컬럼이 어긋나지 않게 합니다.
- - 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. - 그룹핑: 여러 SpecRow가 하나의 사양표를 이루면 바깥에 을 두고 각 행에 grouped를 주세요. 그러면 행은 dl의 유효한 래퍼(div)가 되고 표 전체가 하나의 정의 목록으로 읽힙니다. grouped 없이 쌓으면 행마다 별도의 단일 쌍 dl이 되며(유효하지만 목록 하나로 묶이지는 않습니다), 한두 행짜리 요약에는 그 편….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다.
- labelWidth: 라벨 컬럼 폭(기본 "34%"). 라벨이 길어 두 줄로 접힐 때만 조정하고, 같은 표 안의 행들은 같은 값을 유지해 값 컬럼이 어긋나지 않게 합니다.
- SpecRow — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 data-theme="dark" 래퍼 안에 쌓으세요.
- - 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. - 그룹핑: 여러 SpecRow가 하나의 사양표를 이루면 바깥에 을 두고 각 행에 grouped를 주세요. 그러면 행은 dl의 유효한 래퍼(div)가 되고 표 전체가 하나의 정의 목록으로 읽힙니다. grouped 없이 쌓으면 행마다 별도의 단일 쌍 dl이 되며(유효하지만 목록 하나로 묶이지는 않습니다), 한두 행짜리 요약에는 그 편….

## Accessibility

- 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다.
- - 키/값 시맨틱: label은 dt, value는 dd로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다. - 그룹핑: 여러 SpecRow가 하나의 사양표를 이루면 바깥에 을 두고 각 행에 grouped를 주세요. 그러면 행은 dl의 유효한 래퍼(div)가 되고 표 전체가 하나의 정의 목록으로 읽힙니다. grouped 없이 쌓으면 행마다 별도의 단일 쌍 dl이 되며(유효하지만 목록 하나로 묶이지는 않습니다), 한두 행짜리 요약에는 그 편….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | SpecRow — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 data-theme="dark" 래퍼 안에 쌓으세요. |
| Don't | Spec Row가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | Spec Row가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 SpecRow의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Card` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChecklistItem` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeatureCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeedCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListingCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MetricCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NewsCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ProductCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
// 한 행짜리 — 행 자체가 단일 쌍 dl
<SpecRow label="크기" value="520 × 420 × 490 mm" />

// 여러 행이 한 사양표 — 바깥 dl + grouped
<dl style={{ margin: 0 }}>
  <SpecRow grouped label="크기" value="520 × 420 × 490 mm" />
  <SpecRow grouped label="밀도" value="compact · regular" />
  <SpecRow grouped label="테마" value="light · dark" divider={false} />
</dl>

// 네이비 제품 무대 위:
<div data-theme="dark">
  <SpecRow label="상태" value="active · review · disabled" />
</div>
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--body2-spacing`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--fw-semibold`
- `--label1-size`
- `--ls-small`

### Source contracts

- `components/cards/SpecRow.jsx`
- `components/cards/SpecRow.d.ts`
- `components/cards/SpecRow.prompt.md`
- `stories/CardSpecs.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- SpecRow prompt contract: `components/cards/SpecRow.prompt.md`
- Storybook implementation evidence: `stories/CardSpecs.stories.jsx`
