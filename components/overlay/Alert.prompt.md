**Alert** — 네이비 스크림 위 중앙 모달 확인 다이얼로그. `open`으로 제어합니다.

```jsx
<Alert open={open} title="로봇을 정지할까요?" tone="danger"
  confirmLabel="정지" cancelLabel="취소"
  onConfirm={stop} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
  현재 순찰 중인 LKR-T1 3대가 즉시 정지됩니다.
</Alert>
```

- **open** — 표시 여부. **title / children** — 제목 + 본문. **tone** `default | danger`(레드 확인). **confirmLabel / cancelLabel / onConfirm / onCancel**. **actions** — 푸터를 직접 노드로 교체. Esc·스크림 클릭은 **onClose**를 호출.
