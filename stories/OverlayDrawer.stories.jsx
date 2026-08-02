import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Drawer, Sheet } from '../src/index.js';
import {
  DrawerCard as DrawerCardStory,
  DrawerOpen as DrawerOpenStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  height: 'var(--component-input-height)',
  padding: '0 var(--component-input-padding-x)',
  border: 'var(--component-input-border-width) solid var(--component-input-border-color)',
  borderRadius: 'var(--component-input-radius)',
  background: 'var(--component-input-bg)',
  color: 'var(--component-input-text-color)',
  font: 'inherit',
};

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

function DrawerOpenExample() {
  const [open, setOpen] = React.useState(true);
  return (
    <main style={{ minHeight: 180 }}>
      <Button onClick={() => setOpen(true)}>필터 열기</Button>
      <Drawer
        open={open}
        title="필터"
        subtitle="현재 문서 목록에 적용할 조건을 선택합니다."
        onClose={() => setOpen(false)}
        footer={<Button variant="solid" color="primary" onClick={() => setOpen(false)}>적용</Button>}
      >
        그룹, 상태, 유형을 좁히는 사이드 패널입니다.
      </Drawer>
    </main>
  );
}

function DrawerSheetFocusFixture() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const drawerInitialRef = React.useRef(null);
  const sheetInitialRef = React.useRef(null);

  return (
    <main style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      <Button data-testid="drawer-trigger" onClick={() => setDrawerOpen(true)}>장치 필터 열기</Button>
      <Button data-testid="sheet-trigger" variant="secondary" onClick={() => setSheetOpen(true)}>정렬 선택 열기</Button>
      <Drawer
        open={drawerOpen}
        title="장치 상태와 운영 그룹 필터"
        subtitle="현재 장치 목록에 적용하며 저장된 보기에는 영향을 주지 않습니다."
        initialFocusRef={drawerInitialRef}
        onClose={() => setDrawerOpen(false)}
        footer={(
          <>
            <Button variant="outlined" color="assistive" onClick={() => setDrawerOpen(false)}>초기화</Button>
            <Button data-testid="drawer-last-action" variant="solid" color="primary" onClick={() => setDrawerOpen(false)}>필터 적용</Button>
          </>
        )}
      >
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
            장치 또는 운영 그룹 검색
            <input ref={drawerInitialRef} data-testid="drawer-initial-focus" placeholder="예: 동관 2층" style={fieldStyle} />
          </label>
          <p style={{ margin: 0 }}>긴 라벨과 여러 상태가 있어도 header, body, footer의 읽기 순서를 유지합니다.</p>
        </div>
      </Drawer>
      <Sheet
        open={sheetOpen}
        title="장치 목록 정렬"
        initialFocusRef={sheetInitialRef}
        onClose={() => setSheetOpen(false)}
        footer={(
          <>
            <Button variant="outlined" color="assistive" full onClick={() => setSheetOpen(false)}>취소</Button>
            <Button data-testid="sheet-last-action" variant="solid" color="primary" full onClick={() => setSheetOpen(false)}>적용</Button>
          </>
        )}
      >
        <div style={{ display: 'grid' }}>
          <button ref={sheetInitialRef} data-testid="sheet-initial-focus" type="button" style={optionStyle}>최근 업데이트순</button>
          <button type="button" style={optionStyle}>장치 이름순</button>
          <button type="button" style={optionStyle}>주의 상태 우선</button>
        </div>
      </Sheet>
    </main>
  );
}

const meta = {
  title: 'LDS Product/Overlay/Drawer',
  tags: ['autodocs'],
  component: Drawer,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-drawer--drawer-open',
      eyebrow: 'Product / Drawer',
      title: '사용자가 현재 화면을 유지한 채 보조 설정과 필터를 편집합니다',
      description:
        '넓은 화면에서 필터·속성·상세처럼 주 콘텐츠를 보조하는 작업을 옆 패널에 유지할 때 적합합니다. 작은 화면의 짧은 선택에는 Drawer 대신 Sheet를, 집중이 필요한 확인에는 Dialog를 사용하세요.',
    },
    docs: {
      description: {
        component: '보조 작업을 담는 사이드 패널 Drawer 패턴입니다. 사이드 패널과 모바일 하단 패널이 공유하는 초점 순환·복원 계약의 검증 스토리는 이 페이지가 소유합니다.',
      },
    },
  },
};

