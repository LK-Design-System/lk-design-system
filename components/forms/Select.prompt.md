# Select

커스텀 단일 선택 드롭다운(스타일된 트리거 + 플로팅 패널, 시그널 포커스) — 네이티브 `<select>`가 **아닙니다**. 옵션은 `options`(string[] 또는 `{value,label}[]`) 또는 `<option>` 자식으로 지정합니다. `onChange`는 선택된 **value**를 받습니다.

- **분류:** WDS Core. 기존 WDS Select의 시각 축은 유지하고, 아래 키보드/ARIA 계약은 LDS 접근성 완성도로 보강합니다.
- **키보드 계약:** 트리거에 DOM 포커스를 유지한 채 `ArrowUp`/`ArrowDown`으로 열고 이동하며, `Home`/`End`는 처음/마지막 옵션으로 이동합니다. `Enter` 또는 `Space`로 확정하고 `Escape`로 기존 값을 유지한 채 닫으며 트리거로 포커스를 돌려놓습니다. `Tab`은 선택을 바꾸지 않고 팝업을 닫은 뒤 정상 탭 순서를 계속합니다.
- **타입어헤드 계약:** 인쇄 가능한 문자를 누르면 500ms 동안 유지되는 다중 문자 버퍼에 누적되어, 버퍼로 시작하는 첫 활성 옵션을 찾습니다. 열려 있으면 탐색 위치(`aria-activedescendant`)만 옮기고, 닫혀 있으면 값을 확정합니다. 같은 문자를 반복하면 그 문자로 시작하는 옵션들을 순환하고, 버퍼가 비어 있지 않을 때의 `Space`는 확정이 아니라 버퍼에 공백을 덧붙입니다(공백이 포함된 라벨 도달). 비활성 옵션과 래핑 규칙은 Arrow 탐색과 동일합니다. 조합 중인 IME 입력(`event.key === 'Process'`)은 타입어헤드 대상이 아닙니다 — 완성된 문자만 매칭합니다.
- **ARIA 계약:** 트리거는 `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`를 소유하고 팝업은 `listbox`/`option` 및 `aria-selected`를 사용합니다. 탐색 중인 옵션과 확정된 옵션은 별도 상태이며, 긴 목록에서는 활성 옵션을 보이는 영역으로 스크롤합니다.
- **비활성 계약:** 옵션의 표준 API는 `disabled`입니다. 비활성 옵션은 `aria-disabled="true"`로 노출하고 포인터 선택과 값 변경을 막으며, Arrow/Home/End 탐색과 `aria-activedescendant` 대상에서 제외합니다. 열린 동안 옵션이 동적으로 비활성화되면 가장 가까운 활성 옵션으로 탐색 위치를 옮깁니다. 컨트롤 자체가 동적으로 `disabled`/`readOnly`가 되면 팝업을 즉시 닫고, `defaultOpen`도 잠긴 초기 상태에서는 무시합니다.
- **범위:** 검색/자유 입력/비동기 옵션/다중 선택은 이 컴포넌트에 넣지 않습니다. 검색은 `AutoComplete` 또는 `SearchableMultiSelect`, 다중 선택은 `Combobox` 계열이 담당합니다.

## 근거와 설계 결론

