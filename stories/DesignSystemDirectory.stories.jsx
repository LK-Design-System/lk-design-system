import React from 'react';
import { Link } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Register each independently published LDS family here.
const designSystems = [
  {
    name: 'LDS Core',
    status: 'Available',
    scope: '공통 토큰, 컴포넌트, 패턴',
    href: '?path=/docs/lds-core-foundation-design-token--docs',
    linkLabel: 'LDS Core 열기',
  },
  {
    name: 'LDS Robotics',
    status: 'Available',
    scope: '로봇 제어, 상태, 지도·경로 UI',
    href: 'https://lk-design-system.github.io/lk-design-system-robotics/',
    linkLabel: 'LDS Robotics 열기',
    external: true,
  },
  {
    name: 'LDS 3D',
    status: 'Planned',
    scope: '3D 도메인 UI',
  },
];

function DesignSystemDirectory() {
  return (
    <main data-lds-directory style={{ width: 'min(880px, 100%)', minWidth: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '620px', borderCollapse: 'collapse' }}>
          <caption style={{ padding: '0 0 var(--space-4)', textAlign: 'left', color: 'var(--color-semantic-label-normal)' }}>
            공개된 LDS 제품군과 준비 중인 다음 제품군을 한곳에서 확인합니다.
          </caption>
          <thead>
            <tr>
              {['Design System', 'Status', 'Scope', 'Link'].map((label) => (
                <th
                  key={label}
                  scope="col"
                  style={{
                    padding: 'var(--space-3)',
                    borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
                    color: 'var(--color-semantic-label-strong)',
                    textAlign: 'left',
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {designSystems.map(({ name, status, scope, href, linkLabel, external }) => (
              <tr key={name} data-design-system-row={name}>
                <th scope="row" style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-semantic-label-strong)' }}>
                  {name}
                </th>
                <td style={{ padding: 'var(--space-3)' }}>{status}</td>
                <td style={{ padding: 'var(--space-3)' }}>{scope}</td>
                <td style={{ padding: 'var(--space-3)' }}>
                  {href ? (
                    <Link
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      tone="neutral"
                      underline="always"
                    >
                      {linkLabel}
                    </Link>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    const core = canvasElement.querySelector('[data-design-system-row="LDS Core"] a');
    const robotics = canvasElement.querySelector('[data-design-system-row="LDS Robotics"] a');
    const threeD = canvasElement.querySelector('[data-design-system-row="LDS 3D"]');
    if (core?.getAttribute('href') !== designSystems[0].href) {
      throw new Error('The LDS directory must link to the Core Storybook content.');
    }
    if (robotics?.getAttribute('href') !== designSystems[1].href || robotics.getAttribute('target') !== '_blank') {
      throw new Error('The LDS directory must link directly to the public Robotics Storybook.');
    }
    if (threeD?.querySelector('a') || !threeD?.textContent?.includes('Planned')) {
      throw new Error('Planned design systems must stay visible without a dead link.');
    }
  },
};
