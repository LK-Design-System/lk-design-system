import React from 'react';
import { ReorderList } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Content/Reorder List',
  parameters: {
    docs: {
      description: {
        component: '드래그(또는 Alt+↑/↓)로 순서를 바꾸는 ReorderList 패턴입니다. 태스크 스텝·파이프라인 단계 정렬에 씁니다.',
      },
    },
  },
};

export default meta;

const initial = [
  { id: 'a', label: '맵 로드', detail: 'b1_floor.pgm' },
  { id: 'b', label: '초기 위치 설정', detail: 'Dock A' },
  { id: 'c', label: '순찰 경로 실행', detail: 'Zone 3 · 4 waypoints' },
  { id: 'd', label: '도킹 복귀', detail: 'Dock A' },
];

export const ReorderLists = {
  name: '재정렬 리스트',
  render: () => {
    const [items, setItems] = React.useState(initial);
    return (
      <ReorderList
        items={items}
        onReorder={(ids) => setItems(ids.map((id) => items.find((i) => i.id === id)))}
      />
    );
  },
};
