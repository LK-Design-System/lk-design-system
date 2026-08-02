import { Typography as TypographyStory } from './Foundations.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Typography',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-typography--typography',
      eyebrow: 'Foundation / Typography',
      title: '타이포그래피는 콘텐츠의 읽는 순서와 중요도를 먼저 설계합니다',
      description:
        '제목·본문·캡션의 semantic typography token을 정보 위계에 맞춰 사용하세요. 단순히 글자를 크게 보이게 하려고 임의 크기나 굵기를 추가하지 말고, 같은 역할은 화면이 달라도 같은 스타일을 유지합니다.',
    },
    docs: {
      description: {
        component: '본문, 캡션, 제목 등 텍스트 위계에 쓰는 타이포그래피 토큰 예시입니다.',
      },
    },
  },
};

export default meta;

export const Typography = {
  ...TypographyStory,
  name: '개요',
  parameters: {
    ...TypographyStory.parameters,
    ...storyDescription(
      'LDS의 제목·본문·레이블·캡션 계층을 실제 문장으로 비교합니다. 콘텐츠 역할에 맞는 토큰을 고르고, 줄 길이와 행간이 달라져도 읽는 순서가 명확한지 확인하세요.',
    ),
  },
};

export const ReadingRhythm = {
  name: '참조 · 긴 본문 행간',
  parameters: storyDescription(
    '긴 설명과 보조 문장을 위한 reading 유틸리티를 비교합니다. 크기와 굵기는 기존 계층을 유지하면서 기본 UI 레이블보다 넓은 행간만 적용합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 680 }}>
      <p className="type-body1-reading" data-testid="body-reading" style={{ margin: 0 }}>
        본문이 여러 줄로 이어질 때는 body reading 행간을 사용해 문장 사이의 시각적 밀도를 낮춥니다. 짧은 버튼과 표 레이블에는 기본 body 또는 label 계층을 유지합니다.
      </p>
      <p className="type-label1-reading" data-testid="label-reading" style={{ margin: 0 }}>
        카드 설명이나 보조 안내처럼 작은 글자가 여러 줄로 이어지면 label reading 행간을 사용할 수 있습니다.
      </p>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector('[data-testid="body-reading"]');
    const label = canvasElement.querySelector('[data-testid="label-reading"]');
    if (getComputedStyle(body).lineHeight !== '26px' || getComputedStyle(label).lineHeight !== '22px') {
      throw new Error('Reading utility classes must use the published reading line-height tokens.');
    }
  },
};
