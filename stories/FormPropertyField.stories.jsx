import React from 'react';
import { PropertyField } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Property Field',
  component: PropertyField,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-property-field--property-fields',
      eyebrow: 'Product / Property Field',
      title: '속성 필드는 밀도 높은 설정 행에서 변경과 적용 단위를 분명히 합니다',
      description:
        '튜닝 패널처럼 각 속성에 단위·도움말·개별 Apply가 필요한 경우에 적합합니다. 일반 제출형 폼에는 Property Field 대신 FormField와 기본 입력 컴포넌트를 사용하세요.',
    },
    docs: {
      description: {
        component:
          '값이 바뀐 행에만 개별 Apply가 활성화되는 설정·튜닝 패널용 PropertyField 패턴입니다.',
      },
    },
  },
};

export default meta;

function PropertyPanel({ children }) {
  return (
    <main
      style={{
        display: 'grid',
        gap: 2,
        width: 'min(520px, 100%)',
        minWidth: 0,
        padding: 'var(--space-4)',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </main>
  );
}

export const PropertyFields = {
  name: '개요',
  parameters: storyDescription(
    '숫자·toggle·text 속성을 한 패널에서 개별 적용하는 대표 구성입니다. 값이 바뀐 행만 Apply가 활성화되고 단위와 도움말이 해당 속성에 붙는지 확인하세요.',
  ),
  render: () => {
    const [vals, setVals] = React.useState({
      maxVel: 0.8,
      tol: 0.15,
      recover: true,
      frame: 'map',
    });
    const apply = (key) => (value) => setVals((state) => ({ ...state, [key]: value }));

    return (
      <PropertyPanel>
        <PropertyField
          label="max_vel"
          hint="최대 선속도"
          type="number"
          unit="m/s"
          min={0}
          max={2}
          step={0.1}
          value={vals.maxVel}
          onApply={apply('maxVel')}
        />
        <PropertyField
          label="goal_tolerance"
          hint="목표 허용 오차"
          type="number"
          unit="m"
          step={0.05}
          value={vals.tol}
          onApply={apply('tol')}
        />
        <PropertyField
          label="global_frame"
          type="text"
          value={vals.frame}
          onApply={apply('frame')}
        />
        <PropertyField
          label="자동 복구"
          hint="실패 후 재시도"
          type="toggle"
          value={vals.recover}
          onApply={apply('recover')}
        />
      </PropertyPanel>
    );
  },
};

export const States = {
  name: '변형·상태 · 비활성 · 읽기 전용과 적용 불가',
  parameters: storyDescription(
    '비활성·읽기 전용·Apply handler 없음 상태를 한 패널에서 비교합니다. 각 제한의 의미가 같아 보이지 않고 사용 가능한 제어만 키보드에 남는지 확인하세요.',
  ),
  render: () => (
    <PropertyPanel>
      <PropertyField
        label="planner_frequency"
        hint="컨트롤러 재시작 필요"
        type="number"
        unit="Hz"
        value={10}
        disabled
        onApply={() => {}}
      />
      <PropertyField
        label="local_costmap_frame"
        hint="런타임 읽기 전용"
        type="text"
        value="odom"
        readOnly
        onApply={() => {}}
      />
      <PropertyField
        label="recovery_enabled"
        type="toggle"
        value={false}
        readOnly
        onApply={() => {}}
      />
      <PropertyField
        label="map_topic"
        hint="Apply 핸들러 없음"
        type="text"
        value="/map"
      />
    </PropertyPanel>
  ),
};
