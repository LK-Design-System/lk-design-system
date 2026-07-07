import { AppNavigation as AppNavigationStory, SideNavUserMenuCard as SideNavUserMenuCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/6 Navigation/App Navigation',
  parameters: {
    docs: {
      description: {
        component: 'TopBar, SideNav, 사용자 메뉴가 함께 구성되는 앱 셸 내비게이션 패턴입니다.',
      },
    },
  },
};

export default meta;

export const AppNavigation = { ...AppNavigationStory, name: "앱 내비게이션" };
export const SideNavUserMenuCard = { ...SideNavUserMenuCardStory, name: "SideNav · UserMenu card parity", tags: ['!dev', 'visual-parity'] };
