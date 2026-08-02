import React from 'react';
import { Button, Icon, ViewerFrame, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Viewer/Viewer Frame',
  id: 'lds-product-viewer-shared-viewer-frame',
  tags: ['autodocs'],
  component: ViewerFrame,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-viewer-shared-viewer-frame--state-placement',
      eyebrow: 'Product / Viewer Frame',
      title: '공통 뷰어 프레임은 콘텐츠 상태와 복구 동작을 같은 위치에서 전달합니다',
      description:
        '지도·3D·영상 뷰어가 로딩·신호 없음·오류·지연 상태를 일관된 읽기 순서로 보여줘야 할 때 적합합니다. 정적인 이미지나 상태 전환이 없는 단순 컨테이너에는 Viewer Frame 대신 기본 Surface를 사용하세요.',
    },
    docs: {
      description: {
        component: '지도·3D·영상이 공유하는 Product 뷰포트 프레임입니다. availability·connection·freshness·playback을 분리하고, 콘텐츠 가용성에 따라 중앙 차단 상태와 콘텐츠를 유지하는 가장자리 상태를 구분합니다.',
      },
    },
  },
};

export default meta;

function Preview({ appearance = 'dark' }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--viewer-muted)',
        background: appearance === 'dark'
          ? 'radial-gradient(circle at 50% 30%, var(--viewer-surface-elevated), var(--viewer-surface))'
          : 'linear-gradient(var(--viewer-border) 1px, transparent 1px), linear-gradient(90deg, var(--viewer-border) 1px, transparent 1px)',
        backgroundSize: appearance === 'dark' ? undefined : '24px 24px',
        fontSize: 'var(--caption1-size)',
        fontWeight: 'var(--fw-semibold)',
      }}
    >
      렌더러 영역
    </div>
  );
}

function LocalToolbar({ appearance }) {
  const [zoom, setZoom] = React.useState(100);
  return (
    <ViewerToolbar orientation="horizontal" appearance={appearance === 'dark' ? 'on-dark' : 'minimal'} label="보기 도구">
      <ViewerToolbarButton label="축소" onClick={() => setZoom((value) => Math.max(50, value - 10))}><Icon name="minus" size={16} /></ViewerToolbarButton>
      <output
        aria-live="polite"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 40,
          minHeight: 28,
          padding: '0 4px',
          boxSizing: 'border-box',
          color: 'var(--viewer-foreground)',
          fontSize: 'var(--caption1-size)',
          lineHeight: 1,
          fontWeight: 'var(--fw-semibold)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {zoom}%
      </output>
      <ViewerToolbarButton label="확대" onClick={() => setZoom((value) => Math.min(200, value + 10))}><Icon name="plus" size={16} /></ViewerToolbarButton>
      <span
        aria-hidden="true"
        style={{
          width: 1,
          height: 20,
          margin: '0 2px',
          background: 'var(--viewer-border)',
        }}
      />
      <ViewerToolbarButton label="보기 초기화" onClick={() => setZoom(100)}><Icon name="reset" size={16} /></ViewerToolbarButton>
    </ViewerToolbar>
  );
}

function BlockingFocusFixture() {
  const [state, setState] = React.useState('ready');
  const [aligned, setAligned] = React.useState(false);
  return (
    <ViewerFrame
      label="포커스 전환 검증 뷰포트"
      source="장면 소스 A"
      state={state}
      stateAction={<Button data-testid="viewer-retry" size="sm" onClick={() => setState('ready')}>다시 시도</Button>}
      toolbar={(
        <ViewerToolbar orientation="horizontal" appearance="on-dark" label="프레임 동작">
          <ViewerToolbarButton label="중앙 정렬" kind="toggle" pressed={aligned} onPressedChange={setAligned}>
            <Icon name="crosshair" size={16} />
          </ViewerToolbarButton>
          <ViewerToolbarButton data-testid="viewer-load" label="소스 다시 불러오기" onClick={() => setState('loading')}>
            <Icon name="refresh" size={16} />
          </ViewerToolbarButton>
        </ViewerToolbar>
      )}
      style={{ height: 240 }}
    >
      <Preview />
    </ViewerFrame>
  );
}

function SlotLegend({ items }) {
  return (
    <ul style={{ display: 'grid', gap: 'var(--space-1)', margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map(({ corner, role }) => (
        <li
          key={corner}
          style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr',
            gap: 'var(--space-2)',
            fontSize: 'var(--caption1-size)',
            lineHeight: 'var(--caption1-line)',
          }}
        >
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{corner}</span>
          <span style={{ color: 'var(--color-semantic-label-neutral)' }}>{role}</span>
        </li>
      ))}
    </ul>
  );
}

