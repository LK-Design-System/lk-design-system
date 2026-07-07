import {
  Button,
  Toast,
  ToastStack,
} from '../src/index.js';
import {
  ToastCard as ToastCardStory,
  ToastStackCard as ToastStackCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/7 Feedback/Toast',
  parameters: {
    docs: {
      description: {
        component: '작업 결과와 짧은 상태 변화를 화면 가장자리에서 알려주는 Toast, ToastStack 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ToastNotifications = {
  name: '토스트',
  render: () => (
    <main style={{ position: 'relative', minHeight: 180, width: '100%', maxWidth: 760 }}>
      <ToastStack position="bottom-right">
        <Toast tone="success" action={<Button size="sm" variant="on-dark">실행 취소</Button>}>
          변경 사항이 저장되었습니다.
        </Toast>
        <Toast tone="info" onClose={() => {}}>대시보드로 이동했습니다.</Toast>
      </ToastStack>
    </main>
  ),
};

export const ToastCard = { ...ToastCardStory, name: 'Toast card parity', tags: ['!dev', 'visual-parity'] };
export const ToastStackCard = { ...ToastStackCardStory, name: 'ToastStack card parity', tags: ['!dev', 'visual-parity'] };
