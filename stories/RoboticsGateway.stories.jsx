import React from 'react';
import { Callout, Link, Stack } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const roboticsStorybookUrl = 'https://lk-design-system.github.io/lk-design-system-robotics/';

function RoboticsGateway() {
  return (
    <main data-robotics-storybook-gateway style={{ width: 'min(720px, 100%)', minWidth: 0 }}>
      <Callout tone="signal" title="LDS Robotics">
        <Stack gap="var(--space-3)">
          <span>
            로봇 제어, 상태, 지도·경로 시각화 컴포넌트는 LDS Core와 별도로 공개된 LDS Robotics Storybook에서 확인합니다.
          </span>
          <Link
            href={roboticsStorybookUrl}
            target="_blank"
            rel="noreferrer"
            tone="neutral"
            underline="always"
            data-robotics-storybook-link
          >
            LDS Robotics Storybook 열기
          </Link>
        </Stack>
      </Callout>
    </main>
  );
}

const meta = {
  title: 'LDS Core/Robotics',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-robotics--overview',
      eyebrow: 'LDS Core',
      title: 'LDS Robotics 바로가기',
      description: '로봇 도메인 UI는 독립 Storybook에서 탐색합니다.',
    },
    docs: {
      description: {
        component: 'LDS Core의 공통 기반 위에 구축된 Robotics 도메인 UI로 이동하는 공개 진입점입니다.',
      },
    },
  },
};

export default meta;

export const Robotics = {
  name: 'LDS Robotics 바로가기',
  parameters: storyDescription('LDS Core에서 Robotics 전용 Storybook을 바로 열어 제어, 상태, 지도·경로 UI를 탐색합니다.'),
  render: () => <RoboticsGateway />,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-robotics-storybook-link]');
    if (
      link?.getAttribute('href') !== roboticsStorybookUrl
      || link.getAttribute('target') !== '_blank'
    ) {
      throw new Error('The Core Storybook gateway must link directly to the public Robotics Storybook.');
    }
  },
};
