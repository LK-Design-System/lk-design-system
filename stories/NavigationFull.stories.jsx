import { AppNavigation as AppNavigationStory, SideNavUserMenuCard as SideNavUserMenuCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/App Navigation',
  parameters: {
    docs: {
      description: {
        component: 'Composed application navigation patterns using TopBar, SideNav, and UserMenu.',
      },
    },
  },
};

export default meta;

export const AppNavigation = { ...AppNavigationStory, name: 'App navigation' };
export const SideNavUserMenuCard = { ...SideNavUserMenuCardStory, name: 'SideNav and UserMenu card parity', tags: ['!dev', 'visual-parity'] };
