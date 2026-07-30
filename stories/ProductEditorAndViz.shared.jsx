import React from 'react';
import {
  Badge,
  CanvasEditorShell,
  ConnectionBadge,
  EditorToolbar,
  EquipmentStatusCard,
  HistoryToolbar,
  Icon,
  Map2DCanvas,
  Popover,
  Scene3DFrame,
  Switch,
  VideoStreamTile,
  ViewerToolbar,
  ViewerToolbarButton,
} from '../src/index.js';

const ElevatorGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9.5 10l2.5-2.5 2.5 2.5" />
    <path d="M9.5 14l2.5 2.5 2.5-2.5" />
  </svg>
);

const StairsGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19h4v-4h4v-4h4V7h4" />
  </svg>
);

export const ConnectionBadgeCard = {
  name: 'ConnectionBadge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 140, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <ConnectionBadge status="online" />
        <ConnectionBadge status="reconnecting" />
        <ConnectionBadge status="weak" />
        <ConnectionBadge status="offline" />
      </div>
    </div>
  ),
};

export const EquipmentStatusCardCard = {
  name: 'EquipmentStatusCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 900, height: 650, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <EquipmentStatusCard
            headingLevel={2}
            icon={<ElevatorGlyph />}
            title="화물 엘리베이터 2호기"
            description="물류동 동측"
            status="운행 중"
            statusTone="positive"
            details={[
              { label: '이동', value: <><Icon name="arrow-up" size={16} aria-hidden="true" /> 상승 중</> },
              { label: '층', value: '3층' },
              { label: '운전 방식', value: '자동' },
            ]}
            meta="30초 전에 갱신"
          />
          <EquipmentStatusCard
            headingLevel={2}
            icon={<Icon name="signal" size={20} />}
            title="옥상 게이트웨이"
            description="로봇 네트워크 중계 장비"
            status="주의 필요"
            statusTone="cautionary"
            details={[
              { label: '연결', value: <ConnectionBadge status="reconnecting" size="sm" /> },
              { label: '구역', value: '옥상 서측' },
            ]}
            meta="재시도 2/5"
          />
        </div>

        <div data-theme="dark" style={{ display: 'grid', gap: 16, padding: 16, borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)' }}>
          <EquipmentStatusCard
            headingLevel={2}
            icon={<Icon name="lock" size={20} />}
            title="북측 연구동 물류 차량 출입 게이트 12번 원격 제어 장치"
            description="야외 배송 동선과 연결된 원격 출입 설비"
            status="센서 응답을 확인해야 함"
            statusTone="negative"
            details={[
              { label: '연결', value: <ConnectionBadge status="offline" size="sm" /> },
              { label: '마지막 응답', value: '12분 전' },
            ]}
            meta="현장 확인 필요"
          />
          <EquipmentStatusCard
            headingLevel={2}
            icon={<StairsGlyph />}
            title="계단리프트 A"
            status="정기 점검 중"
            statusTone="cautionary"
            details={[
              { label: '운행', value: '일시 중지' },
              { label: '점검 종료', value: '오늘 16:00' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

const monoFont = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)';

function FeedPlaceholder({ children }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'repeating-linear-gradient(135deg, var(--component-viewer-surface) 0 10px, var(--component-viewer-surface-elevated) 10px 20px)',
      }}
    >
      {/* 플레이스홀더 문구는 한글이라 mono·양수 자간·uppercase를 쓰지 않는다.
          mono는 자릿수 정렬이 필요한 수치 판독(아래 좌표 표시)에만 남긴다. */}
      {children != null && (
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 'var(--fw-semibold)', color: 'var(--component-viewer-muted)' }}>
          {children}
        </span>
      )}
    </div>
  );
}

