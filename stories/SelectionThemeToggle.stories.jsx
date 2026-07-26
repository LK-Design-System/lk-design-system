import { ThemeToggle } from '../src/index.js';
import { ThemeToggleCard as ThemeToggleCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Theme/Controls/Theme Toggle',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-theme-controls-theme-toggle--theme-toggle-pattern',
      eyebrow: 'Theme / Controls',
      title: 'Theme Toggle은 사용자가 밝은 테마와 어두운 테마를 직접 선택하게 합니다',
      description:
        '사용자에게 명시적인 appearance 선택권을 제공하는 설정 표면에 적합합니다. 단순 장식 전환이나 일시적인 상태 표시에는 사용하지 않으며, 테마 변경 뒤에도 레이블·포커스·선택 상태가 분명해야 합니다.',
    },
    docs: {
      description: {
        component: '라이트, 다크 같은 시각 테마를 전환하는 ThemeToggle 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ThemeTogglePattern = {
  name: '개요',
  parameters: storyDescription(
    '레이블이 있는 기본 크기와 아이콘 중심의 작은 Theme Toggle을 비교합니다. 좁은 표면이라도 선택 상태와 접근 가능한 이름이 유지되는지, 테마 적용 대상과 저장 정책이 제품 계약에 맞는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
      <ThemeToggle target={null} persist={false} defaultValue="light" />
      <ThemeToggle target={null} persist={false} defaultValue="dark" showLabels={false} size="sm" />
    </main>
  ),
};

export const ThemeToggleCard = { ...ThemeToggleCardStory, name: 'ThemeToggle card parity', tags: ['!dev', 'visual-parity'] };
