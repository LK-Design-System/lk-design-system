import { MobileSystemBars } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Mobile System Bars',
  id: 'lds-core-components-layout-essential',
  component: MobileSystemBars,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-essential--mobile-system-bars-by-platform',
      eyebrow: 'Core / Layout / Mobile System Bars',
      title: '모바일 화면이 운영체제의 안전 영역과 시스템 바를 존중하게 합니다',
      description:
        'iOS·Android 화면 시안과 셸에서 상태 바와 하단 홈 영역을 포함한 전체 프레임을 검토할 때 적합합니다. 실제 웹 콘텐츠의 일반 여백은 Container나 Stack을 사용하고, 데스크톱 화면에 모바일 시스템 바를 장식처럼 추가하지 마세요.',
    },
    docs: {
      description: {
        component: '모바일 시스템 바(iOS·Android 상태 바와 하단 인디케이터)를 다루는 레이아웃 프리미티브입니다. 구분선은 별도 페이지에서 확인합니다.',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-xs)',
};

function PhoneMock({ platform }) {
  return (
    <div
      style={{
        width: 220,
        height: 420,
        border: '1px dashed var(--color-semantic-primary-normal)',
        borderRadius: 'var(--radius-frame-xl)',
        background: 'var(--color-semantic-background-normal-alternative)',
        overflow: 'hidden',
      }}
    >
      <MobileSystemBars platform={platform} style={{ minHeight: '100%' }} />
    </div>
  );
}

export const MobileSystemBarsByPlatform = {
  name: '개요',
  parameters: storyDescription(
    '동일한 모바일 콘텐츠 프레임을 iOS와 Android 시스템 영역에 맞춰 비교하는 상황입니다. 상단 상태 영역과 하단 인디케이터가 콘텐츠를 가리지 않고 플랫폼별 안전 영역과 배경이 자연스럽게 이어지는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', maxWidth: 1100 }}>
      <article style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>iOS 시스템 바</h2>
        <PhoneMock platform="ios" />
      </article>
      <article style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Android 시스템 바</h2>
        <PhoneMock platform="android" />
      </article>
    </main>
  ),
};
