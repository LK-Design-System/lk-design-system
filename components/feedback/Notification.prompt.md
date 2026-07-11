**Notification** — 알림 행(아이콘 · 제목 · 설명 · 시간 · 안읽음).

```jsx
<Notification icon={<Icon name="bell" />} title="펌웨어 업데이트 완료" description="LKR-SSAI v2.4" time="10분 전" unread />
```

- **icon / title / description / time** — 콘텐츠. 시간은 제목 행 오른쪽에 배치합니다.
- **unread** — 낮은 primary surface와 primary 점 하나로만 표현합니다. 오류색을 사용하지 않습니다.
- **onClick** — 키보드 접근 가능한 native button 행으로 전환합니다.
- 알림 센터에서는 외부 `ul`만 테두리를 소유하고, 첫·마지막 `li`에 해당 모서리 radius를 적용해 행의 highlight/focus surface가 잘리지 않게 합니다. 행 사이는 1px divider로 구분한 뒤 `ScrollArea` 안에 쌓으세요.
