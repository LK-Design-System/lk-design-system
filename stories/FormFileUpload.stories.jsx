import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { FileUpload } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/File Upload',
  tags: ['autodocs'],
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

function ButtonSelectionFixture() {
  const [names, setNames] = React.useState('');
  const [rejected, setRejected] = React.useState('');
  return <div data-button-upload data-selected={names} data-rejected={rejected} style={{ width: '100%', maxWidth: 320, minWidth: 0, boxSizing: 'border-box', display: 'grid', gap: 'var(--space-3)' }}>
    <FileUpload presentation="button" size="sm" multiple accept=".pdf" inputAriaDescribedBy="button-file-hint"
      onFiles={(files) => setNames(files.map((file) => file.name).join(','))}
      onRejectedFiles={(files) => setRejected(files.map((file) => file.name).join(','))} />
    <p id="button-file-hint" style={{ margin: 0, fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)' }}>PDF 파일을 선택할 수 있습니다.</p>
    <FileUpload presentation="button" size="sm" hint="사용할 수 없는 파일 선택" disabled />
  </div>;
}

export const ButtonSelection = {
  name: '변형·상태 · 간단한 파일 선택 버튼',
  parameters: storyDescription('presentation=button은 native picker, 형식 제한, 거부 알림과 disabled 계약을 유지하면서 LDS 버튼 표면으로 높이를 줄입니다. 선택된 파일의 업로드·준비 상태는 제품이 별도 목록으로 제공합니다.'),
  render: () => <ButtonSelectionFixture />,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-button-upload]');
    const inputs = host.querySelectorAll('input[type="file"]');
    const input = inputs[0];
    const label = host.querySelector(`label[for="${input.id}"]`);
    if (!label || !label.textContent.includes('파일 선택') || label.querySelector('button') || label.hasAttribute('tabindex')) throw new Error('기존 Button label과 native input의 한 개 Tab 진입점을 사용합니다.');
    if (input.getAttribute('aria-describedby') !== 'button-file-hint') throw new Error('파일 형식 안내는 실제 input에 연결합니다.');
    input.focus();
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== input || !input.parentElement.hasAttribute('data-focus-visible')) throw new Error('native input의 focus가 짧은 표면에도 표시됩니다.');
    });
    const FileClass = canvasElement.ownerDocument.defaultView.File;
    await userEvent.upload(input, [new FileClass(['pdf'], 'notes.pdf', { type: 'application/pdf' }), new FileClass(['txt'], 'notes.txt', { type: 'text/plain' })], { applyAccept: false });
    if (host.dataset.selected !== 'notes.pdf' || host.dataset.rejected !== 'notes.txt') throw new Error('button 표면도 accept와 rejected callback을 적용합니다.');
    const status = input.parentElement.querySelector('[role="status"]');
    if (!status.textContent.includes('notes.pdf, 선택됨') || !status.textContent.includes('notes.txt, 허용되지 않는 파일이라 제외됨')) throw new Error('허용·거부 결과는 기존 polite status로 읽힙니다.');
    if (input.value !== '' || !inputs[1].disabled || host.scrollWidth > host.clientWidth + 1) throw new Error('재선택·disabled·320px 너비 계약을 유지합니다.');
  },
};
