import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Joystick, ManualControlSession } from '../src/index.js';

export default {
  title: 'LDS Robotics/Control/Manual Control Session',
  component: ManualControlSession,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Transport link, control authority, UI armed, dead-man, focus를 분리하고 safe-release 요청을 계약하는 session boundary입니다.',
      },
    },
  },
};

export const AuthorizedSession = {
  name: '권한과 UI 활성화 분리',
  render: function Example() {
    const [armed, setArmed] = React.useState(false);
    const [holding, setHolding] = React.useState(false);
    const [lastRelease, setLastRelease] = React.useState('없음');

    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', width: 620, maxWidth: 'calc(100vw - 48px)' }}>
        <ManualControlSession
          title="AMR 수동 주행"
          linkState="ready"
          authority="granted"
          armed={armed}
          deadmanActive={holding}
          controlMode="hybrid"
          focusRequired
          sessionMeta="최대 속도 0.4 m/s"
          onArmedChange={setArmed}
          onSafetyReleaseRequest={setLastRelease}
          onEmergencyStopRequest={() => setLastRelease('emergency-stop-requested')}
          deadmanControl={(
            <Button
              variant={holding ? 'dark' : 'outlined'}
              color="assistive"
              onPointerDown={() => setHolding(true)}
              onPointerUp={() => setHolding(false)}
              onPointerCancel={() => setHolding(false)}
              onPointerLeave={() => setHolding(false)}
            >
              {holding ? 'Dead-man 유지 중' : 'Dead-man 누르기'}
            </Button>
          )}
        >
          {({ interactionEnabled }) => <Joystick disabled={!interactionEnabled} label="이동" />}
        </ManualControlSession>
        <output style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>최근 release 요청: {lastRelease}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const session = canvasElement.querySelector('section[aria-label="AMR 수동 주행"]');
    if (!session) throw new Error('ManualControlSession root is missing.');

    const connection = session.querySelector('[role="img"][data-status="online"]');
    if (connection?.getAttribute('aria-label') !== '연결 준비됨') {
      throw new Error('ManualControlSession must expose the ready transport state.');
    }
    const authorityGranted = Array.from(session.querySelectorAll('span'))
      .some((element) => element.textContent?.trim() === '권한 부여됨');
    if (!authorityGranted) {
      throw new Error('ManualControlSession must expose the granted authority state.');
    }

    const armButton = session.querySelector('button[aria-pressed]');
    if (!armButton || armButton.getAttribute('aria-pressed') !== 'false' || armButton.disabled) {
      throw new Error('An authorized session must expose an enabled, unarmed UI-control action.');
    }
    const blockedControls = session.querySelector('[data-interaction-enabled="false"]');
    if (!blockedControls?.hasAttribute('inert') || blockedControls.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Unarmed manual controls must be inert and aria-disabled.');
    }
    const joystick = session.querySelector('[role="application"][aria-label="이동"]');
    if (joystick?.getAttribute('tabindex') !== '-1') {
      throw new Error('The blocked joystick must be removed from keyboard navigation.');
    }

    await userEvent.click(armButton);
    await waitFor(() => {
      const armedButton = session.querySelector('button[aria-pressed="true"]');
      if (!armedButton || armedButton.textContent?.trim() !== 'UI 제어 해제') {
        throw new Error('Arming must update the public pressed state and action label.');
      }
      const deadman = Array.from(session.querySelectorAll('button'))
        .find((button) => button.textContent?.trim() === 'Dead-man 누르기');
      if (!deadman) {
        throw new Error('An armed session that requires dead-man input must expose that control.');
      }
      const waitingControls = session.querySelector('[data-interaction-enabled="false"]');
      if (!waitingControls?.hasAttribute('inert')) {
        throw new Error('Controls must remain blocked until dead-man input becomes active.');
      }
      const status = session.querySelector('[role="status"]');
      if (!status?.textContent?.includes('Dead-man 입력 대기')) {
        throw new Error('The guard status must explain why armed controls remain blocked.');
      }
    });
    await userEvent.click(session.querySelector('button[aria-pressed="true"]'));
    await waitFor(() => {
      if (!session.querySelector('button[aria-pressed="false"]')) {
        throw new Error('The authorized baseline must return to the unarmed state after the interaction check.');
      }
    });
  },
};

export const AuthorityRevoked = {
  name: '권한 회수',
  args: {
    style: { width: 620, maxWidth: 'calc(100vw - 48px)' },
    title: 'AMR 수동 주행',
    linkState: 'ready',
    authority: 'revoked',
    armed: false,
    onArmedChange: () => {},
    onEmergencyStopRequest: () => {},
    children: <Joystick disabled label="이동" />,
  },
};