export const VideoStreamTileCard = {
  name: 'VideoStreamTile card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 920, height: 720, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <div style={{ fontSize: 11, fontWeight: 'var(--fw-extra)', letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)', margin: '0 0 12px' }}>
        마지막 프레임 유지 — degraded · stale · paused
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <VideoStreamTile label="보조 영상 A" state="degraded"><FeedPlaceholder>마지막 프레임</FeedPlaceholder></VideoStreamTile>
        <VideoStreamTile label="보조 영상 B" state="stale"><FeedPlaceholder>마지막 프레임</FeedPlaceholder></VideoStreamTile>
        <VideoStreamTile label="보조 영상 C" state="paused"><FeedPlaceholder>마지막 프레임</FeedPlaceholder></VideoStreamTile>
      </div>

      <div style={{ fontSize: 11, fontWeight: 'var(--fw-extra)', letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)', margin: '0 0 12px' }}>
        사용 가능/차단 상태 — live · loading · disconnected
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <VideoStreamTile label="보조 영상 A" state="live"><FeedPlaceholder>영상 렌더러 영역</FeedPlaceholder></VideoStreamTile>
        <VideoStreamTile label="보조 영상 B" state="loading"><FeedPlaceholder /></VideoStreamTile>
        <VideoStreamTile label="보조 영상 C" state="disconnected"><FeedPlaceholder /></VideoStreamTile>
      </div>

      <div style={{ fontSize: 11, fontWeight: 'var(--fw-extra)', letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)', margin: '0 0 12px' }}>
        aspectRatio — 나란히 배치할 때 비율 조정
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
          <VideoStreamTile label="표준 영상" state="live" aspectRatio="4 / 3"><FeedPlaceholder>4∶3</FeedPlaceholder></VideoStreamTile>
        </div>
        <div style={{ flex: '1 1 420px', minWidth: 200 }}>
          <VideoStreamTile label="와이드 영상" state="live" aspectRatio="21 / 9"><FeedPlaceholder>21∶9 · WIDE</FeedPlaceholder></VideoStreamTile>
        </div>
      </div>
    </div>
  ),
};

