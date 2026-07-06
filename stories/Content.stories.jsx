import React from 'react';
import {
  Accordion,
  Blockquote,
  Bookmark,
  Bubble,
  Code,
  Collapsible,
  ContentBadge,
  Divider,
  Icon,
  IconButton,
  Kbd,
  ListCell,
  Overline,
  SourceTag,
  StatusBadge,
  StepList,
  Switch,
  Thumbnail,
  Timeline,
  Tooltip,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/콘텐츠',
  parameters: {
    docs: {
      description: {
        component: '문서, 리스트, 배지, 주석, 단계 표시처럼 콘텐츠 밀도를 다루는 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

const steps = [
  { id: 'map', label: '지도 로드', detail: '최신 맵 버전 확인' },
  { id: 'route', label: '경로 생성', detail: '웨이포인트 12개' },
  { id: 'dispatch', label: '미션 배포', detail: 'AMR-07 대상' },
];

export const TextAndDisclosure = {
  name: '텍스트와 디스클로저',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <Overline tone="signal">MISSION GUIDE</Overline>
        <Blockquote cite="운영 가이드">
          운영 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.
        </Blockquote>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <ContentBadge>NEW</ContentBadge>
          <ContentBadge tone="positive">정상</ContentBadge>
          <ContentBadge tone="negative" variant="outline">주의</ContentBadge>
          <StatusBadge tone="online" pulse>실시간 연결</StatusBadge>
          <SourceTag href="https://www.lkrobotics.co.kr/">LK ROBOTICS</SourceTag>
          <Bookmark defaultActive />
        </div>
      </section>

      <Accordion
        defaultOpen={[0]}
        items={[
          { title: '토큰을 왜 먼저 봐야 하나요?', content: '색상, 간격, 모션은 컴포넌트보다 먼저 공유되는 기준입니다.' },
          { title: '컴포넌트는 어떻게 검증하나요?', content: 'Storybook에서 상태별로 렌더링하고 실제 예시 화면에서 조합을 확인합니다.' },
        ]}
      />
      <Collapsible title="상세 로그" defaultOpen>
        <Code block>ros2 topic echo /fleet/status --once</Code>
      </Collapsible>
    </main>
  ),
};

export const SourceTagCard = {
  name: 'SourceTag card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <SourceTag href="#">The Robot Report</SourceTag>
        <SourceTag label="사양" href="#">LKR-T1 데이터시트 v2.4</SourceTag>
        <SourceTag>사내 검증 자료</SourceTag>
      </div>
    </div>
  ),
};

export const ContentBadgeStatusBadgeCard = {
  name: 'ContentBadge · StatusBadge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 720, height: 150, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <ContentBadge tone="signal" variant="solid">NEW</ContentBadge>
        <ContentBadge tone="positive" variant="soft">가동중</ContentBadge>
        <ContentBadge tone="cautionary" variant="outline">점검 예정</ContentBadge>
        <StatusBadge tone="positive" pulse>가동중 3대</StatusBadge>
        <StatusBadge tone="warning">점검 중</StatusBadge>
        <StatusBadge tone="offline">오프라인</StatusBadge>
      </div>
    </div>
  ),
};

export const ListsAndMedia = {
  name: '리스트와 미디어',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(260px, 1fr)', gap: 'var(--space-5)' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
          <ListCell leading={<Icon name="robot" size={18} />} title="AMR-07" description="순찰 미션 진행 중" trailing={<StatusBadge tone="online">온라인</StatusBadge>} onClick={() => {}} divider />
          <ListCell leading={<Icon name="map" size={18} />} title="대덕 연구소 2F" description="지도 동기화 완료" trailing={<Kbd>⌘ K</Kbd>} onClick={() => {}} divider />
          <ListCell leading={<Icon name="bell" size={18} />} title="알림 3건" description="확인 필요한 이벤트" trailing={<Icon name="chevron-right" size={18} />} onClick={() => {}} />
        </div>

        <Thumbnail
          ratio={16 / 9}
          overlay={<ContentBadge tone="navy">LIVE</ContentBadge>}
          overlayAlign="top-right"
        >
          <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', color: 'var(--label-alternative)', background: 'linear-gradient(135deg, #d9e2ec, #eef3f8)' }}>
            map preview
          </div>
        </Thumbnail>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 360px) 1fr', gap: 'var(--space-5)', alignItems: 'start' }}>
        <StepList steps={steps} editable={false} />
        <Timeline
          items={[
            { time: '09:12', title: '미션 시작', description: '대기열에서 AMR-07 할당', tone: 'signal' },
            { time: '09:18', title: '경로 재계산', description: '장애물 감지 후 우회', tone: 'cautionary' },
            { time: '09:26', title: '미션 완료', description: '보고서 생성', tone: 'positive' },
          ]}
        />
      </section>

      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Bubble>운영자 코멘트</Bubble>
        <Tooltip content="툴팁은 hover/focus에서 표시됩니다.">
          <button type="button" style={{ height: 40, padding: '0 var(--space-4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            툴팁 트리거
          </button>
        </Tooltip>
        <Divider label="또는" style={{ flex: 1, minWidth: 220 }} />
      </section>
    </main>
  ),
};

export const ThumbnailCard = {
  name: 'Thumbnail card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const overlay = (label) => (
      <span style={{ background: 'rgba(8,11,28,0.72)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
        {label}
      </span>
    );
    return (
      <div data-visual-crop-root style={{ width: 700, height: 220, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Thumbnail ratio={1} overlay={overlay('1:1')} />
          <Thumbnail ratio={16 / 9} overlay={overlay('16:9')} overlayAlign="bottom-right" />
          <Thumbnail ratio={4 / 3} radius={false} overlay={overlay('square')} />
        </div>
      </div>
    );
  },
};

export const TooltipBubbleBookmarkDividerCard = {
  name: 'Tooltip · Bubble · Bookmark · Divider card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 760, height: 150, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Tooltip content="EO/IR 영상처리"><IconButton variant="ghost" label="info"><Icon name="circle-info" size={20} /></IconButton></Tooltip>
        <Bubble tone="navy" tail="left">실시간 순찰 경로 표시</Bubble>
        <Bookmark defaultActive />
        <Bookmark />
        <span style={{ color: 'var(--label-alternative)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>시설관리</span>
        <Divider vertical />
        <span style={{ color: 'var(--label-alternative)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>국방·보안</span>
      </div>
    </div>
  ),
};

export const ListCellAccordionCard = {
  name: 'ListCell · Accordion card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 380, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', padding: '8px 16px', width: 340 }}>
          <ListCell leading={<Icon name="document" />} title="현장 실사 보고서" description="2026.06.30 · PDF" trailing={<Icon name="chevron-right" />} onClick={() => {}} divider />
          <ListCell leading={<Icon name="bell" />} title="실시간 알림" trailing={<Switch defaultChecked size="sm" />} />
        </div>
        <div style={{ background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', padding: '0 16px', width: 340 }}>
          <Accordion
            defaultOpen={[0]}
            items={[
              { title: '설치 기간은?', content: '현장 실사 후 평균 2–4주 내 배치됩니다.' },
              { title: '관제 연동은?', content: 'LKR-SSAI 관제 시스템에 표준 연동됩니다.' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
