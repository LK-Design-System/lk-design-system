import React from 'react';
import {
  AspectRatio,
  Center,
  Cluster,
  Col,
  Columns,
  Container,
  Grid,
  ScrollArea,
  Section,
  Spacer,
  Split,
  Stack,
  VisuallyHidden,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/레이아웃',
  parameters: {
    docs: {
      description: {
        component: '화면 폭, 그리드, 스택, 스크롤, 접근성 숨김 텍스트 등 레이아웃 프리미티브입니다.',
      },
    },
  },
};

export default meta;

const tile = (label) => (
  <div style={{ minHeight: 72, display: 'grid', placeItems: 'center', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', color: 'var(--label-neutral)', fontWeight: 'var(--fw-bold)' }}>
    {label}
  </div>
);

export const PageStructure = {
  name: '페이지 구조',
  render: () => (
    <Section surface="band" py="var(--space-10)">
      <Container>
        <Stack gap="var(--space-6)">
          <Split template="1.2fr 0.8fr" gap="var(--space-6)">
            <Stack gap="var(--space-3)">
              <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 32 }}>운영 화면 레이아웃</h1>
              <p style={{ margin: 0, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
                Section, Container, Split, Stack을 조합해 반응형 페이지 리듬을 만듭니다.
              </p>
            </Stack>
            <AspectRatio ratio={16 / 9}>
              <Center minHeight="100%" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                지도 프리뷰
              </Center>
            </AspectRatio>
          </Split>

          <Columns gap="var(--space-4)">
            <Col span={12} md={8}>{tile('Col md=8')}</Col>
            <Col span={12} md={4}>{tile('Col md=4')}</Col>
          </Columns>
        </Stack>
      </Container>
    </Section>
  ),
};

export const PrimitiveInventory = {
  name: '프리미티브 인벤토리',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 960 }}>
      <Grid minItemWidth={180} gap="var(--space-4)">
        {['Grid', 'Container', 'Section', 'AspectRatio'].map((label) => (
          <React.Fragment key={label}>{tile(label)}</React.Fragment>
        ))}
      </Grid>
      <Cluster gap="var(--space-3)">
        {['필터', '상태', '로봇', '시설'].map((label) => (
          <span key={label} style={{ padding: '8px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
            {label}
          </span>
        ))}
      </Cluster>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', maxWidth: 420 }}>
        <span>좌측</span>
        <Spacer axis="horizontal" />
        <span>우측</span>
      </div>
      <ScrollArea maxHeight={120} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 var(--space-3)', color: 'var(--label-neutral)' }}>스크롤 행 {i + 1}</p>
        ))}
      </ScrollArea>
      <button type="button" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
        <VisuallyHidden>접근성 전용 라벨</VisuallyHidden>
        ⌘
      </button>
    </main>
  ),
};

const parityBox = (children) => (
  <div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 14, color: 'var(--lk-accent-ink)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
    {children}
  </div>
);

export const StackCard = {
  name: 'Stack card parity',
  render: () => (
    <Stack direction="row" gap={12} align="center">
      {parityBox('A')}
      {parityBox('B')}
      <Spacer />
      {parityBox('?')}
    </Stack>
  ),
};
