import { Tabs } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { TabsCard as TabsCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-navigation-tabs--tab-patterns',
      eyebrow: 'Core / Navigation',
      title: 'Tabs는 같은 맥락 안의 동등한 섹션을 전환합니다',
      description:
        '페이지를 떠나지 않고 관련 콘텐츠 패널을 하나씩 전환하며 선택 상태를 유지해야 할 때 적합합니다. 서로 다른 목적지로 이동하는 전역 내비게이션에는 링크나 메뉴를, 순서가 있는 업무 절차에는 Stepper를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Tab의 WDS 원본 축(resize, size, padding, trailing icon button, scroll)을 따르는 섹션 내비게이션입니다.',
      },
    },
  },
};

export default meta;

const tabItems = [
  { value: 'overview', label: '개요', count: 2 },
  { value: 'activity', label: '활동' },
  { value: 'settings', label: '설정', trailingIconButton: true },
  { value: 'disabled', label: '비활성', disabled: true },
];

export const TabPatterns = {
  name: '개요',
  parameters: storyDescription(
    'hug·fill 너비와 크기, 여백, 후행 아이콘 버튼, 스크롤 조합을 비교합니다. 선택 탭이 명확하고 비활성 탭을 건너뛰며 Arrow·Home·End 키로 예상 순서대로 이동하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 18, width: '100%', maxWidth: 920 }}>
      <Tabs items={tabItems} defaultValue="overview" resize="hug" size="small" />
      <Tabs items={tabItems} defaultValue="activity" resize="fill" size="medium" padding trailingIconButton />
      <Tabs items={tabItems} defaultValue="settings" resize="hug" size="large" scroll />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const firstList = canvasElement.querySelector('[role="tablist"]');
    const tabs = Array.from(firstList?.querySelectorAll('[role="tab"]') ?? []);
    tabs[0]?.focus();
    await userEvent.keyboard('{ArrowRight}');
    if (tabs[1]?.getAttribute('aria-selected') !== 'true' || document.activeElement !== tabs[1]) {
      throw new Error('ArrowRight must select and focus the next enabled tab.');
    }
    await userEvent.keyboard('{End}');
    if (tabs[2]?.getAttribute('aria-selected') !== 'true' || document.activeElement !== tabs[2]) {
      throw new Error('End must select and focus the last enabled tab.');
    }
    await userEvent.keyboard('{Home}');
    if (tabs[0]?.getAttribute('aria-selected') !== 'true' || document.activeElement !== tabs[0]) {
      throw new Error('Home must restore the first enabled tab.');
    }
  },
};

export const TabsCard = { ...TabsCardStory, name: 'Tabs card parity', tags: ['!dev', 'visual-parity'] };
