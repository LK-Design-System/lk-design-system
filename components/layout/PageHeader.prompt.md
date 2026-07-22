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
- 앱 화면마다 hero를 새로 만들지 말고 반복되는 앱 헤더에는 `PageHeader`를 쓰세요. 기본 `headingLevel={1}`로 한 화면에 하나만 배치합니다. 문서·비교 도구처럼 상위 제목이 이미 있는 합성 표면에서만 `headingLevel={2..6}`으로 주변 heading 구조에 연결합니다.
- eyebrow·meta는 화면 이해에 필요한 텍스트이므로 `label-neutral` 색과 `label2` 타이포 토큰을 사용합니다. AA 미달인 `label-assistive`·`label-disable`을 필수 텍스트에 쓰지 않습니다.
- **actions** 슬롯에는 버튼·가로형 `SegmentedControl`처럼 헤더 한 줄 높이에 맞는 컨트롤만 배치합니다. 세로형 `FloorSelector` 같은 tall 컨트롤은 헤더가 아니라 맵·뷰어 옆 오버레이에 둡니다.
- breadcrumb·eyebrow는 제목 위의 전용 풀폭 컨텍스트 행입니다. 넓은 컨테이너에서 actions는
  컨텍스트 행이 아니라 **제목 행에 정렬**되어 좌측 스택 옆에 뜬 공백을 만들지 않습니다. 좁은
  컨테이너에서는 DOM과 읽기 순서를 바꾸지 않은 채 actions가 다음 행으로 내려가고 내부 버튼도
  wrap합니다. 긴 제목·설명은 단어를 자르지 않는 것을 우선하되 끊을 수 없는 문자열은 컨테이너
  밖으로 넘치지 않게 줄바꿈합니다.

외부 근거:

- [WCAG 2.2 Reflow](https://www.w3.org/TR/WCAG22/#reflow)에 맞춰 320 CSS px 상당의 좁은 폭에서 페이지 chrome이 양방향 스크롤을 요구하지 않도록 본문과 actions를 재배치합니다.
- [WAI Landmarks Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)의 고수준 구조 원칙에 따라 PageHeader는 `main` 안의 로컬 `<header>`이며, TopBar의 전역 banner나 Storybook 설명 chrome을 대체하지 않습니다.
