import {
  Card,
  SpecRow,
} from '../src/index.js';
import { SpecRowCard as SpecRowCardStory } from './CardsExtended.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Spec Row',
  parameters: {
    docs: {
      description: {
        component: '제원과 설정값처럼 label/value 정보를 일정한 행으로 보여주는 SpecRow 패턴입니다.',
      },
    },
  },
};

export default meta;

export const SpecRows = {
  name: '스펙 행',
  render: () => (
    <Card elevation="sm" padding={22} style={{ width: 360 }}>
      <SpecRow label="상태" value="active / review / disabled" />
      <SpecRow label="밀도" value="compact / regular" />
      <SpecRow label="테마" value="light / dark" divider={false} />
    </Card>
  ),
};

export const SpecRowCard = { ...SpecRowCardStory, name: 'SpecRow card parity', tags: ['!dev', 'visual-parity'] };
