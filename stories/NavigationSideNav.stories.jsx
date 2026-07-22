import React from 'react';
import { userEvent } from 'storybook/test';
import { Button, Icon, Lockup, SideNav, UserMenu } from '../src/index.js';
import { SideNavUserMenuCard as SideNavUserMenuCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const navigationItems = [
  { heading: '운영' },
  { value: 'overview', label: '운영 개요', icon: <Icon name="home" size={18} /> },
  {
    value: 'missions',
    label: '미션',
    icon: <Icon name="document" size={18} />,
    children: [
      { value: 'missions-live', label: '실행 중', badge: 4 },
      { value: 'missions-queued', label: '대기 작업', badge: 12 },
    ],
  },
  { value: 'robots', label: '로봇', icon: <Icon name="layers" size={18} />, badge: 3 },
  { value: 'diagnostics', label: '다중 로봇 장비 상태와 원격 점검 로그', icon: <Icon name="document" size={18} /> },
  { heading: '관리' },
  { value: 'events', label: '이벤트', icon: <Icon name="bell" size={18} />, badge: 8 },
  { value: 'settings', label: '권한 관리', icon: <Icon name="setting" size={18} />, disabled: true },
];

const accountItems = [
  { label: '프로필' },
  { label: '설정' },
  { divider: true },
  { label: '로그아웃', danger: true },
];

const meta = {
  title: 'LDS Product/Navigation/Side Nav',
  component: SideNav,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          placeItems: 'start center',
          width: '100%',
          minHeight: 620,
          padding: 'var(--space-6)',
          boxSizing: 'border-box',
          background: 'var(--color-semantic-background-normal-normal)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-navigation-side-nav--link-destinations',
      eyebrow: 'Product / Side Nav',
      title: '사이드 내비게이션은 제품의 계층과 지속적인 목적지를 소유합니다',
      description:
        '데스크톱 제품에서 그룹·하위 항목·배지·계정 진입점을 계속 노출할 때 적합합니다. 3~5개의 평면 목적지만 필요하면 Adaptive Navigation을, 페이지 안 이동이면 Anchor를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'SideNav는 WDS 대응이 없는 LK Product Extension입니다. 데스크톱 제품 셸의 계층·그룹·배지·계정 푸터와 오버레이 레일을 담당하며, 고정 아이콘 레일과 모바일 하단 내비게이션은 별도 Product Navigation 패턴으로 구분합니다.',
      },
    },
  },
};

export default meta;

/* 폭 전환은 peek 지연 160ms + width transition 200ms를 거치지만, 병렬 검증의
   CPU 경합에서는 타이머가 크게 밀릴 수 있어 넉넉하게 기다린다. */
