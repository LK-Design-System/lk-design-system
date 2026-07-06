**ListCell** — 핵심 리스트 행: 36px 리딩 타일(아이콘/아바타) · 제목 + 설명 · 트레일링(값 / 셰브론 / 스위치). 인터랙티브 행에는 `onClick`을 설정하세요.

```jsx
<ListCell leading={<Icon name="document" />} title="현장 실사 보고서" description="2026.06.30 · PDF"
          trailing={<Icon name="chevron-right" />} onClick={open} divider />
<ListCell title="실시간 알림" trailing={<Switch defaultChecked />} />
```

- **leading / title / description / trailing** — 임의의 노드; 제목·설명은 말줄임. **onClick** — 인터랙티브(호버 워시 + 키보드 focus ring). **divider** — 리딩 타일 뒤에서 시작하고 트레일링 액션 앞에서 끝나는 inset 헤어라인.
- 설정/리소스 리스트를 만들려면 `Card` 안에 여러 개를 쌓으세요.
