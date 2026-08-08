import React from 'react';
import { Avatar, Button, ConnectionRow, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Use when a product repeats account/resource identity, status, detail, and actions.
// Avoid when the surface is a generic selectable list row or owns the connection workflow.

const meta = {
  title: 'LDS Product/Content/Connection Row',
  component: ConnectionRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-content-connection-row--connected',
      eyebrow: 'Product / Content / Connection Row',
      title: '연결된 계정과 자원의 정체성, 상태, 보조 정보와 액션을 한 행에 정렬합니다',
      description:
        '계정·서비스·저장소 연결이 반복되는 설정 화면에서 사용합니다. LDS는 visual부터 action까지의 읽기 순서와 상태 표현, 좁은 폭 재배치만 소유하고 연결 실행·권한·확인은 제품에 남깁니다.',
    },
    docs: {
      description: {
        component: '계정 또는 자원 연결의 visual, 이름, visible 상태, 상세 정보와 제품 액션을 안정된 순서로 묶는 Product Extension입니다.',
      },
    },
  },
};

export default meta;

function ServiceVisual({ name, icon = 'component-fill' }) {
  return (
    <span
      aria-label={`${name} 로고`}
      role="img"
      style={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-10)',
        background: 'var(--color-semantic-primary-surface-normal)',
        color: 'var(--color-semantic-primary-normal)',
      }}
    >
      <Icon name={icon} size={22} aria-hidden="true" />
    </span>
  );
}

