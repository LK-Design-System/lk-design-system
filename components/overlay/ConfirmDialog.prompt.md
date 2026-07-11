**ConfirmDialog** — 삭제, reset, 배포, 원격 제어처럼 되돌리기 어렵거나 안전 영향이 있는 액션을 확인하는 전용 다이얼로그.

```jsx
<ConfirmDialog
  open={open}
  tone="danger"
  title="경로를 초기화할까요?"
  confirmLabel="초기화"
  cancelLabel="취소"
  confirmDisabled={!ready}
  confirmLoading={submitting}
  onConfirm={resetRoute}
  onCancel={() => setOpen(false)}
>
  저장되지 않은 waypoint 변경 사항이 사라집니다.
</ConfirmDialog>
```

- generic content modal에는 `Modal`, 단순 알림에는 `Alert`, 명시적 확인에는 `ConfirmDialog`를 쓰세요.
- 파괴적 액션은 `tone="danger"`와 구체적인 `confirmLabel`을 사용합니다.
- `tone="warning"`/`"danger"`는 색상만 바꾸지 않고 `StatusBadge`의 주의/위험 텍스트를 함께 노출합니다. 제품 용어가 필요하면 `toneLabel`을 전달합니다.
- 조건이 충족되기 전에는 `confirmDisabled`, 요청 중에는 `confirmLoading`을 사용해 중복 실행을 막습니다.
- 하단 CTA는 `ActionArea align="end"`와 기본 `Button` medium 높이(40px)를 따르며, 버튼 사이는 spacing token 8px을 유지합니다.
- 열리면 취소 액션으로 초점을 이동하고, Tab 초점을 다이얼로그 안에 유지하며, 닫힐 때 이전 초점으로 복원합니다.
