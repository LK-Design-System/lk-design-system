import React from 'react';
import { DesignSystemDirectory, designSystems } from './DesignSystemDirectory.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS/Directory',
  tags: ['autodocs'],
  parameters: {
    docsGuide: 'directory',
    storyGuide: {
      storyId: 'lds-directory--overview',
      eyebrow: 'LDS',
      title: 'Design System Directory',
      description: '여러 LDS 제품군의 카탈로그와 문서 중 어디에서 시작할지 선택할 때 사용합니다. 개별 컴포넌트의 API·상태·사용법을 확인할 때는 이 디렉터리를 사용하지 않고 해당 제품군의 컴포넌트 안내 페이지로 이동합니다.',
    },
    docs: {
      description: {
        component: 'LDS 제품군의 공통 진입점입니다. 각 제품군은 독립된 카탈로그를 유지하며, 이 표에서 한곳으로 모입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription('LDS Core, LDS Robotics, 그리고 이후 공개될 LDS 제품군으로 이동하는 공통 시작 화면입니다.'),
  render: () => <DesignSystemDirectory />,
  // Asserted over the registry rather than row by row: a family added to
  // `designSystems` is covered the moment it is registered, so the directory
  // cannot grow a row that quietly points nowhere.
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-design-system-row]');
    if (rows.length !== designSystems.length) {
      throw new Error(`Every registered LDS family needs a row; expected ${designSystems.length}, rendered ${rows.length}.`);
    }
    for (const system of designSystems) {
      const link = canvasElement.querySelector(`[data-design-system-row="${system.name}"] a`);
      if (link?.getAttribute('href') !== system.href) {
        throw new Error(`The LDS directory must link directly to the public ${system.name} Storybook.`);
      }
      if (system.external && link.getAttribute('target') !== '_blank') {
        throw new Error(`${system.name} is published separately, so its link must open in a new tab.`);
      }
    }
  },
};
