import React from 'react';
import { userEvent } from 'storybook/test';
import { Button, DescriptionList, PrimaryDetail, StatusBadge, TextButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const ITEMS = [
  { id: 'AMR-01', name: '포장 라인 운반 로봇', zone: 'A-12', state: '운행 중' },
  { id: 'AMR-07', name: '긴 이름을 가진 출하장 자율 이동 로봇', zone: 'C-04', state: '점검 필요' },
  { id: 'AMR-12', name: '검수 구역 로봇', zone: 'B-09', state: '대기' },
];

const stateTone = (state) => (state === '운행 중' ? 'positive' : state === '점검 필요' ? 'cautionary' : 'neutral');

function ItemList({ selectedId, onSelect, refs }) {
  return (
    <div role="list" aria-label="로봇 목록" style={{ display: 'grid', minWidth: 0 }}>
      <style>
        {`.lk-story-primary-item { background: transparent; }
        .lk-story-primary-item:hover { background: var(--color-semantic-fill-normal); }
        .lk-story-primary-item[aria-current="true"] { background: var(--color-semantic-primary-surface-normal); box-shadow: inset 2px 0 0 var(--color-semantic-primary-normal); }`}
      </style>
      {ITEMS.map((item) => (
        <div key={item.id} role="listitem" style={{ minWidth: 0 }}>
          <button
            ref={(node) => { refs.current[item.id] = node; }}
            type="button"
            className="lk-story-primary-item"
            aria-current={selectedId === item.id ? 'true' : undefined}
            onClick={() => onSelect(item.id)}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 'var(--space-2)', width: '100%', minWidth: 0, padding: 'var(--space-4)', border: 'none', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', color: 'var(--color-semantic-label-normal)', textAlign: 'left', cursor: 'pointer' }}
          >
            <span style={{ display: 'grid', gap: 3, minWidth: 0 }}>
              <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--body2-size)' }}>{item.name}</strong>
              <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{item.id} · {item.zone}</span>
            </span>
            <StatusBadge tone={stateTone(item.state)}>{item.state}</StatusBadge>
          </button>
        </div>
      ))}
    </div>
  );
}

function Detail({ item, actionRef }) {
  if (!item) return null;
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
      <DescriptionList
        variant="stacked"
        items={[
          { term: 'ID', description: item.id },
          { term: '운영 구역', description: item.zone },
          { term: '현재 상태', description: <StatusBadge tone={stateTone(item.state)}>{item.state}</StatusBadge> },
          { term: '마지막 통신', description: '오늘 14:32' },
        ]}
      />
      <TextButton ref={actionRef} size="sm" style={{ justifySelf: 'start' }}>전체 기록 보기</TextButton>
    </div>
  );
}

function PrimaryDetailDemo({ mode = 'inline' }) {
  const [selectedId, setSelectedId] = React.useState('AMR-01');
  const itemRefs = React.useRef({});
  const detailActionRef = React.useRef(null);
  const selected = ITEMS.find((item) => item.id === selectedId) ?? null;
  const returnFocusRef = React.useMemo(
    () => ({ get current() { return selectedId ? itemRefs.current[selectedId] : null; } }),
    [selectedId]
  );
  return (
    <div data-testid={`${mode}-primary-detail-surface`} style={{ width: mode === 'overlay' ? 320 : 'min(100%, 880px)', maxWidth: '100%', minHeight: 300, overflow: 'hidden', border: 'var(--component-card-border)', borderRadius: 'var(--component-card-radius)', background: 'var(--color-semantic-background-elevated-normal)' }}>
      <PrimaryDetail
        mode={mode}
        detailOpen={selected != null}
        detailTitle={selected?.name}
        detailWidth={mode === 'overlay' ? 320 : 360}
        onDetailClose={() => setSelectedId(null)}
        closeLabel="상세 닫기"
        initialFocusRef={detailActionRef}
        returnFocusRef={returnFocusRef}
        primary={<ItemList selectedId={selectedId} onSelect={setSelectedId} refs={itemRefs} />}
        detail={<Detail item={selected} actionRef={detailActionRef} />}
        detailFooter={<Button size="sm" variant="secondary">정비 요청</Button>}
        style={{ minHeight: 300 }}
      />
    </div>
  );
}

