import * as React from 'react';
import {
  LK_LOGO_COLORS,
  LK_PATHS,
  type LkLogoPath,
} from '@lk-design-system/lds-core/brand-authoring';
import {
  FieldLabel,
  componentVars,
  fieldTypography,
  formatValueWithUnit,
  normalizeBoundedValue,
  normalizeStatusTone,
  type FieldLabelProps,
  type LdsClassNames,
  type NormalizeBoundedValueOptions,
  type StatusTone,
} from '@lk-design-system/lds-core/component-authoring';
import {
  ComponentDensityScope,
  useResolvedControlSize,
  useResolvedDensity,
  type ComponentDensity,
} from '@lk-design-system/lds-core/density';
import {
  useMenuKeyboard,
  useSubmenuBranch,
  type UseMenuKeyboardOptions,
  type UseSubmenuBranchResult,
} from '@lk-design-system/lds-core/headless';
import {
  OverlayRuntimeProvider,
  anchoredPanelStyle,
  useOverlayLayer,
  type OverlayRuntimeValue,
  type UseDialogFocusOptions,
} from '@lk-design-system/lds-core/platform';
import {
  Button,
  Card,
  DropdownMenu,
  Input,
  Modal,
  SearchField,
  SegmentedControl,
  Select,
  Tabs,
  Textarea,
  TextButton,
  Tooltip,
} from '@lk-design-system/lds-core';
import { LdsProvider, ThemeToggle } from '@lk-design-system/lds-theme';
import {
  ConversationMessage,
  MessageFeed,
  MessageComposer,
  SourceDisclosure,
  VirtualKeypad,
  EquipmentStatusCard,
  DataToolbar,
  DashboardShell,
  FieldAction,
  Popover,
  SideNav,
} from '@lk-design-system/lds-product';
import {
  WaypointMarker,
  LaneOverlay,
  RouteOverlay,
  TrajectoryOverlay,
  SpatialRegion,
  FacilityTransition,
} from '@lk-design-system/lds-robotics-ui';
import { Button as CoreDeepButton } from '@lk-design-system/lds-core/components/buttons/Button';
import { ThemeToggle as ThemeDeepToggle } from '@lk-design-system/lds-theme/components/selection/ThemeToggle';
import { Table as ProductDeepTable } from '@lk-design-system/lds-product/components/data/Table';
import { ViewerFrame as ProductDeepViewerFrame } from '@lk-design-system/lds-product/components/viz/ViewerFrame';

// @ts-expect-error Robotics exports must not leak into the Core entrypoint.
import { RobotStatusCard as InvalidCoreRobotStatusCard } from '@lk-design-system/lds-core';

export const consumerContract: React.ReactElement = <Button variant="primary">확인</Button>;

const supportedRangeOptions: NormalizeBoundedValueOptions = { value: 120, min: 0, max: 100 };
const supportedRange = normalizeBoundedValue(supportedRangeOptions);
const supportedClassNames: LdsClassNames<'root'> = { root: 'supported-root' };
const supportedDensity: ComponentDensity = 'compact';
const supportedLogoPath: Readonly<LkLogoPath> | undefined = LK_PATHS[0];
const supportedTone: StatusTone = normalizeStatusTone('success');
const supportedFieldLabelProps: FieldLabelProps = { htmlFor: 'supported-output', label: 'Supported field' };
const supportedOverlayRuntime: Partial<OverlayRuntimeValue> = { zIndexBase: 160, profile: 'ops' };
const supportedDialogFocusOptions: UseDialogFocusOptions = { open: false, lockScroll: false };
const supportedMenuOptions: UseMenuKeyboardOptions = {
  open: false,
  onClose: () => undefined,
  getTrigger: () => null,
};
const supportedSubmenuHook: (options?: { disabled?: boolean }) => UseSubmenuBranchResult = useSubmenuBranch;

function SupportedCoreSubpathContract(): React.ReactElement {
  const resolvedDensity = useResolvedDensity();
  const resolvedSize = useResolvedControlSize();
  const menu = useMenuKeyboard(supportedMenuOptions);
  const overlay = useOverlayLayer({ open: false });
  const supportedVars = componentVars({ '--lds-supported-value': supportedRange.percent }, '--lds-supported-');
  const panelStyle = anchoredPanelStyle(240);
  void supportedSubmenuHook;
  void supportedDialogFocusOptions;
  void supportedLogoPath;
  void menu.menuRef;
  return (
    <>
      <FieldLabel {...supportedFieldLabelProps} />
      <output
        id="supported-output"
        className={supportedClassNames.root}
        data-density={resolvedDensity}
        data-size={resolvedSize}
        data-tone={supportedTone}
        data-overlay-z-index={overlay.zIndex}
        data-panel-position={panelStyle.position}
        data-brand-color={LK_LOGO_COLORS.navy}
        style={{ ...supportedVars, ...fieldTypography('sm') }}
      >
        {formatValueWithUnit(supportedRange.value, '%')}
      </output>
    </>
  );
}

