import React from 'react';
import { userEvent, within } from 'storybook/test';
import componentContent from '../docs/components/component-guide-runtime.json';
import { ComponentGuide, verifyComponentGuideAtNarrowWidth } from './ComponentGuide.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const buttonGuide = componentContent.guides.find((guide) => guide.primaryOwner === 'Button');

function ComponentCatalogView() {
  const [query, setQuery] = React.useState('');
  const [layer, setLayer] = React.useState('All');
  const normalized = query.trim().toLocaleLowerCase('ko');
  const guides = componentContent.guides.filter((guide) => {
    if (layer !== 'All' && guide.layer !== layer) return false;
    if (!normalized) return true;
    return [guide.title, guide.primaryOwner, guide.family, guide.purpose]
      .join(' ')
      .toLocaleLowerCase('ko')
      .includes(normalized);
  });

  return (
    <main style={{ display: 'grid', gap: 24, maxWidth: 1180, margin: '0 auto' }}>
      <section style={{ display: 'grid', gap: 14, padding: 'clamp(20px, 4vw, 36px)', borderRadius: 'var(--radius-2xl)', background: 'var(--color-semantic-background-normal-alternative)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0, color: 'var(--color-semantic-primary-strong)' }}>Components / Overview</p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.04, letterSpacing: '-0.035em' }}>
          구현을 찾는 목록에서<br />결정을 내리는 가이드로
        </h1>
        <p style={{ maxWidth: 760, margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.75 }}>
          {componentContent.summary.componentEntries}개 public component entry와 {componentContent.summary.guides}개 의사결정 페이지를
          anatomy, 상태, 접근성, 정량 규칙, Do/Don&apos;t, token·API 증거로 연결합니다.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            `${componentContent.summary.componentEntries} entries`,
            `${componentContent.summary.publicExports} exports`,
            `${componentContent.summary.guides} guides`,
            `${componentContent.summary.seedBenchmarkedGuides} SEED traces`,
          ].map((label) => (
            <span key={label} style={{ padding: '6px 10px', borderRadius: 999, background: 'var(--color-semantic-primary-surface-normal)', color: 'var(--color-semantic-primary-strong)', fontWeight: 800, fontSize: 'var(--caption-size)' }}>
              {label}
            </span>
          ))}
        </div>
      </section>

      <section aria-label="컴포넌트 가이드 필터" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption-size)', fontWeight: 700 }}>
          컴포넌트 검색
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Button, Data Grid, Navigation…"
            style={{ width: '100%', minHeight: 44, padding: '9px 12px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-normal-normal)', color: 'var(--color-semantic-label-normal)', font: 'inherit' }}
          />
        </label>
        <label style={{ display: 'grid', gap: 6, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption-size)', fontWeight: 700 }}>
          Layer
          <select
            value={layer}
            onChange={(event) => setLayer(event.target.value)}
            style={{ minHeight: 44, padding: '9px 32px 9px 12px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-normal-normal)', color: 'var(--color-semantic-label-normal)', font: 'inherit' }}
          >
            {['All', 'Core', 'Product', 'Theme'].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </section>

      <p role="status" aria-live="polite" style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>
        {guides.length}개 가이드
      </p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 14 }}>
        {guides.map((guide) => (
          <a
            key={guide.slug}
            href={`?path=/story/${guide.storybook.entryStoryId}`}
            style={{ display: 'grid', gap: 10, minWidth: 0, padding: 18, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)', color: 'inherit', textDecoration: 'none' }}
          >
            <span style={{ color: 'var(--color-semantic-primary-strong)', fontSize: 'var(--caption-size)', fontWeight: 800 }}>{guide.layer} / {guide.family}</span>
            <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--headline2-size)' }}>{guide.title}</strong>
            <span style={{ color: 'var(--color-semantic-label-neutral)', lineHeight: 1.55 }}>{guide.purpose}</span>
            <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption-size)' }}>
              {guide.storybook.publicStories.length} public stories · {guide.ownerComponents.join(', ')}
            </span>
          </a>
        ))}
      </section>
    </main>
  );
}

const meta = {
  title: 'LDS Core/Components/Overview',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overview--component-catalog',
      hideCanvasHeader: true,
      eyebrow: 'Components / Overview',
      title: '컴포넌트를 구현 목록이 아닌 제품 결정 계약으로 탐색합니다',
      description:
        '목적이나 컴포넌트 이름으로 Core·Product·Theme 가이드를 찾고 실제 Storybook 근거로 이동할 때 사용합니다. 개별 API 명세를 읽는 데는 사용하지 말고, 구현 상태는 Progress Board를, 전체 source·type·prompt 추적은 생성 Component Reference를 사용하세요.',
    },
    docs: {
      description: {
        component: 'LDS public component entry와 decision guide를 검색하고 실제 Storybook 페이지로 이동하는 컴포넌트 카탈로그입니다.',
      },
    },
  },
};

export default meta;

export const ComponentCatalog = {
  name: '개요',
  parameters: storyDescription(
    '컴포넌트의 이름과 소유 layer를 기준으로 전체 의사결정 가이드를 탐색하는 상황입니다. 검색 결과가 접근 가능한 status로 갱신되고 각 결과가 실제 공개 Storybook entry로 이동하는지 확인하세요.',
  ),
  render: () => <ComponentCatalogView />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: '컴포넌트 검색' });
    await userEvent.type(search, 'Button');
    const status = canvas.getByRole('status');
    if (!status.textContent?.match(/\d+개 가이드/)) throw new Error('Component catalog must announce filtered guide count.');
    if (!canvas.getByText('Button', { selector: 'strong' })) throw new Error('Component catalog search must retain the Button guide.');
    await userEvent.clear(search);
  },
};

export const DetailedGuide = {
  name: '사용법 · 상세 가이드 구조',
  parameters: storyDescription(
    '모든 컴포넌트 페이지가 공유하는 Button 대표 상세 문서입니다. 사용 판단부터 anatomy, properties, 상태, 접근성, Do/Don’t와 source 증거까지 한 흐름으로 읽히고 좁은 화면에서는 표만 독립 스크롤되는지 확인하세요.',
  ),
  render: () => <ComponentGuide guide={buttonGuide} />,
  play: async ({ canvasElement }) => {
    await verifyComponentGuideAtNarrowWidth(canvasElement);
  },
};
