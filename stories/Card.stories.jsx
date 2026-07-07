import React from 'react';
import { Button, Card, ContentBadge, Icon, ListCell, Thumbnail } from '../src/index.js';

const meta = {
  title: 'LDS Core/3 Component/4 Content/Card',
  component: Card,
  args: {
    elevation: 'md',
    interactive: false,
    dark: false,
  },
  argTypes: {
    elevation: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Card의 기본 구조, 그림자 단계, 인터랙티브 상태를 확인합니다.',
      },
    },
  },
};

export default meta;

export const Playground = {
  name: '플레이그라운드',
  render: (args) => (
    <Card {...args} style={{ maxWidth: 420 }}>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Icon name="document" size={24} />
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
              항목 상태 패널
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--body2-size)' }}>
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
  name: '그림자 단계',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 920 }}>
      {['none', 'sm', 'md', 'lg'].map((elevation) => (
        <Card key={elevation} elevation={elevation}>
          <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{elevation}</strong>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--body2-size)' }}>
            component card shadow 토큰을 사용합니다.
          </span>
        </Card>
      ))}
    </div>
  ),
};

export const InteractiveAndDark = {
  name: '인터랙티브와 다크',
  parameters: {
    backgrounds: { default: 'Base' },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Card interactive>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            인터랙티브 light card
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            hover 상태는 `--component-card-shadow-lg`와 `--component-card-hover-transform`을 사용합니다.
          </p>
        </div>
      </Card>
      <Card dark interactive>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-on-dark)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            인터랙티브 dark card
          </h3>
          <p style={{ margin: 0, color: 'var(--text-on-dark-muted)' }}>
            inverse card 값은 component token으로 제어합니다.
          </p>
        </div>
      </Card>
    </div>
  ),
};

export const ContentCardPatterns = {
  name: '콘텐츠 카드 패턴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 980 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)' }}>
        <Card
          platform="desktop"
          save
          saved
          topContent={<ContentBadge color="accent" size="xsmall">Featured</ContentBadge>}
          thumbnail={<Thumbnail ratio="16/10" overlay={<ContentBadge color="neutral" variant="solid">Desktop</ContentBadge>} overlayAlign="top-left" />}
          title="Desktop content card"
          description="Thumbnail, badge, save action, title, description, and bottom content."
          bottomContent={<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><ContentBadge size="xsmall">Badge</ContentBadge><ContentBadge size="xsmall">Meta</ContentBadge></div>}
        />
        <Card
          platform="mobile"
          save
          thumbnail={<Thumbnail ratio="4/3" overlay={<Icon name="bookmark" size={16} />} overlayAlign="top-right" />}
          caption="Mobile"
          title="Mobile content card"
          description="Compact padding and card width for the mobile platform axis."
          subCaption="Sub caption"
        />
        <Card platform="desktop" skeleton />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)' }}>
        <Card padding={16} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <Thumbnail
            ratio="16/10"
            overlay={<ContentBadge color="neutral" variant="solid">오피스랩 단위</ContentBadge>}
            overlayAlign="top-left"
          >
            <Icon name="bookmark" size={16} />
          </Thumbnail>
          <div style={{ display: 'grid', gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.4, color: 'var(--label-strong)' }}>제목</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--label-alternative)' }}>설명</p>
          </div>
        </Card>
        <Card padding={16} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <Thumbnail ratio="4/3" border overlay={<Icon name="bookmark" size={16} />} overlayAlign="top-right" />
          <div style={{ display: 'grid', gap: 6 }}>
            <ContentBadge color="accent" size="xsmall">텍스트</ContentBadge>
            <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.4, color: 'var(--label-strong)' }}>제목</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--label-alternative)' }}>설명</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <ContentBadge size="xsmall">텍스트</ContentBadge>
              <ContentBadge size="xsmall">텍스트</ContentBadge>
            </div>
          </div>
        </Card>
        <Card padding={8}>
          <ListCell leading={<Thumbnail ratio="1/1" radius="8px" style={{ width: 48 }} />} title="제목" description="설명" trailing={<ContentBadge color="accent">상태</ContentBadge>} divider />
          <ListCell leading={<Thumbnail ratio="1/1" radius="8px" style={{ width: 48 }} />} title="제목" description="설명" selected divider />
          <ListCell leading={<Thumbnail ratio="1/1" radius="8px" style={{ width: 48 }} />} title="제목" description="설명" chevron />
        </Card>
      </section>
      <Card padding={16}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 'var(--space-3)' }}>
          <Thumbnail ratio="4/3" />
          <Thumbnail ratio="4/3" border />
          <Thumbnail ratio="4/3" radius={false} />
          <Thumbnail ratio="4/3" overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="bottom-right" />
        </div>
      </Card>
    </main>
  ),
};
