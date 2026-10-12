import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Checkbox } from '../src/index.js';
import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Motion',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-motion--overview',
      eyebrow: 'Foundation / Motion',
      title: 'Motion은 상태와 공간 관계를 설명하고 reduced motion에서도 의미를 남깁니다',
      description: 'Macro·Micro, Enter·Exit, duration과 easing을 구분하고 실시간 데이터 과장·transition: all·motion-only 의미 전달을 금지합니다.',
    },
    docs: { description: { component: 'LDS timing token과 reduced-motion hygiene를 설계 선택 기준에 연결합니다.' } },
  },
};

export default meta;

const distance = 128;
const samples = [
  { id: 'fast', label: '빠르게', duration: '--dur-fast', easing: '--ease-standard', group: 'duration' },
  { id: 'base', label: '기본', duration: '--dur-base', easing: '--ease-standard', group: 'duration' },
  { id: 'slow', label: '느리게', duration: '--dur-slow', easing: '--ease-standard', group: 'duration' },
  { id: 'standard', label: '기본 곡선', duration: '--dur-slow', easing: '--ease-standard', group: 'easing' },
  { id: 'emphasized', label: '강조 곡선', duration: '--dur-slow', easing: '--ease-emphasized', group: 'easing' },
  { id: 'in-out', label: '가속·감속 곡선', duration: '--dur-slow', easing: '--ease-in-out', group: 'easing' },
];