export const EditorShell = {
  name: '에디터 셸',
  render: () => (
    <CanvasEditorShell
      title="미션 경로 편집"
      tools={
        <EditorToolbar
          items={[
            { value: 'select', label: '선택', icon: <Icon name="crosshair" size={16} /> },
            { value: 'route', label: '경로', icon: <Icon name="route" size={16} /> },
            { value: 'zone', label: '구역', icon: <Icon name="zone" size={16} /> },
          ]}
          defaultValue="route"
        />
      }
      panel={
        <div style={{ display: 'grid', gap: 14, padding: 16, boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
            <strong style={{ fontSize: 'var(--label1-size)', color: 'var(--color-semantic-label-strong)' }}>속성</strong>
            <span style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>미션 경로</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['웨이포인트', '12'],
              ['예상 거리', '84m'],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: '10px 11px', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-normal-alternative)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, lineHeight: 1.1, fontWeight: 'var(--fw-extra)', color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 0, borderTop: '1px solid var(--color-semantic-line-normal-normal)' }}>
            {[
              ['시작 지점', 'Dock A'],
              ['경유 구역', 'Zone 3'],
              ['검증 상태', '경로 검증 중'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', fontSize: 12 }}>
                <span style={{ color: 'var(--color-semantic-label-alternative)' }}>{label}</span>
                <strong style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-bold)', textAlign: 'right' }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      }
      status={<HistoryToolbar canUndo canRedo onReset={() => {}} style={{ marginLeft: 'auto' }} />}
      style={{ height: 480 }}
    >
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}>
        <svg width="100%" height="100%" viewBox="0 0 640 300" aria-label="미션 경로 캔버스" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="editor-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--color-semantic-line-normal-neutral)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="640" height="300" fill="url(#editor-grid)" />
          <rect x="108" y="58" width="168" height="78" rx="10" fill="var(--color-semantic-background-elevated-normal)" stroke="var(--color-semantic-line-normal-normal)" />
          <rect x="362" y="72" width="156" height="64" rx="10" fill="var(--color-semantic-background-elevated-normal)" stroke="var(--color-semantic-line-normal-normal)" />
          <path d="M132 220 C206 138 284 205 344 166 C406 126 448 156 502 88" fill="none" stroke="var(--color-semantic-focus-ring)" strokeWidth="24" strokeLinecap="round" />
          <path d="M132 220 C206 138 284 205 344 166 C406 126 448 156 502 88" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="6" strokeLinecap="round" strokeDasharray="12 12" />
          <circle cx="132" cy="220" r="11" fill="var(--color-semantic-status-positive)" stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="4" />
          <circle cx="344" cy="166" r="11" fill="var(--color-semantic-status-cautionary)" stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="4" />
          <circle cx="502" cy="88" r="11" fill="var(--color-semantic-primary-normal)" stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="4" />
        </svg>
        <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', boxShadow: 'var(--shadow-sm)', fontSize: 12, fontWeight: 'var(--fw-bold)' }}>
          <Badge dot tone="green" />
          경로 검증 중
        </div>
      </div>
    </CanvasEditorShell>
  ),
};

export const CanvasEditorShellEditorToolbarHistoryToolbarCard = {
  name: 'CanvasEditorShell · EditorToolbar · HistoryToolbar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [tool, setTool] = React.useState('draw');
    const [step, setStep] = React.useState(3);
    const tools = [
      { value: 'select', icon: <Icon name="search" size={16} />, label: '선택' },
      { value: 'draw', icon: <Icon name="plus" size={16} />, label: '그리기' },
      { value: 'zone', icon: <Icon name="square" size={16} />, label: '존' },
      { value: 'point', icon: <Icon name="location" size={16} />, label: '웨이포인트' },
      { value: 'erase', icon: <Icon name="trash" size={16} />, label: '지우기' },
    ];
    const panel = (
      <div style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 'var(--fw-extra)', letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)' }}>속성</h4>
        {[
          ['도구', tool],
          ['해상도', '0.05 m/px'],
          ['존', '3'],
          ['웨이포인트', '12'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '7px 0', borderTop: '1px solid var(--color-semantic-line-normal-normal)', color: 'var(--color-semantic-label-neutral)' }}>
            <span>{label}</span>
            <b style={{ color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</b>
          </div>
        ))}
      </div>
    );
    const status = (
      <>
        <span>1200 × 800 px · 0.05 m/px</span>
        <HistoryToolbar
          canUndo={step > 0}
          canRedo={step < 5}
          onUndo={() => setStep((value) => Math.max(0, value - 1))}
          onRedo={() => setStep((value) => Math.min(5, value + 1))}
          onReset={() => setStep(0)}
          style={{ marginLeft: 'auto' }}
        />
      </>
    );
    return (
      <div data-visual-crop-root style={{ width: 900, height: 520, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
        <CanvasEditorShell title="지도 편집 — floor_1.pgm" style={{ height: 440 }} tools={<EditorToolbar value={tool} onChange={setTool} items={tools} />} panel={panel} status={status}>
          <Map2DCanvas style={{ height: '100%', borderRadius: 0, border: 'none' }}>
            <div style={{ width: 280, height: 200, background: 'repeating-linear-gradient(45deg, var(--color-semantic-background-band), var(--color-semantic-background-band) 8px, var(--color-semantic-fill-normal) 8px, var(--color-semantic-fill-normal) 16px)', border: '2px solid var(--color-semantic-line-solid-normal)', borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 40, top: 40, width: 120, height: 80, border: '2px solid var(--color-semantic-primary-normal)', background: 'var(--color-semantic-primary-surface-strong)', borderRadius: 4 }} />
              <span style={{ position: 'absolute', left: 180, top: 130, width: 12, height: 12, borderRadius: '50%', background: 'var(--color-semantic-primary-normal)' }} />
            </div>
          </Map2DCanvas>
        </CanvasEditorShell>
      </div>
    );
  },
};

function ParityRendererPlaceholder() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'var(--viewer-surface)', color: 'var(--viewer-muted)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'linear-gradient(var(--viewer-border) 1px, transparent 1px), linear-gradient(90deg, var(--viewer-border) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <strong style={{ position: 'relative', color: 'var(--viewer-foreground)', fontSize: 'var(--body2-size)' }}>3D 렌더러 영역</strong>
    </div>
  );
}

export const Scene3DFrameCard = {
  name: 'Scene3DFrame card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 360, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <Scene3DFrame
        title="장면 A"
        state="ready"
        badges={<ConnectionBadge status="online" size="sm" />}
        status="원근 · 60 FPS"
        style={{ height: 300 }}
      >
        <ParityRendererPlaceholder />
      </Scene3DFrame>
    </div>
  ),
};

function ParityMapPlaceholder() {
  return (
    <svg width="440" height="280" viewBox="0 0 440 280" style={{ display: 'block' }}>
      <rect x="30" y="26" width="380" height="228" rx="4" fill="var(--viewer-surface)" stroke="var(--viewer-border)" strokeWidth="2" />
      <rect x="52" y="48" width="124" height="78" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="198" y="48" width="190" height="78" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="52" y="152" width="148" height="80" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="224" y="152" width="164" height="80" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <path d="M176 87 H198 M200 192 H224 M116 126 V152 M306 126 V152" fill="none" stroke="var(--viewer-foreground)" strokeWidth="5" opacity="0.32" />
    </svg>
  );
}

