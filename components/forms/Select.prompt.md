# Select

커스텀 단일 선택 드롭다운(스타일된 트리거 + 플로팅 패널, 시그널 포커스) — 네이티브 `<select>`가 **아닙니다**. 옵션은 `options`(string[] 또는 `{value,label}[]`) 또는 `<option>` 자식으로 지정합니다. `onChange`는 선택된 **value**를 받습니다.

- **분류:** WDS Core. 기존 WDS Select의 시각 축은 유지하고, 아래 키보드/ARIA 계약은 LDS 접근성 완성도로 보강합니다.
- **키보드 계약:** 트리거에 DOM 포커스를 유지한 채 `ArrowUp`/`ArrowDown`으로 열고 이동하며, `Home`/`End`는 처음/마지막 옵션으로 이동합니다. `Enter` 또는 `Space`로 확정하고 `Escape`로 기존 값을 유지한 채 닫으며 트리거로 포커스를 돌려놓습니다. `Tab`은 선택을 바꾸지 않고 팝업을 닫은 뒤 정상 탭 순서를 계속합니다.
- **ARIA 계약:** 트리거는 `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`를 소유하고 팝업은 `listbox`/`option` 및 `aria-selected`를 사용합니다. 탐색 중인 옵션과 확정된 옵션은 별도 상태이며, 긴 목록에서는 활성 옵션을 보이는 영역으로 스크롤합니다.
- **범위:** 검색/자유 입력/비동기 옵션/다중 선택은 이 컴포넌트에 넣지 않습니다. 검색은 `AutoComplete` 또는 `SearchableMultiSelect`, 다중 선택은 `Combobox` 계열이 담당합니다.

## 근거와 설계 결론

- [WAI-ARIA APG Select-Only Combobox Example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/): DOM 포커스를 트리거에 유지하고 `aria-activedescendant`로 탐색 옵션을 알리며, `Escape`가 값을 변경하지 않는 탐색/확정 분리를 따릅니다.
- [WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): `combobox`와 `listbox`의 연결, 확장 상태, 방향키·확정·취소 키 계약을 따릅니다.
- [WAI-ARIA APG Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/): 단일 선택의 `option`/`aria-selected` 의미와 DOM 포커스 대신 `aria-activedescendant`를 쓰는 합성 위젯 모델을 따릅니다.

```jsx
<Select label="문의 유형"
  options={['제품 문의', '채용 문의', '기술 지원']}
  defaultValue="제품 문의"
  onChange={(v) => setType(v)} />
```

- 타입 스케일 정합: 트리거와 옵션은 공통 `--component-input-font-size`(16px)를 사용합니다. WDS Select/AutoComplete 컴포넌트 집합 내부의 16px 텍스트 정의와 입력 계열의 본문 크기를 동시에 맞춥니다.
- `readOnly`는 현재 값과 포커스를 유지하지만 팝업을 열거나 값을 바꾸지 않으며, 대체 배경과 `aria-readonly`로 비활성과 구분합니다.
- 시각 델타: 기존 높이, 여백, 반경, 색상, 선택 채움, 그림자는 유지합니다. 새로 추가된 유일한 상태 표시는 탐색 중인 옵션의 내부 포커스 선이며, 확정 선택과 키보드 포커스를 구분하기 위한 접근성 요구입니다.
