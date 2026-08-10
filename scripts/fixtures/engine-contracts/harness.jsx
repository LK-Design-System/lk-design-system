// Engine contract harness rendered by scripts/check-engine-contracts.mjs.
// Mounts consumer-free fixtures for the promoted behavior engines so their
// contracts can be asserted without going through any public component.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { useMenuKeyboard } from '../../../components/internal/useMenuKeyboard.js';
import {
  appendAriaReference,
  inlineFloatingStyle,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss,
} from '../../../components/overlay/anchored-overlay.js';
import { useDialogFocus } from '../../../components/overlay/dialog-focus.js';
import {
  FieldMessage,
  FieldStack,
  fieldBackground,
  fieldBorderColor,
  mergeIds,
  useFieldMetadata,
} from '../../../components/forms/field-shared.js';

// Pure exports asserted directly from the driver script.
window.__engine = { appendAriaReference, inlineFloatingStyle, mergeIds, fieldBorderColor, fieldBackground };

function MenuScenario({ id, items, withBack = false }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const { menuRef, requestItemFocus, handleMenuKeyDown } = useMenuKeyboard({
    open,
    onClose: () => setOpen(false),
    getTrigger: () => triggerRef.current,
  });
  return (
    <section>
      <button ref={triggerRef} data-testid={`${id}-trigger`} onClick={() => setOpen((value) => !value)}>
        {id} 열기
      </button>
      <button
        data-testid={`${id}-open-last`}
        onClick={() => { requestItemFocus('last'); setOpen(true); }}
      >
        {id} 마지막으로 열기
      </button>
      <button
        data-testid={`${id}-open-then-arrow`}
        onClick={(event) => {
          // Entry-focus cancellation contract: keyboard navigation that lands
          // before the queued entry frame must win. Open synchronously, then
          // dispatch ArrowDown before the entry rAF can run.
          flushSync(() => setOpen(true));
          const menu = event.target.ownerDocument.querySelector(`[data-testid="${id}-menu"]`);
          menu?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        }}
      >
        {id} 열고 즉시 ArrowDown
      </button>
      {open && (
        <div role="menu" aria-label={id} ref={menuRef} data-testid={`${id}-menu`} onKeyDown={handleMenuKeyDown}>
          {withBack && (
            <button role="menuitem" data-menu-back="" data-testid={`${id}-back`}>Back</button>
          )}
          {items.map((item) => (
            <button key={item} role="menuitem" data-testid={`${id}-item-${item}`}>{item}</button>
          ))}
        </div>
      )}
    </section>
  );
}

function DismissScenario({ id, outsidePress = true, openOnFocus = true }) {
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const [open, setOpen] = useControllableOpen({ defaultOpen: false });
  const [lastReason, setLastReason] = React.useState('none');
  useLightDismiss({
    open,
    rootRef,
    getTrigger: () => triggerRef.current,
    onDismiss: (reason) => { setOpen(false); setLastReason(reason); },
    outsidePress,
  });
  return (
    <section>
      <span ref={rootRef} data-testid={`${id}-root`}>
        <button
          ref={triggerRef}
          data-testid={`${id}-trigger`}
          onFocus={openOnFocus ? () => setOpen(true) : undefined}
          onMouseEnter={() => setOpen(true)}
        >
          {id} 트리거
        </button>
        {open && (
          <span data-testid={`${id}-panel`}>
            떠 있는 콘텐츠
          </span>
        )}
      </span>
      <output data-testid={`${id}-reason`}>{lastReason}</output>
    </section>
  );
}

function FloatingScenario({ id, anchorStyle, placement = 'bottom', panelHeight = 240, strategy = 'absolute', align = 'left' }) {
  const anchorRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const position = useFloatingPosition({ open, anchorRef: anchorRef, panelRef, placement, strategy, align });
  return (
    <div style={{ position: 'fixed', ...anchorStyle }}>
      <button ref={anchorRef} data-testid={`${id}-anchor`} onClick={() => setOpen((value) => !value)}>
        {id} 앵커
      </button>
      {open && (
        <div
          ref={panelRef}
          data-testid={`${id}-panel`}
          data-placement={position.placement}
          data-maxheight={position.maxHeight == null ? 'null' : String(Math.round(position.maxHeight))}
          data-x={position.x == null ? 'null' : String(Math.round(position.x))}
          data-y={position.y == null ? 'null' : String(Math.round(position.y))}
          style={{
            position: strategy,
            left: strategy === 'fixed' ? (position.x ?? -9999) : 0,
            top: strategy === 'fixed' ? (position.y ?? -9999) : (position.placement === 'bottom' ? '100%' : 'auto'),
            bottom: strategy === 'fixed' ? 'auto' : (position.placement === 'top' ? '100%' : 'auto'),
            width: 160,
            height: panelHeight,
            transform: strategy === 'fixed' ? undefined : `translate(${position.shiftX}px, ${position.shiftY}px)`,
            visibility: strategy === 'fixed' && position.x == null ? 'hidden' : 'visible',
            background: '#dddddd',
          }}
        >
          floating panel
        </div>
      )}
    </div>
  );
}

