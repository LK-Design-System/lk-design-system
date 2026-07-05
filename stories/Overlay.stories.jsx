import React from 'react';
import {
  Alert,
  Button,
  CommandPalette,
  Dimmer,
  Drawer,
  DropdownMenu,
  HoverCard,
  Icon,
  Lightbox,
  Modal,
  Popover,
  Sheet,
  Toast,
  ToastStack,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/오버레이',
  parameters: {
    docs: {
      description: {
        component: '모달, 드로어, 메뉴, 팝오버, 토스트처럼 화면 위에 뜨는 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

const sampleImage =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 640 360%22%3E%3Crect width=%22640%22 height=%22360%22 fill=%22%230E1329%22/%3E%3Cpath d=%22M70 260 220 120l110 86 90-62 150 116%22 fill=%22none%22 stroke=%22%232F6FAE%22 stroke-width=%2218%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3Ccircle cx=%22484%22 cy=%2294%22 r=%2242%22 fill=%22%23527F62%22/%3E%3C/svg%3E';

export const AnchoredAndToast = {
  name: '앵커드 오버레이와 토스트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 860 }}>
      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <DropdownMenu
          trigger={<Button variant="ghost">드롭다운</Button>}
          items={[
            { label: '미션 복제', icon: <Icon name="document" size={16} /> },
            { label: '삭제', icon: <Icon name="trash" size={16} />, danger: true },
          ]}
        />
        <Popover trigger={<Button variant="ghost">팝오버</Button>}>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong>운영 설정</strong>
            <span style={{ color: 'var(--label-neutral)', fontSize: 13 }}>앵커 기준으로 열리는 보조 패널입니다.</span>
          </div>
        </Popover>
        <HoverCard trigger={<Button variant="ghost">호버 카드</Button>}>
          <strong>AMR-07</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--label-neutral)' }}>배터리 86%, 순찰 모드</p>
        </HoverCard>
      </section>

      <section style={{ position: 'relative', minHeight: 180, display: 'grid', placeItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)' }}>
        <span style={{ color: 'var(--label-neutral)' }}>Dimmer는 부모 영역을 차단합니다.</span>
        <Dimmer open blur>
          <span style={{ color: 'var(--text-on-inverse)', fontWeight: 'var(--fw-bold)' }}>처리 중</span>
        </Dimmer>
      </section>

      <ToastStack position="bottom-right">
        <Toast tone="success" action={<Button size="sm" variant="on-dark">실행 취소</Button>}>
          미션이 저장되었습니다.
        </Toast>
      </ToastStack>
    </main>
  ),
};

export const AlertOpen = {
  name: 'Alert 열림',
  render: () => (
    <Alert open title="미션을 배포할까요?" cancelLabel="취소" confirmLabel="배포">
      선택한 로봇 3대에 현재 미션을 전송합니다.
    </Alert>
  ),
};

export const ModalOpen = {
  name: 'Modal 열림',
  render: () => (
    <Modal
      open
      title="로봇 상세"
      footer={<Button size="sm">확인</Button>}
    >
      상세 다이얼로그는 헤더, 본문, 푸터를 분리해 비교적 긴 정보를 담습니다.
    </Modal>
  ),
};

export const DrawerOpen = {
  name: 'Drawer 열림',
  render: () => (
    <Drawer
      open
      title="필터"
      footer={<Button size="sm" full>적용</Button>}
    >
      시설, 상태, 미션 타입을 좁히는 사이드 패널입니다.
    </Drawer>
  ),
};

export const SheetOpen = {
  name: 'Sheet 열림',
  render: () => (
    <Sheet
      open
      title="모바일 액션"
      footer={<Button size="sm" full>선택</Button>}
    >
      바텀 시트는 작은 화면에서 선택지나 보조 액션을 담습니다.
    </Sheet>
  ),
};

export const CommandPaletteOpen = {
  name: 'CommandPalette 열림',
  render: () => (
    <CommandPalette
      open
      commands={[
        { label: '미션 생성', icon: <Icon name="plus" size={16} />, shortcut: 'N' },
        { label: '지도 열기', icon: <Icon name="map" size={16} />, shortcut: 'M' },
        { label: '설정', icon: <Icon name="setting" size={16} />, shortcut: ',' },
      ]}
    />
  ),
};

export const LightboxOpen = {
  name: 'Lightbox 열림',
  render: () => (
    <Lightbox
      open
      images={[{ src: sampleImage, alt: '지도 이미지' }]}
    />
  ),
};
