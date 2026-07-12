import React from 'react';
import { userEvent } from 'storybook/test';
import {
  BottomNav,
  Button,
  Container,
  Icon,
  PageHeader,
  SideNav,
  TopBar,
} from '../src/index.js';
import { DashboardGrid } from '../components/layout/DashboardGrid.jsx';
import { DashboardShell } from '../components/layout/DashboardShell.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const preventNavigation = (event) => event.preventDefault();

const wideItems = [
  { heading: '구조 검증' },
  { value: 'summary', label: '요약', href: '#summary', icon: <Icon name="home" size={18} />, onClick: preventNavigation },
  { value: 'resources', label: '리소스와 긴 상태 이름', href: '#resources', icon: <Icon name="layers" size={18} />, onClick: preventNavigation },
  { value: 'events', label: '이벤트', href: '#events', icon: <Icon name="bell" size={18} />, onClick: preventNavigation },
];

const narrowItems = [
  { value: 'summary', label: '요약', href: '#summary', icon: <Icon name="home" size={20} />, onClick: preventNavigation },
  { value: 'resources', label: '리소스와 원격 점검 상태', href: '#resources', icon: <Icon name="layers" size={20} />, onClick: preventNavigation },
  { value: 'events', label: '이벤트', href: '#events', icon: <Icon name="bell" size={20} />, onClick: preventNavigation },
  { value: 'account', label: '계정', href: '#profile', icon: <Icon name="person" size={20} />, onClick: preventNavigation },
];

function HeaderSlot({ compact = false }) {
  return (
    <TopBar
      height={compact ? 56 : 64}
      brand={<strong style={{ whiteSpace: 'nowrap' }}>LK Dashboard</strong>}
      actions={<Button size="sm" variant="ghost">도움말</Button>}
    />
  );
}

function GridCard({ title, description }) {
  return (
    <article
      style={{
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--space-2)',
        minHeight: 116,
        padding: 'var(--space-4)',
        boxSizing: 'border-box',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{title}</strong>
      <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-reading-line)' }}>{description}</span>
    </article>
  );
}

function ShellContent() {
  return (
    <Container size="wide" style={{ display: 'grid', gap: 'var(--space-6)', paddingBlock: 'var(--space-6)' }}>
      <PageHeader
        size="sm"
        eyebrow="구조 계약"
        title="대시보드 셸"
        description="header, navigation, main의 읽기 순서와 카드 그리드의 좁은 폭 전환을 검증합니다."
      />
      <DashboardGrid data-testid="shell-dashboard-grid">
        <GridCard title="요약 영역" description="카드 표면은 DashboardGrid가 아니라 각 카드가 소유합니다." />
        <GridCard title="아주 긴 상태와 보조 설명을 가진 영역" description="본문 폭이 줄면 카드가 한 열로 접히고 텍스트가 컨테이너를 밀어내지 않습니다." />
        <GridCard title="작업 영역" description="라우팅과 데이터 수명주기는 제품이 소유합니다." />
      </DashboardGrid>
    </Container>
  );
}

const meta = {
  title: 'LDS Product/Layout/Dashboard Shell',
  component: DashboardShell,
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-layout-dashboard-shell--normal-width',
      eyebrow: 'Product / Dashboard Shell',
      title: '사용자가 대시보드의 헤더·탐색·본문을 예측 가능한 순서로 이동합니다',
      description:
        '제품 대시보드의 landmark, 건너뛰기 링크, 넓은·좁은 화면 탐색 전환을 한 골격으로 관리할 때 적합합니다. 단일 콘텐츠 영역이나 간단한 문서 화면에는 DashboardShell 대신 Container와 PageHeader를 조합하세요.',
    },
    docs: {
      description: {
        component: 'DashboardShell은 landmark·skip link·wide/narrow 탐색 전환을 담당하는 LK Product Extension입니다. 카드 반복 레이아웃은 대시보드 그리드 페이지를 참고하세요.',
      },
    },
  },
};

export default meta;

function assertShellContract(canvasElement, layout) {
  const shell = canvasElement.querySelector(`[data-layout="${layout}"]`);
  const skip = shell?.querySelector('.lk-dashboard-shell__skip');
  const header = shell?.querySelector('.lk-dashboard-shell__header > header');
  const main = shell?.querySelector('main.lk-dashboard-shell__main');
  const wideRegion = shell?.querySelector('.lk-dashboard-shell__navigation');
  const narrowRegion = shell?.querySelector('.lk-dashboard-shell__narrow-navigation');
  if (!shell || !skip || !header || !main || !wideRegion || !narrowRegion) {
    throw new Error('DashboardShell must expose its skip link and header/navigation/main slot regions.');
  }
  if (skip.getAttribute('href') !== `#${main.id}` || main.tabIndex !== -1) {
    throw new Error('The skip link must target the focusable main landmark.');
  }
  const wideVisible = getComputedStyle(wideRegion).display !== 'none';
  const narrowVisible = getComputedStyle(narrowRegion).display !== 'none';
  if ((layout === 'wide' && (!wideVisible || narrowVisible)) || (layout === 'narrow' && (wideVisible || !narrowVisible))) {
    throw new Error('Exactly the navigation region for the selected shell layout must be visible.');
  }
  if (shell.scrollWidth > shell.clientWidth + 1 || main.scrollWidth > main.clientWidth + 1) {
    throw new Error('DashboardShell and its main landmark must not overflow horizontally.');
  }
  return { shell, skip, main, wideRegion, narrowRegion };
}

