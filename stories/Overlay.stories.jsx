import React from 'react';
import {
  Alert,
  Button,
  FormField,
  CommandPalette,
  Dimmer,
  Drawer,
  DropdownMenu,
  HoverCard,
  Input,
  Icon,
  Lightbox,
  Link,
  Modal,
  Popover,
  Sheet,
  Slider,
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

export const LightboxCard = {
  name: 'Lightbox card parity',
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const photos = [
      { src: '/assets/products/lkr-t1.webp', alt: 'LKR-T1' },
      { src: '/assets/products/lkr-s1.webp', alt: 'LKR-S1' },
      { src: '/assets/products/lkr-visionx.webp', alt: 'LKR-VisionX' },
    ];
    return (
      <div>
        <Button variant="flat" onClick={() => setOpen(true)}>이미지로 보기</Button>
        <Lightbox open={open} images={photos} index={index} onClose={() => setOpen(false)} onIndexChange={setIndex} />
      </div>
    );
  },
};

export const SheetCard = {
  name: 'Sheet card parity',
  render: () => {
    const [open, setOpen] = React.useState(false);
    const options = ['최신순', '이름순', '상태순'];
    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>정렬 선택</Button>
        <Sheet open={open} title="정렬" onClose={() => setOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  textAlign: 'left',
                  padding: '14px 4px',
                  border: 'none',
                  borderBottom: '1px solid var(--bw-border)',
                  background: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  color: 'var(--label-normal)',
                  cursor: 'pointer',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </Sheet>
      </div>
    );
  },
};

export const DimmerCard = {
  name: 'Dimmer card parity',
  render: () => (
    <div
      style={{
        position: 'relative',
        width: 220,
        height: 130,
        background: 'var(--bw-white)',
        border: '1px solid var(--bw-border)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        color: 'var(--label-alternative)',
        fontSize: 14,
      }}
    >
      콘텐츠
      <Dimmer open blur><span style={{ color: 'var(--text-on-inverse)' }}>처리 중…</span></Dimmer>
    </div>
  ),
};

export const PopoverCard = {
  name: 'Popover card parity',
  render: () => (
    <Popover trigger={<Button variant="ghost">탐지 반경</Button>} width={260}>
      <FormField label="반경 (m)"><Slider defaultValue={30} min={0} max={100} showValue /></FormField>
    </Popover>
  ),
};

export const AlertCard = {
  name: 'Alert card parity',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="dark" onClick={() => setOpen(true)}>로봇 정지 확인 열기</Button>
        <Alert open={open} title="로봇을 정지할까요?" tone="danger" confirmLabel="정지" cancelLabel="취소"
          onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
          현재 순찰 중인 LKR-T1 3대가 즉시 정지됩니다. 정지 후에는 관제 화면에서 재개할 수 있습니다.
        </Alert>
      </div>
    );
  },
};

export const AlertToastCard = {
  name: 'Alert Toast card parity',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Toast tone="success" action="확인">현장 실사 요청이 접수되었습니다</Toast>
          <Toast tone="info" onClose={() => {}}>관제 화면으로 이동했습니다.</Toast>
        </div>
        <div>
          <Button variant="dark" onClick={() => setOpen(true)}>로봇 정지 확인 열기</Button>
          <Alert open={open} title="로봇을 정지할까요?" tone="danger" confirmLabel="정지" cancelLabel="취소"
            onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
            현재 순찰 중인 LKR-T1 3대가 즉시 정지됩니다. 정지 후에는 관제 화면에서 재개할 수 있습니다.
          </Alert>
        </div>
      </div>
    );
  },
};

export const HoverCardCard = {
  name: 'HoverCard card parity',
  render: () => (
    <HoverCard trigger={<Link>LKR-T1</Link>}>
      <b>LKR-T1</b> ? 안전 순찰 로봇 ? 최대 8시간 연속 운영.
    </HoverCard>
  ),
};

export const CommandPaletteCard = {
  name: 'CommandPalette card parity',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="dark" onClick={() => setOpen(true)}>명령 검색 (⌘K)</Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={[
          { label: '전체 로봇 정지', shortcut: 'Space', onSelect: () => {} },
          { label: '관제 화면으로 이동', shortcut: 'G', onSelect: () => {} },
          { label: '설비 상태 보기', shortcut: 'E', onSelect: () => {} },
        ]} />
      </div>
    );
  },
};

export const ToastStackCard = {
  name: 'ToastStack card parity',
  render: () => {
    const [items, setItems] = React.useState([
      { id: 1, tone: 'success', msg: '설비 점검이 완료되었습니다.' },
      { id: 2, tone: 'info', msg: '관제 화면으로 이동했습니다.' },
    ]);
    return (
      <ToastStack position="bottom-right">
        {items.map((toast) => (
          <Toast key={toast.id} tone={toast.tone} onClose={() => setItems((prev) => prev.filter((item) => item.id !== toast.id))}>{toast.msg}</Toast>
        ))}
      </ToastStack>
    );
  },
};

export const ModalCard = {
  name: 'Modal card parity',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>설비 정보 수정</Button>
        <Modal open={open} title="설비 정보 수정" onClose={() => setOpen(false)}
          footer={<><Button variant="ghost" onClick={() => setOpen(false)}>취소</Button><Button variant="signal" onClick={() => setOpen(false)}>저장</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="설비명" defaultValue="3동 정문 게이트" />
            <Input label="설치 위치" defaultValue="3동 1층 로비" />
          </div>
        </Modal>
      </div>
    );
  },
};
