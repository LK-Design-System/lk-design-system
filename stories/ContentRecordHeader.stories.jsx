import {
  Avatar,
  Button,
  Icon,
  IconButton,
  RecordHeader,
  StatList,
  StatusBadge,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Record Header',
  component: RecordHeader,
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-record-header--record-header-overview',
      eyebrow: 'Product / Content / Record Header',
      title: '레코드 헤더는 페이지의 위치가 아니라 현재 보고 있는 대상을 식별합니다',
      description:
        '사람·로봇·주문처럼 대상 자체가 화면의 주인공일 때 사용합니다. 시각 식별자, 이름, 배지, 설명, 세부 정보와 대상 액션을 안정된 읽기 순서로 묶으며, 화면의 위치·업무만 설명할 때는 사용하지 않습니다.',
    },
    docs: {
      description: {
        component: '대상의 시각 식별자, 이름, 배지, 세부 정보와 액션을 묶는 RecordHeader입니다.',
      },
    },
  },
};

export default meta;

export const RecordHeaderOverview = {
  name: '개요',
  parameters: storyDescription(
    '프로필을 하나의 레코드 정체성 헤더로 조립합니다. 아바타와 이름, 인증 상태, 소개, 라벨 붙은 스탯, 대상 액션의 순서와 정렬을 확인하세요.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 960 }}>
      <RecordHeader
        aria-label="장진혁 프로필"
        headingLevel={2}
        visual={<Avatar name="장진혁" size="xlarge" />}
        title="장진혁"
        badge={(
          <span role="img" aria-label="인증된 사용자" title="인증된 사용자" style={{ display: 'flex', color: 'var(--color-semantic-primary-normal)' }}>
            <Icon name="verified-check-fill" size={20} aria-hidden="true" />
          </span>
        )}
        description="Physical AI Engineer · 신입 · 개발"
        details={(
          <StatList
            items={[
              { label: '팔로워', value: 128, href: '#followers' },
              { label: '팔로잉', value: 64, href: '#following' },
              { label: '포인트', value: '3,000P' },
            ]}
          />
        )}
        actions={(
          <>
            <Button variant="outlined" color="assistive">설정</Button>
            <IconButton variant="plain" round label="프로필 공유">
              <Icon name="share" size={20} aria-hidden="true" />
            </IconButton>
          </>
        )}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('header[aria-label="장진혁 프로필"]');
    const visual = header?.querySelector('[data-record-header-visual]');
    const heading = header?.querySelector('h2');
    const details = header?.querySelector('[data-record-header-details]');
    const actions = header?.querySelector('[data-record-header-actions]');
    if (!header || !visual || !heading || !details || !actions) {
      throw new Error('RecordHeader의 visual, 제목, details, actions 영역이 모두 필요합니다.');
    }
    if (heading.textContent.trim() !== '장진혁' || header.querySelectorAll('h2').length !== 1) {
      throw new Error('레코드 이름은 주변 문서 구조와 연결된 하나의 제목(h2)이어야 합니다.');
    }
    if (!(visual.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('visual은 제목보다 앞선 읽기 순서를 가져야 합니다.');
    }
    if (!(details.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('actions는 레코드 세부 정보 뒤의 읽기 순서를 가져야 합니다.');
    }
    const statLink = details.querySelector('a[href]');
    if (!statLink || statLink.getAttribute('aria-label') !== '팔로워 128') {
      throw new Error('이동 가능한 스탯은 라벨과 값을 합친 접근 이름이 필요합니다.');
    }
  },
};

export const DarkTheme = {
  name: '변형·상태 · 다크 테마',
  parameters: storyDescription(
    '같은 레코드 정체성 구조가 다크 semantic theme에서도 제목·설명·상태·액션의 대비와 위계를 유지하는지 확인합니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      className="theme-dark"
      style={{
        width: '100%',
        maxWidth: 960,
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <RecordHeader
        headingLevel={2}
        visual={<Avatar name="LKR-T1" size="xlarge" />}
        title="LKR-T1"
        badge={<StatusBadge tone="positive">운영 중</StatusBadge>}
        description="설비 구역을 자율 순찰하며 계기와 밸브 상태를 점검하는 2륜 AMR입니다."
        details={<StatList items={[{ label: '임무', value: 18 }, { label: '배터리', value: '82%' }]} />}
        actions={<Button variant="outlined" color="assistive">장비 설정</Button>}
      />
    </main>
  ),
};

export const NarrowLongIdentity = {
  name: '반응형 · 긴 이름과 복수 액션',
  parameters: storyDescription(
    '320px 상당의 좁은 폭에서 긴 대상 이름과 설명이 넘치지 않고, visual과 내용 다음에 actions가 내려가는지 확인합니다.',
  ),
  render: () => (
    <main data-record-header-narrow style={{ width: 'min(320px, 100%)', minWidth: 0 }}>
      <RecordHeader
        aria-label="좁은 폭 로봇 레코드"
        headingLevel={2}
        visual={<Avatar name="AMR" size="xlarge" />}
        title="AMR-FLEET-SUPERVISION-OPERATIONS-017"
        badge={<StatusBadge tone="positive">운영 중</StatusBadge>}
        description="대덕 연구동 설비 구역을 순찰하고 안전 상태와 점검 결과를 동기화하는 자율 이동 로봇입니다."
        details={(
          <StatList
            size="sm"
            items={[
              { label: '임무', value: 18 },
              { label: '배터리', value: '82%' },
              { label: '점검', value: 47 },
            ]}
          />
        )}
        actions={(
          <>
            <Button variant="ghost">작업 기록</Button>
            <Button variant="solid" color="primary">장비 열기</Button>
          </>
        )}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-record-header-narrow]');
    const header = fixture?.querySelector('header');
    const content = header?.querySelector('[data-record-header-content]');
    const actions = header?.querySelector('[data-record-header-actions]');
    if (!fixture || !header || !content || !actions) {
      throw new Error('좁은 폭 RecordHeader fixture가 완전해야 합니다.');
    }
    const fixtureRect = fixture.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    if (fixture.scrollWidth > fixture.clientWidth + 1 || contentRect.right > fixtureRect.right + 1 || actionsRect.right > fixtureRect.right + 1) {
      throw new Error('RecordHeader의 내용과 actions는 320px 컨테이너 밖으로 넘치면 안 됩니다.');
    }
    if (actionsRect.top < contentRect.bottom - 1) {
      throw new Error('좁은 폭에서 actions는 대상 내용 다음 flex line으로 내려가야 합니다.');
    }
  },
};
