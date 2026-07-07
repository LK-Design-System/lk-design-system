**ConfirmDialog** — 삭제, reset, 배포, 원격 제어처럼 되돌리기 어렵거나 안전 영향이 있는 액션을 확인하는 전용 다이얼로그.

```jsx
<ConfirmDialog
  open={open}
  tone="danger"
  title="경로를 초기화할까요?"
  confirmLabel="초기화"
  cancelLabel="취소"
  onConfirm={resetRoute}
  onCancel={() => setOpen(false)}
>
  저장되지 않은 waypoint 변경 사항이 사라집니다.
</ConfirmDialog>
```

- generic content modal에는 `Modal`, 단순 알림에는 `Alert`, 명시적 확인에는 `ConfirmDialog`를 쓰세요.
- 파괴적 액션은 `tone="danger"`와 구체적인 `confirmLabel`을 사용합니다.
