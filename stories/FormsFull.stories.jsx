import React from 'react';
import {
  AutoComplete,
  Checkbox,
  CheckboxGroup,
  ColorSwatch,
  Combobox,
  DatePicker,
  FileUpload,
  FormField,
  Icon,
  Input,
  InputGroup,
  NumberField,
  PasswordInput,
  PinInput,
  Radio,
  RadioGroup,
  RangeSlider,
  SearchField,
  Select,
  Slider,
  TagInput,
  Textarea,
  TimePicker,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/폼 상세',
  parameters: {
    docs: {
      description: {
        component: '입력, 선택, 업로드, 범위 조절 등 폼 컴포넌트 전체입니다.',
      },
    },
  },
};

export default meta;

const options = ['AMR-07', 'Forklift-B2', 'Docking-03', 'Patrol-S1'];

export const InputsAndPickers = {
  name: '입력과 피커',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 960 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Input label="로봇 이름" defaultValue="AMR-07" iconLeft={<Icon name="robot" size={18} />} />
        <SearchField defaultValue="대덕" placeholder="시설 검색" />
        <PasswordInput defaultValue="robotics" />
        <InputGroup prefix="ROS" suffix="Hz" defaultValue="12" />
        <NumberField defaultValue={5} min={0} max={20} />
        <DatePicker defaultValue="2026-07-05" />
        <TimePicker defaultValue="09:30" />
        <PinInput defaultValue="1205" length={6} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Textarea label="운영 메모" defaultValue="엘리베이터 구간 진입 전 속도를 낮춥니다." rows={4} />
        <FileUpload accept="image/*,.pdf" multiple hint="지도 이미지 또는 보고서 업로드" />
      </section>
    </main>
  ),
};

export const SelectorsAndGroups = {
  name: '선택 컨트롤',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Select label="미션 타입" defaultValue="patrol" options={[{ value: 'patrol', label: '순찰' }, { value: 'cleaning', label: '청소' }, { value: 'delivery', label: '운반' }]} />
        <AutoComplete options={options} defaultValue="AMR-07" placeholder="로봇 검색" />
        <Combobox options={options} defaultValue={['AMR-07', 'Docking-03']} />
        <TagInput defaultValue={['야간', '순찰']} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
        <FormField label="통신 옵션" helper="여러 항목을 동시에 선택할 수 있습니다.">
          <CheckboxGroup
            defaultValue={['mqtt', 'ros']}
            options={[
              { value: 'mqtt', label: 'MQTT 브리지' },
              { value: 'ros', label: 'ROS 2 토픽' },
              { value: 'log', label: '운영 로그 전송' },
            ]}
          />
        </FormField>
        <FormField label="배포 방식" required>
          <RadioGroup
            defaultValue="now"
            name="deploy-mode"
            options={[
              { value: 'now', label: '즉시 배포', description: '현재 선택된 로봇에 바로 전송' },
              { value: 'schedule', label: '예약 배포', description: '지정 시간에 자동 실행' },
            ]}
          />
        </FormField>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Checkbox label="완료 후 보고서 생성" defaultChecked />
        <Radio label="대표 로봇" name="single-radio" value="amr" checked onChange={() => {}} />
        <ColorSwatch colors={['#2F6FAE', '#527F62', '#C49A4B', '#CF6360', '#0E1329']} defaultValue="#2F6FAE" />
        <Slider defaultValue={72} showValue />
        <RangeSlider defaultValue={[20, 80]} showValue />
      </section>
    </main>
  ),
};

export const AutoCompleteCard = {
  name: 'AutoComplete card parity',
  render: () => <AutoComplete placeholder="?? ??" options={['LKR-CP', 'LKR-T1', 'LKR-VisionX', 'LKR-SSAI', 'LKR-S1']} />,
};

export const DatePickerCard = {
  name: 'DatePicker card parity',
  render: () => <DatePicker placeholder="?? ??" />,
};

export const SearchFieldCard = {
  name: 'SearchField card parity',
  render: () => <SearchField placeholder="????? ??" defaultValue="LKR-T1" />,
};

export const SliderCard = {
  name: 'Slider card parity',
  render: () => {
    const [value, setValue] = React.useState(40);
    return <Slider value={value} onChange={setValue} showValue />;
  },
};
