# Disclosure

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Accordion` |
| Storybook | `LDS Core/Components/Content/Disclosure` |
| Source | `../component-content.json#core-components-content-disclosure` |

FAQ, 선택적 설명, 상세 로그처럼 모든 사용자가 즉시 읽을 필요가 없는 보조 콘텐츠에 적합합니다. 과업 완료에 필수인 정보나 오류는 접지 말고 바로 노출하며, 화면 이동이 필요한 계층 탐색에는 Navigation을 사용하세요.

## 사용 판단

### 사용

- FAQ, 선택적 설명, 상세 로그처럼 모든 사용자가 즉시 읽을 필요가 없는 보조 콘텐츠에 적합합니다. 과업 완료에 필수인 정보나 오류는 접지 말고 바로 노출하며, 화면 이동이 필요한 계층 탐색에는 Navigation을 사용하세요.
- - items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). - leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은….
- Disclosure가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Accordion API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은 대신 aria-describedby로 연결되어 이름은 짧게, 설명은 설명으로 낭독됩니다. title에 아이콘을 직접 넣으면 그 아이콘이 heading·버튼 이름 안으로 들어가므로 그렇게 하지 마세요.
- 접근성: 각 헤더 버튼은 실제 heading(기본 )으로 감싸집니다 — APG Accordion 은 "each accordion header is contained in an element with role heading"을 요구하며, 이 래퍼 덕분에 스크린리더 사용자가 heading 탐색(H 키)으로 섹션 사이를 건너뛸 수 있습니다. 래퍼는 margin: 0; font: inherit 이라 시각은 버튼이 그대로 소유합니다. 주변 문서의 제목 계층에 맞춰 headingLevel 을 조정하고(레벨 건너뛰기 금지), 바깥에서 이미 heading 을 제공하면 headin….
- - items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). - leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은….
- Disclosure가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Accordion의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | Yes | 행 — 각각 { title, content }. |
| `multiple` | `boolean` | No | 한 번에 여러 행 열기 허용. @default false |
| `defaultOpen` | `number[]` | No | 마운트 시 열려 있는 인덱스. @default [] |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 각 헤더 트리거를 감싸는 heading 레벨(APG: "each accordion header is contained in an element with role heading"). false 면 heading 래퍼 없이 버튼만 렌더링합니다. |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultOpen` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| defaultOpen | 마운트 시 열려 있는 인덱스. @default [] 타입 계약: number[] |
| defaultOpen | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| 변형·상태 · 아이콘과 설명 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3).
- 접근성: 각 트리거는 aria-expanded + aria-controls로 자신의 패널을 가리키고, 패널은 role="region" + aria-labelledby로 트리거와 연결됩니다. 접힌 패널은 inert로 접근성 트리·탭 포커스 순서에서 제거되어 aria-expanded=false와 상태가 일치합니다(시각 리빌 전환은 유지). Collapsible도 같은 계약을 공유합니다.
- Accordion — FAQ / 스펙 그룹용 디스클로저 리스트. 열린 헤더는 시그널 잉크를 띠고, 셰브론이 뒤집히며, 본문이 차분한 grid-rows 트랜지션으로 드러납니다.
- - items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). - leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은….
- Accordion의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). |
| 명시 규칙 2 | 접근성: 각 헤더 버튼은 실제 heading(기본 )으로 감싸집니다 — APG Accordion 은 "each accordion header is contained in an element with role heading"을 요구하며, 이 래퍼 덕분에 스크린리더 사용자가 heading 탐색(H 키)으로 섹션 사이를 건너뛸 수 있습니다. 래퍼는 margin: 0; font: inherit 이라 시각은 버튼이 그대로 소유합니다. 주변 문서의 제목 계층에 맞춰 headingLevel 을 조정하고(레벨 건너뛰기 금지), 바깥에서 이미 heading 을 제공하면 headin… |
| 명시 규칙 3 | - items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). - leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은… |
| --body2-size | 15px |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3).
- leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은 대신 aria-describedby로 연결되어 이름은 짧게, 설명은 설명으로 낭독됩니다. title에 아이콘을 직접 넣으면 그 아이콘이 heading·버튼 이름 안으로 들어가므로 그렇게 하지 마세요.
- 슬롯 이름은 같은 해부를 쓰는 ListCell(leading · title · description)과 맞췄습니다. 구분선은 항상 그려집니다(끄는 옵션은 실제 필요가 확인되면 엽니다).
- 접근성: 각 트리거는 aria-expanded + aria-controls로 자신의 패널을 가리키고, 패널은 role="region" + aria-labelledby로 트리거와 연결됩니다. 접힌 패널은 inert로 접근성 트리·탭 포커스 순서에서 제거되어 aria-expanded=false와 상태가 일치합니다(시각 리빌 전환은 유지). Collapsible도 같은 계약을 공유합니다.

## Accessibility

- leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은 대신 aria-describedby로 연결되어 이름은 짧게, 설명은 설명으로 낭독됩니다. title에 아이콘을 직접 넣으면 그 아이콘이 heading·버튼 이름 안으로 들어가므로 그렇게 하지 마세요.
- 접근성: 각 트리거는 aria-expanded + aria-controls로 자신의 패널을 가리키고, 패널은 role="region" + aria-labelledby로 트리거와 연결됩니다. 접힌 패널은 inert로 접근성 트리·탭 포커스 순서에서 제거되어 aria-expanded=false와 상태가 일치합니다(시각 리빌 전환은 유지). Collapsible도 같은 계약을 공유합니다.
- 접근성: 각 헤더 버튼은 실제 heading(기본 )으로 감싸집니다 — APG Accordion 은 "each accordion header is contained in an element with role heading"을 요구하며, 이 래퍼 덕분에 스크린리더 사용자가 heading 탐색(H 키)으로 섹션 사이를 건너뛸 수 있습니다. 래퍼는 margin: 0; font: inherit 이라 시각은 버튼이 그대로 소유합니다. 주변 문서의 제목 계층에 맞춰 headingLevel 을 조정하고(레벨 건너뛰기 금지), 바깥에서 이미 heading 을 제공하면 headin….
- - items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). - leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | - items — { title, content, leading?, description? }[]. multiple — 여러 개 동시 열기 허용. defaultOpen — 마운트 시 열려 있는 인덱스. headingLevel — 헤더 래퍼 heading 레벨(기본 3). - leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은…. |
| Don't | leading / description — 트리거 안에 제목 앞 장식 노드와 제목 아래 보조 설명을 둡니다. 둘 다 트리거 안에 있어 행 전체가 계속 눌리지만, 버튼의 접근 이름은 aria-labelledby로 title에만 고정되어 있어 장식 아이콘이나 설명이 이름에 섞이지 않습니다. 설명은 대신 aria-describedby로 연결되어 이름은 짧게, 설명은 설명으로 낭독됩니다. title에 아이콘을 직접 넣으면 그 아이콘이 heading·버튼 이름 안으로 들어가므로 그렇게 하지 마세요. |
| Do | Disclosure가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 접근성: 각 헤더 버튼은 실제 heading(기본 )으로 감싸집니다 — APG Accordion 은 "each accordion header is contained in an element with role heading"을 요구하며, 이 래퍼 덕분에 스크린리더 사용자가 heading 탐색(H 키)으로 섹션 사이를 건너뛸 수 있습니다. 래퍼는 margin: 0; font: inherit 이라 시각은 버튼이 그대로 소유합니다. 주변 문서의 제목 계층에 맞춰 headingLevel 을 조정하고(레벨 건너뛰기 금지), 바깥에서 이미 heading 을 제공하면 headin…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Accordion의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Collapsible` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Overline` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Accordion items={[
  { title: '검토 기간은 얼마나 걸리나요?', content: '초안 등록 후 평균 2일 내 확인합니다.' },
  { title: '변경 이력은 어디에 남나요?', content: '게시 시점마다 요약과 담당자를 남깁니다.' },
]} defaultOpen={[0]} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-regular`
- `--headline2-size`
- `--label1-size`
- `--space-1`

### Source contracts

- `components/content/Accordion.jsx`
- `components/content/Accordion.d.ts`
- `components/content/Accordion.prompt.md`
- `components/content/Collapsible.jsx`
- `components/content/Collapsible.d.ts`
- `components/content/Collapsible.prompt.md`
- `stories/ContentDisclosure.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Accordion prompt contract: `components/content/Accordion.prompt.md`
- Storybook implementation evidence: `stories/ContentDisclosure.stories.jsx`
- [SEED Disclosure benchmark](https://seed-design.io/components/accordion)
