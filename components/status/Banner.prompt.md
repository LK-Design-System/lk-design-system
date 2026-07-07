**Banner** — 인라인 공지 바(틴트 서피스, 톤 아이콘, 메시지, 선택적 액션/닫기).

```jsx
<Banner tone="info" title="문서 업데이트" onClose={dismiss}>디자인 시스템 문서가 업데이트되었습니다.</Banner>
<Banner tone="warning">일부 항목에 검토가 필요합니다.</Banner>
```

- **tone** — `info · success · warning · error`. **title / children** — 헤드라인 + 본문. **action** — 끝의 노드. **onClose** — 닫기 버튼 표시. 떠 있는 일시 메시지에는 `Toast`를 쓰세요.
