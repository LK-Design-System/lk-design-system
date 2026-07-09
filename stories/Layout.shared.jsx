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
  <div style={{ minHeight: 72, display: 'grid', placeItems: 'center', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', color: 'var(--color-semantic-label-neutral)', fontWeight: 'var(--fw-bold)' }}>
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
              <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 32 }}>앱 화면 레이아웃</h1>
              <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
                Section, Container, Split, Stack을 조합해 반응형 페이지 리듬을 만듭니다.
              </p>
            </Stack>
            <AspectRatio ratio={16 / 9}>
              <Center minHeight="100%" style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
                미디어 프리뷰
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
        {['필터', '상태', '문서', '그룹'].map((label) => (
          <span key={label} style={{ padding: '8px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
            {label}
          </span>
        ))}
      </Cluster>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', maxWidth: 420 }}>
        <span>좌측</span>
        <Spacer axis="horizontal" />
        <span>우측</span>
      </div>
      <ScrollArea maxHeight={120} style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-neutral)' }}>스크롤 행 {i + 1}</p>
        ))}
      </ScrollArea>
      <button type="button" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <VisuallyHidden>접근성 전용 라벨</VisuallyHidden>
        ⌘
      </button>
    </main>
  ),
};

export const AspectRatioCenterCard = {
  name: 'AspectRatio · Center card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 260, height: 200, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: 200 }}>
        <AspectRatio ratio={16 / 9}>
          <Center style={{ height: '100%', background: 'var(--bw-mist)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 13 }}>16 : 9</span>
          </Center>
        </AspectRatio>
      </div>
    </div>
  ),
};

export const ScrollAreaCard = {
  name: 'ScrollArea card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 360, height: 160, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <ScrollArea maxHeight={110} style={{ width: 260, background: 'var(--bw-mist)', borderRadius: 'var(--radius-lg)', padding: 12 }}>
        <Stack gap={8}>
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              style={{
                display: 'inline-flex',
                width: '100%',
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
                background: 'var(--bw-white)',
                border: '1px solid var(--bw-border)',
                borderRadius: 'var(--radius-pill)',
                fontSize: 13,
                color: 'var(--color-semantic-label-neutral)',
                boxSizing: 'border-box',
              }}
            >
              row {index + 1}
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </div>
  ),
};

const parityBox = (children) => (
  <div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 14, color: 'var(--color-semantic-primary-normal)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
    {children}
  </div>
);

export const ClusterCard = {
  name: 'Cluster card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Cluster gap={8}>
        {['문서', '컴포넌트', '토큰', '가이드'].map((label) => (
          <span key={label} style={{ display: 'inline-flex', height: 30, alignItems: 'center', padding: '0 12px', background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-pill)', fontSize: 13, color: 'var(--color-semantic-label-neutral)' }}>
            {label}
          </span>
        ))}
      </Cluster>
    </div>
  ),
};

export const ColumnsColCard = {
  name: 'Columns · Col card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 260, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-assistive)', marginBottom: 10 }}>main 8 / aside 4 (md)</div>
          <Columns gap={12}>
            <Col md={8}><div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-normal)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>main · md&nbsp;8</div></Col>
            <Col md={4}><div style={{ background: 'var(--color-semantic-fill-normal)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-label-neutral)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>aside · md&nbsp;4</div></Col>
          </Columns>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-assistive)', marginBottom: 10 }}>thirds — full → half (sm) → third (md)</div>
          <Columns gap={12}>
            <Col sm={6} md={4}><div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-normal)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>1</div></Col>
            <Col sm={6} md={4}><div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-normal)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>2</div></Col>
            <Col sm={12} md={4}><div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-normal)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>3</div></Col>
          </Columns>
        </div>
      </div>
    </div>
  ),
};

export const GridCard = {
  name: 'Grid card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 520, height: 140, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Grid minItemWidth={150} gap={12}>
        {['1', '2', '3', '4'].map((label) => (
          <React.Fragment key={label}>{parityBox(label)}</React.Fragment>
        ))}
      </Grid>
    </div>
  ),
};

export const SectionCard = {
  name: 'Section card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 150, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Section surface="subtle" py={28} style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--bw-border)' }}>
        <div style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 13 }}>
          centered <b>.lk-container-fluid</b> · <b>--gap-section</b> vertical rhythm · surface=&quot;subtle&quot;
        </div>
      </Section>
    </div>
  ),
};

export const SplitCard = {
  name: 'Split card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 140, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Split template="260px 1fr" gap={16}>
        <div style={{ background: 'var(--color-semantic-fill-normal)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-label-neutral)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>sidebar · 260</div>
        <div style={{ background: 'var(--lk-accent-tint)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-normal)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>main · 1fr</div>
      </Split>
    </div>
  ),
};

export const StackCard = {
  name: 'Stack card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <Stack direction="row" gap={12} align="center">
      {parityBox('A')}
      {parityBox('B')}
      <Spacer />
      {parityBox('?')}
    </Stack>
  ),
};
