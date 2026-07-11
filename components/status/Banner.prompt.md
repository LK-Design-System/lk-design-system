**Banner** — 인라인 공지 바(틴트 서피스, 톤 아이콘, 메시지, 선택적 액션/닫기).

```jsx
<Banner tone="info" title="문서 업데이트" onClose={dismiss}>디자인 시스템 문서가 업데이트되었습니다.</Banner>
<Banner tone="warning">일부 항목에 검토가 필요합니다.</Banner>
```

- **tone** — canonical `signal · positive · cautionary · negative`를 받으며, 기존 `info · success · warning · error`도 별칭으로 계속 동작합니다. **title / children** — 헤드라인 + 본문. **action** — 끝의 노드. **onClose** — 닫기 버튼 표시. 떠 있는 일시 메시지에는 `Toast`를 쓰세요.
- tone 아이콘은 공통 `Icon` registry의 `statusToneStyle` 글리프(`circle-info-fill`, `circle-check-fill`, `triangle-exclamation-fill`, `circle-close-fill`)를 사용합니다. severity 글리프를 인라인 SVG로 새로 그리지 않습니다 — 같은 상태는 Callout·ValidationSummary와 같은 모양으로 표시되어야 합니다.
- 타입 스케일 정합: 제목 14.5px → `--body2-size`(15px), 본문 13.5px → `--label1-size`(14px)로 스냅했습니다. Toast 메시지(body2)·Snackbar 메시지(label1)와 같은 단계로 정렬됩니다.
