import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Popover } from '../src/index.js';
import { PopoverCard as PopoverCardStory } from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Popover',
  tags: ['autodocs'],
  component: Popover,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-popover--popover-overview',
      eyebrow: 'Product / Popover',
      title: '사용자가 현재 대상의 보조 정보와 작은 설정을 제자리에서 확인합니다',
      description:
        '클릭한 trigger 주변에서 설명·미니 폼·피커처럼 자유로운 콘텐츠를 잠시 다룰 때 적합합니다. 명령 목록이나 작업을 막는 복잡한 흐름에는 Popover 대신 Dropdown Menu 또는 Modal을 사용하세요.',
    },
    docs: {
      description: {
        component: '클릭 trigger에 임의의 보조 콘텐츠를 정렬해 여는 LK Product Popover입니다.',
      },
    },
  },
};

export default meta;

export const PopoverOverview = {
  name: '개요',
  parameters: storyDescription(
    '현재 화면을 떠나지 않고 운영 설정의 설명과 값을 확인하는 상황입니다. trigger와 패널의 관계가 분명하고 바깥을 클릭하면 예측 가능하게 닫히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ minHeight: 220, display: 'flex', alignItems: 'start', gap: 'var(--space-4)', flexWrap: 'wrap', maxWidth: 760 }}>
      <Popover trigger={<Button variant="ghost">운영 설정</Button>} width={280}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong>운영 설정</strong>
          <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>앵커 기준으로 열리는 보조 패널입니다.</span>
        </div>
      </Popover>
      <Popover trigger={<Button variant="ghost">오른쪽 정렬 정보</Button>} align="right" width={240}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong>선택 항목</strong>
          <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>최근 수정 2분 전</span>
        </div>
      </Popover>
    </main>
  ),
};

function PopoverContractFixture() {
  const [open, setOpen] = React.useState(false);
  return (
    <main style={{ position: 'fixed', right: 4, bottom: 4 }}>
      <Popover
        trigger={<Button variant="outlined" color="assistive">협폭 설정</Button>}
        width={280}
        open={open}
        onOpenChange={setOpen}
        ariaLabel="협폭 운영 설정"
      >
        <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
          운영 반경
          <input aria-label="운영 반경" defaultValue="30m" />
        </label>
      </Popover>
    </main>
  );
}

export const PopoverInteractionContract = {
  name: '상호작용 · 초점·Escape·화면 경계',
  parameters: storyDescription(
    '화면 오른쪽 아래 trigger에서 제어형 Popover를 열어 trigger ARIA, 내부 Tab 순서, Escape 초점 복원, viewport 안쪽 flip·clamp를 확인합니다.',
  ),
  render: () => <PopoverContractFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('협폭 설정'));
    if (!trigger) throw new Error('Popover contract story requires its trigger.');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const panel = await waitFor(() => {
      const current = ownerDocument.querySelector('[role="dialog"][aria-label="협폭 운영 설정"]');
      if (!current) throw new Error('Popover must open a named non-modal dialog.');
      return current;
    });
    if (trigger.getAttribute('aria-expanded') !== 'true' || trigger.getAttribute('aria-controls') !== panel.id) {
      throw new Error('Popover trigger must expose expanded and controls state.');
    }
    const portal = panel.closest('[data-lds-overlay-portal]');
    if (!portal || portal.parentElement !== ownerDocument.body || getComputedStyle(panel).position !== 'fixed') {
      throw new Error('Popover must escape clipping ancestors through the owner-document Portal.');
    }
    await userEvent.tab();
    if (ownerDocument.activeElement?.getAttribute('aria-label') !== '운영 반경') {
      throw new Error('Tab must move from the Popover trigger into its content.');
    }
    await waitFor(() => {
      const rect = panel.getBoundingClientRect();
      if (rect.left < 0 || rect.right > ownerDocument.defaultView.innerWidth || rect.top < 0 || rect.bottom > ownerDocument.defaultView.innerHeight) {
        throw new Error('Popover must remain inside the viewport.');
      }
      if (panel.dataset.placement !== 'top') throw new Error('A bottom-edge Popover must flip above its trigger.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (ownerDocument.querySelector('[role="dialog"][aria-label="협폭 운영 설정"]')) throw new Error('Escape must close Popover.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Escape must restore the Popover trigger.');
    });
  },
};

