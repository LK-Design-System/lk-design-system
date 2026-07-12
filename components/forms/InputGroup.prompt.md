**InputGroup** — 접두/접미 애드온(단위, 프로토콜, 통화)이 양옆에 붙는 입력.

## Anatomy and reference basis

- Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale.
- `readOnly` remains focusable and selectable. Consumer and generated description ids are merged on the input.
- Reference basis: [GOV.UK Text input prefixes and suffixes](https://design-system.service.gov.uk/components/text-input/#prefixes-and-suffixes) and [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/).

```jsx
<InputGroup prefix="ID" suffix="개" placeholder="12" />
<InputGroup suffix="%" defaultValue="72" />
```

- **prefix / suffix** — 애드온 노드. **value / defaultValue / onChange** — 텍스트. **inputProps** — 패스스루.
