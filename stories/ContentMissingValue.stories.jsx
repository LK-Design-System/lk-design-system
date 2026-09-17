import { MissingValue } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Missing Value',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-missing-value--missing-value-overview',
      eyebrow: 'Core / Content / Missing Value',
      title: '사용자가 값이 없는 자리를 빈 칸이나 0과 구분해 읽습니다',
      description:
        '표와 항목값 목록에서 이 행에는 값이 없다는 사실을 전달합니다. 목록에 행이 하나도 없거나 아직 불러오는 중이면 셀이 아니라 EmptyState와 ResourceState가 그 상태를 소유합니다.',
      decisionGuidance: {
        useWhen: '행은 있는데 이 셀이나 항목의 값만 비어 있어, 값이 없다는 사실 자체를 데이터로 읽혀야 할 때 사용합니다.',
        avoidWhen: '목록에 행이 하나도 없거나(EmptyState) 아직 불러오는 중이거나 실패했을 때(ResourceState), 그리고 값이 숫자 0이거나 빈 문자열이어서 그대로 표시해야 할 때는 사용하지 않습니다.',
      },
    },
    docs: {
      description: {
        component:
          '값이 없는 자리를 보이는 em dash와 보조기술용 "값 없음"으로 함께 전달하는 MissingValue입니다.',
      },
    },
  },
};

export default meta;

const cellStyle = {
  padding: 'var(--space-3) var(--space-4)',
  borderBottom: '1px solid var(--color-semantic-line-solid-alternative)',
  textAlign: 'left',
  color: 'var(--color-semantic-label-normal)',
};

function SampleTable({ width }) {
  return (
    <table style={{ width, borderCollapse: 'collapse', fontSize: 'var(--label1-size)' }}>
      <caption style={{ ...cellStyle, borderBottom: 0, color: 'var(--color-semantic-label-strong)' }}>장치</caption>
      <thead>
        <tr>
          <th scope="col" style={cellStyle}>이름</th>
          <th scope="col" style={cellStyle}>담당</th>
          <th scope="col" style={cellStyle}>미처리</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" style={cellStyle}>RBT-006</th>
          <td style={cellStyle}>장진혁</td>
          <td style={cellStyle}>3</td>
        </tr>
        <tr>
          <th scope="row" style={cellStyle}>RBT-003</th>
          <td style={cellStyle}><MissingValue /></td>
          <td style={cellStyle}>0</td>
        </tr>
      </tbody>
    </table>
  );
}

export const MissingValueOverview = {
  name: '개요',
  parameters: storyDescription(
    '담당자가 지정되지 않은 행을 읽는 상황입니다. 값이 없는 자리는 조용하지만 읽을 수 있는 대비를 유지하고, 미처리 0은 결측으로 위장하지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560, minWidth: 0 }}>
      <SampleTable width="100%" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelectorAll('tbody tr')[1].querySelectorAll('td')[0];
    const glyph = cell.querySelector('[aria-hidden="true"]');
    if (!glyph || glyph.textContent !== '—') {
      throw new Error('보이는 자리에는 em dash가 aria-hidden으로 그려져야 한다 — 낭독은 문구가 맡는다.');
    }
    if (!cell.textContent.includes('값 없음')) {
      throw new Error('보조기술에 읽히는 "값 없음" 문구가 없다.');
    }
    const zeroCell = canvasElement.querySelectorAll('tbody tr')[1].querySelectorAll('td')[1];
    if (zeroCell.textContent.trim() !== '0') {
      throw new Error('숫자 0은 결측이 아니다 — 같은 표시로 합치지 않는다.');
    }
  },
};

export const MissingValueLabelOverride = {
  name: '변형·상태 · 해당 없음',
  parameters: storyDescription(
    '항목 자체가 이 행에 적용되지 않는 경우입니다. 글리프는 같고 보조기술 문구만 달라지는지, 그리고 그 두 문구 외의 임의 설명을 셀에 넣지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 320, minWidth: 0 }}>
      <span>결측: <MissingValue /></span>
      <span>해당 없음: <MissingValue label="해당 없음" /></span>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const values = [...canvasElement.querySelectorAll('span > span[aria-hidden="true"]')];
    if (values.length !== 2 || !values.every((node) => node.textContent === '—')) {
      throw new Error('두 경우 모두 같은 글리프를 그려야 한다 — 다른 것은 낭독 문구뿐이다.');
    }
    if (!canvasElement.textContent.includes('해당 없음')) {
      throw new Error('label로 전달한 문구가 보조기술 텍스트로 나타나지 않는다.');
    }
  },
};

export const MissingValueCard = {
  name: 'Missing value card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 520, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <SampleTable width="100%" />
    </div>
  ),
};

export const MissingValueNarrow = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 폭에서 표를 읽는 상황입니다. 한 글자라 줄바꿈 대상이 아니며, 인접 값과 붙어 보이지 않도록 간격은 표가 소유하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 320, minWidth: 0 }}>
      <SampleTable width={320} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelectorAll('tbody tr')[1].querySelectorAll('td')[0];
    if (cell.getBoundingClientRect().height > 64) {
      throw new Error('좁은 폭에서 결측 표시가 셀 높이를 늘리고 있다 — 한 글자는 줄바꿈되지 않아야 한다.');
    }
  },
};
