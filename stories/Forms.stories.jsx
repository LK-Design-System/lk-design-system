import React from 'react';
import { Checkbox, Icon, Input, Select } from '../src/index.js';

const meta = {
  title: '컴포넌트/폼',
  parameters: {
    docs: {
      description: {
        component: '로보틱스/제품 워크플로에 사용하는 대표 form control입니다.',
      },
    },
  },
};

export default meta;

export const TextAndSelect = {
  name: '텍스트와 Select',
  render: () => (
    <div style={{ display: 'grid', gap: 18, width: 'min(420px, 100%)' }}>
      <Input label="로봇 이름" defaultValue="AMR-07" iconLeft={<Icon name="robot" size={18} />} required />
      <Select
        label="운영 모드"
        defaultValue="mapping"
        options={[
          { value: 'mapping', label: '매핑' },
          { value: 'delivery', label: '배송' },
          { value: 'inspection', label: '점검' },
        ]}
      />
      <Input label="검증 오류" defaultValue="172.16.0." invalid />
    </div>
  ),
};

export const CheckboxStates = {
  name: 'Checkbox 상태',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Checkbox label="원격 진단 활성화" defaultChecked />
      <Checkbox label="완료 후 미션 로그 전송" />
      <Checkbox label="비활성 옵션" disabled />
    </div>
  ),
};
