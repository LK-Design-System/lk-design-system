import { waitFor } from 'storybook/test';
import {
  AspectRatio,
  Center,
  ScrollArea,
  Stack,
  VisuallyHidden,
} from '../src/index.js';
import {
  AspectRatioCenterCard as AspectRatioCenterCardStory,
  ScrollAreaCard as ScrollAreaCardStory,
} from './Layout.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Scroll and Accessibility',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-scroll-and-accessibility--scroll-and-access',
      eyebrow: 'Core / Layout / Scroll and Accessibility',
      title: '비율·내부 스크롤·보조 기술용 텍스트를 필요한 경계에만 적용합니다',
      description:
        '미디어 비율을 고정하거나 제한된 패널 안에 긴 내용을 스크롤하고, 시각적 아이콘에 접근 가능한 이름을 제공할 때 적합합니다. 페이지 전체 스크롤을 중첩하거나 필수 정보를 시각적으로 숨기지 말고, 일반 정렬은 Stack·Center 같은 단일 레이아웃 프리미티브를 사용하세요.',
    },
    docs: {
      description: {
        component: '고정 비율 영역, 내부 스크롤, 화면에는 숨기고 보조 기술에는 노출하는 텍스트 패턴입니다. 로컬 WDS 스냅샷에는 대응하는 별도 component-set이 없어(스크롤·접근성 유틸리티 조합) 이 유틸리티 묶음을 한 페이지에서 유지합니다.',
      },
    },
  },
};

export default meta;

export const ScrollAndAccess = {
  name: '개요',
  parameters: storyDescription(
    '16:9 미디어 영역, 높이가 제한된 운영 로그, 시각적으로 숨긴 버튼 이름을 한 화면에서 검토하는 상황입니다. 내용이 넘치는 스크롤 영역은 Tab으로 도달해 ↑↓·PageUp/PageDown으로 조작되고 이름을 가진 region으로 읽히는지, 넘치지 않는 영역은 탭 순서에 끼어들지 않는지, 숨긴 텍스트가 보조 기술에는 정확히 노출되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <AspectRatio ratio={16 / 9}>
        <Center minHeight="100%" style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          16:9 미디어 영역
        </Center>
      </AspectRatio>

      <h2 id="ops-log-heading" style={{ margin: 0, fontSize: 'var(--headline2-size)', color: 'var(--color-semantic-label-strong)' }}>운영 로그</h2>
      <ScrollArea
        maxHeight={148}
        labelledBy="ops-log-heading"
        data-testid="ops-log"
        style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}
      >
        <Stack gap="var(--space-3)">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} style={{ color: 'var(--color-semantic-label-neutral)' }}>운영 로그 {index + 1}</div>
          ))}
        </Stack>
      </ScrollArea>

      {/* 내용이 넘치지 않는 영역은 탭 순서에 들어가지 않습니다(빈 정지점 방지). */}
      <ScrollArea maxHeight={148} data-testid="short-log" style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
        <Stack gap="var(--space-3)">
          <div style={{ color: 'var(--color-semantic-label-neutral)' }}>넘치지 않는 짧은 목록</div>
        </Stack>
      </ScrollArea>

      <button type="button" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <VisuallyHidden>명령 팔레트 열기</VisuallyHidden>
        CMD
      </button>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const scrolling = canvasElement.querySelector('[data-testid="ops-log"]');
    const short = canvasElement.querySelector('[data-testid="short-log"]');
    await waitFor(() => {
      if (scrolling.getAttribute('tabindex') !== '0') {
        throw new Error('스크롤되는 영역은 키보드로 도달할 수 있어야 합니다(W3C scrollable-region-focusable, WCAG 2.1.1).');
      }
    });
    if (scrolling.getAttribute('role') !== 'region' || scrolling.getAttribute('aria-labelledby') !== 'ops-log-heading') {
      throw new Error('포커스 가능한 스크롤 영역은 이름을 가진 region으로 노출되어야 합니다.');
    }
    if (short.hasAttribute('tabindex')) {
      throw new Error('넘치지 않는 컨테이너는 탭 순서에 들어가지 않아야 합니다(빈 정지점).');
    }
    const before = scrolling.scrollTop;
    scrolling.scrollTop = 40;
    if (scrolling.scrollTop <= before) {
      throw new Error('스크롤 영역이 실제로 스크롤되지 않습니다 — maxHeight 계약을 확인하세요.');
    }
    scrolling.scrollTop = before;
  },
};

export const AspectRatioCenterCard = { ...AspectRatioCenterCardStory, name: 'AspectRatio · Center card parity', tags: ['!dev', 'visual-parity'] };
export const ScrollAreaCard = { ...ScrollAreaCardStory, name: 'ScrollArea card parity', tags: ['!dev', 'visual-parity'] };
