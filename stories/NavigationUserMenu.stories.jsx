import { UserMenu } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Navigation/User Menu',
  parameters: {
    docs: {
      description: {
        component: '계정 이름·상태와 프로필, 로그아웃 같은 계정 액션을 담는 UserMenu 패턴입니다. 트리거를 누르면 메뉴가 위로 열립니다.',
      },
    },
  },
};

export default meta;

const items = [{ label: '프로필' }, { label: '설정' }, { divider: true }, { label: '로그아웃', danger: true }];

export const UserMenus = {
  name: '사용자 메뉴',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-end', flexWrap: 'wrap', minHeight: 220, padding: 'var(--space-4)' }}>
      <div style={{ width: 240 }}>
        <UserMenu name="운영자" detail="관리자" status="online" items={items} />
      </div>
      <UserMenu name="운영자" detail="관리자" status="online" collapsed items={items} />
    </main>
  ),
};
