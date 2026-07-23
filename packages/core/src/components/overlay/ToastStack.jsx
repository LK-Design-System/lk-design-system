import React from 'react';

/**
 * Announcer handed down to hosted `Toast` children.
 *
 * A `role="status"` node that is inserted into the DOM together with its text is
 * unreliable: most screen readers only announce mutations of a live region that
 * already existed. ToastStack therefore keeps two empty live regions mounted for
 * the whole lifetime of the stack (Material / Polaris convention) and toasts
 * push their message text into the matching one instead of being live regions
 * themselves.
 */
const ToastLiveRegionContext = React.createContext(null);

// Internal cross-file binding for Toast.jsx only — deliberately not a
// declaration-form export, so it stays out of the generated public entry
// (scripts/generate-entry.mjs) and out of the package's export surface.
export { ToastLiveRegionContext };

const SR_ONLY_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * LK ROBOTICS — ToastStack
 * A fixed viewport that stacks Toast children in a corner. Pair with your own
 * queue state; render the visible Toasts as children.
 */
export function ToastStack({ children, position = 'bottom-right', gap = 10, liveRegion = true, style, ...rest }) {
  const politeRef = React.useRef(null);
  const assertiveRef = React.useRef(null);

  const announce = React.useCallback((message, urgent) => {
    const node = urgent ? assertiveRef.current : politeRef.current;
    if (!node || !message) return;
    if (node.textContent !== message) {
      // A changed text node is the mutation assistive tech reports — write it
      // synchronously so the announcement does not depend on frame scheduling
      // (rAF never runs while the tab is in the background).
      node.textContent = message;
      return;
    }
    // Repeating the same message is not a mutation, so blank the region first
    // and restore it on the next task to make the change observable.
    const view = node.ownerDocument?.defaultView ?? window;
    node.textContent = '';
    view.setTimeout(() => {
      if (node.isConnected) node.textContent = message;
    }, 50);
  }, []);

  const pos = {
    'bottom-right': { bottom: 20, right: 20, alignItems: 'flex-end' },
    'bottom-left': { bottom: 20, left: 20, alignItems: 'flex-start' },
    'top-right': { top: 20, right: 20, alignItems: 'flex-end' },
    'top-left': { top: 20, left: 20, alignItems: 'flex-start' },
    'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  }[position] || {};

  return (
    <ToastLiveRegionContext.Provider value={liveRegion ? announce : null}>
      <div style={{ position: 'fixed', zIndex: 120, display: 'flex', flexDirection: 'column', gap, ...pos, ...style }} {...rest}>
        {children}
      </div>
      {liveRegion && (
        <>
          <div ref={politeRef} data-toast-live="polite" role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY_STYLE} />
          <div ref={assertiveRef} data-toast-live="assertive" role="alert" aria-live="assertive" aria-atomic="true" style={SR_ONLY_STYLE} />
        </>
      )}
    </ToastLiveRegionContext.Provider>
  );
}
