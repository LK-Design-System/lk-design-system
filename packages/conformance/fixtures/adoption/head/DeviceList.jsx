import { Button, Skeleton } from '@lk-design-system/lds-core';

export function DeviceList({ devices, loading, onRefresh }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--lds-space-300)',
        color: 'var(--color-semantic-label-strong)',
      }}
    >
      <h2>Available devices</h2>
      {loading ? <Skeleton aria-label="Loading devices" /> : <span>{devices.length}</span>}
      <Button onClick={onRefresh}>Refresh devices</Button>
    </section>
  );
}
