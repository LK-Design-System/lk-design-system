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
  tags: ['autodocs'],
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

const mediaCarouselFrameStyle = {
  boxSizing: 'border-box',
  border: '1px solid var(--color-semantic-line-normal-normal)',
};

export const CarouselSlides = {
  name: '개요',
  parameters: storyDescription(
    '상태 배지가 붙은 여러 미디어를 한 장씩 넘겨 보는 상황입니다. Carousel이 PageIndicator의 media presentation을 재사용해 8px 도트·22×8px 활성 pill·32×44px 선택 영역을 제공하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <Carousel
        label="설비 상태 사진"
        slideLabels={['가동 중계', '준비 완료', '검토 대기']}
        style={mediaCarouselFrameStyle}
        slides={[
          <Thumbnail key="live" ratio="16/9" radius={false} border={false} overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="ready" ratio="16/9" radius={false} border={false} overlay={<ContentBadge tone="positive">준비됨</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="review" ratio="16/9" radius={false} border={false} overlay={<ContentBadge variant="outlined">검토 중</ContentBadge>} overlayAlign="top-right" />,
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('[role="group"][aria-label="설비 상태 사진 슬라이드 선택"]');
    const indicator = picker?.closest('[data-page-indicator-presentation="media"]');
    const buttons = picker ? Array.from(picker.querySelectorAll('button')) : [];
    const active = picker?.querySelector('[data-lds-page-indicator-dot="active"]');
    const inactive = picker?.querySelector('[data-lds-page-indicator-dot="inactive"]');
    if (!indicator || buttons.length !== 3 || !active || !inactive) {
      throw new Error('Carousel must compose the shared media PageIndicator.');
    }
    const carousel = picker.closest('[aria-roledescription="carousel"]');
    const thumbnail = carousel?.querySelector('[data-carousel-slide="current"] > div');
    const carouselStyle = carousel ? getComputedStyle(carousel) : null;
    const thumbnailStyle = thumbnail ? getComputedStyle(thumbnail) : null;
    if (
      !carouselStyle
      || carouselStyle.borderTopStyle === 'none'
      || !thumbnailStyle
      || thumbnailStyle.borderTopStyle !== 'none'
    ) {
      throw new Error('The rounded Carousel frame must own one continuous border; slide thumbnails must not draw a clipped inner border.');
    }
    const activeRect = active.getBoundingClientRect();
    const inactiveRect = inactive.getBoundingClientRect();
    const targetRect = buttons[0].getBoundingClientRect();
    if (
      activeRect.width !== 22
      || activeRect.height !== 8
      || inactiveRect.width !== 8
      || inactiveRect.height !== 8
      || targetRect.width < 32
      || targetRect.height < 44
    ) {
      throw new Error('Carousel media indicators must keep the shared geometry contract.');
    }
    await userEvent.click(buttons[1]);
    await waitFor(() => {
      if (buttons[1].getAttribute('aria-current') !== 'true') {
        throw new Error('The selected slide picker must expose aria-current="true".');
      }
    });
    await userEvent.click(buttons[0]);
    await waitFor(() => {
      if (buttons[0].getAttribute('aria-current') !== 'true') {
        throw new Error('The overview must restore the first slide.');
      }
    });
    canvasElement.ownerDocument.activeElement?.blur?.();
  },
};

function PromoSlide({ eyebrow, title, body, period, cta }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        alignContent: 'center',
        minHeight: 240,
        /* 하단 56px은 재생·페이지 선택을 묶은 중앙 컨트롤 바의 안전 여백 —
           슬라이드 콘텐츠가 전환 컨트롤과 겹치지 않는다. */
        padding: 'var(--space-6) var(--space-6) 56px',
        background: 'linear-gradient(120deg, var(--color-semantic-primary-surface-strong), var(--color-semantic-primary-surface-normal))',
        color: 'var(--color-semantic-label-strong)',
      }}
    >
      {eyebrow && <span className="lk-overline lk-overline--signal" style={{ margin: 0 }}>{eyebrow}</span>}
      <strong style={{ fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)', fontWeight: 'var(--fw-extra)', letterSpacing: 'var(--title2-spacing)' }}>{title}</strong>
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)' }}>{body}</p>
      {period && <span style={{ fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)' }}>{period}</span>}
      {cta && <span style={{ marginTop: 'var(--space-2)' }}><Button variant="primary">{cta}</Button></span>}
    </div>
  );
}

export const PromotionalBanner = {
  name: '사용법 · 자동 회전 프로모션 배너',
  parameters: storyDescription(
    '여러 안내를 한 자리에서 번갈아 노출하는 상황입니다. 하단 중앙 컨트롤 바에서 자동 재생과 페이지를 함께 조작합니다. hover 중에는 잠시 멈추고, 키보드 포커스가 들어오면 명시적으로 다시 재생하기 전까지 멈춥니다(WCAG 2.2.2). 각 배너의 제목·기간·행동 유도가 순서대로 읽히는지도 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 760 }}>
      <Carousel
        label="운영 안내 배너"
        autoPlay
        interval={6000}
        showArrows={false}
        slideLabels={['정기 점검 안내', '경로 최적화 가이드', '관제 서비스']}
        slides={[
          <PromoSlide key="maintenance" eyebrow="EVENT" title="정기 점검 운영 캠페인" body="점검 기간에 주요 설비의 상태를 확인하세요." period="2026.06.08 ~ 2026.07.31 · 온라인" cta="자세히 보기" />,
          <PromoSlide key="route" eyebrow="GUIDE" title="혼잡 구간 경로 최적화 가이드" body="운영 시간대에 맞춰 우회 경로를 설정합니다." period="상시 · 온라인" cta="가이드 열기" />,
          <PromoSlide key="control" eyebrow="SERVICE" title="관제 서비스 도입 상담" body="로봇 상태와 작업 로그를 한 곳에서 운영하세요." period="문의 접수 중" cta="상담 신청" />,
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[aria-roledescription="carousel"]');
    if (!region) throw new Error('프로모션 배너도 APG carousel region으로 노출되어야 합니다.');
    const controls = region.querySelector('[data-carousel-controls]');
    const picker = controls?.querySelector('[role="group"][aria-label="운영 안내 배너 슬라이드 선택"]');
    if (!controls || !picker) {
      throw new Error('자동 재생과 이름 있는 슬라이드 선택 그룹은 하나의 컨트롤 rail 안에 있어야 합니다.');
    }
    const pause = canvasElement.querySelector('button[aria-label="자동 재생 일시정지"]');
    if (!pause) throw new Error('자동 회전 배너는 일시정지 컨트롤을 제공해야 합니다(WCAG 2.2.2).');
    if (controls.firstElementChild !== pause) {
      throw new Error('회전 컨트롤은 캐러셀 컨트롤 그룹의 첫 번째 탭 대상이어야 합니다.');
    }
    const currentPage = picker.querySelector('button[aria-current="true"]');
    if (!currentPage) throw new Error('현재 페이지 선택은 이름 있는 PageIndicator 그룹 안에 있어야 합니다.');
    const pauseRect = pause.getBoundingClientRect();
    if (pauseRect.width < 44 || pauseRect.height < 44) {
      throw new Error('자동 재생 컨트롤은 최소 44×44px 클릭 영역을 제공해야 합니다.');
    }
    const regionRect = region.getBoundingClientRect();
    const controlsRect = controls.getBoundingClientRect();
    const regionCenter = regionRect.left + (regionRect.width / 2);
    const controlsCenter = controlsRect.left + (controlsRect.width / 2);
    if (Math.abs(regionCenter - controlsCenter) > 1) {
      throw new Error('자동 재생과 페이지 선택 컨트롤은 캐러셀 하단 중앙에 정렬되어야 합니다.');
    }
    if (canvasElement.querySelector('button[aria-label="이전 슬라이드"]')) {
      throw new Error('showArrows={false}이면 화살표 컨트롤이 없어야 합니다.');
    }
    // 자동 회전을 멈춰 스토리를 안정된 상태로 남긴다.
    await userEvent.click(pause);
    await waitFor(() => {
      if (!canvasElement.querySelector('button[aria-label="자동 재생 시작"]')) {
        throw new Error('일시정지 후에는 재생 컨트롤로 전환되어야 합니다.');
      }
    });
    pause.blur();
  },
};

export const ControlVariants = {
  name: '변형·상태 · 컨트롤 구성',
  parameters: storyDescription(
    '도트와 화살표 컨트롤의 유무를 비교하는 상황입니다. 도트만 두는 배너형, 화살표만 두는 미디어형, 둘 다 두는 기본형에서 현재 위치와 이동 수단이 각각 분명하게 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 560 }}>
      <Carousel label="도트만" showArrows={false} slideLabels={['1', '2', '3']} style={mediaCarouselFrameStyle}
        slides={[<Thumbnail key="a" ratio="16/9" radius={false} border={false} />, <Thumbnail key="b" ratio="16/9" radius={false} border={false} />, <Thumbnail key="c" ratio="16/9" radius={false} border={false} />]} />
      <Carousel label="화살표만" showDots={false} slideLabels={['1', '2', '3']} style={mediaCarouselFrameStyle}
        slides={[<Thumbnail key="a" ratio="16/9" radius={false} border={false} />, <Thumbnail key="b" ratio="16/9" radius={false} border={false} />, <Thumbnail key="c" ratio="16/9" radius={false} border={false} />]} />
    </main>
  ),
};

export const NarrowCarousel = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px 폭에서 텍스트·CTA 슬라이드를 배치하는 상황입니다. 측면 화살표는 슬라이드 카피를 가리므로 텍스트 슬라이드는 도트만 사용하고(showArrows={false}), 좁은 폭에서 제목·본문·CTA가 접혀 읽히며 가로 overflow가 없는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="carousel-narrow" style={{ width: 320, maxWidth: '100%' }}>
      <Carousel
        label="좁은 폭 배너"
        showArrows={false}
        slideLabels={['1', '2', '3']}
        slides={[
          <PromoSlide key="a" title="좁은 폭 프로모션" body="320px에서도 제목과 CTA가 접혀 읽힙니다." cta="보기" />,
          <PromoSlide key="b" title="두 번째 배너" body="화면 밖 슬라이드는 Tab에서 빠집니다." cta="보기" />,
          <PromoSlide key="c" title="세 번째 배너" body="도트로 현재 위치를 표시합니다." cta="보기" />,
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="carousel-narrow"]');
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) {
      throw new Error('Carousel은 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
    // 텍스트 슬라이드는 측면 화살표를 두지 않아 CTA가 가려지지 않는다.
    if (canvasElement.querySelector('button[aria-label="이전 슬라이드"]')) {
      throw new Error('텍스트·CTA 슬라이드는 측면 화살표가 콘텐츠를 가리므로 도트만 사용해야 합니다.');
    }
    const cta = [...canvasElement.querySelectorAll('[data-carousel-slide="current"] button')].pop();
    const rect = (el) => el.getBoundingClientRect();
    if (cta) {
      const c = rect(cta);
      const overlapping = [...canvasElement.querySelectorAll('button[aria-label="다음 슬라이드"], button[aria-label="이전 슬라이드"]')]
        .map(rect)
        .some((a) => !(a.right < c.left || c.right < a.left || a.bottom < c.top || c.bottom < a.top));
      if (overlapping) throw new Error('전환 컨트롤이 슬라이드 CTA를 덮으면 안 됩니다.');
    }
  },
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
    '자동 회전 캐러셀이 첫 번째 탭 대상으로 44px 재생 컨트롤을 제공하고, hover 중에는 일시 정지하며, 포커스로 멈춘 뒤에는 명시적 재생 전까지 정지 상태를 유지하는지 확인하는 계약입니다(WCAG 2.2.2). play는 회전을 멈추고 첫 슬라이드로 되돌린 상태로 끝납니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <Carousel
        label="자동 회전 점검 사진"
        autoPlay
        interval={100}
        style={mediaCarouselFrameStyle}
        slides={[
          <Thumbnail key="a" ratio="16/9" radius={false} border={false} overlay={<ContentBadge color="accent">1</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="b" ratio="16/9" radius={false} border={false} overlay={<ContentBadge tone="positive">2</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="c" ratio="16/9" radius={false} border={false} overlay={<ContentBadge variant="outlined">3</ContentBadge>} overlayAlign="top-right" />,
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[aria-roledescription="carousel"]');
    const current = () => slideNodes(canvasElement).findIndex((slide) => slide.dataset.carouselSlide === 'current');
    const live = canvasElement.querySelector('[data-carousel-live]');
    const rotation = canvasElement.querySelector('[data-carousel-rotation]');
    const controls = root?.querySelector('[data-carousel-controls]');
    const stayedStill = async (ms) => {
      const at = current();
      await new Promise((resolve) => { setTimeout(resolve, ms); });
      return current() === at;
    };
    const halted = (why) => waitFor(() => {
      if (live.getAttribute('aria-live') !== 'polite') throw new Error(why);
    }, { timeout: 2000 });

    if (!root || !live) throw new Error('The carousel region and its live status must be rendered.');
    if (!rotation) throw new Error('An auto-rotating carousel must render a rotation control (WCAG 2.2.2).');
    if (!controls || controls.firstElementChild !== rotation) {
      throw new Error('The rotation control must be the first control in the grouped carousel controls.');
    }
    const rotationRect = rotation.getBoundingClientRect();
    if (rotationRect.width < 44 || rotationRect.height < 44) {
      throw new Error('The rotation control must provide at least a 44×44px target.');
    }
    if (rotation.getAttribute('aria-label') !== '자동 재생 일시정지') {
      throw new Error('While rotating, the rotation control must offer to pause.');
    }
    if (live?.getAttribute('aria-live') !== 'off') {
      throw new Error('Slide changes the reader did not request must not be announced while the carousel rotates.');
    }
    await waitFor(() => {
      if (current() === 0) throw new Error('An auto-playing carousel must advance on its own.');
    }, { timeout: 4000 });

    // Hover temporarily holds rotation, then resumes when the pointer leaves.
    await userEvent.hover(root);
    await halted('Pointer hover must halt rotation so announcements become polite.');
    if (!(await stayedStill(400))) throw new Error('Rotation must stay halted while the pointer is over the carousel.');
    await userEvent.unhover(root);
    const afterHover = current();
    await waitFor(() => {
      if (live.getAttribute('aria-live') !== 'off' || current() === afterHover) {
        throw new Error('Rotation must resume after the pointer leaves an otherwise playing carousel.');
      }
    }, { timeout: 4000 });

    // Focus halts rotation until the user explicitly starts it again.
    const next = canvasElement.querySelector('button[aria-label="다음 슬라이드"]');
    next.focus();
    /* 문서가 OS 포커스를 갖지 않은 환경에서는 focus()가 focus 이벤트를 내지 않으므로 직접 전달한다. */
    next.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await halted('Focus inside the carousel must halt rotation so announcements become polite.');
    await waitFor(() => {
      if (rotation.getAttribute('aria-label') !== '자동 재생 시작') {
        throw new Error('Focus entering the carousel must change the rotation control to "start".');
      }
    }, { timeout: 2000 });
    if (!(await stayedStill(400))) throw new Error('Rotation must stay halted while focus is inside the carousel.');
    next.blur();
    next.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    if (!(await stayedStill(400))) {
      throw new Error('Rotation stopped by focus must not restart merely because focus left the carousel.');
    }

    // Explicit restart works even though activating the control focuses it.
    await userEvent.click(rotation);
    await waitFor(() => {
      if (rotation.getAttribute('aria-label') !== '자동 재생 일시정지' || live.getAttribute('aria-live') !== 'off') {
        throw new Error('Explicit restart must resume rotation and switch the control back to "pause".');
      }
    }, { timeout: 2000 });
    const afterRestart = current();
    await waitFor(() => {
      if (current() === afterRestart) throw new Error('Explicit restart must advance the carousel again.');
    }, { timeout: 4000 });

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
