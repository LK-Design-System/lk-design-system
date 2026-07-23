import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  Dimmer,
  Spinner,
} from '../src/index.js';
import { DimmerCard as DimmerCardStory } from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Dimmer',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-dimmer--dimmer-overlay',
      eyebrow: 'Core / Overlay',
      title: 'Dimmer는 처리 중인 특정 영역을 잠시 가리고 상호작용을 멈춥니다',
      description:
        '패널이나 카드 단위의 비동기 작업이 끝날 때까지 해당 영역만 사용할 수 없음을 보여줄 때 적합합니다. 페이지 전체를 막지 않아도 되는 작업에 사용하고, 진행 정도를 알려야 하면 Progress를 함께 제공하며 단순 장식용 어두운 배경에는 사용하지 마세요.',
    },
    docs: {
      description: {
        component: '특정 영역을 일시적으로 차단하고 처리 중 상태를 표시하는 Dimmer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DimmerOverlay = {
  name: '개요',
  parameters: storyDescription(
    '데이터 동기화 중인 영역 위에 blur Dimmer와 Spinner를 배치한 예시입니다. 차단 범위가 컨테이너 안에 머무르고 배경 콘텐츠와 처리 중 레이블이 구분되며 로딩 상태가 명확한지 확인하세요.',
  ),
  render: () => (
    <main style={{ position: 'relative', minHeight: 180, width: 320, display: 'grid', placeItems: 'center', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
      <span style={{ color: 'var(--color-semantic-label-neutral)' }}>데이터를 동기화 중입니다.</span>
      <Dimmer open blur>
        <Spinner color="var(--color-semantic-inverse-label)" label="처리 중" />
      </Dimmer>
    </main>
  ),
};

function DimmerBlockingFixture() {
  const [busy, setBusy] = React.useState(true);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start', maxWidth: 640 }}>
      <Button data-testid="dimmer-outside" variant="outlined" color="assistive" onClick={() => setBusy((value) => !value)}>
        {busy ? '동기화 중단' : '동기화 시작'}
      </Button>
      <section
        data-testid="dimmer-region"
        style={{ position: 'relative', width: 320, minHeight: 180, display: 'grid', alignContent: 'center', justifyItems: 'start', gap: 'var(--space-3)', padding: 'var(--space-5)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}
      >
        <span style={{ color: 'var(--color-semantic-label-neutral)' }}>데이터를 동기화 중입니다.</span>
        <input
          data-testid="covered-input"
          defaultValue="현장 점검 보고"
          aria-label="보고서 이름"
          style={{ height: 40, padding: '0 12px', boxSizing: 'border-box', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', font: 'inherit' }}
        />
        <Button data-testid="covered-button" size="sm">보고서 편집</Button>
        <Dimmer open={busy} blur>
          <Spinner color="var(--color-semantic-inverse-label)" label="처리 중" />
        </Dimmer>
      </section>
    </main>
  );
}

export const DimmerBlocksInteraction = {
  name: '상호작용 · 차단 범위와 키보드',
  parameters: storyDescription(
    'Dimmer가 덮은 영역의 버튼과 입력이 시각적으로만 가려지는 것이 아니라 Tab 순서와 접근성 트리에서도 빠지는지 확인하는 계약입니다. 스크림이 열려 있는 동안 가려진 컨트롤에 초점이 가지 않고, 닫히면 다시 도달할 수 있어야 합니다.',
  ),
  render: () => <DimmerBlockingFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const region = canvasElement.querySelector('[data-testid="dimmer-region"]');
    const outside = canvasElement.querySelector('[data-testid="dimmer-outside"]');
    const coveredInput = canvasElement.querySelector('[data-testid="covered-input"]');
    const coveredButton = canvasElement.querySelector('[data-testid="covered-button"]');
    if (!region || !outside || !coveredInput || !coveredButton) {
      throw new Error('The Dimmer blocking fixture requires an outside control and covered controls.');
    }

    await waitFor(() => {
      if (region.getAttribute('aria-busy') !== 'true') {
        throw new Error('An open Dimmer must mark its region aria-busy.');
      }
    });

    // Covered content must be inert: not tabbable, not focusable, not exposed.
    if (!coveredInput.closest('[inert]') || !coveredButton.closest('[inert]')) {
      throw new Error('An open Dimmer must make the content behind the scrim inert.');
    }
    coveredButton.focus();
    if (ownerDocument.activeElement === coveredButton) {
      throw new Error('Content behind the scrim must not be able to take focus.');
    }
    outside.focus();
    await userEvent.tab();
    if (region.contains(ownerDocument.activeElement)) {
      throw new Error('Tab must skip every control covered by an open Dimmer.');
    }

    // Closing the Dimmer must hand the region back.
    await userEvent.click(outside);
    await waitFor(() => {
      if (canvasElement.querySelector('[data-dimmer-content]')) throw new Error('The Dimmer must close.');
      if (region.hasAttribute('aria-busy')) throw new Error('A closed Dimmer must clear aria-busy.');
      if (coveredInput.closest('[inert]')) throw new Error('A closed Dimmer must release the inert content.');
    });
    coveredButton.focus();
    if (ownerDocument.activeElement !== coveredButton) {
      throw new Error('Controls must be focusable again once the Dimmer closes.');
    }

    // Restore the blocked state so the story reads as the documented example.
    await userEvent.click(outside);
    await waitFor(() => {
      if (!canvasElement.querySelector('[data-dimmer-content]')) throw new Error('The Dimmer must reopen for visual review.');
    });
  },
};

export const DimmerCard = { ...DimmerCardStory, name: 'Dimmer card parity', tags: ['!dev', 'visual-parity'] };
