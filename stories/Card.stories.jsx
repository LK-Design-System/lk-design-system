import React from 'react';
import { Button, Card, ContentBadge, Icon, ListCell, Thumbnail, ToggleIcon } from '../src/index.js';
import { CardCard as CardCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Card',
  tags: ['autodocs'],
  component: Card,
  args: {
    elevation: 'md',
    surface: 'default',
    interactive: false,
    dark: false,
  },
  argTypes: {
    elevation: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg'],
    },
    surface: {
      control: 'inline-radio',
      options: ['default', 'subtle'],
    },
  },
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-card--playground',
      eyebrow: 'Core / Content / Card',
      title: '서로 관련된 정보와 행동을 하나의 독립된 표면으로 묶습니다',
      description:
        '제목, 설명, 미디어, 메타 정보와 제한된 행동이 함께 이동해야 하는 콘텐츠 단위에 적합합니다. 단순한 행 목록은 List Cell을, 화면 전체의 큰 구획은 Section이나 Container를 사용하고, 모든 영역을 습관적으로 카드 안에 중첩하지 마세요.',
    },
    docs: {
      description: {
        component: 'Card의 기본 구조, 그림자 단계, 인터랙티브 상태를 확인합니다.',
      },
    },
  },
};

export default meta;

/** interactive 카드가 실제로 활성화됐는지 play 테스트에서 확인하기 위한 표식. */
const markActivated = (event) => {
  event.currentTarget.dataset.activated = 'true';
};

export const Playground = {
  name: '개요',
  parameters: storyDescription(
    '카드의 고도, 상호작용 여부, 다크 표면을 콘텐츠 문맥에 맞게 조정하는 상황입니다. 내부 정보 위계가 유지되고 카드 전체가 행동일 때만 interactive 처리가 적용되는지 확인하세요.',
  ),
  render: (args) => (
    <Card {...args} style={{ maxWidth: 420 }}>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Icon name="document" size={24} />
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
              항목 상태 패널
            </h2>
            <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--body2-size)' }}>
              검토 중, compact mode
            </p>
          </div>
        </div>
        <Button size="sm" variant={args.dark ? 'on-dark' : 'primary'}>
          상세 열기
        </Button>
      </div>
    </Card>
  ),
};

export const Elevation = {
  name: '사용법 · 표면 고도',
  parameters: storyDescription(
    '배경과의 분리 정도에 맞춰 카드의 고도 단계를 비교하는 상황입니다. 그림자가 정보 중요도를 대신하지 않고 같은 계층의 카드에는 일관된 elevation이 적용되는지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 920 }}>
      {['none', 'sm', 'md', 'lg'].map((elevation) => (
        <Card key={elevation} elevation={elevation}>
          <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{elevation}</strong>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--body2-size)' }}>
            component card shadow 토큰을 사용합니다.
          </span>
        </Card>
      ))}
    </div>
  ),
};

export const InteractiveAndDark = {
  name: '변형·상태 · 상호작용과 어두운 표면',
  parameters: {
    backgrounds: { default: 'Base' },
    ...storyDescription(
      '클릭 가능한 카드와 역상 다크 카드를 같은 화면에서 검토하는 상황입니다. hover·focus가 실제 행동 가능성을 나타내고 다크 표면에서도 제목과 설명의 대비가 유지되는지 확인하세요.',
    ),
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Card interactive onClick={markActivated}>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            인터랙티브 light card
          </h2>
          <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)' }}>
            마우스를 올리면 카드에 정해진 그림자와 이동 효과가 적용됩니다.
          </p>
        </div>
      </Card>
      <Card
        dark
        interactive
        onClick={markActivated}
        headingLevel={false}
        title="Dark Card title"
        description="Structured dark-card text uses the Card-owned foreground contract."
      >
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-semantic-static-white)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            인터랙티브 dark card
          </h2>
          <p style={{ margin: 0, color: 'var(--color-semantic-inverse-label-neutral-soft)' }}>
            inverse card 값은 component token으로 제어합니다.
          </p>
        </div>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = [...canvasElement.querySelectorAll('[role="button"]')];
    if (cards.length !== 2) {
      throw new Error('interactive 카드는 role="button"으로 노출되어야 합니다(카드 전체가 클릭 대상).');
    }
    for (const card of cards) {
      if (card.getAttribute('tabindex') !== '0') {
        throw new Error('interactive 카드는 Tab으로 도달할 수 있어야 합니다(WCAG 2.1.1).');
      }
      if (card.querySelector('button, a[href], input, select, textarea, [tabindex]')) {
        throw new Error('interactive 카드 안에는 포커스 가능한 중첩 요소를 두지 않습니다(nested interactive).');
      }
    }
    for (const key of ['Enter', ' ']) {
      const card = cards[key === 'Enter' ? 0 : 1];
      delete card.dataset.activated;
      card.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      if (card.dataset.activated !== 'true') {
        throw new Error(`interactive 카드는 ${key === ' ' ? 'Space' : 'Enter'} 키로 활성화되어야 합니다.`);
      }
    }
  },
};

