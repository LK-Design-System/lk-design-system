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
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
    },
  },
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

function RecordHeaderSizePair({ mode }) {
  const narrow = mode === 'narrow';
  return (
    <section
      aria-label={`${narrow ? '좁은 폭' : '일반 폭'} 레코드 머리글 크기 비교`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 'var(--space-3)',
        width: narrow ? 'min(320px, 100%)' : '100%',
        maxWidth: narrow ? undefined : 920,
      }}
    >
      {['md', 'sm'].map((size) => (
        <RecordHeader
          key={size}
          data-size-contract={`${mode}-${size}`}
          size={size}
          headingLevel={2}
          visual={<Avatar name={size === 'sm' ? '작은 크기' : '기본 크기'} size="xlarge" />}
          title={`${size === 'sm' ? '작은 크기' : '기본 크기'} 레코드`}
          description="설명 글자 크기는 크기 설정과 무관하게 유지됩니다."
          details={<span>연결 항목 12개</span>}
          style={{ padding: 'var(--space-3)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', boxSizing: 'border-box' }}
        />
      ))}
    </section>
  );
}

export const SizeCompatibility = {
  name: '변형·상태 · 기본형과 작은 크기',
  parameters: storyDescription(
    'RecordHeader의 md·sm을 일반 폭과 320px 좁은 폭에서 나란히 비교합니다. sm은 제목을 heading2 scale로 맞추고 내부·행 간격만 줄이며 설명과 세부 정보 typography는 유지합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 960 }}>
      <RecordHeaderSizePair mode="normal" />
      <RecordHeaderSizePair mode="narrow" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const expectations = [
      ['normal-md', 'md', '16px', '8px', '22px'],
      ['normal-sm', 'sm', '12px', '4px', '20px'],
      ['narrow-md', 'md', '16px', '8px', '22px'],
      ['narrow-sm', 'sm', '12px', '4px', '20px'],
    ];
    for (const [contract, size, rowGap, contentGap, titleSize] of expectations) {
      const header = canvasElement.querySelector(`[data-size-contract="${contract}"]`);
      const row = header?.firstElementChild;
      const content = header?.querySelector('[data-record-header-content]');
      const title = header?.querySelector('h2');
      if (!(header instanceof HTMLElement) || !(row instanceof HTMLElement) || !(content instanceof HTMLElement) || !(title instanceof HTMLElement)) {
        throw new Error(`RecordHeader size fixture is incomplete: ${contract}`);
      }
      if (header.dataset.size !== size || getComputedStyle(row).rowGap !== rowGap || getComputedStyle(content).gap !== contentGap || getComputedStyle(title).fontSize !== titleSize) {
        throw new Error(`RecordHeader ${contract} must resolve the documented size dimensions.`);
      }
    }
    for (const mode of ['normal', 'narrow']) {
      const md = canvasElement.querySelector(`[data-size-contract="${mode}-md"]`);
      const sm = canvasElement.querySelector(`[data-size-contract="${mode}-sm"]`);
      const mdDescription = md?.querySelector('p');
      const smDescription = sm?.querySelector('p');
      const mdDetails = md?.querySelector('[data-record-header-details]');
      const smDetails = sm?.querySelector('[data-record-header-details]');
      if (!mdDescription || !smDescription || !mdDetails || !smDetails
        || getComputedStyle(mdDescription).fontSize !== getComputedStyle(smDescription).fontSize
        || getComputedStyle(mdDetails).fontSize !== getComputedStyle(smDetails).fontSize) {
        throw new Error(`RecordHeader size must preserve ${mode} description/details typography.`);
      }
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
