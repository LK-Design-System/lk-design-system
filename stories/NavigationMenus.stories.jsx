import { Menubar } from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/8 Presentation/Menu',
  parameters: {
    docs: {
      description: {
        component: '상단 명령 묶음을 메뉴 구조로 노출하는 Menubar 패턴입니다.',
      },
    },
  },
};

export default meta;

export const MenuPatterns = {
  name: '메뉴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <Menubar
        menus={[
          { label: '파일', items: [{ label: '새 문서' }, { label: '내보내기', shortcut: 'CMD E' }] },
          { label: '보기', items: [{ label: '목록' }, { label: '미리보기' }] },
          { label: '도구', items: [{ label: '접근성 검사' }, { label: '로그 다운로드' }] },
        ]}
      />
    </main>
  ),
};
