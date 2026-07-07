import {
  Snackbar,
  Toast,
} from '../src/index.js';
import {
  ToastCard as ToastCardStory,
  ToastStackCard as ToastStackCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/7 Feedback/Toast',
  parameters: {
    docs: {
      description: {
        component: 'Transient feedback patterns aligned with Toast and Snackbar sources.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const ToastNotifications = {
  name: 'Toast variants',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <Section title="Toast severity and icon axis">
        <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
          <Toast variant="normal">Saved as a draft.</Toast>
          <Toast variant="positive" action="Undo">Changes were published.</Toast>
          <Toast variant="cautionary">Some fields need review.</Toast>
          <Toast variant="negative" onClose={() => {}}>Upload failed.</Toast>
          <Toast variant="positive" leadingIcon={false}>Leading icon disabled.</Toast>
        </div>
      </Section>
    </main>
  ),
};

export const SnackbarPatterns = {
  name: 'Snackbar patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <Section title="Snackbar heading, description, icon, close button, action">
        <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <Snackbar heading="Draft saved" action="View" onAction={() => {}} />
          <Snackbar description="The report can be restored from activity history." leadingIcon />
          <Snackbar heading="Invite sent" description="The member will receive an email shortly." leadingIcon closeButton />
          <Snackbar description="Network connection is unstable." action="Retry" closeButton />
        </div>
      </Section>
    </main>
  ),
};

export const ToastCard = { ...ToastCardStory, name: 'Toast card parity', tags: ['!dev', 'visual-parity'] };
export const ToastStackCard = { ...ToastStackCardStory, name: 'ToastStack card parity', tags: ['!dev', 'visual-parity'] };