function PlacementCase({ title, note, legend, children }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-alternative)' }}>{note}</p>
      {children}
      <SlotLegend items={legend} />
    </section>
  );
}

export const ControlPlacementContract = {
  name: '상호작용 · 네 모서리 컨트롤 배치',
  parameters: storyDescription(
    '뷰포트를 조작하는 컨트롤은 우하단에 두고 상단은 읽기 전용 정보에 남깁니다. 지도·3D는 줌과 초기화를, 영상은 재생 도구를 같은 자리에서 받습니다. 상단 우측이 비어야 라이브 같은 상시 상태가 화면 끝에 붙을 수 있습니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 1000 }}>
      <PlacementCase
        title="지도 · 3D — 뷰 조작"
        note="줌·초기화는 뷰포트를 바꾸는 조작이므로 우하단입니다. 좌하단 판독값과 같은 줄에서 읽힙니다."
        legend={[
          { corner: '좌상단', role: '소스 정체성' },
          { corner: '좌하단', role: '줌 · FPS 판독값' },
          { corner: '우하단', role: '줌 · 초기화' },
        ]}
      >
        <ViewerFrame
          label="지도 뷰포트"
          source="지도 소스 A"
          availability="ready"
          connection="connected"
          status="100%"
          toolbar={<LocalToolbar appearance="dark" />}
          toolbarPlacement="bottom-right"
          style={{ height: 220 }}
        >
          <Preview />
        </ViewerFrame>
      </PlacementCase>

      <PlacementCase
        title="영상 — 재생 도구"
        note="재생 도구도 같은 우하단을 씁니다. 덕분에 우상단이 비고 라이브 표시가 화면 끝에 붙습니다."
        legend={[
          { corner: '좌상단', role: '소스 정체성' },
          { corner: '우상단', role: '라이브 (상시 상태)' },
          { corner: '우하단', role: '재생 도구' },
        ]}
      >
        <ViewerFrame
          label="영상 뷰포트"
          source="영상 소스 B"
          state="live"
          toolbar={<LocalToolbar appearance="dark" />}
          toolbarPlacement="bottom-right"
          style={{ height: 220 }}
        >
          <Preview />
        </ViewerFrame>
      </PlacementCase>

      <PlacementCase
        title="상단은 읽는 자리"
        note="지연·최신성 같은 수동 상태는 조작과 섞이지 않습니다. 컨트롤이 없어도 배치는 그대로입니다."
        legend={[
          { corner: '좌상단', role: '소스 정체성' },
          { corner: '좌하단', role: '갱신 시각' },
          { corner: '가장자리', role: '지연 상태' },
        ]}
      >
        <ViewerFrame
          label="지연된 뷰포트"
          source="지도 소스 C"
          freshness="stale"
          status="8초 전"
          style={{ height: 220 }}
        >
          <Preview />
        </ViewerFrame>
      </PlacementCase>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const frames = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'));
    if (frames.length !== 3) throw new Error('The placement contract needs all three cases.');

    const withToolbar = frames.filter((frame) => frame.querySelector('[data-viewer-toolbar]'));
    if (withToolbar.length !== 2) throw new Error('Map and video cases must both own a toolbar.');
    for (const frame of withToolbar) {
      const topbar = frame.querySelector('[data-viewer-topbar]');
      if (topbar?.querySelector('[data-viewer-toolbar]')) {
        throw new Error('Viewport controls must not sit in the top bar.');
      }
    }

    const live = frames.find((frame) => frame.dataset.viewerState === 'live');
    const liveness = live?.querySelector('[data-viewer-liveness]');
    if (!liveness) throw new Error('A live viewport must expose the top-right liveness slot.');
    const topbar = live.querySelector('[data-viewer-topbar]');
    const identity = topbar?.querySelector('[data-viewer-identity]');
    if (!identity) throw new Error('Identity must stay in the top bar.');
    if (liveness.getBoundingClientRect().left <= identity.getBoundingClientRect().right) {
      throw new Error('Liveness must sit opposite the source identity, not beside it.');
    }
  },
};

