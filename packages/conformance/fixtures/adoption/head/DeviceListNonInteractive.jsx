import { Card } from '@lk-design-system/lds-core';

export function DeviceList({ devices }) {
  return (
    <Card>
      <h2>Available devices</h2>
      <span>{devices.length}</span>
    </Card>
  );
}