function CollisionPopoverContent() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <label style={{ display: 'grid', gap: 'var(--space-1)' }}>
        응답 길이
        <input aria-label="응답 길이" defaultValue="보통" />
      </label>
      {Array.from({ length: 12 }, (_, index) => (
        <span key={index}>설정 설명 {index + 1}</span>
      ))}
    </div>
  );
}

function PopoverCollisionBoundaryFixture() {
  const portalBoundaryRef = React.useRef(null);
  const inlineBoundaryRef = React.useRef(null);
  const boundaryStyle = {
    position: 'relative',
    width: 300,
    height: 260,
    padding: 'var(--space-3)',
    boxSizing: 'border-box',
    border: '1px solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-lg)',
  };
  const anchorStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  };
  return (
    <main style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', minHeight: 340 }}>
      <section ref={inlineBoundaryRef} data-popover-collision-boundary="inline" style={{ ...boundaryStyle, overflow: 'visible' }}>
        <div style={anchorStyle}>
          <Popover
            trigger={<Button size="sm">Inline 경계 설정</Button>}
            ariaLabel="Inline 경계 설정"
            position="bottom"
            width={360}
            collisionBoundary={inlineBoundaryRef}
            collisionPadding={8}
            withinPortal={false}
          >
            <CollisionPopoverContent />
          </Popover>
        </div>
      </section>
      <section ref={portalBoundaryRef} data-popover-collision-boundary="portal" style={{ ...boundaryStyle, overflow: 'hidden' }}>
        <div style={anchorStyle}>
          <Popover
            trigger={<Button size="sm">Portal 경계 설정</Button>}
            ariaLabel="Portal 경계 설정"
            position="bottom"
            width={360}
            collisionBoundary={portalBoundaryRef}
            collisionPadding={8}
            styles={{ panel: { minWidth: 480, minHeight: 480, overflow: 'visible' } }}
          >
            <CollisionPopoverContent />
          </Popover>
        </div>
      </section>
    </main>
  );
}

function assertPopoverInsideBoundary(panel, boundary, padding = 8) {
  const panelRect = panel.getBoundingClientRect();
  const boundaryRect = boundary.getBoundingClientRect();
  const view = boundary.ownerDocument.defaultView;
  const effectiveBoundary = {
    left: Math.max(0, boundaryRect.left) + padding,
    right: Math.min(view.innerWidth, boundaryRect.right) - padding,
    top: Math.max(0, boundaryRect.top) + padding,
    bottom: Math.min(view.innerHeight, boundaryRect.bottom) - padding,
  };
  const tolerance = 1;
  if (
    panelRect.left < effectiveBoundary.left - tolerance
    || panelRect.right > effectiveBoundary.right + tolerance
    || panelRect.top < effectiveBoundary.top - tolerance
    || panelRect.bottom > effectiveBoundary.bottom + tolerance
  ) {
    throw new Error(
      `Popover must stay inside its collision boundary (panel=${panelRect.left},${panelRect.top},${panelRect.right},${panelRect.bottom}; boundary=${boundaryRect.left},${boundaryRect.top},${boundaryRect.right},${boundaryRect.bottom}).`,
    );
  }
}