- [WAI-ARIA APG Select-Only Combobox Example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/): DOM 포커스를 트리거에 유지하고 `aria-activedescendant`로 탐색 옵션을 알리며, `Escape`가 값을 변경하지 않는 탐색/확정 분리를 따릅니다. 이 예제가 요구하는 인쇄 문자 타입어헤드(다중 문자 버퍼, 동일 문자 순환)도 함께 구현합니다.
- [WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): `combobox`와 `listbox`의 연결, 확장 상태, 방향키·확정·취소 키 계약을 따릅니다.
- [WAI-ARIA APG Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/): 단일 선택의 `option`/`aria-selected` 의미와 DOM 포커스 대신 `aria-activedescendant`를 쓰는 합성 위젯 모델을 따릅니다.
- 로컬 WDS `.fig`의 열린 `Select/Select` variant는 내부 `Menu` instance(`Variant=Checkbox`, `Cell Padding=12px`)를 직접 합성하며, 그 option은 48px·16/24px Regular입니다. LDS는 checkbox 자체를 복제하지 않고 단일 선택에 맞는 trailing check로 번역하되, `md`/`lg` option의 comfortable 밀도는 보존합니다.
- [Carbon Dropdown](https://carbondesignsystem.com/components/dropdown/usage/)은 필드와 option을 하나의 size ramp로 관리하고 열린 목록을 같은 선택 컴포넌트의 일부로 취급합니다. LDS는 WDS에 없는 `sm` 확장을 shared-menu default 40px 밀도로 대응시킵니다.
- [Fluent Select](https://fluent2.microsoft.design/components/web/react/core/select/usage)와 [Fluent Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage)는 form value 선택과 즉시 실행 command를 구분합니다. LDS도 panel 시각 토큰만 공유하고 `listbox`와 `menu`의 DOM·focus 엔진은 공유하지 않습니다.

```jsx
<Select label="문의 유형"
  options={['제품 문의', '도입 문의', '기술 지원']}
  defaultValue="제품 문의"
  onChange={(v) => setType(v)} />
```

- 타입·밀도 정합: 트리거는 입력 계열의 size-aware typography를 유지하고, 옵션은 shared-menu 타입 램프를 소비합니다. `sm`은 shared-menu `default` 밀도(40px, padding 10×16px, `--component-menu-item-font-size` 14/20px), `md`와 `lg`는 `comfortable` 밀도(48px, padding 12×16px, `body1` 16/24px)에 대응합니다. 모든 크기는 panel radius 12px·padding 8px·gap 4px과 option radius 10px을 공유합니다.
- intrinsic-width 계약: 현재 값이 아니라 option 집합의 가장 긴 label과 icon/status reserve를 기준으로 안정된 폭을 계산합니다. 숨은 측정 subtree는 absolute·clipped measurement layer 안에 격리되어 root 높이·trigger y 좌표·제약된 조상의 `scrollWidth`를 바꾸지 않습니다. consumer의 root `style`이 지정한 `minWidth`, `width`, `maxWidth`는 측정 결과보다 우선합니다.
- `readOnly`는 현재 값과 포커스를 유지하지만 팝업을 열거나 값을 바꾸지 않으며, 대체 배경과 `aria-readonly`로 비활성과 구분합니다.
- WDS 내부 `Select/Select` component-set(16215:33116)의 직접 축은 `Active`, `Disable`, `Focus`, `Negative`, `Overflow`, `Render(Chip/Text)`입니다. `Size`는 WDS 직접 축이 아니지만 열린 variant가 48px·16/24px Menu를 직접 포함하므로 `md`/`lg` 기본 option 밀도의 composition 근거로 사용합니다. 옵션별 `disabled`와 동적 잠금은 새 WDS 축이 아니라 APG를 만족하는 LDS 접근성 동작입니다.
- 형제 비교: `AutoComplete`와 `Combobox`가 이미 비활성 옵션을 `aria-disabled`로 노출하고 탐색·선택에서 제외합니다. Select도 같은 규칙을 사용하되, 검색과 다중 선택은 가져오지 않습니다.
- 시각 델타: Select panel은 DropdownMenu와 같은 shared-menu shell(radius 12px, padding 8px, gap 4px, border, shadow)을 사용하되 trigger 너비와 6px field offset을 유지합니다. 선택은 약한 persistent fill·trailing 16px check·medium weight, pointer hover는 neutral hover fill, keyboard active descendant는 2px inset ring으로 분리합니다. check와 ring은 `--component-menu-item-check-color`/`--component-menu-item-active-ring-color`를 통해 기본 무채색(label-normal)으로 렌더링되어 DropdownMenu의 monochrome 상태 모델을 따르며, 테마가 이 토큰을 재지정해 액센트로 되돌릴 수 있습니다. 일반 option은 regular weight이며, 선택된 option이 나중에 비활성화되면 값은 보존하되 중립 비활성 채움·전경으로 바꿉니다.

## Public surface and ref

- `className`/`style` and `rootRef` target the public field-stack root. The default ref, `triggerClassName`, and `triggerStyle` target the native combobox trigger.
- Stable parts are `root`, `label`, `control`, `trigger`, `value`, `indicators`, `dropdown`, `option`, and `message`. Options additionally expose real `data-active`, `data-selected`, and `data-disabled` state.
- `vars` accepts only `--lds-select-min-width`, `--lds-select-height`, and `--lds-select-dropdown-max-height`. Consumer root width constraints still override intrinsic measurement.
- `disable`, `negative`, and `small|medium|large` are compatibility aliases; new code uses `disabled`, `invalid`/`status`, and `sm|md|lg`.
