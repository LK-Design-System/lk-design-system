import { userEvent } from 'storybook/test';
import { FileUpload } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/File Upload',
  component: FileUpload,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-file-upload--keyboard-file-selection',
      eyebrow: 'Product / File Upload',
      title: '파일 업로드는 native 파일 선택과 드롭 진입점을 하나의 입력으로 제공합니다',
      description:
        '사용자가 로컬 파일 하나 이상을 선택해 업로드 흐름을 시작할 때 적합합니다. 선택 이후의 progress·retry·부분 실패를 관리해야 하면 File Upload Queue와 조합하세요.',
    },
    docs: {
      description: {
        component:
          'native file input을 접근성 트리에 유지하면서 버튼·drag-and-drop 표면으로 파일 선택을 시작하는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

export const KeyboardFileSelection = {
  name: '개요',
  parameters: storyDescription(
    '문서 선택 안내가 있는 기본 File Upload에서 키보드로 native file input에 도달합니다. 시각 표면 뒤에서도 실제 input이 접근성 트리와 tab 순서에 남는지 확인하세요.',
  ),
  render: () => <FileUpload hint="문서를 선택하세요" />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="file"]');
    if (!input) throw new Error('FileUpload must preserve a native file input.');
    if (getComputedStyle(input).display === 'none') throw new Error('The native file input must remain in the accessibility tree.');
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== input) throw new Error('The native file input must be keyboard focusable.');
  },
};