export const CollisionBoundaryContract = {
  name: '계약 · collision boundary',
  tags: ['!dev'],
  parameters: storyDescription(
    'Portal target과 positioning 경계를 분리합니다. ref로 전달한 패널 경계와 viewport의 교집합 안에서 fixed·absolute Popover가 폭과 높이를 줄이고 위로 flip하며, 경계 resize 뒤에도 다시 배치되어야 합니다.',
  ),
  render: () => <PopoverCollisionBoundaryFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const cases = [
      { kind: 'inline', label: 'Inline 경계 설정', position: 'absolute', portalled: false },
      { kind: 'portal', label: 'Portal 경계 설정', position: 'fixed', portalled: true },
    ];

    for (const contract of cases) {
      const boundary = canvasElement.querySelector(`[data-popover-collision-boundary="${contract.kind}"]`);
      const trigger = [...(boundary?.querySelectorAll('button') ?? [])]
        .find((button) => button.textContent?.trim() === contract.label);
      if (!boundary || !trigger) throw new Error(`Popover ${contract.kind} collision fixture is incomplete.`);

      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const panel = await waitFor(() => {
        const id = trigger.getAttribute('aria-controls');
        const current = id ? ownerDocument.getElementById(id) : null;
        if (!current) throw new Error(`Popover ${contract.kind} collision panel must open.`);
        return current;
      });
      const portal = panel.closest('[data-lds-overlay-portal]');
      if (getComputedStyle(panel).position !== contract.position
        || Boolean(portal) !== contract.portalled
        || (portal && portal.parentElement !== ownerDocument.body)) {
        throw new Error(`Popover ${contract.kind} must preserve its Portal/positioning strategy.`);
      }
      if (trigger.getAttribute('aria-expanded') !== 'true' || panel.getAttribute('role') !== 'dialog') {
        throw new Error('Collision constraints must not change Popover trigger/dialog semantics.');
      }

      await waitFor(() => {
        assertPopoverInsideBoundary(panel, boundary);
        if (panel.dataset.placement !== 'top') throw new Error('A bottom-edge Popover must flip above inside its collision boundary.');
        if (panel.scrollHeight <= panel.clientHeight) throw new Error('Collision maxHeight must make overflowing Popover content scroll.');
      });
      await userEvent.tab();
      if (ownerDocument.activeElement?.getAttribute('aria-label') !== '응답 길이') {
        throw new Error('Collision positioning must preserve Popover content focus order.');
      }

      if (contract.kind === 'portal') {
        boundary.style.width = '252px';
        await waitFor(() => {
          assertPopoverInsideBoundary(panel, boundary);
          if (panel.getBoundingClientRect().width > 236.5) {
            throw new Error('Popover must recompute maxWidth after its collision boundary resizes.');
          }
        });
      }

      await userEvent.keyboard('{Escape}');
      await waitFor(() => {
        if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('Escape must close a collision-constrained Popover.');
        if (ownerDocument.activeElement !== trigger) throw new Error('Escape must restore the constrained Popover trigger.');
      });
    }
  },
};

export const PopoverCard = { ...PopoverCardStory, name: 'Popover card parity', tags: ['!dev', 'visual-parity'] };

function PopoverSurfacePortalFixture() {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current?.setAttribute('data-ref-target', 'popover-root');
  }, []);
  return (
    <section data-theme="dark" dir="rtl" style={{ width: 140, height: 64, overflow: 'hidden', padding: 8 }}>
      <Popover
        ref={ref}
        defaultOpen
        ariaLabel="Popover surface contract"
        trigger={<Button>표면 계약</Button>}
        className="contract-popover-root"
        classNames={{ panel: 'contract-popover-panel' }}
        styles={{ panel: { letterSpacing: '2px' } }}
        vars={{ '--lds-popover-width': '232px' }}
      >
        Portal scope
      </Popover>
    </section>
  );
}

export const SurfaceRefPortalContract = {
  name: 'Surface, ref, and Portal contract',
  tags: ['!dev'],
  render: () => <PopoverSurfacePortalFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const root = canvasElement.querySelector('[data-ref-target="popover-root"]');
    const panel = await waitFor(() => {
      const current = ownerDocument.querySelector('[role="dialog"][aria-label="Popover surface contract"]');
      if (!current) throw new Error('The Popover contract panel must mount.');
      return current;
    });
    const portal = panel.closest('[data-lds-overlay-portal]');
    if (!(root instanceof HTMLDivElement) || root.dataset.slot !== 'root' || !root.classList.contains('contract-popover-root')) {
      throw new Error('Popover ref and root class must target the public anchor root.');
    }
    if (!panel.classList.contains('contract-popover-panel') || getComputedStyle(panel).width !== '232px' || getComputedStyle(panel).letterSpacing !== '2px') {
      throw new Error('Popover named parts and variables must reach the portalled panel.');
    }
    await waitFor(() => {
      if (!portal || portal.parentElement !== ownerDocument.body || portal.dataset.theme !== 'dark' || portal.dir !== 'rtl' || root.contains(panel)) {
        throw new Error(
          `Popover Portal must escape clipping while inheriting the nearest theme and direction scope (portal=${Boolean(portal)}, parent=${portal?.parentElement?.tagName ?? 'missing'}, bodyParent=${portal?.parentElement === ownerDocument.body}, theme=${portal?.dataset.theme ?? 'missing'}, dir=${portal?.getAttribute('dir') ?? 'missing'}, rootTheme=${root?.closest('[data-theme]')?.getAttribute('data-theme') ?? 'missing'}, rootDir=${root?.closest('[dir]')?.getAttribute('dir') ?? 'missing'}, contained=${root?.contains(panel)}).`,
        );
      }
    });
  },
};
