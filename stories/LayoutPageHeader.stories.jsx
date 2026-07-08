import {
  Breadcrumb,
  Button,
  FloorSelector,
  PageHeader,
  StatusBadge,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Layout/Page Header',
  parameters: {
    docs: {
      description: {
        component: '앱 화면의 제목, 설명, 상태, 경로, primary action을 일관되게 정렬하는 PageHeader입니다.',
      },
    },
  },
};

export default meta;

export const PageHeaderPattern = {
  name: '페이지 헤더',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 1040 }}>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: '관리' }, { label: '사용자' }]} />}
        title="사용자 관리"
        status={<StatusBadge tone="signal">검토 중</StatusBadge>}
        description="계정 상태, 권한, 최근 변경 이력을 확인하는 앱 화면의 상단 계약입니다."
        meta={<><span>마지막 업데이트 10:42 KST</span><span>관리자</span></>}
        actions={<><Button variant="ghost">변경 이력</Button><Button variant="signal">사용자 추가</Button></>}
      />
      <PageHeader
        size="sm"
        eyebrow="필터 설정"
        title="목록 조건"
        description="작은 화면이나 도구 패널에서는 compact 크기로 제목과 설명만 유지합니다."
        actions={<Button variant="secondary" size="sm">저장</Button>}
      />
      <PageHeader
        size="sm"
        eyebrow="시설 모니터링"
        title="층별 현황"
        description="층 전환처럼 화면 범위를 바꾸는 셀렉터는 헤더 액세서리로 배치합니다."
        actions={<FloorSelector floors={['B1', '1F', '2F', '3F']} defaultValue="2F" />}
      />
    </main>
  ),
};
