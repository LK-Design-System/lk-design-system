import { StatusBadge } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Status Badge',
  component: StatusBadge,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-status-badge--status-tones',
      eyebrow: 'Core / Status',
      title: 'Status Badge는 대상의 현재 상태를 점과 짧은 라벨로 즉시 구분합니다',
      description:
        '장치·서비스·작업의 가동, 점검, 오류, 오프라인처럼 현재 상태가 정해진 어휘로 반복 표시될 때 적합합니다. 단순 분류나 임의 키워드에는 Tag를, 변화의 원인과 다음 행동까지 설명해야 하면 Banner나 Notification을 사용하고 색상만으로 상태를 전달하지 마세요.',
    },
    docs: {
      description: {
        component: '가용성 점과 라벨로 상태를 표시하는 StatusBadge 패턴입니다. pulse는 실시간 감지 신호를, critical 톤은 자동으로 펄스가 도는 안전 예외 상태를 나타냅니다.',
      },
    },
  },
};

export default meta;

export const StatusTones = {
  name: '개요',
  parameters: storyDescription(
    '가동중·점검중·오류·오프라인·검토 상태를 의미별 tone으로 비교합니다. 점 색상과 텍스트가 함께 상태를 전달하고 서로 다른 배경에서도 라벨 대비와 간격이 일관적인지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', maxWidth: 760 }}>
      <StatusBadge tone="positive">가동중</StatusBadge>
      <StatusBadge tone="cautionary">점검중</StatusBadge>
      <StatusBadge tone="negative">오류</StatusBadge>
      <StatusBadge tone="offline">오프라인</StatusBadge>
      <StatusBadge tone="signal">검토</StatusBadge>
    </main>
  ),
};

export const LiveAndCritical = {
  name: '사용법 · 실시간과 긴급 상태',
  parameters: storyDescription(
    '실시간 연결의 명시적 pulse와 비상 정지의 critical 자동 pulse를 비교합니다. 움직임이 실제 감지·안전 예외에만 제한되고 라벨만 읽어도 두 상태의 의미와 긴급도가 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', maxWidth: 760 }}>
      <StatusBadge tone="online" pulse>실시간 연결</StatusBadge>
      <StatusBadge tone="critical">비상 정지</StatusBadge>
    </main>
  ),
};
