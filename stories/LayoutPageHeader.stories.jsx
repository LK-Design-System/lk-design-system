import {
  Breadcrumb,
  Button,
  PageHeader,
  SegmentedControl,
  StatusBadge,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h2>
      {children}
    </section>
  );
}

const meta = {
  title: 'LDS Product/Layout/Page Header',
  tags: ['autodocs'],
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
      <Section title="관리 화면 헤더">
        <PageHeader
          headingLevel={3}
          breadcrumb={<Breadcrumb items={[{ label: '관리' }, { label: '사용자' }]} />}
          title="사용자 관리"
          status={<StatusBadge tone="signal">검토 중</StatusBadge>}
          description="계정 상태, 권한, 최근 변경 이력을 확인하는 앱 화면의 상단 계약입니다."
          meta={<><span>마지막 업데이트 10:42 KST</span><span aria-hidden="true">·</span><span>관리자</span></>}
          actions={<><Button variant="ghost">변경 이력</Button><Button variant="solid" color="primary">사용자 추가</Button></>}
        />
      </Section>
      <Section title="Compact 패널 헤더">
        <div style={{ maxWidth: 360, border: '1px dashed var(--color-semantic-line-normal-alternative)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <PageHeader
            headingLevel={3}
            size="sm"
            eyebrow="필터 설정"
            title="목록 조건"
            description="작은 화면이나 도구 패널에서는 compact 크기로 제목과 설명만 유지합니다."
            actions={<Button variant="solid" color="primary" size="sm">저장</Button>}
          />
        </div>
      </Section>
      <Section title="범위 전환 액세서리">
        <PageHeader
          headingLevel={3}
          size="sm"
          eyebrow="시설 모니터링"
          title="층별 현황"
          description="화면 범위를 바꾸는 전환 컨트롤은 가로형 SegmentedControl을 헤더 액세서리로 배치합니다. 세로형 FloorSelector는 맵·뷰어 옆 오버레이 전용입니다."
          actions={<SegmentedControl size="sm" options={['B1', '1F', '2F', '3F']} defaultValue="2F" />}
        />
      </Section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const guideHeading = canvasElement.querySelector('[data-story-guide] h1');
    const sectionHeadings = canvasElement.querySelectorAll('main section > h2');
    const specimenHeadings = canvasElement.querySelectorAll('main h3');
    if (!guideHeading || sectionHeadings.length !== 3 || specimenHeadings.length !== 3 || canvasElement.querySelector('main h1')) {
      throw new Error('The overview guide and labeled PageHeader specimens must form one h1, three section h2 labels, and three specimen h3 headings.');
    }
  },
};

export const NarrowLongTitleAndActions = {
  name: '반응형 · 긴 제목과 복수 액션',
  parameters: storyDescription(
    '좁은 컨테이너에서 긴 페이지 제목과 상태를 먼저 읽고, 복수 액션이 다음 행으로 내려가며 어느 내용도 가로로 잘리지 않는지 확인합니다.',
  ),
  render: () => (
    <main style={{ width: 'min(360px, 100%)', minWidth: 0 }}>
      <PageHeader
        aria-label="좁은 폭 페이지 헤더"
        eyebrow="시설 모니터링"
        title="AMR-FLEET-SUPERVISION-OPERATIONS 장비 운영 현황"
        status={<StatusBadge tone="neutral">동기화됨</StatusBadge>}
        description="긴 제품명과 설명이 있는 화면에서도 제목, 상태, 설명, 액션의 읽기 순서를 유지합니다."
        meta={<span>마지막 업데이트 10:42 KST</span>}
        actions={<><Button variant="ghost">변경 이력</Button><Button variant="solid" color="primary">장비 추가</Button></>}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const pageHeader = canvasElement.querySelector('header[aria-label="좁은 폭 페이지 헤더"]');
    const content = pageHeader?.querySelector('[data-page-header-content]');
    const actions = pageHeader?.querySelector('[data-page-header-actions]');
    const title = pageHeader?.querySelector('h1');
    if (!pageHeader || !content || !actions || !title) {
      throw new Error('Narrow PageHeader fixture is incomplete.');
    }
    if (pageHeader.querySelectorAll('h1').length !== 1) {
      throw new Error('PageHeader must expose exactly one page-level h1.');
    }

    const headerRect = pageHeader.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    if (actionsRect.top < contentRect.bottom - 1) {
      throw new Error('Narrow PageHeader actions must wrap below the content.');
    }
    if (actionsRect.right > headerRect.right + 1 || titleRect.right > headerRect.right + 1) {
      throw new Error('Narrow PageHeader content and actions must stay inside the container.');
    }
  },
};