function assertAnatomy(root, expectedState) {
  const parts = ['visual', 'name', 'status', 'detail', 'actions']
    .map((part) => root?.querySelector(`:scope > [data-slot="${part}"]`));
  if (!root || parts.some((part) => !part)) throw new Error('ConnectionRow must expose every required anatomy part.');
  if (root.dataset.state !== expectedState) throw new Error(`ConnectionRow must expose the ${expectedState} state.`);
  for (let index = 0; index < parts.length - 1; index += 1) {
    if (!(parts[index].compareDocumentPosition(parts[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('ConnectionRow DOM order must remain visual, name, status, detail, actions.');
    }
  }
  if (!parts[2].textContent.trim()) throw new Error('Connection state needs a visible text label.');
  const action = parts[4].querySelector('button, a, [role="button"]');
  const rect = action?.getBoundingClientRect();
  if (!rect || rect.width < 24 || rect.height < 24) throw new Error('Connection actions need at least a 24 by 24 CSS pixel target.');
}

export const Connected = {
  name: '개요',
  parameters: storyDescription('연결된 서비스는 visible 상태와 최근 확인 정보를 유지하고, 연결 해제는 보조 액션 문법으로 낮춥니다.'),
  render: () => (
    <ConnectionRow
      aria-label="Synology Chat 연결"
      style={{ maxWidth: 760 }}
      visual={<ServiceVisual name="Synology Chat" icon="message" />}
      name="Synology Chat"
      state="connected"
      status="연결됨"
      detail="workspace@lkrobotics.co.kr · 5분 전 확인"
      actions={<Button size="sm" variant="outlined" color="assistive">연결 해제</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-connection-row]');
    assertAnatomy(root, 'connected');
    const button = root.querySelector('[data-slot="actions"] button');
    if (button?.dataset.variant !== 'outlined-assistive') {
      throw new Error('A disconnect action must use the outlined assistive row grammar.');
    }
  },
};

export const Pending = {
  name: '변형·상태 · 연결 중',
  parameters: storyDescription('연결 요청이 진행 중일 때 상태 문구와 reduced-motion-safe pulse를 함께 보여 주고 중복 연결 대신 취소만 제공합니다.'),
  render: () => (
    <ConnectionRow
      aria-label="Confluence 연결"
      style={{ maxWidth: 760 }}
      visual={<ServiceVisual name="Confluence" icon="document" />}
      name="Confluence Cloud"
      state="pending"
      status="연결 중"
      detail="lkrobotics.atlassian.net · 관리자 승인 대기"
      actions={<Button size="sm" variant="outlined" color="assistive">요청 취소</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-connection-row]');
    assertAnatomy(root, 'pending');
    if (!root.querySelector('[data-lds-status-indicator-pulse]')) throw new Error('Pending state must expose the shared in-progress status pulse.');
    if (root.querySelectorAll('[data-slot="actions"] button').length !== 1) throw new Error('Pending state must not expose duplicate connect actions.');
  },
};

export const Disconnected = {
  name: '변형·상태 · 연결 안 됨',
  parameters: storyDescription('연결되지 않은 자원은 상태를 명시하고 하나의 연결 시작 액션만 제공합니다.'),
  render: () => (
    <ConnectionRow
      aria-label="GitHub 저장소 연결"
      style={{ maxWidth: 760 }}
      visual={<ServiceVisual name="GitHub" icon="folder" />}
      name="GitHub Repository"
      state="disconnected"
      status="연결 안 됨"
      detail="저장소 접근 범위를 검토한 뒤 연결하세요."
      actions={<Button size="sm" variant="solid" color="primary">연결</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-connection-row]');
    assertAnatomy(root, 'disconnected');
    if (root.querySelectorAll('[data-slot="actions"] button').length !== 1) throw new Error('Disconnected state must expose one clear connect action.');
  },
};

export const NarrowReflow = {
  name: '반응형 · 320px 액션 재배치',
  parameters: storyDescription('320px에서 긴 자원 이름과 상세 정보가 감기고 액션이 다음 grid line으로 내려가며 가로 스크롤이 생기지 않습니다.'),
  render: () => (
    <div data-connection-row-narrow style={{ width: 320, maxWidth: '100%', minWidth: 0 }}>
      <ConnectionRow
        visual={<Avatar name="Repository" variant="company" size="medium" aria-label="저장소 로고" />}
        name="LK-ROBOTICS-AUTONOMOUS-FLEET-OPERATIONS"
        state="connected"
        status="연결됨"
        detail="LK-Design-System/lk-design-system · contents:read, metadata:read"
        actions={(
          <>
            <Button size="sm" variant="outlined" color="assistive">권한 검토</Button>
            <Button size="sm" variant="outlined" color="assistive">연결 해제</Button>
          </>
        )}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-connection-row-narrow]');
    const root = fixture?.querySelector('[data-lds-connection-row]');
    const detail = root?.querySelector(':scope > [data-slot="detail"]');
    const actions = root?.querySelector(':scope > [data-slot="actions"]');
    if (!fixture || !root || !detail || !actions) throw new Error('Narrow ConnectionRow fixture must be complete.');
    if (fixture.scrollWidth > fixture.clientWidth + 1 || root.scrollWidth > root.clientWidth + 1) {
      throw new Error('ConnectionRow must not create horizontal scrolling at 320 CSS pixels.');
    }
    if (actions.getBoundingClientRect().top < detail.getBoundingClientRect().bottom - 1) {
      throw new Error('Connection actions must move below the detail line in the narrow layout.');
    }
  },
};

export const DecorativeVisualContract = {
  name: 'Decorative visual contract',
  tags: ['!dev'],
  render: () => (
    <ConnectionRow
      visual={<Avatar name="Service account" aria-label="중복되면 안 되는 서비스 계정 이미지" />}
      name="Service account"
      state="connected"
      status="연결됨"
      detail="service@lkrobotics.co.kr"
      actions={<Button size="sm" variant="outlined" color="assistive">관리</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-connection-row]');
    const visual = root?.querySelector(':scope > [data-slot="visual"]');
    const avatar = visual?.querySelector('[role="img"]');
    if (!visual || visual.getAttribute('aria-hidden') !== 'true' || !avatar) {
      throw new Error('The identity visual must remain inside an aria-hidden named part even when the supplied visual names itself.');
    }
    if (!root.querySelector(':scope > [data-slot="name"]')?.textContent.includes('Service account')) {
      throw new Error('The adjacent visible name must carry identity after the visual leaves the accessibility tree.');
    }
  },
};

export const ConnectionRowVisualParity = {
  name: 'ConnectionRow visual parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ width: 760, display: 'grid', gap: 'var(--space-3)' }}>
      <Connected.render />
      <Pending.render />
      <Disconnected.render />
    </div>
  ),
};
