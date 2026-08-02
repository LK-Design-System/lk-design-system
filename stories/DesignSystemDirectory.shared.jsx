import React from 'react';
import { Link } from '../src/index.js';

// Register each independently published LDS family here so the Canvas and Docs
// directory always expose the same destinations.
export const designSystems = [
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

export function DesignSystemDirectory({ guide = false }) {
  const Root = guide ? 'article' : 'main';

  return (
    <Root
      data-lds-directory
      data-pattern-guide={guide || undefined}
      style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(880px, 100%)', minWidth: 0 }}
    >
      {guide ? (
        <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <h2
            id="directory-selection"
            style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title3-size)' }}
          >
            제품군 선택 기준
          </h2>
          <p style={{ margin: 0, color: 'var(--color-semantic-label-normal)', lineHeight: 1.65 }}>
            공통 토큰과 범용 UI는 Core에서 시작하고, 로봇·3D·편집·발표처럼 별도 도메인 계약이 필요한 기능은 해당 제품군 문서에서 확인합니다.
          </p>
        </section>
      ) : null}
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
    </Root>
  );
}
