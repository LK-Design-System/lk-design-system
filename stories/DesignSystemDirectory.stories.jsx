import React from 'react';
import { Link } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Register each independently published LDS family here.
const designSystems = [
  {
    name: 'LDS Core',
    status: 'Available',
    scope: '공통 토큰, 컴포넌트, 패턴',
    href: 'https://lk-design-system.github.io/lk-design-system/',
    external: true,
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
    status: 'Available',
    href: 'https://lk-design-system.github.io/lk-design-system-3d/',
    linkLabel: 'LDS 3D 열기',
    external: true,
    scope: '3D 도메인 UI',
  },
  {
    name: 'LDS Editorial',
    status: 'In development',
    href: 'https://lk-design-system.github.io/lk-design-system-editorial/',
    linkLabel: 'LDS Editorial 열기',
    external: true,
    scope: '데이터 서사 · 주석 · 픽토그램 (매체 중립)',
  },
  {
    name: 'LDS Slides',
    status: 'Available',
    href: 'https://lk-design-system.github.io/lk-design-system-slides/',
    linkLabel: 'LDS Slides 열기',
    external: true,
    scope: '발표 지오메트리 · 투사 스케일 · 장표 레이아웃 · 덱 프리셋',
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
      description: 'LDS 제품군별 컴포넌트 카탈로그와 문서로 이동합니다.',
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
  name: 'Design System Directory',
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
