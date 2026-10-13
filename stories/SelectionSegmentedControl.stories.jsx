import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Icon, SegmentedControl } from '../src/index.js';
import { SegmentedControlCard as SegmentedControlCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Segmented Control',
  tags: ['autodocs'],
  component: SegmentedControl,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-segmented-control--segmented-control-overview',
      eyebrow: 'Core / Segmented Control',
      title: '세그먼티드 컨트롤은 같은 맥락의 보기나 모드 하나를 즉시 전환합니다',
      description:
        '동시에 하나만 활성화되는 2–4개의 짧고 대등한 보기에 사용하세요. 서로 독립적인 기능을 실행하는 버튼 묶음에는 Toggle Button이 더 적합합니다.',
    },
  },
};

export default meta;

export const SegmentedControlOverview = {
  name: '개요',
  parameters: storyDescription(
    '목록 보기를 대등한 세 가지 모드로 전환합니다. 탭으로는 현재 선택에 한 번만 진입하고, 화살표·Home·End로 값을 바꿉니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <SegmentedControl aria-label="로봇 보기" options={['상태', '목록', '로그']} defaultValue="목록" full />
    </main>
  ),
};

export const SegmentedControlStates = {
  name: '상태와 좁은 너비',
  tags: ['!dev'],
  render: () => {
    const iconOptions = [
      { value: 'list', label: '목록', icon: <Icon name="list" size={15} /> },
      { value: 'grid', label: '그리드', icon: <Icon name="apps" size={15} /> },
      { value: 'map', label: '지도', icon: <Icon name="globe" size={15} />, disabled: true },
    ];
    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', width: 280, maxWidth: '100%' }}>
        <SegmentedControl aria-label="솔리드 보기" options={['상태', '목록', '로그']} defaultValue="목록" full />
        <SegmentedControl aria-label="아웃라인 보기" options={iconOptions} defaultValue="grid" variant="outlined" full />
        <SegmentedControl aria-label="비활성 보기" options={['상태', '목록']} defaultValue="상태" disabled full />
      </main>
    );
  },
};

function SegmentedMotionFixture() {
  const [value, setValue] = React.useState('status');
  const [narrow, setNarrow] = React.useState(false);
  return (
    <section style={{ display: 'grid', gap: 'var(--space-2)', width: narrow ? 240 : 320, maxWidth: '100%' }}>
      <SegmentedControl
        data-contract="motion"
        aria-label="선택 전환 보기"
        value={value}
        onChange={setValue}
        options={[
          { value: 'status', label: '상태', count: 12 },
          { value: 'history', label: '최근 장치 연결 및 동작 이력', count: 8 },
          { value: 'disabled', label: '미지원', disabled: true },
          { value: 'log', label: '로그', count: 3 },
        ]}
        full
      />
      <output data-contract="selected-value">{value}</output>
      <Button variant="outlined" color="assistive" size="sm" data-contract="resize-motion" onClick={() => setNarrow((previous) => !previous)}>폭 변경</Button>
      <div dir="rtl">
        <SegmentedControl data-contract="rtl" aria-label="오른쪽에서 왼쪽 보기" options={['첫째', '둘째', '셋째']} defaultValue="첫째" full />
      </div>
    </section>
  );
}

