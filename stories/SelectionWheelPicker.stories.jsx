import { WheelPicker } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Wheel Picker',
  parameters: {
    docs: {
      description: {
        component: 'iOS식 드럼/휠로 값을 고르는 WheelPicker 패턴입니다. 층 선택, 시·분 선택 등에 씁니다.',
      },
    },
  },
};

export default meta;

export const WheelPickers = {
  name: '휠 피커',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      <WheelPicker options={['B2', 'B1', '1F', '2F', '3F', '4F', '5F']} defaultValue="1F" />
      <WheelPicker options={Array.from({ length: 24 }, (_, i) => ({ value: i, label: String(i).padStart(2, '0') }))} defaultValue={9} />
    </main>
  ),
};
