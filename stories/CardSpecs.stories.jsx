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
      <dl style={{ margin: 0 }}>
        <SpecRow grouped label="상태" value="active / review / disabled" />
        <SpecRow grouped label="밀도" value="compact / regular" />
        <SpecRow grouped label="테마" value="light / dark" divider={false} />
      </dl>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('dl');
    if (!list) throw new Error('사양표는 dl 시맨틱으로 렌더되어야 합니다.');
    const terms = Array.from(list.querySelectorAll('dt'));
    const values = Array.from(list.querySelectorAll('dd'));
    if (terms.length !== 3 || values.length !== 3) {
      throw new Error('각 SpecRow는 dt/dd 한 쌍으로 라벨과 값을 연관시켜야 합니다(WCAG 1.3.1).');
    }
    if (canvasElement.querySelectorAll('dl').length !== 1) {
      throw new Error('grouped 행들은 하나의 사양표(dl)로 묶여야 합니다.');
    }
    if (terms[0].textContent.trim() !== '상태' || values[0].textContent.trim() !== 'active / review / disabled') {
      throw new Error('dt는 라벨, dd는 값이어야 합니다.');
    }
    for (const term of terms) {
      if (term.parentElement.tagName !== 'DIV' || term.parentElement.parentElement !== list) {
        throw new Error('grouped 행은 dl의 유효한 래퍼(div) 안에 dt/dd를 두어야 합니다.');
      }
    }
  },
};

export const SpecRowStandaloneContract = {
  name: 'SpecRow 단독 행 계약',
  tags: ['!dev'],
  render: () => (
    <div style={{ width: 360 }}>
      <SpecRow data-contract="standalone" label="펌웨어" value="4.8.1" divider={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-contract="standalone"]');
    if (!row || row.tagName !== 'DL') {
      throw new Error('grouped 없이 쓰는 단독 행은 그 자체가 단일 쌍 dl이어야 합니다.');
    }
    if (!row.querySelector('dt') || !row.querySelector('dd')) {
      throw new Error('단독 행도 dt/dd 쌍을 유지해야 합니다.');
    }
    if (getComputedStyle(row.querySelector('dd')).marginLeft !== '0px') {
      throw new Error('dd의 브라우저 기본 들여쓰기가 남아 있으면 값 컬럼 정렬이 깨집니다.');
    }
  },
};

export const SpecRowCard = { ...SpecRowCardStory, name: 'SpecRow card parity', tags: ['!dev', 'visual-parity'] };