export const LinkLossRelease = {
  name: '연결 끊김 해제 요청과 재활성화',
  render: function Example() {
    const [linkState, setLinkState] = React.useState('ready');
    const [armed, setArmed] = React.useState(false);
    const [lastRelease, setLastRelease] = React.useState('없음');

    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', width: 620, maxWidth: 'calc(100vw - 48px)' }}>
        <Button variant="flat" disabled={linkState !== 'ready'} onClick={() => setLinkState('lost')}>연결 끊김 시뮬레이션</Button>
        <ManualControlSession
          title="AMR 수동 주행"
          linkState={linkState}
          authority="granted"
          armed={armed}
          deadmanRequired={false}
          onArmedChange={setArmed}
          onSafetyReleaseRequest={setLastRelease}
          onEmergencyStopRequest={() => {}}
        >
          {({ interactionEnabled }) => <Joystick disabled={!interactionEnabled} label="이동" />}
        </ManualControlSession>
        <output style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>armed: {String(armed)} · 최근 release 요청: {lastRelease}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const session = canvasElement.querySelector('section[aria-label="AMR 수동 주행"]');
    const linkLossButton = Array.from(canvasElement.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === '연결 끊김 시뮬레이션');
    const armButton = session?.querySelector('button[aria-pressed="false"]');
    if (!session || !linkLossButton || !armButton) {
      throw new Error('Link-loss fixture must expose its session and transition controls.');
    }

    await userEvent.click(armButton);
    await waitFor(() => {
      const activeControls = session.querySelector('[data-interaction-enabled="true"]');
      if (!activeControls || activeControls.hasAttribute('inert') || activeControls.getAttribute('aria-disabled') !== 'false') {
        throw new Error('Arming an authorized pointer session must enable its control region.');
      }
      const joystick = session.querySelector('[role="application"][aria-label="이동"]');
      if (joystick?.getAttribute('tabindex') !== '0') {
        throw new Error('An enabled joystick must return to keyboard navigation.');
      }
      if (!session.querySelector('button[aria-pressed="true"]')) {
        throw new Error('The armed state must be exposed through aria-pressed.');
      }
    });

    await userEvent.click(linkLossButton);
    await waitFor(() => {
      const output = canvasElement.querySelector('output');
      if (!output?.textContent?.includes('armed: false') || !output.textContent.includes('link-unavailable')) {
        throw new Error('Link loss must disarm the session and publish its safety-release reason.');
      }
      const disconnected = session.querySelector('[role="img"][data-status="offline"]');
      if (disconnected?.getAttribute('aria-label') !== '연결 끊김') {
        throw new Error('Link loss must update the public connection state.');
      }
      const blockedControls = session.querySelector('[data-interaction-enabled="false"]');
      if (!blockedControls?.hasAttribute('inert') || blockedControls.getAttribute('aria-disabled') !== 'true') {
        throw new Error('Link loss must immediately block the manual control region.');
      }
      const disarmedButton = session.querySelector('button[aria-pressed="false"]');
      if (!disarmedButton?.disabled) {
        throw new Error('UI control cannot be re-armed while the transport link is unavailable.');
      }
    });
  },
};

export const BlockedOrdinaryChildren = {
  name: '일반 자식 요소 키보드·포인터 차단',
  render: function Example() {
    const [activations, setActivations] = React.useState(0);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', width: 620, maxWidth: 'calc(100vw - 48px)' }}>
        <ManualControlSession
          title="Authority 없는 수동 주행"
          linkState="ready"
          authority="revoked"
          armed
          deadmanRequired={false}
          onArmedChange={() => {}}
          onEmergencyStopRequest={() => {}}
        >
          <Button onClick={() => setActivations((count) => count + 1)}>차단되어야 하는 일반 버튼</Button>
        </ManualControlSession>
        <output>activation count: {activations}</output>
      </div>
    );
  },
};

export const FocusAndUnmountRelease = {
  name: '포커스 상실·컴포넌트 제거 시 해제 요청',
  render: function Example() {
    const [mounted, setMounted] = React.useState(true);
    const [lastRelease, setLastRelease] = React.useState('없음');
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', width: 620, maxWidth: 'calc(100vw - 48px)' }}>
        <Button variant="flat" onClick={() => setMounted((value) => !value)}>{mounted ? '세션 제거' : '세션 다시 표시'}</Button>
        {mounted && (
          <ManualControlSession
            title="키보드 수동 제어"
            linkState="ready"
            authority="granted"
            armed
            deadmanRequired={false}
            controlMode="keyboard"
            focusRequired
            onArmedChange={() => {}}
            onSafetyReleaseRequest={setLastRelease}
            onEmergencyStopRequest={() => {}}
          >
            {({ interactionEnabled }) => <Button disabled={!interactionEnabled}>방향 입력</Button>}
          </ManualControlSession>
        )}
        <Button variant="outlined" color="assistive">세션 밖으로 focus 이동</Button>
        <output style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>최근 release 요청: {lastRelease}</output>
      </div>
    );
  },
};

