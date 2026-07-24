# Step List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `StepList` |
| Storybook | `LDS Core/Components/Content/Step List` |
| Source | `../component-content.json#core-components-content-step-list` |

설정, 검토, 게시처럼 사용자가 순서를 이해해야 하는 짧은 절차를 안내할 때 적합합니다. 현재 진행 상태를 강조해야 하면 Stepper를, 시간순 사건 기록에는 Timeline을 사용하고 서로 독립적인 할 일을 억지로 단계로 묶지 마세요.

## 사용 판단

### 사용

- 설정, 검토, 게시처럼 사용자가 순서를 이해해야 하는 짧은 절차를 안내할 때 적합합니다. 현재 진행 상태를 강조해야 하면 Stepper를, 시간순 사건 기록에는 Timeline을 사용하고 서로 독립적인 할 일을 억지로 단계로 묶지 마세요.
- 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여줍니다).
- - steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요. - 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여….
- Step List가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Step List가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | StepList의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Add Label | 추가 버튼 라벨. @default "단계 추가" |
| Label | 내부 ol 의 접근 가능한 이름(한 화면에 절차가 여럿일 때 구분용). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `StepItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(steps: StepItem[]) = void` | No | 순서 변경 / 삭제 시 다음 배열로 호출(제어형). |
| `editable` | `boolean` | No | 재정렬·삭제·추가 UI 표시. @default true |
| `onAdd` | `() = void` | No | 있으면 하단에 추가 버튼 노출. |
| `addLabel` | `React.ReactNode` | No | 추가 버튼 라벨. @default "단계 추가" |
| `label` | `string` | No | 내부 ol 의 접근 가능한 이름(한 화면에 절차가 여럿일 때 구분용). |

## States

| State | Contract |
| --- | --- |
| 변형·상태 · 편집 컨트롤의 접근 이름 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요.
- 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다.
- StepList — 편집형 순서 시퀀스. 태스크 저작(웨이포인트·액션 스텝)에 씁니다. 번호 행 + 재정렬(↑/↓) + 삭제 + 선택적 추가 버튼. 변경 시 다음 배열을 onChange로 흘립니다.
- - steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요. - 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여….
- - 절차는 ol li 로 렌더링해 스크린리더가 "N개 중 M번째"를 읽게 합니다(WCAG 1.3.1). 화면의 번호 배지는 같은 정보를 두 번 읽지 않도록 aria-hidden 입니다. - 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: detail 12.5px → --caption1-size(12px)로 스냅했습니다(−0.5px, 라벨 label1 대비 보조 위계 유지). 번호 배지(caption1)·라벨(label1)·미니/추가 버튼(label2)과 함께 전 사이트가 토큰 스케일 위에 있습니다. |
| 명시 규칙 2 | 절차는 ol li 로 렌더링해 스크린리더가 "N개 중 M번째"를 읽게 합니다(WCAG 1.3.1). 화면의 번호 배지는 같은 정보를 두 번 읽지 않도록 aria-hidden 입니다. |
| 명시 규칙 3 | 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다. |
| 명시 규칙 4 | - steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요. - 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여… |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요.
- 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여줍니다).
- 타입 스케일 정합: detail 12.5px → --caption1-size(12px)로 스냅했습니다(−0.5px, 라벨 label1 대비 보조 위계 유지). 번호 배지(caption1)·라벨(label1)·미니/추가 버튼(label2)과 함께 전 사이트가 토큰 스케일 위에 있습니다.
- 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다.

## Accessibility

- 절차는 ol li 로 렌더링해 스크린리더가 "N개 중 M번째"를 읽게 합니다(WCAG 1.3.1). 화면의 번호 배지는 같은 정보를 두 번 읽지 않도록 aria-hidden 입니다.
- 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다.
- - 절차는 ol li 로 렌더링해 스크린리더가 "N개 중 M번째"를 읽게 합니다(WCAG 1.3.1). 화면의 번호 배지는 같은 정보를 두 번 읽지 않도록 aria-hidden 입니다. - 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여줍니다). |
| Don't | Step List가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요. - 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 StepList의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Overline` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<StepList steps={steps} onChange={setSteps} onAdd={addStep}
  addLabel="웨이포인트 추가" label="주행 절차" />
// steps: [{ id, label: '1층 로비로 이동', detail: 'x 12.4 · y 3.1' }, …]
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--font-sans`
- `--label1-size`
- `--label2-size`
- `--radius-md`
- `--radius-sm`

### Source contracts

- `components/content/StepList.jsx`
- `components/content/StepList.d.ts`
- `components/content/StepList.prompt.md`
- `stories/ContentStepList.stories.jsx`

## Migration

- 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여줍니다).
- - steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요. - 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- StepList prompt contract: `components/content/StepList.prompt.md`
- Storybook implementation evidence: `stories/ContentStepList.stories.jsx`
