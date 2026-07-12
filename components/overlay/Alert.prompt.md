**Alert** - WDS modal feedback alert for urgent or important decisions.

```jsx
<Alert open platform="web" title="Delete item?" primaryLabel="Delete" secondaryLabel="Cancel" variant="negative">
  This action cannot be undone.
</Alert>
```

- Use `platform="ios"`, `android`, or `web` to match the target surface.
- WDS axes: `platform`, `variant="normal|negative|assistive"`, `heading`, and primary/secondary actions.
- `tone="danger"` remains as a backward-compatible alias for `variant="negative"`.
- Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을
  우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger
  focus 복원을 지원합니다. `initialFocusRef`·`returnFocusRef`로 제품 흐름이 초점을 재정의할 수 있습니다.

### 접근성 근거와 적용 결론

- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) —
  파괴적 결정에서는 덜 파괴적인 액션을 초기 초점으로 고려하고, modal 내부 Tab 순환과
  Escape·trigger 복원을 요구합니다. Alert의 기본 secondary 우선 정책에 반영했습니다.
- [React Aria Modal](https://react-aria.adobe.com/Modal) — modal overlay가 focus containment와
  복원을 소유하도록 안내합니다. Alert만 독자 document key listener를 두지 않고 LDS의
  `useDialogFocus`를 공유합니다.
