import React from 'react';

const meta = {
  title: '내부/원본 이관 데이터',
  parameters: {
    docs: {
      description: {
        component:
          '예전 정적 디자인 시스템 카드와 현재 React/Storybook 디자인 시스템 사이의 기준, 요소, 템플릿 이관 상태를 점검하는 문서입니다.',
      },
    },
  },
};

export default meta;

const guidelineItems = [
  ['브랜드', '앱 마크 / 파비콘', 'guidelines/brand-favicon.html', '파운데이션/브랜드'],
  ['브랜드', '이미지', 'guidelines/brand-imagery.html', '파운데이션/브랜드'],
  ['브랜드', '로고', 'guidelines/brand-logo.html', '파운데이션/브랜드'],
  ['브랜드', '로고 비교', 'guidelines/logo-robotics-compare.html', '파운데이션/브랜드'],
  ['색상', '강조색 팔레트', 'guidelines/colors-accents.html', '파운데이션/토큰'],
  ['색상', '브랜드 네이비', 'guidelines/colors-navy.html', '파운데이션/토큰'],
  ['색상', '쿨 뉴트럴', 'guidelines/colors-neutrals.html', '파운데이션/토큰'],
  ['색상', '프라이머리 애저', 'guidelines/colors-primary.html', '파운데이션/토큰'],
  ['색상', '시그널 강조색', 'guidelines/colors-signal.html', '파운데이션/토큰'],
  ['색상', '상태색', 'guidelines/colors-status.html', '파운데이션/토큰'],
  ['스페이싱 & 모션', '모션', 'guidelines/effects-motion.html', '파운데이션/토큰'],
  ['스페이싱 & 모션', '엘리베이션', 'guidelines/effects-shadows.html', '파운데이션/토큰'],
  ['그리드', '그리드 & 브레이크포인트', 'guidelines/grid.html', '컴포넌트/레이아웃'],
  ['아이콘', '아이코노그래피', 'guidelines/iconography.html', '파운데이션/아이콘'],
  ['스페이싱 & 모션', '모서리 반경', 'guidelines/radii.html', '파운데이션/토큰'],
  ['스페이싱 & 모션', '스페이싱 스케일', 'guidelines/spacing-scale.html', '파운데이션/토큰'],
  ['타이포그래피', '본문 & 리드', 'guidelines/type-body.html', '파운데이션/토큰'],
  ['타이포그래피', '이브로우 / 오버라인', 'guidelines/type-eyebrow.html', '파운데이션/토큰'],
  ['타이포그래피', '제목 스케일', 'guidelines/type-scale.html', '파운데이션/토큰'],
  ['타이포그래피', '웨이트', 'guidelines/type-weights.html', '파운데이션/토큰'],
];

