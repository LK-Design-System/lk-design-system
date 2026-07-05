import React from 'react';
import { RobotStatusCard } from '../src/index.js';

const meta = {
  title: 'Components/Robotics',
  component: RobotStatusCard,
  parameters: {
    docs: {
      description: {
        component: 'Robotics-specific components for fleet status, telemetry, and control surfaces.',
      },
    },
  },
};

export default meta;

export const RobotStatus = {
  render: () => (
    <div style={{ display: 'grid', gap: 14, width: 'min(520px, 100%)' }}>
      <RobotStatusCard name="AMR-07" status="online" battery={86} mode="Auto" selected />
      <RobotStatusCard name="Forklift-B2" status="reconnecting" battery={47} mode="Manual" />
      <RobotStatusCard name="Docking-03" status="offline" battery={12} mode="Idle" />
    </div>
  ),
};
