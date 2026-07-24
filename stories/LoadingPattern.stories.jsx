import React from 'react';
import { userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Dimmer,
  ProgressBar,
  ResourceState,
  Skeleton,
  Spinner,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const surface = {
  minWidth: 0,
  padding: 'var(--space-5)',
  border: 'var(--component-card-border)',
  borderRadius: 'var(--component-card-radius)',
  background: 'var(--color-semantic-background-elevated-normal)',
  boxShadow: 'var(--component-card-shadow-sm)',
};

const heading = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 'var(--heading2-size)',
  lineHeight: 'var(--heading2-line)',
};

const copy = {
  margin: 0,
  color: 'var(--color-semantic-label-neutral)',
  lineHeight: 1.65,
};

function PatternPage({ children, testId, width = 1040 }) {
  return (
    <main
      data-testid={testId}
      style={{
        display: 'grid',
        gap: 'var(--space-6)',
        width: `min(100%, ${width}px)`,
        minWidth: 0,
      }}
    >
      {children}
    </main>
  );
}

function SectionTitle({ children, description }) {
  return (
    <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <h2 style={heading}>{children}</h2>
      {description ? <p style={copy}>{description}</p> : null}
    </header>
  );
}

function RuleCard({ title, children, accent = false }) {
  return (
    <article
      style={{
        ...surface,
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--space-3)',
        borderColor: accent ? 'var(--color-semantic-primary-normal)' : undefined,
      }}
    >
      <h3 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)' }}>{title}</h3>
      <div style={copy}>{children}</div>
    </article>
  );
}

function IndicatorPreview({ recommendation }) {
  if (recommendation.kind === 'none') {
    return <span data-testid="indicator-none">표시 없이 즉시 결과로 전환</span>;
  }
  if (recommendation.kind === 'skeleton') {
    return (
      <div data-loading-indicator data-testid="indicator-skeleton" style={{ display: 'grid', gap: 'var(--space-2)', width: '100%' }}>
        <Skeleton variant="text" length="60%" />
        <Skeleton variant="text" length="92%" />
        <Skeleton variant="text" length="76%" />
      </div>
    );
  }
  if (recommendation.kind === 'progress') {
    return (
      <div data-loading-indicator data-testid="indicator-progress" style={{ width: '100%' }}>
        <ProgressBar label="작업 진행률" value={64} showValue />
      </div>
    );
  }
  return (
    <div data-loading-indicator data-testid="indicator-spinner">
      <Spinner label="불러오는 중" />
    </div>
  );
}

function resolveRecommendation({ seconds, layoutKnown, measurable }) {
  if (seconds <= 1) {
    return {
      kind: 'none',
      title: '인디케이터 없음',
      reason: '1초 안에 끝나는 작업은 표시가 오히려 플리커를 만듭니다.',
    };
  }
  if (measurable && seconds >= 4) {
    return {
      kind: 'progress',
      title: '확정 Progress',
      reason: seconds >= 10
        ? '측정 가능한 장기 작업은 진행률과 남은 단계가 기다림을 설명합니다.'
        : '완료량을 알 수 있으므로 추정 애니메이션보다 실제 진행률을 보여줍니다.',
    };
  }
  if (layoutKnown) {
    return {
      kind: 'skeleton',
      title: 'Skeleton',
      reason: '도착할 콘텐츠 구조를 알고 있으므로 레이아웃을 미리 예약합니다.',
    };
  }
  return {
    kind: 'spinner',
    title: 'Spinner',
    reason: '구조와 진행률을 알 수 없는 짧고 국소적인 기다림입니다.',
  };
}

