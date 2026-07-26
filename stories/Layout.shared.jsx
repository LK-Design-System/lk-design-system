import React from 'react';
import { waitFor } from 'storybook/test';
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

const MAIN_ID = 'lds-page-structure-main';

/* 건너뛰기 링크는 "보이지 않다가 포커스되면 나타나는" 링크여야 합니다.
   VisuallyHidden은 항상 숨기므로, 포커스 상태에 따라 스타일을 바꿉니다. */
function SkipLink({ targetId, children }) {
  const [focused, setFocused] = React.useState(false);
  const hiddenStyle = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0 };
  const visibleStyle = {
    position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', zIndex: 100,
    padding: '10px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--color-semantic-primary-normal)', color: 'var(--color-semantic-static-white)',
    fontWeight: 'var(--fw-bold)', textDecoration: 'none',
    outline: '2px solid var(--color-semantic-focus-indicator)', outlineOffset: 2,
  };
  return (
    <a
      href={`#${targetId}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={focused ? visibleStyle : hiddenStyle}
    >
      {children}
    </a>
  );
}

/**
 * 페이지 구조의 랜드마크 계약을 함께 보여줍니다.
 * - banner(`header`) / main(`main`) / contentinfo(`footer`) 를 명시
 * - `main` 은 페이지당 정확히 하나
 * - 반복되는 헤더를 건너뛰는 skip link 를 문서의 첫 포커스 대상으로 배치
 */
export const PageStructure = {
  name: '페이지 구조',
  render: () => (
    <div style={{ position: 'relative' }}>
      <SkipLink targetId={MAIN_ID}>본문으로 건너뛰기</SkipLink>

      <header style={{ borderBottom: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) 0' }}>
            <strong style={{ color: 'var(--color-semantic-label-strong)' }}>LK ROBOTICS</strong>
            <nav aria-label="주요 메뉴">
              <Cluster gap="var(--space-4)">
                {['개요', '장비', '문서'].map((label) => (
                  <a key={label} href="#" style={{ color: 'var(--color-semantic-label-neutral)', textDecoration: 'none' }}>{label}</a>
                ))}
              </Cluster>
            </nav>
          </div>
        </Container>
      </header>

      <main id={MAIN_ID} tabIndex={-1}>
        <Section surface="band" py="var(--space-10)">
          <Container>
            <Stack gap="var(--space-6)">
              <Split template="1.2fr 0.8fr" gap="var(--space-6)">
                <Stack gap="var(--space-3)">
                  <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 32 }}>앱 화면 레이아웃</h2>
                  <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
                    Section, Container, Split, Stack을 조합해 반응형 페이지 리듬을 만듭니다.
                    바깥 골격은 header · main · footer 랜드마크가 담당합니다.
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
                <Col span={12} md={4}>
                  <aside aria-label="보조 정보" style={{ height: '100%' }}>{tile('aside · Col md=4')}</aside>
                </Col>
              </Columns>
            </Stack>
          </Container>
        </Section>
      </main>

      <footer style={{ borderTop: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <Container>
          <p style={{ margin: 0, padding: 'var(--space-4) 0', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)' }}>
            © LK ROBOTICS · footer는 contentinfo 랜드마크입니다.
          </p>
        </Container>
      </footer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const mains = canvasElement.querySelectorAll('main');
    if (mains.length !== 1) {
      throw new Error('페이지에는 main 랜드마크가 정확히 하나만 있어야 합니다.');
    }
    if (!canvasElement.querySelector('header') || !canvasElement.querySelector('footer')) {
      throw new Error('페이지 골격은 header(banner)와 footer(contentinfo) 랜드마크를 갖춰야 합니다.');
    }
    const skip = canvasElement.querySelector('a[href^="#"]');
    if (!skip || skip.getAttribute('href') !== `#${mains[0].id}`) {
      throw new Error('첫 포커스 대상은 main을 가리키는 건너뛰기 링크여야 합니다(WCAG 2.4.1).');
    }
    const focusables = canvasElement.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
    if (focusables[0] !== skip) {
      throw new Error('건너뛰기 링크는 탭 순서에서 가장 먼저 와야 합니다.');
    }
    const view = canvasElement.ownerDocument.defaultView;
    if (view.getComputedStyle(skip).width !== '1px') {
      throw new Error('건너뛰기 링크는 포커스 전에는 시각적으로 숨겨져 있어야 합니다.');
    }
    skip.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    skip.focus();
    await waitFor(() => {
      if (view.getComputedStyle(skip).width === '1px') {
        throw new Error('건너뛰기 링크는 포커스되면 화면에 나타나야 합니다(WCAG 2.4.7).');
      }
    });
  },
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
    <div data-visual-crop-root style={{ width: 260, height: 200, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: 200 }}>
        <AspectRatio ratio={16 / 9}>
          <Center style={{ height: '100%', background: 'var(--color-semantic-background-normal-alternative)', borderRadius: 'var(--radius-lg)' }}>
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
    <div data-visual-crop-root style={{ width: 360, height: 160, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <ScrollArea maxHeight={110} style={{ width: 260, background: 'var(--color-semantic-background-normal-alternative)', borderRadius: 'var(--radius-lg)', padding: 12 }}>
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
                background: 'var(--color-semantic-background-elevated-normal)',
                border: '1px solid var(--color-semantic-line-solid-normal)',
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
  <div style={{ background: 'var(--color-semantic-primary-surface-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 14, color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
    {children}
  </div>
);

export const ClusterCard = {
  name: 'Cluster card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Cluster gap={8}>
        {['문서', '컴포넌트', '토큰', '가이드'].map((label) => (
          <span key={label} style={{ display: 'inline-flex', height: 30, alignItems: 'center', padding: '0 12px', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-pill)', fontSize: 13, color: 'var(--color-semantic-label-neutral)' }}>
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
    <div data-visual-crop-root style={{ width: 700, height: 260, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', marginBottom: 10 }}>main 8 / aside 4 (md)</div>
          <Columns gap={12}>
            <Col md={8}><div style={{ background: 'var(--color-semantic-primary-surface-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>main · md&nbsp;8</div></Col>
            <Col md={4}><div style={{ background: 'var(--color-semantic-fill-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-label-neutral)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>aside · md&nbsp;4</div></Col>
          </Columns>
        </div>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', marginBottom: 10 }}>thirds — full → half (sm) → third (md)</div>
          <Columns gap={12}>
            <Col sm={6} md={4}><div style={{ background: 'var(--color-semantic-primary-surface-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>1</div></Col>
            <Col sm={6} md={4}><div style={{ background: 'var(--color-semantic-primary-surface-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>2</div></Col>
            <Col sm={12} md={4}><div style={{ background: 'var(--color-semantic-primary-surface-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>3</div></Col>
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
    <div data-visual-crop-root style={{ width: 520, height: 140, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
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
    <div data-visual-crop-root style={{ width: 700, height: 150, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Section surface="subtle" py={28} style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-semantic-line-solid-normal)' }}>
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
    <div data-visual-crop-root style={{ width: 700, height: 140, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <Split template="260px 1fr" gap={16}>
        <div style={{ background: 'var(--color-semantic-fill-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-label-neutral)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>sidebar · 260</div>
        <div style={{ background: 'var(--color-semantic-primary-surface-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', padding: 16, color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>main · 1fr</div>
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
