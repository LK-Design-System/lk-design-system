import {
  Col,
  Columns,
  Grid,
} from '../src/index.js';
import {
  ColumnsColCard as ColumnsColCardStory,
  GridCard as GridCardStory,
} from './Layout.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/1 Layout/Grid and Columns',
  parameters: {
    docs: {
      description: {
        component: '반응형 열 배치와 반복 카드 배치에 쓰는 Columns, Col, Grid 패턴입니다.',
      },
    },
  },
};

export default meta;

const sampleTile = (label, tone = 'normal') => (
  <div
    style={{
      minHeight: 84,
      display: 'grid',
      placeItems: 'center',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      background: tone === 'accent' ? 'var(--lk-accent-tint)' : 'var(--surface-card)',
      color: tone === 'accent' ? 'var(--lk-accent-ink)' : 'var(--label-neutral)',
      fontWeight: 'var(--fw-bold)',
    }}
  >
    {label}
  </div>
);

export const GridAndColumns = {
  name: '그리드와 컬럼',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 960 }}>
      <Columns gap="var(--space-4)">
        <Col span={12} md={8}>{sampleTile('메인 영역 md=8', 'accent')}</Col>
        <Col span={12} md={4}>{sampleTile('보조 영역 md=4')}</Col>
      </Columns>

      <Grid minItemWidth={180} gap="var(--space-4)">
        {['문서 카드', '상태 카드', '설정 카드', '알림 카드'].map((label) => sampleTile(label))}
      </Grid>
    </main>
  ),
};

export const ColumnsColCard = { ...ColumnsColCardStory, name: 'Columns · Col card parity', tags: ['!dev', 'visual-parity'] };
export const GridCard = { ...GridCardStory, name: 'Grid card parity', tags: ['!dev', 'visual-parity'] };
