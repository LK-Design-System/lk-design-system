import { ActionArea, Button, Chip, Icon, IconButton, TextButton, ToggleIcon } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Action/Action Area',
  parameters: {
    docs: {
      description: {
        component: 'Action coverage for Action Area, Button, Text Button, Icon Button, Chip, and Toggle Icon.',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--surface-card)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-xs)',
};

export const ActionTaxonomy = {
  name: 'Action taxonomy',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Action
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Action controls share one taxonomy
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The action system groups Action Area, Button, Text Button, Icon Button, Chip, and Toggle Icon together.
          LDS keeps those roles explicit so action styling does not drift across separate stories.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Button</h2>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <Button>Main action</Button>
            <Button variant="outlined" color="primary">Outlined</Button>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Text Button</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <TextButton color="primary">More</TextButton>
            <TextButton color="assistive">Cancel</TextButton>
            <TextButton loading loadingLabel="Loading more">Loading</TextButton>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Icon Button</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <IconButton label="Search" size="small"><Icon name="search" size={18} /></IconButton>
            <IconButton label="Add" size="medium" variant="solid"><Icon name="plus" size={18} /></IconButton>
            <IconButton label="Custom" size="custom" variant="ghost"><Icon name="settings" size={16} /></IconButton>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Chip</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Chip size="xsmall">XS</Chip>
            <Chip size="small">Small</Chip>
            <Chip size="medium">Medium</Chip>
            <Chip size="large">Large</Chip>
            <Chip active>Active</Chip>
            <Chip variant="solid">Solid</Chip>
            <Chip variant="outlined">Outlined</Chip>
            <Chip leading={<Icon name="filter" size={14} />}>Icon</Chip>
            <Chip thumbnail={<span style={{ width: '100%', height: '100%', background: 'var(--lk-accent-tint-2)' }} />}>Thumb</Chip>
            <Chip disable>Disabled</Chip>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Toggle Icon</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <ToggleIcon label="Show preview" defaultPressed><Icon name="eye" size={18} /></ToggleIcon>
            <ToggleIcon label="Favorite"><Icon name="star" size={18} /></ToggleIcon>
          </div>
        </article>
      </section>
    </main>
  ),
};

export const BottomActionArea = {
  name: 'Bottom action area',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 880 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Action / Action Area
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Action Area owns bottom placement, divider, caption, sticky, and safe-area padding
        </h1>
      </header>

      <section style={panelStyle}>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: '1fr auto',
            minHeight: 420,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-frame-lg)',
            overflow: 'hidden',
            background: 'var(--surface-subtle)',
          }}
        >
          <div style={{ padding: 'var(--space-5)', color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            Content area
          </div>
          <ActionArea
            safeArea
            summary={<><strong>Summary</strong><span style={{ color: 'var(--label-neutral)' }}>Value and status can sit above actions.</span></>}
            caption="Optional caption explains the consequence of the primary action."
          >
            <Button variant="solid" color="primary" style={{ flex: 1 }}>Main action</Button>
            <Button variant="outlined" color="assistive" style={{ flex: 1 }}>Alternative</Button>
          </ActionArea>
        </div>
      </section>
    </main>
  ),
};
