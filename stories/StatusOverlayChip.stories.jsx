import React from 'react';
import { Button, OverlayStatusChip } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Overlay Status Chip',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-overlay-status-chip--overlay-status-chips',
      eyebrow: 'Core / Status',
      title: 'OverlayStatusChip은 떠 있는 표면의 상태를 레이아웃을 밀지 않고 말합니다',
      description:
        '캔버스·뷰어·제어 영역이 떠 있는 채로 비활성이거나 배경 작업 중일 때 그 이유를 표면 위에 얹어 말할 때 적합합니다. 흐름 속 안내에는 Banner나 Callout을, 화면 단위의 일시 알림에는 Notification을 사용하세요.',
    },
    docs: {
      description: {
        component:
          '상호작용 표면 위에 앵커되는 비차단 상태 알약 패턴입니다. 등장·소멸이 레이아웃에 참여하지 않고 포인터를 가로채지 않으며, inert한 표면을 설명할 때는 그 서브트리 밖에 둡니다.',
      },
    },
  },
};

export default meta;

/* A stand-in interaction surface: the chip's whole reason to exist is a
   surface whose geometry must not move, so every story renders one. */
function DemoSurface({ children, inert = true, height = 180 }) {
  return (
    <div style={{ position: 'relative', width: 'min(320px, 100%)' }}>
      {children}
      <div
        inert={inert ? true : undefined}
        style={{
          height,
          display: 'grid',
          placeItems: 'center',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-elevated-normal)',
          color: 'var(--color-semantic-label-disable)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--label1-size)',
        }}
      >
        <Button variant="flat" disabled>표면 컨트롤</Button>
      </div>
    </div>
  );
}

export const OverlayStatusChips = {
  name: '개요',
  parameters: storyDescription(
    '대기 중이라 비활성인 제어 표면 위에 중립 칩이 떠 있는 기본 구성입니다. 칩이 표면의 레이아웃에 참여하지 않는지, inert한 표면 밖에서 스크린 리더에 계속 읽히는지, 포인터가 칩을 통과하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ fontFamily: 'var(--font-sans)' }}>
      <DemoSurface>
        <OverlayStatusChip>연속 활성화 입력 대기</OverlayStatusChip>
      </DemoSurface>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const chip = canvasElement.querySelector('[data-overlay-status-chip]');
    if (!chip) throw new Error('OverlayStatusChip must render its data hook.');
    const styles = canvasElement.ownerDocument.defaultView.getComputedStyle(chip);
    if (styles.position !== 'absolute' || styles.pointerEvents !== 'none') {
      throw new Error('The chip must stay absolutely positioned and pointer-transparent — layout and input non-participation are its contract.');
    }
    if (chip.getAttribute('role') !== 'status' || chip.closest('[inert]')) {
      throw new Error('The chip must be a status live region outside any inert subtree.');
    }
  },
};

export const Tones = {
  name: '변형·상태 · 톤',
  parameters: storyDescription(
    '중립·주의·부정 톤을 비교합니다. 휴지 상태(중립)는 상태색 없이 조용한지, 격상된 톤은 가족 공용 글리프(삼각 경고·원형 닫힘)와 색을 함께 쓰는지, 긴 라벨이 표면 폭 안에서 말줄임되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', fontFamily: 'var(--font-sans)' }}>
      <DemoSurface>
        <OverlayStatusChip>연속 활성화 입력 대기</OverlayStatusChip>
      </DemoSurface>
      <DemoSurface>
        <OverlayStatusChip tone="cautionary">제어 포커스 해제 · 표면을 다시 선택하세요</OverlayStatusChip>
      </DemoSurface>
      <DemoSurface>
        <OverlayStatusChip tone="negative" style={{ top: 'auto', bottom: 'var(--space-4)' }}>
          동기화 실패 · 마지막 저장 상태 표시 중
        </OverlayStatusChip>
      </DemoSurface>
    </main>
  ),
};