export const supportedCoreSubpathContract: React.ReactElement = (
  <ComponentDensityScope density={supportedDensity}>
    <OverlayRuntimeProvider {...supportedOverlayRuntime}>
      <SupportedCoreSubpathContract />
    </OverlayRuntimeProvider>
  </ComponentDensityScope>
);
export const polymorphicButtonContract: React.ReactElement = <Button as="a" href="/reports">보고서</Button>;
export const polymorphicTextButtonContract: React.ReactElement = <TextButton as="a" href="/documents">문서</TextButton>;
export const tabsLengthPaddingContract: React.ReactElement = (
  <Tabs
    items={[{ value: 'overview', label: '개요' }, { value: 'activity', label: '활동' }]}
    defaultValue="overview"
    padding="var(--space-6)"
    scroll="auto"
  />
);
export const sideNavChildIconContract: React.ReactElement = (
  <SideNav
    aria-label="제품 탐색"
    appearance="brand"
    overlay
    autoExpandActiveGroup={false}
    items={[{
      value: 'work',
      label: '작업',
      children: [{ value: 'documents', label: '문서', icon: <span aria-hidden="true">D</span> }],
    }]}
  />
);
// @ts-expect-error SideNav appearance only accepts the default or steel palette bundle.
export const invalidSideNavAppearanceContract: React.ReactElement = <SideNav aria-label="잘못된 외형" items={[]} appearance="midnight" />;
const temporaryNavigationTriggerRef = React.createRef<HTMLButtonElement>();
export const dashboardTemporaryNavigationContract: React.ReactElement = (
  <DashboardShell
    layout="narrow"
    navigation={<SideNav aria-label="넓은 탐색" items={[]} />}
    temporaryNavigation={<SideNav aria-label="좁은 탐색" items={[]} />}
    temporaryNavigationOpen
    onTemporaryNavigationClose={() => undefined}
    temporaryNavigationId="consumer-navigation-drawer"
    temporaryNavigationTitle="주 탐색"
    temporaryNavigationReturnFocusRef={temporaryNavigationTriggerRef}
  >
    <p>본문</p>
  </DashboardShell>
);
export const dataToolbarFilterDensityContract: React.ReactElement = (
  <DataToolbar
    size="md"
    searchPlaceholder="자료 검색"
    filters={({ size }) => (
      <Select size={size} aria-label="자료 유형">
        <option value="all">전체</option>
      </Select>
    )}
  />
);

const buttonSurfaceRef = React.createRef<HTMLButtonElement>();
const inputSurfaceRef = React.createRef<HTMLInputElement>();
const textareaSurfaceRef = React.createRef<HTMLTextAreaElement>();
const searchSurfaceRef = React.createRef<HTMLInputElement>();
const selectSurfaceRef = React.createRef<HTMLButtonElement>();
const fieldRootRef = React.createRef<HTMLDivElement>();
const fieldActionSurfaceRef = React.createRef<HTMLFormElement>();
const segmentedSurfaceRef = React.createRef<HTMLDivElement>();
const tabsSurfaceRef = React.createRef<HTMLDivElement>();
const cardSurfaceRef = React.createRef<HTMLDivElement>();
const dataToolbarSurfaceRef = React.createRef<HTMLDivElement>();
const sideNavSurfaceRef = React.createRef<HTMLElement>();
const dropdownSurfaceRef = React.createRef<HTMLDivElement>();
const popoverSurfaceRef = React.createRef<HTMLDivElement>();
const tooltipSurfaceRef = React.createRef<HTMLSpanElement>();
const modalSurfaceRef = React.createRef<HTMLDivElement>();

