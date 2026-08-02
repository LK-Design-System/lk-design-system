import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, LdsProvider, Popover, ThemeToggle, useLdsRuntime } from '../src/index.js';
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

function ProviderRuntimeProbe() {
  const { colorScheme, setColorScheme, direction } = useLdsRuntime();
  return (
    <div data-provider-runtime={`${colorScheme}:${direction}`}>
      <ThemeToggle target={null} persist={false} value={colorScheme} onChange={setColorScheme} />
      <Popover open ariaLabel="Provider portal" trigger={<Button>Portal trigger</Button>}>
        Provider portal content
      </Popover>
    </div>
  );
}

function ProviderContractFixture() {
  const [portalTarget, setPortalTarget] = React.useState(null);
  return (
    <main>
      <div ref={setPortalTarget} data-provider-portal-target />
      {portalTarget && (
        <section id="provider-contract-target">
          <LdsProvider
            target="#provider-contract-target"
            defaultColorScheme="dark"
            direction="rtl"
            persist={false}
            portalTarget={portalTarget}
          >
            <ProviderRuntimeProbe />
          </LdsProvider>
        </section>
      )}
    </main>
  );
}

export const ProviderRuntimeContract = {
  name: 'Provider runtime contract',
  tags: ['!dev'],
  render: () => <ProviderContractFixture />,
  play: async ({ canvasElement }) => {
    const target = await waitFor(() => {
      const node = canvasElement.querySelector('#provider-contract-target');
      if (!node) throw new Error('Provider target must mount.');
      return node;
    });
    await waitFor(() => {
      if (target.dataset.theme !== 'dark' || target.dir !== 'rtl') {
        throw new Error('LdsProvider must apply its color scheme and direction to the configured target.');
      }
    });
    const runtime = canvasElement.querySelector('[data-provider-runtime="dark:rtl"]');
    const darkChoice = runtime?.querySelector('[role="radio"][aria-label="Dark"]');
    const lightChoice = runtime?.querySelector('[role="radio"][aria-label="Light"]');
    if (!runtime || darkChoice?.getAttribute('aria-checked') !== 'true' || !lightChoice) {
      throw new Error('ThemeToggle must compose with the Provider runtime state.');
    }
    const portalTarget = canvasElement.querySelector('[data-provider-portal-target]');
    const initialPortal = portalTarget?.querySelector('[data-lds-overlay-portal]');
    if (!initialPortal || initialPortal.dataset.theme !== 'dark' || initialPortal.getAttribute('dir') !== 'rtl') {
      throw new Error('Provider theme, direction, and custom Portal target must reach anchored overlays.');
    }
    await userEvent.click(lightChoice);
    await waitFor(() => {
      if (target.dataset.theme !== 'light') throw new Error('Provider runtime changes must update the target theme.');
    });
    await waitFor(() => {
      const portal = portalTarget?.querySelector('[data-lds-overlay-portal]');
      if (!portal || portal.dataset.theme !== 'light' || portal.getAttribute('dir') !== 'rtl') {
        throw new Error(
          `Provider runtime updates must propagate through the custom Portal target (theme=${portal?.dataset.theme ?? 'missing'}, dir=${portal?.getAttribute('dir') ?? 'missing'}).`,
        );
      }
    });
  },
};
