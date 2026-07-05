import React from 'react';
import { RobotStatusCard } from '../src/index.js';

const meta = {
  title: '컴포넌트/로보틱스',
  component: RobotStatusCard,
  parameters: {
    docs: {
      description: {
        component: 'fleet 상태, 텔레메트리, control surface를 위한 로보틱스 전용 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const RobotStatus = {
  name: '로봇 상태',
  render: () => (
    <div style={{ display: 'grid', gap: 14, width: 'min(520px, 100%)' }}>
      <RobotStatusCard name="AMR-07" status="online" battery={86} mode="Auto" selected />
      <RobotStatusCard name="Forklift-B2" status="reconnecting" battery={47} mode="Manual" />
      <RobotStatusCard name="Docking-03" status="offline" battery={12} mode="Idle" />
    </div>
  ),
};
