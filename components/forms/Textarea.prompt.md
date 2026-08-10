**Textarea** — Input의 박스·포커스 헤일로와 맞춘 여러 줄 필드; 세로 리사이즈 가능.

## Public surface and ref

- `ref` points to the native `textarea`; use `rootRef` for the field stack.
- `className` and `style` customize the public root. Use `textareaClassName` and `textareaStyle` for the native control.
- Stable parts are `root`, `label`, `control`, `textarea`, `statusIcon`, and `message`. Geometry overrides are limited to the documented `--lds-textarea-*` variables.

## Anatomy and reference basis

- Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ.
- Reference basis: [GOV.UK Textarea](https://design-system.service.gov.uk/components/textarea/) and [Carbon Text area](https://carbondesignsystem.com/components/text-area/usage/).

```jsx
<Textarea label="문의 내용" required rows={5} placeholder="문의하실 내용을 입력해 주세요." />
```

- `size`를 생략하면 일반 표면에서는 기존 `md` 120px 최소 높이, bounded compact component scope에서는 `sm` 96px 최소 높이를 사용합니다. 명시한 `size`와 `--lds-textarea-*` 변수가 우선합니다.
