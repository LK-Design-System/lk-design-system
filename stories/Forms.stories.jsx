import React from 'react';
import { Checkbox, Icon, Input, Select } from '../src/index.js';

const meta = {
  title: 'Components/Forms',
  parameters: {
    docs: {
      description: {
        component: 'Representative form controls for robotics/product workflows.',
      },
    },
  },
};

export default meta;

export const TextAndSelect = {
  render: () => (
    <div style={{ display: 'grid', gap: 18, width: 'min(420px, 100%)' }}>
      <Input label="Robot name" defaultValue="AMR-07" iconLeft={<Icon name="robot" size={18} />} required />
      <Select
        label="Operating mode"
        defaultValue="mapping"
        options={[
          { value: 'mapping', label: 'Mapping' },
          { value: 'delivery', label: 'Delivery' },
          { value: 'inspection', label: 'Inspection' },
        ]}
      />
      <Input label="Validation error" defaultValue="172.16.0." invalid />
    </div>
  ),
};

export const CheckboxStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Checkbox label="Enable remote diagnostics" defaultChecked />
      <Checkbox label="Send mission logs after completion" />
      <Checkbox label="Disabled option" disabled />
    </div>
  ),
};
