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
- eyebrow·meta는 화면 이해에 필요한 텍스트이므로 `label-neutral` 색과 `label2` 타이포 토큰을 사용합니다. AA 미달인 `label-assistive`·`label-disable`을 필수 텍스트에 쓰지 않습니다.
- **actions** 슬롯에는 버튼·가로형 `SegmentedControl`처럼 헤더 한 줄 높이에 맞는 컨트롤만 배치합니다. 세로형 `FloorSelector` 같은 tall 컨트롤은 헤더가 아니라 맵·뷰어 옆 오버레이에 둡니다.
