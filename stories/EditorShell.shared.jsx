import React from 'react';
import {
  Button,
  CanvasEditorCommandBar,
  CanvasEditorShell,
  EditorToolbar,
  Icon,
  Input,
  LayerPanel,
  Map2DCanvas,
  NumberField,
  Scene3DFrame,
  Select,
  SelectionInspector,
  Slider,
  StatusBadge,
  Tabs,
} from '../src/index.js';

const surfaceStyle = { height: '100%', border: 0, borderRadius: 0 };

const objectTools = [
  { value: 'select', label: '선택', icon: <Icon name="crosshair" size={18} /> },
  { value: 'polygon', label: '구역', icon: <Icon name="zone" size={18} /> },
  { value: 'line', label: '라인', icon: <Icon name="route" size={18} /> },
  { value: 'landmark', label: '랜드마크', icon: <Icon name="location" size={18} /> },
];

const pgmTools = [
  { value: 'brush', label: '브러시', icon: <Icon name="pencil" size={18} /> },
  { value: 'line', label: '라인', icon: <Icon name="route" size={18} /> },
  { value: 'rect', label: '사각형', icon: <Icon name="square" size={18} /> },
  { value: 'polygon', label: '다각형', icon: <Icon name="zone" size={18} /> },
];

const taskSteps = [
  { id: 'pickup', label: '1F 로비 픽업', detail: 'MOVE_TO · x 8.4, y -2.1' },
  { id: 'elevator', label: '엘리베이터 대기', detail: 'WAIT_FACILITY · elevator_a' },
  { id: 'dock', label: '도킹 스테이션 복귀', detail: 'MOVE_TO · dock_01' },
];

function StoryFrame({ children, maxWidth = 1120, height = 620 }) {
  return <main style={{ width: 'calc(100% - 48px)', maxWidth, height, minWidth: 0, margin: '28px auto' }}>{children}</main>;
}

function HeaderBackButton() {
  return (
    <Button size="sm" variant="flat" iconOnly aria-label="이전 화면" title="이전 화면">
      <Icon name="arrow-left" size={18} aria-hidden="true" />
    </Button>
  );
}

