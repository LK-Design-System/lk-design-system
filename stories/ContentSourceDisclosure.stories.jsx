import { SourceDisclosure } from '../src/index.js';
import { userEvent } from 'storybook/test';

const meta = {
  title: 'LDS Product/Content/Source Disclosure',
  component: SourceDisclosure,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 800 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: '제품이 제공한 source provenance, availability, freshness와 원본으로 돌아가는 경로를 보여줍니다.',
      },
    },
  },
};

export default meta;

export const AvailabilityAndProvenance = {
  name: '출처 상태와 근거 정보',
  args: {
    description: '응답이나 문서 판단에 사용한 source의 현재 가용성을 확인합니다.',
    sources: [
      {
        id: 'ops-log',
        label: 'OPS / robot-07 inspection log',
        kind: 'log',
        location: 'Context Hub',
        availability: 'available',
        observedAt: '2026-07-10 09:14',
        excerpt: 'thermal sensor response timeout',
        metadata: [{ label: 'commit', value: '8f31b2a' }],
        href: 'https://example.com/logs/robot-07',
        defaultExpanded: true,
      },
      {
        id: 'credential-audit',
        label: 'Credential audit / upload-service',
        kind: 'audit',
        availability: 'stale',
        updatedAt: '2026-07-09 18:02',
        excerpt: 'token expired at 13:40',
      },
      {
        id: 'private-runbook',
        label: 'Production recovery runbook',
        kind: 'document',
        availability: 'restricted',
        description: '현재 사용자에게 source read 권한이 없습니다.',
      },
    ],
    onSourceActivate: () => {},
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const list = root?.querySelector(':scope > ul');
    const details = root?.querySelector('details');
    const summary = details?.querySelector('summary');
    if (!root || !list || !details || !summary) {
      throw new Error('SourceDisclosure must render a native disclosure list for provenance details.');
    }
    if (summary.querySelector('a, button')) {
      throw new Error('The native summary trigger must not contain nested interactive actions.');
    }
    summary.focus();
    if (canvasElement.ownerDocument.activeElement !== summary) {
      throw new Error('A native source summary must accept keyboard focus.');
    }
    await userEvent.click(summary);
    if (details.open) throw new Error('Activating the native summary must collapse an open source disclosure.');
    await userEvent.click(summary);
    if (!details.open) throw new Error('Activating the native summary must expand a collapsed source disclosure.');
    const sourceLink = details.querySelector('a[target="_blank"]');
    if (!sourceLink || sourceLink.getAttribute('rel') !== 'noopener noreferrer') {
      throw new Error('External source actions must use a safe new-tab link.');
    }
    summary.blur();
  },
};

export const MissingSource = {
  name: '출처 없음',
  args: {
    sources: [{ id: 'missing', label: 'Deleted build artifact', availability: 'missing' }],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    if (!root || root.querySelector('details, summary, a, button')) {
      throw new Error('A source without details or an action must remain a static list row.');
    }
  },
};

export const UnresolvedAvailability = {
  name: '확인 실패와 상태 불명',
  args: {
    description: '가용성을 확인하지 못한 source도 과장된 별도 화면 없이 같은 중립 목록 구조에서 구분합니다.',
    sources: [
      {
        id: 'availability-check-error',
        label: 'Runtime health evidence',
        kind: 'health snapshot',
        location: 'Operations evidence store',
        availability: 'error',
      },
      {
        id: 'availability-unknown',
        label: 'Imported vendor attachment',
        kind: 'attachment',
        location: 'Migration archive',
        availability: 'unknown',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const rows = root?.querySelectorAll('.lk-source-disclosure__static-row');
    const statuses = Array.from(root?.querySelectorAll('.lk-source-disclosure__status') ?? [])
      .map((status) => status.textContent?.trim());
    if (!root || rows?.length !== 2) {
      throw new Error('Error and unknown availability must remain static rows in the shared neutral source list.');
    }
    if (statuses.length !== 2 || statuses[0] !== '확인 실패' || statuses[1] !== '상태 불명') {
      throw new Error('SourceDisclosure must expose distinct labels for error and unknown availability.');
    }
    if (root.querySelector('details, summary, a, button')) {
      throw new Error('Availability alone must not invent disclosure or action affordances.');
    }
  },
};

export const DirectSourceLink = {
  name: '상세 정보 없는 출처 링크',
  args: {
    description: '추가 provenance가 없으면 불필요한 disclosure 없이 source 이름에서 바로 원본으로 이동합니다.',
    sources: [
      {
        id: 'release-note',
        label: 'Robot runtime 4.8 release note',
        kind: 'release note',
        location: 'Vendor documentation',
        availability: 'available',
        href: 'https://example.com/releases/runtime-4-8',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const link = root?.querySelector('a[href="https://example.com/releases/runtime-4-8"]');
    if (!root || root.querySelector('details, summary') || !link) {
      throw new Error('An action-only source must expose its label as a direct link without a disclosure step.');
    }
    if (!link.textContent?.includes('Robot runtime 4.8 release note')) {
      throw new Error('The direct source link must use the unique source label, not a generic action label.');
    }
  },
};

export const NarrowLongProvenance = {
  name: '좁은 폭 · 긴 출처 정보',
  args: {
    description: '긴 identity와 제한 상태가 좁은 폭에서도 겹치거나 잘리지 않아야 합니다.',
    sources: [
      {
        id: 'restricted-telemetry-archive',
        label: 'Autonomous warehouse robot telemetry archive / safety-validation-2026-Q3',
        kind: 'telemetry archive',
        location: 'Restricted Evidence Registry / APAC operations',
        availability: 'restricted',
        description: '현재 사용자에게 원본 archive를 읽을 권한이 없습니다. 접근 승인을 요청할 수 있습니다.',
        observedAt: '2026-07-10 09:14 KST',
        metadata: [
          { label: 'retention', value: '365 days' },
          { label: 'evidence hash', value: 'sha256:8f31b2a9d01c7c63' },
        ],
        defaultExpanded: true,
      },
    ],
    onSourceActivate: () => {},
  },
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <SourceDisclosure {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const summary = root?.querySelector('summary');
    const status = root?.querySelector('.lk-source-disclosure__status');
    if (!root || !summary || !status) throw new Error('The narrow provenance story is missing its disclosure anatomy.');
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error('SourceDisclosure must not create horizontal overflow at 320px.');
    }
    const summaryRect = summary.getBoundingClientRect();
    const statusRect = status.getBoundingClientRect();
    if (statusRect.right > summaryRect.right + 1) {
      throw new Error('The availability badge must remain inside the narrow summary row.');
    }
  },
};