export const SegmentedKeyboardContract = {
  name: '선택·키보드·모션 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 320, maxWidth: '100%' }}>
      <SegmentedControl
        data-contract="keyboard"
        aria-label="키보드 보기"
        options={[
          { value: 'status', label: '상태' },
          { value: 'list', label: '목록', interaction: 'inactive' },
          { value: 'map', label: '지도', disable: true },
          { value: 'log', label: '로그' },
        ]}
        defaultValue="status"
      />
      {['sm', 'md', 'lg'].map((size) => (
        <SegmentedControl
          key={size}
          data-contract={`size-${size}`}
          aria-label={`${size} 보기`}
          options={['목록', '카드']}
          size={size}
        />
      ))}
      <SegmentedControl
        data-contract="disabled-selected"
        aria-label="비활성 선택 보기"
        options={['선택됨', '선택 안 됨']}
        defaultValue="선택됨"
        disabled
      />
      <SegmentedMotionFixture />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const keyboardGroup = canvasElement.querySelector('[data-contract="keyboard"]');
    const radios = [...(keyboardGroup?.querySelectorAll('[role="radio"]') ?? [])];
    if (radios.length !== 4 || radios.filter((radio) => radio.tabIndex === 0).length !== 1) {
      throw new Error('The radiogroup must expose one roving tab stop.');
    }
    if (!radios[1].disabled || radios[1].getAttribute('aria-disabled') !== 'true'
      || !radios[2].disabled || radios[2].getAttribute('aria-disabled') !== 'true') {
      throw new Error('interaction inactive and disable aliases must converge on the disabled option contract.');
    }
    radios[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    if (radios[3].getAttribute('aria-checked') !== 'true' || canvasElement.ownerDocument.activeElement !== radios[3]) {
      throw new Error('ArrowRight must skip disabled segments, select the next value, and move focus.');
    }
    await userEvent.keyboard('{Home}');
    if (radios[0].getAttribute('aria-checked') !== 'true') throw new Error('Home must select the first enabled segment.');
    await userEvent.keyboard('{End}');
    if (radios[3].getAttribute('aria-checked') !== 'true') throw new Error('End must select the last enabled segment.');

    const expectedHeights = { sm: 32, md: 40, lg: 48 };
    for (const [size, expectedHeight] of Object.entries(expectedHeights)) {
      const group = canvasElement.querySelector(`[data-contract="size-${size}"]`);
      if (!group || Math.abs(group.getBoundingClientRect().height - expectedHeight) > 0.5) {
        throw new Error(`${size} SegmentedControl outer box must be ${expectedHeight}px.`);
      }
    }

    const disabledSelected = canvasElement.querySelector('[data-contract="disabled-selected"] [data-selected="true"]');
    const disabledUnselected = canvasElement.querySelector('[data-contract="disabled-selected"] [data-selected="false"]');
    const disabledSurface = canvasElement.querySelector('[data-contract="disabled-selected"] [data-lds-segmented-surface]');
    if (!disabledSelected?.disabled || !disabledUnselected?.disabled
      || !disabledSurface || disabledSurface.getAttribute('aria-hidden') !== 'true'
      || getComputedStyle(disabledSurface).backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error('Disabled SegmentedControl must preserve selection with a neutral visual cue.');
    }

    const view = canvasElement.ownerDocument.defaultView;
    const motionGroup = canvasElement.querySelector('[data-contract="motion"]');
    const motionRadios = [...motionGroup.querySelectorAll('[role="radio"]')];
    const selectedValue = canvasElement.querySelector('[data-contract="selected-value"]');
    const surface = motionGroup.querySelector('[data-lds-segmented-surface]');
    if (!surface || surface.getAttribute('aria-hidden') !== 'true') throw new Error('A solid selection surface must remain decorative.');
    const expectSurfaceAtSelection = async (group) => waitFor(() => {
      const selected = group.querySelector('[aria-checked="true"]');
      const indicator = group.querySelector('[data-lds-segmented-surface]');
      const target = selected?.getBoundingClientRect();
      const current = indicator?.getBoundingClientRect();
      if (!target || !current || Math.abs(target.left - current.left) > 1
        || Math.abs(target.top - current.top) > 1 || Math.abs(target.width - current.width) > 1
        || Math.abs(target.height - current.height) > 1) {
        throw new Error('The moving surface must settle on the latest selected segment after selection or resize.');
      }
    });
    await userEvent.click(motionRadios[1]);
    if (motionRadios[1].getAttribute('aria-checked') !== 'true' || selectedValue.textContent !== 'history') {
      throw new Error('Controlled value and radio semantics must update before the visual transition completes.');
    }
    await userEvent.click(motionRadios[3]);
    await expectSurfaceAtSelection(motionGroup);
    if (motionRadios[3].getAttribute('aria-checked') !== 'true' || selectedValue.textContent !== 'log') {
      throw new Error('Rapid selection must preserve the latest controlled value.');
    }
    await userEvent.click(canvasElement.querySelector('[data-contract="resize-motion"]'));
    await expectSurfaceAtSelection(motionGroup);
    if (motionGroup.scrollWidth > motionGroup.clientWidth + 1) throw new Error('Long labels and counts must fit a narrow segmented track.');
    if (!motionRadios[1].textContent.includes('최근 장치 연결 및 동작 이력8')) throw new Error('Truncation must preserve the full accessible label and count.');

    const rtlGroup = canvasElement.querySelector('[data-contract="rtl"]');
    const rtlRadios = [...rtlGroup.querySelectorAll('[role="radio"]')];
    rtlRadios[0].focus();
    await userEvent.keyboard('{ArrowLeft}');
    if (rtlRadios[1].getAttribute('aria-checked') !== 'true' || canvasElement.ownerDocument.activeElement !== rtlRadios[1]) {
      throw new Error('RTL inline arrow navigation must follow the mirrored visual order.');
    }
    await expectSurfaceAtSelection(rtlGroup);
    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const node of canvasElement.querySelectorAll('[data-lds-segmented-motion]')) {
        if (view.getComputedStyle(node).transitionDuration.split(',').some((duration) => Number.parseFloat(duration) !== 0)) {
          throw new Error('Reduced motion must stop interpolation while preserving the selected endpoint.');
        }
      }
    }
  },
};