export const ContentCardPatterns = {
  name: '사용법 · 콘텐츠형과 목록형',
  parameters: storyDescription(
    '썸네일 중심 콘텐츠 카드와 행 중심 리스트 카드를 데스크톱·모바일 밀도로 구성하는 상황입니다. 미디어, 저장 행동, 제목, 설명, 메타 정보의 읽기 순서가 유지되고 스켈레톤도 같은 구조를 예고하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        <Card
          platform="desktop"
          save
          topContent={<ContentBadge color="accent" size="xsmall">콘텐츠</ContentBadge>}
          thumbnail={<Thumbnail ratio="16/10" placeholder={false} style={{ background: 'linear-gradient(135deg, var(--color-semantic-fill-normal), var(--color-semantic-fill-alternative))' }} />}
          caption="카테고리"
          title="여러 문장 단위로 이어지는 긴 콘텐츠 카드 제목도 정보 손실 없이 표시합니다"
          titleWrap="wrap"
          description="썸네일, 저장 액션, 제목, 설명, 보조 정보를 하나의 중립 카드 표면에 배치합니다."
          bottomContent={<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><ContentBadge size="xsmall">신규</ContentBadge><ContentBadge size="xsmall">추천</ContentBadge></div>}
        />
        <Card
          platform="mobile"
          thumbnail={<Thumbnail ratio="4/3" placeholder={false} border style={{ background: 'linear-gradient(135deg, var(--color-semantic-fill-normal), var(--color-semantic-background-elevated-normal))' }} />}
          caption="Mobile"
          title="모바일 콘텐츠 카드"
          description="모바일 축은 같은 정보 구조를 유지하고 padding과 width만 더 조밀하게 조정합니다."
          subCaption="보조 캡션"
        />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(min(420px, 100%), 1fr) minmax(min(260px, 100%), 0.7fr)', gap: 'var(--space-4)', alignItems: 'start' }}>
        <Card padding={8} elevation="sm">
          <ListCell
            leading={<Thumbnail ratio="1/1" radius="8px" placeholder={false} style={{ width: 48, background: 'var(--color-semantic-fill-normal)' }} />}
            title="리스트 카드 항목"
            description="leading, trailing, divider를 조합한 List Card 밀도"
            trailing={<ContentBadge color="accent">상태</ContentBadge>}
            divider
          />
          <ListCell
            leading={<Thumbnail ratio="1/1" radius="8px" placeholder={false} style={{ width: 48, background: 'var(--color-semantic-fill-normal)' }} />}
            title="선택된 리스트 항목"
            description="선택 상태와 divider"
            selected
            divider
          />
          <ListCell
            leading={<Thumbnail ratio="1/1" radius="8px" placeholder={false} style={{ width: 48, background: 'var(--color-semantic-fill-normal)' }} />}
            title="탐색 가능한 항목"
            description="chevron trailing affordance"
            chevron
          />
        </Card>
        <Card platform="desktop" skeleton />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const headings = [...canvasElement.querySelectorAll('h3')].map((h) => h.textContent);
    for (const title of ['여러 문장 단위로 이어지는 긴 콘텐츠 카드 제목도 정보 손실 없이 표시합니다', '모바일 콘텐츠 카드']) {
      if (!headings.includes(title)) {
        throw new Error(`구조화 카드의 title은 실제 heading으로 렌더링되어야 합니다(WCAG 1.3.1): ${title}`);
      }
    }
    const wrappedTitle = [...canvasElement.querySelectorAll('h3')].find((heading) => heading.textContent?.startsWith('여러 문장'));
    if (!wrappedTitle || getComputedStyle(wrappedTitle).whiteSpace !== 'normal') {
      throw new Error('Card titleWrap="wrap" must preserve the complete visible title across lines.');
    }
  },
};

