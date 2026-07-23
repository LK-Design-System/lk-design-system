**InputGroup** — 접두/접미 애드온(단위, 프로토콜, 통화)이 양옆에 붙는 입력.

## Anatomy and reference basis

- Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale.
- 애드온은 값 해석에 필수인 문맥이므로 input의 `aria-describedby`에 연결합니다. 단위·프로토콜(`ms`, `%`, `https://`)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할 필요가 없습니다.
- 애드온 노드는 자기 접근성 의미를 스스로 소유합니다. 컴포넌트가 노드 애드온을 일괄 `aria-hidden` 처리하지 않으므로 순수 장식 아이콘은 소비자가 직접 `aria-hidden`을 겁니다(레포의 `Icon`은 이름을 주지 않으면 스스로 숨깁니다).
- `readOnly` remains focusable and selectable. Consumer and generated description ids are merged on the input.
- Reference basis: [GOV.UK Text input prefixes and suffixes](https://design-system.service.gov.uk/components/text-input/#prefixes-and-suffixes) and [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/).

```jsx
<InputGroup prefix="ID" suffix="개" placeholder="12" />
<InputGroup suffix="%" defaultValue="72" />
```

- **prefix / suffix** — 애드온 노드. **value / defaultValue / onChange** — 텍스트. **inputProps** — 네이티브 input 패스스루. `inputProps.onChange`/`onFocus`/`onBlur`는 폐기되지 않고 컴포넌트 내부 처리보다 **먼저** 호출됩니다(값 커밋은 그대로 이어집니다). `inputProps['aria-describedby']`는 생성된 설명 id와 병합됩니다.

- 필드·상태 prop: **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **fieldStyle**(label·helper·error를 포함한 전체 필드 컨테이너 스타일).
