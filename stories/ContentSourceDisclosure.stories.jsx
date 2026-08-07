import { Card, SourceDisclosure } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Source Disclosure',
  tags: ['autodocs'],
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
    '답변 아래 근거를 귀속하는 기본 상황입니다. 닫힌 상태가 한 줄로 머무르고, 열면 패널이 떠서 주변을 밀지 않으며, 토글의 개수가 볼 수 있는 출처만 세는지 확인하세요. 권한이 없는 출처는 목록에 나타나지 않고 집계 한 줄로만 알립니다.',
  ),
  args: {
    sources: [
      {
        id: 'ops-log',
        label: 'OPS / robot-07 inspection log',
        excerpt: 'thermal sensor response timeout',
        href: 'https://example.com/logs/robot-07',
      },
      {
        id: 'credential-audit',
        label: 'Credential audit / upload-service',
        excerpt: 'token expired at 13:40',
        href: 'https://example.com/audits/upload-service',
      },
      {
        id: 'runtime-note',
        label: 'Robot runtime 4.8 release note',
        href: 'https://example.com/releases/runtime-4-8',
      },
      {
        id: 'private-runbook',
        label: 'Production recovery runbook',
        availability: 'restricted',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const toggle = canvasElement.querySelector('button.lk-source-disclosure__toggle');
    if (!toggle) throw new Error('The default variant must collapse behind a single source toggle.');
    if (canvasElement.querySelector('section.lk-source-disclosure') || canvasElement.querySelector('h2, h3, h4, h5, h6')) {
      throw new Error('A collapsed citation must not project a repeated landmark heading.');
    }
    if (!toggle.textContent?.includes('출처')) throw new Error('The toggle must show the 출처 label.');
    /* Three sources are visible and a fourth is withheld. A count that reported
       four would disclose the existence of the restricted source, which is the
       fact withholding the row exists to protect. */
    if (!toggle.textContent?.includes('3개') || toggle.textContent.includes('4개')) {
      throw new Error('The toggle count must report visible sources only, never withheld ones.');
    }
    if (canvasElement.textContent?.includes('Production recovery runbook')) {
      throw new Error('A restricted source must never render its label.');
    }
    if (toggle.getAttribute('aria-expanded') !== 'false' || doc.querySelector('[role="dialog"]')) {
      throw new Error('The default variant must start collapsed with no open panel.');
    }
    toggle.focus();
    if (doc.activeElement !== toggle) throw new Error('The toggle must accept keyboard focus.');
    await userEvent.click(toggle);
    const panelId = toggle.getAttribute('aria-controls');
    const panel = panelId ? doc.getElementById(panelId) : null;
    if (!panel || toggle.getAttribute('aria-expanded') !== 'true') {
      throw new Error('Activating the toggle must open the source popover.');
    }
    const rows = Array.from(panel.querySelectorAll('.lk-source-disclosure__row'));
    if (rows.length !== 3) throw new Error('The open popover must render one row per visible source.');
    if (rows.some((row) => row.tagName !== 'A' || row.getAttribute('target') !== '_blank')) {
      throw new Error('Citations with an href must open the original source in a new tab.');
    }
    if (!panel.querySelector('blockquote.lk-source-disclosure__row-excerpt')) {
      throw new Error('A source carrying an excerpt must show the quoted passage in the popover.');
    }
    if (!panel.textContent?.includes('권한이 없어')) {
      throw new Error('Withheld sources must be reported as an aggregate line.');
    }
    await userEvent.keyboard('{Escape}');
    if ((panelId && doc.getElementById(panelId)) || toggle.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Escape must close the source popover.');
    }
  },
};

export const ProvenanceList = {
  name: '변형·상태 · 출처 비교 목록',
  parameters: storyDescription(
    '여러 출처의 시점과 근거를 나란히 비교하는 상황입니다. 표면은 감싸는 카드가 소유하고 목록은 자기 테두리를 그리지 않으므로 둘레가 하나로 보이는지, 정상 출처는 배지 없이 조용히 서고 예외만 배지를 다는지, 펼침이 native details가 아니라 aria-expanded를 가진 버튼인지, 펼친 패널이 인용구로 시작하는지 확인하세요.',
  ),
  render: (args) => (
    <Card elevation="sm" padding="var(--space-5)" headingLevel={false}>
      <SourceDisclosure {...args} />
    </Card>
  ),
  args: {
    variant: 'list',
    description: '응답이나 문서 판단에 사용한 source의 근거와 시점을 확인합니다.',
    sources: [
      {
        id: 'ops-log',
        label: 'OPS / robot-07 inspection log',
        kind: 'log',
        location: 'Context Hub',
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
        id: 'runtime-note',
        label: 'Robot runtime 4.8 release note',
        kind: 'release note',
        location: 'Vendor documentation',
        href: 'https://example.com/releases/runtime-4-8',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const rows = root ? Array.from(root.querySelectorAll('.lk-source-disclosure__source-row')) : [];
    if (!root || rows.length !== 3) throw new Error('The list variant must render one row per source.');
    if (root.querySelector('details, summary')) {
      throw new Error('The disclosure must not rely on native details/summary, whose state announcement breaks once the marker is hidden.');
    }
    /* The embedding container owns the surface. A perimeter here would sit a
       few pixels inside the card's own, which is the double-border the surface
       audit classifies this component out of. */
    const listStyle = getComputedStyle(root.querySelector('ul'));
    if (listStyle.borderTopWidth !== '0px' || listStyle.borderTopLeftRadius !== '0px') {
      throw new Error('The source list must not draw its own perimeter — the container owns the surface.');
    }
    /* Rows share the heading's axis, so nothing is inset relative to the name
       of the group it belongs to. */
    if (Math.abs(rows[0].getBoundingClientRect().left - root.querySelector('h2').getBoundingClientRect().left) > 1) {
      throw new Error('Source rows must align on the same axis as the heading above them.');
    }
    /* A reachable source is silent. Badging the normal case is what stops the
       abnormal one from standing out. */
    const badges = Array.from(root.querySelectorAll('.lk-source-disclosure__status'));
    if (badges.length !== 1 || !badges[0].textContent?.includes('오래됨')) {
      throw new Error('Only exceptions carry an availability badge — available and omitted availability must stay silent.');
    }
    /* The third source has nothing to expand, so it must not invent a control. */
    const toggles = Array.from(root.querySelectorAll('button.lk-source-disclosure__disclosure'));
    if (toggles.length !== 2) throw new Error('Only sources with provenance to reveal may render a disclosure button.');
    for (const toggle of toggles) {
      if (!toggle.getAttribute('aria-controls') || toggle.getAttribute('aria-expanded') == null) {
        throw new Error('Each disclosure button must own aria-expanded and aria-controls.');
      }
      const { width, height } = toggle.getBoundingClientRect();
      if (width < 24 || height < 24) {
        throw new Error('The disclosure target must meet the 24x24 minimum of WCAG 2.2 SC 2.5.8.');
      }
    }
    const [first] = toggles;
    const panel = canvasElement.ownerDocument.getElementById(first.getAttribute('aria-controls'));
    if (!panel || first.getAttribute('aria-expanded') !== 'true') {
      throw new Error('A source marked defaultExpanded must start open.');
    }
    if (panel.firstElementChild?.tagName !== 'BLOCKQUOTE') {
      throw new Error('The quoted passage is why the row is worth opening — it must lead the panel.');
    }
    /* The label is the destination; navigation must not be buried in the panel. */
    const label = rows[0].querySelector('a[target="_blank"]');
    if (!label || label.getAttribute('rel') !== 'noopener noreferrer') {
      throw new Error('The source label itself must be the safe new-tab link.');
    }
    if (panel.querySelector('a, button')) {
      throw new Error('An expanded panel must not repeat the navigation the label already owns.');
    }
    first.focus();
    if (canvasElement.ownerDocument.activeElement !== first) {
      throw new Error('A disclosure button must accept keyboard focus.');
    }
    await userEvent.click(first);
    if (first.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Activating the disclosure must collapse an open source.');
    }
    first.blur();
  },
};

export const WithheldSources = {
  name: '변형·상태 · 권한 없는 출처',
  parameters: storyDescription(
    '근거 중 일부를 열람할 권한이 없는 상황입니다. 제목·종류·경로 어느 것도 드러나지 않고, 제품이 상류에서 이미 걸러 낸 건수까지 합쳐 한 줄로만 알리는지 확인하세요. 잠긴 자리 표시 행을 만들면 그 문서가 존재한다는 사실 자체가 공개됩니다.',
  ),
  args: {
    variant: 'list',
    description: '볼 수 있는 근거만 목록에 서고, 볼 수 없는 근거는 건수로만 알립니다.',
    hiddenCount: 1,
    hiddenMessage: '권한이 없어 출처 3개는 표시하지 않았습니다. 담당자에게 열람 권한을 요청하세요.',
    sources: [
      {
        id: 'ops-log',
        label: 'OPS / robot-07 inspection log',
        kind: 'log',
        observedAt: '2026-07-10 09:14',
        excerpt: 'thermal sensor response timeout',
        href: 'https://example.com/logs/robot-07',
      },
      { id: 'private-runbook', label: 'Production recovery runbook', kind: 'document', availability: 'restricted' },
      { id: 'payroll-export', label: 'Payroll export 2026-Q2', kind: 'spreadsheet', availability: 'restricted' },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const rows = root ? Array.from(root.querySelectorAll('.lk-source-disclosure__source-row')) : [];
    if (!root || rows.length !== 1) throw new Error('A restricted source must not become a row.');
    for (const leaked of ['Production recovery runbook', 'Payroll export', 'spreadsheet']) {
      if (root.textContent?.includes(leaked)) {
        throw new Error(`A withheld source must not disclose "${leaked}".`);
      }
    }
    const withheld = root.querySelector('.lk-source-disclosure__withheld');
    /* Two withheld here plus one the product filtered upstream. */
    if (!withheld?.textContent?.includes('3개')) {
      throw new Error('The aggregate must add hiddenCount to the sources withheld here.');
    }
    if (withheld.querySelector('a, button')) {
      throw new Error('The withheld line must not offer a path to content the user cannot open.');
    }
  },
};

export const MissingSource = {
  name: '변형·상태 · 출처 없음',
  parameters: storyDescription(
    '참조했던 원본이 삭제되어 세부 정보와 이동 액션을 제공할 수 없는 상황입니다. 존재하지 않는 disclosure나 링크를 만들지 않고 출처 없음 상태를 정적으로 알리는지 확인하세요.',
  ),
  args: {
    variant: 'list',
    sources: [{ id: 'missing', label: 'Deleted build artifact', availability: 'missing' }],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    if (!root || root.querySelector('details, summary, a, button')) {
      throw new Error('A source without details or an action must remain a static list row.');
    }
    if (!root.querySelector('.lk-source-disclosure__status')?.textContent?.includes('찾을 수 없음')) {
      throw new Error('A missing source must state that it can no longer be reached.');
    }
  },
};

export const UnresolvedAvailability = {
  name: '변형·상태 · 확인 실패와 상태 불명',
  parameters: storyDescription(
    '출처 자체는 알려져 있지만 현재 가용성을 확인하지 못한 상황입니다. 확인 실패와 상태 불명이 서로 다른 라벨로 전달되고 사용할 수 없는 액션을 암시하지 않는지 확인하세요.',
  ),
  args: {
    variant: 'list',
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
    const rows = root?.querySelectorAll('.lk-source-disclosure__source-row');
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

export const VerdictBadge = {
  name: '변형·상태 · 제품이 정한 판정 배지',
  parameters: storyDescription(
    '한 문장에 붙은 확인 기록처럼 제품이 스스로 정한 판정을 항상 보여 줘야 하는 상황입니다. 판정과 가용성이 서로 다른 축이라 한 출처가 확인됨이면서 동시에 오래됨일 수 있고, 두 배지가 각각 나가는지 확인하세요.',
  ),
  args: {
    variant: 'list',
    title: '확인 기록',
    sources: [
      {
        id: 'claim-verified',
        label: '2026년 2분기 검사 실패율은 직전 분기보다 낮았다',
        kind: '확인 기록 3건',
        badge: { label: '확인됨', tone: 'positive' },
        metadata: [{ label: '확인 기록', value: '3건' }],
      },
      {
        id: 'claim-stale',
        label: '업로드 서비스의 자격 증명은 자동으로 갱신된다',
        kind: '확인 기록 1건',
        badge: { label: '이견 있음', tone: 'negative' },
        availability: 'stale',
        updatedAt: '2026-07-09 18:02',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const groups = root ? Array.from(root.querySelectorAll('.lk-source-disclosure__status')) : [];
    if (!root || groups.length !== 2) throw new Error('Each source carrying a verdict must render its badge group.');
    if (groups[0].children.length !== 1 || !groups[0].textContent?.includes('확인됨')) {
      throw new Error('A product verdict must show even when availability is silent.');
    }
    /* Verdict and reachability are different axes, so they do not collapse
       into one slot when a source carries both. */
    if (groups[1].children.length !== 2) {
      throw new Error('A verdict and an availability exception must render as separate badges.');
    }
    if (!groups[1].textContent?.includes('이견 있음') || !groups[1].textContent?.includes('오래됨')) {
      throw new Error('Both the verdict and the availability exception must remain readable.');
    }
  },
};

export const DirectSourceLink = {
  name: '변형·상태 · 세부 정보 없는 출처 링크',
  parameters: storyDescription(
    '추가 provenance 없이 원본 문서로 바로 이동할 수 있는 상황입니다. 불필요한 disclosure 단계를 만들지 않고 고유한 출처 이름이 안전한 외부 링크가 되는지 확인하세요.',
  ),
  args: {
    variant: 'list',
    description: '추가 provenance가 없으면 불필요한 disclosure 없이 source 이름에서 바로 원본으로 이동합니다.',
    sources: [
      {
        id: 'release-note',
        label: 'Robot runtime 4.8 release note',
        kind: 'release note',
        location: 'Vendor documentation',
        href: 'https://example.com/releases/runtime-4-8',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const link = root?.querySelector('a[href="https://example.com/releases/runtime-4-8"]');
    if (!root || root.querySelector('details, summary, button') || !link) {
      throw new Error('An action-only source must expose its label as a direct link without a disclosure step.');
    }
    if (!link.textContent?.includes('Robot runtime 4.8 release note')) {
      throw new Error('The direct source link must use the unique source label, not a generic action label.');
    }
    if (root.querySelector('.lk-source-disclosure__status')) {
      throw new Error('A reachable source must not carry an availability badge.');
    }
  },
};

export const NarrowLongProvenance = {
  name: '반응형 · 좁은 폭과 긴 출처 정보',
  parameters: storyDescription(
    '320px 폭에서 긴 출처명·위치·메타데이터를 함께 보여 주는 상황입니다. 상태 배지와 identity가 영역 안에서 줄바꿈되고 가로 overflow 없이 읽히는지 확인하세요.',
  ),
  args: {
    variant: 'list',
    description: '긴 identity와 예외 상태가 좁은 폭에서도 겹치거나 잘리지 않아야 합니다.',
    sources: [
      {
        id: 'stale-telemetry-archive',
        label: 'Autonomous warehouse robot telemetry archive / safety-validation-2026-Q3',
        kind: 'telemetry archive',
        location: 'Evidence Registry / APAC operations',
        availability: 'stale',
        description: '원본 archive가 마지막 동기화 이후 갱신되지 않았습니다.',
        observedAt: '2026-07-10 09:14 KST',
        metadata: [
          { label: 'retention', value: '365 days' },
          { label: 'evidence hash', value: 'sha256:8f31b2a9d01c7c63' },
        ],
        defaultExpanded: true,
      },
    ],
  },
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <SourceDisclosure {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-source-disclosure');
    const row = root?.querySelector('.lk-source-disclosure__source-row');
    const status = root?.querySelector('.lk-source-disclosure__status');
    if (!root || !row || !status) throw new Error('The narrow provenance story is missing its disclosure anatomy.');
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error('SourceDisclosure must not create horizontal overflow at 320px.');
    }
    if (status.getBoundingClientRect().right > row.getBoundingClientRect().right + 1) {
      throw new Error('The availability badge must remain inside the narrow row.');
    }
  },
};

export const CompactCitationChips = {
  name: '반응형 · 컴팩트 인용 칩',
  parameters: storyDescription(
    '챗 답변 아래 citation처럼 모든 source가 열람 가능하다고 전제되는 맥락에서는 chips 변형으로 각 source를 attachment chip 무게의 한 줄 link chip으로 보여 줍니다. card·펼침·availability 배지 없이 활성화 시 원본을 열고, 320px에서 긴 라벨은 ellipsis로 잘립니다. 여기서는 시각적 heading을 숨겨(titleVisuallyHidden) chip만 남깁니다.',
  ),
  args: {
    title: '레퍼런스',
    headingLevel: 3,
    titleVisuallyHidden: true,
    variant: 'chips',
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
    if (!root || chips.length !== 2) throw new Error('The chips variant must render one link chip per source.');
    if (root.querySelector('.lk-source-disclosure__status') || root.querySelector('.lk-source-disclosure__disclosure')) {
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