export const StatePlacement = {
  name: '개요',
  parameters: storyDescription(
    'ready·stale·loading 상태를 나란히 두어 상태 배치 원칙을 비교합니다. 로딩은 중앙에서 콘텐츠를 차단하고 stale은 장면을 유지한 채 가장자리에서 알려 운영 맥락이 보존되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 960 }}>
      <ViewerFrame label="준비된 뷰포트" source="장면 소스 A" availability="ready" connection="connected" status="38 FPS" toolbar={<LocalToolbar appearance="dark" />} style={{ height: 240 }}>
        <Preview />
      </ViewerFrame>
      <ViewerFrame label="지연된 뷰포트" source="지도 소스 B" freshness="stale" status="8초 전" toolbar={<LocalToolbar appearance="dark" />} style={{ height: 240 }}>
        <Preview />
      </ViewerFrame>
      <ViewerFrame label="불러오는 뷰포트" source="영상 소스 C" availability="loading" toolbar={<LocalToolbar appearance="dark" />} style={{ height: 240 }}>
        <Preview />
      </ViewerFrame>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const frames = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'));
    const loading = frames.find((frame) => frame.dataset.viewerState === 'loading');
    const stale = frames.find((frame) => frame.dataset.viewerState === 'stale');
    if (!loading?.querySelector('[data-viewer-content][inert][aria-hidden="true"]')) {
      throw new Error('Loading must block and hide renderer content.');
    }
    if (!loading?.querySelector('[data-viewer-blocking-state]')) {
      throw new Error('Loading must use the central blocking state.');
    }
    if (!stale?.querySelector('[data-viewer-edge-state]') || stale.querySelector('[data-viewer-blocking-state]')) {
      throw new Error('Stale must preserve content and use the edge state.');
    }
    if (!stale.querySelector('[data-viewer-state-live][role="status"][aria-live="polite"]') || stale.querySelector('[role="alert"]')) {
      throw new Error('Retained-content Viewer states must remain polite and noninterrupting.');
    }
    const edgeState = stale.querySelector('[data-viewer-edge-state]');
    if (
      edgeState
      && (
        edgeState.getBoundingClientRect().width >= stale.getBoundingClientRect().width * 0.75
        || edgeState.getBoundingClientRect().height > 25
      )
    ) {
      throw new Error('Retained-content status must use compact content-width edge chrome instead of a full-width notification bar.');
    }
    const edgeStateIcon = edgeState?.querySelector('[data-viewer-state-icon]');
    const edgeStateLabel = edgeState?.querySelector('[data-viewer-edge-label]');
    if (
      (edgeStateIcon && edgeStateIcon.getBoundingClientRect().height > 17)
      || (edgeStateLabel && parseFloat(getComputedStyle(edgeStateLabel).fontSize) > 11.5)
    ) {
      throw new Error('Retained-content status must match passive HUD density with a 16px mark and caption2 label.');
    }
    for (const frame of frames.filter((candidate) => candidate.querySelector('[data-viewer-topbar]'))) {
      const topbar = frame.querySelector('[data-viewer-topbar]');
      const identity = frame.querySelector('[data-viewer-identity]');
      const controlShelf = frame.querySelector('[data-viewer-control-shelf]');
      const source = frame.querySelector('[data-viewer-source]');
      if (getComputedStyle(topbar).flexWrap !== 'nowrap' || getComputedStyle(source).whiteSpace !== 'nowrap') {
        throw new Error('Viewer source and controls must stay on one topbar row; long source names truncate instead of wrapping.');
      }
      if (source && parseFloat(getComputedStyle(source).fontSize) > 12.5) {
        throw new Error('Viewer source identity must keep the compact caption typography hierarchy.');
      }
      if (identity && controlShelf && Math.abs(identity.getBoundingClientRect().top - controlShelf.getBoundingClientRect().top) > 1) {
        throw new Error('Viewer identity and controls must remain aligned on the same topbar row.');
      }
      if (
        identity
        && controlShelf
        && (
          identity.getBoundingClientRect().height > 31
          || controlShelf.getBoundingClientRect().height < 30
          || controlShelf.getBoundingClientRect().height > 36
        )
      ) {
        throw new Error('Viewer identity and inset controls must keep compact chrome without enforcing identical box heights.');
      }
      if (identity?.style.background !== 'var(--viewer-surface-elevated)') {
        throw new Error('Viewer source identity requires its own opaque contrast surface.');
      }
      const ownedControlSurface = controlShelf?.querySelector('[data-viewer-toolbar-appearance="surface"], [data-viewer-toolbar-appearance="on-dark"]');
      if (
        ownedControlSurface
        && (
          getComputedStyle(ownedControlSurface).backgroundColor === 'rgba(0, 0, 0, 0)'
          || getComputedStyle(ownedControlSurface).borderStyle === 'none'
        )
      ) {
        throw new Error('A self-contained ViewerToolbar must expose its own grouped contrast surface.');
      }
      // Guarded on the shelf like every check above it: a frame may carry a
      // topbar for source identity and place its controls in the corners
      // instead. Without the guard the optional chain yielded undefined for a
      // frame that has no shelf, which read as a shelf missing its surface.
      if (controlShelf && !ownedControlSurface && controlShelf.style.background !== 'var(--viewer-surface-elevated)') {
        throw new Error('Viewer controls require a distinct grouped surface.');
      }
    }
  },
};

