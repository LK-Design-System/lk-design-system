# Step List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `StepList` |
| Storybook | `LDS Core/Components/Content/Step List` |
| Source | `../component-content.json#core-components-content-step-list` |

설정, 검토, 게시처럼 사용자가 순서를 이해해야 하는 짧은 절차를 안내할 때 적합합니다. 현재 진행 상태를 강조해야 하면 Stepper를, 시간순 사건 기록에는 Timeline을 사용하고 서로 독립적인 할 일을 억지로 단계로 묶지 마세요.

## Anatomy

| Part | Contract |
| --- | --- |
| addLabel | 추가 버튼 라벨. @default "단계 추가" |
| label | 내부 ol 의 접근 가능한 이름(한 화면에 절차가 여럿일 때 구분용). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `StepItem[]` | Yes |  |
| `onChange` | `(steps: StepItem[]) = void` | No | 순서 변경 / 삭제 시 다음 배열로 호출(제어형). |
| `editable` | `boolean` | No | 재정렬·삭제·추가 UI 표시. @default true |
| `onAdd` | `() = void` | No | 있으면 하단에 추가 버튼 노출. |
| `addLabel` | `React.ReactNode` | No | 추가 버튼 라벨. @default "단계 추가" |
| `label` | `string` | No | 내부 ol 의 접근 가능한 이름(한 화면에 절차가 여럿일 때 구분용). |

## Behavior and interaction

- StepList — 편집형 순서 시퀀스. 태스크 저작(웨이포인트·액션 스텝)에 씁니다. 번호 행 + 재정렬(↑/↓) + 삭제 + 선택적 추가 버튼. 변경 시 다음 배열을 onChange로 흘립니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: detail 12.5px → --caption1-size(12px)로 스냅했습니다(−0.5px, 라벨 label1 대비 보조 위계 유지). 번호 배지(caption1)·라벨(label1)·미니/추가 버튼(label2)과 함께 전 사이트가 토큰 스케일 위에 있습니다. |
| 명시 규칙 2 | 절차는 ol li 로 렌더링해 스크린리더가 "N개 중 M번째"를 읽게 합니다(WCAG 1.3.1). 화면의 번호 배지는 같은 정보를 두 번 읽지 않도록 aria-hidden 입니다. |
| 명시 규칙 3 | 행 버튼의 aria-label 에는 단계 이름이 들어갑니다 — "검토 요청 위로 이동", "검토 요청 삭제". 모든 행이 "위로"·"삭제" 로 동일하면 링크·버튼 목록에서 행을 구분할 수 없습니다(WCAG 2.4.6). label 이 문자열이 아니면 "N단계" 로 대체합니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Content and writing

- steps — { id, label, detail }[] · editable · onAdd / addLabel · label(ol 접근 이름). 읽기 전용 진행 표시는 Steps를 쓰세요.
- 키 별칭 — label/detail 이 정식 키이며, title/description 도 같은 자리로 읽습니다. 두 이름이 동시에 오면 label/detail 이 이깁니다. 서로 다른 호출부가 이미 두 셋을 섞어 쓰고 있어 한쪽만 고치면 다른 호출부가 번호만 있고 텍스트가 없는 행으로 조용히 깨지므로, 컴포넌트가 두 셋을 모두 받도록 했습니다(문서·스토리는 정식 키만 보여줍니다).

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
- `--space-0-5`
- `--space-2-5`

### Source contracts

- `components/content/StepList.jsx`
- `components/content/StepList.d.ts`
- `components/content/StepList.prompt.md`
- `stories/ContentStepList.stories.jsx`

## Sources

- StepList prompt contract: `components/content/StepList.prompt.md`
- Storybook implementation evidence: `stories/ContentStepList.stories.jsx`
