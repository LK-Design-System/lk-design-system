# Stat List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `StatList` |
| Storybook | `LDS Product/Content/Stat List` |
| Source | `../component-content.json#product-content-stat-list` |

프로필·계정 마스트헤드의 메타 행이나 조직·리소스 요약처럼 라벨과 수가 짝지어 이어질 때 적합합니다. 값이 크게 서는 대시보드 지표 타일이나 헤어라인이 있는 블록형 사양 표에는 이 컴포넌트를 사용하지 마세요.

## 사용 판단

### 사용

- 프로필·계정 마스트헤드의 메타 행이나 조직·리소스 요약처럼 라벨과 수가 짝지어 이어질 때 적합합니다. 값이 크게 서는 대시보드 지표 타일이나 헤어라인이 있는 블록형 사양 표에는 이 컴포넌트를 사용하지 마세요.
- href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지 모른 채 도달하므로, 값만 링크로 만들지 않습니다.
- Stat List가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 StatList API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다.
- - items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. - 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). - href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지….
- Stat List가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | StatList의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `StatListItem[]` | No | 라벨-값 쌍 목록. 비어 있으면 아무것도 렌더하지 않습니다. |
| `size` | `'sm' \| 'md'` | No | 텍스트 크기. @default "md" |

## States

| State | Contract |
| --- | --- |
| 변형·상태 · 크기와 링크 없음 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다.
- 수의 계산·포맷(축약 등)과 route는 제품이 소유합니다. 큰 수를 줄이려면 값에 이미 축약된 문자열을 넣으세요.
- StatList — 라벨 붙은 스탯을 한 줄에 나열하는 인라인 목록: 팔로워 128 · 팔로잉 64 · 포인트 3,000P. 프로필·계정 마스트헤드의 메타 행, 조직 요약, 리소스 헤더에.
- - items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. - 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). - href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지….
- StatList의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). |
| 명시 규칙 2 | href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지 모른 채 도달하므로, 값만 링크로 만들지 않습니다. |
| 명시 규칙 3 | StatList — 라벨 붙은 스탯을 한 줄에 나열하는 인라인 목록: 팔로워 128 · 팔로잉 64 · 포인트 3,000P. 프로필·계정 마스트헤드의 메타 행, 조직 요약, 리소스 헤더에. |
| 명시 규칙 4 | - items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. - 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). - href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지… |
| --body2-size | 15px |

## Responsive

- size sm · md. 좁은 폭에서는 항목이 다음 줄로 wrap됩니다.
- - items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. - 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). - href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지….
- 레코드/프로필 마스트헤드의 "라벨 붙은 detail row"에서 도출했습니다 — Salesforce Lightning "Page Header — Record Home"이 제목 아래 라벨 붙은 compact-layout 필드 행을 두고, Shopify Polaris Page가 제목 주변 메타데이터를 슬롯으로 둡니다. 접근성 근거는 스탯을 시맨틱 목록으로 묶고 이동하는 스탯은 링크로 둔다는 관례입니다.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다.
- 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다).
- href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지 모른 채 도달하므로, 값만 링크로 만들지 않습니다.
- Stat과 다르다 — Stat은 값이 크게 서고 캡션이 아래 붙는 대시보드 메트릭 타일입니다. 여기 스탯은 한 줄에 라벨-값이 인라인으로 이어지는 헤더 메타 행이라 조판 목적이 다릅니다.

## Accessibility

- 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다).
- - items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. - 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). - href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지….
- 레코드/프로필 마스트헤드의 "라벨 붙은 detail row"에서 도출했습니다 — Salesforce Lightning "Page Header — Record Home"이 제목 아래 라벨 붙은 compact-layout 필드 행을 두고, Shopify Polaris Page가 제목 주변 메타데이터를 슬롯으로 둡니다. 접근성 근거는 스탯을 시맨틱 목록으로 묶고 이동하는 스탯은 링크로 둔다는 관례입니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지 모른 채 도달하므로, 값만 링크로 만들지 않습니다. |
| Don't | items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. |
| Do | Stat List가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | - items — { label, value, href } 배열. 비어 있으면 아무것도 렌더하지 않습니다. 라벨이 앞, 값이 뒤에 오고 값은 굵게·tabular-nums로 정렬되어 자릿수가 흔들리지 않습니다. - 시맨틱 목록 — ul role="list" + li로 렌더되어 보조기기가 "3개 중 2번째"처럼 개수와 위치를 낭독합니다. 맨 텍스트를 가운뎃점으로 잇지 않는 이유이기도 합니다(구분 기호는 낭독 소음이 됩니다). - href가 있으면 항목이 링크 — 접근 이름은 라벨+값(팔로워 128)으로 합성됩니다. 숫자만 링크로 두면 스크린리더 사용자가 무엇의 개수인지…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 StatList의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ExpandableText` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `LogViewer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ReactionBar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ReorderList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SourceDisclosure` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<StatList
  items={[
    { label: '팔로워', value: 128, href: '/followers' },
    { label: '팔로잉', value: 64, href: '/following' },
    { label: '포인트', value: '3,000P' },
  ]}
/>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--fw-bold`
- `--space-1`
- `--space-3`

### Source contracts

- `components/content/StatList.jsx`
- `components/content/StatList.d.ts`
- `components/content/StatList.prompt.md`
- `stories/ContentStatList.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- StatList prompt contract: `components/content/StatList.prompt.md`
- Storybook implementation evidence: `stories/ContentStatList.stories.jsx`
- [Salesforce Lightning "Page Header — Record Home"](https://www.lightningdesignsystem.com/components/page-headers/?variant=record-home)
- [Shopify Polaris Page](https://polaris.shopify.com/components/page)
