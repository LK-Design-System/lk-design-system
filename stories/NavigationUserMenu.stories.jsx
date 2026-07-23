import { userEvent, waitFor } from 'storybook/test';
import { UserMenu } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/User Menu',
  component: UserMenu,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-user-menu--user-menus',
      eyebrow: 'Product / User Menu',
      title: '사용자 메뉴는 계정 상태와 개인 작업의 마지막 진입점입니다',
      description:
        '사이드바 푸터에서 현재 사용자·상태·프로필·로그아웃을 묶을 때 적합합니다. 상단 전역 명령이나 제품 탐색에는 User Menu 대신 Top Bar나 Side Nav를 사용하세요.',
    },
    docs: {
      description: {
        component: 'UserMenu는 사이드바 푸터의 계정 이름·상태와 프로필·로그아웃 동작을 담는 LK Product Extension입니다. 상단 유틸리티 바의 계정 메뉴로 재사용하지 않습니다.',
      },
    },
  },
};

export default meta;

const items = [{ label: '프로필' }, { label: '설정' }, { divider: true }, { label: '로그아웃', danger: true }];

export const UserMenus = {
  name: '개요',
  parameters: storyDescription(
    '펼친 계정 요약과 접힌 avatar-only 표현을 함께 보여줍니다. Arrow·End·Escape 이동이 메뉴 항목 순서와 일치하고 로그아웃이 위험 작업으로 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-end', flexWrap: 'wrap', minHeight: 220, padding: 'var(--space-4)' }}>
      <div style={{ width: 240 }}>
        <UserMenu name="운영자" detail="관리자" status="online" items={items} />
      </div>
      <UserMenu name="운영자" detail="관리자" status="online" collapsed items={items} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = canvasElement.querySelector('button[aria-haspopup="menu"]');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '프로필') throw new Error('UserMenu must focus its first item.');
    });
    const menu = canvasElement.querySelector('[role="menu"]');
    if (!menu || menu.getAttribute('aria-labelledby') !== trigger.id) {
      throw new Error('UserMenu must label its menu from the trigger.');
    }
    await userEvent.keyboard('{End}');
    if (ownerDocument.activeElement?.textContent?.trim() !== '로그아웃') throw new Error('End must focus the last menu item.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="menu"]')) throw new Error('UserMenu must close on Escape.');
      if (ownerDocument.activeElement !== trigger) throw new Error('UserMenu must restore focus to its trigger.');
    });

    const collapsedTrigger = canvasElement.querySelectorAll('button[aria-haspopup="menu"]')[1];
    if (!collapsedTrigger || collapsedTrigger.getAttribute('title') !== '운영자') {
      throw new Error('The collapsed UserMenu must keep an avatar-only trigger named by its name tooltip.');
    }
    collapsedTrigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (collapsedTrigger.getAttribute('aria-expanded') !== 'true') throw new Error('The collapsed trigger must open its menu with the keyboard.');
      if (ownerDocument.activeElement?.textContent?.trim() !== '프로필') throw new Error('The collapsed UserMenu must focus its first item on keyboard open.');
    });
    /* 문서가 OS 포커스를 갖지 않은 환경에서는 focus()가 focus 이벤트를 내지 않으므로 직접 전달한다. */
    ownerDocument.activeElement.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await waitFor(() => {
      if (!ownerDocument.activeElement.style.background.includes('--component-menu-item-hover-bg')) {
        throw new Error('Keyboard focus must apply the same item highlight as hover.');
      }
    });
    await userEvent.tab();
    await waitFor(() => {
      if (canvasElement.querySelector('[role="menu"]')) throw new Error('Tab must close the UserMenu per the documented contract.');
      if (collapsedTrigger.getAttribute('aria-expanded') !== 'false') throw new Error('Tab must reset the collapsed trigger disclosure state.');
    });
  },
};
