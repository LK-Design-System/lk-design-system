import React from 'react';
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
  name: 'Authority와 UI arm 분리',
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
};

export const AuthorityRevoked = {
  name: 'Authority 회수',
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
  name: 'Link loss release와 re-arm',
  render: function Example() {
    const [linkState, setLinkState] = React.useState('ready');
    const [armed, setArmed] = React.useState(false);
    const [lastRelease, setLastRelease] = React.useState('없음');

    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', width: 620, maxWidth: 'calc(100vw - 48px)' }}>
        <Button variant="flat" disabled={linkState !== 'ready'} onClick={() => setLinkState('lost')}>Link loss 시뮬레이션</Button>
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
};

export const BlockedOrdinaryChildren = {
  name: '일반 children 키보드·포인터 차단',
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
  name: 'Focus 상실·unmount release',
  render: function Example() {
    const [mounted, setMounted] = React.useState(true);
    const [lastRelease, setLastRelease] = React.useState('없음');
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', width: 620, maxWidth: 'calc(100vw - 48px)' }}>
        <Button variant="flat" onClick={() => setMounted((value) => !value)}>{mounted ? '세션 unmount' : '세션 mount'}</Button>
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
