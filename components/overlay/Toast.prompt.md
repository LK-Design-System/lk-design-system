**Toast** — 떠 있는 일시 메시지(다크 네이비 카드, 톤 아이콘, 화이트 텍스트). 프레젠테이션 전용 — 타임아웃 + 뷰포트 스태킹은 직접 조합하세요.

```jsx
<Toast tone="success" action="확인">지원이 완료되었어요</Toast>
<Toast tone="info" onClose={dismiss}>대시보드로 이동했습니다.</Toast>
```

- **tone** — `info · success · warning · error`. **action** — 끝의 링크 노드. **onClose** — 닫기 버튼. 인라인·지속 공지에는 `Banner`를 쓰세요.
