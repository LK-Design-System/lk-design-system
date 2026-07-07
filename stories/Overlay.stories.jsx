import {
  Button,
  DropdownMenu,
  HoverCard,
  Icon,
  Popover,
} from '../src/index.js';
import {
  DropdownMenuCard as DropdownMenuCardStory,
  HoverCardCard as HoverCardCardStory,
  PopoverCard as PopoverCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/8 Presentation/Anchored Overlay',
  parameters: {
    docs: {
      description: {
        component: 'DropdownMenu, Popover, HoverCard처럼 트리거 주변에 붙는 오버레이입니다.',
      },
    },
  },
};

export default meta;

export const AnchoredOverlays = {
  name: '앵커드 오버레이',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', maxWidth: 760 }}>
      <DropdownMenu
        trigger={<Button variant="ghost">드롭다운</Button>}
        items={[
          { label: '항목 복제', icon: <Icon name="document" size={16} /> },
          { label: '삭제', icon: <Icon name="trash" size={16} />, danger: true },
        ]}
      />
      <Popover trigger={<Button variant="ghost">팝오버</Button>}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong>운영 설정</strong>
          <span style={{ color: 'var(--label-neutral)', fontSize: 13 }}>앵커 기준으로 열리는 보조 패널입니다.</span>
        </div>
      </Popover>
      <HoverCard trigger={<Button variant="ghost">호버 카드</Button>}>
        <strong>문서 A</strong>
        <p style={{ margin: '6px 0 0', color: 'var(--label-neutral)' }}>검토 86%, 초안 상태</p>
      </HoverCard>
    </main>
  ),
};

export const DropdownMenuCard = { ...DropdownMenuCardStory, name: 'DropdownMenu card parity', tags: ['!dev', 'visual-parity'] };
export const PopoverCard = { ...PopoverCardStory, name: 'Popover card parity', tags: ['!dev', 'visual-parity'] };
export const HoverCardCard = { ...HoverCardCardStory, name: 'HoverCard card parity', tags: ['!dev', 'visual-parity'] };
