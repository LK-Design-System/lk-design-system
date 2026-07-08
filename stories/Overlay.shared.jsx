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
  Spinner,
  Toast,
  ToastStack,
} from '../src/index.js';

const sampleImage =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22640%22 height=%22360%22 viewBox=%220 0 640 360%22%3E%3Crect width=%22640%22 height=%22360%22 rx=%2224%22 fill=%22%230E1329%22/%3E%3Cpath d=%22M70 260 220 120l110 86 90-62 150 116%22 fill=%22none%22 stroke=%22%232F6FAE%22 stroke-width=%2218%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3Ccircle cx=%22484%22 cy=%2294%22 r=%2242%22 fill=%22%23527F62%22/%3E%3Ctext x=%2252%22 y=%2258%22 fill=%22white%22 font-family=%22Arial%22 font-size=%2222%22 font-weight=%22700%22%3EDESIGN SYSTEM PREVIEW%3C/text%3E%3C/svg%3E';

export const AnchoredAndToast = {
  name: '앵커드 오버레이와 토스트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 860 }}>
      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <DropdownMenu
          trigger={<Button variant="ghost">드롭다운</Button>}
          items={[
            { label: '항목 복제', icon: <Icon name="document" size={16} /> },
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
          <strong>문서 A</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--label-neutral)' }}>검토 86%, 초안 상태</p>
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
          변경 사항이 저장되었습니다.
        </Toast>
      </ToastStack>
    </main>
  ),
};

export const DropdownMenuCard = {
  name: 'DropdownMenu card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 260, height: 220, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <DropdownMenu
        align="left"
        trigger={<Button variant="ghost">작업</Button>}
        items={[
          { label: '내보내기', icon: <Icon name="upload" size={18} /> },
          { label: '공유', icon: <Icon name="share" size={18} /> },
          { divider: true },
          { label: '삭제', danger: true, icon: <Icon name="trash" size={18} /> },
        ]}
      />
    </div>
  ),
};

export const ToastCard = {
  name: 'Toast card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 120, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Toast tone="success" action="확인">현장 실사 요청이 접수되었습니다</Toast>
        <Toast tone="info" onClose={() => {}}>대시보드로 이동했습니다.</Toast>
      </div>
    </div>
  ),
};

export const AlertOpen = {
  name: 'Alert 열림',
  render: () => (
    <Alert open title="변경 사항을 게시할까요?" cancelLabel="취소" confirmLabel="게시">
      선택한 항목 3개에 현재 변경 사항을 반영합니다.
    </Alert>
  ),
};

export const ModalOpen = {
  name: 'Modal 열림',
  render: () => (
    <Modal
      open
      title="항목 상세"
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
      그룹, 상태, 유형을 좁히는 사이드 패널입니다.
    </Drawer>
  ),
};

export const DrawerCard = {
  name: 'Drawer card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 520, height: 460, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', height: 400, overflow: 'hidden', borderRadius: 12, border: '1px solid var(--border-subtle)', transform: 'translateZ(0)', background: 'var(--bw-paper)' }}>
        <div style={{ padding: 20 }}>
          <Button variant="secondary">필터 열기</Button>
        </div>
        <Drawer
          open
          side="right"
          title="필터"
          onClose={() => {}}
          footer={<Button variant="signal" full>적용</Button>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="현장" placeholder="전체" />
            <Input label="항목 유형" placeholder="전체" />
          </div>
        </Drawer>
      </div>
    </div>
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
        { label: '문서 생성', icon: <Icon name="plus" size={16} />, shortcut: 'N' },
        { label: '미리보기 열기', icon: <Icon name="eye" size={16} />, shortcut: 'M' },
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
      images={[{ src: sampleImage, alt: '미리보기 이미지' }]}
    />
  ),
};

export const LightboxCard = {
  name: 'Lightbox card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const photos = [
      { src: sampleImage, alt: '미리보기 1' },
      { src: sampleImage, alt: '미리보기 2' },
      { src: sampleImage, alt: '미리보기 3' },
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
  tags: ['!dev', 'visual-parity'],
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
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 260, height: 180, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
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
        <Dimmer open blur><Spinner color="var(--text-on-inverse)" label="처리 중…" /></Dimmer>
      </div>
    </div>
  ),
};

export const PopoverCard = {
  name: 'Popover card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <Popover trigger={<Button variant="ghost">표시 밀도</Button>} width={260}>
      <FormField label="밀도"><Slider defaultValue={30} min={0} max={100} showValue /></FormField>
    </Popover>
  ),
};

export const AlertCard = {
  name: 'Alert card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="dark" onClick={() => setOpen(true)}>작업 중단 확인 열기</Button>
        <Alert open={open} title="작업을 중단할까요?" tone="danger" confirmLabel="중단" cancelLabel="취소"
          onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
          현재 처리 중인 항목 3개가 즉시 중단됩니다. 중단 후에는 대시보드에서 재개할 수 있습니다.
        </Alert>
      </div>
    );
  },
};

export const AlertToastCard = {
  name: 'Alert Toast card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div data-visual-crop-root style={{ width: 700, height: 360, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Toast tone="success" action="확인">현장 실사 요청이 접수되었습니다</Toast>
            <Toast tone="info" onClose={() => {}}>대시보드로 이동했습니다.</Toast>
          </div>
          <div>
            <Button variant="dark" onClick={() => setOpen(true)}>작업 중단 확인 열기</Button>
            <Alert open={open} title="작업을 중단할까요?" tone="danger" confirmLabel="중단" cancelLabel="취소"
              onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
              현재 처리 중인 항목 3개가 즉시 중단됩니다. 중단 후에는 대시보드에서 재개할 수 있습니다.
            </Alert>
          </div>
        </div>
      </div>
    );
  },
};

export const HoverCardCard = {
  name: 'HoverCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <HoverCard trigger={<Link>문서 A</Link>}>
      <b>문서 A</b> · 검토 중 · 오늘 업데이트됨.
    </HoverCard>
  ),
};

export const CommandPaletteCard = {
  name: 'CommandPalette card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="dark" onClick={() => setOpen(true)}>명령 검색 (⌘K)</Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={[
          { label: '전체 작업 중지', shortcut: 'Space', onSelect: () => {} },
          { label: '대시보드로 이동', shortcut: 'G', onSelect: () => {} },
          { label: '항목 상태 보기', shortcut: 'E', onSelect: () => {} },
        ]} />
      </div>
    );
  },
};

export const ToastStackCard = {
  name: 'ToastStack card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [items, setItems] = React.useState([
      { id: 1, tone: 'success', msg: '검토가 완료되었습니다.' },
      { id: 2, tone: 'info', msg: '대시보드로 이동했습니다.' },
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
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>항목 정보 수정</Button>
        <Modal open={open} title="항목 정보 수정" onClose={() => setOpen(false)}
          footer={<><Button variant="ghost" onClick={() => setOpen(false)}>취소</Button><Button variant="signal" onClick={() => setOpen(false)}>저장</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="항목명" defaultValue="디자인 토큰" />
            <Input label="그룹" defaultValue="Foundation" />
          </div>
        </Modal>
      </div>
    );
  },
};
