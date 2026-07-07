import { CompactNavigation as CompactNavigationStory, BottomNavCard as BottomNavCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/6 Navigation/Compact Navigation',
  parameters: {
    docs: {
      description: {
        component: 'NavRail, Anchor, FloorSelector, Pagination, BottomNav처럼 좁은 영역의 이동 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CompactNavigation = { ...CompactNavigationStory, name: "컴팩트 내비게이션" };
export const BottomNavCard = { ...BottomNavCardStory, name: "BottomNav card parity", tags: ['!dev', 'visual-parity'] };
