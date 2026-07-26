import React from 'react';
import { Anchor, Prose } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const items = [
  { href: '#overview', label: '운영 개요' },
  { href: '#monitoring', label: '상태 확인' },
  { href: '#thresholds', label: '경보 기준', level: 1 },
  { href: '#history', label: '변경 이력' },
];

const stickyExampleStyles = `
  .anchor-sticky-example {
    --anchor-sticky-top: var(--space-5);
    --anchor-scroll-offset: calc(var(--anchor-sticky-top) + var(--space-5));
    display: grid;
    grid-template-columns: minmax(0, 1fr) 224px;
    grid-template-areas: "content navigation";
    align-items: start;
    column-gap: var(--space-10);
    width: min(100%, 980px);
    margin: 0 auto;
    padding-block: var(--space-2) var(--space-8);
    box-sizing: border-box;
    color: var(--color-semantic-label-normal);
    font-family: var(--font-sans);
  }

  .anchor-sticky-example__content {
    grid-area: content;
    min-width: 0;
  }

  .anchor-sticky-example__aside {
    grid-area: navigation;
    position: sticky;
    inset-block-start: var(--anchor-sticky-top);
    align-self: start;
    max-height: calc(100vh - var(--anchor-sticky-top) - var(--space-5));
    overflow: auto;
    padding: var(--space-4);
    border: var(--component-card-border);
    border-radius: var(--component-card-radius);
    background: var(--color-semantic-background-elevated-normal);
  }

  .anchor-sticky-example__title {
    margin: 0 0 var(--space-3);
    color: var(--color-semantic-label-neutral);
    font-size: var(--label2-size);
    line-height: var(--label2-line);
    letter-spacing: var(--label2-spacing);
    font-weight: var(--fw-bold);
  }

  .anchor-sticky-example :is(h2, h3)[id] {
    scroll-margin-block-start: var(--anchor-scroll-offset);
  }

  .anchor-sticky-example__content .lk-prose > h2:first-child {
    margin-top: 0;
  }

  @media (max-width: 760px), (max-height: 560px) {
    .anchor-sticky-example {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "navigation"
        "content";
      row-gap: var(--space-5);
      padding-block-start: 0;
    }

    .anchor-sticky-example__aside {
      position: static;
      max-height: none;
      overflow: visible;
    }
  }
`;

function PageTableOfContentsExample() {
  const [active, setActive] = React.useState('#overview');

  const handleChange = (href) => {
    setActive(href);
  };

  return (
    <>
      <style data-anchor-sticky-example-styles>{stickyExampleStyles}</style>
      <div className="anchor-sticky-example">
        <aside className="anchor-sticky-example__aside">
          <p className="anchor-sticky-example__title" id="anchor-story-title">이 페이지에서</p>
          <Anchor
            aria-labelledby="anchor-story-title"
            active={active}
            onChange={handleChange}
            items={items}
          />
        </aside>

        <main className="anchor-sticky-example__content">
          <Prose>
            <h2 id="overview">운영 개요</h2>
            <p>
              대덕 사업장의 이동 로봇 운영 상태와 대응 기준을 한 문서에서 확인합니다.
              담당자는 교대 전에 연결 상태와 미처리 경보를 먼저 점검합니다.
            </p>
            <ul>
              <li>운행 중 장비와 충전 대기 장비 수 확인</li>
              <li>최근 24시간의 통신 지연과 안전 정지 이력 확인</li>
              <li>점검이 필요한 장비의 담당자와 예정 시각 확인</li>
            </ul>

            <h2 id="monitoring">상태 확인</h2>
            <p>
              정상 상태에서는 위치와 배터리 정보가 10초 이내에 갱신됩니다.
              마지막 수신 시각이 기준을 넘으면 현장 네트워크와 장비 전원을 순서대로 확인합니다.
            </p>
            <blockquote>
              원격 재기동 전에는 장비가 안전 구역에 정지해 있는지 현장 담당자에게 확인하세요.
            </blockquote>

            <h3 id="thresholds">경보 기준</h3>
            <table>
              <thead>
                <tr>
                  <th scope="col">상태</th>
                  <th scope="col">판정 기준</th>
                  <th scope="col">초기 대응</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>통신 지연</td>
                  <td>30초 이상 미수신</td>
                  <td>네트워크 확인</td>
                </tr>
                <tr>
                  <td>배터리 주의</td>
                  <td>잔량 20% 미만</td>
                  <td>충전 작업 배정</td>
                </tr>
                <tr>
                  <td>안전 정지</td>
                  <td>센서 또는 비상 정지</td>
                  <td>현장 확인 요청</td>
                </tr>
              </tbody>
            </table>

            <h2 id="history">변경 이력</h2>
            <p>
              경보 기준이나 대응 절차가 달라지면 변경 일자와 승인자를 함께 기록합니다.
              현재 기준은 2026년 7월 운영 정책을 반영합니다.
            </p>
          </Prose>
        </main>
      </div>
    </>
  );
}

const meta = {
  title: 'LDS Product/Navigation/Anchor',
  tags: ['autodocs'],
  component: Anchor,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-anchor--page-table-of-contents',
      eyebrow: 'Product / Anchor',
      title: '앵커는 긴 페이지 안에서 현재 위치와 이동 경로를 보여줍니다',
      description:
        '문서·설정처럼 한 페이지에 여러 제목이 있고 사용자가 구간을 오갈 때 적합합니다. 제품의 다른 화면으로 이동하는 전역 탐색에는 Anchor 대신 Side Nav나 Top Bar를 사용하세요.',
    },
    docs: {
      description: {
        component: '현재 페이지의 섹션 목차를 담당하는 Anchor 패턴입니다. 기본은 일반 흐름이며, 긴 페이지의 sticky 배치는 실제 헤더 높이와 스크롤 컨테이너를 아는 소비 레이아웃이 담당합니다.',
      },
    },
  },
};

export default meta;

export const PageTableOfContents = {
  name: '개요',
  parameters: storyDescription(
    '긴 페이지에서는 소비 레이아웃이 Anchor를 sticky로 조합합니다. 상단 offset과 대상 제목의 scroll margin이 같은 기준을 쓰고, 좁거나 낮은 화면에서는 일반 흐름으로 돌아오는지 확인하세요.',
  ),
  render: () => <PageTableOfContentsExample />,
  play: async ({ canvasElement }) => {
    const toc = canvasElement.querySelector('nav[aria-labelledby="anchor-story-title"]');
    if (!toc) throw new Error('Anchor must expose a named in-page navigation landmark.');
    const current = toc.querySelector('a[aria-current="location"]');
    if (!current || current.getAttribute('href') !== '#overview') {
      throw new Error('The active anchor item must carry aria-current="location".');
    }
    const nested = toc.querySelector('ul > li > ul > li > a[href="#thresholds"]');
    if (!nested) throw new Error('Level-1 items must render inside a nested list (ul > li > ul).');
    const aside = canvasElement.querySelector('.anchor-sticky-example__aside');
    const overview = canvasElement.querySelector('#overview');
    if (!aside || !overview || !canvasElement.querySelector('.anchor-sticky-example__content .lk-prose')) {
      throw new Error('The sticky composition must include a navigation wrapper and a Prose-formatted article.');
    }
    const compositionStyles = canvasElement.querySelector('style[data-anchor-sticky-example-styles]')?.textContent || '';
    if (!compositionStyles.includes('position: sticky') || !compositionStyles.includes('scroll-margin-block-start')) {
      throw new Error('The Anchor composition must define sticky positioning and matching target scroll margin.');
    }
  },
};