const meta = {
  title: 'LDS Product/Layout/Primary Detail',
  component: PrimaryDetail,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-layout-primary-detail--inline-detail',
      eyebrow: 'Product / Primary Detail',
      title: '사용자가 목록의 선택 맥락을 잃지 않고 상세 정보를 확인합니다',
      description:
        '목록·표에서 선택한 항목의 상세를 넓은 화면에서는 병렬 영역, 좁은 화면에서는 focus-managed overlay로 보여 줄 때 적합합니다. 독립적인 탐색 목적지나 긴 편집 흐름에는 PrimaryDetail 대신 전용 상세 페이지를 사용하세요.',
    },
    docs: {
      description: {
        component: '목록·표 같은 primary 콘텐츠의 선택 상세를 넓은 화면 region 또는 좁은 화면 focus-managed 서랍 패널로 표현하는 controlled 레이아웃입니다.',
      },
    },
  },
};

export default meta;

export const InlineDetail = {
  name: '개요',
  parameters: storyDescription(
    '넓은 화면에서 로봇 목록과 선택 상세를 나란히 유지하는 상황입니다. 선택 변경이 detail region에 즉시 반영되고 닫은 뒤 선택 항목으로 초점이 돌아오는지 확인하세요.',
  ),
  render: () => <PrimaryDetailDemo />,
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector('[data-testid="inline-primary-detail-surface"]');
    const detail = canvasElement.querySelector('[role="region"][aria-labelledby]');
    const second = [...canvasElement.querySelectorAll('[role="listitem"] button')].find((item) => item.textContent?.includes('AMR-07'));
    if (!surface || !detail || !second || !detail.textContent?.includes('정비 요청')) throw new Error('Inline primary-detail must expose named primary/detail regions and its footer slot.');
    await userEvent.click(second);
    const close = canvasElement.querySelector('button[aria-label="상세 닫기"]');
    if (!close || !detail.textContent?.includes('AMR-07')) throw new Error('Selecting a primary item must update the controlled detail in place.');
    await userEvent.click(close);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (canvasElement.querySelector('[role="region"][aria-labelledby]') || canvasElement.ownerDocument.activeElement !== second) {
      throw new Error('Closing inline detail must remove the region and restore focus to the selected item.');
    }
    await userEvent.click(second);
    if (!canvasElement.querySelector('[role="region"][aria-labelledby]')) {
      throw new Error('The selected primary item must reopen the inline detail after the focus-return check.');
    }
  },
};

export const NarrowOverlayDetail = {
  name: '반응형 · 좁은 폭의 겹침형 상세 영역',
  parameters: storyDescription(
    '320px 화면에서 선택 상세를 modal overlay로 전환하는 상황입니다. primary 목록이 넘치지 않고 dialog가 선택 맥락·footer·닫기 라벨을 유지하며 초점을 복원하는지 확인하세요.',
  ),
  render: () => <PrimaryDetailDemo mode="overlay" />,
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector('[data-testid="overlay-primary-detail-surface"]');
    const dialog = canvasElement.ownerDocument.querySelector('[role="dialog"][aria-modal="true"]');
    if (!surface || !dialog || surface.scrollWidth > surface.clientWidth + 1) {
      throw new Error('Overlay primary content must fit 320px and expose detail as a modal dialog.');
    }
    const close = dialog.querySelector('button[aria-label="상세 닫기"]');
    const first = [...canvasElement.querySelectorAll('[role="listitem"] button')].find((item) => item.textContent?.includes('AMR-01'));
    if (!close || !first || !dialog.textContent?.includes('AMR-01') || !dialog.textContent?.includes('정비 요청')) throw new Error('Drawer detail must preserve the selected item context, close label, and footer.');
    await userEvent.click(close);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (canvasElement.ownerDocument.querySelector('[role="dialog"][aria-modal="true"]') || canvasElement.ownerDocument.activeElement !== first) {
      throw new Error('Drawer dismiss must close the controlled detail and restore the selected trigger.');
    }
    await userEvent.click(first);
    if (!canvasElement.ownerDocument.querySelector('[role="dialog"][aria-modal="true"]')) {
      throw new Error('The selected primary item must reopen overlay detail after the focus-return check.');
    }
  },
};
