import React from 'react';
import {
  AutoComplete,
  Checkbox,
  CheckboxGroup,
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

const options = ['물류 로봇', '용접 로봇', '순찰 로봇', '방역 로봇'];

export const InputsAndPickers = {
  name: '입력과 피커',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 960 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Input label="프로젝트 이름" defaultValue="로봇 관제 시스템" iconLeft={<Icon name="document" size={18} />} />
        <SearchField defaultValue="토큰" placeholder="항목 검색" />
        <PasswordInput defaultValue="design-system" />
        <InputGroup aria-label="자산 번호" prefix="ID" suffix="개" defaultValue="12" />
        <NumberField defaultValue={5} min={0} max={20} />
        <DatePicker defaultValue="2026-07-05" />
        <TimePicker defaultValue="09:30" />
        <PinInput aria-label="본인 확인 코드" defaultValue="1205" length={6} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Textarea label="검토 메모" defaultValue="모바일 화면에서 줄바꿈과 도움말 위치를 확인합니다." rows={4} />
        <FileUpload accept="image/*,.pdf" multiple hint="이미지 또는 문서 업로드" />
      </section>
    </main>
  ),
};

export const SelectorsAndGroups = {
  name: '폼 선택기와 그룹',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Select label="작업 유형" defaultValue="review" options={[{ value: 'draft', label: '초안' }, { value: 'review', label: '검토' }, { value: 'publish', label: '게시' }]} />
        <AutoComplete options={options} defaultValue="물류 로봇" placeholder="항목 검색" />
        <Combobox options={options} defaultValue={['물류 로봇', '순찰 로봇']} />
        <TagInput defaultValue={['중요', '검토']} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
        <FormField label="알림 옵션" helper="여러 항목을 동시에 선택할 수 있습니다.">
          <CheckboxGroup
            defaultValue={['email', 'a11y']}
            options={[
              { value: 'email', label: '이메일 알림' },
              { value: 'log', label: '변경 로그' },
              { value: 'a11y', label: '접근성 검토' },
            ]}
          />
        </FormField>
        <FormField label="처리 방식" required>
          <RadioGroup
            defaultValue="now"
            name="apply-mode"
            options={[
              { value: 'now', label: '즉시 적용', description: '현재 선택한 항목에 바로 반영' },
              { value: 'schedule', label: '예약 적용', description: '지정 시간에 자동 반영' },
            ]}
          />
        </FormField>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Checkbox label="완료 후 요약 생성" defaultChecked />
        <Radio label="대표 항목" name="single-radio" value="primary" checked onChange={() => {}} />
        <Slider defaultValue={72} showValue />
        <RangeSlider defaultValue={[20, 80]} showValue />
      </section>
    </main>
  ),
};

export const AutoCompleteCard = {
  name: 'AutoComplete card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 380, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <AutoComplete placeholder="항목 검색" options={['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']} />
    </div>
  ),
};

export const DatePickerCard = {
  name: 'DatePicker card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 120, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <DatePicker placeholder="검토 희망일" />
    </div>
  ),
};

export const SearchFieldCard = {
  name: 'SearchField card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 380, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <SearchField placeholder="문서·컴포넌트 검색" defaultValue="Button" />
    </div>
  ),
};

export const SliderCard = {
  name: 'Slider card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [value, setValue] = React.useState(40);
    return (
      <div data-visual-crop-root style={{ width: 380, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <Slider value={value} onChange={setValue} showValue />
      </div>
    );
  },
};
