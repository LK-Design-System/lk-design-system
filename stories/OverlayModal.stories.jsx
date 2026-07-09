import {
  ModalCard as ModalCardStory,
  ModalOpen as ModalOpenStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Modal',
  parameters: {
    docs: {
      description: {
        component: '현재 흐름 위에 상세 작업이나 확인 영역을 띄우는 Modal 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ModalOpen = { ...ModalOpenStory, name: 'Modal 열림' };
export const ModalCard = { ...ModalCardStory, name: 'Modal card parity', tags: ['!dev', 'visual-parity'] };

