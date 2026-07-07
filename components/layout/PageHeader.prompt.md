**PageHeader** — 앱 화면의 제목, 설명, 상태 badge, breadcrumb, primary action을 정렬하는 페이지 상단 계약.

```jsx
<PageHeader
  breadcrumb={<Breadcrumb items={[{ label: '관리' }, { label: '사용자' }]} />}
  title="사용자 관리"
  status={<StatusBadge tone="signal">검토 중</StatusBadge>}
  description="계정 상태와 최근 변경 이력을 확인합니다."
  actions={<Button>사용자 추가</Button>}
/>
```

- **title**은 필수입니다. **breadcrumb**, **eyebrow**, **description**, **status**, **meta**, **actions**는 슬롯입니다.
- 앱 화면마다 hero를 새로 만들지 말고 반복되는 앱 헤더에는 `PageHeader`를 쓰세요.
