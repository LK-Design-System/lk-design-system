import { IconPicker, Icon } from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/Icon Picker',
  parameters: {
    docs: {
      description: {
        component: '아이콘 타일 그리드에서 하나를 고르는 IconPicker 패턴입니다. 빌딩·마커·카테고리 아이콘 지정에 씁니다.',
      },
    },
  },
};

export default meta;

const optionNames = [
  ['home', '홈'],
  ['layers', '레이어'],
  ['bell', '알림'],
  ['document', '문서'],
  ['pin', '핀'],
  ['location', '위치'],
  ['folder', '폴더'],
  ['trash', '삭제'],
  ['signal', '신호'],
  ['battery', '배터리'],
  ['bookmark', '북마크'],
  ['flag', '플래그'],
];

const options = optionNames.map(([name, label]) => ({
  value: name,
  icon: <Icon name={name} size={20} />,
  label,
}));

export const IconPickers = {
  name: '아이콘 피커',
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <IconPicker options={options} defaultValue="layers" />
    </main>
  ),
};

export const DisabledOptions = {
  name: '비활성 옵션',
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <IconPicker
        options={options.map((option) =>
          option.value === 'trash' || option.value === 'battery'
            ? { ...option, disabled: true }
            : option,
        )}
        defaultValue="location"
      />
    </main>
  ),
};

export const LargeTiles = {
  name: '큰 타일',
  render: () => (
    <main style={{ maxWidth: 420 }}>
      <IconPicker options={options.slice(0, 8)} defaultValue="home" columns={4} size="lg" />
    </main>
  ),
};

export const Empty = {
  name: '빈 목록',
  render: () => <IconPicker options={[]} emptyLabel="표시할 아이콘이 없습니다" />,
};