export const LiveAndBlockingStates = {
  name: '변형·상태 · 실시간·연결 손실·표시 오류',
  parameters: storyDescription(
    '실시간 영상과 소스 미선택·연결 끊김·신호 없음·표시 오류를 한 화면에서 비교하는 상황입니다. live는 콘텐츠를 유지하고 예상 가능한 설정 상태와 실제 콘텐츠 손실이 서로 다른 긴급도로 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 960 }}>
      <ViewerFrame label="라이브 영상 뷰포트" source="실시간 소스 A" state="live" status="30 FPS" style={{ height: 220 }}>
        <Preview />
      </ViewerFrame>
      <ViewerFrame
        label="소스가 없는 뷰포트"
        source="카메라 슬롯 A"
        state="no-source"
        stateAction={<Button size="sm" onClick={() => {}}>소스 선택</Button>}
        style={{ height: 220 }}
      >
        <Preview />
      </ViewerFrame>
      <ViewerFrame
        label="오류가 발생한 뷰포트"
        source="원격 소스 B"
        state="error"
        stateAction={<Button size="sm" onClick={() => {}}>다시 시도</Button>}
        style={{ height: 220 }}
      >
        <Preview />
      </ViewerFrame>
      <ViewerFrame
        label="연결이 끊긴 뷰포트"
        source="입력 소스 C"
        state="disconnected"
        stateAction={<Button size="sm" onClick={() => {}}>연결 확인</Button>}
        style={{ height: 220 }}
      >
        <Preview />
      </ViewerFrame>
      <ViewerFrame
        label="신호가 없는 뷰포트"
        source="렌더러 소스 D"
        state="no-signal"
        stateAction={<Button size="sm" onClick={() => {}}>다시 연결</Button>}
        style={{ height: 220 }}
      >
        <Preview />
      </ViewerFrame>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const live = canvasElement.querySelector('[data-viewer-state="live"]');
    const noSource = canvasElement.querySelector('[data-viewer-state="no-source"]');
    const error = canvasElement.querySelector('[data-viewer-state="error"]');
    const disconnected = canvasElement.querySelector('[data-viewer-state="disconnected"]');
    const noSignal = canvasElement.querySelector('[data-viewer-state="no-signal"]');
    if (!live || !noSource || !error || !disconnected || !noSignal) throw new Error('The representative Viewer states are incomplete.');

    const liveCorner = live.querySelector('[data-viewer-state-live][role="status"]');
    if (live.hasAttribute('data-viewer-blocking') || !liveCorner?.textContent?.includes('라이브')) {
      throw new Error('Live must preserve renderer content and use the compact corner status.');
    }
    if (live.querySelector('[data-viewer-content]')?.hasAttribute('inert')) {
      throw new Error('Live content must remain interactive.');
    }

    const neutralStatus = noSource.querySelector('[data-viewer-state-live][role="status"]');
    if (!noSource.hasAttribute('data-viewer-blocking') || !neutralStatus?.textContent?.includes('소스 없음') || noSource.querySelector('[role="alert"]')) {
      throw new Error('No-source must use a neutral polite blocking state.');
    }

    const errorAlert = error.querySelector('[data-viewer-state-live][role="alert"]');
    if (!error.hasAttribute('data-viewer-blocking') || !errorAlert?.textContent?.includes('표시 오류')) {
      throw new Error('Error must use the negative assertive blocking state.');
    }
    for (const frame of [disconnected, noSignal]) {
      const alert = frame.querySelector('[data-viewer-state-live][role="alert"][aria-live="assertive"]');
      if (!frame.hasAttribute('data-viewer-blocking') || !alert) {
        throw new Error('Disconnected and no-signal must use assertive blocking alerts.');
      }
    }
  },
};