const componentItems = [
  ['브랜드', 'Lockup · Overline', 'components/brand/brand.card.html', 'Lockup, Overline', '파운데이션/브랜드, 컴포넌트/콘텐츠'],
  ['브랜드', '브랜드 로고', 'components/brand/logos.card.html', 'BrandLogo', '파운데이션/브랜드'],
  ['버튼', '버튼', 'components/buttons/buttons.card.html', 'Button, IconButton, SocialButton', '컴포넌트/버튼'],
  ['카드', 'Card', 'components/cards/cards-card.card.html', 'Card', '컴포넌트/카드'],
  ['카드', 'ChecklistItem', 'components/cards/cards-checklistitem.card.html', 'ChecklistItem', '컴포넌트/카드'],
  ['카드', 'FeatureCard', 'components/cards/cards-featurecard.card.html', 'FeatureCard', '컴포넌트/카드'],
  ['카드', 'NewsCard', 'components/cards/cards-newscard.card.html', 'NewsCard', '컴포넌트/카드'],
  ['카드', 'ProductCard', 'components/cards/cards-productcard.card.html', 'ProductCard', '컴포넌트/카드'],
  ['카드', 'SourceTag', 'components/cards/cards-sourcetag.card.html', 'SourceTag', '컴포넌트/콘텐츠'],
  ['카드', 'SpecRow', 'components/cards/cards-specrow.card.html', 'SpecRow', '컴포넌트/카드'],
  ['카드', 'Stat', 'components/cards/cards-stat.card.html', 'Stat', '컴포넌트/카드'],
  ['콘텐츠', '툴팁 · 말풍선 · 북마크 · 구분선', 'components/content/content-annotations.card.html', 'Tooltip, Bubble, Bookmark, Divider', '컴포넌트/콘텐츠'],
  ['콘텐츠', '배지 · 상태', 'components/content/content-badges.card.html', 'ContentBadge, StatusBadge', '컴포넌트/콘텐츠'],
  ['콘텐츠', 'ChoiceCard', 'components/content/content-choicecard.card.html', 'ChoiceCard', '컴포넌트/선택과 상태'],
  ['콘텐츠', '리스트 · 아코디언', 'components/content/content-list.card.html', 'ListCell, Accordion', '컴포넌트/콘텐츠'],
  ['콘텐츠', 'Thumbnail', 'components/content/content-thumbnail.card.html', 'Thumbnail', '컴포넌트/콘텐츠'],
  ['데이터', 'AvatarGroup', 'components/data/data-avatargroup.card.html', 'AvatarGroup', '컴포넌트/피드백'],
  ['데이터', 'Calendar', 'components/data/data-calendar.card.html', 'Calendar', '컴포넌트/데이터'],
  ['데이터', 'Table', 'components/data/data-table.card.html', 'Table, StatusBadge', '컴포넌트/데이터'],
  ['에디터', '맵 에디터 셸', 'components/editor/editor.card.html', 'CanvasEditorShell, EditorToolbar, HistoryToolbar', '컴포넌트/로보틱스와 뷰어'],
  ['피드백', 'Avatar', 'components/feedback/feedback-avatar.card.html', 'Avatar', '컴포넌트/피드백'],
  ['피드백', 'Badge', 'components/feedback/feedback-badge.card.html', 'Badge', '컴포넌트/피드백'],
  ['피드백', 'Chip', 'components/feedback/feedback-chip.card.html', 'Chip', '컴포넌트/피드백'],
  ['피드백', 'PushBadge', 'components/feedback/feedback-pushbadge.card.html', 'PushBadge', '컴포넌트/피드백'],
  ['피드백', 'Rating', 'components/feedback/feedback-rating.card.html', 'Rating', '컴포넌트/피드백'],
  ['피드백', 'Tag', 'components/feedback/feedback-tag.card.html', 'Tag', '컴포넌트/피드백'],
  ['폼', 'AutoComplete', 'components/forms/forms-autocomplete.card.html', 'AutoComplete', '컴포넌트/폼'],
  ['폼', 'DatePicker', 'components/forms/forms-datepicker.card.html', 'DatePicker', '컴포넌트/폼'],
  ['폼', 'SearchField', 'components/forms/forms-searchfield.card.html', 'SearchField', '컴포넌트/폼'],
  ['폼', 'Slider', 'components/forms/forms-slider.card.html', 'Slider', '컴포넌트/폼'],
  ['아이콘', '아이코노그래피', 'components/icon/icon.card.html', 'Icon, ICON_NAMES', '파운데이션/아이콘'],
  ['레이아웃', 'AspectRatio', 'components/layout/layout-aspectratio.card.html', 'AspectRatio, Center', '컴포넌트/레이아웃'],
  ['레이아웃', 'Cluster', 'components/layout/layout-cluster.card.html', 'Cluster', '컴포넌트/레이아웃'],
  ['레이아웃', 'Columns', 'components/layout/layout-columns.card.html', 'Columns, Col', '컴포넌트/레이아웃'],
  ['레이아웃', 'Grid', 'components/layout/layout-fluidgrid.card.html', 'Grid', '컴포넌트/레이아웃'],
  ['레이아웃', 'ScrollArea', 'components/layout/layout-scrollarea.card.html', 'ScrollArea, Stack', '컴포넌트/레이아웃'],
  ['레이아웃', 'Section', 'components/layout/layout-section.card.html', 'Section', '컴포넌트/레이아웃'],
  ['레이아웃', 'Split', 'components/layout/layout-split.card.html', 'Split', '컴포넌트/레이아웃'],
  ['레이아웃', 'Stack', 'components/layout/layout-stack.card.html', 'Stack, Spacer', '컴포넌트/레이아웃'],
  ['내비게이션', 'BottomNav', 'components/navigation/navigation-bottomnav.card.html', 'BottomNav', '컴포넌트/내비게이션'],
  ['내비게이션', 'Breadcrumb', 'components/navigation/navigation-breadcrumb.card.html', 'Breadcrumb', '컴포넌트/내비게이션'],
  ['내비게이션', 'Footer', 'components/navigation/navigation-footer.card.html', 'Footer', '컴포넌트/내비게이션'],
  ['내비게이션', 'Pagination', 'components/navigation/navigation-pagination.card.html', 'Pagination', '컴포넌트/내비게이션'],
  ['내비게이션', 'SideNav', 'components/navigation/navigation-sidenav.card.html', 'SideNav, UserMenu', '컴포넌트/내비게이션'],
  ['내비게이션', 'Tabs', 'components/navigation/navigation-tabs.card.html', 'Tabs', '컴포넌트/내비게이션'],
  ['내비게이션', 'Steps', 'components/navigation/steps.card.html', 'Steps', '컴포넌트/내비게이션'],
  ['내비게이션', 'TopBar', 'components/navigation/topbar.card.html', 'TopBar', '컴포넌트/내비게이션'],
  ['오버레이', 'Alert', 'components/overlay/overlay-alert.card.html', 'Alert', '컴포넌트/오버레이'],
  ['오버레이', 'CommandPalette', 'components/overlay/overlay-commandpalette.card.html', 'CommandPalette', '컴포넌트/오버레이'],
  ['오버레이', 'Dimmer', 'components/overlay/overlay-dimmer.card.html', 'Dimmer', '컴포넌트/오버레이'],
  ['오버레이', 'Drawer', 'components/overlay/overlay-drawer.card.html', 'Drawer', '컴포넌트/오버레이'],
  ['오버레이', 'DropdownMenu', 'components/overlay/overlay-dropdownmenu.card.html', 'DropdownMenu', '컴포넌트/오버레이'],
  ['오버레이', 'HoverCard', 'components/overlay/overlay-hovercard.card.html', 'HoverCard', '컴포넌트/오버레이'],
  ['오버레이', 'Lightbox', 'components/overlay/overlay-lightbox.card.html', 'Lightbox', '컴포넌트/오버레이'],
  ['오버레이', 'Modal', 'components/overlay/overlay-modal.card.html', 'Modal', '컴포넌트/오버레이'],
  ['오버레이', 'Popover', 'components/overlay/overlay-popover.card.html', 'Popover', '컴포넌트/오버레이'],
  ['오버레이', 'Sheet', 'components/overlay/overlay-sheet.card.html', 'Sheet', '컴포넌트/오버레이'],
  ['오버레이', 'Toast', 'components/overlay/overlay-toast.card.html', 'Toast', '컴포넌트/오버레이'],
  ['오버레이', 'ToastStack', 'components/overlay/overlay-toaststack.card.html', 'ToastStack', '컴포넌트/오버레이'],
  ['오버레이', '오버레이 조합', 'components/overlay/overlay.card.html', 'Alert, Toast', '컴포넌트/오버레이'],
  ['로보틱스', '연결 배지', 'components/robotics/robotics-connection.card.html', 'ConnectionBadge', '컴포넌트/로보틱스와 뷰어'],
  ['로보틱스', 'EquipmentStatusCard', 'components/robotics/robotics-equipmentstatuscard.card.html', 'EquipmentStatusCard', '컴포넌트/로보틱스와 뷰어'],
  ['로보틱스', '조이스틱', 'components/robotics/robotics-joystick.card.html', 'Joystick', '컴포넌트/로보틱스와 뷰어'],
  ['로보틱스', 'RobotStatusCard', 'components/robotics/robotics-robotstatuscard.card.html', 'RobotStatusCard', '컴포넌트/로보틱스와 뷰어'],
  ['로보틱스', '토픽 트리', 'components/robotics/robotics-topictree.card.html', 'TopicTree', '컴포넌트/로보틱스와 뷰어'],
  ['선택', 'FilterChip', 'components/selection/selection-filterchip.card.html', 'FilterChip', '컴포넌트/선택과 상태'],
  ['선택', 'MultiSelectChip', 'components/selection/selection-multiselectchip.card.html', 'MultiSelectChip', '컴포넌트/선택과 상태'],
  ['선택', 'SegmentedControl', 'components/selection/selection-segmented.card.html', 'SegmentedControl', '컴포넌트/선택과 상태'],
  ['선택', 'Stepper', 'components/selection/selection-stepper.card.html', 'Stepper', '컴포넌트/선택과 상태'],
  ['선택', 'Switch', 'components/selection/selection-switch.card.html', 'Switch', '컴포넌트/선택과 상태'],
  ['선택', 'ThemeToggle', 'components/selection/selection-themetoggle.card.html', 'ThemeToggle', '컴포넌트/선택과 상태'],
  ['선택', 'ToggleButton', 'components/selection/selection-togglebutton.card.html', 'ToggleButton', '컴포넌트/선택과 상태'],
  ['상태', 'CircularProgress', 'components/status/circular.card.html', 'CircularProgress', '컴포넌트/선택과 상태'],
  ['상태', 'Banner', 'components/status/status-banner.card.html', 'Banner', '컴포넌트/선택과 상태'],
  ['상태', 'EmptyState', 'components/status/status-emptystate.card.html', 'EmptyState', '컴포넌트/선택과 상태'],
  ['상태', 'ProgressBar', 'components/status/status-progressbar.card.html', 'ProgressBar', '컴포넌트/선택과 상태'],
  ['상태', 'Skeleton', 'components/status/status-skeleton.card.html', 'Skeleton', '컴포넌트/선택과 상태'],
  ['상태', 'Spinner', 'components/status/status-spinner.card.html', 'Spinner', '컴포넌트/선택과 상태'],
  ['뷰어', 'Map2DCanvas', 'components/viz/viz-map2d.card.html', 'Map2DCanvas', '컴포넌트/로보틱스와 뷰어'],
  ['뷰어', 'Scene3DFrame', 'components/viz/viz-scene3d.card.html', 'Scene3DFrame', '컴포넌트/로보틱스와 뷰어'],
  ['뷰어', 'TelemetryGauge', 'components/viz/viz-telemetry.card.html', 'TelemetryGauge', '컴포넌트/로보틱스와 뷰어'],
  ['뷰어', 'ViewerToolbar', 'components/viz/viz-toolbar.card.html', 'ViewerToolbar', '컴포넌트/로보틱스와 뷰어'],
  ['뷰어', 'VideoStreamTile', 'components/viz/viz-video.card.html', 'VideoStreamTile', '컴포넌트/로보틱스와 뷰어'],
];

