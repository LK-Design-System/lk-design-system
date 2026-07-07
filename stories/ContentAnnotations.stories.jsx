import {
  Bookmark,
  Bubble,
  Divider,
  Icon,
  IconButton,
  Tooltip,
} from '../src/index.js';
import { TooltipBubbleBookmarkDividerCard as TooltipBubbleBookmarkDividerCardStory } from './Content.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/8 Presentation/Annotations',
  parameters: {
    docs: {
      description: {
        component: 'Annotation primitives with Tooltip placement, arrow alignment, size, and shortcut patterns.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

function AnchorBox({ label = 'target' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 58,
        height: 58,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bw-white)',
        color: 'var(--label-assistive)',
        fontSize: 11,
      }}
    >
      {label}
    </span>
  );
}

function AlignmentLabel({ children }) {
  return (
    <span style={{ display: 'inline-block', minWidth: 72, textAlign: 'center' }}>
      {children}
    </span>
  );
}

export const Annotations = {
  name: 'Annotations',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tooltip content="More information">
          <IconButton variant="ghost" label="info"><Icon name="circle-info" size={20} /></IconButton>
        </Tooltip>
        <Bubble tone="navy" tail="left">Selected item helper</Bubble>
        <Bookmark defaultActive />
        <Bookmark />
      </section>
      <Divider label="or" />
    </main>
  ),
};

export const TooltipPatterns = {
  name: 'Tooltip patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 900 }}>
      <Section title="Size and shortcut">
        <div style={{ display: 'flex', alignItems: 'center', gap: 78, minHeight: 142, paddingTop: 42, flexWrap: 'wrap' }}>
          <Tooltip open content="Message helper" position="top" size="medium">
            <AnchorBox />
          </Tooltip>
          <Tooltip open content="Small" position="top" size="small">
            <AnchorBox />
          </Tooltip>
          <Tooltip open content="Message helper" shortcut="Cmd C" position="top">
            <AnchorBox />
          </Tooltip>
        </div>
      </Section>

      <Section title="Position">
        <div
          style={{
            width: 520,
            maxWidth: '100%',
            minHeight: 320,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            placeItems: 'center',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bw-mist)',
            padding: 24,
          }}
        >
          <span />
          <Tooltip open content="Top" position="top"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Left" position="left"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Right" position="right"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Bottom" position="bottom"><AnchorBox /></Tooltip>
          <span />
        </div>
      </Section>

      <Section title="Arrow vertical and horizontal align">
        <div style={{ display: 'grid', gap: 28 }}>
          <div style={{ display: 'flex', gap: 88, minHeight: 142, paddingTop: 42, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tooltip open content={<AlignmentLabel>Left</AlignmentLabel>} position="top" align="left"><AnchorBox /></Tooltip>
            <Tooltip open content={<AlignmentLabel>Center</AlignmentLabel>} position="top" align="center"><AnchorBox /></Tooltip>
            <Tooltip open content={<AlignmentLabel>Right</AlignmentLabel>} position="top" align="right"><AnchorBox /></Tooltip>
          </div>
          <div style={{ display: 'flex', gap: 96, minHeight: 126, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tooltip open content="Top" position="right" align="top"><AnchorBox /></Tooltip>
            <Tooltip open content="Center" position="right" align="center"><AnchorBox /></Tooltip>
            <Tooltip open content="Bottom" position="right" align="bottom"><AnchorBox /></Tooltip>
          </div>
        </div>
      </Section>
    </main>
  ),
};

export const TooltipBubbleBookmarkDividerCard = { ...TooltipBubbleBookmarkDividerCardStory, name: 'Tooltip, Bubble, Bookmark, Divider card parity', tags: ['!dev', 'visual-parity'] };
