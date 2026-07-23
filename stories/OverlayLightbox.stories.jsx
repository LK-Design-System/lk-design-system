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
const swatch = (fill) => `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%23${fill}"/%3E%3C/svg%3E`;

const galleryImages = [
  { src: swatch('3878B3'), alt: '점검 전 파란 캡처' },
  { src: swatch('2E8B6B'), alt: '점검 중 초록 캡처' },
  { src: swatch('B3722E'), alt: '점검 후 주황 캡처' },
];

function LightboxNavigationDemo() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <div style={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>이미지 갤러리 열기</Button>
      <Lightbox
        open={open}
        images={galleryImages}
        index={index}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </div>
  );
}

const waitUntilLoaded = (dialog) => waitFor(() => {
  if (dialog.getAttribute('aria-busy') === 'true') throw new Error('Lightbox는 이미지 디코딩이 끝나면 aria-busy를 내려야 합니다.');
});

export const LightboxSlideAnnouncementContract = {
  name: '슬라이드 알림과 이동 컨트롤 계약',
  tags: ['!dev'],
  render: () => <LightboxNavigationDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '이미지 갤러리 열기');
    if (!trigger) throw new Error('Lightbox 탐색 계약 스토리에는 트리거가 필요합니다.');
    await userEvent.click(trigger);
    const dialog = await waitFor(() => {
      const current = canvasElement.querySelector('[role="dialog"]');
      if (!current) throw new Error('Lightbox must open from its trigger.');
      return current;
    });

    const live = dialog.querySelector('[data-lightbox-live]');
    const position = dialog.querySelector('[data-lightbox-position]');
    const previous = dialog.querySelector('[data-lightbox-previous]');
    const next = dialog.querySelector('[data-lightbox-next]');
    if (!live || !position || !previous || !next) {
      throw new Error('여러 장 Lightbox는 live region, 위치 표시, 이전/다음 컨트롤을 모두 제공해야 합니다.');
    }
    if (live.getAttribute('role') !== 'status' || live.getAttribute('aria-live') !== 'polite') {
      throw new Error('슬라이드 변경은 polite status region으로 알려야 합니다.');
    }
    if (previous.getAttribute('aria-label') !== '이전 이미지' || next.getAttribute('aria-label') !== '다음 이미지') {
      throw new Error('이동 컨트롤의 접근 이름은 한국어 기본값이어야 합니다.');
    }
    if (position.getAttribute('aria-hidden') !== 'true') {
      throw new Error('보이는 위치 표시는 live region과 중복되지 않도록 장식이어야 합니다.');
    }
    await waitUntilLoaded(dialog);
    if (!live.textContent?.includes('1 / 3')) throw new Error('Lightbox는 현재 슬라이드 위치를 알려야 합니다.');

    /* 이동 직후 로딩 구간에도 컨트롤은 마운트를 유지해야 한다. 초점을 가진
       버튼이 사라지면 초점이 <body>로 떨어진다(WCAG 2.4.3). */
    next.focus();
    await userEvent.click(next);
    await waitFor(() => {
      if (!live.textContent?.includes('2 / 3')) throw new Error('슬라이드가 바뀌면 위치 알림이 갱신되어야 합니다.');
    });
    if (!dialog.contains(next) || ownerDocument.activeElement !== next) {
      throw new Error('이미지 로딩 중에도 이동 컨트롤은 유지되고 초점을 잃지 않아야 합니다.');
    }
    if (!position.textContent?.includes('2 / 3')) throw new Error('보이는 위치 표시도 함께 갱신되어야 합니다.');
    if (dialog.querySelector('img')?.getAttribute('alt') !== '점검 중 초록 캡처') {
      throw new Error('이동한 슬라이드의 대체 텍스트가 이미지와 함께 바뀌어야 합니다.');
    }

    await waitUntilLoaded(dialog);
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      if (!live.textContent?.includes('1 / 3')) throw new Error('Arrow 키 이동도 같은 알림 경로를 사용해야 합니다.');
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('Lightbox must close on Escape.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Lightbox must restore focus to its trigger.');
    });
    trigger.blur();
  },
};

export const LightboxCard = { ...LightboxCardStory, name: 'Lightbox card parity', tags: ['!dev', 'visual-parity'] };