const templateItems = [
  ['폼-설정', 'templates-cards/template-form-settings.card.html', 'templates/form-settings/', 'Input, Select, RadioGroup, Switch, Textarea'],
  ['리스트-테이블', 'templates-cards/template-list-table.card.html', 'templates/list-table/', 'SearchField, Select, Table, Pagination'],
  ['로그인', 'templates-cards/template-login.card.html', 'templates/login/', 'Input, PasswordInput, Checkbox, Button, Banner'],
  ['마스터-디테일', 'templates-cards/template-master-detail.card.html', 'templates/master-detail/', '필터, 타입 그룹 리스트, 스티키 상세, 텔레메트리'],
];

const tokenGroups = [
  ['브랜드 네이비', 'var(--bw-ink)', '텍스트와 다크 서피스의 기준'],
  ['프라이머리 애저', 'var(--color-primary)', '주요 CTA'],
  ['시그널 강조색', 'var(--lk-accent-ink)', '링크, 활성 상태, 감지 신호'],
  ['쿨 뉴트럴', 'var(--bw-gray)', '보조 텍스트와 미세 구분'],
  ['상태 긍정', 'var(--color-positive)', '성공과 정상 상태'],
  ['상태 주의', 'var(--color-cautionary)', '주의와 점검 상태'],
  ['상태 위험', 'var(--color-danger)', '오류와 위험 상태'],
  ['보더', 'var(--border-subtle)', 'hairline divider'],
];

