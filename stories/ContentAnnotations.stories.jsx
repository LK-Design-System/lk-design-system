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
  title: 'WDS Core/3 Component/8 Presentation/Annotations',
  parameters: {
    docs: {
      description: {
        component: '본문 주변의 보조 설명, 북마크, 구분선을 제공하는 Tooltip, Bubble, Bookmark, Divider 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Annotations = {
  name: '주석',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tooltip content="상세 도움말">
          <IconButton variant="ghost" label="info"><Icon name="circle-info" size={20} /></IconButton>
        </Tooltip>
        <Bubble tone="navy" tail="left">선택 항목 설명</Bubble>
        <Bookmark defaultActive />
        <Bookmark />
      </section>
      <Divider label="또는" />
    </main>
  ),
};

export const TooltipBubbleBookmarkDividerCard = { ...TooltipBubbleBookmarkDividerCardStory, name: 'Tooltip · Bubble · Bookmark · Divider card parity', tags: ['!dev', 'visual-parity'] };
