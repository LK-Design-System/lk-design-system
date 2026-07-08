import {
  AspectRatio,
  Center,
  ScrollArea,
  Stack,
  VisuallyHidden,
} from '../src/index.js';
import {
  AspectRatioCenterCard as AspectRatioCenterCardStory,
  ScrollAreaCard as ScrollAreaCardStory,
} from './Layout.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Scroll and Accessibility',
  parameters: {
    docs: {
      description: {
        component: '고정 비율 영역, 내부 스크롤, 화면에는 숨기고 보조 기술에는 노출하는 텍스트 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ScrollAndAccess = {
  name: '스크롤과 접근성',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <AspectRatio ratio={16 / 9}>
        <Center minHeight="100%" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
          16:9 미디어 영역
        </Center>
      </AspectRatio>

      <ScrollArea maxHeight={148} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
        <Stack gap="var(--space-3)">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} style={{ color: 'var(--label-neutral)' }}>운영 로그 {index + 1}</div>
          ))}
        </Stack>
      </ScrollArea>

      <button type="button" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
        <VisuallyHidden>명령 팔레트 열기</VisuallyHidden>
        CMD
      </button>
    </main>
  ),
};

export const AspectRatioCenterCard = { ...AspectRatioCenterCardStory, name: 'AspectRatio · Center card parity', tags: ['!dev', 'visual-parity'] };
export const ScrollAreaCard = { ...ScrollAreaCardStory, name: 'ScrollArea card parity', tags: ['!dev', 'visual-parity'] };

