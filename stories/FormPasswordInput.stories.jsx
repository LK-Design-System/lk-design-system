import { userEvent } from 'storybook/test';
import { PasswordInput } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Password Input',
  component: PasswordInput,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-password-input--password-input-overview',
      eyebrow: 'Product / Password Input',
      title: '비밀번호 입력은 민감한 값을 기본적으로 가리고 필요할 때만 확인하게 합니다',
      description:
        '사용자가 직접 비밀번호를 작성하는 로그인과 계정 설정에 사용하세요. 이미 발급된 비밀값을 읽거나 복사하는 화면은 Secret Field가 더 적합합니다.',
    },
  },
};

export default meta;

export const PasswordInputOverview = {
  name: '개요',
  parameters: storyDescription(
    '라벨과 설명은 입력 목적을 알리고, 보기 버튼은 현재 필드와 다음 행동을 함께 읽습니다.',
  ),
  render: () => (
    <main style={{ maxWidth: 520 }}>
      <PasswordInput label="비밀번호" helper="8자 이상으로 입력하세요." defaultValue="design-system" />
    </main>
  ),
};

export const PasswordInputStates = {
  name: '상태와 좁은 너비',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 280, maxWidth: '100%' }}>
      <PasswordInput label="오류" defaultValue="short" error="비밀번호 길이를 확인하세요." />
      <PasswordInput label="완료" defaultValue="valid-password" status="positive" helper="사용할 수 있는 비밀번호입니다." />
      <PasswordInput label="읽기 전용" defaultValue="readonly" readOnly />
      <PasswordInput label="비활성" defaultValue="disabled" disabled />
    </main>
  ),
};

export const PasswordRevealContract = {
  name: '보기 버튼 계약',
  tags: ['!dev'],
  render: () => <PasswordInput label="계정 비밀번호" defaultValue="secret-value" />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    const button = canvasElement.querySelector('button[aria-label="계정 비밀번호 보기"]');
    if (!input || !button || input.type !== 'password') throw new Error('The masked field and contextual reveal action are required.');
    await userEvent.click(button);
    if (input.type !== 'text' || !canvasElement.querySelector('button[aria-label="계정 비밀번호 숨기기"]')) {
      throw new Error('The reveal action must expose the value and rename itself to the next action.');
    }
  },
};
