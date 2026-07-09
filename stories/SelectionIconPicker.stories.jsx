import { IconPicker, Icon } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Icon Picker',
  parameters: {
    docs: {
      description: {
        component: '아이콘 타일 그리드에서 하나를 고르는 IconPicker 패턴입니다. 빌딩·마커·카테고리 아이콘 지정에 씁니다.',
      },
    },
  },
};

export default meta;

const options = ['home', 'layers', 'bell', 'document', 'pin', 'location', 'folder', 'trash', 'signal', 'battery', 'bookmark', 'flag']
  .map((name) => ({ value: name, icon: <Icon name={name} size={20} />, label: name }));

export const IconPickers = {
  name: '아이콘 피커',
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <IconPicker options={options} defaultValue="anchor" />
    </main>
  ),
};
