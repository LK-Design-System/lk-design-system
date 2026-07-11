import { SourceDisclosure } from '../src/index.js';

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
  name: 'Availability와 provenance',
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
};

export const MissingSource = {
  name: '출처 없음',
  args: {
    sources: [{ id: 'missing', label: 'Deleted build artifact', availability: 'missing' }],
  },
};
