import {
  Avatar,
  AvatarGroup,
} from '../src/index.js';
import {
  AvatarCard as AvatarCardStory,
  AvatarGroupCard as AvatarGroupCardStory,
} from './Feedback.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Avatar',
  parameters: {
    docs: {
      description: {
        component: 'Avatar and AvatarGroup patterns with placeholder resource parity.',
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
    avatar: <Avatar variant="person" placeholder size={44} aria-label="Content placeholder" />,
  },
  {
    label: 'Placeholder / person',
    src: '/assets/source/avatar/resource/avatar-null.svg',
    avatar: <Avatar variant="person" placeholder size={44} aria-label="Person placeholder" />,
  },
  {
    label: 'Placeholder / company',
    src: '/assets/source/avatar/resource/avatar-null-company.svg',
    avatar: <Avatar variant="company" placeholder size={44} aria-label="Company placeholder" />,
  },
  {
    label: 'Placeholder / academy',
    src: '/assets/source/avatar/resource/avatar-null-academy.svg',
    avatar: <Avatar variant="academy" placeholder size={44} aria-label="Academy placeholder" />,
  },
  {
    label: 'Deactivate',
    src: '/assets/source/avatar/resource/avatar-deactivate.png',
    avatar: <Avatar variant="person" placeholder size={44} deactivated aria-label="Deactivated placeholder" />,
  },
];

function MatrixSection({ title, children }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-card)',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

function MatrixRow({ label, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr)', gap: 'var(--space-3)', alignItems: 'center' }}>
      <span style={{ color: 'var(--label-alternative)', fontSize: 12, fontWeight: 'var(--fw-semibold)' }}>{label}</span>
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
      <span style={{ color: 'var(--label-alternative)', fontSize: 11, lineHeight: 1.25, textAlign: 'center' }}>{label}</span>
    </span>
  );
}

function AvatarResourceComparison() {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3, color: 'var(--label-normal)' }}>Resource parity</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(132px, 100%), 1fr))', gap: 'var(--space-3)' }}>
        {avatarResourceRows.map((row) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <img src={row.src} alt={`${row.label} resource`} style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
              {row.avatar}
            </div>
            <span style={{ color: 'var(--label-alternative)', fontSize: 12, lineHeight: 1.35 }}>{row.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const AvatarPatterns = {
  name: '아바타',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <MatrixSection title="Person Avatar">
        <MatrixRow label="variant">
          {avatarVariants.map((item) => (
            <ExampleTile key={item.variant} label={item.label}>
              <Avatar variant={item.variant} placeholder size="default" aria-label={`${item.label} avatar`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="size">
          {personSizes.map((size) => (
            <ExampleTile key={size} label={size} width={76}>
              <Avatar name="L" size={size} aria-label={`${size} avatar`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="placeholder">
          <ExampleTile label="false">
            <Avatar variant="person" placeholder={false} name="LK" size="default" aria-label="Initial avatar" />
          </ExampleTile>
          <ExampleTile label="true">
            <Avatar variant="person" placeholder size="default" aria-label="Placeholder avatar" />
          </ExampleTile>
        </MatrixRow>
        <MatrixRow label="interaction">
          {interactionStates.map((state) => (
            <ExampleTile key={state} label={state}>
              <Avatar variant="person" placeholder interaction={state} size="default" aria-label={`${state} avatar`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="pushBadge">
          <ExampleTile label="false">
            <Avatar variant="person" placeholder size="default" aria-label="Avatar without push badge" />
          </ExampleTile>
          <ExampleTile label="true">
            <Avatar variant="person" placeholder pushBadge size="default" aria-label="Avatar with push badge" />
          </ExampleTile>
        </MatrixRow>
        <MatrixRow label="customize">
          <ExampleTile label="borderColor">
            <Avatar variant="person" placeholder borderColor="var(--lk-accent-ink)" size="default" aria-label="Avatar with custom border color" />
          </ExampleTile>
          <ExampleTile label="borderWeight">
            <Avatar variant="person" placeholder borderColor="var(--border-strong)" borderWeight={3} size="default" aria-label="Avatar with custom border weight" />
          </ExampleTile>
          <ExampleTile label="size">
            <Avatar variant="person" placeholder size="xlarge" aria-label="Customized size avatar" />
          </ExampleTile>
        </MatrixRow>
      </MatrixSection>

      <MatrixSection title="Avatar Group">
        <MatrixRow label="variant">
          {avatarVariants.map((item) => (
            <ExampleTile key={item.variant} label={item.label} width={132}>
              <AvatarGroup variant={item.variant} placeholder max={4} size="default" items={groupItems} aria-label={`${item.label} avatar group`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="size">
          {groupSizes.map((size) => (
            <ExampleTile key={size} label={size} width={118}>
              <AvatarGroup size={size} max={4} items={groupItems} aria-label={`${size} avatar group`} />
            </ExampleTile>
          ))}
        </MatrixRow>
        <MatrixRow label="trailingContent">
          <ExampleTile label="false" width={128}>
            <AvatarGroup max={4} items={groupItems} aria-label="Avatar group without trailing content" />
          </ExampleTile>
          <ExampleTile label="true" width={150}>
            <AvatarGroup max={4} items={groupItems} trailingContent trailingLabel="외 0명" aria-label="Avatar group with trailing content" />
          </ExampleTile>
        </MatrixRow>
      </MatrixSection>

      <AvatarResourceComparison />
    </main>
  ),
};

export const AvatarCard = { ...AvatarCardStory, name: 'Avatar card parity', tags: ['!dev', 'visual-parity'] };
export const AvatarGroupCard = { ...AvatarGroupCardStory, name: 'AvatarGroup card parity', tags: ['!dev', 'visual-parity'] };
