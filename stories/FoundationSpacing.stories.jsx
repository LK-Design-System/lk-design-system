import { Button } from '../src/index.js';

const meta = {
  title: 'LDS Core/Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          'Spacing coverage for safe-area spacing: status bar, home indicator, bottom navigation, and bottom actions.',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--surface-card)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-xs)',
};

const phoneStyle = {
  width: 220,
  height: 420,
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-frame-xl)',
  background: 'var(--surface-card)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-md)',
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr auto auto',
};

const statusBarStyle = {
  minHeight: 'var(--mobile-status-bar-min-height)',
  paddingInline: 'var(--space-4)',
  paddingTop: 'var(--mobile-safe-area-top)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: 'var(--label-assistive)',
  fontSize: 11,
  fontWeight: 800,
  borderBottom: '1px solid var(--border-subtle)',
  background: 'var(--fill-alt)',
};

const appBarStyle = {
  height: 48,
  paddingInline: 'var(--space-4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 800,
  color: 'var(--label-normal)',
};

const bottomNavStyle = {
  minHeight: 'var(--mobile-bottom-bar-min-height)',
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  alignItems: 'center',
  gap: 'var(--space-1)',
  padding: 'var(--space-2) var(--space-2) var(--mobile-safe-area-bottom)',
  borderTop: '1px solid var(--border-subtle)',
  background: 'var(--surface-card)',
};

const homeIndicatorStyle = {
  height: 'var(--mobile-home-indicator-height)',
  display: 'grid',
  placeItems: 'center',
  borderTop: '1px solid var(--border-subtle)',
  background: 'var(--fill-alt)',
};

const navItems = ['Home', 'Career', 'Social', 'My', 'Menu'];

function HomeIndicator() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 78,
        height: 4,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--label-assistive)',
      }}
    />
  );
}

function NavItem({ label }) {
  return (
    <span
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 3,
        minWidth: 0,
        color: 'var(--label-alternative)',
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--fill-normal)',
          border: '1px solid var(--border-subtle)',
        }}
      />
      <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </span>
  );
}

function PhoneFrame({ variant = 'status', actionInset = false }) {
  return (
    <div style={phoneStyle}>
      <div style={statusBarStyle}>
        <span>9:41</span>
        <span>LTE 100%</span>
      </div>
      <div style={appBarStyle}>
        <span>Back</span>
        <span>Title</span>
        <span>More</span>
      </div>
      <div style={{ background: 'var(--surface-page)' }} />
      {variant === 'bottom' ? (
        <div style={bottomNavStyle}>
          {navItems.map((item) => (
            <NavItem key={item} label={item} />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: actionInset
              ? 'var(--space-3) var(--space-4) var(--mobile-bottom-action-padding-bottom)'
              : 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--surface-card)',
          }}
        >
          <Button full>Main action</Button>
        </div>
      )}
      <div style={homeIndicatorStyle}>
        <HomeIndicator />
      </div>
    </div>
  );
}

const tokenRows = [
  ['Status safe area', '--mobile-safe-area-top', 'env(safe-area-inset-top)'],
  ['Status minimum height', '--mobile-status-bar-min-height', '44px'],
  ['Bottom safe area', '--mobile-safe-area-bottom', 'env(safe-area-inset-bottom)'],
  ['Home indicator', '--mobile-home-indicator-height', '34px'],
  ['Bottom bar minimum', '--mobile-bottom-bar-min-height', '64px'],
  ['Bottom action padding', '--mobile-bottom-action-padding-bottom', 'space-4 + safe-area-bottom'],
];

export const MobileSafeAreaSpacing = {
  name: 'Mobile safe-area spacing',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Spacing / Safe Area
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Status and bottom safe areas are spacing tokens
        </h1>
        <p style={{ margin: 0, maxWidth: 780, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The spacing source separates the status area and bottom area. LDS keeps those offsets as runtime spacing tokens
          instead of hiding them inside individual mobile components.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--label-strong)' }}>Status</h2>
          <PhoneFrame />
          <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            The top status region combines the status-bar minimum height and safe-area top inset.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--label-strong)' }}>Bottom</h2>
          <PhoneFrame variant="bottom" />
          <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            Bottom navigation keeps the home indicator and safe-area bottom as part of its layout rhythm.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--label-strong)' }}>Bottom action</h2>
          <PhoneFrame actionInset />
          <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            Fixed bottom actions include the bottom safe area so the tappable area remains visible and reachable.
          </p>
        </article>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--label-strong)' }}>Runtime tokens</h2>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {tokenRows.map(([label, token, note]) => (
            <div
              key={token}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(160px, 1fr) minmax(220px, 1fr) minmax(160px, 1fr)',
                gap: 'var(--space-3)',
                alignItems: 'center',
                padding: 'var(--space-3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--fill-alt)',
              }}
            >
              <strong style={{ color: 'var(--label-normal)' }}>{label}</strong>
              <code style={{ color: 'var(--label-alternative)', wordBreak: 'break-word' }}>{token}</code>
              <span style={{ color: 'var(--label-neutral)' }}>{note}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};
