import React from 'react';
import { userEvent, waitFor, within } from 'storybook/test';
import {
  LanguageSwitcher,
  ThemeToggle,
  TopBar,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const locales = [
  { value: 'ko', label: '한국어', lang: 'ko' },
  { value: 'en', label: 'English', lang: 'en' },
];

const adaptiveLocales = [
  ...locales,
  { value: 'pt-BR', label: 'Português (Brasil)', lang: 'pt-BR' },
];

function LanguageSwitcherDemo({
  initialValue = 'ko',
  localeOptions = locales,
  onDark = false,
  disabled = false,
  testId,
}) {
  const [locale, setLocale] = React.useState(initialValue);

  return (
    <div data-testid={testId} style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
      <LanguageSwitcher
        locales={localeOptions}
        value={locale}
        onChange={setLocale}
        ariaLabel={locale === 'ko' ? '언어 선택' : 'Choose language'}
        onDark={onDark}
        disabled={disabled}
      />
      <output
        data-locale-output=""
        style={{
          color: onDark
            ? 'var(--color-semantic-inverse-label-neutral-soft)'
            : 'var(--color-semantic-label-alternative)',
          fontSize: 'var(--caption1-size)',
        }}
      >
        locale: {locale}
      </output>
    </div>
  );
}

function TopBarLanguageExample({ width, dark = false }) {
  const [locale, setLocale] = React.useState('ko');

  return (
    <div style={{ width, maxWidth: '100%' }}>
      <TopBar
        dark={dark}
        brand={<strong style={{ whiteSpace: 'nowrap' }}>LDS Console</strong>}
        actions={(
          <>
            <LanguageSwitcher
              locales={locales}
              value={locale}
              onChange={setLocale}
              ariaLabel={locale === 'ko' ? '언어 선택' : 'Choose language'}
              onDark={dark}
            />
            {!dark && (
              <ThemeToggle
                value="light"
                onChange={() => {}}
                target={null}
                persist={false}
                showLabels={false}
                size="sm"
              />
            )}
          </>
        )}
      />
    </div>
  );
}

const meta = {
  title: 'LDS Product/Navigation/Language Switcher',
  tags: ['autodocs'],
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
    storyGuide: {
      storyId: 'lds-product-navigation-language-switcher--overview',
      eyebrow: 'Product / Navigation',
      title: 'Language Switcher는 제품 전체 언어를 바꾸는 전역 utility입니다',
      description:
        '제품 전체 UI를 두 개 이상 언어로 제공할 때 적합합니다. 조밀한 TopBar에서는 지구본 아이콘으로 진입하고 menu에서 native name과 현재 선택 상태를 확인합니다. 일부 콘텐츠만 번역하거나 실제 번역 리소스가 없는 제품에는 사용하지 않으며, 번역·URL·저장과 문서 lang 갱신은 제품이 처리합니다.',
    },
    docs: {
      description: {
        component:
          'LanguageSwitcher는 기존 아이콘 버튼과 드롭다운 메뉴를 조합한 controlled 언어 선택 utility입니다. 지구본 trigger에는 번역된 접근 가능한 이름을 제공하고, 국기나 국가 코드를 쓰지 않으며 각 언어 이름에 lang을 부여합니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '36px 지구본 trigger와 native-name 단일 선택 menu를 확인합니다. 현재 언어는 체크로 표시하고, 선택 뒤 앱 소유 locale state가 갱신되며 focus가 trigger로 돌아와야 합니다.',
  ),
  render: () => <LanguageSwitcherDemo testId="language-switcher-contract" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const demo = canvas.getByTestId('language-switcher-contract');
    const trigger = within(demo).getByRole('button', { name: '언어 선택' });
    const triggerRect = trigger.getBoundingClientRect();
    if (trigger.textContent?.trim()) {
      throw new Error('Compact LanguageSwitcher trigger must remain icon-only.');
    }
    if (
      !trigger.querySelector('[data-language-switcher-icon]')
      || Math.round(triggerRect.width) !== 36
      || Math.round(triggerRect.height) !== 36
    ) {
      throw new Error('LanguageSwitcher must use the 36px globe IconButton trigger.');
    }

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    const menu = await within(demo).findByRole('menu');
    const options = within(menu).getAllByRole('menuitemradio');
    if (options.length !== 2) throw new Error('LanguageSwitcher must render one radio item per locale.');
    if (options[0].getAttribute('aria-checked') !== 'true' || options[1].getAttribute('aria-checked') !== 'false') {
      throw new Error('LanguageSwitcher must expose the controlled locale through aria-checked.');
    }
    const koreanLabel = options[0].querySelector('[lang="ko"]');
    const englishLabel = options[1].querySelector('[lang="en"]');
    if (!koreanLabel || !englishLabel) {
      throw new Error('Every language name must expose its own language metadata.');
    }
    if (
      !options[0].querySelector('[data-language-switcher-check]')
      || options[1].querySelector('[data-language-switcher-check]')
    ) {
      throw new Error('Only the controlled locale must expose the visible check indicator.');
    }
    const indicatorSlots = options.map((option) => option.querySelector('[data-language-switcher-indicator]'));
    const selectedIndicatorRect = indicatorSlots[0]?.getBoundingClientRect();
    const firstOptionRect = options[0].getBoundingClientRect();
    if (
      indicatorSlots.some((indicator) => !indicator)
      || !selectedIndicatorRect
      || Math.round(firstOptionRect.right - selectedIndicatorRect.right) !== 16
    ) {
      throw new Error('LanguageSwitcher must reserve a stable inline-end check slot.');
    }
    const panel = menu.parentElement;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const optionStyle = getComputedStyle(options[0]);
    const panelRect = panel?.getBoundingClientRect();
    const minimumPanelWidth = panelStyle ? Number.parseFloat(panelStyle.minWidth) : Number.NaN;
    if (
      !panelStyle
      || !panelRect
      || panelStyle.paddingBlockStart !== '8px'
      || panelStyle.paddingInlineStart !== '8px'
      || panelStyle.borderRadius !== '12px'
      || Math.round(panelRect.width) !== Math.round(minimumPanelWidth)
      || Math.round(options[0].getBoundingClientRect().height) !== 40
      || optionStyle.paddingBlockStart !== '10px'
      || optionStyle.paddingInlineStart !== '16px'
      || optionStyle.borderRadius !== '10px'
    ) {
      throw new Error('LanguageSwitcher menu spacing must match the TopBar menu contract.');
    }

    await userEvent.click(options[1]);
    await waitFor(() => {
      if (within(demo).getByText('locale: en').textContent !== 'locale: en') {
        throw new Error('LanguageSwitcher must report the selected locale value.');
      }
      if (demo.querySelector('[role="menu"]')) {
        throw new Error('Selecting a locale must close the menu.');
      }
      if (canvasElement.ownerDocument.activeElement !== trigger) {
        throw new Error('Selecting a locale must restore focus to the trigger.');
      }
    });

    const updatedTrigger = within(demo).getByRole('button', { name: 'Choose language' });
    if (!updatedTrigger.querySelector('[data-language-switcher-icon]') || updatedTrigger.textContent?.trim()) {
      throw new Error('Changing locale must preserve the icon-only globe trigger.');
    }
  },
};

export const AdaptiveWidth = {
  name: '시나리오 · 적응형 폭',
  parameters: storyDescription(
    '짧은 언어명에서는 TopBar 최소 폭을 유지하고, 긴 native name이 추가되면 viewport 상한 안에서 필요한 만큼만 확장합니다.',
  ),
  render: () => (
    <LanguageSwitcherDemo
      localeOptions={adaptiveLocales}
      testId="language-switcher-adaptive-width"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const demo = canvas.getByTestId('language-switcher-adaptive-width');
    const trigger = within(demo).getByRole('button', { name: '언어 선택' });

    await userEvent.click(trigger);

    const menu = await within(demo).findByRole('menu');
    const panel = menu.parentElement;
    const longLabel = within(menu).getByText('Português (Brasil)');
    const longLabelCell = longLabel.parentElement;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const panelWidth = panel?.getBoundingClientRect().width ?? 0;
    const minimumPanelWidth = panelStyle ? Number.parseFloat(panelStyle.minWidth) : Number.NaN;
    if (
      !panel
      || !longLabelCell
      || !Number.isFinite(minimumPanelWidth)
      || panelWidth <= minimumPanelWidth
      || longLabelCell.scrollWidth > longLabelCell.clientWidth
      || panelWidth > canvasElement.ownerDocument.defaultView.innerWidth
    ) {
      throw new Error('LanguageSwitcher must expand for long native names without exceeding the viewport.');
    }
  },
};

export const TopBarPlacement = {
  name: '사용법 · 상단 막대 배치',
  parameters: storyDescription(
    '일반 폭에서는 Language Switcher를 TopBar 우측에서 Theme Toggle 앞에 둡니다. 360px 좁은 폭에서는 제품 셸이 action overflow 또는 설정 Drawer 이동을 결정하며 컴포넌트가 breakpoint를 추측하지 않습니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: 'min(960px, calc(100vw - 32px))' }}>
      <section aria-label="일반 폭 TopBar" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>
          일반 폭 · light
        </span>
        <TopBarLanguageExample width="100%" />
      </section>
      <section data-narrow="" aria-label="좁은 폭 TopBar" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>
          360px · dark
        </span>
        <TopBarLanguageExample width={360} dark />
      </section>
    </main>
  ),
};

export const Disabled = {
  name: '변형·상태 · 비활성',
  parameters: storyDescription(
    '언어 변경이 제품 정책이나 번역 readiness 때문에 불가능한 상태입니다. trigger는 native disabled이고 menu를 열지 않습니다.',
  ),
  render: () => <LanguageSwitcherDemo disabled testId="language-switcher-disabled" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: '언어 선택' });
    if (!trigger.disabled) throw new Error('Disabled LanguageSwitcher must use a native disabled trigger.');
    await userEvent.click(trigger);
    if (canvasElement.querySelector('[role="menu"]')) {
      throw new Error('Disabled LanguageSwitcher must not open a menu.');
    }
  },
};

export const LanguageSwitcherCard = {
  name: 'LanguageSwitcher card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div
      data-visual-crop-root
      style={{
        width: 320,
        height: 96,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <LanguageSwitcher
        locales={locales}
        value="ko"
        onChange={() => {}}
      />
    </div>
  ),
};
