import { ActionArea, Button, Chip, Icon, IconButton, TextButton, ToggleIcon } from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/2 Action/Action Area',
  parameters: {
    docs: {
      description: {
        component: 'WDS Action PDF coverage for Action Area, Button, Text Button, Icon Button, Chip, and Toggle Icon.',
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
          WDS Action
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Action controls share one taxonomy
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The WDS Action PDF groups Action Area, Button, Text Button, Icon Button, Chip, and Toggle Icon together.
          LDS keeps those roles explicit so action styling does not drift across separate stories.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Button</h2>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <Button>Main action</Button>
            <Button variant="ghost">Outlined</Button>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Text Button</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <TextButton>More</TextButton>
            <TextButton tone="neutral">Cancel</TextButton>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Icon Button</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <IconButton label="Search"><Icon name="search" size={18} /></IconButton>
            <IconButton label="Add" variant="solid"><Icon name="plus" size={18} /></IconButton>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Chip</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Chip>Normal</Chip>
            <Chip selected>Active</Chip>
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
          WDS Action / Action Area
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
            <Button style={{ flex: 1 }}>Main action</Button>
            <Button variant="ghost" style={{ flex: 1 }}>Alternative</Button>
          </ActionArea>
        </div>
      </section>
    </main>
  ),
};