export const refinedSurfaceAndRefContract: React.ReactElement = (
  <>
    <Button
      ref={buttonSurfaceRef}
      classNames={{ content: 'button-content' }}
      styles={{ loader: { opacity: 0.8 } }}
      vars={{ '--lds-button-height': '3rem' }}
    >
      저장
    </Button>
    <Input
      ref={inputSurfaceRef}
      rootRef={fieldRootRef}
      label="이름"
      classNames={{ control: 'input-control' }}
      styles={{ input: { letterSpacing: '0.01em' } }}
      vars={{ '--lds-input-height': '3rem' }}
    />
    <Textarea
      ref={textareaSurfaceRef}
      rootRef={fieldRootRef}
      label="설명"
      classNames={{ textarea: 'textarea-control' }}
      vars={{ '--lds-textarea-min-height': '8rem' }}
    />
    <SearchField
      ref={searchSurfaceRef}
      rootRef={fieldRootRef}
      label="검색"
      classNames={{ clearButton: 'search-clear' }}
      vars={{ '--lds-search-field-height': '3rem' }}
    />
    <Select
      ref={selectSurfaceRef}
      rootRef={fieldRootRef}
      aria-label="상태"
      options={[{ value: 'ready', label: '준비' }]}
      classNames={{ dropdown: 'select-dropdown' }}
      vars={{ '--lds-select-dropdown-max-height': '15rem' }}
      withinPortal
      portalTarget={null}
    />
    <FieldAction
      ref={fieldActionSurfaceRef}
      as="form"
      field={<Input aria-label="코드" />}
      action={<Button type="submit">적용</Button>}
      classNames={{ row: 'field-action-row' }}
      vars={{ '--lds-field-action-gap': '0.75rem' }}
    />
    <SegmentedControl
      ref={segmentedSurfaceRef}
      aria-label="보기"
      options={['목록', '격자']}
      classNames={{ segment: 'segment' }}
      vars={{ '--lds-segmented-control-height': '2.5rem' }}
    />
    <Tabs
      ref={tabsSurfaceRef}
      items={['개요', '활동']}
      classNames={{ indicator: 'tabs-indicator' }}
      vars={{ '--lds-tabs-indicator-height': '0.125rem' }}
    />
    <Card
      ref={cardSurfaceRef}
      title="장비"
      classNames={{ title: 'card-title' }}
      vars={{ '--lds-card-padding': '1rem' }}
    />
    <DataToolbar
      ref={dataToolbarSurfaceRef}
      title="자료"
      classNames={{ controls: 'toolbar-controls' }}
      vars={{ '--lds-data-toolbar-gap': '0.75rem' }}
    />
    <SideNav
      ref={sideNavSurfaceRef}
      aria-label="계약 탐색"
      items={[]}
      classNames={{ item: 'side-nav-item' }}
      vars={{ '--lds-side-nav-width': '15rem' }}
    />
    <DropdownMenu
      ref={dropdownSurfaceRef}
      trigger={<Button>메뉴</Button>}
      items={[{ label: '열기' }]}
      classNames={{ item: 'menu-item' }}
      vars={{ '--lds-dropdown-menu-width': '14rem' }}
      withinPortal
      portalTarget={null}
    />
    <Popover
      ref={popoverSurfaceRef}
      trigger={<Button>세부 정보</Button>}
      classNames={{ panel: 'popover-panel' }}
      vars={{ '--lds-popover-width': '16rem' }}
      withinPortal
      portalTarget={null}
    >
      세부 내용
    </Popover>
    <Tooltip
      ref={tooltipSurfaceRef}
      content="설명"
      classNames={{ bubble: 'tooltip-bubble' }}
      vars={{ '--lds-tooltip-max-width': '12rem' }}
      withinPortal
      portalTarget={null}
    >
      <button type="button">도움말</button>
    </Tooltip>
    <Modal
      ref={modalSurfaceRef}
      open
      onOpenChange={() => undefined}
      title="설정"
      classNames={{ body: 'modal-body' }}
      vars={{ '--lds-modal-width': '32rem' }}
      withinPortal
      portalTarget={null}
    >
      설정 본문
    </Modal>
  </>
);

export const providerRuntimeContract: React.ReactElement = (
  <LdsProvider defaultColorScheme="dark" direction="rtl" persist={false} portalTarget={null} zIndexBase={200}>
    <Button>Provider child</Button>
  </LdsProvider>
);

// Robotics navigation extension — renderer-neutral SVG feature contracts.
export const deepImportContract: React.ReactElement = (
  <>
    <CoreDeepButton>Core deep import</CoreDeepButton>
    <ThemeDeepToggle target={null} persist={false} />
    <ProductDeepTable columns={[]} rows={[]} />
    <ProductDeepViewerFrame label="Deep viewer" />
  </>
);
export const themeContract: React.ReactElement = <ThemeToggle target={null} persist={false} />;

export const waypointContract: React.ReactElement = (
  <WaypointMarker
    waypoint={{ id: 'w1', label: '웨이포인트', mapId: 'm1', position: { x: 0, y: 0 }, roles: ['holding'] }}
    onActivate={(id) => id}
  />
);

export const laneContract: React.ReactElement = (
  <LaneOverlay
    lane={{
      id: 'l1',
      mapId: 'm1',
      points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      entry: { waypointId: 'w1', orientation: 'forward' },
      exit: { waypointId: 'w2' },
    }}
    availability="available"
  />
);

