import { Divider } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Divider',
  component: Divider,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-divider--divider-variants',
      eyebrow: 'Core / Layout / Divider',
      title: '인접한 콘텐츠 그룹의 경계를 최소한의 선으로 구분합니다',
      description:
        '같은 표면 안에서 의미가 다른 섹션이나 인라인 그룹의 경계를 보조할 때 적합합니다. 주제가 바뀌는 경계는 기본값(role="separator")으로, 이미 목록·제목으로 구조가 잡힌 곳의 리듬용 선은 decorative로 구분하세요. 공간만으로 위계가 충분하면 여백을 우선하고, 독립된 표면이 필요하면 Card나 Section을 사용하며 모든 행 사이에 습관적으로 선을 넣지 마세요.',
    },
    docs: {
      description: {
        component: 'Divider의 WDS 변형(normal, thick, vertical)을 다루는 레이아웃 프리미티브입니다.',
      },
    },
  },
};

export default meta;

export const DividerVariants = {
  name: '개요',
  parameters: storyDescription(
    '콘텐츠 구획의 강도와 방향에 따라 기본선, 굵은선, 세로선을 선택하는 상황입니다. 선이 주변 여백과 정렬되고 세로 구분선은 인라인 항목의 높이를 넘지 않으며 불필요한 시각 소음을 만들지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>variant = normal</strong>
        <Divider />
      </div>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>variant = thick</strong>
        <Divider variant="thick" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 56 }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>vertical = true</strong>
        <Divider vertical />
        <span style={{ color: 'var(--color-semantic-label-neutral)' }}>인라인 그룹 구분선</span>
      </div>
    </main>
  ),
};

export const DividerSemantics = {
  name: '사용법 · 의미 있는 구분선과 장식 선',
  parameters: storyDescription(
    '같은 선이라도 "콘텐츠 주제가 바뀐다"는 의미를 전달하는 구분선과, 이미 목록 구조가 잡힌 곳에 리듬만 더하는 장식 선을 나눠 검토하는 상황입니다. 화면상 굵기와 색은 같고 보조 기술에 노출되는 정보만 달라지는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 720 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>의미 있는 구분선 — role=&quot;separator&quot;</strong>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>장비 개요</p>
        <Divider />
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>점검 이력 — 앞 단락과 주제가 바뀝니다</p>
        <Divider label="또는" />
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>수동 점검 요청</p>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>장식 선 — decorative (role=&quot;none&quot;, aria-hidden)</strong>
        <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-2)' }}>
          <li style={{ color: 'var(--color-semantic-label-neutral)' }}>항목 1</li>
          <li aria-hidden="true"><Divider decorative /></li>
          <li style={{ color: 'var(--color-semantic-label-neutral)' }}>항목 2</li>
          <li aria-hidden="true"><Divider decorative /></li>
          <li style={{ color: 'var(--color-semantic-label-neutral)' }}>항목 3</li>
        </ul>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)' }}>
          목록 구조가 이미 경계를 알려주므로 행 사이 선은 장식입니다. decorative가 없으면 스크린리더가 &quot;구분자&quot;를 항목 수만큼 반복해서 읽습니다.
        </p>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const semantic = canvasElement.querySelectorAll('[role="separator"]');
    if (semantic.length !== 1) {
      throw new Error('label 구분선은 role="separator"로 노출되어야 합니다(가로 hr은 암시적 role을 씁니다).');
    }
    if (semantic[0].getAttribute('aria-label') !== '또는') {
      throw new Error('label 구분선의 라벨은 aria-label로 노출되어야 합니다(separator의 자식은 presentational).');
    }
    const rules = [...canvasElement.querySelectorAll('hr')];
    if (rules.some((hr) => hr.getAttribute('role') === 'separator')) {
      throw new Error('네이티브 hr에 role="separator"를 중복 선언하지 않습니다.');
    }
    const decorativeRules = rules.filter((hr) => hr.getAttribute('role') === 'none');
    if (decorativeRules.length !== 2 || !decorativeRules.every((hr) => hr.getAttribute('aria-hidden') === 'true')) {
      throw new Error('decorative 구분선은 role="none" + aria-hidden이어야 합니다.');
    }
  },
};