function DecisionLab({ narrow = false }) {
  const [seconds, setSeconds] = React.useState(2);
  const [layoutKnown, setLayoutKnown] = React.useState(false);
  const [measurable, setMeasurable] = React.useState(false);
  const [scope, setScope] = React.useState('region');
  const recommendation = resolveRecommendation({ seconds, layoutKnown, measurable });
  const needsEscape = seconds >= 60;

  const fieldStyle = {
    display: 'grid',
    gap: 'var(--space-2)',
    minWidth: 0,
    color: 'var(--color-semantic-label-strong)',
    fontWeight: 'var(--fw-medium)',
  };
  const controlStyle = {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: 44,
    padding: '0 var(--space-3)',
    border: '1px solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-semantic-background-elevated-normal)',
    color: 'var(--color-semantic-label-strong)',
    font: 'inherit',
  };

  return (
    <section
      data-testid={narrow ? 'narrow-decision-lab' : 'decision-lab'}
      style={{ ...surface, display: 'grid', gap: 'var(--space-5)', width: narrow ? 320 : '100%', maxWidth: '100%', boxSizing: 'border-box' }}
    >
      <SectionTitle description="시간은 시작점일 뿐입니다. 실제 선택은 콘텐츠 구조와 진행률 측정 가능 여부가 함께 결정합니다.">
        로딩 신호 선택 실험실
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: 'var(--space-4)' }}>
        <label style={fieldStyle}>
          예상 시간
          <select
            data-testid="duration-select"
            value={seconds}
            onChange={(event) => setSeconds(Number(event.target.value))}
            style={controlStyle}
          >
            <option value="0.5">0.5초</option>
            <option value="2">2초</option>
            <option value="7">7초</option>
            <option value="15">15초</option>
            <option value="90">90초</option>
          </select>
        </label>
        <label style={fieldStyle}>
          로딩 범위
          <select
            data-testid="scope-select"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
            style={controlStyle}
          >
            <option value="control">단일 control</option>
            <option value="region">특정 region</option>
            <option value="page">page·route 본문</option>
            <option value="long">장기 작업 표면</option>
          </select>
        </label>
        <label style={{ ...fieldStyle, gridTemplateColumns: 'auto 1fr', alignItems: 'center', alignContent: 'center' }}>
          <input
            data-testid="layout-known"
            type="checkbox"
            checked={layoutKnown}
            onChange={(event) => setLayoutKnown(event.target.checked)}
            style={{ width: 44, height: 44, margin: 0, accentColor: 'var(--color-semantic-primary-normal)' }}
          />
          콘텐츠 구조를 안다
        </label>
        <label style={{ ...fieldStyle, gridTemplateColumns: 'auto 1fr', alignItems: 'center', alignContent: 'center' }}>
          <input
            data-testid="progress-measurable"
            type="checkbox"
            checked={measurable}
            onChange={(event) => setMeasurable(event.target.checked)}
            style={{ width: 44, height: 44, margin: 0, accentColor: 'var(--color-semantic-primary-normal)' }}
          />
          실제 진행률을 잴 수 있다
        </label>
      </div>
      <div
        data-loading-scope={scope}
        aria-busy={recommendation.kind === 'none' ? undefined : 'true'}
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1fr) minmax(160px, 0.65fr)',
          alignItems: 'center',
          gap: 'var(--space-5)',
          minWidth: 0,
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-normal-alternative)',
        }}
      >
        <div role="status" aria-live="polite" style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
          <strong data-testid="recommendation-title" style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)' }}>
            {recommendation.title}
          </strong>
          <span style={copy}>{recommendation.reason}</span>
          {needsEscape ? (
            <span data-testid="long-task-guidance" style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-medium)' }}>
              장기 작업: 1분 이상이면 취소 또는 background 전환과 완료 통지를 함께 제공합니다.
            </span>
          ) : null}
        </div>
        <div style={{ display: 'grid', placeItems: 'center', minWidth: 0, minHeight: 72 }}>
          <IndicatorPreview recommendation={recommendation} />
        </div>
      </div>
    </section>
  );
}

const meta = {
  title: 'LDS Core/Patterns/Loading',
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-core-patterns-loading--loading-decision-guide',
      eyebrow: 'Core / Patterns',
      title: '로딩 패턴은 기다리는 대상과 같은 범위에서 하나의 주 신호를 선택합니다',
      description:
        '비동기 작업의 범위·예상 시간·콘텐츠 구조·진행률 측정 가능 여부를 함께 판단할 때 사용하세요. 같은 작업에 Skeleton과 Spinner를 겹치거나 제품의 timeout 정책을 디자인 시스템 숫자로 대신하지 마세요.',
    },
    docs: {
      description: {
        component:
          'Spinner, Skeleton, Progress, Dimmer, ResourceState를 개별 부품이 아니라 로딩 범위와 작업 단계에 따라 선택하는 LDS Core 교차 컴포넌트 패턴입니다.',
      },
    },
  },
};

export default meta;

