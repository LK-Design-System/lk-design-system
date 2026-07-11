**Banner** — 인라인 공지 바(틴트 서피스, 톤 아이콘, 메시지, 선택적 액션/닫기).

```jsx
<Banner tone="info" title="문서 업데이트" onClose={dismiss}>디자인 시스템 문서가 업데이트되었습니다.</Banner>
<Banner tone="warning">일부 항목에 검토가 필요합니다.</Banner>
```

- **tone** — `info · success · warning · error`. **title / children** — 헤드라인 + 본문. **action** — 끝의 노드. **onClose** — 닫기 버튼 표시. 떠 있는 일시 메시지에는 `Toast`를 쓰세요.
- tone 아이콘은 공통 `Icon` registry의 `statusToneStyle` 글리프(`circle-info-fill`, `circle-check-fill`, `triangle-exclamation-fill`, `circle-close-fill`)를 사용합니다. severity 글리프를 인라인 SVG로 새로 그리지 않습니다 — 같은 상태는 Callout·ValidationSummary와 같은 모양으로 표시되어야 합니다.
