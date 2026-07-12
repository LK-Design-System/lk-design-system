import {
  Avatar,
  AvatarGroup,
} from '../src/index.js';
import {
  AvatarCard as AvatarCardStory,
  AvatarGroupCard as AvatarGroupCardStory,
} from './Feedback.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Avatar',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-avatar--avatar-patterns',
      eyebrow: 'Core / Content / Avatar',
      title: '사람과 조직의 정체성을 작은 시각 표식으로 구분합니다',
      description:
        '작성자, 담당자, 참여자처럼 동일한 종류의 주체를 빠르게 식별해야 하는 목록과 협업 화면에 적합합니다. 대상의 이름이 핵심이면 텍스트 레이블을 함께 제공하고, 상태나 범주를 나타낼 때는 Avatar 대신 Status Badge나 Content Badge를 사용하세요.',
    },
    docs: {
      description: {
        component: '플레이스홀더 리소스 패리티를 포함한 Avatar와 AvatarGroup 패턴입니다. 로컬 WDS 스냅샷에서 Avatar 패밀리는 4 Content 섹션 소속이라 Content 그룹에 둡니다(7 Feedback은 토스트·스낵바·알럿만 정의).',
      },
    },
  },
};

export default meta;

const avatarVariants = [
  { label: 'person', variant: 'person' },
  { label: 'company', variant: 'company' },
  { label: 'academy', variant: 'academy' },
];

const personSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const groupSizes = ['xsmall', 'default', 'small'];
const interactionStates = ['normal', 'hovered', 'focused', 'pressed'];

const groupItems = [
  { name: '김' },
  { name: '박' },
  { name: '이' },
  { name: '최' },
];

const avatarResourceRows = [
  {
    label: 'Placeholder / content',
    src: '/assets/source/avatar/resource/avatar-placeholder-content.png',
    avatar: <Avatar variant="person" placeholder size={44} aria-label="콘텐츠 플레이스홀더" />,
  },
  {
    label: 'Placeholder / person',
    src: '/assets/source/avatar/resource/avatar-null.svg',
    avatar: <Avatar variant="person" placeholder size={44} aria-label="인물 플레이스홀더" />,
  },
  {
    label: 'Placeholder / company',
    src: '/assets/source/avatar/resource/avatar-null-company.svg',
    avatar: <Avatar variant="company" placeholder size={44} aria-label="기업 플레이스홀더" />,
  },
  {
    label: 'Placeholder / academy',
    src: '/assets/source/avatar/resource/avatar-null-academy.svg',
    avatar: <Avatar variant="academy" placeholder size={44} aria-label="아카데미 플레이스홀더" />,
  },
  {
    label: 'Deactivate',
    src: '/assets/source/avatar/resource/avatar-deactivate.png',
    avatar: <Avatar variant="person" placeholder size={44} deactivated aria-label="비활성화 플레이스홀더" />,
  },
];