function ScrollbarBoundaryScenario() {
  const boundaryRef = React.useRef(null);
  const anchorRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const position = useFloatingPosition({
    open,
    anchorRef,
    panelRef,
    placement: 'top',
    strategy: 'fixed',
    align: 'right',
    collisionBoundary: boundaryRef,
    viewportPadding: 8,
  });
  return (
    <section
      ref={boundaryRef}
      data-testid="float-scrollbar-boundary"
      style={{ position: 'fixed', top: 560, left: 20, width: 300, height: 300, border: '1px solid #777777' }}
    >
      <button
        ref={anchorRef}
        data-testid="float-scrollbar-anchor"
        onClick={() => setOpen((value) => !value)}
        style={{ position: 'absolute', right: 8, bottom: 8 }}
      >
        scrollbar boundary anchor
      </button>
      {open && (
        <div
          ref={panelRef}
          data-testid="float-scrollbar-panel"
          style={{
            position: 'fixed',
            top: position.y ?? -9999,
            left: position.x ?? -9999,
            width: 300,
            maxWidth: position.maxWidth == null ? 'none' : position.maxWidth,
            maxHeight: position.maxHeight == null ? 'none' : position.maxHeight,
            boxSizing: 'border-box',
            border: '1px solid #777777',
            padding: 12,
            overflowY: 'auto',
            scrollbarGutter: 'stable',
            background: '#dddddd',
          }}
        >
          {Array.from({ length: 30 }, (_, index) => (
            <div key={index}>scrolling line {index + 1}</div>
          ))}
        </div>
      )}
    </section>
  );
}

function DialogSurface({ id, onDismiss, lockScroll = true, initialFocus = false, children }) {
  const initialFocusRef = React.useRef(null);
  const { dialogRef, zIndex } = useDialogFocus({
    open: true,
    onDismiss,
    initialFocusRef: initialFocus ? initialFocusRef : undefined,
    lockScroll,
  });
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={id}
      ref={dialogRef}
      data-testid={id}
      data-zindex={zIndex}
      tabIndex={-1}
      style={{ position: 'fixed', top: 40, left: 40, background: '#ffffff', border: '1px solid #999999', padding: 16, zIndex }}
    >
      {children({ initialFocusRef })}
    </div>
  );
}

function DialogScenario() {
  const [openA, setOpenA] = React.useState(false);
  const [openB, setOpenB] = React.useState(false);
  const [openPlain, setOpenPlain] = React.useState(false);
  return (
    <section>
      <button data-testid="dialog-opener" onClick={() => setOpenA(true)}>다이얼로그 A 열기</button>
      <button data-testid="dialog-plain-opener" onClick={() => setOpenPlain(true)}>잠금 없는 다이얼로그 열기</button>
      <button data-testid="dialog-outside">바깥 버튼</button>
      {openA && (
        <DialogSurface id="dialog-a" onDismiss={() => setOpenA(false)}>
          {() => (
            <>
              <button data-testid="a-first">첫 버튼</button>
              <button data-testid="a-open-b" onClick={() => setOpenB(true)}>B 열기</button>
              <button data-testid="a-last" onClick={() => setOpenA(false)}>닫기</button>
            </>
          )}
        </DialogSurface>
      )}
      {openB && (
        <DialogSurface id="dialog-b" onDismiss={() => setOpenB(false)} initialFocus>
          {({ initialFocusRef }) => (
            <>
              <button data-testid="b-first">B 첫 버튼</button>
              <button data-testid="b-preferred" ref={initialFocusRef}>B 지정 초점</button>
            </>
          )}
        </DialogSurface>
      )}
      {openPlain && (
        <DialogSurface id="dialog-plain" onDismiss={() => setOpenPlain(false)} lockScroll={false}>
          {() => <button data-testid="plain-close" onClick={() => setOpenPlain(false)}>닫기</button>}
        </DialogSurface>
      )}
    </section>
  );
}

function FieldScenario({ id, helper, error, describedBy }) {
  const meta = useFieldMetadata({ prefix: 'fx', label: '이름', helper, error, describedBy });
  return (
    <FieldStack
      fieldId={meta.fieldId}
      label="이름"
      required
      messageId={meta.messageId}
      message={meta.message}
      error={error}
    >
      <input
        data-testid={`${id}-input`}
        id={meta.fieldId}
        aria-describedby={meta.describedBy}
        aria-invalid={error != null || undefined}
        data-has-metadata={String(meta.hasMetadata)}
      />
    </FieldStack>
  );
}

function FieldMessageOnly({ id, message, error }) {
  return (
    <div data-testid={id}>
      <FieldMessage id={`${id}-message`} message={message} error={error} />
    </div>
  );
}

function App() {
  return (
    <main>
      <h1>Engine contract harness</h1>
      <MenuScenario id="menu-a" items={['Pause', 'Patrol', 'Park', 'Stop']} withBack />
      <MenuScenario id="menu-b" items={['One', 'Two', 'Three']} />
      <DismissScenario id="dismiss-a" />
      <DismissScenario id="dismiss-locked" outsidePress={false} openOnFocus={false} />
      <button data-testid="outside-button">완전 바깥 버튼</button>
      <DialogScenario />
      <FieldScenario id="field-helper" helper="8자 이상 입력" describedBy="external-note" />
      <FieldScenario id="field-error" helper="8자 이상 입력" error="필수 항목입니다" />
      <FieldMessageOnly id="message-helper" message="보조 설명" />
      <p id="external-note">외부 설명 텍스트</p>
      <FloatingScenario id="float-bottom" anchorStyle={{ top: 100, left: 100 }} />
      <FloatingScenario id="float-flip" anchorStyle={{ bottom: 8, left: 100 }} />
      <FloatingScenario id="float-fixed" anchorStyle={{ top: 120, left: 420 }} strategy="fixed" align="right" panelHeight={120} />
      <ScrollbarBoundaryScenario />
      <div style={{ height: '150vh' }} data-testid="page-filler">스크롤 확보용</div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
