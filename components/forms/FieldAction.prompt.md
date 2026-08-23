**FieldAction**은 하나의 입력 필드와 그 값을 사용하는 별도 액션을 같은 행에 배치하는 **LK Product Extension**입니다. 입력 값, 검증, 제출, 네트워크 요청과 성공·실패 상태는 제품이 소유합니다.

```jsx
<FieldAction
  as="form"
  onSubmit={issueCredential}
  field={<Input aria-label="연결 이름" value={name} onChange={setName} />}
  action={<Button type="submit" loading={busy}>발급</Button>}
/>
```

## Public surface and ref

- `ref` points to the polymorphic root selected by `as` (`div` by default).
- `className`/`style` target the root. Stable parts are `root`, `fieldStack`, `row`, `field`, and `action`.
- `classNames` and `styles` accept only those stable part keys. `vars` accepts only `--lds-field-action-gap`; shared control height remains derived from the canonical `size`.
- `htmlFor` associates the shared label with the field control. Field value, validation, submission, and loading remain product-owned.

## 책임과 기존 컴포넌트와의 차이

- `Stack`은 범용 배치만 제공하며 자식 control의 밀도나 높이를 조정하지 않습니다. `FieldAction`은 field와 action의 크기 매핑 및 좁은 폭 재배치를 소유합니다.
- `InputGroup`의 prefix/suffix는 입력 테두리 안에서 편집 값의 단위·프로토콜 같은 고정 문맥을 설명합니다. `FieldAction`의 action은 별도 Tab stop과 별도 테두리를 가진 독립 동작입니다.
- `Input.actionRight`는 입력 내부의 지우기·보기 같은 국소 액션입니다. 제출·발급·조회처럼 값에 대한 명시적 변화를 요청하는 주요 action은 `FieldAction`에 둡니다.
- `FormField`가 공유 label/helper/error를 소유하고, field와 action은 그 사이의 control row에서 입력→액션 DOM·Tab 순서를 유지합니다. field 자체에 label/helper/error를 중복 전달하지 않습니다.

## 크기와 반응형 계약

- `size="sm" | "md" | "lg"`는 각각 field control 높이 32px·`--component-input-height`(default 48px, `ops` 40px)·52px를 사용합니다. 공유 행 높이는 *field* 척도이므로 Theme profile이 field를 조밀하게 만들면 action도 함께 따라갑니다. field에는 같은 `size`를 전달하고, action은 Button의 해당 typography/padding/radius를 유지하면서 조합 높이만 field 높이에 맞춥니다.
- 360px 이하에서는 field 다음 줄에 action을 배치하고 action을 전체 너비로 확장합니다. 정보와 기능을 잃지 않고 320 CSS px에서 한 방향으로 reflow해야 한다는 WCAG 기준을 따릅니다.
- loading 중 Button의 숨겨진 원래 label이 너비를 유지하므로 action column이 흔들리지 않습니다. disabled/loading 동작 자체는 Button 계약을 그대로 사용합니다.

## 시각 차이 목록

- 새 surface, border, shadow, radius, color, typography는 만들지 않습니다. Input과 Button의 기존 시각 상태를 그대로 조합합니다.
- InputGroup과 달리 두 control 사이에 `--space-2` 간격이 있고 외곽선은 연결하지 않습니다. 별도 제출 action이라는 기능적 차이를 표현하기 위한 것입니다.
- 기본 `Button size="md"`의 40px 높이를 48px field row에 맞추되, `Button size="lg"`로 승격하지 않으므로 md 글꼴·padding·radius 의미는 유지합니다.

## 외부 근거

- [USWDS Search](https://designsystem.digital.gov/components/search/)는 label이 있는 입력과 native submit button을 하나의 form composition으로 제공하며 버튼을 명시적 제출 동작으로 유지합니다. FieldAction도 입력 내부 장식이 아닌 별도 submit action을 유지합니다.
- [W3C H32: Providing submit buttons](https://www.w3.org/WAI/WCAG21/Techniques/html/H32)는 form의 변화 요청을 명시적 submit button으로 제공합니다. `as="form"`과 `Button type="submit"` 조합은 native Enter 제출을 보존합니다.
- [WCAG 2.2 Reflow 이해 문서](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)는 320 CSS px에서 정보·기능 손실과 양방향 스크롤 없이 재배치할 것을 요구합니다. 좁은 container에서 한 열로 바뀌는 이유입니다.

## 제품 workflow 검토

- **LK Portal** `e5ee99d5062170e26abe63d9105c2b8a024ce710`: `PersonalContextPage.tsx`와 `AdminWorkspace.tsx`의 연결 코드 발급 form이 기본 Input 48px + Button 40px를 같은 행에 사용합니다. `FieldAction`으로 supported by composition이며 API 요청·busy·credential 상태는 Portal 소유입니다.
- **LK Control Full Daedeok** `93802fc2aa5d29f930380ae58d51dcb68322b5e7`: 로봇·사용자 검색 행과 task template 저장 행에 field + action이 확인되어 supported by composition입니다. 검색 조건·query·dialog 상태는 제품 소유입니다.
- **LK Web Viz** `a984def117c05acd213f494cbb8a42e990595505`: 검토한 연결 설정은 full-width 하단 submit action과 `- / number / +` stepper를 사용합니다. 하나의 field + 하나의 action 계약과 다르므로 현재 적용은 not applicable입니다.

아이콘이나 신규 asset은 추가하지 않습니다.
