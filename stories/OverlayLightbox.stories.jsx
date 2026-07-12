import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Lightbox } from '../src/index.js';
import {
  LightboxCard as LightboxCardStory,
  LightboxOpen as LightboxOpenStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Lightbox',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-lightbox--lightbox-open',
      eyebrow: 'Product / Lightbox',
      title: '사용자가 이미지와 캡처를 주변 화면의 방해 없이 크게 검토합니다',
      description:
        '사진·스크린샷 같은 미디어를 원본 맥락에서 확대해 집중 검토할 때 적합합니다. 긴 문서, 편집 폼, 확인 작업에는 Lightbox 대신 전용 페이지나 Dialog를 사용하세요.',
    },
    docs: {
      description: {
        component: '이미지나 캡처를 화면 위에 크게 띄워 검토하는 Lightbox 패턴입니다.',
      },
    },
  },
};

export default meta;

export const LightboxOpen = {
  ...LightboxOpenStory,
  name: '개요',
  parameters: {
    ...LightboxOpenStory.parameters,
    ...storyDescription(
      '미디어를 화면 위에 확대해 보는 대표 열린 상태입니다. 이미지 대체 텍스트, 닫기 액션, 배경과의 시각적 분리, viewport 안의 미디어 배치를 확인하세요.',
    ),
  },
};

function LightboxKeyboardDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Lightbox 열기</Button>
      <Lightbox open={open} images={[{ src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%233878B3"/%3E%3C/svg%3E', alt: '파란 테스트 이미지' }]} onClose={() => setOpen(false)} />
    </div>
  );
}

export const LightboxKeyboardContract = {
  name: '상호작용 · 초점 순환과 복원',
  parameters: storyDescription(
    '키보드로 Lightbox를 열고 닫는 상황입니다. 닫기 액션으로 초기 초점이 이동하고 Tab이 dialog 안에 머문 뒤 Escape에서 트리거로 복원되는지 확인하세요.',
  ),
  render: () => <LightboxKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Lightbox 열기');
    await userEvent.click(trigger);
    await waitFor(() => {
      if (ownerDocument.activeElement?.getAttribute('aria-label') !== '닫기') throw new Error('Lightbox must focus its close action.');
    });
    await userEvent.tab();
    if (ownerDocument.activeElement?.getAttribute('aria-label') !== '닫기') throw new Error('Lightbox Tab must stay inside the dialog.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('Lightbox must close on Escape.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Lightbox must restore focus to its trigger.');
    });
  },
};
export const LightboxCard = { ...LightboxCardStory, name: 'Lightbox card parity', tags: ['!dev', 'visual-parity'] };
