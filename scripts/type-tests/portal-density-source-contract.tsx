import * as React from 'react';
// Check authoring declarations directly: package projections stay untouched
// until the parent runs the approved Linux generation/release path.
import { ListCell } from '../../components/content/ListCell.jsx';
import { EmptyState } from '../../components/status/EmptyState.jsx';
import { ResourceState } from '../../components/data/ResourceState.jsx';
import { Table, getTableHeaderCellStyle, getTableDataCellStyle } from '../../components/data/Table.jsx';
import { ShellPanel } from '../../components/layout/ShellPanel.jsx';
import { DashboardShell } from '../../components/layout/DashboardShell.jsx';
import { MessageComposer } from '../../components/communication/MessageComposer.jsx';
import { ConversationList } from '../../components/communication/ConversationList.jsx';
import { SearchField } from '../../components/forms/SearchField.jsx';

export const sourceContracts = <>
  <MessageComposer layout="inline" density="compact" minRows={1} maxRows={6} value="" onValueChange={() => {}} onSubmit={() => {}} placeholder="무엇을 도와드릴까요?" />
  <MessageComposer layout="stacked" value="" onValueChange={() => {}} onSubmit={() => {}} />
  <ListCell title="문서" typography="small" verticalPadding="small" selectedPresentation="tint" selected />
  <EmptyState size="sm" title="검색 결과가 없습니다" />
  <ResourceState state="empty" density="compact" emptyReason="search" />
  <ResourceState state="empty" density="compact" emptyReason="filter" />
  <Table size="xs" columns={[{ key: 'title', label: '자료', wrap: true }]} rows={[{ title: '자료' }]} rowHeaderKey="title" />
  <DashboardShell layout="auto" temporaryNavigationOpen onTemporaryNavigationClose={() => {}} panel={<ShellPanel title="채팅" density="compact" primaryAction={{ label: '새 채팅', current: true }} />} />
  <MessageComposer value="" density="compact" onValueChange={() => {}} onSubmit={() => {}} />
  <ConversationList aria-label="최근 대화" groups={[{ id: 'today', label: '오늘', items: [{ id: '1', title: '긴 제목', href: '#1' }] }]} />
  <SearchField aria-label="자료 검색" size="sm" onSearch={(value) => value.toUpperCase()} />
</>;

// @ts-expect-error Layout is a bounded public anatomy axis.
export const invalidComposerLayout = <MessageComposer layout="pill" value="" onValueChange={() => {}} onSubmit={() => {}} />;
const header: React.CSSProperties = getTableHeaderCellStyle({ size: 'xs', wrap: true });
const cell: React.CSSProperties = getTableDataCellStyle({ size: 'xs', align: 'right' });
void [header, cell];

// @ts-expect-error Typography is a bounded public preset.
export const invalidTypography = <ListCell typography="tiny" />;
// @ts-expect-error Empty reason is product-neutral and bounded.
export const invalidReason = <ResourceState emptyReason="repository" />;
// @ts-expect-error Table density is the existing size axis, not an arbitrary CSS value.
export const invalidSize = <Table size="compact" columns={[]} rows={[]} />;
// @ts-expect-error ShellPanel uses the shared comfortable/compact density vocabulary.
export const invalidPanelDensity = <ShellPanel title="장치" density="tight" />;
