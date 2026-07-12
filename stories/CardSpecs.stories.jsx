import {
  Card,
  SpecRow,
} from '../src/index.js';
import { SpecRowCard as SpecRowCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Spec Row',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-spec-row--spec-rows',
      eyebrow: 'Product / Spec Row',
      title: '사용자가 제원과 설정값의 라벨·값 관계를 행 단위로 비교합니다',
      description:
        '제품 제원이나 읽기 전용 설정처럼 짧은 label/value 쌍을 일정한 간격으로 보여 줄 때 적합합니다. 정렬·정렬 변경이 필요한 대규모 데이터나 편집 입력에는 SpecRow 대신 Table 또는 Form Field를 사용하세요.',
    },
    docs: {
      description: {
        component: '제원과 설정값처럼 label/value 정보를 일정한 행으로 보여주는 SpecRow 패턴입니다.',
      },
    },
  },
};

export default meta;

export const SpecRows = {
  name: '개요',
  parameters: storyDescription(
    '상태·밀도·테마 제원을 한 카드 안에서 연속된 행으로 제시하는 상황입니다. 라벨과 값의 대응이 분명하고 마지막 행의 divider 처리까지 일관적인지 확인하세요.',
  ),
  render: () => (
    <Card elevation="sm" padding={22} style={{ width: 360 }}>
      <SpecRow label="상태" value="active / review / disabled" />
      <SpecRow label="밀도" value="compact / regular" />
      <SpecRow label="테마" value="light / dark" divider={false} />
    </Card>
  ),
};

export const SpecRowCard = { ...SpecRowCardStory, name: 'SpecRow card parity', tags: ['!dev', 'visual-parity'] };
