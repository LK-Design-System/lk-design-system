import React from 'react';
import { Icon, IconButton, Lockup, UserMenu } from '../src/index.js';
import { ConversationList } from '../components/communication/ConversationList.jsx';
import { ShellPanel } from '../components/layout/ShellPanel.jsx';

/* Shared fixtures for the rail-panel shell stories (DashboardShell, ShellPanel,
   ConversationList). Story data only; routes and persistence are product-owned. */

export const preventNavigation = (event) => event.preventDefault();

export const railAreas = [
  { value: 'ask', label: '질문', href: '#ask', icon: <Icon name="chat" size={20} /> },
  { value: 'catalog', label: '카탈로그', href: '#catalog', icon: <Icon name="folder" size={20} /> },
  { value: 'knowledge', label: '지식', href: '#knowledge', icon: <Icon name="book" size={20} /> },
  { value: 'integrations', label: '연동', href: '#integrations', icon: <Icon name="link" size={20} /> },
  { value: 'admin', label: '관리', href: '#admin', icon: <Icon name="setting" size={20} /> },
];

export const railAreasMax = [
  ...railAreas,
  { value: 'reports', label: '리포트', href: '#reports', icon: <Icon name="document" size={20} /> },
  { value: 'robots', label: '로봇 장비 원격 점검', href: '#robots', icon: <Icon name="layers" size={20} /> },
];

const titles = [
  '지난주 회의록에서 결정 사항만 세 문장으로 정리',
  '장비 점검 로그의 이상 징후 요약',
  'Portal 배포 체크리스트 초안',
  '로봇 주행 경로 재계획 조건 비교',
  '데이터셋 버전별 라벨 분포 차이',
  'Model registry evaluation runs for the October release candidate',
  '고객 문의 응답 템플릿 다듬기',
  '센서 캘리브레이션 절차 확인',
];

export function makeConversationGroups(count = 40) {
  const groupDefs = [
    { id: 'today', label: '오늘' },
    { id: 'yesterday', label: '어제' },
    { id: 'week', label: '지난 7일' },
    { id: 'older', label: '지난 30일' },
  ];
  const groups = groupDefs.map((group) => ({ ...group, items: [] }));
  for (let index = 0; index < count; index += 1) {
    const group = groups[Math.min(groups.length - 1, Math.floor(index / Math.max(1, Math.ceil(count / groups.length))))];
    group.items.push({ id: `c${index + 1}`, title: `${titles[index % titles.length]}${index >= titles.length ? ` ${index + 1}` : ''}`, href: `#c${index + 1}` });
  }
  return groups;
}

export const conversationActions = [
  { id: 'rename', label: '이름 바꾸기', icon: <Icon name="pencil" size={16} /> },
  { id: 'divider', divider: true },
  { id: 'delete', label: '삭제', danger: true, icon: <Icon name="trash" size={16} /> },
];

export function QuestionPanel({ currentId = 'c2', count = 40, conversationProps }) {
  const groups = React.useMemo(() => makeConversationGroups(count), [count]);
  return (
    <ShellPanel
      data-testid="question-panel"
      title="질문"
      actions={<IconButton variant="plain" size="sm" round={false} label="대화 검색"><Icon name="search" size={18} aria-hidden="true" /></IconButton>}
      primaryAction={{ label: '새 질문', icon: <Icon name="plus" size={18} />, href: '#new', onClick: preventNavigation, current: currentId == null }}
      scrollRegion={(
        <ConversationList
          data-testid="question-conversations"
          groups={groups}
          currentId={currentId}
          itemActions={conversationActions}
          renderLink={(item, props) => <a {...props} onClick={preventNavigation} />}
          {...conversationProps}
        />
      )}
    />
  );
}

export function RailAccount() {
  return <UserMenu name="운영자" detail="LK Portal" status="online" collapsed items={[{ label: '내 프로필' }, { label: '계정과 키' }, { divider: true }, { label: '로그아웃', danger: true }]} />;
}

export function RailLogo() {
  return (
    <a href="#home" aria-label="LK ROBOTICS Portal 홈" onClick={preventNavigation} style={{ display: 'inline-flex', borderRadius: 'var(--radius-md)' }}>
      <Lockup variant="mark" tone="ink" height={22} decorative />
    </a>
  );
}