export const NarrowCompoundStates = {
  name: '좁은 폭 · 점검과 제어 가능 상태',
  render: () => (
    <main data-testid="narrow-manual-control-states" style={{ display: 'grid', gap: 'var(--space-5)', width: 320, maxWidth: '100%' }}>
      <ManualControlSession
        data-testid="cautionary-session"
        title="점검 대기 중인 AMR 수동 주행"
        linkState="stale"
        authority="checking"
        armed={false}
        deadmanRequired
        deadmanActive={false}
        controlMode="pointer"
        sessionMeta="마지막 연결 확인 18초 전 · 명령 전송 일시 중지"
        onArmedChange={() => {}}
        onEmergencyStopRequest={() => {}}
      >
        {({ interactionEnabled }) => <Joystick size={112} disabled={!interactionEnabled} label="점검 중 이동" />}
      </ManualControlSession>

      <ManualControlSession
        data-testid="enabled-session"
        title="피킹 구역 AMR 수동 주행"
        linkState="ready"
        authority="granted"
        armed
        deadmanRequired
        deadmanActive
        controlMode="pointer"
        sessionMeta="최대 속도 0.25 m/s · 근거리 점검 모드"
        onArmedChange={() => {}}
        onEmergencyStopRequest={() => {}}
        deadmanControl={<Button variant="dark" color="assistive">Dead-man 유지 중</Button>}
      >
        {({ interactionEnabled }) => <Joystick size={112} disabled={!interactionEnabled} label="활성 이동" />}
      </ManualControlSession>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="narrow-manual-control-states"]');
    const cautionary = canvasElement.querySelector('[data-testid="cautionary-session"]');
    const enabled = canvasElement.querySelector('[data-testid="enabled-session"]');
    if (!fixture || !cautionary || !enabled || Math.round(fixture.getBoundingClientRect().width) !== 320) {
      throw new Error('The compound manual-control fixture must preserve both states at the 320px target width.');
    }

    const stale = cautionary.querySelector('[role="img"][data-status="stale"]');
    const checking = Array.from(cautionary.querySelectorAll('span'))
      .find((element) => element.textContent?.trim() === '권한 확인 중');
    const cautionIndicatorStyle = checking?.firstElementChild?.getAttribute('style') ?? '';
    if (stale?.getAttribute('aria-label') !== '연결 정보 오래됨' || !checking || !cautionIndicatorStyle.includes('--component-status-badge-cautionary-indicator')) {
      throw new Error('The cautionary fixture must expose stale link and checking-authority states with the cautionary treatment.');
    }
    const cautionaryControls = cautionary.querySelector('[data-interaction-enabled="false"]');
    const cautionaryArm = cautionary.querySelector('button[aria-pressed="false"]');
    if (!cautionaryControls?.hasAttribute('inert') || cautionaryControls.getAttribute('aria-disabled') !== 'true' || !cautionaryArm?.disabled) {
      throw new Error('Stale/checking state must keep the control region inert and prevent UI activation.');
    }

    const enabledControls = enabled.querySelector('[data-interaction-enabled="true"]');
    const enabledJoystick = enabled.querySelector('[role="application"][aria-label="활성 이동"]');
    const enabledStatus = enabled.querySelector('[role="status"]');
    const activeArm = enabled.querySelector('button[aria-pressed="true"]');
    const deadman = Array.from(enabled.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'Dead-man 유지 중');
    if (!enabledControls || enabledControls.hasAttribute('inert') || enabledControls.getAttribute('aria-disabled') !== 'false') {
      throw new Error('Ready, granted, armed, and active dead-man state must enable the control region.');
    }
    if (enabledJoystick?.getAttribute('tabindex') !== '0' || !enabledStatus?.textContent?.includes('제어 입력 가능') || !activeArm || !deadman) {
      throw new Error('The enabled fixture must expose its active joystick, guard status, arm state, and held dead-man action.');
    }

    const surfaces = [fixture, cautionary, enabled, ...fixture.querySelectorAll('header, footer')];
    if (surfaces.some((surface) => surface.scrollWidth > surface.clientWidth + 1)) {
      throw new Error('ManualControlSession must not introduce horizontal overflow at 320px.');
    }
  },
};
