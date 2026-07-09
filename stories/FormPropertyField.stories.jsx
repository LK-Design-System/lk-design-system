import React from 'react';
import { PropertyField } from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/Property Field',
  parameters: {
    docs: {
      description: {
        component: '값이 바뀐 뒤에만 활성화되는 개별 Apply가 붙은 파라미터 행 PropertyField 패턴입니다. 내비게이션 튜닝·설정 패널에 씁니다.',
      },
    },
  },
};

export default meta;

export const PropertyFields = {
  name: '속성 필드',
  render: () => {
    const [vals, setVals] = React.useState({ maxVel: 0.8, tol: 0.15, recover: true, frame: 'map' });
    const apply = (k) => (v) => setVals((s) => ({ ...s, [k]: v }));
    return (
      <main style={{ display: 'grid', gap: 2, maxWidth: 480, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <PropertyField label="max_vel" hint="최대 선속도" type="number" unit="m/s" min={0} max={2} step={0.1} value={vals.maxVel} onApply={apply('maxVel')} />
        <PropertyField label="goal_tolerance" hint="목표 허용 오차" type="number" unit="m" step={0.05} value={vals.tol} onApply={apply('tol')} />
        <PropertyField label="global_frame" type="text" value={vals.frame} onApply={apply('frame')} />
        <PropertyField label="자동 복구" hint="실패 시 재시도" type="toggle" value={vals.recover} onApply={apply('recover')} />
      </main>
    );
  },
};
