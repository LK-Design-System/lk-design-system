**Notification** — 알림 행(아이콘 · 제목 · 설명 · 시간 · 안읽음).

```jsx
<Notification icon={<Icon name="bell" />} title="펌웨어 업데이트 완료" description="LKR-SSAI v2.4" time="10분 전" unread />
```

- **icon / title / description / time** — 콘텐츠. **unread** — 시안 워시 + 레드 점. **onClick** — 액션 행. 알림 센터는 `ScrollArea` 안에 쌓으세요.
