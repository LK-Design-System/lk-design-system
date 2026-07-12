**AutoComplete** — 필터링된 제안 목록이 있는 텍스트 입력.

## Interaction and reference basis

- The editable input owns `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, and `aria-activedescendant`; DOM focus stays on the input while Arrow keys move the active option, Enter commits, and Escape closes.
- The small field is 32px, the default field follows `--component-input-height`, and trigger/option text uses the common 16px input typography.
- Reference basis: [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/). Visual styling remains LDS-token based.

```jsx
<AutoComplete options={['LKR-CP','LKR-T1','LKR-VisionX','LKR-SSAI','LKR-S1']}
  placeholder="모델 검색" onSelect={setModel} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — 텍스트 상태. **onSelect(value)** — 선택된 행. 입력하면 대소문자 구분 없이 필터링됩니다.
- 타입 스케일 정합: 옵션 행 14.5px → `--body2-size`(15px)로 스냅했습니다. 입력 텍스트와 옵션 텍스트가 같은 스케일 단계에 정렬됩니다.

- 필드·상태 prop: **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **helper**(보조 설명) · **error**(오류 메시지, 설정 시 invalid 처리) · **emptyLabel**(결과 없음 문구) · **fieldStyle**(label·helper·error를 포함한 전체 필드 컨테이너 스타일).