export const NormalWidth = {
  name: '개요',
  parameters: storyDescription(
    '넓은 화면에서 Top Bar·Side Nav·main 콘텐츠가 결합된 대시보드 상황입니다. skip link가 첫 키보드 목적지이고 landmark 순서와 현재 탐색 링크가 올바른지 확인하세요.',
  ),
  render: () => (
    <DashboardShell
      layout="wide"
      header={<HeaderSlot />}
      navigation={(
        <SideNav
          items={wideItems}
          defaultValue="summary"
          width={220}
          style={{ height: 'calc(100% - var(--space-6))', margin: 'var(--space-3)' }}
        />
      )}
      narrowNavigation={<BottomNav items={narrowItems} defaultValue="summary" />}
      style={{ minHeight: 560 }}
    >
      <ShellContent />
    </DashboardShell>
  ),
  play: async ({ canvasElement }) => {
    const { skip, wideRegion } = assertShellContract(canvasElement, 'wide');
    const current = wideRegion.querySelector('a[aria-current="page"]');
    if (!current || current.getAttribute('href') !== '#summary') {
      throw new Error('Wide shell navigation destinations must retain native anchor semantics.');
    }
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== skip) {
      throw new Error('The skip link must be the first keyboard destination in the shell.');
    }
  },
};

export const Narrow320 = {
  name: '반응형 · 320px와 하단 탐색',
  parameters: storyDescription(
    '320px 화면에서 Side Nav를 Bottom Nav로 전환하는 대시보드 상황입니다. 긴 라벨의 생략, sticky 탐색, 모바일 safe area, 한 열 카드 흐름이 가로 overflow 없이 유지되는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 320, maxWidth: '100%', margin: '0 auto' }}>
      <DashboardShell
        layout="narrow"
        header={<HeaderSlot compact />}
        navigation={<SideNav items={wideItems} defaultValue="summary" width={220} />}
        narrowNavigation={<BottomNav items={narrowItems} defaultValue="resources" />}
        style={{ minHeight: 620 }}
      >
        <ShellContent />
      </DashboardShell>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const { shell, narrowRegion } = assertShellContract(canvasElement, 'narrow');
    if (Math.round(shell.getBoundingClientRect().width) !== 320) {
      throw new Error('The narrow contract fixture must render at 320px.');
    }
    const links = narrowRegion.querySelectorAll('a[href]');
    const longLabel = Array.from(narrowRegion.querySelectorAll('span')).find((node) => node.textContent === '리소스와 원격 점검 상태');
    const shellStyles = shell.querySelector('style')?.textContent || '';
    if (links.length !== narrowItems.length || !longLabel || getComputedStyle(longLabel).textOverflow !== 'ellipsis' || longLabel.scrollWidth <= longLabel.clientWidth) {
      throw new Error('Narrow navigation must keep native links and truncate a stressed long label.');
    }
    if (getComputedStyle(narrowRegion).position !== 'sticky' || !shellStyles.includes('padding-bottom:var(--mobile-safe-area-bottom)')) {
      throw new Error('Narrow navigation must remain sticky and reserve the shared mobile safe-area inset.');
    }
  },
};

export const AutoNavigationFallback = {
  name: '반응형 · 좁은 화면의 대체 탐색',
  parameters: storyDescription(
    '별도 narrowNavigation을 제공하지 않은 자동 레이아웃 상황입니다. 좁은 상태에서도 기존 탐색이 사라지지 않고 사용 가능한 fallback으로 남는지 확인하세요.',
  ),
  render: () => (
    <DashboardShell
      header={<HeaderSlot compact />}
      navigation={<SideNav items={wideItems} defaultValue="summary" width={220} />}
      style={{ minHeight: 480 }}
    >
      <ShellContent />
    </DashboardShell>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-layout="auto"]');
    const navigation = shell?.querySelector('.lk-dashboard-shell__navigation');
    if (!shell || !navigation || shell.getAttribute('data-has-narrow-navigation') !== 'false') {
      throw new Error('Auto layout must declare and retain its wide-navigation fallback when narrowNavigation is omitted.');
    }
    shell.setAttribute('data-layout', 'narrow');
    if (getComputedStyle(navigation).display === 'none') {
      throw new Error('The fallback navigation must remain visible in the narrow layout contract.');
    }
    shell.setAttribute('data-layout', 'auto');
  },
};
