**AutoComplete** — 필터링된 제안 목록이 있는 텍스트 입력.

## Interaction and reference basis

- The editable input owns `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, and `aria-activedescendant`; DOM focus stays on the input while Arrow keys move the active option, Enter commits, and Escape closes.
- **수동 선택(manual selection)이 기본입니다.** 타이핑은 목록만 필터링하고 활성 옵션을 만들지 않습니다(`aria-activedescendant` 없음). 방향키를 누른 뒤에야 활성 옵션이 생기므로, 사용자가 이동한 적 없는 첫 후보를 `Enter`가 확정하는 일이 없습니다. 이전의 적극적 동작이 필요하면 **autoHighlight**를 켜세요.
- **결과 수를 알립니다.** 컨트롤 안에 항상 존재하는 시각적 숨김 `role="status" aria-live="polite"` 영역이 `n개 결과`(**resultCountLabel**로 재정의)와 결과 없음 문구를 전달합니다. 팝업과 함께 마운트되는 라이브 리전은 자주 누락되므로, 보이는 빈 상태 행은 더 이상 라이브 리전이 아닙니다.
- The small field is 32px, the default field follows `--component-input-height`, and trigger/option text uses the common 16px input typography.
- Reference basis: [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [APG List Autocomplete example (manual selection)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/), [MUI Autocomplete `autoHighlight` (기본 false)](https://mui.com/material-ui/react-autocomplete/), and [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/). Visual styling remains LDS-token based.

```jsx
<AutoComplete options={['LKR-CP','LKR-T1','LKR-VisionX','LKR-SSAI','LKR-S1']}
  placeholder="모델 검색" onSelect={setModel} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — 텍스트 상태. **onSelect(value)** — 선택된 행. 입력하면 대소문자 구분 없이 필터링됩니다.
- 타입 스케일 정합: 옵션 행 14.5px → `--body2-size`(15px)로 스냅했습니다. 입력 텍스트와 옵션 텍스트가 같은 스케일 단계에 정렬됩니다.

- 필드·상태 prop: **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **helper**(보조 설명) · **error**(오류 메시지, 설정 시 invalid 처리) · **emptyLabel**(결과 없음 문구) · **fieldStyle**(label·helper·error를 포함한 전체 필드 컨테이너 스타일).
