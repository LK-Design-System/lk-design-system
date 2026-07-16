import { SourceDisclosure } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Source Disclosure',
  component: SourceDisclosure,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 800 }}><Story /></div>],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-source-disclosure--availability-and-provenance',
      eyebrow: 'Product / Source Disclosure',
      title: '사용자가 판단의 근거와 원본 접근 가능 여부를 직접 확인합니다',
      description:
        '응답이나 문서의 근거가 된 출처·시점·가용성·원본 경로를 투명하게 제시할 때 적합합니다. 단순 관련 링크나 일반 속성 목록에는 SourceDisclosure 대신 Link 또는 Description List를 사용하세요.',
    },
    docs: {
      description: {
        component: '제품이 제공한 source provenance, availability, freshness와 원본으로 돌아가는 경로를 보여줍니다.',
      },
    },
  },
};

export default meta;

export const AvailabilityAndProvenance = {
  name: '개요',
  parameters: storyDescription(
    '가용·오래됨·접근 제한 출처를 한 근거 목록에서 비교하는 상황입니다. 각 상태와 관측 시점, 세부 근거, 원본 이동 경로가 과장 없이 구분되는지 확인하세요.',
  ),
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
  name: '변형·상태 · 출처 없음',
  parameters: storyDescription(
    '참조했던 원본이 삭제되어 세부 정보와 이동 액션을 제공할 수 없는 상황입니다. 존재하지 않는 disclosure나 링크를 만들지 않고 출처 없음 상태를 정적으로 알리는지 확인하세요.',
  ),
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
  name: '변형·상태 · 확인 실패와 상태 불명',
  parameters: storyDescription(
    '출처 자체는 알려져 있지만 현재 가용성을 확인하지 못한 상황입니다. 확인 실패와 상태 불명이 서로 다른 라벨로 전달되고 사용할 수 없는 액션을 암시하지 않는지 확인하세요.',
  ),
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
  name: '변형·상태 · 세부 정보 없는 출처 링크',
  parameters: storyDescription(
    '추가 provenance 없이 원본 문서로 바로 이동할 수 있는 상황입니다. 불필요한 disclosure 단계를 만들지 않고 고유한 출처 이름이 안전한 외부 링크가 되는지 확인하세요.',
  ),
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
  name: '반응형 · 좁은 폭과 긴 출처 정보',
  parameters: storyDescription(
    '320px 폭에서 긴 출처명·위치·제한 사유·메타데이터를 함께 보여 주는 상황입니다. 상태 배지와 summary가 영역 안에서 줄바꿈되고 가로 overflow 없이 읽히는지 확인하세요.',
  ),
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

export const CompactCitationChips = {
  name: '반응형 · 컴팩트 인용 칩',
  parameters: storyDescription(
    '챗 답변 아래 citation처럼 모든 source가 열람 가능하다고 전제되는 맥락에서는 compact 모드로 각 source를 attachment chip 무게의 한 줄 link chip으로 보여 줍니다. card·펼침·availability 배지 없이 활성화 시 원본을 열고, 320px에서 긴 라벨은 ellipsis로 잘립니다. 여기서는 시각적 heading을 숨겨(titleVisuallyHidden) chip만 남깁니다.',
  ),
  args: {
    title: '레퍼런스',
    headingLevel: 3,
    titleVisuallyHidden: true,
    compact: true,
    sources: [
      { id: 'meeting-notes', label: '업로드된 주간 회의록 · 2026-07-12', href: 'https://example.com/meeting-notes' },
      { id: 'planning', label: 'Quarterly-product-planning-notes-with-a-very-long-file-name-and-revision-history.pdf', href: 'https://example.com/files/quarterly-planning' },
    ],
  },
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <SourceDisclosure {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const chips = root ? Array.from(root.querySelectorAll('.lk-source-disclosure__chip')) : [];
    if (!root || chips.length !== 2) throw new Error('Compact mode must render one link chip per source.');
    if (root.querySelector('.lk-source-disclosure__status') || root.querySelector('details')) {
      throw new Error('Compact citations must not render an availability badge or a disclosure panel.');
    }
    if (chips.some((chip) => chip.tagName !== 'A' || chip.getAttribute('target') !== '_blank')) {
      throw new Error('Compact citations with an href must open the original source in a new tab.');
    }
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error('Compact citations must not create horizontal overflow at 320px.');
    }
  },
};

export const CollapsibleCitation = {
  name: '변형·상태 · 접히는 출처 토글',
  parameters: storyDescription(
    '챗 답변 footer처럼 출처를 항상 노출할 필요가 없을 때 collapsible로 compact chip 목록을 "출처" 토글 하나 뒤로 접습니다. 닫힘 상태는 한 줄이고, 누르면 앵커드 Popover(드롭다운)로 목록이 떠서 열려 레이아웃을 밀지 않으며 바깥 클릭·Esc로 닫힙니다. 토글 텍스트가 disclosure의 접근 가능한 이름이라 반복되는 landmark heading을 만들지 않습니다.',
  ),
  args: {
    title: '출처',
    collapsible: true,
    sources: [
      { id: 'catalog', label: 'KT 제품 카탈로그 · 2026', href: 'https://example.com/kt-catalog' },
      { id: 'spec', label: '에어컨 설치 사양서', href: 'https://example.com/install-spec' },
      { id: 'as', label: 'A/S 안내 · 대덕 지사', href: 'https://example.com/as-guide' },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure--collapsible');
    if (!root) throw new Error('A collapsible citation must render the Popover disclosure.');
    const toggle = root.querySelector('button.lk-source-disclosure__toggle');
    if (!toggle) throw new Error('A collapsible citation must render a "출처" toggle.');
    if (toggle.querySelector('a, button')) {
      throw new Error('The toggle must not contain nested interactive actions.');
    }
    if (toggle.getAttribute('aria-haspopup') !== 'dialog') {
      throw new Error('The toggle must advertise a dialog popup.');
    }
    if (!toggle.textContent?.includes('출처')) {
      throw new Error('The collapsed toggle must show the 출처 label.');
    }
    if (toggle.getAttribute('aria-expanded') !== 'false' || root.querySelector('[role="dialog"]')) {
      throw new Error('A collapsible citation must start collapsed with no open panel.');
    }
    if (canvasElement.querySelector('section.lk-source-disclosure') || root.querySelector('h2, h3, h4, h5, h6')) {
      throw new Error('A collapsed citation must not project a repeated landmark heading.');
    }
    toggle.focus();
    if (canvasElement.ownerDocument.activeElement !== toggle) {
      throw new Error('The toggle must accept keyboard focus.');
    }
    await userEvent.click(toggle);
    const panel = root.querySelector('[role="dialog"]');
    if (!panel || toggle.getAttribute('aria-expanded') !== 'true') {
      throw new Error('Activating the toggle must open the source popover.');
    }
    const rows = Array.from(panel.querySelectorAll('.lk-source-disclosure__row'));
    if (rows.length !== 3) throw new Error('The open popover must render one row per source.');
    if (rows.some((row) => row.tagName !== 'A' || row.getAttribute('target') !== '_blank')) {
      throw new Error('Citations with an href must open the original source in a new tab.');
    }
    await userEvent.keyboard('{Escape}');
    if (root.querySelector('[role="dialog"]') || toggle.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Escape must close the source popover.');
    }
  },
};
