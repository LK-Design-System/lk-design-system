import { AppNavigation as AppNavigationStory, SideNavUserMenuCard as SideNavUserMenuCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/App Navigation',
  parameters: {
    docs: {
      description: {
        component: '상단 바와 SideNav를 조합한 애플리케이션 내비게이션 패턴입니다.',
      },
    },
  },
};

export default meta;

export const AppNavigation = { ...AppNavigationStory, name: '앱 내비게이션' };
export const SideNavUserMenuCard = { ...SideNavUserMenuCardStory, name: 'SideNav and UserMenu card parity', tags: ['!dev', 'visual-parity'] };