const spacingGroups = [
  ['--space-1', '4px', 'micro gap'],
  ['--space-2', '8px', 'tight pair'],
  ['--space-3', '12px', 'control gap'],
  ['--space-4', '16px', 'card inner gap'],
  ['--space-6', '24px', 'section group gap'],
  ['--space-8', '32px', 'page rhythm'],
  ['--space-16', '64px', 'wide section gap'],
  ['--space-28', '112px', 'light section padding'],
  ['--space-32', '128px', 'hero / dark-band padding'],
];

const pageStyle = {
  display: 'grid',
  gap: 'var(--space-8)',
  maxWidth: 1240,
  margin: '0 auto',
  letterSpacing: 0,
};

const panelStyle = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-xs)',
  padding: 'var(--space-6)',
};

const titleStyle = {
  margin: 0,
  color: 'var(--label-strong)',
  fontSize: 'var(--fs-h3)',
  lineHeight: 'var(--lh-h3)',
};

const textStyle = {
  margin: 0,
  color: 'var(--label-neutral)',
  lineHeight: 1.65,
};

function StatusPill({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 24,
        padding: '2px 9px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--lk-accent-tint)',
        color: 'var(--accent-text)',
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function Header({ eyebrow, title, description }) {
  return (
    <header style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <strong style={{ color: 'var(--accent-text)', fontSize: 13 }}>{eyebrow}</strong>
      <h1 style={{ ...titleStyle, fontSize: 'var(--fs-h1)', lineHeight: 'var(--lh-h1)' }}>{title}</h1>
      <p style={{ ...textStyle, maxWidth: 820 }}>{description}</p>
    </header>
  );
}

function Metric({ label, value, caption }) {
  return (
    <article style={panelStyle}>
      <strong style={{ display: 'block', color: 'var(--label-alternative)', fontSize: 13 }}>{label}</strong>
      <p style={{ margin: '8px 0 2px', color: 'var(--label-strong)', fontSize: 34, lineHeight: 1, fontWeight: 800 }}>
        {value}
      </p>
      <span style={{ color: 'var(--label-alternative)', fontSize: 13 }}>{caption}</span>
    </article>
  );
}

function Section({ title, description, children }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h2 style={titleStyle}>{title}</h2>
        {description ? <p style={{ ...textStyle, maxWidth: 920 }}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function InventoryTable({ columns, rows }) {
  return (
    <div style={{ ...panelStyle, overflowX: 'auto', padding: 0 }}>
      <table style={{ width: '100%', minWidth: 920, borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  color: 'var(--label-alternative)',
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
            <tr key={`${row[0]}-${row[1]}-${row[2]}`}>
              {row.map((cell, index) => (
                <td
                  key={`${row[2]}-${index}`}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: index === 1 ? 'var(--label-normal)' : 'var(--label-neutral)',
                    fontWeight: index === 1 ? 700 : 500,
                    verticalAlign: 'top',
                  }}
                >
                  {index === row.length - 1 ? (
                    <StatusPill>{cell}</StatusPill>
                  ) : index === 2 ? (
                    <code
                      style={{
                        color: 'var(--label-alternative)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        letterSpacing: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cell}
                    </code>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const SourceInventory = {
  name: '원본 기준 전수조사',
  render: () => (
    <main style={pageStyle}>
      <Header
        eyebrow="LK ROBOTICS DESIGN SYSTEM"
        title="원본 기준 이관 점검"
        description="정적 HTML 카드와 가이드라인을 현재 React 컴포넌트, 토큰, Storybook 표면에 대응시킨 전수조사표입니다. 이 표에서 빠진 항목이 있으면 디자인 시스템 검증 대상에서 누락된 것으로 봅니다."
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Metric label="원본 지침" value={guidelineItems.length} caption="guidelines/*.html" />
        <Metric label="원본 요소 카드" value={componentItems.length} caption="components/**/*.card.html" />
        <Metric label="템플릿 카드" value={templateItems.length} caption="templates-cards/*.html" />
        <Metric label="현재 컴포넌트" value="145" caption="React export entries" />
      </section>

      <Section
        title="지침 대응"
        description="브랜드, 색상, 타이포그래피, 그리드, 모션, 반경 기준을 현재 Storybook에서 어디로 확인해야 하는지 명시합니다."
      >
        <InventoryTable columns={['분류', '원본 지침', '원본 파일', '현재 확인 위치']} rows={guidelineItems} />
      </Section>

      <Section
        title="요소 대응"
        description="83개 원본 카드 기준을 현재 컴포넌트와 Storybook 표면에 연결했습니다. TopBar처럼 시각 이관 문제가 생기면 이 표를 기준으로 해당 원본 파일과 현재 스토리를 함께 봅니다."
      >
        <InventoryTable columns={['분류', '원본 요소', '원본 파일', '현재 컴포넌트', '현재 확인 위치']} rows={componentItems} />
      </Section>

      <Section title="템플릿 대응" description="템플릿은 컴포넌트 조합 검증 표면입니다. 각 템플릿 카드와 실제 starter 폴더를 함께 유지합니다.">
        <InventoryTable columns={['템플릿', '원본 카드', 'starter 폴더', '핵심 요소']} rows={templateItems} />
      </Section>
    </main>
  ),
};

export const FoundationMatrix = {
  name: '토큰 지침 매트릭스',
  render: () => (
    <main style={pageStyle}>
      <Header
        eyebrow="FOUNDATION"
        title="토큰 기준 요약"
        description="원본 지침의 색상, 간격, 반경, 모션 기준을 현재 토큰 이름으로 확인하는 빠른 점검 화면입니다."
      />

      <Section title="색상 역할">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {tokenGroups.map(([label, token, usage]) => (
            <article key={token} style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
              <div style={{ height: 72, borderRadius: 'var(--radius-lg)', background: token, border: '1px solid var(--border-subtle)' }} />
              <div style={{ display: 'grid', gap: 4 }}>
                <strong style={{ color: 'var(--label-normal)' }}>{label}</strong>
                <code style={{ color: 'var(--label-alternative)', fontSize: 12 }}>{token}</code>
                <span style={{ color: 'var(--label-neutral)', fontSize: 13 }}>{usage}</span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="간격 스케일">
        <div style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
          {spacingGroups.map(([token, value, usage]) => (
            <div
              key={token}
              style={{
                display: 'grid',
                gridTemplateColumns: '112px minmax(48px, 160px) 64px minmax(0, 1fr)',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <code style={{ color: 'var(--label-alternative)' }}>{token}</code>
              <div style={{ width: `var(${token})`, maxWidth: '100%', height: 12, borderRadius: 'var(--radius-pill)', background: 'var(--accent-text)' }} />
              <code style={{ color: 'var(--label-alternative)' }}>{value}</code>
              <span style={{ color: 'var(--label-neutral)' }}>{usage}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="형태와 동작">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            ['반경', '12px control, 16px card, 24px sheet, 32px modal, pill'],
            ['그림자', 'navy-tinted diffuse shadows, hard black 금지'],
            ['모션', '120 / 200 / 320ms, cubic-bezier(.4, 0, .2, 1), bounce 금지'],
            ['그리드', '12 columns, sm 768, md 992, lg 1200, xl 1600'],
          ].map(([label, value]) => (
            <article key={label} style={panelStyle}>
              <strong style={{ display: 'block', marginBottom: 8, color: 'var(--label-normal)' }}>{label}</strong>
              <p style={textStyle}>{value}</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  ),
};
