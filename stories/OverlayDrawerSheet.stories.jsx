import {
  DrawerCard as DrawerCardStory,
  DrawerOpen as DrawerOpenStory,
  SheetCard as SheetCardStory,
  SheetOpen as SheetOpenStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LK Product Extension/Overlay/Drawer and Sheet',
  parameters: {
    docs: {
      description: {
        component: '사이드 패널과 모바일 하단 패널로 보조 작업을 제공하는 Drawer, Sheet 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DrawerOpen = { ...DrawerOpenStory, name: 'Drawer 열림' };
export const SheetOpen = { ...SheetOpenStory, name: 'Sheet 열림' };
export const DrawerCard = { ...DrawerCardStory, name: 'Drawer card parity', tags: ['!dev', 'visual-parity'] };
export const SheetCard = { ...SheetCardStory, name: 'Sheet card parity', tags: ['!dev', 'visual-parity'] };

