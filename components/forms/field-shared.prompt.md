**field-shared** — 폼 필드(Input, Textarea, Select, NumberField, AutoComplete, Combobox,
SearchField, PasswordInput, FormField, InputGroup 등)가 공유하는 **필드 메타데이터·메시지 계약
엔진**입니다. 라벨/보조 메시지/오류의 id 배선과 시각 상태 토큰을 소유합니다. 새 폼 필드는 이
모듈을 사용하고 라벨·`aria-describedby`·오류 메시지 배선을 손으로 재구현하지 않습니다
(`npm run check:engine-reuse`가 감시).

```jsx
const meta = useFieldMetadata({ prefix: 'input', id, label, helper, error, describedBy });

<FieldStack fieldId={meta.fieldId} label={label} required messageId={meta.messageId}
  message={meta.message} error={error}>
  <input id={meta.fieldId} aria-describedby={meta.describedBy} aria-invalid={error != null || undefined} />
</FieldStack>
```

## 엔진이 소유하는 것

- **id 배선**: `fieldId`(소비자 id ?? `${prefix}-${useId}`), 메시지가 있을 때만 존재하는
  `messageId`(`${fieldId}-message`), 외부 `describedBy`와 병합·중복 제거된 `aria-describedby` 값
  (`mergeIds`).
- **메시지 우선순위**: `error ?? helper`. 오류가 있으면 helper는 가려지고 메시지가 negative 색과
  `role="alert"`(assertive live 영역)로 렌더됩니다. helper만 있으면 live 영역이 아닙니다.
- **FieldStack 구조**: 라벨 → 컨트롤 → 메시지 순서의 grid 스택. 루트의 `position: relative`는
  필드가 렌더하는 절대 위치 스크린리더 live 영역(Caps Lock 경고, 복사 결과)을 페이지가 아닌
  필드에 앵커합니다.
- **시각 상태 토큰**: `fieldBorderColor`는 disabled > invalid/negative > positive > focused >
  hovered 우선순위로, `fieldBackground`는 disabled/readOnly로 토큰을 결정합니다. 필드 상태색을
  개별 컴포넌트에서 다시 정의하지 않습니다.
- **상태 아이콘**: `FieldStatusIcon`은 invalid/positive에서만 렌더되는 장식(`aria-hidden`)입니다.

## 소비자 규약

- 컨트롤에는 반드시 `id={meta.fieldId}`와 `aria-describedby={meta.describedBy}`를 적용하고,
  오류 시 `aria-invalid`를 함께 노출합니다.
- 라벨이 `<label>`로 연결될 수 없는 합성 위젯(listbox 등)은 `labelId`를 받아 `aria-labelledby`로
  연결합니다.
- 인라인 선택 컨트롤(Checkbox, Radio)처럼 라벨이 컨트롤 옆에 붙는 표면은 FieldStack 대상이
  아닙니다 — 이 엔진은 수직 필드 스택 계약입니다.

## 근거

- [WAI Forms tutorial — Labeling controls](https://www.w3.org/WAI/tutorials/forms/labels/)와
  [Form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/): 라벨의 명시적 연결과
  보조 설명의 `aria-describedby` 연결.
- [WCAG 2.2 SC 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
  및 [SC 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html):
  오류의 텍스트 식별과 라벨·지침 제공.
- [MDN `alert` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role):
  즉시 주의가 필요한 메시지에만 assertive live 영역을 사용 — helper 메시지에는 적용하지 않는 이유.
- 전용 계약 테스트: `scripts/check-engine-contracts.mjs`(`npm run check:engine-contracts`).
