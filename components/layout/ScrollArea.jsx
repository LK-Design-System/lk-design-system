import React from 'react';

function useScrollStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-scrollarea-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-scrollarea-css';
    el.textContent = '.lk-scrollarea{scrollbar-width:thin;scrollbar-color:var(--color-semantic-interaction-inactive) transparent;}.lk-scrollarea::-webkit-scrollbar{width:7px;height:7px;}.lk-scrollarea::-webkit-scrollbar-thumb{background:var(--color-semantic-interaction-inactive);border-radius:99px;}.lk-scrollarea::-webkit-scrollbar-thumb:hover{background:var(--color-semantic-label-alternative);}.lk-scrollarea::-webkit-scrollbar-track{background:transparent;}';
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — ScrollArea
 * A scroll container with a slim, cool-gray custom scrollbar. Cap it with
 * `maxHeight` (px or CSS).
 */
export function ScrollArea({ children, maxHeight = 280, style, ...rest }) {
  useScrollStyles();
  return (
    <div className="lk-scrollarea" style={{ maxHeight, overflow: 'auto', ...style }} {...rest}>
      {children}
    </div>
  );
}
