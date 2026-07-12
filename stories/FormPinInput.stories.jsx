import {
  FormField,
  PinInput,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Pin Input',
  component: PinInput,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-pin-input--code-input',
      eyebrow: 'Product / Pin Input',
      title: 'PIN 입력은 자릿수가 정해진 일회성 코드를 빠르게 완성하게 합니다',
      description:
        '인증·장치 연결처럼 길이가 고정된 짧은 숫자 코드를 입력할 때 적합합니다. 지속적으로 보관하는 비밀번호나 토큰에는 Pin Input 대신 Password Input 또는 Secret Field를 사용하세요.',
    },
    docs: {
      description: {
        component: '인증 코드처럼 자릿수가 정해진 값을 입력하는 PinInput 제품 확장 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const CodeInput = {
  name: '개요',
  parameters: storyDescription(
    '6자리 인증 코드 중 일부가 입력된 상태입니다. 각 자릿수의 순서, 남은 입력 위치, 전체 필드의 접근 가능한 이름이 명확한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 520 }}>
      <FormField label="인증 코드" helper="6자리 코드를 입력하세요.">
        <PinInput aria-label="인증 코드" defaultValue="1205" length={6} />
      </FormField>
    </main>
  ),
};