export const routeContract: React.ReactElement = (
  <RouteOverlay
    activeMapId="m1"
    route={{
      id: 'r1',
      status: 'active',
      segments: [{ id: 's1', mapId: 'm1', points: [{ x: 0, y: 0 }], phase: 'current' }],
    }}
  />
);

export const trajectoryContract: React.ReactElement = (
  <TrajectoryOverlay
    trajectory={{ id: 't1', mapId: 'm1', status: 'active', samples: [{ position: { x: 0, y: 0 } }] }}
  />
);

export const regionContract: React.ReactElement = (
  <SpatialRegion
    region={{
      id: 'z1',
      mapId: 'm1',
      label: '영역',
      category: 'behavior',
      rule: { kind: 'keep-out' },
      shape: { kind: 'circle', center: { x: 0, y: 0 }, radius: 1 },
    }}
  />
);

export const facilityContract: React.ReactElement = (
  <FacilityTransition
    activeMapId="m1"
    transition={{
      id: 'f1',
      kind: 'door',
      label: '자동문',
      facilityId: 'd1',
      from: { mapId: 'm1', position: { x: 0, y: 0 } },
      availability: 'available',
      doorState: 'closed',
    }}
  />
);

export const equipmentStatusContract: React.ReactElement = (
  <EquipmentStatusCard
    title="화물 엘리베이터 2호기"
    description="물류동 동측"
    status="운행 중"
    statusTone="positive"
    details={[
      { label: '이동', value: '상승 중' },
      { label: '층', value: '3층' },
    ]}
    meta="30초 전에 갱신"
  />
);

// Communication family — message, feed, composer.
export const messageContract: React.ReactElement = (
  <ConversationMessage
    authorRole="assistant"
    author="LK Assistant"
    lifecycle={{ kind: 'response', state: 'complete' }}
  >
    응답 본문
  </ConversationMessage>
);

export const userMessageContract: React.ReactElement = (
  <ConversationMessage authorRole="user" author="김서윤">
    {'첫 줄\n둘째 줄'}
  </ConversationMessage>
);

export const richDocumentMessageContract: React.ReactElement = (
  <ConversationMessage direction="inbound" authorRole="assistant" author="LK Assistant">
    <a href="https://example.com/source">근거 열기</a>
  </ConversationMessage>
);

export const composedSourceMessageContract: React.ReactElement = (
  <ConversationMessage
    direction="inbound"
    authorRole="assistant"
    author="LK Assistant"
    sources={(
      <SourceDisclosure
        sources={[{ id: 'policy', label: '운영 정책', availability: 'available' }]}
      />
    )}
  >
    근거가 있는 응답
  </ConversationMessage>
);

export const embeddedSourceContract: React.ReactElement = (
  <SourceDisclosure
    titleVisuallyHidden
    sources={[{ id: 'policy', label: '운영 정책', availability: 'available' }]}
  />
);

export const provenanceListContract: React.ReactElement = (
  <SourceDisclosure
    variant="list"
    title="확인 기록"
    hiddenCount={2}
    hiddenMessage="권한이 없어 출처 2개는 표시하지 않았습니다."
    sources={[
      {
        id: 'ops-log',
        label: 'OPS / robot-07 inspection log',
        kind: 'log',
        badge: { label: '확인됨', tone: 'positive' },
        availability: 'stale',
        excerpt: 'thermal sensor response timeout',
        observedAt: '2026-07-10 09:14',
        metadata: [{ label: 'commit', value: '8f31b2a' }],
        href: 'https://example.com/logs/robot-07',
        defaultExpanded: true,
      },
      { id: 'restricted', label: '접근할 수 없는 문서', availability: 'restricted' },
    ]}
  />
);

export const chipSourceContract: React.ReactElement = (
  <SourceDisclosure variant="chips" sources={[{ id: 'policy', label: '운영 정책', href: 'https://example.com/policy' }]} />
);

export const richUserMessageContract: React.ReactElement = (
  <ConversationMessage authorRole="user" author="김서윤">
    <a href="https://example.com/source">근거 열기</a>
  </ConversationMessage>
);

export const feedContract: React.ReactElement = (
  <MessageFeed ariaLabel="대화" following onFollowingChange={(next, reason) => `${next}:${reason}`}>
    {messageContract}
  </MessageFeed>
);

export const composerContract: React.ReactElement = (
  <MessageComposer
    className="product-composer"
    value=""
    leadingActions={<button type="button">첨부</button>}
    trailingActions={<button type="button">음성</button>}
    onValueChange={(value) => value}
    onSubmit={(value, reason) => `${value}:${reason}`}
  />
);

// Selection and input — numeric virtual keypad.
export const keypadContract: React.ReactElement = (
  <VirtualKeypad value="" mode="decimal" onChange={(value, meta) => `${value}:${meta.action}`} onConfirm={(value) => value} />
);