function SectionTitle({ children, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, marginBottom: 8 }}>
      <strong style={{ minWidth: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', letterSpacing: 0 }}>
        {children}
      </strong>
      {count != null && <span style={{ marginLeft: 'auto', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)' }}>{count}</span>}
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ marginBottom: 8, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)' }}>{children}</div>;
}

function TaskCategory({ value }) {
  const options = [
    { value: 'patrol', label: '순찰', icon: 'route' },
    { value: 'cleaning', label: '청소', icon: 'filter' },
    { value: 'delivery', label: '배송', icon: 'inbox' },
  ];
  return (
    <div>
      <FieldLabel>category</FieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              style={{ display: 'grid', justifyItems: 'center', gap: 5, minWidth: 0, minHeight: 64, padding: 8, border: `1px solid ${active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-normal-normal)'}`, borderRadius: 'var(--radius-md)', background: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-normal-alternative)', color: active ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-label-neutral)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}
            >
              <Icon name={option.icon} size={18} aria-hidden="true" />
              <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TaskStepRows({ steps, selectedId, onSelect }) {
  if (steps.length === 0) {
    return <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 1.5 }}>층별 랜드마크 또는 좌표를 선택하세요.</p>;
  }

  return (
    <div role="list" aria-label="작업 단계" style={{ display: 'grid', gap: 6 }}>
      {steps.map((step, index) => {
        const active = step.id === selectedId;
        return (
          <div key={step.id} role="listitem">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(step.id)}
              style={{ display: 'grid', gridTemplateColumns: '20px 24px minmax(0, 1fr) 24px', alignItems: 'center', gap: 7, width: '100%', minWidth: 0, padding: 8, border: `1px solid ${active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-normal-normal)'}`, borderRadius: 'var(--radius-sm)', background: active ? 'var(--lk-accent-tint)' : 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-normal)', textAlign: 'left', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}
            >
              <Icon name="handle" size={16} aria-hidden="true" />
              <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-primary-normal)', color: 'var(--color-semantic-static-white)', fontSize: 11, fontWeight: 'var(--fw-bold)' }}>{index + 1}</span>
              <span style={{ minWidth: 0 }}>
                <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-bold)' }}>{step.label}</strong>
                <span style={{ display: 'block', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-neutral)', fontSize: 11 }}>{step.detail}</span>
              </span>
              <span aria-hidden="true" style={{ display: 'inline-flex', justifyContent: 'center', color: 'var(--color-semantic-label-neutral)' }}><Icon name="close" size={14} /></span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function TaskFormPanel({ phase, selectedId, onSelect }) {
  const steps = phase === 'details' ? [] : phase === 'targets' ? taskSteps.slice(0, 2) : taskSteps;
  return (
    <aside aria-label="작업 정보" style={{ height: '100%', minHeight: 0, overflowY: 'auto', padding: 16, borderRight: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Input label="작업 이름" size="sm" defaultValue="4층 설비 점검" />
        <Select label="건물" size="sm" value="hq" options={[{ value: 'hq', label: 'LK Robotics HQ' }, { value: 'lab', label: '로봇 연구동' }]} />
        <TaskCategory value="patrol" />
        <div>
          <FieldLabel>반복 횟수</FieldLabel>
          <NumberField aria-label="반복 횟수" size="sm" defaultValue={1} min={1} max={99} style={{ width: '100%' }} />
          <p style={{ margin: '6px 0 0', color: 'var(--color-semantic-label-neutral)', fontSize: 11, lineHeight: 1.45 }}>저장된 steps 전체를 반복 실행합니다.</p>
        </div>
        <Select label="추가할 step_type" size="sm" value="MOVE_TO" options={[{ value: 'MOVE_TO', label: '이동 · MOVE_TO' }, { value: 'WAIT', label: '대기 · WAIT' }, { value: 'DOCK', label: '도킹 · DOCK' }]} />
        <Input label="설명 (선택)" size="sm" placeholder="작업에 대한 설명" />

        <section style={{ paddingTop: 14, borderTop: '1px solid var(--color-semantic-line-normal-normal)' }}>
          <SectionTitle count={steps.length}>steps</SectionTitle>
          <TaskStepRows steps={steps} selectedId={selectedId} onSelect={onSelect} />
        </section>

        {phase === 'parameters' && selectedId != null && (
          <section style={{ paddingTop: 14, borderTop: '1px solid var(--color-semantic-line-normal-normal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <SectionTitle>parameters JSON</SectionTitle>
              <Button size="sm" variant="dark" style={{ marginLeft: 'auto' }}>적용</Button>
            </div>
            <textarea
              aria-label="선택한 작업 단계 파라미터"
              defaultValue={'{\n  "tolerance": 0.15,\n  "floor": "4F"\n}'}
              rows={6}
              spellCheck={false}
              style={{ width: '100%', resize: 'vertical', padding: 10, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--color-semantic-label-strong)', color: 'var(--color-semantic-static-white)', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, boxSizing: 'border-box' }}
            />
          </section>
        )}
      </div>
    </aside>
  );
}

function BuildingTopology({ activeFloor = '4F' }) {
  return (
    <svg viewBox="0 0 620 230" width="100%" height="100%" aria-label="건물 층별 토폴로지" preserveAspectRatio="xMidYMid meet">
      <path d="M178 67 L420 67 L508 114 L420 163 L178 163 L92 114 Z" fill="var(--color-semantic-background-elevated-normal)" stroke="var(--color-semantic-line-solid-normal)" strokeWidth="2" />
      <path d="M178 67 V163 M420 67 V163 M92 114 H508" fill="none" stroke="var(--color-semantic-line-normal-neutral)" strokeWidth="1.5" />
      <path d="M172 128 C240 98 305 138 374 94 C410 72 442 88 474 110" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="4" strokeLinecap="round" />
      {[172, 304, 374, 474].map((x, index) => <circle key={x} cx={x} cy={[128, 113, 94, 110][index]} r="8" fill={index === 3 ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-primary-normal)'} stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="3" />)}
      <text x="68" y="105" fill="var(--color-semantic-label-strong)" fontSize="16" fontWeight="700">5F</text>
      <text x="68" y="145" fill={activeFloor === '4F' ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-strong)'} fontSize="16" fontWeight="700">4F</text>
      <g transform="translate(232 192)">
        <circle cx="0" cy="0" r="5" fill="var(--color-semantic-status-cautionary)" />
        <text x="12" y="4" fill="var(--color-semantic-label-neutral)" fontSize="12">계단</text>
        <circle cx="82" cy="0" r="5" fill="var(--color-semantic-primary-normal)" />
        <text x="94" y="4" fill="var(--color-semantic-label-neutral)" fontSize="12">도어</text>
      </g>
    </svg>
  );
}

function OccupancyMap({ selectedId, targetMode }) {
  return (
    <svg viewBox="0 0 620 390" width="100%" height="100%" aria-label="4층 점유 지도" preserveAspectRatio="xMidYMid meet">
      <rect x="112" y="28" width="396" height="330" fill="var(--color-semantic-background-elevated-normal)" />
      <g fill="none" stroke="var(--color-semantic-label-strong)" strokeWidth="7" strokeLinecap="square">
        <path d="M146 72 H314 V116 H462 V208 H386 V314 H202 V262 H146 Z" />
        <path d="M202 116 V262 M314 72 V208 M314 208 H462 M246 262 V314" />
      </g>
      <path d="M176 286 C234 234 274 252 326 202 C372 158 402 180 448 132" fill="none" stroke="var(--lk-accent-tint-2)" strokeWidth="18" strokeLinecap="round" />
      <path d="M176 286 C234 234 274 252 326 202 C372 158 402 180 448 132" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" />
      {[[176, 286, 'pickup'], [326, 202, 'elevator'], [448, 132, 'dock']].map(([x, y, id], index) => {
        const active = selectedId === id || (targetMode && index === 1);
        return <circle key={id} cx={x} cy={y} r={active ? 11 : 8} fill={active ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-primary-normal)'} stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="4" />;
      })}
    </svg>
  );
}

function TaskContextPanel({ phase, selectedId }) {
  const targetMode = phase === 'targets';
  return (
    <div style={{ display: 'grid', gridTemplateRows: '42% 58%', height: '100%', minWidth: 0, minHeight: 0, background: 'var(--color-semantic-background-normal-alternative)' }}>
      <section style={{ minHeight: 0, padding: '12px 18px', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', boxSizing: 'border-box' }}>
        <BuildingTopology />
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 48, padding: '7px 14px', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}>
          <Icon name="map" size={17} aria-hidden="true" />
          <strong style={{ fontSize: 'var(--label1-size)', color: 'var(--color-semantic-label-strong)' }}>2D 맵 · 4F</strong>
          <div style={{ display: 'inline-flex', gap: 4, marginLeft: 8 }}>
            {['3F', '4F', '5F'].map((floor) => <Button key={floor} size="sm" variant={floor === '4F' ? 'solid' : 'outlined'} color={floor === '4F' ? 'primary' : 'assistive'}>{floor}</Button>)}
          </div>
          <Button size="sm" variant={targetMode ? 'solid' : 'outlined'} color="primary" style={{ marginLeft: 'auto' }}>
            <Icon name="location" size={14} aria-hidden="true" />
            목표 지점 클릭
          </Button>
        </div>
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <Map2DCanvas panEnabled={!targetMode} status="100%" style={surfaceStyle} defaultViewport={{ x: -310, y: -195, z: 1 }}>
            <OccupancyMap selectedId={selectedId} targetMode={targetMode} />
          </Map2DCanvas>
          <div style={{ position: 'absolute', left: 14, top: 14, maxWidth: 'calc(100% - 28px)', padding: '8px 10px', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-semantic-label-neutral)', fontSize: 12, fontWeight: 'var(--fw-semibold)' }}>
            {targetMode ? '랜드마크를 클릭하거나 맵 좌표를 선택해 목표를 추가합니다.' : phase === 'parameters' ? '선택한 단계의 위치와 파라미터를 함께 확인합니다.' : '건물과 층을 선택하면 목표를 추가할 수 있습니다.'}
          </div>
        </div>
      </section>
    </div>
  );
}

export function TaskAuthoringExample({ phase = 'details' }) {
  const initialSelection = phase === 'parameters' ? 'elevator' : phase === 'targets' ? 'pickup' : null;
  const [selectedId, setSelectedId] = React.useState(initialSelection);
  const canSave = phase !== 'details';
  return (
    <StoryFrame maxWidth={1080} height={640}>
      <CanvasEditorShell
        title="새 작업"
        description="robot/task/{robot_id} · category + steps[]"
        headerStart={<HeaderBackButton />}
        toolbar={<Button size="sm" disabled={!canSave}>저장</Button>}
        canvasLabel="작업 생성 본문"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '340px minmax(0, 1fr)', height: '100%', minWidth: 0, minHeight: 0 }}>
          <TaskFormPanel phase={phase} selectedId={selectedId} onSelect={setSelectedId} />
          <TaskContextPanel phase={phase} selectedId={selectedId} />
        </div>
      </CanvasEditorShell>
    </StoryFrame>
  );
}

function MapGraphic({ selected = false, pgm = false }) {
  if (pgm) {
    const cells = Array.from({ length: 96 }, (_, index) => index);
    return (
      <svg viewBox="0 0 620 430" width="100%" height="100%" aria-label="PGM 픽셀 편집 지도" preserveAspectRatio="xMidYMid meet">
        <rect x="90" y="34" width="440" height="356" fill="var(--color-semantic-background-elevated-normal)" />
        {cells.map((cell) => {
          const x = 106 + (cell % 12) * 34;
          const y = 54 + Math.floor(cell / 12) * 38;
          const occupied = cell % 7 === 0 || cell % 13 === 0 || (cell > 38 && cell < 44);
          return <rect key={cell} x={x} y={y} width="32" height="36" fill={occupied ? 'var(--color-semantic-label-strong)' : 'var(--color-semantic-background-normal-alternative)'} opacity={occupied ? 0.86 : 1} />;
        })}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 620 430" width="100%" height="100%" aria-label="오브젝트 편집 지도" preserveAspectRatio="xMidYMid meet">
      <rect x="92" y="32" width="436" height="362" fill="var(--color-semantic-background-elevated-normal)" />
      <g fill="none" stroke="var(--color-semantic-label-strong)" strokeWidth="8">
        <path d="M130 82 H334 V126 H486 V238 H408 V354 H216 V286 H130 Z" />
        <path d="M216 126 V286 M334 82 V238 M334 238 H486 M270 286 V354" />
      </g>
      <path d="M184 302 C250 242 296 274 348 218 C398 164 430 184 472 128" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="5" strokeDasharray="12 10" strokeLinecap="round" />
      <polygon points="150,112 244,112 244,176 150,176" fill="var(--lk-accent-tint-2)" stroke={selected ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'} strokeWidth={selected ? 4 : 2} />
      <polygon points="384,246 468,246 468,312 384,312" fill="var(--color-semantic-status-cautionary-bg)" stroke="var(--color-semantic-status-cautionary)" strokeWidth="2" />
      {[184, 348, 472].map((x, index) => <circle key={x} cx={x} cy={[302, 218, 128][index]} r="9" fill={index === 1 ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-primary-normal)'} stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="4" />)}
    </svg>
  );
}

function PanelSection({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 8, padding: '14px 16px', borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
      <strong style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 0 }}>{title}</strong>
      {children}
    </section>
  );
}

function PropertyValue({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(72px, 0.8fr) minmax(0, 1fr)', gap: 10, alignItems: 'center', minHeight: 30, color: 'var(--color-semantic-label-neutral)', fontSize: 12 }}>
      <span>{label}</span>
      <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right', color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-bold)' }}>{value}</strong>
    </div>
  );
}

function MapPropertiesPanel({ tab, selected, onClear }) {
  if (tab === 'pgm') {
    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <PanelSection title="속성">
          <PropertyValue label="편집 도구" value="브러시" />
          <PropertyValue label="현재 색상" value="벽 (0)" />
          <PropertyValue label="PGM 크기" value="400 × 450" />
          <PropertyValue label="브러시" value="12 px" />
        </PanelSection>
        <PanelSection title="도움말">
          <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 12, lineHeight: 1.55 }}>좌클릭으로 그리기, 휠로 줌, 가운데 버튼으로 이동합니다.</p>
        </PanelSection>
      </div>
    );
  }

  if (!selected) {
    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <PanelSection title="속성">
          <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 13, lineHeight: 1.55 }}>구역, 선, 또는 랜드마크를 선택하세요.</p>
        </PanelSection>
        <PanelSection title="오브젝트">
          <PropertyValue label="구역" value="3" />
          <PropertyValue label="선" value="2" />
          <PropertyValue label="랜드마크" value="4" />
        </PanelSection>
        <PanelSection title="표시 크기">
          <Slider aria-label="랜드마크 표시 크기" defaultValue={5} min={1} max={20} showValue />
        </PanelSection>
      </div>
    );
  }

  return (
    <SelectionInspector
      title="선택 객체"
      item={{ label: 'Zone A-03', kind: '구역', status: 'editable', statusTone: 'signal' }}
      onClearSelection={onClear}
      sections={[
        { title: 'Geometry', fields: [{ label: '유형', value: 'keep-out' }, { label: '꼭짓점', value: 6 }, { label: '면적', value: 24.8, unit: 'm²' }] },
        { title: 'Behavior', fields: [{ label: '속도 제한', value: 0.4, unit: 'm/s', tone: 'warning' }, { label: '계단점', value: 2 }] },
      ]}
      actions={<Button size="sm" variant="outlined" color="assistive"><Icon name="trash" size={14} aria-hidden="true" />삭제</Button>}
    />
  );
}

function DrawToolPanel({ tab, tool }) {
  const pgm = tab === 'pgm';
  return (
    <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, width: pgm ? 270 : 246, padding: 14, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', boxShadow: 'var(--shadow-md)', boxSizing: 'border-box' }}>
      <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 14, fontWeight: 'var(--fw-bold)' }}>{pgm ? 'PGM 편집' : tool === 'line' ? '선 추가' : tool === 'landmark' ? '랜드마크 추가' : '구역 추가'}</strong>
      {pgm ? (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {[['벽', 0, 'var(--color-semantic-label-strong)'], ['미탐색', 205, 'var(--color-semantic-label-assistive)'], ['이동가능', 254, 'var(--color-semantic-background-elevated-normal)']].map(([label, value, color]) => (
            <button key={label} type="button" style={{ display: 'grid', gridTemplateColumns: '18px minmax(0, 1fr) auto', alignItems: 'center', gap: 9, minHeight: 36, padding: '0 10px', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', background: value === 0 ? 'var(--lk-accent-tint-2)' : 'var(--color-semantic-background-normal-alternative)', color: 'var(--color-semantic-label-normal)', fontFamily: 'var(--font-sans)' }}>
              <span aria-hidden="true" style={{ width: 16, height: 16, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 3, background: color }} />
              <span style={{ textAlign: 'left', fontSize: 12 }}>{label}</span>
              <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 11 }}>{value}</span>
            </button>
          ))}
          <div>
            <FieldLabel>브러시 크기</FieldLabel>
            <Slider aria-label="브러시 크기" defaultValue={12} min={1} max={20} showValue />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <Input label="구역 이름" size="sm" defaultValue="금지구역 A" />
          <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 12, lineHeight: 1.45 }}>지도를 클릭하여 꼭짓점을 추가하세요. 2개 점 추가됨</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Button size="sm" variant="outlined" color="assistive">취소</Button>
            <Button size="sm" disabled>완료</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PointCloudPlot() {
  const points = React.useMemo(() => Array.from({ length: 130 }, (_, index) => ({ x: (index * 37) % 100, y: (index * 61) % 100, r: 0.4 + (index % 5) * 0.12 })), []);
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" aria-label="PCD 3D 포인트">
      {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={point.r} fill={index % 19 === 0 ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-inverse-label)'} opacity={index % 19 === 0 ? 0.82 : 0.38} />)}
      <rect x="26" y="24" width="30" height="34" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="1.4" strokeDasharray="3 2" />
      <path d="M26 24 L42 16 L72 16 L56 24 M56 24 L72 16 L72 50 L56 58" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="1" />
    </svg>
  );
}

function PcdAssistPanel({ onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 300, minHeight: 0, borderLeft: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--lk-stage-to)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 42, padding: '0 10px 0 12px', borderBottom: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--lk-stage-from)', color: 'var(--color-semantic-inverse-label)', boxSizing: 'border-box' }}>
        <Icon name="lidar" size={16} aria-hidden="true" />
        <strong style={{ fontSize: 13 }}>3D 편집</strong>
        <StatusBadge
          tone="online"
          style={{
            background: 'var(--material-control-dimmer)',
            color: 'var(--color-semantic-inverse-label)',
          }}
        >
          1.2M pt
        </StatusBadge>
        <Button size="sm" variant="on-dark" iconOnly aria-label="PCD 3D 패널 닫기" title="PCD 3D 패널 닫기" onClick={onClose} style={{ marginLeft: 'auto' }}>
          <Icon name="close" size={14} aria-hidden="true" />
        </Button>
      </div>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Scene3DFrame title="POINT CLOUD" status="38 FPS" style={surfaceStyle}>
          <PointCloudPlot />
        </Scene3DFrame>
      </div>
      <div style={{ display: 'grid', gap: 8, padding: 10, borderTop: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--lk-stage-from)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', alignItems: 'center', gap: 8, color: 'var(--color-semantic-inverse-label)', fontSize: 11 }}>
          <span>포인트 크기</span>
          <input aria-label="PCD 포인트 크기" type="range" defaultValue="5" min="1" max="20" style={{ width: '100%' }} />
          <span>0.05</span>
        </div>
        <div style={{ display: 'flex', gap: 12, color: 'var(--color-semantic-inverse-label)', fontSize: 10 }}>
          <span>파랑 · 일반</span><span>주황 · 선택</span><span>흰색 · 꼭짓점</span>
        </div>
      </div>
    </div>
  );
}

function MapToolRail({ tab, tool, onToolChange, pcdOpen, onPcdToggle, selected }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <EditorToolbar label={tab === 'pgm' ? 'PGM 편집 도구' : '오브젝트 편집 도구'} items={tab === 'pgm' ? pgmTools : objectTools} value={tool} onChange={onToolChange} />
      {tab === 'objects' && (
        <div style={{ display: 'grid', gap: 5, marginTop: 'auto' }}>
          <Button size="sm" variant={pcdOpen ? 'solid' : 'outlined'} color={pcdOpen ? 'primary' : 'assistive'} iconOnly aria-pressed={pcdOpen} aria-label="PCD 3D 패널" title="PCD 3D 패널" onClick={onPcdToggle}>
            <Icon name="lidar" size={17} aria-hidden="true" />
          </Button>
          {selected && (
            <Button size="sm" variant="outlined" color="assistive" iconOnly aria-label="선택 객체 삭제" title="선택 객체 삭제">
              <Icon name="trash" size={17} aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function MapCanvasArea({ tab, tool, selected, pcdOpen, onPcdClose, showToolPanel }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: pcdOpen && tab === 'objects' ? 'minmax(0, 1fr) minmax(300px, 45%)' : 'minmax(0, 1fr)', height: '100%', minWidth: 0, minHeight: 0 }}>
      <div style={{ position: 'relative', minWidth: 0, minHeight: 0 }}>
        <Map2DCanvas panEnabled={tool === 'select'} status={tab === 'pgm' ? '120%' : '152%'} style={surfaceStyle} defaultViewport={{ x: -310, y: -215, z: 1 }}>
          <MapGraphic selected={selected} pgm={tab === 'pgm'} />
        </Map2DCanvas>
        {showToolPanel && <DrawToolPanel tab={tab} tool={tool} />}
      </div>
      {pcdOpen && tab === 'objects' && <PcdAssistPanel onClose={onPcdClose} />}
    </div>
  );
}

export function MapEditorExample({ initialState = 'idle' }) {
  const initialTab = initialState === 'pgm' ? 'pgm' : 'objects';
  const initialTool = initialState === 'draw' || initialState === 'pcd' ? 'polygon' : initialState === 'pgm' ? 'brush' : 'select';
  const [tab, setTab] = React.useState(initialTab);
  const [tool, setTool] = React.useState(initialTool);
  const [selected, setSelected] = React.useState(initialState === 'selected' || initialState === 'pcd');
  const [pcdOpen, setPcdOpen] = React.useState(initialState === 'pcd');
  const showToolPanel = tab === 'pgm' || tool !== 'select';
  const dirty = initialState !== 'idle' || tool !== 'select';

  const changeTab = (next) => {
    setTab(next);
    setTool(next === 'pgm' ? 'brush' : 'select');
    setPcdOpen(false);
    setSelected(false);
  };

  return (
    <StoryFrame height={620}>
      <CanvasEditorShell
        title="rbt-002_20260225_171927"
        description={tab === 'pgm' ? 'PGM 400 × 450' : '3개 구역, 2개 선, 4개 랜드마크'}
        headerStart={<HeaderBackButton />}
        toolbar={(
          <CanvasEditorCommandBar canUndo={dirty} canRedo={false} onUndo={() => {}} onRedo={() => {}}>
            <Button size="sm" disabled={!dirty}>{tab === 'pgm' ? 'PGM 저장' : '오브젝트 저장'}</Button>
          </CanvasEditorCommandBar>
        )}
        subheader={(
          <Tabs
            items={[{ value: 'objects', label: '오브젝트 편집' }, { value: 'pgm', label: 'PGM 편집' }]}
            value={tab}
            onChange={changeTab}
            size="small"
            style={{ padding: '0 16px', background: 'var(--color-semantic-background-elevated-normal)' }}
          />
        )}
        tools={<MapToolRail tab={tab} tool={tool} onToolChange={setTool} pcdOpen={pcdOpen} onPcdToggle={() => setPcdOpen((open) => !open)} selected={selected} />}
        panel={<MapPropertiesPanel tab={tab} selected={selected} onClear={() => setSelected(false)} />}
        panelMode="docked"
        panelWidth={264}
        canvasLabel={tab === 'pgm' ? 'PGM 편집 캔버스' : '오브젝트 편집 캔버스'}
      >
        <MapCanvasArea tab={tab} tool={tool} selected={selected} pcdOpen={pcdOpen} onPcdClose={() => setPcdOpen(false)} showToolPanel={showToolPanel} />
      </CanvasEditorShell>
    </StoryFrame>
  );
}

const contractLayers = [
  { id: 'base', label: 'base map', description: 'read only', locked: true, color: 'var(--color-semantic-label-assistive)' },
  { id: 'route', label: 'editable route', description: 'active layer', count: 8, color: 'var(--color-semantic-primary-normal)' },
  { id: 'guides', label: 'snap guides', count: 2, color: 'var(--color-semantic-status-cautionary)' },
];

export function ShellContractExample() {
  const [tool, setTool] = React.useState('select');
  const [layer, setLayer] = React.useState('route');
  return (
    <StoryFrame maxWidth={980} height={480}>
      <CanvasEditorShell
        title="facility_map.pgm"
        description="중립 셸 구성"
        toolbar={<CanvasEditorCommandBar canUndo onUndo={() => {}} canRedo={false} onRedo={() => {}} />}
        tools={<EditorToolbar items={objectTools.slice(0, 3)} value={tool} onChange={setTool} />}
        layers={<LayerPanel title="레이어" layers={contractLayers} activeLayerId={layer} onActiveLayerChange={setLayer} />}
        panel={<SelectionInspector item={{ label: 'Zone A-03', kind: '구역', status: 'draft', statusTone: 'signal' }} sections={[{ title: 'Geometry', fields: [{ label: 'Layer', value: layer }, { label: 'Tool', value: tool }] }]} />}
        panelWidth={250}
        layerPanelWidth={220}
      >
        <Map2DCanvas panEnabled={tool === 'select'} status="100%" style={surfaceStyle} defaultViewport={{ x: -310, y: -215, z: 1 }}>
          <MapGraphic selected />
        </Map2DCanvas>
      </CanvasEditorShell>
    </StoryFrame>
  );
}
