import {
  LightboxCard as LightboxCardStory,
  LightboxOpen as LightboxOpenStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LK Product Extension/Overlay/Lightbox',
  parameters: {
    docs: {
      description: {
        component: '이미지나 캡처를 화면 위에 크게 띄워 검토하는 Lightbox 패턴입니다.',
      },
    },
  },
};

export default meta;

export const LightboxOpen = { ...LightboxOpenStory, name: 'Lightbox 열림' };
export const LightboxCard = { ...LightboxCardStory, name: 'Lightbox card parity', tags: ['!dev', 'visual-parity'] };

