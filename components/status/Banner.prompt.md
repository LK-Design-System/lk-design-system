**Banner** — 인라인 공지 바(틴트 서피스, 톤 아이콘, 메시지, 선택적 액션/닫기).

```jsx
<Banner tone="info" title="펌웨어 업데이트" onClose={dismiss}>관제 시스템이 v2.4로 업데이트되었습니다.</Banner>
<Banner tone="warning">현장 통신이 불안정합니다.</Banner>
```

- **tone** — `info · success · warning · error`. **title / children** — 헤드라인 + 본문. **action** — 끝의 노드. **onClose** — 닫기 버튼 표시. 떠 있는 일시 메시지에는 `Toast`를 쓰세요.