export const NarrowBlockingState = {
  name: '반응형 · 좁은 폭 · 차단 정보와 복구',
  parameters: storyDescription(
    '232px 폭의 오류 뷰어에 긴 소스 이름과 복구 버튼을 표시합니다. 보조 설명과 아이콘은 단계적으로 줄어들되 소스 정체·오류 의미·다시 시도 동작은 프레임 안에 남는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 232, maxWidth: '100%' }}>
      <ViewerFrame
        label="좁은 오류 뷰포트"
        source="매우 긴 원격 시각화 소스 이름"
        state="error"
        stateDescription="카메라 콘텐츠를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요."
        stateAction={<Button size="sm" onClick={() => {}}>다시 시도</Button>}
        style={{ aspectRatio: '16 / 9' }}
      >
        <Preview />
      </ViewerFrame>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-lds-viewer-frame]');
    const blocking = frame?.querySelector('[data-viewer-blocking-state]');
    const icon = frame?.querySelector('[data-viewer-blocking-icon]');
    const description = frame?.querySelector('[data-viewer-blocking-description]');
    const action = frame?.querySelector('[data-viewer-blocking-action] button');
    if (!frame || !blocking || !icon || !description || !action) {
      throw new Error('The narrow blocking-state anatomy is incomplete.');
    }
    if (frame.clientWidth >= 240 || frame.scrollWidth > frame.clientWidth + 1) {
      throw new Error('The narrow fixture must exercise the sub-240px contract without horizontal overflow.');
    }
    if (getComputedStyle(icon).display !== 'none') {
      throw new Error('The blocking icon must collapse below 240px.');
    }
    const descriptionRect = description.getBoundingClientRect();
    if (descriptionRect.width > 1 || descriptionRect.height > 1) {
      throw new Error('Secondary blocking copy must remain accessible but visually collapse below 240px.');
    }
    const frameRect = frame.getBoundingClientRect();
    const actionRect = action.getBoundingClientRect();
    if (actionRect.left < frameRect.left - 1 || actionRect.right > frameRect.right + 1 || actionRect.bottom > frameRect.bottom + 1) {
      throw new Error('The recovery action must remain fully inside the narrow ViewerFrame.');
    }
  },
};

export const LightMapFrame = {
  name: '변형·상태 · 밝은 지도 외형',
  parameters: storyDescription(
    '밝은 2D 지도 콘텐츠에 하단 로컬 툴바와 줌 상태를 배치한 상황입니다. light appearance에서 프레임 경계와 도구 대비가 유지되고 상태가 지도보다 앞서지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <ViewerFrame
        appearance="light"
        label="2D 지도 뷰포트"
        source="floor_1.pgm"
        status="125%"
        toolbar={<LocalToolbar appearance="light" />}
        toolbarPlacement="bottom-right"
        style={{ height: 320 }}
      >
        <Preview appearance="light" />
      </ViewerFrame>
    </div>
  ),
};

export const BlockingFocusTransition = {
  name: '상호작용 · 차단 전환 · 포커스 복구',
  parameters: storyDescription(
    '사용 중인 뷰어가 로딩 차단 상태로 전환됐다가 복구되는 상황입니다. 차단 시 포커스가 복구 동작으로 이동하고 준비 상태가 돌아오면 원래 툴바 제어로 복귀하는지 확인하세요.',
  ),
  render: () => <div style={{ width: '100%', maxWidth: 520 }}><BlockingFocusFixture /></div>,
  play: async ({ canvasElement }) => {
    const load = canvasElement.querySelector('[data-testid="viewer-load"]');
    if (!load) throw new Error('Blocking transition trigger is missing.');
    load.focus();
    load.click();
    await new Promise((resolve) => setTimeout(resolve, 30));

    const frame = canvasElement.querySelector('[data-lds-viewer-frame]');
    const retry = canvasElement.querySelector('[data-testid="viewer-retry"]');
    if (frame?.dataset.viewerState !== 'loading') throw new Error('Viewer did not enter loading state.');
    if (canvasElement.ownerDocument.activeElement !== retry) {
      throw new Error('Focus must move from newly blocked content to the recovery action.');
    }
    if (!frame.querySelector('[data-viewer-blocking-source]')) {
      throw new Error('Blocking state must retain visible source identity.');
    }

    retry.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (frame.dataset.viewerState !== 'ready') throw new Error('Recovery action did not restore the ready state.');
    if (canvasElement.ownerDocument.activeElement !== load) {
      throw new Error('Focus must return to the restored viewport toolbar after recovery.');
    }
  },
};
