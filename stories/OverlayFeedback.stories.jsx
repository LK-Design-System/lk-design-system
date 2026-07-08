import {
  AlertCard as AlertCardStory,
  AlertOpen as AlertOpenStory,
  AlertToastCard as AlertToastCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Feedback/Confirm Alert',
  parameters: {
    docs: {
      description: {
        component: 'Modal feedback alert patterns aligned with Alert platform treatments.',
      },
    },
  },
};

export default meta;

const alertVariantColor = {
  normal: 'var(--lk-accent-ink)',
  negative: 'var(--bw-red)',
  assistive: 'var(--label-neutral)',
};

function AlertPreview({ platform, heading = true, variant = 'negative', title = 'Delete report?', body = 'This action cannot be undone.' }) {
  const ios = platform === 'ios';
  const android = platform === 'android';
  const width = ios ? 210 : android ? 230 : 250;
  const accent = alertVariantColor[variant] || alertVariantColor.normal;
  const primaryLabel = variant === 'negative' ? 'Delete' : variant === 'assistive' ? 'Got it' : 'Confirm';

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{platform}{variant ? ` / ${variant}` : ''}</h3>
      <div
        style={{
          height: 210,
          display: 'grid',
          placeItems: 'center',
          padding: 18,
          background: 'var(--bw-gray-300)',
        }}
      >
        <div
          style={{
            width,
            maxWidth: '100%',
            padding: ios ? '20px 14px 14px' : '18px 18px 14px',
            borderRadius: ios ? 18 : 8,
            background: 'var(--bw-white)',
            boxShadow: 'var(--shadow-lg)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {heading && (
            <div style={{ marginBottom: 8, fontSize: ios ? 14 : 15, fontWeight: 'var(--fw-extra)', color: 'var(--label-normal)' }}>
              {title}
            </div>
          )}
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--label-neutral)' }}>
            {body}
          </p>
          <div style={{ display: 'flex', justifyContent: ios ? 'center' : 'flex-end', gap: 8, marginTop: 18 }}>
            <button type="button" style={{ height: ios ? 34 : 30, padding: '0 12px', border: 'none', borderRadius: ios ? 'var(--radius-pill)' : 'var(--radius-md)', background: ios ? 'var(--fill-normal)' : 'transparent', color: 'var(--label-normal)', fontSize: 12, fontWeight: 'var(--fw-bold)' }}>
              Cancel
            </button>
            <button type="button" style={{ height: ios ? 34 : 30, padding: '0 12px', border: 'none', borderRadius: ios ? 'var(--radius-pill)' : 'var(--radius-md)', background: ios ? accent : 'transparent', color: ios ? 'var(--text-on-inverse)' : accent, fontSize: 12, fontWeight: 'var(--fw-bold)' }}>
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const AlertOpen = { ...AlertOpenStory, name: 'Alert open' };

export const AlertPlatformPreview = {
  name: 'Alert platform and variant preview',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980 }}>
      <div style={{ padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--bw-mist)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, alignItems: 'start' }}>
          <AlertPreview platform="ios" variant="negative" />
          <AlertPreview platform="android" variant="normal" title="Publish changes?" body="The selected updates will be visible to members." />
          <AlertPreview platform="web" variant="assistive" heading={false} body="The shortcut can be changed later from settings." />
        </div>
      </div>
    </main>
  ),
};

export const AlertCard = { ...AlertCardStory, name: 'Alert card parity', tags: ['!dev', 'visual-parity'] };
export const AlertToastCard = { ...AlertToastCardStory, name: 'Alert Toast card parity', tags: ['!dev', 'visual-parity'] };