export const Map2DCanvasCard = {
  name: 'Map2DCanvas card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 520, height: 360, padding: 24, boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}>
      <Map2DCanvas style={{ height: 312 }}><ParityMapPlaceholder /></Map2DCanvas>
    </div>
  ),
};

function ViewerToolbarMapPlaceholder({ layers }) {
  return (
    <svg width="320" height="200" viewBox="0 0 320 200" style={{ display: 'block' }}>
      {layers.base && <rect x="20" y="18" width="280" height="164" rx="4" fill="none" stroke="var(--component-viewer-muted)" strokeWidth="2.5" />}
      {layers.base && <path d="M20 110 H120 M120 18 V110 M190 110 V182 M190 140 H300" fill="none" stroke="var(--component-viewer-subtle)" strokeWidth="2.5" />}
      {layers.overlay && <rect x="50" y="46" width="96" height="42" rx="4" fill="var(--component-viewer-surface-elevated)" stroke="var(--component-viewer-muted)" />}
      {layers.overlay && <rect x="180" y="120" width="90" height="38" rx="4" fill="var(--component-viewer-surface-elevated)" stroke="var(--component-viewer-muted)" />}
      {layers.guides && <path d="M38 100 H282 M160 34 V166" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="1.5" strokeDasharray="5 5" />}
    </svg>
  );
}

export const ViewerToolbarCard = {
  name: 'ViewerToolbar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const zoom = 100;
    const layers = { base: true, overlay: true, guides: true };
    const anyOff = !layers.base || !layers.overlay || !layers.guides;
    return (
      <div data-visual-crop-root style={{ width: 700, height: 460, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
        <div style={{ fontSize: 11, fontWeight: 'var(--fw-extra)', letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)', margin: '0 0 12px' }}>
          레이어 버튼 → Popover 패널 (눌러보세요)
        </div>
        <div style={{ position: 'relative', height: 240, marginBottom: 24 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--component-viewer-surface)', border: '1px solid var(--component-viewer-border)' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ transform: `scale(${zoom / 100})`, transition: 'transform .18s var(--ease-out, ease)' }}>
                <ViewerToolbarMapPlaceholder layers={layers} />
              </div>
            </div>
            <div style={{ position: 'absolute', left: 12, bottom: 12, fontFamily: monoFont, fontSize: 11, fontWeight: 'var(--fw-semibold)', letterSpacing: '0.4px', color: 'var(--component-viewer-foreground)', background: 'var(--component-viewer-surface-elevated)', borderRadius: 6, padding: '4px 9px' }}>
              {zoom}%
            </div>
          </div>
          <ViewerToolbar orientation="horizontal" appearance="on-dark" style={{ position: 'absolute', top: 12, right: 12 }}>
            <ViewerToolbarButton label="확대"><Icon name="plus" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="축소"><Icon name="minus" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="보기 초기화"><Icon name="reset" size={16} /></ViewerToolbarButton>
            <Popover align="right" width={168} trigger={<ViewerToolbarButton label="레이어" kind="toggle" pressed={anyOff}><Icon name="filter" size={16} /></ViewerToolbarButton>}>
              <div style={{ fontSize: 10.5, fontWeight: 'var(--fw-extra)', letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)', margin: '0 0 8px 2px' }}>
                레이어
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Switch size="sm" label="기본 표면" checked={layers.base} onChange={() => {}} />
                <Switch size="sm" label="보조 오버레이" checked={layers.overlay} onChange={() => {}} />
                <Switch size="sm" label="가이드" checked={layers.guides} onChange={() => {}} />
              </div>
            </Popover>
          </ViewerToolbar>
        </div>

        <div style={{ fontSize: 11, fontWeight: 'var(--fw-extra)', letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)', margin: '0 0 12px' }}>
          orientation — horizontal · vertical
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <ViewerToolbar orientation="horizontal">
            <ViewerToolbarButton label="확대"><Icon name="plus" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="축소"><Icon name="minus" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="레이어" kind="toggle" defaultPressed><Icon name="filter" size={16} /></ViewerToolbarButton>
          </ViewerToolbar>
          <ViewerToolbar orientation="vertical">
            <ViewerToolbarButton label="확대"><Icon name="plus" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="축소"><Icon name="minus" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="가시성" kind="toggle" defaultPressed><Icon name="eye" size={16} /></ViewerToolbarButton>
          </ViewerToolbar>
        </div>
      </div>
    );
  },
};
