import {
  Card,
  Overline,
  PageHeader,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Overline',
  tags: ['autodocs'],
  component: Overline,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-overline--eyebrow-overview',
      eyebrow: 'Core / Content / Overline · Eyebrow',
      title: '아이브로우는 제목 앞의 역할과 문구 길이에 맞춰 선택합니다',
      description:
        '화면·섹션의 상위 맥락처럼 문장형 표기가 필요한 경우에는 페이지 헤더의 eyebrow가 적합합니다. GUIDE·EVENT처럼 짧은 범주나 브랜드 키커에는 Overline을 사용하고, 상태·긴 설명·제목 자체를 아이브로우로 대신하지 마세요.',
    },
    docs: {
      description: {
        component:
          'Overline은 제목 앞에서 짧은 범주나 브랜드 맥락을 표시하는 아이브로우 컴포넌트입니다. 화면·섹션의 문맥 캡션은 페이지 헤더의 문장형 아이브로우를 사용합니다.',
      },
    },
  },
};

export default meta;

const specimenGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: 'var(--space-4)',
};

const headingStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 'var(--heading2-size)',
  lineHeight: 'var(--heading2-line)',
  letterSpacing: 'var(--heading2-spacing)',
};

const bodyStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-neutral)',
  fontSize: 'var(--body2-size)',
  lineHeight: 'var(--body2-reading-line)',
};

export const EyebrowOverview = {
  name: '개요',
  parameters: storyDescription(
    '같은 제목 앞자리라도 상위 화면 맥락과 짧은 범주 라벨은 서로 다른 타이포그래피 역할입니다. 문장형 맥락은 원래 대소문자와 제목 위계를 유지하고, 범주 키커만 짧은 대문자 Overline으로 보이는지 비교하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <section aria-labelledby="eyebrow-role-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="eyebrow-role-heading" style={headingStyle}>두 가지 아이브로우 역할</h2>
        <p style={bodyStyle}>
          아이브로우는 제목의 의미를 대신하지 않고, 사용자가 제목을 읽기 전에 범위나 범주를 먼저 파악하도록 돕습니다.
        </p>
        <div style={specimenGridStyle}>
          <Card elevation="sm" style={{ minWidth: 0 }}>
            <PageHeader
              headingLevel={3}
              eyebrow="시설 모니터링"
              title="층별 현황"
              description="화면·섹션의 상위 맥락은 문장형 표기를 유지합니다."
            />
          </Card>
          <Card elevation="sm" style={{ minWidth: 0 }}>
            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <Overline tone="signal" data-testid="category-overline">GUIDE</Overline>
              <h3 style={headingStyle}>로봇 운영 가이드</h3>
              <p style={bodyStyle}>짧은 콘텐츠 범주나 브랜드 키커는 Overline으로 표시합니다.</p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const contextHeading = canvasElement.querySelector('h3');
    const overline = canvasElement.querySelector('[data-testid="category-overline"]');
    if (!contextHeading || !overline) {
      throw new Error('문장형 맥락과 범주 Overline 예제가 모두 렌더되어야 합니다.');
    }
    if (overline.tagName.toLowerCase() === 'h3') {
      throw new Error('Overline은 제목의 시각적 보조 요소이며 heading 자체를 대신하지 않습니다.');
    }
  },
};

export const ContextAndCategoryUsage = {
  name: '사용법 · 문맥 캡션과 범주 아이브로우',
  parameters: storyDescription(
    '화면의 상위 범위를 설명할 때와 콘텐츠 범주를 짧게 표시할 때의 선택 기준입니다. 문장형 문구를 강제로 대문자화하거나 성공·경고 같은 상태를 아이브로우 색만으로 전달하지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <section aria-labelledby="context-caption-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="context-caption-heading" style={headingStyle}>상위 문맥을 설명할 때</h2>
        <Card elevation="sm" style={{ minWidth: 0 }}>
          <PageHeader
            headingLevel={3}
            eyebrow="운영 센터 · 대전"
            title="자율주행 로봇 현황"
            description="사용자가 현재 화면의 위치와 범위를 이해하는 데 필요한 문맥입니다."
          />
        </Card>
      </section>

      <section aria-labelledby="category-overline-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="category-overline-heading" style={headingStyle}>짧은 범주를 표시할 때</h2>
        <Card elevation="sm" style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <Overline>RESEARCH</Overline>
            <h3 style={headingStyle}>Physical AI 리서치 노트</h3>
            <p style={bodyStyle}>한두 단어의 범주가 제목을 빠르게 분류하도록 돕습니다.</p>
          </div>
        </Card>
      </section>

      <section aria-labelledby="avoid-eyebrow-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="avoid-eyebrow-heading" style={headingStyle}>피해야 할 선택</h2>
        <ul style={{ ...bodyStyle, paddingInlineStart: 'var(--space-5)' }}>
          <li>페이지 제목이나 실제 heading을 아이브로우로 대체하지 않습니다.</li>
          <li>성공·경고·오류처럼 변하는 상태는 상태 배지를 사용합니다.</li>
          <li>번역되는 문장이나 긴 설명을 강제 대문자 Overline에 넣지 않습니다.</li>
        </ul>
      </section>
    </main>
  ),
};

