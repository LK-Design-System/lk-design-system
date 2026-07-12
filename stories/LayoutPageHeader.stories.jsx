import {
  Breadcrumb,
  Button,
  PageHeader,
  SegmentedControl,
  StatusBadge,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Layout/Page Header',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-layout-page-header--page-header-pattern',
      eyebrow: 'Product / Page Header',
      title: '사용자가 현재 화면의 위치·상태·목적과 다음 주요 작업을 이해합니다',
      description:
        '제품 화면의 breadcrumb, 제목, 설명, 상태, 메타데이터, 주요 액션을 일관된 상단 영역으로 묶을 때 적합합니다. 카드나 작은 섹션 제목에는 PageHeader 대신 해당 영역의 heading과 필요한 액션만 사용하세요.',
    },
    docs: {
      description: {
        component: '앱 화면의 제목, 설명, 상태, 경로, primary action을 일관되게 정렬하는 PageHeader입니다.',
      },
    },
  },
};

export default meta;

export const PageHeaderPattern = {
  name: '개요',
  parameters: storyDescription(
    '관리 화면, compact 패널, 범위 전환 화면에서 PageHeader 구성을 비교하는 상황입니다. 경로·제목·상태·설명·액션의 읽기 순서와 좁은 구성의 정보 축약이 일관적인지 확인하세요.',
  ),
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
      <div style={{ maxWidth: 360, border: '1px dashed var(--color-semantic-line-normal-alternative)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
        <PageHeader
          size="sm"
          eyebrow="필터 설정"
          title="목록 조건"
          description="작은 화면이나 도구 패널에서는 compact 크기로 제목과 설명만 유지합니다."
          actions={<Button variant="secondary" size="sm">저장</Button>}
        />
      </div>
      <PageHeader
        size="sm"
        eyebrow="시설 모니터링"
        title="층별 현황"
        description="화면 범위를 바꾸는 전환 컨트롤은 가로형 SegmentedControl을 헤더 액세서리로 배치합니다. 세로형 FloorSelector는 맵·뷰어 옆 오버레이 전용입니다."
        actions={<SegmentedControl size="sm" options={['B1', '1F', '2F', '3F']} defaultValue="2F" />}
      />
    </main>
  ),
};
