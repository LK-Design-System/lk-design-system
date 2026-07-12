## Shared field rhythm

- Field anatomy is consistently `label -> control -> helper/error`; labels use the shared input-label tokens and messages use caption typography. Consumer `aria-describedby` ids are merged with the generated helper/error id rather than replaced.
- `readOnly` remains focusable and selectable, uses the alternative field fill, and suppresses editable hover affordance. Positive and negative states use the shared status icon as well as border/message color; color is never the only signal.
- Reference basis: [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/) for visible labels, hints and error association; [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/) for label/helper/error/read-only anatomy.

- `Input`, `Select`, `AutoComplete`, `Combobox`, `PasswordInput`, `SearchField`, `InputGroup`, `NumberField`, `TimePicker`, and `DatePicker` share `--control-h-sm`, `--component-input-height`, `--component-input-padding-x`, and `--component-input-font-size`. Do not introduce a local 40/50px field scale.
- Keep essential instructions in the visible label or helper text. Placeholder text is supplementary and must not replace the label.
- WDS Core examples retain the source sentence form (`…해 주세요.`) for placeholder parity. This intentionally differs from Fluent's no-period placeholder copy rule; Product/Robotics may use a short domain hint only when the visible label remains sufficient.

References: [Fluent 2 Field](https://fluent2.microsoft.design/components/web/react/core/field/usage), local WDS input evidence under `docs/references/wds/`.

**Input** — 한 줄 텍스트 필드: 화이트 박스, 헤어라인 링, 그래파이트 포커스 헤일로. `label`, 선택적 `iconLeft`/`iconRight`, `required`, `invalid`를 전달하세요.

```jsx
<Input label="이메일" required iconLeft={mailIcon} placeholder="you@company.com" />
```
