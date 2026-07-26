import React from 'react';
import { Tabs } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { TabsCard as TabsCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Tabs',
  tags: ['autodocs'],
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
        component: 'resize·size·padding·trailing icon button·scroll 조합을 제공하는 섹션 내비게이션입니다.',
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

const PANEL_CONTENT = {
  overview: '현재 배차 2건이 진행 중입니다.',
  activity: '최근 24시간 동안 이벤트 14건이 기록되었습니다.',
  settings: '알림과 권한 설정을 관리합니다.',
  disabled: '비활성 섹션입니다.',
};

const wiredItems = tabItems.map((item) => ({
  ...item,
  tabId: `tabs-demo-tab-${item.value}`,
  panelId: `tabs-demo-panel-${item.value}`,
}));

function WiredTabsDemo() {
  const [tab, setTab] = React.useState('overview');
  const activeItem = wiredItems.find((item) => item.value === tab);
  return (
    <section style={{ display: 'grid', gap: 0 }}>
      <Tabs items={wiredItems} value={tab} onChange={setTab} resize="hug" size="small" />
      <div
        role="tabpanel"
        id={activeItem.panelId}
        aria-labelledby={activeItem.tabId}
        tabIndex={0}
        style={{
          padding: '12px 0',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--body2-size)',
          color: 'var(--color-semantic-label-neutral)',
        }}
      >
        {PANEL_CONTENT[tab]}
      </div>
    </section>
  );
}

export const TabPatterns = {
  name: '개요',
  parameters: storyDescription(
    'hug·fill 너비와 크기, 여백, 후행 아이콘 버튼, 스크롤 조합을 비교합니다. 첫 예시는 tab↔tabpanel 연결(aria-controls·aria-labelledby)을 포함해 선택에 따라 패널 내용이 바뀝니다. 선택 탭이 명확하고 비활성 탭을 건너뛰며 Arrow·Home·End 키로 예상 순서대로 이동하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 18, width: '100%', maxWidth: 920 }}>
      <WiredTabsDemo />
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
    // tab <-> tabpanel wiring per APG.
    const selectedTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
    const controls = selectedTab?.getAttribute('aria-controls');
    if (!controls) throw new Error('Selected tab must expose aria-controls to its panel.');
    const panel = canvasElement.querySelector(`#${controls}`);
    if (!panel || panel.getAttribute('role') !== 'tabpanel') {
      throw new Error('aria-controls must reference a role="tabpanel" element.');
    }
    if (panel.getAttribute('aria-labelledby') !== selectedTab.id || !selectedTab.id) {
      throw new Error('Panel aria-labelledby must reference the selected tab id.');
    }
    // Exactly one selected tab and one Tab stop.
    if (tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length !== 1) {
      throw new Error('Exactly one tab may be aria-selected.');
    }
    if (tabs.filter((tab) => tab.tabIndex === 0).length !== 1) {
      throw new Error('Exactly one tab may be the Tab stop (tabIndex 0).');
    }
  },
};

export const TabsCard = { ...TabsCardStory, name: 'Tabs card parity', tags: ['!dev', 'visual-parity'] };