async function waitForWidth(element, expectedWidth, timeoutMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (Math.abs(element.getBoundingClientRect().width - expectedWidth) < 1) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for the SideNav width to become ${expectedWidth}px.`);
}

function collapseControlContract(nav) {
  const control = nav?.querySelector('button[data-sidenav-collapse-toggle]');
  const panelId = control?.getAttribute('aria-controls');
  const panel = panelId ? canvasDocument(nav).getElementById(panelId) : null;
  if (!nav || !control || !panel) {
    throw new Error('A persistent collapsible SideNav must expose one collapse control and its controlled panel.');
  }
  const navRect = nav.getBoundingClientRect();
  const controlRect = control.getBoundingClientRect();
  const rtl = getComputedStyle(nav).direction === 'rtl';
  const inlineEndOffset = rtl
    ? controlRect.left - navRect.left
    : navRect.right - controlRect.right;
  const contained = controlRect.left >= navRect.left - 0.5
    && controlRect.right <= navRect.right + 0.5;
  return {
    control,
    panel,
    inlineEndOffset,
    contained,
    centerY: controlRect.top + (controlRect.height / 2),
    width: controlRect.width,
    height: controlRect.height,
  };
}

function canvasDocument(node) {
  return node?.ownerDocument || document;
}

/* SideNav overlay는 160/480ms 타이머로 확장·축소한다. 백그라운드 탭에서는
   Chromium이 타이머를 1초 단위로 스로틀해 단계가 뒤엉키므로(접근성 가드는
   스로틀링을 끄고 실행), 포인터 이벤트는 네이티브 mouseover/mouseout으로
   결정적으로 전달한다. */
function hoverNav(nav) {
  nav.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, relatedTarget: document.body }));
}
function unhoverNav(nav) {
  nav.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, relatedTarget: document.body }));
}

function SideNavFixture({ collapsible = false } = {}) {
  const [value, setValue] = React.useState('missions-live');
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <main
      data-testid="overlay-fixture"
      tabIndex={-1}
      style={{
        display: 'grid',
        gridTemplateColumns: '64px minmax(0, 1fr)',
        width: 420,
        maxWidth: '100%',
        minHeight: 540,
        position: 'relative',
      }}
    >
      <SideNav
        data-testid="side-nav"
        aria-label="운영 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        width={252}
        collapsedWidth={64}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        overlay
        collapsible={collapsible}
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        footer={(
          <UserMenu
            name="운영자"
            detail="로봇 관리자"
            status="online"
            collapsed={collapsed}
            items={accountItems}
          />
        )}
        style={{ height: 540 }}
      />
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          alignContent: 'start',
          gap: 'var(--space-3)',
          minWidth: 0,
          padding: 'var(--space-6)',
          color: 'var(--color-semantic-label-assistive)',
        }}
      >
        <span style={{ width: '42%', height: 12, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-normal)' }} />
        <span style={{ width: '76%', height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-normal)' }} />
        <span style={{ width: '62%', height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-normal)' }} />
      </div>
    </main>
  );
}

const linkedNavigationItems = [
  { heading: '목적지' },
  { value: 'overview', label: '운영 개요', href: '#overview', icon: <Icon name="home" size={18} />, onClick: (event) => event.preventDefault() },
  {
    value: 'missions',
    label: '미션',
    icon: <Icon name="document" size={18} />,
    children: [
      { value: 'missions-live', label: '실행 중', href: '#missions-live', onClick: (event) => event.preventDefault() },
      { value: 'missions-queued', label: '아주 긴 대기 작업 목적지와 원격 점검 상세 이름', href: '#missions-queued', onClick: (event) => event.preventDefault() },
    ],
  },
  { value: 'disabled', label: '권한 없는 목적지', href: '#disabled', icon: <Icon name="setting" size={18} />, disabled: true },
];

function SideNavLinkFixture() {
  const [value, setValue] = React.useState('overview');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <SideNav
        aria-label="링크 목적지 탐색"
        items={linkedNavigationItems}
        value={value}
        onChange={setValue}
        width={280}
        style={{ height: 420 }}
      />
      <output data-testid="sidenav-linked-value" style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>선택: {value}</output>
    </div>
  );
}

function DockedSideNavFixture({ defaultCollapsed = false, initialValue = 'overview' } = {}) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <Button
        data-testid="activate-docked-child"
        variant="secondary"
        onClick={() => setValue('missions-queued')}
      >
        하위 경로 활성화
      </Button>
      <SideNav
        data-testid="docked-side-nav"
        aria-label="고정형 운영 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        surface="docked"
        collapsible
        defaultCollapsed={defaultCollapsed}
        width={252}
        collapsedWidth={64}
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        style={{ height: 420 }}
      />
    </div>
  );
}

function ControlledCollapseFixture() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [requested, setRequested] = React.useState(null);
  const [requests, setRequests] = React.useState(0);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <Button
        data-testid="apply-controlled-collapse"
        variant="secondary"
        disabled={requested == null}
        onClick={() => {
          setCollapsed(requested);
          setRequested(null);
        }}
      >
        부모 상태 적용
      </Button>
      <output data-testid="controlled-collapse-output">
        요청 {requests}회 · 다음 {requested == null ? '없음' : String(requested)} · 현재 {String(collapsed)}
      </output>
      <SideNav
        data-testid="controlled-side-nav"
        aria-label="제어형 운영 탐색"
        items={navigationItems}
        defaultValue="overview"
        surface="docked"
        collapsible
        collapsed={collapsed}
        onCollapsedChange={(next) => {
          setRequests((count) => count + 1);
          setRequested(next);
        }}
        width={252}
        collapsedWidth={64}
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        style={{ height: 420 }}
      />
    </div>
  );
}

function CollapsedParentFixture() {
  const [value, setValue] = React.useState('overview');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <output data-testid="collapsed-parent-output">선택: {value}</output>
      <SideNav
        data-testid="collapsed-parent-side-nav"
        aria-label="접힌 계층 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        surface="docked"
        collapsible
        defaultCollapsed
        width={252}
        collapsedWidth={64}
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        style={{ height: 420 }}
      />
    </div>
  );
}

export const LinkDestinations = {
  name: '개요',
  parameters: storyDescription(
    '직접 이동하는 link, 하위 항목을 여는 disclosure, 사용할 수 없는 목적지를 함께 검증합니다. 각 항목의 의미와 키보드 도달 가능성이 DOM 역할과 일치하는지 확인하세요.',
  ),
  render: () => <SideNavLinkFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="링크 목적지 탐색"]');
    const overview = nav?.querySelector('a[href="#overview"]');
    const group = nav?.querySelector('button[aria-expanded]');
    const disabled = nav?.querySelector('a[aria-disabled="true"]');
    if (!nav || nav.dataset.surface !== 'floating' || !overview || !group || !disabled || disabled.hasAttribute('href') || disabled.tabIndex !== -1) {
      throw new Error('SideNav must preserve the floating default, render leaf destinations as anchors, groups as disclosure buttons, and disabled links as non-navigable.');
    }
    await userEvent.click(group);
    const queued = nav.querySelector('a[href="#missions-queued"]');
    const queuedLabel = Array.from(queued?.querySelectorAll('span') ?? []).find((node) => node.textContent === '아주 긴 대기 작업 목적지와 원격 점검 상세 이름');
    if (!queued || !queuedLabel || getComputedStyle(queuedLabel).textOverflow !== 'ellipsis' || queuedLabel.scrollWidth <= queuedLabel.clientWidth) {
      throw new Error('Expanded linked children must preserve the long-label truncation contract.');
    }
    queued.focus();
    await userEvent.keyboard('{Enter}');
    if (!canvasElement.querySelector('[data-testid="sidenav-linked-value"]')?.textContent?.includes('missions-queued') || queued.getAttribute('aria-current') !== 'page') {
      throw new Error('Keyboard link activation must update SideNav selection and aria-current.');
    }
  },
};

export const DockedSurface = {
  name: '변형·상태 · 셸 고정형 표면',
  parameters: storyDescription(
    '제품 셸에 붙는 docked 표면과 패널 경계 안쪽에 고정된 접기 버튼을 검증합니다. 브랜드 액션과 분리된 같은 버튼이 펼침·접힘 상태를 오가며 위치와 초점을 유지합니다.',
  ),
  render: () => <DockedSideNavFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="docked-side-nav"]');
    const styles = nav ? getComputedStyle(nav) : null;
    const inlineEndWidth = styles?.getPropertyValue('border-inline-end-width');
    if (!nav || nav.dataset.surface !== 'docked' || !styles
      || styles.borderTopWidth !== '0px'
      || styles.borderBottomWidth !== '0px'
      || !(parseFloat(inlineEndWidth) > 0)
      || styles.borderRadius !== '0px'
      || styles.boxShadow !== 'none') {
      throw new Error('Docked SideNav must remove the floating outline, radius, and shadow while retaining one logical end divider.');
    }

    const activateChild = canvasElement.querySelector('[data-testid="activate-docked-child"]');
    if (!activateChild) throw new Error('The controlled child-route fixture must expose an external route change.');
    await userEvent.click(activateChild);
    const activeChild = nav.querySelector('[data-sidenav-value="missions-queued"]');
    const activeParent = nav.querySelector('[data-sidenav-value="missions"]');
    if (!activeChild || activeChild.getAttribute('aria-current') !== 'page' || activeParent?.getAttribute('aria-expanded') !== 'true') {
      throw new Error('A controlled child route must reveal its parent group and expose the active destination.');
    }

    const expandedContract = collapseControlContract(nav);
    const { control: collapse, panel, inlineEndOffset, centerY } = expandedContract;
    const describedBy = collapse.getAttribute('aria-describedby');
    const tooltip = describedBy ? canvasElement.ownerDocument.getElementById(describedBy) : null;
    if (collapse.getAttribute('aria-label') !== '사이드바 접기'
      || collapse.getAttribute('aria-expanded') !== 'true'
      || panel.dataset.collapsed !== 'false'
      || collapse.closest('.lk-sidenav__brand')
      || !expandedContract.contained
      || inlineEndOffset < -0.5
      || inlineEndOffset > 8
      || expandedContract.width < 36
      || expandedContract.height < 36
      || tooltip?.textContent !== '사이드바 접기') {
      throw new Error('The docked collapse control must be a 36px stateful boundary control with a matching tooltip and controlled panel.');
    }
    await userEvent.click(collapse);
    await waitForWidth(nav, 64);
    const collapsedContract = collapseControlContract(nav);
    const expand = collapsedContract.control;
    if (expand !== collapse
      || expand.getAttribute('aria-label') !== '사이드바 펼치기'
      || expand.getAttribute('aria-expanded') !== 'false'
      || collapsedContract.panel !== panel
      || panel.dataset.collapsed !== 'true'
      || !collapsedContract.contained
      || collapsedContract.inlineEndOffset < -0.5
      || collapsedContract.inlineEndOffset > 8
      || Math.abs(collapsedContract.inlineEndOffset - inlineEndOffset) > 1
      || Math.abs(collapsedContract.centerY - centerY) > 1
      || canvasElement.ownerDocument.activeElement !== collapse) {
      throw new Error('The same focused control must follow the SideNav edge without moving vertically in the collapsed rail.');
    }
    await userEvent.click(expand);
    await waitForWidth(nav, 252);
    if (nav.querySelector('button[data-sidenav-collapse-toggle]') !== collapse
      || collapse.getAttribute('aria-label') !== '사이드바 접기') {
      throw new Error('The expanded visual story must finish in its named state with the original control node.');
    }
    collapse.blur();
  },
};

export const DockedCollapsed = {
  name: '변형·상태 · 접힌 아이콘 레일',
  parameters: storyDescription(
    '64px 레일에서 브랜드 마크, 활성 부모 표시, 목적지 아이콘, 경계 안쪽 펼치기 버튼이 충돌 없이 남는 상태입니다.',
  ),
  render: () => <DockedSideNavFixture defaultCollapsed initialValue="missions-queued" />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="docked-side-nav"]');
    await waitForWidth(nav, 64);
    const initial = collapseControlContract(nav);
    const activeParent = nav.querySelector('[data-sidenav-value="missions"]');
    if (initial.control.getAttribute('aria-label') !== '사이드바 펼치기'
      || initial.panel.dataset.collapsed !== 'true'
      || !activeParent
      || nav.querySelector('[data-sidenav-parent="missions"]')) {
      throw new Error('The collapsed visual story must retain the active parent while hiding its child rows.');
    }
    await userEvent.click(initial.control);
    await waitForWidth(nav, 252);
    await userEvent.click(initial.control);
    await waitForWidth(nav, 64);
    if (initial.control.getAttribute('aria-label') !== '사이드바 펼치기') {
      throw new Error('The collapsed visual story must finish in its named state.');
    }
    initial.control.blur();
  },
};

export const ControlledCollapse = {
  name: '상호작용 · 제어 상태',
  parameters: storyDescription(
    '제품이 collapsed 상태를 소유할 때 키보드 요청은 한 번만 전달되고, 부모가 prop을 갱신하기 전에는 SideNav 폭이 임의로 바뀌지 않습니다.',
  ),
  render: () => <ControlledCollapseFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="controlled-side-nav"]');
    const apply = canvasElement.querySelector('[data-testid="apply-controlled-collapse"]');
    const output = canvasElement.querySelector('[data-testid="controlled-collapse-output"]');
    const control = nav?.querySelector('button[data-sidenav-collapse-toggle]');
    if (!nav || !apply || !output || !control) throw new Error('Controlled collapse fixtures must expose their state evidence.');

    control.focus();
    await userEvent.keyboard('{Enter}');
    if (!output.textContent.includes('요청 1회')
      || !output.textContent.includes('다음 true')
      || Math.abs(nav.getBoundingClientRect().width - 252) >= 1
      || control.getAttribute('aria-expanded') !== 'true') {
      throw new Error('A controlled collapse request must fire once without changing visual state before the parent update.');
    }
    await userEvent.click(apply);
    await waitForWidth(nav, 64);
    control.focus();
    await userEvent.keyboard(' ');
    if (!output.textContent.includes('요청 2회')
      || !output.textContent.includes('다음 false')
      || Math.abs(nav.getBoundingClientRect().width - 64) >= 1
      || control.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Space must emit one controlled expand request while the parent-owned rail remains collapsed.');
    }
  },
};

export const CollapsedParentExpansion = {
  name: '상호작용 · 접힌 그룹 펼치기',
  parameters: storyDescription(
    '접힌 레일에서 자식이 있는 부모를 선택하면 목적지 이동 없이 패널과 해당 그룹만 열리고 키보드 초점은 같은 부모에 남습니다.',
  ),
  render: () => <CollapsedParentFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="collapsed-parent-side-nav"]');
    const parent = nav?.querySelector('[data-sidenav-value="missions"]');
    const output = canvasElement.querySelector('[data-testid="collapsed-parent-output"]');
    if (!nav || !parent || !output) throw new Error('Collapsed hierarchy fixtures must expose their parent and selection evidence.');
    parent.focus();
    await userEvent.keyboard('{Enter}');
    await waitForWidth(nav, 252);
    if (parent.getAttribute('aria-expanded') !== 'true'
      || canvasElement.ownerDocument.activeElement !== parent
      || !nav.querySelector('[data-sidenav-parent="missions"]')
      || !output.textContent.includes('overview')) {
      throw new Error('A rail parent must expand and reveal its group without selecting a leaf or moving focus.');
    }
  },
};

export const OverlayCollapsibleRegression = {
  name: '상호작용 · 겹침형 명시적 토글',
  parameters: storyDescription(
    'overlay와 collapsible을 함께 사용한 기존 조합은 64px 예약 폭과 inline 토글을 유지하며 persistent 경계 컨트롤 구조를 상속하지 않습니다.',
  ),
  render: () => <SideNavFixture collapsible />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="overlay-fixture"]');
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const surface = nav?.firstElementChild;
    const control = nav?.querySelector('button[data-sidenav-collapse-toggle]');
    if (!fixture || !nav || !surface || !control
      || Math.round(nav.getBoundingClientRect().width) !== 64
      || Math.round(surface.getBoundingClientRect().width) !== 64
      || control.closest('.lk-sidenav__collapse-control')
      || control.getBoundingClientRect().width !== 28) {
      throw new Error('Overlay plus collapsible must keep the existing inline control and reserved rail width.');
    }
    control.focus();
    await waitForWidth(surface, 252);
    if (control.getAttribute('aria-label') !== '사이드바 접기') {
      throw new Error('Focusing the overlay control must reveal the full panel with the stateful label.');
    }
    await userEvent.keyboard('{Enter}');
    await waitForWidth(surface, 64);
    if (canvasElement.ownerDocument.activeElement !== control
      || control.getAttribute('aria-label') !== '사이드바 펼치기') {
      throw new Error('The overlay inline control must collapse without losing focus.');
    }
  },
};

export const OverlayKeyboardEntry = {
  name: '상호작용 · 겹침형 키보드 진입과 복귀',
  parameters: storyDescription(
    '포인터 없이 접힌 overlay 레일에 초점이 진입하면 전체 패널이 열리고, 초점 이탈이나 Escape 뒤에는 레일과 지속되는 부모 항목으로 안전하게 돌아갑니다.',
  ),
  render: () => <SideNavFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="overlay-fixture"]');
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const panel = nav?.firstElementChild;
    const firstControl = nav?.querySelector('.lk-sidenav__scroll [data-sidenav-value]:not(:disabled):not([aria-disabled="true"])');
    if (!fixture || !nav || !panel || !firstControl || Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Keyboard entry fixture must start with a focusable collapsed overlay rail.');
    }

    firstControl.focus();
    await waitForWidth(panel, 252);
    if (canvasElement.ownerDocument.activeElement !== firstControl) {
      throw new Error('Focus entry must expand the overlay without moving keyboard focus.');
    }

    const activeChild = Array.from(nav.querySelectorAll('[data-sidenav-parent="missions"]'))
      .find((control) => control.getAttribute('aria-current') === 'page');
    if (!activeChild) throw new Error('Keyboard expansion must expose the active child destination.');
    activeChild.focus();
    activeChild.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (canvasElement.ownerDocument.activeElement?.dataset.sidenavValue !== 'missions'
      || Math.abs(panel.getBoundingClientRect().width - 64) >= 1) {
      throw new Error('Escape must collapse without immediately reopening and restore child focus to its persistent parent.');
    }

    fixture.focus();
    firstControl.focus();
    await waitForWidth(panel, 252);
    fixture.focus();
    await waitForWidth(panel, 64);
    if (nav.contains(canvasElement.ownerDocument.activeElement)) {
      throw new Error('Leaving both pointer and focus must collapse the overlay without stealing focus back.');
    }
  },
};

export const OverlayPeek = {
  name: '상호작용 · 겹침형 미리보기와 Escape 복귀',
  parameters: storyDescription(
    '접힌 레일이 hover와 focus에서 임시로 펼쳐지고 Escape 뒤 원래 폭과 초점으로 돌아오는 상황입니다. 본문을 밀지 않고 탐색 맥락을 보존하는지 확인하세요.',
  ),
  render: () => <SideNavFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="overlay-fixture"]');
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const panel = nav?.firstElementChild;
    if (!fixture || !nav || !panel || Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Overlay SideNav must reserve only the collapsed rail width initially.');
    }

    hoverNav(nav);
    try {
      await waitForWidth(panel, 252);
    } catch {
      /* 병렬 검증 부하에서 hover 이벤트가 간헐적으로 소실되는 플레이크 대비
         1회 재시도. 동작 계약(호버 → 확장) 자체는 그대로 검증된다. */
      unhoverNav(nav);
      hoverNav(nav);
      await waitForWidth(panel, 252);
    }
    if (Math.abs(panel.getBoundingClientRect().width - 252) >= 1) {
      throw new Error('Hovering the overlay rail must reveal the full SideNav panel.');
    }

    const missions = nav.querySelector('button[title="미션"]');
    const initialActive = nav.querySelector('button[aria-current="page"]');
    const disabled = nav.querySelector('button[title="권한 관리"]');
    const longItem = nav.querySelector('button[title="다중 로봇 장비 상태와 원격 점검 로그"]');
    const longLabel = Array.from(longItem?.querySelectorAll('span') ?? [])
      .find((span) => span.textContent?.includes('다중 로봇 장비 상태와 원격 점검 로그'));
    if (!missions || missions.getAttribute('aria-expanded') !== 'true' || !initialActive?.textContent?.includes('실행 중') || !disabled?.disabled) {
      throw new Error('The expanded overlay must expose its hierarchy, active child, and disabled item.');
    }
    if (!longLabel || longLabel.scrollWidth <= longLabel.clientWidth || getComputedStyle(longLabel).textOverflow !== 'ellipsis') {
      throw new Error('Long SideNav labels must truncate inside the expanded overlay.');
    }

    const queued = Array.from(nav.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('대기 작업'));
    if (!queued) throw new Error('The expanded overlay must expose the open group children.');
    await userEvent.click(queued);
    if (queued.getAttribute('aria-current') !== 'page') {
      throw new Error('Selecting an overlay child must move the current-page state to that item.');
    }
    queued.focus();
    fixture.focus();
    await new Promise((resolve) => setTimeout(resolve, 750));
    if (Math.abs(panel.getBoundingClientRect().width - 252) >= 1) {
      throw new Error('Moving focus outside must not collapse the overlay while the pointer remains inside.');
    }

    queued.focus();
    unhoverNav(nav);
    fixture.focus();
    await waitForWidth(panel, 64);
    if (Math.abs(panel.getBoundingClientRect().width - 64) >= 1) {
      throw new Error('Leaving both pointer and focus must return the overlay to its rail state.');
    }

    hoverNav(nav);
    await waitForWidth(panel, 252);
    const focusedChild = Array.from(nav.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('대기 작업'));
    if (!focusedChild) throw new Error('Reopening the overlay must restore its selected child.');
    focusedChild.focus();
    /* 키 입력도 같은 이유로 실제 KeyboardEvent를 직접 전달한다. */
    focusedChild.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    if (Math.abs(panel.getBoundingClientRect().width - 64) >= 1) {
      throw new Error('Escape must return an expanded overlay SideNav to its rail state.');
    }
    if (canvasElement.ownerDocument.activeElement?.dataset.sidenavValue !== 'missions') {
      throw new Error('Collapsing an overlay must restore child focus to its persistent parent item.');
    }

    unhoverNav(nav);
    hoverNav(nav);
    await waitForWidth(panel, 252);
    const accountTrigger = nav.querySelector('button[aria-haspopup="menu"]');
    if (!accountTrigger) throw new Error('The expanded overlay must preserve its footer account action.');
    accountTrigger.focus();
    accountTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    if (canvasElement.ownerDocument.activeElement !== accountTrigger) {
      throw new Error('Collapsing an overlay must keep focus on a persistent footer action.');
    }
  },
};

export const SideNavUserMenuCard = {
  ...SideNavUserMenuCardStory,
  name: 'SideNav and UserMenu card parity',
  tags: ['!dev', 'visual-parity'],
};
