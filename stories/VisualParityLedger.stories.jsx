import React from 'react';

const meta = {
  title: '문서/보정표',
  parameters: {
    docs: {
      description: {
        component:
          '기존 정적 디자인 시스템 카드와 현재 React/Storybook 구현의 일치 여부를 추적하는 보정표입니다.',
      },
    },
  },
};

export default meta;

const coverageRows = [
  ['Foundation guidelines', '20', 'Storybook 원본 미리보기 노출'],
  ['Component cards', '83', '원본 카드와 React export 매핑 완료'],
  ['Template cards', '4', '원본 카드와 starter 폴더 매핑 완료'],
  ['Runtime export gaps', '0', '카드에서 필요한 public export 누락 없음'],
  ['React exports', '145', '패키지 엔트리에서 배포 대상 생성'],
];

const fixedRows = [
  ['P0', 'Button', 'CTA 화살표 제거, 호버 상승 제거, 호버 색상 변화 폭 축소'],
  ['P0', 'Button family', 'ButtonGroup, CopyButton, Link, SocialButton, SplitButton, TextButton 자간 0 정규화'],
  ['P0', 'TopBar', '기존 디자인 시스템 상단바 구조 기준으로 라이트/다크 대비 보정'],
  ['P0', 'RobotStatusCard', '다크 배경 카드, 배지, 상태 수치 대비 보정 및 접근성 점검'],
  ['P0', 'Footer', 'BackToTop 호버 상승 제거, Footer 링크/헤딩 자간 0 정규화'],
  ['P1', 'Non-button typography', 'React 컴포넌트에 남아 있던 음수 자간을 0으로 정규화'],
  ['P1', 'Card motion', '원본 미리보기 번들(_ds_bundle.js) 기준으로 Card/NewsCard/ProductCard hover motion 유지 여부 검증'],
  ['P1', 'Coverage guard', '원본 guideline/component/template 카드가 Audit와 Legacy Preview에 모두 잡히는지 자동 검증'],
  ['P1', 'Component map guard', '원본 component card 83개가 Audit 매핑, React export, dist type, legacy bundle, React Storybook에 연결되는지 검증'],
  ['P1', 'Visual smoke', 'Playwright로 대표 원본 preview와 React Storybook 화면 9개를 실제 브라우저 PNG로 캡처'],
  ['P1', 'Legacy render sweep', 'Playwright로 전체 원본 preview 107개(20/83/4)가 빈 화면 없이 렌더되는지 전수 검증'],
  ['P1', 'Visual inventory', 'Playwright PNG inventory plus card-to-story traceability for all 83 original component cards, all 83 same-viewport primary React captures, and every React implementation story'],
  ['P1', 'Visual review report', 'Local HTML report comparing each original card with its same-viewport primary React capture and paired React story screenshots'],
  ['P1', 'Visual pixel diff', 'Local pixel-diff manifest, diff PNGs, and HTML report for all 83 original-to-primary visual pairs'],
  ['P1', 'Targeted parity stories', 'Dedicated Storybook parity stories added for high-mismatch form/status/overlay cards so primary matching no longer falls back to broad inventory stories'],
  ['P0', 'Original previews', '원본 guideline/component/template HTML을 Storybook에서 직접 확인 가능하게 노출'],
];

const ledgerRows = [
  ['P0', 'Navigation: Footer, TopBar', 'Fixed', '실제 소비 앱에서 높이, sticky, dark surface 재검증'],
  ['P0', 'Navigation details', 'Watch', '자간 0 정규화 완료, SideNav, Tabs, Breadcrumb, Pagination, BottomNav, Steps, UserMenu spacing/상태 검증'],
  ['P0', 'Buttons', 'Fixed / Watch', 'hover/focus/disabled 상태를 Storybook interaction 기준으로 고정'],
  ['P0', 'Robotics: RobotStatusCard', 'Fixed', '라이트/다크, selected, status별 시각 회귀 테스트 추가'],
  ['P0', 'Robotics details', 'Watch', 'EquipmentStatusCard, ConnectionBadge, TopicTree, Joystick 상태색/밀도/대비 검증'],
  ['P1', 'Forms', 'Watch', '자간 0 정규화 완료, AutoComplete, DatePicker, SearchField, Slider, Input 계열 focus/error/dark 검증'],
  ['P1', 'Data', 'Watch', 'Table, Calendar, AvatarGroup 행 높이, sticky, empty/loading 보강'],
  ['P1', 'Overlay', 'Watch', '자간 0 정규화 완료, Modal, Drawer, Sheet, Popover, DropdownMenu, Toast, Alert focus/dark 검증'],
  ['P1', 'Selection', 'Watch', '자간 0 정규화 완료, selected/pressed/disabled 상태의 토큰 일관성 검증'],
  ['P2', 'Cards', 'Fixed / Watch', '자간 0 정규화 완료, Card/NewsCard/ProductCard hover motion은 원본 번들과 일치 확인. FeatureCard/MetricCard/Stat 대비/배치 검증'],
  ['P2', 'Content', 'Watch', '자간 0 정규화 완료, Accordion, ListCell, Tooltip, Badge, Timeline, Divider 상호작용 검증'],
  ['P2', 'Layout', 'Watch', 'Section, Grid, Stack, Cluster, Split, Columns, ScrollArea section gap 검증'],
  ['P2', 'Viz', 'Watch', 'Map2DCanvas, Scene3DFrame, ViewerToolbar, TelemetryGauge, VideoStreamTile resize/dark 검증'],
];

