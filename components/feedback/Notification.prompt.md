**Notification** — 알림 행(아이콘 · 제목 · 설명 · 시간 · 안읽음).

```jsx
<Notification icon={<Icon name="bell" />} title="펌웨어 업데이트 완료" description="LKR-SSAI v2.4" time="10분 전" unread />
```

- **icon / title / description / time** — 콘텐츠. 시간은 제목 행 오른쪽에 배치하고, 상대 시각("2분 전")을 쓸 때는 `dateTime`으로 ISO 절대 시각을 함께 전달합니다.
- **tone** — `positive · cautionary · negative · signal · offline`. 리딩 아이콘 chip을 공통 `statusToneStyle` 문법(tone surface 배경 + tone text 전경)으로 칠합니다. 이벤트의 의미가 severity를 가질 때만 사용하고, 생략하면 중립 chip입니다.
- 리딩 아이콘은 **36px 둥근 사각(`radius-md`) 타일**입니다 — `ListCell` 등에서 쓰는 서명된 LK icon-tile 브랜드 패턴과 같은 문법이며, 원형 등 새 chip 모양을 만들지 않습니다.
- **unread** — 낮은 primary surface와 primary 점 하나로만 표현합니다. 오류색을 사용하지 않습니다.
- **onClick** — 키보드 접근 가능한 native button 행으로 전환합니다.
- 행 단위 dismiss·읽음 토글 같은 trailing 액션은 의도적으로 제외된 Product extension입니다. 필요하면 행을 감싸는 조합으로 구현하고 이 컴포넌트에 슬롯을 추가하지 마세요.
- 알림 센터에서는 외부 `ul`만 테두리를 소유하고, 첫·마지막 `li`에 해당 모서리 radius를 적용해 행의 highlight/focus surface가 잘리지 않게 합니다. 행 사이는 1px divider로 구분한 뒤 `ScrollArea` 안에 쌓으세요.