export const CardAffordances = {
  name: '사용법 · 보조 동작과 미디어 정보',
  parameters: storyDescription(
    '카드에 즐겨찾기 토글, 여러 단계의 캡션, 미디어 오버레이를 함께 제공하는 복합 상황입니다. 부가 어포던스가 제목보다 먼저 경쟁하지 않고 각 캡션의 역할과 클릭 대상이 명확한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-4)', maxWidth: 920, alignItems: 'start' }}>
      <Card
        toggleIcon={<ToggleIcon label="즐겨찾기"><Icon name="star" size={18} /></ToggleIcon>}
        topContent={<ContentBadge color="accent" size="xsmall">라이브</ContentBadge>}
        caption="카테고리 · caption"
        title="토글 아이콘 카드"
        description="상단 우측 toggleIcon 어포던스가 save 액션과 나란히 놓입니다."
        subCaption="보조 캡션 · subCaption"
        metaCaption="업데이트 2026-07-09 · metaCaption (3번째 캡션 티어)"
      />
      <Card
        thumbnail={
          <Thumbnail
            ratio="16/10"
            placeholder={false}
            overlay={<ContentBadge color="accent" size="xsmall">오버레이</ContentBadge>}
            overlayAlign="top-left"
            style={{ background: 'linear-gradient(135deg, var(--color-semantic-fill-normal), var(--color-semantic-fill-alternative))' }}
          />
        }
        caption="미디어 · caption"
        title="썸네일 오버레이 카드"
        description="Thumbnail의 overlay 슬롯을 카드 내부에서 시연합니다."
        subCaption="subCaption"
        metaCaption="00:42 · 라이브 스트림 · metaCaption"
      />
    </main>
  ),
};

export const CardCard = { ...CardCardStory, name: 'Card card parity', tags: ['!dev', 'visual-parity'] };

export const SemanticInsetGroup = {
  name: '사용법 · 시맨틱 묶음 표면',
  parameters: storyDescription(
    '관련 항목을 한 단계 내려앉은 표면에 묶고 각 항목은 독립된 문서 단위로 노출하는 상황입니다. 바깥 묶음은 평평하고 안쪽 항목이 고도를 소유하며 실제 HTML 요소가 문서 구조를 보존하는지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 880 }}>
      {['light', 'dark'].map((theme) => (
        <div key={theme} data-theme={theme} style={{ padding: 16, background: 'var(--color-semantic-background-normal-normal)', borderRadius: 'var(--radius-xl)' }}>
          <Card as="section" surface="subtle" data-testid={`${theme}-inset-group`} aria-label={`${theme} 관련 항목`}>
            <ul style={{ display: 'grid', gap: 'var(--space-3)', margin: 0, padding: 0, listStyle: 'none' }}>
              <Card as="li" elevation="sm" data-testid={`${theme}-inset-item`}>
                <article>
                  <strong>{theme === 'light' ? '활성 프로젝트' : '보관 프로젝트'}</strong>
                  <p style={{ margin: 'var(--space-2) 0 0', color: 'var(--color-semantic-label-alternative)' }}>각 항목이 고도와 내용을 소유합니다.</p>
                </article>
              </Card>
            </ul>
          </Card>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const theme of ['light', 'dark']) {
      const group = canvasElement.querySelector(`[data-testid="${theme}-inset-group"]`);
      const item = canvasElement.querySelector(`[data-testid="${theme}-inset-item"]`);
      if (group?.tagName !== 'SECTION' || item?.tagName !== 'LI') {
        throw new Error('The as prop must render the requested native section and list-item elements.');
      }
      if (getComputedStyle(group).backgroundColor === getComputedStyle(item).backgroundColor) {
        throw new Error(`The ${theme} inset group must remain visually distinct from its nested item.`);
      }
      if (getComputedStyle(group).boxShadow !== 'none') {
        throw new Error('A subtle group must default to a flat surface so nested items own elevation.');
      }
    }
  },
};

function CardSurfaceRefFixture() {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current?.setAttribute('data-ref-target', 'card-root');
  }, []);
  return (
    <Card
      ref={ref}
      as="article"
      title="Surface contract"
      description="Named Card parts"
      className="contract-card-root"
      classNames={{ title: 'contract-card-title' }}
      styles={{ description: { letterSpacing: '1px' } }}
      vars={{ '--lds-card-padding': '20px', '--lds-card-radius': '10px' }}
    />
  );
}

export const SurfaceRefContract = {
  name: 'Surface and ref contract',
  tags: ['!dev'],
  render: () => <CardSurfaceRefFixture />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-ref-target="card-root"]');
    const title = root?.querySelector('[data-slot="title"]');
    const description = root?.querySelector('[data-slot="description"]');
    if (!(root instanceof HTMLElement) || root.tagName !== 'ARTICLE' || root.dataset.slot !== 'root') {
      throw new Error('Card ref must follow the polymorphic public root.');
    }
    if (!root.classList.contains('contract-card-root') || !title?.classList.contains('contract-card-title')) {
      throw new Error('Card root and named-part classes must compose independently.');
    }
    const rootStyle = getComputedStyle(root);
    if (rootStyle.paddingTop !== '20px' || rootStyle.borderRadius !== '10px' || getComputedStyle(description).letterSpacing !== '1px') {
      throw new Error('Card vars and named-part styles must reach the documented targets.');
    }
  },
};
