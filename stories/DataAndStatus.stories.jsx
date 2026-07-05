import React from 'react';
import { Banner, Button, Icon, MetricCard } from '../src/index.js';

const meta = {
  title: 'Components/Data and Status',
  parameters: {
    docs: {
      description: {
        component: 'Dashboard-facing KPI and status examples.',
      },
    },
  },
};

export default meta;

export const Metrics = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: 'min(820px, 100%)' }}>
      <MetricCard label="Fleet uptime" value="99.7%" delta={1.8} caption="Compared with last week" icon={<Icon name="signal" size={22} />} />
      <MetricCard label="Active robots" value="24" delta="stable" deltaTone="flat" caption="Across three facilities" icon={<Icon name="robot" size={22} />} />
      <MetricCard label="Alerts" value="3" delta={-12} caption="Open incidents" icon={<Icon name="triangle-exclamation" size={22} />} />
    </div>
  ),
};

export const Banners = {
  render: () => (
    <div style={{ display: 'grid', gap: 14, width: 'min(720px, 100%)' }}>
      <Banner tone="info" title="Map sync in progress">
        The latest warehouse map is being distributed to active robots.
      </Banner>
      <Banner
        tone="warning"
        title="Battery threshold"
        action={<Button size="sm" variant="ghost">Open fleet</Button>}
      >
        Three robots are below the configured battery threshold.
      </Banner>
      <Banner tone="success" title="Mission queue healthy">
        All scheduled tasks are currently assigned.
      </Banner>
    </div>
  ),
};
