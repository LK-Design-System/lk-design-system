import { userEvent, waitFor } from 'storybook/test';
import { SocialButton } from '../src/index.js';
import { SocialLoginControls as SocialLoginControlsStory } from './ButtonsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Social Login',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-social-login--social-login-controls',
      eyebrow: 'Product / Social Login',
      title: '사용자가 익숙한 계정 제공자를 알아보고 인증을 시작합니다',
      description:
        '외부 계정으로 가입·로그인하는 인증 진입점을 제공할 때 적합합니다. 일반적인 제품 작업이나 자체 계정 입력에는 브랜드 버튼 대신 Button 또는 전용 로그인 폼을 사용하세요.',
    },
    docs: {
      description: {
        component: '브랜드 로그인 버튼처럼 인증 진입에 쓰는 버튼 패턴을 분리해 확인합니다.',
      },
    },
  },
};

export default meta;

export const SocialLoginControls = {
  ...SocialLoginControlsStory,
  name: '개요',
  parameters: {
    ...SocialLoginControlsStory.parameters,
    ...storyDescription(
      '여러 외부 계정 제공자를 인증 진입점으로 제시하는 상황입니다. 브랜드 식별이 분명하고 제공자별 버튼 위계와 라벨이 일관적인지 확인하세요.',
    ),
  },
};

export const SocialLoginNameContract = {
  name: '소셜 로그인 이름과 비활성 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start', maxWidth: 460 }}>
      <SocialButton data-contract="labelled" provider="google" full />
      <SocialButton data-contract="icon-only" provider="google" iconOnly />
      <SocialButton
        data-contract="disabled-link"
        as="a"
        href="#social-login-contract"
        disabled
        onClick={(event) => { event.currentTarget.dataset.activated = 'true'; }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const labelled = canvasElement.querySelector('[data-contract="labelled"]');
    const iconOnly = canvasElement.querySelector('[data-contract="icon-only"]');
    const disabledLink = canvasElement.querySelector('[data-contract="disabled-link"]');
    if (!labelled || !iconOnly || !disabledLink) throw new Error('SocialButton contract targets are required.');

    // 마크는 장식이어야 합니다. 정보성이면 "google logo Google로 계속하기"처럼
    // 이름이 두 번 낭독됩니다.
    for (const [name, host] of [['텍스트', labelled], ['아이콘', iconOnly], ['링크', disabledLink]]) {
      const mark = host.querySelector('svg');
      if (!mark) throw new Error(`${name} 소셜 버튼에 브랜드 마크가 없습니다.`);
      if (mark.getAttribute('aria-hidden') !== 'true' || mark.hasAttribute('aria-label') || mark.getAttribute('role') === 'img') {
        throw new Error(`${name} 소셜 버튼의 브랜드 마크는 장식이어야 합니다.`);
      }
    }

    if (labelled.textContent.replace(/\s+/g, ' ').trim() !== 'Google로 계속하기') {
      throw new Error('텍스트 소셜 버튼의 이름은 가시 라벨 하나여야 합니다.');
    }
    if (labelled.hasAttribute('aria-label')) throw new Error('가시 라벨이 있는 버튼에 aria-label을 겹치지 않습니다.');
    if (iconOnly.getAttribute('aria-label') !== 'Google로 계속하기') {
      throw new Error('아이콘 전용 소셜 버튼은 같은 문구를 aria-label로 가져야 합니다.');
    }

    // as="a"에는 native disabled가 없으므로 aria-disabled + 활성화 차단이어야 합니다.
    if (disabledLink.getAttribute('aria-disabled') !== 'true') {
      throw new Error('비버튼 렌더의 비활성 상태는 aria-disabled로 전달되어야 합니다.');
    }
    await userEvent.click(disabledLink);
    await waitFor(() => {
      if (disabledLink.dataset.activated === 'true') throw new Error('비활성 소셜 링크는 활성화되지 않아야 합니다.');
    });
    disabledLink.blur();
  },
};
