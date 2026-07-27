import React from 'react';
import { Callout, Link, Stack } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Register each independently published LDS family here.
const designSystems = [
  {
    name: 'LDS Core',
    description: '공통 토큰, 컴포넌트, 패턴을 제공합니다.',
    href: '?path=/docs/lds-core-foundation-design-token--docs',
    linkLabel: 'LDS Core 열기',
  },
  {
    name: 'LDS Robotics',
    description: '로봇 제어, 상태, 지도·경로 UI를 제공합니다.',
    href: 'https://lk-design-system.github.io/lk-design-system-robotics/',
    linkLabel: 'LDS Robotics 열기',
    external: true,
  },
];

function DesignSystemDirectory() {
  return (
    <main data-lds-directory style={{ width: 'min(720px, 100%)', minWidth: 0 }}>
      <Stack gap="var(--space-4)">
        {designSystems.map(({ name, description, href, linkLabel, external }) => (
          <Callout key={name} tone="signal" title={name} data-design-system-card={name}>
            <Stack gap="var(--space-3)">
              <span>{description}</span>
              <Link
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                tone="neutral"
                underline="always"
              >
                {linkLabel}
              </Link>
            </Stack>
          </Callout>
        ))}
        <Callout tone="navy" title="LDS 3D 및 추가 Design System">
          <span>새 Design System이 공개되면 이 디렉터리에 같은 형식의 진입점을 추가합니다.</span>
        </Callout>
      </Stack>
    </main>
  );
}

const meta = {
  title: 'LDS/Directory',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-directory--overview',
      eyebrow: 'LDS',
      title: 'Design System Directory',
      description: 'LDS 제품군별 Storybook과 문서로 이동합니다.',
    },
    docs: {
      description: {
        component: 'LDS 제품군의 공통 진입점입니다. 새 제품군은 독립 Storybook을 유지하면서 이 디렉터리에 추가합니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: 'Design System Directory',
  parameters: storyDescription('LDS Core, LDS Robotics, 그리고 이후 공개될 LDS 제품군으로 이동하는 공통 시작 화면입니다.'),
  render: () => <DesignSystemDirectory />,
  play: async ({ canvasElement }) => {
    const core = canvasElement.querySelector('[data-design-system-card="LDS Core"] a');
    const robotics = canvasElement.querySelector('[data-design-system-card="LDS Robotics"] a');
    if (core?.getAttribute('href') !== designSystems[0].href) {
      throw new Error('The LDS directory must link to the Core Storybook content.');
    }
    if (robotics?.getAttribute('href') !== designSystems[1].href || robotics.getAttribute('target') !== '_blank') {
      throw new Error('The LDS directory must link directly to the public Robotics Storybook.');
    }
  },
};