export default meta;

export const DrawerOpen = {
  ...DrawerOpenStory,
  name: '개요',
  parameters: {
    ...DrawerOpenStory.parameters,
    ...storyDescription(
      '목록을 보면서 필터 조건을 조정하는 사이드 패널 상황입니다. 제목·본문·적용 액션의 읽기 순서와 닫기 경로가 분명하고 주 콘텐츠 맥락이 유지되는지 확인하세요.',
    ),
  },
  render: () => <DrawerOpenExample />,
};

export const DrawerSheetFocusContract = {
  name: '상호작용 · 초점 순환과 복원',
  parameters: storyDescription(
    'Drawer와 Sheet를 각각 열어 키보드 초점 경계를 검증하는 상황입니다. initialFocusRef, 정방향·역방향 초점 순환, Escape 닫기, 각 트리거로의 복원을 확인하세요.',
  ),
  render: () => <DrawerSheetFocusFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const drawerTrigger = canvasElement.querySelector('[data-testid="drawer-trigger"]');
    const sheetTrigger = canvasElement.querySelector('[data-testid="sheet-trigger"]');
    if (!drawerTrigger || !sheetTrigger) throw new Error('Drawer and Sheet require visible invokers.');

    await userEvent.click(drawerTrigger);
    await waitFor(() => {
      if (ownerDocument.activeElement !== canvasElement.querySelector('[data-testid="drawer-initial-focus"]')) {
        throw new Error('Drawer must honor initialFocusRef.');
      }
    });

    const drawer = canvasElement.querySelector('[role="dialog"]');
    const drawerTitle = drawer && ownerDocument.getElementById(drawer.getAttribute('aria-labelledby'));
    const drawerSubtitle = drawer && ownerDocument.getElementById(drawer.getAttribute('aria-describedby'));
    const drawerFirst = drawer?.querySelector('button[aria-label="닫기"]');
    const drawerLast = drawer?.querySelector('[data-testid="drawer-last-action"]');
    if (!drawerTitle?.textContent?.includes('운영 그룹') || !drawerSubtitle?.textContent?.includes('저장된 보기') || !drawerFirst || !drawerLast) {
      throw new Error('Drawer must expose and associate its visible title, short subtitle, and boundary actions.');
    }
    drawerLast.focus();
    await userEvent.tab();
    if (ownerDocument.activeElement !== drawerFirst) throw new Error('Tab must wrap inside Drawer.');
    drawerFirst.focus();
    await userEvent.tab({ shift: true });
    if (ownerDocument.activeElement !== drawerLast) throw new Error('Shift+Tab must wrap inside Drawer.');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]') || ownerDocument.activeElement !== drawerTrigger) {
        throw new Error('Escape must close Drawer and restore its invoker.');
      }
    });

    await userEvent.click(sheetTrigger);
    await waitFor(() => {
      if (ownerDocument.activeElement !== canvasElement.querySelector('[data-testid="sheet-initial-focus"]')) {
        throw new Error('Sheet must honor initialFocusRef.');
      }
    });

    const sheet = canvasElement.querySelector('[role="dialog"]');
    const sheetFirst = sheet?.querySelector('[data-testid="sheet-initial-focus"]');
    const sheetLast = sheet?.querySelector('[data-testid="sheet-last-action"]');
    if (!sheetFirst || !sheetLast) throw new Error('Sheet requires visible first and last actions.');
    sheetLast.focus();
    await userEvent.tab();
    if (ownerDocument.activeElement !== sheetFirst) throw new Error('Tab must wrap inside Sheet.');
    sheetFirst.focus();
    await userEvent.tab({ shift: true });
    if (ownerDocument.activeElement !== sheetLast) throw new Error('Shift+Tab must wrap inside Sheet.');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]') || ownerDocument.activeElement !== sheetTrigger) {
        throw new Error('Escape must close Sheet and restore its invoker.');
      }
    });

    await userEvent.click(drawerTrigger);
    await waitFor(() => {
      if (ownerDocument.activeElement !== canvasElement.querySelector('[data-testid="drawer-initial-focus"]')) {
        throw new Error('The representative Drawer must remain open for visual review.');
      }
    });
  },
};

export const DrawerCard = { ...DrawerCardStory, name: 'Drawer card parity', tags: ['!dev', 'visual-parity'] };