export const LoadingDecisionGuide = {
  name: '개요',
  parameters: storyDescription(
    '1초 미만의 무표시부터 1분 이상의 취소 가능한 확정 진행까지 선택 기준을 직접 바꿔보는 개요입니다. 한 loading scope 안에 주 인디케이터가 하나만 남는지 확인하세요.',
  ),
  render: () => (
    <PatternPage testId="loading-overview">
      <DecisionLab />
      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <SectionTitle description="컴포넌트 이름보다 사용자가 무엇을 기다리고 무엇을 계속할 수 있는지가 먼저입니다.">
          선택 순서
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'var(--space-4)' }}>
          <RuleCard title="1. 범위를 정한다">control, region, route 본문, 장기 작업 중 기다리는 대상을 먼저 고릅니다.</RuleCard>
          <RuleCard title="2. 진실을 보여준다">진행률을 잴 수 있을 때만 확정 Progress를 사용합니다.</RuleCard>
          <RuleCard title="3. 하나만 남긴다" accent>같은 범위의 Skeleton, Spinner, indeterminate Progress를 중복하지 않습니다.</RuleCard>
        </div>
      </section>
    </PatternPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scope = canvasElement.querySelector('[data-loading-scope]');
    if (!scope || scope.querySelectorAll('[data-loading-indicator]').length !== 1) {
      throw new Error('The initial loading scope must expose exactly one dominant indicator.');
    }

    await userEvent.click(canvas.getByLabelText('콘텐츠 구조를 안다'));
    await waitFor(() => {
      if (!canvas.queryByTestId('indicator-skeleton')) throw new Error('Known layouts must recommend Skeleton.');
    });

    await userEvent.selectOptions(canvas.getByTestId('duration-select'), '15');
    await userEvent.click(canvas.getByLabelText('실제 진행률을 잴 수 있다'));
    await waitFor(() => {
      if (!canvas.queryByTestId('indicator-progress')) throw new Error('Measurable long tasks must recommend determinate Progress.');
      if (scope.querySelectorAll('[data-loading-indicator]').length !== 1) throw new Error('A loading scope must never stack indicators.');
    });

    await userEvent.selectOptions(canvas.getByTestId('duration-select'), '0.5');
    await waitFor(() => {
      if (!canvas.queryByTestId('indicator-none') || scope.querySelector('[data-loading-indicator]')) {
        throw new Error('Sub-second work must avoid a visible loading indicator.');
      }
    });

    // Leave the public Canvas in its documented default instead of the final
    // assertion state, so visual review and first-time readers see one coherent
    // unknown-layout recommendation.
    await userEvent.click(canvas.getByLabelText('콘텐츠 구조를 안다'));
    await userEvent.click(canvas.getByLabelText('실제 진행률을 잴 수 있다'));
    await userEvent.selectOptions(canvas.getByTestId('duration-select'), '2');
    await waitFor(() => {
      if (!canvas.queryByTestId('indicator-spinner') || scope.querySelectorAll('[data-loading-indicator]').length !== 1) {
        throw new Error('The public Canvas must return to its default Spinner recommendation after contract checks.');
      }
    });
  },
};

const situations = [
  ['첫 진입', '준비된 shell', 'Skeleton 또는 region Spinner', '콘텐츠 / blocking error'],
  ['page·route 전환', 'shell·navigation', '바뀌는 본문 범위의 신호', '새 제목·focus'],
  ['추가 데이터', '목록·scroll 위치', '목록 끝 작은 Spinner', '도착분 추가 / inline retry'],
  ['데이터 재요청', '마지막 정상 데이터', 'refreshing, 필요 시 region Dimmer', 'freshness / 보존 오류'],
  ['저장·제출', '입력값·focus', '실행 control의 loading', 'Toast / field 오류'],
  ['상태 전환', '안정적인 이전 상태', '바뀌는 subregion의 신호', '원자적 교체 / 이전 상태'],
];

function ScopeExample({ title, description, children }) {
  return (
    <article data-loading-scope style={{ ...surface, position: 'relative', display: 'grid', alignContent: 'start', gap: 'var(--space-4)', minHeight: 190 }}>
      <header style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)' }}>{title}</h3>
        <p style={copy}>{description}</p>
      </header>
      {children}
    </article>
  );
}

