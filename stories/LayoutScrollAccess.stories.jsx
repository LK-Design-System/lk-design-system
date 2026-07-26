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
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-scroll-and-accessibility--scroll-and-access',
      eyebrow: 'Core / Layout / Scroll and Accessibility',
      title: '스크롤은 네이티브 동작을 유지하고 필요한 경계만 LDS가 통제합니다',
      description:
        '기본 스크롤바는 OS·브라우저 설정을 존중합니다. 공간이 좁은 메뉴와 패널만 compact를 선택하고, 스크롤바가 나타나도 내용 폭이 흔들리지 않도록 기본 gutter를 확보합니다. 실제로 넘치는 영역은 키보드로 도달할 수 있어야 합니다.',
    },
    docs: {
      description: {
        component: '고정 비율 영역, 내부 스크롤, 화면에는 숨기고 보조 기술에는 노출하는 텍스트 패턴입니다. 스크롤·접근성 유틸리티를 한 페이지에서 비교합니다.',
      },
    },
  },
};

export default meta;

const surface = {
  background: 'var(--color-semantic-background-elevated-normal)',
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-4)',
};

const heading = {
  margin: 0,
  fontSize: 'var(--headline2-size)',
  color: 'var(--color-semantic-label-strong)',
};

export const ScrollAndAccess = {
  name: '개요',
  parameters: storyDescription(
    '기본 OS 스크롤바, 좁은 영역용 compact, 가로 스크롤과 비스크롤 상태를 비교합니다. 넘치는 영역만 Tab으로 도달하고 이름을 가진 region으로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', width: '100%', maxWidth: 880 }}>
      <AspectRatio ratio={16 / 9}>
        <Center minHeight="100%" style={surface}>
          16:9 미디어 영역
        </Center>
      </AspectRatio>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div>
          <h2 id="ops-log-heading" style={heading}>기본 · OS 설정 존중</h2>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-alternative)' }}>제품 본문과 일반 패널의 기본값입니다.</p>
        </div>
        <ScrollArea
          maxHeight={152}
          labelledBy="ops-log-heading"
          data-testid="default-scroll"
          style={surface}
        >
          <Stack gap="var(--space-3)">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} style={{ color: 'var(--color-semantic-label-neutral)' }}>운영 로그 {index + 1}</div>
            ))}
          </Stack>
        </ScrollArea>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', alignContent: 'start', gap: 'var(--space-3)' }}>
          <h2 id="compact-heading" style={heading}>Compact · 제한된 패널</h2>
          <ScrollArea
            maxHeight={152}
            labelledBy="compact-heading"
            scrollbar="compact"
            data-testid="compact-scroll"
            style={{ background: 'var(--color-semantic-inverse-background)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}
          >
            <Stack gap="var(--space-3)">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} style={{ color: 'var(--color-semantic-inverse-label)' }}>장비 이벤트 {index + 1}</div>
              ))}
            </Stack>
          </ScrollArea>
        </div>

        <div style={{ display: 'grid', alignContent: 'start', gap: 'var(--space-3)' }}>
          <h2 id="short-heading" style={heading}>내용이 짧은 상태</h2>
          <ScrollArea
            maxHeight={152}
            labelledBy="short-heading"
            data-testid="short-scroll"
            style={surface}
          >
            <div style={{ color: 'var(--color-semantic-label-neutral)' }}>스크롤이 생기지 않으면 탭 정지점도 만들지 않습니다.</div>
          </ScrollArea>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="horizontal-heading" style={heading}>가로 데이터 스트립</h2>
        <ScrollArea
          maxHeight="none"
          labelledBy="horizontal-heading"
          data-testid="horizontal-scroll"
          style={surface}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 150px)', gap: 'var(--space-2)', minWidth: 'max-content' }}>
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-fill-normal)', color: 'var(--color-semantic-label-neutral)' }}>열 {index + 1}</div>
            ))}
          </div>
        </ScrollArea>
      </section>

      <button type="button" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <VisuallyHidden>명령 팔레트 열기</VisuallyHidden>
        CMD
      </button>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const scrolling = canvasElement.querySelector('[data-testid="default-scroll"]');
    const compact = canvasElement.querySelector('[data-testid="compact-scroll"]');
    const horizontal = canvasElement.querySelector('[data-testid="horizontal-scroll"]');
    const short = canvasElement.querySelector('[data-testid="short-scroll"]');

    await waitFor(() => {
      if (scrolling.getAttribute('tabindex') !== '0') {
        throw new Error('스크롤되는 영역은 키보드로 도달할 수 있어야 합니다(W3C scrollable-region-focusable, WCAG 2.1.1).');
      }
      if (compact.getAttribute('tabindex') !== '0' || horizontal.getAttribute('tabindex') !== '0') {
        throw new Error('세로·가로 오버플로 모두 키보드 포커스를 받아야 합니다.');
      }
    });

    if (scrolling.getAttribute('role') !== 'region' || scrolling.getAttribute('aria-labelledby') !== 'ops-log-heading') {
      throw new Error('포커스 가능한 스크롤 영역은 이름을 가진 region으로 노출되어야 합니다.');
    }
    if (scrolling.dataset.scrollbar !== 'auto' || getComputedStyle(scrolling).scrollbarGutter !== 'stable') {
      throw new Error('기본 스크롤 표면은 OS 스크롤바와 stable gutter를 사용해야 합니다.');
    }
    if (compact.dataset.scrollbar !== 'compact' || getComputedStyle(compact).scrollbarWidth !== 'thin') {
      throw new Error('공간이 제한된 표면만 compact 스크롤바를 선택해야 합니다.');
    }
    if (short.hasAttribute('tabindex')) {
      throw new Error('넘치지 않는 컨테이너는 탭 순서에 들어가지 않아야 합니다(비정지점).');
    }

    const before = scrolling.scrollTop;
    scrolling.scrollTop = 40;
    if (scrolling.scrollTop <= before) {
      throw new Error('세로 스크롤 영역이 실제로 이동하지 않습니다.');
    }
    scrolling.scrollTop = before;

    const horizontalBefore = horizontal.scrollLeft;
    horizontal.scrollLeft = 80;
    if (horizontal.scrollLeft <= horizontalBefore) {
      throw new Error('가로 스크롤 표면이 실제로 이동하지 않습니다.');
    }
    horizontal.scrollLeft = horizontalBefore;
  },
};

export const AspectRatioCenterCard = { ...AspectRatioCenterCardStory, name: 'AspectRatio · Center card parity', tags: ['!dev', 'visual-parity'] };
export const ScrollAreaCard = { ...ScrollAreaCardStory, name: 'ScrollArea card parity', tags: ['!dev', 'visual-parity'] };