export const CountedSingleSelectFilter = {
  name: '건수 있는 단일 선택 필터',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 420, maxWidth: '100%' }}>
      <SegmentedControl
        data-contract="counted-filter"
        aria-label="프로젝트 상태 필터"
        options={[
          { value: 'all', label: '전체', count: 12 },
          { value: 'active', label: '진행 중', count: 8 },
          { value: 'paused', label: '보류', count: 3 },
        ]}
        defaultValue="all"
        full
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-contract="counted-filter"]');
    const radios = [...(group?.querySelectorAll('[role="radio"]') ?? [])];
    const counts = [...(group?.querySelectorAll('[data-segment-count="true"]') ?? [])];
    if (group?.getAttribute('role') !== 'radiogroup' || radios.length !== 3 || counts.length !== 3) {
      throw new Error('Counted filters must preserve one radiogroup with one count per radio option.');
    }
    if (radios.map((radio) => radio.textContent?.replace(/\s+/g, ' ').trim()).join('|') !== '전체12|진행 중8|보류3') {
      throw new Error('Each result count must remain in the accessible radio label.');
    }
    radios[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    if (radios[1].getAttribute('aria-checked') !== 'true' || canvasElement.ownerDocument.activeElement !== radios[1]) {
      throw new Error('Counted filters must retain arrow-key selection and roving focus.');
    }
  },
};

export const SegmentedControlCard = {
  ...SegmentedControlCardStory,
  name: 'SegmentedControl card parity',
  tags: ['!dev', 'visual-parity'],
};

function SegmentedControlSurfaceRefFixture() {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current?.setAttribute('data-ref-target', 'segmented-root');
  }, []);
  return (
    <SegmentedControl
      ref={ref}
      options={['목록', '그리드']}
      defaultValue="목록"
      className="contract-segmented-root"
      classNames={{ segment: 'contract-segment' }}
      styles={{ label: { letterSpacing: '2px' } }}
      vars={{ '--lds-segmented-control-height': '44px' }}
    />
  );
}

export const SurfaceRefContract = {
  name: 'Surface and ref contract',
  tags: ['!dev'],
  render: () => <SegmentedControlSurfaceRefFixture />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-ref-target="segmented-root"]');
    const segments = [...(root?.querySelectorAll('[data-slot="segment"]') ?? [])];
    const label = segments[0]?.querySelector('[data-slot="label"]');
    if (!(root instanceof HTMLDivElement) || root.getAttribute('role') !== 'radiogroup' || root.dataset.slot !== 'root') {
      throw new Error('SegmentedControl ref must target the radiogroup root.');
    }
    if (!root.classList.contains('contract-segmented-root') || !segments.every((segment) => segment.classList.contains('contract-segment'))) {
      throw new Error('SegmentedControl root and named segment classes must compose independently.');
    }
    if (segments[0]?.dataset.state !== 'checked' || getComputedStyle(root).height !== '44px' || getComputedStyle(label).letterSpacing !== '2px') {
      throw new Error('SegmentedControl state, vars, and named-part styles must reach their documented targets.');
    }
  },
};