export const ScopeAndSituationUsage = {
  name: '사용법 · 범용 상황과 범위',
  parameters: storyDescription(
    '첫 진입·route 전환·추가 로드·재요청·저장·상태 전환을 제품 도메인보다 먼저 분류하고, control·region·기존 콘텐츠·장기 작업 범위에 맞는 실제 LDS 조합을 비교합니다.',
  ),
  render: () => (
    <PatternPage testId="scope-and-situation">
      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <SectionTitle description="각 열은 로딩 중에도 무엇을 보존하고, 완료·실패 시 무엇으로 넘길지를 함께 기록합니다.">
          여섯 가지 범용 상황
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 'var(--space-4)' }}>
          {situations.map(([title, preserve, signal, handoff]) => (
            <RuleCard key={title} title={title}>
              <dl style={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', gap: 'var(--space-2) var(--space-3)', margin: 0 }}>
                <dt>보존</dt><dd style={{ margin: 0 }}>{preserve}</dd>
                <dt>신호</dt><dd style={{ margin: 0 }}>{signal}</dd>
                <dt>전환</dt><dd style={{ margin: 0 }}>{handoff}</dd>
              </dl>
            </RuleCard>
          ))}
        </div>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <SectionTitle description="표시 위치와 차단 범위가 같아야 사용자가 계속할 수 있는 일을 과하게 막지 않습니다.">
          범위별 실제 조합
        </SectionTitle>
        <div data-testid="scope-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-4)' }}>
          <ScopeExample title="단일 control" description="저장 버튼 안에서 focus와 작업 맥락을 유지합니다.">
            <div data-loading-indicator>
              <Button loading loadingLabel="설정 저장 중">설정 저장</Button>
            </div>
          </ScopeExample>
          <ScopeExample title="첫 진입 region" description="빈 표면을 덮지 않고 도착할 구조를 예약합니다.">
            <div data-loading-indicator>
              <ResourceState state="loading" title="운영 현황을 불러오는 중" />
            </div>
          </ScopeExample>
          <ScopeExample title="기존 콘텐츠 region" description="정합성 때문에 편집을 막아야 하는 범위만 Dimmer가 덮습니다.">
            <div style={{ position: 'relative', minHeight: 92, display: 'grid', alignContent: 'center', gap: 'var(--space-2)' }}>
              <strong>운영 현황 18대</strong>
              <span style={copy}>마지막 업데이트 14:32</span>
              <Dimmer open blur>
                <div data-loading-indicator><Spinner color="var(--color-semantic-inverse-label)" label="동기화 중" /></div>
              </Dimmer>
            </div>
          </ScopeExample>
          <ScopeExample title="장기 작업" description="측정 가능한 진행과 취소 경로를 같은 작업 표면에 둡니다.">
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div data-loading-indicator><ProgressBar label="로그 내보내기" value={64} showValue /></div>
              <Button variant="secondary" size="sm">내보내기 취소</Button>
            </div>
          </ScopeExample>
        </div>
      </section>
    </PatternPage>
  ),
  play: async ({ canvasElement }) => {
    const page = canvasElement.querySelector('[data-testid="scope-and-situation"]');
    const scopes = [...canvasElement.querySelectorAll('[data-loading-scope]')];
    if (!page || page.scrollWidth > page.clientWidth + 1) {
      throw new Error('Loading situation guidance must fit its Storybook viewport.');
    }
    if (scopes.length !== 4) throw new Error('The pattern needs control, first-entry region, preserved region, and long-task scopes.');
    for (const scope of scopes) {
      if (scope.querySelectorAll('[data-loading-indicator]').length !== 1) {
        throw new Error('Every independent loading scope must have exactly one dominant indicator.');
      }
    }
    const dimmerScope = scopes[2];
    const blockedRegion = dimmerScope.querySelector('[aria-busy="true"]');
    if (!blockedRegion || !blockedRegion.querySelector('[inert]')) {
      throw new Error('A blocking region Dimmer must own both aria-busy and inert behavior.');
    }
  },
};

