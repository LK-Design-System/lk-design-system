import React from 'react';
import { within } from 'storybook/test';
import componentContent from '../docs/components/component-guide-runtime.json';
import { storyDescription } from './StoryGuide.shared.jsx';

function Status({ value }) {
  const mapped = value === 'mapped' || value === 'implemented';
  return (
    <span style={{ display: 'inline-flex', minHeight: 26, alignItems: 'center', padding: '3px 8px', borderRadius: 999, background: mapped ? 'var(--color-semantic-positive-surface-normal)' : 'var(--color-semantic-fill-normal)', color: mapped ? 'var(--color-semantic-positive-normal)' : 'var(--color-semantic-label-neutral)', fontWeight: 800, fontSize: 'var(--caption-size)', whiteSpace: 'nowrap' }}>
      {mapped ? (value === 'mapped' ? 'Mapped' : 'Done') : 'Not tracked'}
    </span>
  );
}

function ProgressBoard() {
  const guides = componentContent.guides;
  const mapped = guides.filter((guide) => guide.platformStatus.figma === 'mapped').length;
  return (
    <main style={{ display: 'grid', gap: 24, maxWidth: 1180, margin: '0 auto' }}>
      <section style={{ display: 'grid', gap: 12, padding: 'clamp(20px, 4vw, 36px)', borderRadius: 'var(--radius-2xl)', background: 'var(--color-semantic-background-normal-alternative)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0, color: 'var(--color-semantic-primary-strong)' }}>Components / Progress Board</p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.04, letterSpacing: '-0.035em' }}>
          증거가 있는 플랫폼 상태만<br />완료라고 말합니다
        </h1>
        <p style={{ maxWidth: 780, margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.75 }}>
          React 상태는 public source·type·prompt·Storybook이 모두 존재할 때 Done입니다. Figma는 accepted WDS family mapping만 표시하며,
          이 저장소가 소유하지 않는 iOS·Android 상태는 추측하지 않고 Not tracked로 유지합니다.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            `${guides.length} decision guides`,
            `${mapped} Figma mappings`,
            `${guides.length} React implemented`,
            `${componentContent.summary.entriesWithoutOwnedPage.length} reference-only entries`,
          ].map((text) => (
            <strong key={text} style={{ padding: '7px 10px', borderRadius: 999, background: 'var(--color-semantic-primary-surface-normal)', color: 'var(--color-semantic-primary-strong)', fontSize: 'var(--caption-size)' }}>
              {text}
            </strong>
          ))}
        </div>
      </section>

      <div role="region" aria-label="컴포넌트 플랫폼 구현 상태" tabIndex={0} style={{ overflowX: 'auto', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)' }}>
        <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', background: 'var(--color-semantic-background-normal-normal)', color: 'var(--color-semantic-label-normal)' }}>
          <thead>
            <tr>
              {['Component guide', 'Layer', 'Figma', 'React', 'iOS', 'Android', 'Evidence'].map((heading) => (
                <th key={heading} scope="col" style={{ padding: '11px 12px', borderBottom: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--color-semantic-background-normal-alternative)', color: 'var(--color-semantic-label-strong)', textAlign: 'left', whiteSpace: 'nowrap' }}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guides.map((guide) => (
              <tr key={guide.slug}>
                <th scope="row" style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)', textAlign: 'left' }}>
                  <a href={`?path=/story/${guide.storybook.entryStoryId}`} style={{ color: 'var(--color-semantic-primary-strong)' }}>{guide.title}</a>
                </th>
                <td style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>{guide.layer}</td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}><Status value={guide.platformStatus.figma} /></td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}><Status value={guide.platformStatus.react} /></td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}><Status value={guide.platformStatus.ios} /></td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}><Status value={guide.platformStatus.android} /></td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
                  {guide.storybook.publicStories.length} public / {guide.storybook.hiddenEvidence} hidden
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
  title: 'LDS Core/Components/Progress Board',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-progress-board--platform-status',
      hideCanvasHeader: true,
      eyebrow: 'Components / Progress Board',
      title: '플랫폼별 구현과 문서 상태를 소유 근거에 맞춰 추적합니다',
      description:
        'React, Figma와 외부 플랫폼의 상태를 같은 의미로 오해하지 않도록 증거 수준을 구분합니다. 특정 컴포넌트의 사용 판단은 해당 상세 가이드를, source/type/prompt 경로는 생성 Component Reference를 사용하세요.',
    },
    docs: {
      description: {
        component: 'LDS 컴포넌트 가이드별 Figma mapping, React implementation과 외부 플랫폼 미추적 상태를 보여 주는 Progress Board입니다.',
      },
    },
  },
};

export default meta;

export const PlatformStatus = {
  name: '개요',
  parameters: storyDescription(
    '컴포넌트별 플랫폼 상태와 Storybook 증거 수를 확인하는 상황입니다. 저장소가 소유하지 않는 iOS·Android 상태를 완료로 추정하지 않고 넓은 표가 키보드로 접근 가능한 독립 스크롤 영역인지 확인하세요.',
  ),
  render: () => <ProgressBoard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('region', { name: '컴포넌트 플랫폼 구현 상태' });
    if (region.tabIndex !== 0) throw new Error('Progress Board overflow region must be keyboard focusable.');

    const main = region.closest('main');
    if (!main) throw new Error('Progress Board must expose one document main region.');
    const previousWidth = main.style.width;
    try {
      main.style.width = '320px';
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (main.scrollWidth > main.clientWidth + 1) {
        throw new Error('Narrow Progress Board must contain overflow inside its table region.');
      }
      if (region.scrollWidth <= region.clientWidth) {
        throw new Error('Narrow Progress Board must preserve an independently scrollable evidence table.');
      }
    } finally {
      main.style.width = previousWidth;
    }
  },
};
