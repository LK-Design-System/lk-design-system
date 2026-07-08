import React from 'react';
import { Button, Card, ContentBadge, Icon, ListCell, Thumbnail } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Content/Card',
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
  name: '콘텐츠 카드와 리스트 카드',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        <Card
          platform="desktop"
          save
          topContent={<ContentBadge color="accent" size="xsmall">콘텐츠</ContentBadge>}
          thumbnail={<Thumbnail ratio="16/10" placeholder={false} style={{ background: 'linear-gradient(135deg, var(--fill-normal), var(--fill-alt))' }} />}
          caption="카테고리"
          title="콘텐츠 카드"
          description="썸네일, 저장 액션, 제목, 설명, 보조 정보를 하나의 중립 카드 표면에 배치합니다."
          bottomContent={<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><ContentBadge size="xsmall">Badge</ContentBadge><ContentBadge size="xsmall">Meta</ContentBadge></div>}
        />
        <Card
          platform="mobile"
          thumbnail={<Thumbnail ratio="4/3" placeholder={false} border style={{ background: 'linear-gradient(135deg, var(--fill-normal), var(--surface-card))' }} />}
          caption="Mobile"
          title="모바일 콘텐츠 카드"
          description="모바일 축은 같은 정보 구조를 유지하고 padding과 width만 더 조밀하게 조정합니다."
          subCaption="Extra caption"
        />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(min(420px, 100%), 1fr) minmax(min(260px, 100%), 0.7fr)', gap: 'var(--space-4)', alignItems: 'start' }}>
        <Card padding={8} elevation="sm">
          <ListCell
            leading={<Thumbnail ratio="1/1" radius="8px" placeholder={false} style={{ width: 48, background: 'var(--fill-normal)' }} />}
            title="리스트 카드 항목"
            description="leading, trailing, divider를 조합한 List Card 밀도"
            trailing={<ContentBadge color="accent">상태</ContentBadge>}
            divider
          />
          <ListCell
            leading={<Thumbnail ratio="1/1" radius="8px" placeholder={false} style={{ width: 48, background: 'var(--fill-normal)' }} />}
            title="선택된 리스트 항목"
            description="선택 상태와 divider"
            selected
            divider
          />
          <ListCell
            leading={<Thumbnail ratio="1/1" radius="8px" placeholder={false} style={{ width: 48, background: 'var(--fill-normal)' }} />}
            title="탐색 가능한 항목"
            description="chevron trailing affordance"
            chevron
          />
        </Card>
        <Card platform="desktop" skeleton />
      </section>
    </main>
  ),
};
