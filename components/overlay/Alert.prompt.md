**Alert** - WDS modal feedback alert for urgent or important decisions.

```jsx
<Alert open platform="web" title="Delete item?" primaryLabel="Delete" secondaryLabel="Cancel" variant="negative">
  This action cannot be undone.
</Alert>
```

- Use `platform="ios"`, `android`, or `web` to match the target surface.
- WDS axes: `platform`, `variant="normal|negative|assistive"`, `heading`, and primary/secondary actions.
- `tone="danger"` remains as a backward-compatible alias for `variant="negative"`.
- 기본 액션 레이블은 한국어입니다: primary 기본값 **"확인"**(`primaryLabel`/`confirmLabel`로 재정의),
  secondary는 지정할 때만 렌더링합니다.
- Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을
  우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger
  focus 복원을 지원합니다. `initialFocusRef`·`returnFocusRef`로 제품 흐름이 초점을 재정의할 수 있습니다.

### role 규칙 — 항상 `alertdialog`

- Alert는 **언제나 흐름을 멈추고 응답(confirm, 또는 confirm + cancel)을 받는** 표면입니다. 이는 APG
  [Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) 패턴 그 자체이므로 `variant`와
  무관하게 **무조건 `role="alertdialog"`**를 씁니다.
- `variant`(색상 축)에 따라 role을 바꾸지 않습니다. 같은 컴포넌트가 색에 따라 다르게 announce되면
  보조기기 사용자의 예측 가능성이 깨지기 때문입니다.
- `alertdialog`는 초점이 들어올 때 `aria-labelledby`(제목)와 `aria-describedby`(본문)를 함께 읽도록
  보장합니다. 그래서 본문(`description`/`children`)은 항상 `aria-describedby`로 연결됩니다.
- 응답이 필요 없는 비차단 메시지는 Alert가 아니라 `Toast`·`Snackbar`·`Banner`를 쓰세요. 응답이 필요한
  일반 콘텐츠 작업은 `Modal`(`role="dialog"`), 되돌릴 수 없는 확인은 `ConfirmDialog`입니다.

### 접근성 근거와 적용 결론

- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) —
  파괴적 결정에서는 덜 파괴적인 액션을 초기 초점으로 고려하고, modal 내부 Tab 순환과
  Escape·trigger 복원을 요구합니다. Alert의 기본 secondary 우선 정책에 반영했습니다.
- [React Aria Modal](https://react-aria.adobe.com/Modal) — modal overlay가 focus containment와
  복원을 소유하도록 안내합니다. Alert만 독자 document key listener를 두지 않고 LDS의
  `useDialogFocus`를 공유합니다.
