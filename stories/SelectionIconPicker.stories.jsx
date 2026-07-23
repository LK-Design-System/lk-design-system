import { userEvent, waitFor } from 'storybook/test';
import { IconPicker, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Icon Picker',
  component: IconPicker,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-icon-picker--icon-pickers',
      eyebrow: 'Product / Icon Picker',
      title: '아이콘 피커는 허용된 시각 기호를 타일에서 비교해 선택하게 합니다',
      description:
        '빌딩·마커·카테고리에 쓸 작은 curated 아이콘 집합에서 하나를 고를 때 적합합니다. 전체 레지스트리를 검색하거나 아이콘을 탐색하는 화면에는 별도 검색 UI를 사용하세요.',
    },
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
  name: '개요',
  parameters: storyDescription(
    '제품이 허용한 아이콘 타일에서 레이어 아이콘을 선택한 기본 상태입니다. 아이콘과 텍스트 이름이 함께 읽히고 현재 선택이 시각적으로 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <IconPicker options={options} defaultValue="layers" />
    </main>
  ),
};

export const DisabledOptions = {
  name: '변형·상태 · 비활성 옵션',
  parameters: storyDescription(
    '삭제와 배터리 아이콘을 선택할 수 없는 목록입니다. 비활성 타일이 포커스·선택 순서에서 제외되면서도 이유를 설명할 수 있는 상태로 보이는지 확인하세요.',
  ),
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
  name: '시나리오 · 큰 타일',
  parameters: storyDescription(
    '4열의 큰 아이콘 타일을 사용하는 넓은 터치 대상 변형입니다. 타일이 커져도 그리드 정렬과 선택 표시가 일관되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 420 }}>
      <IconPicker options={options.slice(0, 8)} defaultValue="home" columns={4} size="lg" />
    </main>
  ),
};

export const Empty = {
  name: '변형·상태 · 빈 목록',
  parameters: storyDescription(
    '제공할 아이콘이 없는 빈 상태입니다. 빈 메시지가 선택 그리드를 대신하고 사용할 수 있는 항목이 있다고 오인되지 않는지 확인하세요.',
  ),
  render: () => <IconPicker options={[]} emptyLabel="표시할 아이콘이 없습니다" />,
};

const gridOptions = options.slice(0, 8).map((option, index) =>
  (index === 6 ? { ...option, disabled: true } : option));

function tabStops(group) {
  return [...group.querySelectorAll('[role="radio"]')].filter((tile) => tile.tabIndex === 0);
}

export const KeyboardAndRovingContract = {
  name: '아이콘 선택 키보드와 roving 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 420 }}>
      <IconPicker
        data-testid="icon-picker-grid"
        options={gridOptions}
        defaultValue={gridOptions[0].value}
        columns={4}
        label="그리드 아이콘 선택"
      />
      <IconPicker
        data-testid="icon-picker-frozen"
        options={gridOptions.slice(0, 4)}
        columns={4}
        value={gridOptions[0].value}
        onChange={() => {}}
        label="값이 고정된 아이콘 선택"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const grid = canvasElement.querySelector('[data-testid="icon-picker-grid"]');
    const frozen = canvasElement.querySelector('[data-testid="icon-picker-frozen"]');
    if (!grid || !frozen) throw new Error('The IconPicker keyboard fixture is incomplete.');

    const tiles = [...grid.querySelectorAll('[role="radio"]')];
    if (tiles.length !== 8) throw new Error('The grid fixture must render eight tiles.');
    if (tiles.some((tile) => !tile.getAttribute('aria-label'))) {
      throw new Error('Every icon-only tile must carry an accessible name.');
    }
    if (tabStops(grid).length !== 1 || tiles[0].tabIndex !== 0) {
      throw new Error('The roving Tab stop must start on the selected tile.');
    }

    const expectKeyboardStep = async (key, expectedIndex, message) => {
      await userEvent.keyboard(key);
      await waitFor(() => {
        if (doc.activeElement !== tiles[expectedIndex] || tiles[expectedIndex].getAttribute('aria-checked') !== 'true') {
          throw new Error(message);
        }
      });
    };

    tiles[0].focus();
    await expectKeyboardStep('{ArrowRight}', 1, 'ArrowRight must move focus and selection to the next tile.');
    /* columns=4 그리드에서 상하 이동은 한 행씩이어야 한다. */
    await expectKeyboardStep('{ArrowDown}', 5, 'ArrowDown must move one visual row, not one tile.');
    await expectKeyboardStep('{ArrowRight}', 7, 'Linear movement must skip a disabled tile.');

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (doc.activeElement !== tiles[7]) {
        throw new Error('ArrowDown past the last row must stay on the current tile.');
      }
    });

    await expectKeyboardStep('{ArrowUp}', 3, 'ArrowUp must move one visual row back.');
    if (tabStops(grid).length !== 1) {
      throw new Error('Roving movement must never create a second Tab stop.');
    }

    /* 시각 스냅샷은 play 종료 상태를 캡처하므로 스토리의 이름난 상태로 복구한다. */
    await expectKeyboardStep('{Home}', 0, 'Home must restore the first tile so the story finishes in its named state.');

    /* controlled 사용에서 onChange가 value를 갱신하지 않아도 Tab stop은 하나여야 한다. */
    const frozenTiles = [...frozen.querySelectorAll('[role="radio"]')];
    frozenTiles[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (frozenTiles[1].tabIndex !== 0) throw new Error('The Tab stop must follow the roving position.');
    });
    if (tabStops(frozen).length !== 1) {
      throw new Error('A frozen controlled IconPicker must not expose both the selected and the focused tile as Tab stops.');
    }
    if (frozenTiles[0].getAttribute('aria-checked') !== 'true') {
      throw new Error('A frozen controlled IconPicker must keep its selection on the controlled value.');
    }

    await userEvent.keyboard('{Home}');
    await waitFor(() => {
      if (frozenTiles[0].tabIndex !== 0) throw new Error('Home must restore the roving position to the first tile.');
    });
    doc.activeElement?.blur();
  },
};
