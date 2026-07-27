export function ViewerFrame({ children }) {
  return (
    <section style={{ '--product-viewer-surface': 'var(--color-semantic-background-normal-normal)' }}>
      {children}
    </section>
  );
}
