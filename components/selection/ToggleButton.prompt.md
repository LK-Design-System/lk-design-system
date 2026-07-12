**ToggleButton**은 독립 기능의 켬·끔 상태를 버튼 자체에 유지하는 LK Product
Extension입니다. 선택 상태는 surface와 `aria-pressed`로 함께 전달합니다.

```jsx
<ToggleButton icon={<Icon name="eye" size={18} />} onChange={setPreview}>
  미리보기
</ToggleButton>
<ToggleButton defaultPressed icon={<Icon name="star" size={18} />} aria-label="즐겨찾기" />
```

- **pressed / defaultPressed / onChange(next)**는 제어/비제어 상태입니다.
- **size**는 Button family와 같은 `sm/md/lg` = 32/40/48px입니다.
- native `disabled`와 focus 가능한 `aria-disabled`를 구분하며 두 경우 모두
  activation을 막고 같은 unavailable 스타일을 적용합니다.
- 아이콘 전용 사용은 구체적인 `aria-label`을 반드시 제공합니다.
- hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer
  pressed 상태를 동일하게 취급하지 않습니다.
- 여러 보기 중 하나를 고르는 전환에는 `SegmentedControl`, 여러 독립 토글을
  묶을 때는 `ButtonGroup multiple`, 슬라이드 on/off에는 `Switch`를 사용합니다.

## 근거

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
  고정 label + `aria-pressed` 계약을 따릅니다.
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)은
  toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는
  Switch를 사용하도록 구분합니다.
