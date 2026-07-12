**SplitButton**은 자주 쓰는 기본 액션과 그 액션에 밀접한 대안을 연결하는
LK Product Extension입니다.

```jsx
<SplitButton
  variant="signal"
  onClick={save}
  loading={saving}
  loadingLabel="저장 중"
  menuLabel="저장 방법 열기"
  items={[
    { label: '초안으로 저장', onClick: draft },
    { label: '예약 저장', onClick: schedule },
    { label: '내보내기', onClick: exportFile, disabled: !canExport },
  ]}
>
  저장
</SplitButton>
```

- **onClick**은 기본 액션, **items**는 관련 대안 `{ label, icon, onClick,
  disabled, danger }`입니다. 기본 액션을 menu에서 반복하지 않습니다.
- **variant**는 `primary · secondary · signal · dark`, **size**는 Button과 같은
  `sm/md/lg` = 32/40/48px입니다.
- `disabled`와 `loading`은 두 segment를 함께 막습니다. loading label은 하나의
  accessible name으로 노출되고 버튼 폭은 유지됩니다.
- menu segment는 `aria-haspopup`, `aria-expanded`, `aria-controls`를 노출합니다.
  Enter/Space/ArrowDown은 첫 항목, ArrowUp은 마지막 항목으로 열며,
  ArrowUp/Down·Home/End로 이동하고 Escape는 닫은 뒤 trigger로 focus를 복원합니다.
- hover/pressed는 tone만 변경하며 lift·scale·shadow는 사용하지 않습니다.

## 근거와 유지 차이

- WDS `.fig`에는 SplitButton component set이 없으므로 WDS Core로 주장하지
  않습니다.
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)과
  [Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)의 menu ARIA,
  roving focus, Escape 복원을 구현합니다.
- [Carbon Menu Buttons](https://carbondesignsystem.com/components/menu-buttons/usage/)의
  일반 Button과 동일한 32/40/48 높이·상태 문법을 적용하고,
  [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)의
  dominant action + related alternatives 구분을 따릅니다.