function LifecycleFixture() {
  const [step, setStep] = React.useState('start');
  const state = {
    start: ['시작', '작업 요청을 보냈습니다. 범위가 busy 상태입니다.'],
    progress: ['진행', '로그 내보내기 64% — 2단계 중 1단계'],
    complete: ['완료', '로그 파일을 준비했습니다.'],
    fail: ['실패', '로그 내보내기에 실패했습니다. 다시 시도할 수 있습니다.'],
  }[step];
  return (
    <section style={{ ...surface, display: 'grid', gap: 'var(--space-5)' }}>
      <div role="group" aria-label="로딩 단계 선택" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {[
          ['start', '시작'],
          ['progress', '진행'],
          ['complete', '완료'],
          ['fail', '실패'],
        ].map(([value, label]) => (
          <Button
            key={value}
            data-testid={`step-${value}`}
            size="sm"
            variant={step === value ? 'primary' : 'secondary'}
            aria-pressed={step === value}
            onClick={() => setStep(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div
        data-loading-scope="export"
        data-testid="lifecycle-scope"
        aria-busy={step === 'start' || step === 'progress' ? 'true' : undefined}
        style={{ display: 'grid', gap: 'var(--space-4)', minHeight: 150, alignContent: 'center', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-normal-alternative)' }}
      >
        <div role={step === 'fail' ? 'alert' : 'status'} aria-live={step === 'fail' ? 'assertive' : 'polite'} style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong data-testid="lifecycle-title">{state[0]}</strong>
          <span>{state[1]}</span>
        </div>
        {step === 'start' ? <div data-loading-indicator><Spinner label="로그 내보내기 시작 중" /></div> : null}
        {step === 'progress' ? <div data-loading-indicator><ProgressBar label="로그 내보내기" value={64} showValue /></div> : null}
        {step === 'complete' ? <Button size="sm" variant="secondary">파일 다운로드</Button> : null}
        {step === 'fail' ? <Button size="sm" variant="secondary" onClick={() => setStep('start')}>다시 시도</Button> : null}
      </div>
    </section>
  );
}

export const Lifecycle = {
  name: '상호작용 · 시작에서 실패까지',
  parameters: storyDescription(
    '같은 장기 작업이 시작→진행→완료 또는 실패로 전환될 때 aria-busy, 실제 진행률, 완료 action, assertive 오류와 재시도가 함께 바뀌는 상태 머신입니다.',
  ),
  render: () => (
    <PatternPage testId="loading-lifecycle" width={760}>
      <SectionTitle description="인디케이터는 완료와 실패 뒤에도 남는 장식이 아니라, 다음 행동에 자리를 넘기는 임시 상태입니다.">
        단계별 피드백
      </SectionTitle>
      <LifecycleFixture />
    </PatternPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scope = canvas.getByTestId('lifecycle-scope');
    const assertStep = (title, indicatorCount, busy) => {
      if (canvas.getByTestId('lifecycle-title').textContent !== title) throw new Error(`Expected lifecycle step ${title}.`);
      if (scope.querySelectorAll('[data-loading-indicator]').length !== indicatorCount) throw new Error(`${title} has the wrong dominant indicator count.`);
      if ((scope.getAttribute('aria-busy') === 'true') !== busy) throw new Error(`${title} has the wrong busy state.`);
    };
    assertStep('시작', 1, true);
    await userEvent.click(canvas.getByTestId('step-progress'));
    await waitFor(() => assertStep('진행', 1, true));
    await userEvent.click(canvas.getByTestId('step-complete'));
    await waitFor(() => assertStep('완료', 0, false));
    if (!canvas.getByRole('button', { name: '파일 다운로드' })) throw new Error('Completion must hand off to the result action.');
    await userEvent.click(canvas.getByTestId('step-fail'));
    await waitFor(() => assertStep('실패', 0, false));
    if (!canvas.getByRole('alert') || !canvas.getByRole('button', { name: '다시 시도' })) {
      throw new Error('Failure must explain the error assertively and offer recovery.');
    }
  },
};

export const NarrowDecision = {
  name: '반응형 · 320px 선택과 범위',
  parameters: storyDescription(
    'Narrow 320px 폭에서 선택 control, 설명, 인디케이터가 한 열로 재배치됩니다. 긴 한국어 안내가 잘리지 않고 loading scope가 가로 overflow를 만들지 않는지 확인하세요.',
  ),
  render: () => (
    <PatternPage testId="narrow-loading-pattern" width={320}>
      <DecisionLab narrow />
    </PatternPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = canvas.getByTestId('narrow-loading-pattern');
    const lab = canvas.getByTestId('narrow-decision-lab');
    if (page.scrollWidth > page.clientWidth + 1 || lab.scrollWidth > lab.clientWidth + 1) {
      throw new Error('The 320px loading decision layout must not create horizontal overflow.');
    }
    await userEvent.selectOptions(canvas.getByTestId('duration-select'), '90');
    await userEvent.click(canvas.getByLabelText('실제 진행률을 잴 수 있다'));
    await waitFor(() => {
      const scope = canvasElement.querySelector('[data-loading-scope]');
      if (!canvas.queryByTestId('long-task-guidance') || !canvas.queryByTestId('indicator-progress')) {
        throw new Error('A 90-second measurable task must show determinate progress and an escape path.');
      }
      if (scope?.querySelectorAll('[data-loading-indicator]').length !== 1) {
        throw new Error('The narrow scope must preserve the one-dominant-indicator rule.');
      }
      if (page.scrollWidth > page.clientWidth + 1) throw new Error('The selected long-task guidance must still fit 320px.');
    });
  },
};