export const TonesAndInverseSurface = {
  name: '변형·상태 · 톤과 어두운 표면',
  parameters: storyDescription(
    '같은 짧은 범주 라벨을 기본·브랜드 강조·고대비 톤과 밝고 어두운 표면에서 비교합니다. tone은 장식적 강조만 조절하며 의미나 상태를 색 하나로 부호화하지 않습니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 920 }}>
      <section
        aria-labelledby="light-overline-heading"
        style={{
          display: 'grid',
          gap: 'var(--space-4)',
          padding: 'var(--space-5)',
          border: '1px solid var(--color-semantic-line-normal-alternative)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-normal-normal)',
        }}
      >
        <h2 id="light-overline-heading" style={headingStyle}>밝은 표면</h2>
        <div style={specimenGridStyle}>
          <Overline tone="muted">MUTED</Overline>
          <Overline tone="signal">SIGNAL</Overline>
          <Overline tone="ink">INK</Overline>
        </div>
      </section>

      <section
        aria-labelledby="dark-overline-heading"
        style={{
          display: 'grid',
          gap: 'var(--space-4)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-inverse-background)',
        }}
      >
        <h2
          id="dark-overline-heading"
          style={{ ...headingStyle, color: 'var(--color-semantic-static-white)' }}
        >
          어두운 표면
        </h2>
        <div style={specimenGridStyle}>
          <Overline onDark tone="muted">MUTED</Overline>
          <Overline onDark tone="signal" data-testid="inverse-signal-overline">SIGNAL</Overline>
          <Overline onDark tone="ink">INK</Overline>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const overline = canvasElement.querySelector('[data-testid="inverse-signal-overline"]');
    const surface = overline?.closest('section');
    if (!overline || !surface) throw new Error('어두운 표면의 signal Overline 예제가 렌더되어야 합니다.');

    const parseRgb = (value) => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = (value) => {
      const [red, green, blue] = parseRgb(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const win = canvasElement.ownerDocument.defaultView;
    const foreground = luminance(win.getComputedStyle(overline).color);
    const background = luminance(win.getComputedStyle(surface).backgroundColor);
    const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    if (ratio < 4.5) {
      throw new Error(`어두운 표면의 signal Overline 대비가 WCAG AA 4.5:1보다 낮습니다: ${ratio.toFixed(2)}:1.`);
    }
  },
};

export const NarrowLongCopy = {
  name: '반응형 · 긴 문구와 좁은 폭',
  parameters: storyDescription(
    '320px 폭에서 번역으로 길어진 화면 맥락과 실제 제목이 줄바꿈되는 상황입니다. 긴 문맥은 문장형 아이브로우로 유지하고 Overline은 짧은 범주로 제한해 가로 스크롤 없이 읽히는지 확인하세요.',
  ),
  render: () => (
    <main
      data-testid="overline-narrow"
      style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(320px, 100%)', minWidth: 0 }}
    >
      <PageHeader
        headingLevel={2}
        eyebrow="대전 연구소 자율주행 로봇 운영 센터"
        title="층별 장비 운영 및 점검 현황"
        description="번역되거나 문맥이 길어져도 원래 표기와 제목 위계를 유지합니다."
      />
      <section style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
        <Overline tone="signal">OPERATIONS</Overline>
        <h2 style={{ ...headingStyle, overflowWrap: 'anywhere' }}>로봇 운영 가이드</h2>
        <p style={{ ...bodyStyle, overflowWrap: 'anywhere' }}>
          범주 라벨은 짧게 유지하고 상세한 의미는 제목과 본문에서 전달합니다.
        </p>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="overline-narrow"]');
    if (!fixture) throw new Error('좁은 폭 아이브로우 예제가 렌더되어야 합니다.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('긴 문맥과 제목은 320px 폭에서 가로 스크롤 없이 줄바꿈되어야 합니다.');
    }
  },
};
