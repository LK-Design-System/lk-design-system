import React from 'react';
import { waitFor } from 'storybook/test';
import { Button, Sheet } from '../src/index.js';
import {
  SheetCard as SheetCardStory,
  SheetOpen as SheetOpenStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const optionStyle = {
  width: '100%',
  minHeight: 44,
  padding: '10px 4px',
  border: 'none',
  borderBottom: '1px solid var(--color-semantic-line-solid-normal)',
  background: 'transparent',
  color: 'var(--color-semantic-label-normal)',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
};

function SheetOpenExample() {
  const [open, setOpen] = React.useState(true);
  return (
    <main style={{ minHeight: 180 }}>
      <Button onClick={() => setOpen(true)}>모바일 액션 열기</Button>
      <Sheet
        open={open}
        title="모바일 액션"
        onClose={() => setOpen(false)}
        footer={<Button variant="solid" color="primary" full onClick={() => setOpen(false)}>선택</Button>}
      >
        바텀 시트는 작은 화면에서 선택지나 보조 액션을 담습니다.
      </Sheet>
    </main>
  );
}

function NarrowSheetFixture() {
  const [open, setOpen] = React.useState(true);
  return (
    <main style={{ minHeight: 240 }}>
      <Button onClick={() => setOpen(true)}>정렬과 표시 옵션 열기</Button>
      <Sheet
        open={open}
        title="긴 항목 이름을 포함한 장치 목록 정렬과 표시 옵션"
        onClose={() => setOpen(false)}
        footer={(
          <>
            <Button variant="outlined" color="assistive" full onClick={() => setOpen(false)}>취소</Button>
            <Button variant="solid" color="primary" full onClick={() => setOpen(false)}>선택 적용</Button>
          </>
        )}
      >
        <div style={{ display: 'grid' }}>
          <button type="button" style={optionStyle}>최근 점검 결과가 변경된 장치부터 표시</button>
          <button type="button" style={optionStyle}>운영 그룹과 장치 이름순으로 표시</button>
          <button type="button" style={optionStyle}>오류 또는 주의 상태가 있는 장치 우선</button>
        </div>
      </Sheet>
    </main>
  );
}

const meta = {
  title: 'LDS Product/Overlay/Sheet',
  tags: ['autodocs'],
  component: Sheet,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-sheet--sheet-open',
      eyebrow: 'Product / Sheet',
      title: '사용자가 작은 화면에서 선택지와 보조 작업을 손이 닿는 위치에서 처리합니다',
      description:
        '모바일에서 짧은 선택 목록이나 보조 액션을 하단 패널로 제공할 때 적합합니다. 긴 편집 폼이나 데스크톱의 지속적인 보조 패널에는 Sheet 대신 전용 화면 또는 Drawer를 사용하세요.',
    },
    docs: {
      description: {
        component: '작은 화면에서 선택지와 보조 액션을 담는 모바일 하단 패널 Sheet 패턴입니다. 초점 순환·복원 계약 검증 스토리는 사이드 패널 페이지가 소유합니다.',
      },
    },
  },
};

export default meta;

export const SheetOpen = {
  ...SheetOpenStory,
  name: '개요',
  parameters: {
    ...SheetOpenStory.parameters,
    ...storyDescription(
      '작은 화면에서 보조 액션을 선택하는 기본 하단 패널 상황입니다. 제목·본문·주 액션이 손이 닿는 순서로 배치되고 닫기와 선택 결과가 분명한지 확인하세요.',
    ),
  },
  render: () => <SheetOpenExample />,
};

export const SheetNarrowContent = {
  name: '반응형 · 좁은 폭과 긴 콘텐츠',
  parameters: storyDescription(
    '좁은 viewport에서 긴 제목과 선택지, 두 개의 footer 액션을 보여 주는 상황입니다. 내용이 가로로 넘치지 않고 제목과 버튼 라벨이 의미를 잃지 않게 줄바꿈되는지 확인하세요.',
  ),
  render: () => <NarrowSheetFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    await waitFor(() => {
      const sheet = canvasElement.querySelector('[role="dialog"]');
      if (!sheet || !sheet.contains(ownerDocument.activeElement)) {
        throw new Error('The narrow Sheet must move focus into its surface.');
      }
    });
    const sheet = canvasElement.querySelector('[role="dialog"]');
    const title = ownerDocument.getElementById(sheet.getAttribute('aria-labelledby'));
    const rect = sheet.getBoundingClientRect();
    if (!title?.textContent?.includes('표시 옵션') || rect.left < 0 || rect.right > ownerDocument.defaultView.innerWidth) {
      throw new Error('The narrow Sheet title and surface must remain inside the viewport.');
    }
    if (sheet.scrollWidth > sheet.clientWidth || ownerDocument.documentElement.scrollWidth > ownerDocument.documentElement.clientWidth) {
      throw new Error('The narrow Sheet must not create horizontal overflow.');
    }
  },
};

export const SheetCard = { ...SheetCardStory, name: 'Sheet card parity', tags: ['!dev', 'visual-parity'] };
