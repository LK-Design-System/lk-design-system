import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  Carousel,
  ContentBadge,
  Thumbnail,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Display/Carousel',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-display-carousel--carousel-slides',
      eyebrow: 'Product / Data / Carousel',
      title: '사용자가 여러 미디어의 순서와 상태를 한 흐름에서 비교합니다',
      description:
        '제품 이미지나 작업 장면처럼 같은 맥락의 미디어를 차례로 살펴볼 때 적합합니다. 모든 항목을 동시에 비교해야 하거나 각 항목에 복잡한 조작이 필요하면 Carousel 대신 Grid 또는 List를 사용하세요.',
    },
    docs: {
      description: {
        component:
          '여러 장의 미디어를 가로로 넘겨보는 Carousel 패턴입니다. WAI-ARIA APG carousel 구조(이름 있는 region + roledescription, 슬라이드 group, 화면 밖 슬라이드 inert)를 따르며 자동 회전은 opt-in이고 항상 일시정지할 수 있습니다.',
      },
    },
  },
};

export default meta;

export const CarouselSlides = {
  name: '개요',
  parameters: storyDescription(
    '상태 배지가 붙은 여러 미디어를 한 장씩 넘겨 보는 상황입니다. 슬라이드 순서와 현재 위치가 이해되고 각 미디어의 상태가 이미지와 함께 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <Carousel
        label="설비 상태 사진"
        slideLabels={['가동 중계', '준비 완료', '검토 대기']}
        slides={[
          <Thumbnail key="live" ratio="16/9" radius={false} overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="ready" ratio="16/9" radius={false} overlay={<ContentBadge tone="positive">준비됨</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="review" ratio="16/9" radius={false} overlay={<ContentBadge variant="outlined">검토 중</ContentBadge>} overlayAlign="top-right" />,
        ]}
      />
    </main>
  ),
};

function slideNodes(canvasElement) {
  return [...canvasElement.querySelectorAll('[data-carousel-slide]')];
}

export const CarouselApgContract = {
  name: 'APG 구조와 화면 밖 슬라이드 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '캐러셀이 APG carousel 구조를 갖추고, 화면 밖 슬라이드가 시각적으로만 가려지는 것이 아니라 Tab 순서와 접근성 트리에서도 빠지는지 확인하는 계약입니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <Button data-testid="carousel-before" size="sm" variant="outlined" color="assistive">앞선 컨트롤</Button>
      <Carousel
        label="점검 사진"
        slideLabels={['입고 검사', '주행 시험', '출고 검사']}
        slides={[
          <div key="a" style={{ display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-5)', background: 'var(--color-semantic-fill-normal)' }}>
            <span style={{ color: 'var(--color-semantic-label-normal)' }}>입고 검사 결과입니다.</span>
            <Button data-testid="slide-1-action" size="sm">입고 보고서 열기</Button>
          </div>,
          <div key="b" style={{ display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-5)', background: 'var(--color-semantic-fill-normal)' }}>
            <span style={{ color: 'var(--color-semantic-label-normal)' }}>주행 시험 결과입니다.</span>
            <Button data-testid="slide-2-action" size="sm">주행 로그 열기</Button>
          </div>,
          <div key="c" style={{ display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-5)', background: 'var(--color-semantic-fill-normal)' }}>
            <span style={{ color: 'var(--color-semantic-label-normal)' }}>출고 검사 결과입니다.</span>
            <Button data-testid="slide-3-action" size="sm">출고 보고서 열기</Button>
          </div>,
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const region = canvasElement.querySelector('[aria-roledescription="carousel"]');
    if (!region) throw new Error('Carousel must expose aria-roledescription="carousel" on its root.');
    if (!['region', 'group'].includes(region.getAttribute('role'))) {
      throw new Error('A carousel root must be a region (or group) so it is reachable as a named container.');
    }
    if (region.getAttribute('aria-label') !== '점검 사진') {
      throw new Error('A carousel must carry an accessible name.');
    }

    const slides = slideNodes(canvasElement);
    if (slides.length !== 3) throw new Error('The APG fixture must render three slides.');
    slides.forEach((slide, index) => {
      if (slide.getAttribute('role') !== 'group' || slide.getAttribute('aria-roledescription') !== 'slide') {
        throw new Error(`Slide ${index + 1} must be a group with aria-roledescription="slide".`);
      }
      if (!/ \/ 3$/.test(slide.getAttribute('aria-label') || '')) {
        throw new Error(`Slide ${index + 1} must be named with its "N / 전체" position.`);
      }
    });
    if (slides[0].getAttribute('aria-label') !== '입고 검사, 1 / 3') {
      throw new Error('slideLabels must prefix the positional slide name.');
    }

    // Off-screen slides leave both the accessibility tree and the tab order.
    const assertOnly = (currentIndex) => {
      slides.forEach((slide, index) => {
        const offscreen = index !== currentIndex;
        if (slide.hasAttribute('inert') !== offscreen || (slide.getAttribute('aria-hidden') === 'true') !== offscreen) {
          throw new Error(`Slide ${index + 1} must be inert and aria-hidden exactly while it is off screen.`);
        }
      });
    };
    assertOnly(0);

    const hiddenAction = canvasElement.querySelector('[data-testid="slide-2-action"]');
    hiddenAction.focus();
    if (ownerDocument.activeElement === hiddenAction) {
      throw new Error('A control inside an off-screen slide must not be able to take focus.');
    }
    canvasElement.querySelector('[data-testid="carousel-before"]').focus();
    for (let step = 0; step < 8; step += 1) {
      await userEvent.tab();
      const active = ownerDocument.activeElement;
      if (active && active.closest('[data-carousel-slide="offscreen"]')) {
        throw new Error('Tab must skip every control inside an off-screen slide.');
      }
      if (active === ownerDocument.body) break;
    }

    // Navigating exposes the next slide and hides the previous one.
    const next = canvasElement.querySelector('button[aria-label="다음 슬라이드"]');
    const previous = canvasElement.querySelector('button[aria-label="이전 슬라이드"]');
    if (!next || !previous) throw new Error('Carousel arrows must carry Korean accessible names.');
    await userEvent.click(next);
    await waitFor(() => assertOnly(1));
    const live = canvasElement.querySelector('[data-carousel-live]');
    if (live?.getAttribute('aria-live') !== 'polite' || live.textContent !== '주행 시험, 2 / 3') {
      throw new Error('A user-driven slide change must be announced politely with the new position.');
    }
    const currentDot = canvasElement.querySelector('button[aria-current="true"]');
    if (currentDot?.getAttribute('aria-label') !== '주행 시험, 2 / 3') {
      throw new Error('The dot indicator must expose the current slide with aria-current, not width alone.');
    }
    hiddenAction.focus();
    if (ownerDocument.activeElement !== hiddenAction) {
      throw new Error('A control must become focusable once its slide is on screen.');
    }

    // Restore the documented first-slide state for the visual capture.
    await userEvent.click(previous);
    await waitFor(() => assertOnly(0));
    ownerDocument.activeElement?.blur?.();
  },
};

export const CarouselAutoRotationContract = {
  name: '자동 회전 일시정지 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '자동 회전이 켜진 캐러셀이 일시정지 컨트롤을 제공하고, 포인터가 올라가면 멈추며, 회전 중에는 슬라이드 변경을 읽지 않는지 확인하는 계약입니다(WCAG 2.2.2). play는 회전을 멈추고 첫 슬라이드로 되돌린 상태로 끝납니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <Carousel
        label="자동 회전 점검 사진"
        autoPlay
        interval={100}
        slides={[
          <Thumbnail key="a" ratio="16/9" radius={false} overlay={<ContentBadge color="accent">1</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="b" ratio="16/9" radius={false} overlay={<ContentBadge tone="positive">2</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="c" ratio="16/9" radius={false} overlay={<ContentBadge variant="outlined">3</ContentBadge>} overlayAlign="top-right" />,
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[aria-roledescription="carousel"]');
    const current = () => slideNodes(canvasElement).findIndex((slide) => slide.dataset.carouselSlide === 'current');
    const live = canvasElement.querySelector('[data-carousel-live]');
    const rotation = canvasElement.querySelector('[data-carousel-rotation]');
    const stayedStill = async (ms) => {
      const at = current();
      await new Promise((resolve) => { setTimeout(resolve, ms); });
      return current() === at;
    };
    const halted = (why) => waitFor(() => {
      if (live.getAttribute('aria-live') !== 'polite') throw new Error(why);
    }, { timeout: 2000 });

    if (!rotation) throw new Error('An auto-rotating carousel must render a rotation control (WCAG 2.2.2).');
    if (rotation.getAttribute('aria-label') !== '자동 재생 일시정지') {
      throw new Error('While rotating, the rotation control must offer to pause.');
    }
    if (live?.getAttribute('aria-live') !== 'off') {
      throw new Error('Slide changes the reader did not request must not be announced while the carousel rotates.');
    }
    await waitFor(() => {
      if (current() === 0) throw new Error('An auto-playing carousel must advance on its own.');
    }, { timeout: 4000 });

    // Focus moving into the carousel halts rotation and re-enables announcements.
    const next = canvasElement.querySelector('button[aria-label="다음 슬라이드"]');
    next.focus();
    /* 문서가 OS 포커스를 갖지 않은 환경에서는 focus()가 focus 이벤트를 내지 않으므로 직접 전달한다. */
    next.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await halted('Focus inside the carousel must halt rotation so announcements become polite.');
    if (!(await stayedStill(400))) throw new Error('Rotation must stay halted while focus is inside the carousel.');
    next.blur();
    next.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

    // So does hovering it.
    await userEvent.hover(root);
    await halted('Pointer hover must halt rotation so announcements become polite.');
    if (!(await stayedStill(400))) throw new Error('Rotation must stay halted while the pointer is over the carousel.');
    await userEvent.unhover(root);

    // The pause control stops rotation for good, and the label flips.
    await userEvent.click(rotation);
    await waitFor(() => {
      if (rotation.getAttribute('aria-label') !== '자동 재생 시작') {
        throw new Error('The rotation control must flip to "start" once the carousel is paused.');
      }
    }, { timeout: 2000 });
    if (!(await stayedStill(400))) throw new Error('A paused carousel must not keep rotating.');

    // Restore the first slide so the capture is deterministic.
    const dots = [...canvasElement.querySelectorAll('button[aria-label$="/ 3"]')];
    await userEvent.click(dots[0]);
    await waitFor(() => {
      if (current() !== 0) throw new Error('The carousel must return to the first slide.');
    }, { timeout: 2000 });
    canvasElement.ownerDocument.activeElement?.blur?.();
  },
};
