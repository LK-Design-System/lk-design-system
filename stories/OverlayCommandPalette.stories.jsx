import {
  CommandPaletteCard as CommandPaletteCardStory,
  CommandPaletteOpen as CommandPaletteOpenStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Command Palette',
  parameters: {
    docs: {
      description: {
        component: '키보드 중심 명령 검색과 빠른 이동을 제공하는 CommandPalette 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CommandPaletteOpen = { ...CommandPaletteOpenStory, name: 'CommandPalette 열림' };
export const CommandPaletteCard = { ...CommandPaletteCardStory, name: 'CommandPalette card parity', tags: ['!dev', 'visual-parity'] };

