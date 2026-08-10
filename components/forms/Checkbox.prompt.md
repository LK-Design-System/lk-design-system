**Checkbox** — 켜지면 LK 시그널 잉크 + 화이트 체크로 채워지는 라운드 사각형. 제어(`checked`) 또는 비제어(`defaultChecked`); `onChange`는 다음 불리언을 받습니다.

## Selection contract

- Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses `mixed` only for a true aggregate indeterminate state.
- Reference basis: [WAI-ARIA Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) and [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/).

## 구조와 접근성 계약

- Radio와 동일하게 **시각적으로 숨긴 네이티브 `<input type="checkbox">`를 `<label>`이 감싸는 구조**입니다. 사각형은 `aria-hidden` 장식 인디케이터일 뿐입니다. 따라서 `name`/`value` 폼 전송, 브라우저 폼 복원, `:checked`, 네이티브 키보드 계약이 그대로 동작합니다.
- **접근 이름은 감싸는 `<label>`의 내용에서 나옵니다.** `label`에 JSX 노드를 넘겨도(예: CheckboxGroup의 제목 + 설명 조합) 이름이 `"checkbox"`로 떨어지지 않습니다. 이름을 직접 지정할 때만 `aria-label`을 쓰세요.
- 토글은 **Space만** 수행합니다(APG). Enter는 토글하지 않습니다 — 네이티브 input 동작을 그대로 따릅니다.
- 소비자가 넘긴 `onKeyDown`/`onFocus`/`onBlur`는 내부 핸들러보다 먼저 실행되며 토글을 죽이지 않습니다. 의도적으로 막으려면 핸들러에서 `preventDefault()`를 호출하세요. `{...rest}`는 내부 속성보다 **앞서** 펼쳐집니다.
- **타깃 크기**: 시각 박스는 md 18px · sm 16px 그대로 두고, 그 위에 놓인 투명한 네이티브 input만 24×24px로 확장해 WCAG 2.5.8 (Target Size, Minimum)을 만족시킵니다. 픽셀 출력은 변하지 않습니다.
- **혼합 상태**: `indeterminate`(또는 `state="indeterminate"`)는 `checked`와 독립입니다. 네이티브 `input.indeterminate`를 ref로 설정하고 `aria-checked="mixed"`를 함께 노출하며, 시각적으로는 가로 막대를 보여줍니다(체크 표시는 숨김).
- 호환을 위해 input에 `role="checkbox"`·`aria-checked`·`aria-disabled`를 명시적으로 유지합니다. 값이 네이티브 상태와 항상 일치하므로 axe의 조건부 검사(`aria-conditional-checkbox-attr`)를 통과합니다.

```jsx
<Checkbox checked={agreed} onChange={setAgreed} label="개인정보 수집·이용에 동의합니다." />
<Checkbox name="channels" value="email" defaultChecked label="이메일 알림" />
```

- `size`를 생략하면 일반 표면에서는 기존 `md`, bounded compact component scope에서는 `sm` 시각 glyph를 사용합니다. 두 크기 모두 투명 native input target은 최소 24×24px이며 명시한 `size`가 상속값보다 우선합니다.