function MotionComparison() {
  const rootRef = React.useRef(null);
  const animations = React.useRef([]);
  const generation = React.useRef(0);
  const [phase, setPhase] = React.useState('ready');
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [systemReduced, setSystemReduced] = React.useState(false);
  const [durations, setDurations] = React.useState({});

  const cancel = React.useCallback((freeze = false) => {
    generation.current += 1;
    for (const { node, animation } of animations.current) {
      if (freeze) node.style.transform = node.ownerDocument.defaultView.getComputedStyle(node).transform;
      animation.cancel();
    }
    animations.current = [];
  }, []);

  React.useEffect(() => {
    const root = rootRef.current;
    const view = root.ownerDocument.defaultView;
    const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
    const refreshDurations = () => {
      const styles = view.getComputedStyle(root);
      for (const { animation, sample } of animations.current) {
        if (preference.matches || !['running', 'paused'].includes(animation.playState)) continue;
        const previousDuration = Number(animation.effect.getTiming().duration);
        const ratio = previousDuration > 0 ? Math.min(1, Math.max(0, Number(animation.currentTime ?? 0) / previousDuration)) : 0;
        const duration = styles.getPropertyValue(sample.duration).trim();
        const milliseconds = Number.parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
        const currentTime = ratio * milliseconds;
        // Keep the same progress and play state without briefly finishing when
        // a shorter duration would otherwise fall behind the old currentTime.
        if (milliseconds < previousDuration) animation.currentTime = currentTime;
        animation.effect.updateTiming({ duration: milliseconds, easing: styles.getPropertyValue(sample.easing).trim() });
        if (milliseconds >= previousDuration) animation.currentTime = currentTime;
      }
      setDurations(Object.fromEntries(samples.map((sample) => [sample.id, styles.getPropertyValue(sample.duration).trim()])));
    };
    const updatePreference = () => {
      setSystemReduced(preference.matches);
      refreshDurations();
    };
    updatePreference();
    preference.addEventListener('change', updatePreference);
    const observer = new view.MutationObserver(refreshDurations);
    for (let ancestor = root; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ['data-lds-profile', 'data-theme', 'class'] });
    }
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      cancel();
    };
  }, [cancel]);

  React.useEffect(() => {
    if (!(reduceMotion || systemReduced)) return;
    cancel();
    rootRef.current.querySelectorAll('[data-motion-sample]').forEach((node) => {
      node.style.transform = `translateX(${distance}px)`;
    });
    setPhase('reduced');
  }, [reduceMotion, systemReduced, cancel]);

  const replay = () => {
    cancel();
    const root = rootRef.current;
    const view = root.ownerDocument.defaultView;
    const styles = view.getComputedStyle(root);
    const reduced = reduceMotion || view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentGeneration = generation.current;
    const currentDurations = {};
    for (const sample of samples) {
      const node = root.querySelector(`[data-motion-sample="${sample.id}"]`);
      const duration = styles.getPropertyValue(sample.duration).trim();
      currentDurations[sample.id] = duration;
      const milliseconds = Number.parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
      node.style.transform = `translateX(${reduced ? distance : 0}px)`;
      if (reduced) continue;
      const animation = node.animate(
        [{ transform: 'translateX(0px)' }, { transform: `translateX(${distance}px)` }],
        { duration: milliseconds, easing: styles.getPropertyValue(sample.easing).trim(), fill: 'forwards' },
      );
      animations.current.push({ node, animation, sample });
    }
    setDurations(currentDurations);
    setPhase(reduced ? 'reduced' : 'playing');
    if (reduced) return;
    Promise.allSettled(animations.current.map(({ animation }) => animation.finished)).then(() => {
      if (generation.current !== currentGeneration) return;
      for (const { node, animation } of animations.current) {
        node.style.transform = `translateX(${distance}px)`;
        animation.cancel();
      }
      animations.current = [];
      setPhase('complete');
    });
  };

  const stop = () => {
    if (phase !== 'playing') return;
    cancel(true);
    setPhase('stopped');
  };

  const status = { ready: '출발 전', playing: '이동 중', complete: '도착', stopped: '정지', reduced: '도착 · 동작 줄임' }[phase];
  return (
    <section ref={rootRef} aria-label="시간과 곡선 비교" data-motion-demo data-motion-phase={phase} style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 880, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <Button size="sm" onClick={replay}>재생</Button>
        <Button size="sm" variant="secondary" aria-disabled={phase !== 'playing'} onClick={stop}>정지</Button>
        <Checkbox size="sm" label="동작 줄이기" checked={reduceMotion || systemReduced} disabled={systemReduced} onChange={setReduceMotion} />
        <span role="status" style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)' }}>{status}</span>
      </div>
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)' }}>
        모든 표본이 같은 128px를 이동합니다. 시간 비교는 곡선을, 곡선 비교는 시간을 고정합니다. 동작을 줄이면 이동 없이 도착 상태를 보여줍니다.
      </p>
      {['duration', 'easing'].map((group) => (
        <section key={group} aria-label={group === 'duration' ? '시간 길이' : '가속과 감속'} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)' }}>{group === 'duration' ? '시간 길이' : '가속과 감속'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-4)' }}>
            {samples.filter((sample) => sample.group === group).map((sample) => (
              <div key={sample.id} style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
                <strong style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-semibold)' }}>{sample.label} · {durations[sample.id]}</strong>
                <code style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', overflowWrap: 'anywhere' }}>{group === 'duration' ? sample.duration : sample.easing}</code>
                <div aria-hidden="true" style={{ width: 160, maxWidth: '100%', height: 32, borderRadius: 'var(--radius-full)', background: 'var(--color-semantic-fill-alternative)' }}>
                  <span data-motion-sample={sample.id} style={{ display: 'block', width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--color-semantic-primary-normal)' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}

const tokens = foundationSpecimenStory('motion');
export const Overview = {
  ...tokens,
  name: '개요',
  parameters: storyDescription('같은 거리를 이동하는 표본을 직접 재생하며 시간 길이와 곡선의 차이를 살펴봅니다. 정지는 현재 위치를 유지하고, 동작 줄이기는 이동 없이 도착 상태를 보여줍니다. 표본과 토큰 표는 현재 프로필의 실제 값을 표시합니다.'),
  render: () => <div style={{ display: 'grid', gap: 'var(--space-8)', minWidth: 0 }}><MotionComparison />{tokens.render()}</div>,
  play: async (context) => {
    await verifyFoundationSpecimenAtNarrowWidth(context);
    const { canvasElement } = context;
    const root = canvasElement.querySelector('[data-motion-demo]');
    const replay = [...root.querySelectorAll('button')].find((button) => button.textContent === '재생');
    const stop = [...root.querySelectorAll('button')].find((button) => button.textContent === '정지');
    const preference = root.querySelector('input[type="checkbox"]');
    const movingSamples = () => [...root.querySelectorAll('[data-motion-sample]')].flatMap((node) => node.getAnimations());
    const view = root.ownerDocument.defaultView;
    const samplePositions = () => [...root.querySelectorAll('[data-motion-sample]')].map((node) => new view.DOMMatrixReadOnly(view.getComputedStyle(node).transform).m41);
    if (movingSamples().length !== 0) throw new Error('Motion 표본은 자동 재생하지 않아야 합니다.');
    await userEvent.click(replay);
    await waitFor(() => {
      if (!['complete', 'reduced'].includes(root.dataset.motionPhase)) throw new Error('재생은 한 번의 이동 뒤 끝나야 합니다.');
    });
    const positions = samplePositions();
    if (positions.length !== 6 || positions.some((position) => position !== distance)) throw new Error('모든 표본은 같은 거리를 이동해야 합니다.');
    if (!preference.checked) {
      // Pin native animations mid-flight before waiting so short durations cannot finish during the test.
      replay.click();
      for (const animation of movingSamples()) {
        animation.pause();
        animation.currentTime = Number(animation.effect.getTiming().duration) / 2;
      }
      await waitFor(() => {
        const midpoints = samplePositions();
        if (root.dataset.motionPhase !== 'playing' || midpoints.length !== 6 || midpoints.some((position) => position <= 0 || position >= distance)) {
          throw new Error('정지 검증은 모든 표본이 이동 중인 중간 위치에서 시작해야 합니다.');
        }
      });
      await userEvent.click(stop);
      if (root.dataset.motionPhase !== 'stopped' || movingSamples().length !== 0) throw new Error('정지는 모든 이동을 함께 멈춰야 합니다.');
      const frozenPositions = samplePositions();
      await new Promise((resolve) => view.requestAnimationFrame(() => view.requestAnimationFrame(resolve)));
      if (samplePositions().some((position, index) => Math.abs(position - frozenPositions[index]) > 0.01)) throw new Error('정지한 표본은 현재 위치를 유지해야 합니다.');
      await userEvent.click(preference);
      await waitFor(() => {
        if (root.dataset.motionPhase !== 'reduced' || movingSamples().length !== 0 || samplePositions().some((position) => position !== distance)) {
          throw new Error('정지 후 동작 줄이기를 켜면 재생 없이 도착 상태로 전환해야 합니다.');
        }
      });
    }
    await userEvent.click(replay);
    if (root.dataset.motionPhase !== 'reduced' || movingSamples().length !== 0) throw new Error('동작 줄이기는 이동 없이 도착 상태를 유지해야 합니다.');
    if (!preference.disabled) {
      await userEvent.click(preference);
      await userEvent.click(replay);
      await waitFor(() => {
        if (root.dataset.motionPhase !== 'complete') throw new Error('동작 줄이기를 해제하면 다시 한 번 재생할 수 있어야 합니다.');
      });
    }
    canvasElement.ownerDocument.activeElement?.blur?.();
  },
};