const debtItems = [
  'React 컴포넌트의 음수 자간은 0으로 정규화했습니다. 원본 정적 HTML(*.card.html)은 비교 기준으로 보존하므로 기존 자간이 그대로 남아 있을 수 있습니다.',
  '카드 계열의 hover movement와 이미지 scale은 원본 미리보기 번들의 Card/NewsCard/ProductCard 동작과 일치하므로 유지합니다. 이후 변경 시 npm run check:parity의 motion contract와 함께 제품 결정 기록을 갱신해야 합니다.',
  'npm run check:coverage가 원본 20개 guideline, 83개 component card, 4개 template card의 Audit/Legacy Preview 누락과 @dsCard 메타 누락을 차단합니다.',
  'npm run check:map은 원본 component card 83개가 97개 React export와 연결되고, 각 export가 src/index.js, dist/index.d.ts, _ds_bundle.js, React Storybook 소스에 존재하는지 검증합니다.',
  'npm run check:visual은 Storybook 정적 빌드 후 대표 9개 화면을 visual-artifacts/smoke/에 캡처합니다. 전체 원본 대비 pixel diff baseline은 다음 단계입니다.',
  'npm run check:legacy-render는 전체 107개 원본 preview가 Storybook 정적 빌드에서 실제 DOM/visible element로 렌더되는지 검사합니다.',
  'npm run check:visual-inventory captures all 83 original component cards, all 83 same-viewport primary React counterparts, and every React implementation story into visual-artifacts/inventory/ with a manifest and card/story pairing candidates, strict story-block primary story selections, full story-block export coverage, Storybook iframe paths, and local review anchors. This is evidence collection before pixel diff baseline enforcement.',
  'npm run check:visual-review refreshes that inventory and writes visual-artifacts/inventory/review.html, a local QA report that places each original card beside its same-viewport primary React capture and keeps paired React story screenshots with primary-story badges below, then verifies that the report renders 83 strict pairs with 83 matching primaryReactCards, full export-block coverage, no broken images, and complete Storybook links.',
  'npm run check:visual-diff refreshes the review inventory, computes pixel-level original-to-primary differences for all 83 pairs, writes visual-artifacts/inventory/diffs/manifest.json, red-highlight diff PNGs, and report.html, then verifies the report renders all 83 comparisons with no broken images. This is the measured mismatch ledger before a strict zero-diff or threshold gate is enforced. High-mismatch AutoComplete, DatePicker, SearchField, Slider, Skeleton, Spinner, Lightbox, and Sheet cards now have dedicated parity stories so their primary visual pairs are no longer broad inventory pages.',
];

const page = {
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 'var(--space-8)',
  color: 'var(--label-normal)',
  letterSpacing: 0,
};

const panel = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-xs)',
};

function Pill({ children, tone = 'neutral' }) {
  const styles = {
    Fixed: ['rgba(79, 118, 93, 0.16)', 'var(--bw-green-600)'],
    Watch: ['rgba(0, 103, 168, 0.12)', 'var(--color-primary-hover)'],
    Gap: ['rgba(207, 99, 96, 0.16)', '#9B3D3A'],
    Deferred: ['var(--fill-alt)', 'var(--label-alternative)'],
    neutral: ['var(--fill-alt)', 'var(--label-neutral)'],
  };
  const [background, color] = styles[children] || styles[tone] || styles.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 24,
        padding: '2px 9px',
        borderRadius: 'var(--radius-pill)',
        background,
        color,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function Section({ title, description, children }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--fs-h3)', lineHeight: 'var(--lh-h3)' }}>
          {title}
        </h2>
        {description ? (
          <p style={{ margin: 0, maxWidth: 860, color: 'var(--label-neutral)', lineHeight: 1.65 }}>{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Table({ columns, rows, statusColumn = -1 }) {
  return (
    <div style={{ ...panel, overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: 820, borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  color: 'var(--label-normal)',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--fill-alt)',
                  fontSize: 13,
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td
                  key={`${row[1]}-${index}`}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: index === 1 ? 'var(--label-normal)' : 'var(--label-neutral)',
                    fontWeight: index === 1 ? 700 : 500,
                    verticalAlign: 'top',
                    lineHeight: 1.55,
                  }}
                >
                  {index === statusColumn ? <Pill>{cell}</Pill> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const CurrentLedger = {
  name: '현재 보정표',
  render: () => (
    <main style={page}>
      <header style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <strong style={{ color: 'var(--color-primary)', fontSize: 13 }}>LK ROBOTICS DESIGN SYSTEM</strong>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--fs-h1)', lineHeight: 'var(--lh-h1)' }}>
          원본 대비 현재 구현 보정표
        </h1>
        <p style={{ margin: 0, maxWidth: 900, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          기존 정적 카드와 현재 React/Storybook 구현을 맞춰 보기 위한 기준표입니다. 원본을 살리면서 실제 패키지로 쓸 수 있는
          디자인 시스템 상태로 옮기는 데 필요한 작업을 Fixed, Watch, Gap, Deferred로 추적합니다.
        </p>
      </header>

      <Section title="현재 커버리지">
        <Table columns={['영역', '수량', '현재 상태']} rows={coverageRows} />
      </Section>

      <Section title="이번 보정 완료">
        <Table columns={['우선순위', '영역', '조치']} rows={fixedRows} />
      </Section>

      <Section title="남은 전수조사 보정표" description="Watch 항목은 원본과 매핑은 됐지만 라이트/다크, 반응형, 상호작용 검증이 남은 영역입니다.">
        <Table columns={['우선순위', '영역', '판정', '다음 작업']} rows={ledgerRows} statusColumn={2} />
      </Section>

      <Section title="알려진 기술 부채">
        <div style={{ ...panel, padding: 'var(--space-5)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 'var(--space-3)', color: 'var(--label-neutral)', lineHeight: 1.65 }}>
            {debtItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  ),
};
