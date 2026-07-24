# Checklist Item

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ChecklistItem` |
| Storybook | `LDS Product/Content/Checklist Item` |
| Source | `../component-content.json#product-content-checklist-item` |

작업 기준이나 준비 항목처럼 짧은 목록의 완료·제외 상태를 읽게 할 때 적합합니다. 순서가 있는 절차나 직접 체크해야 하는 입력에는 정적 ChecklistItem 대신 Steps 또는 Checkbox를 사용하세요.

## 사용 판단

### 사용

- 작업 기준이나 준비 항목처럼 짧은 목록의 완료·제외 상태를 읽게 할 때 적합합니다. 순서가 있는 절차나 직접 체크해야 하는 입력에는 정적 ChecklistItem 대신 Steps 또는 Checkbox를 사용하세요.
- 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요.
- Checklist Item가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 ChecklistItem API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다.
- - 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요. - 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. - 행은 기본적으로 a….
- Checklist Item가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ChecklistItem의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| State Label | 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달). 기본값은 cross에 따라 "포함" 또는 "제외"이며, 다른 어휘가 필요하면 직접 지정합니다(예: "지원" / "미지원"). 주변 문맥이 이미 상태를 전달할 때만 null로 끄세요. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `cross` | `boolean` | No | 시그널 잉크 체크 대신 레드 크로스 + 취소선 표시(제외 항목). @default false |
| `muted` | `boolean` | No | 라벨을 흐리게(약한 톤) 표시. 취소선은 cross가 담당합니다. @default false |
| `dark` | `boolean` | No | 다크 서피스에 렌더. @default false |
| `as` | `'li' \| 'div'` | No | 행 엘리먼트. 기본은 li — 여러 행은 ul/ol 안에 넣어 목록으로 읽히게 합니다. 목록이 아닌 단독 행에만 "div"를 쓰세요. |
| `stateLabel` | `React.ReactNode` | No | 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달). 기본값은 cross에 따라 "포함" 또는 "제외"이며, 다른 어휘가 필요하면 직접 지정합니다(예: "지원" / "미지원"). 주변 문맥이 이미 상태를 전달할 때만 null로 끄세요. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| stateLabel | 포함/제외 상태의 텍스트 대안(시각적으로 숨겨져 스크린리더에만 전달). 기본값은 cross에 따라 "포함" 또는 "제외"이며, 다른 어휘가 필요하면 직접 지정합니다(예: "지원" / "미지원"). 주변 문맥이 이미 상태를 전달할 때만 null로 끄세요. 타입 계약: React.ReactNode |

## Behavior and interaction

- 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다.
- 타입 스케일 정합: 라벨 16.5px → --body1-size(16px)로 스냅했습니다. 본문 계열 한 단계로 정렬합니다.
- - 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요. - 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. - 행은 기본적으로 a….
- ChecklistItem의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. |
| 명시 규칙 2 | 행은 기본적으로 as="li"로 렌더합니다. 여러 항목은 반드시 ul/ol로 감싸 개수와 위치가 읽히게 하고(래퍼에 listStyle: none; margin: 0; padding: 0), 목록이 아닌 단독 행에만 as="div"를 씁니다. |
| 명시 규칙 3 | 타입 스케일 정합: 라벨 16.5px → --body1-size(16px)로 스냅했습니다. 본문 계열 한 단계로 정렬합니다. |
| 명시 규칙 4 | - 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요. - 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. - 행은 기본적으로 a… |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다.
- cross는 취소선 + 레드, muted는 흐린 라벨 톤입니다 — 두 축은 독립이며 함께 쓰면 "제외된 항목"이 됩니다.
- 타입 스케일 정합: 라벨 16.5px → --body1-size(16px)로 스냅했습니다. 본문 계열 한 단계로 정렬합니다.
- ChecklistItem — 시그널 잉크 체크(또는 레드 cross) + 라벨; 브랜드의 핵심 리스트 스타일. dark는 네이비 서피스용, muted는 흐리게 표시.

## Accessibility

- 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다.
- - 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요. - 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. - 행은 기본적으로 a….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요. |
| Don't | 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. |
| Do | Checklist Item가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | - 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 Checkbox, 순서가 의미인 절차는 Steps를 쓰세요. - 상태를 색·아이콘으로만 전달하지 않습니다. 체크/크로스 글리프와 취소선은 장식(aria-hidden)이고, 포함·제외 상태는 시각적으로 숨긴 stateLabel 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 cross에 따라 "포함" / "제외"이며, 목록의 의미가 다르면 stateLabel="미지원"처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 stateLabel={null}로 끕니다. - 행은 기본적으로 a…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ChecklistItem의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FeatureCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeedCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListingCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MetricCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NewsCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ProductCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SpecRow` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Stat` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
  <ChecklistItem>상태 라벨 표시</ChecklistItem>
  <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
  <ChecklistItem stateLabel="미지원">사용자 정의 테마</ChecklistItem>
</ul>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--fw-semibold`

### Source contracts

- `components/cards/ChecklistItem.jsx`
- `components/cards/ChecklistItem.d.ts`
- `components/cards/ChecklistItem.prompt.md`
- `stories/CardChecklistItem.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ChecklistItem prompt contract: `components/cards/ChecklistItem.prompt.md`
- Storybook implementation evidence: `stories/CardChecklistItem.stories.jsx`