function MatrixSection({ title, children }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

function MatrixRow({ label, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr)', gap: 'var(--space-3)', alignItems: 'center' }}>
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12, fontWeight: 'var(--fw-semibold)' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

function ExampleTile({ label, children, width = 86 }) {
  return (
    <span style={{ display: 'inline-grid', gap: 'var(--space-2)', justifyItems: 'center', width }}>
      <span style={{ minHeight: 64, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{children}</span>
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 11, lineHeight: 1.25, textAlign: 'center' }}>{label}</span>
    </span>
  );
}

function AvatarResourceComparison() {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3, color: 'var(--color-semantic-label-normal)' }}>리소스 패리티</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(132px, 100%), 1fr))', gap: 'var(--space-3)' }}>
        {avatarResourceRows.map((row) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-semantic-line-normal-normal)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-semantic-background-elevated-normal)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <img src={row.src} alt={`${row.label} 리소스`} style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
              {row.avatar}
            </div>
            <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12, lineHeight: 1.35 }}>{row.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const AvatarPatterns = {
  name: '개요',
  parameters: storyDescription(
    '사람·회사·기관의 단일 아바타와 겹친 참여자 그룹을 다양한 크기와 상태로 표시하는 상황입니다. 플레이스홀더, 상호작용, 푸시 배지, 그룹 초과 인원이 정체성을 가리지 않고 접근 가능한 이름을 유지하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <MatrixSection title="Person Avatar">
        <MatrixRow label="variant">
          {avatarVariants.map((item) => (
            <ExampleTile key={item.variant} label={item.label}>
              <Avatar variant={item.variant} placeholder size="default" aria-label={`${item.label} 아바타`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="size">
          {personSizes.map((size) => (
            <ExampleTile key={size} label={size} width={76}>
              <Avatar name="L" size={size} aria-label={`${size} 아바타`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="placeholder">
          <ExampleTile label="false">
            <Avatar variant="person" placeholder={false} name="LK" size="default" aria-label="이니셜 아바타" />
          </ExampleTile>
          <ExampleTile label="true">
            <Avatar variant="person" placeholder size="default" aria-label="플레이스홀더 아바타" />
          </ExampleTile>
        </MatrixRow>
        <MatrixRow label="interaction">
          {interactionStates.map((state) => (
            <ExampleTile key={state} label={state}>
              <Avatar variant="person" placeholder interaction={state} size="default" aria-label={`${state} 아바타`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="pushBadge">
          <ExampleTile label="false">
            <Avatar variant="person" placeholder size="default" aria-label="푸시 배지가 없는 아바타" />
          </ExampleTile>
          <ExampleTile label="true">
            <Avatar variant="person" placeholder pushBadge size="default" aria-label="푸시 배지가 있는 아바타" />
          </ExampleTile>
        </MatrixRow>
        <MatrixRow label="customize">
          <ExampleTile label="borderColor">
            <Avatar variant="person" placeholder borderColor="var(--color-semantic-primary-normal)" size="default" aria-label="커스텀 테두리 색상 아바타" />
          </ExampleTile>
          <ExampleTile label="borderWeight">
            <Avatar variant="person" placeholder borderColor="var(--color-semantic-line-solid-normal)" borderWeight={3} size="default" aria-label="커스텀 테두리 두께 아바타" />
          </ExampleTile>
          <ExampleTile label="size">
            <Avatar variant="person" placeholder size="xlarge" aria-label="커스텀 크기 아바타" />
          </ExampleTile>
        </MatrixRow>
      </MatrixSection>

      <MatrixSection title="Avatar Group">
        <MatrixRow label="variant">
          {avatarVariants.map((item) => (
            <ExampleTile key={item.variant} label={item.label} width={132}>
              <AvatarGroup variant={item.variant} placeholder max={4} size="default" items={groupItems} aria-label={`${item.label} 아바타 그룹`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="size">
          {groupSizes.map((size) => (
            <ExampleTile key={size} label={size} width={118}>
              <AvatarGroup size={size} max={4} items={groupItems} aria-label={`${size} 아바타 그룹`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="trailingContent">
          <ExampleTile label="false" width={128}>
            <AvatarGroup max={4} items={groupItems} aria-label="트레일링 콘텐츠가 없는 아바타 그룹" />
          </ExampleTile>
          <ExampleTile label="true" width={150}>
            <AvatarGroup max={4} items={groupItems} trailingContent trailingLabel="외 0명" aria-label="트레일링 콘텐츠가 있는 아바타 그룹" />
          </ExampleTile>
        </MatrixRow>
      </MatrixSection>

      <AvatarResourceComparison />
    </main>
  ),
};

export const AvatarCard = { ...AvatarCardStory, name: 'Avatar card parity', tags: ['!dev', 'visual-parity'] };
export const AvatarGroupCard = { ...AvatarGroupCardStory, name: 'AvatarGroup card parity', tags: ['!dev', 'visual-parity'] };
