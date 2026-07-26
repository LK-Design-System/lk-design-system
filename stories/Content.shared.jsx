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
  StatusIndicator,
  StepList,
  Switch,
  Thumbnail,
  Timeline,
  Tooltip,
} from '../src/index.js';

const steps = [
  { id: 'draft', label: '초안 작성', detail: '필수 항목 확인' },
  { id: 'review', label: '검토 요청', detail: '담당자 지정' },
  { id: 'publish', label: '게시 완료', detail: '변경 이력 기록' },
];

const miniMapPreviewSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 236">
    <defs>
      <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#d1dbe5" stroke-width="1"/>
      </pattern>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.12"/>
      </filter>
    </defs>
    <rect width="420" height="236" fill="#eef3f7"/>
    <rect width="420" height="236" fill="url(#grid)" opacity="0.72"/>
    <rect x="32" y="30" width="150" height="70" rx="8" fill="#ffffff" stroke="#aebdca" stroke-width="1.4"/>
    <rect x="236" y="38" width="120" height="50" rx="8" fill="#ffffff" stroke="#b8c5d1" stroke-width="1.3" opacity="0.92"/>
    <rect x="74" y="142" width="218" height="58" rx="8" fill="#ffffff" stroke="#b8c5d1" stroke-width="1.3" opacity="0.9"/>
    <path d="M66 174 C120 132 150 134 190 154 S274 185 342 78" fill="none" stroke="#bfd6ee" stroke-width="18" stroke-linecap="round"/>
    <path d="M66 174 C120 132 150 134 190 154 S274 185 342 78" fill="none" stroke="#1769aa" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <circle cx="66" cy="174" r="9" fill="#1d8f5f" stroke="#ffffff" stroke-width="4" filter="url(#shadow)"/>
    <circle cx="190" cy="154" r="7" fill="#d39b23" stroke="#ffffff" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="342" cy="78" r="9" fill="#1769aa" stroke="#ffffff" stroke-width="4" filter="url(#shadow)"/>
    <g filter="url(#shadow)">
      <rect x="14" y="190" width="94" height="28" rx="14" fill="#ffffff" fill-opacity="0.88"/>
      <circle cx="31" cy="204" r="4" fill="#1d8f5f"/>
      <text x="42" y="208" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#182234">Preview</text>
    </g>
  </svg>
`)}`;

export const TextAndDisclosure = {
  name: '텍스트와 디스클로저',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <Overline tone="signal">콘텐츠 가이드</Overline>
        <Blockquote cite="문서 가이드">
          문서 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.
        </Blockquote>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <ContentBadge>NEW</ContentBadge>
          <ContentBadge tone="positive">정상</ContentBadge>
          <ContentBadge tone="negative" variant="outline">주의</ContentBadge>
          <StatusIndicator tone="online" pulse>실시간 연결</StatusIndicator>
          <SourceTag href="#">Design System</SourceTag>
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
        <Code block>pnpm run check:contracts</Code>
      </Collapsible>
    </main>
  ),
};

export const SourceTagCard = {
  name: 'SourceTag card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <SourceTag href="#">Design System</SourceTag>
        <SourceTag label="사양" href="#">Component spec v2.4</SourceTag>
        <SourceTag>검증 자료</SourceTag>
      </div>
    </div>
  ),
};

export const ContentBadgeStatusBadgeCard = {
  name: 'ContentBadge · StatusBadge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 720, height: 150, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <ContentBadge color="accent" variant="solid" leading={<Icon name="android" />}>Android</ContentBadge>
        <ContentBadge color="accent" leading={<Icon name="apple" />}>iOS</ContentBadge>
        <ContentBadge color="accent" variant="outlined" leading={<Icon name="globe" />}>Web</ContentBadge>
        <ContentBadge color="neutral" size="xsmall">텍스트</ContentBadge>
        <ContentBadge color="accent" size="medium" trailing={<Icon name="square" />}>텍스트</ContentBadge>
        <StatusBadge tone="positive">가동중 3대</StatusBadge>
        <StatusBadge tone="warning">점검 중</StatusBadge>
        <StatusBadge tone="offline">오프라인</StatusBadge>
      </div>
    </div>
  ),
};

export const ListsAndMedia = {
  name: '리스트와 미디어',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980, minWidth: 0 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-5)', minWidth: 0 }}>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
          <ListCell leading={<Icon name="document" size={18} />} title="디자인 토큰" description="검토 요청됨" trailing={<StatusBadge tone="signal">검토</StatusBadge>} onClick={() => {}} divider />
          <ListCell leading={<Icon name="layers" size={18} />} title="컴포넌트 문서" description="업데이트 완료" trailing={<Kbd>⌘ K</Kbd>} onClick={() => {}} divider />
          <ListCell leading={<Icon name="bell" size={18} />} title="알림 3건" description="확인 필요한 변경 사항" trailing={<Icon name="chevron-right" size={18} />} onClick={() => {}} />
        </div>

        <Thumbnail
          src={miniMapPreviewSrc}
          alt="문서 미리보기"
          ratio={16 / 9}
          overlay={<ContentBadge tone="navy">LIVE</ContentBadge>}
          overlayAlign="top-right"
        />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', minWidth: 0 }}>
        <StepList steps={steps} editable={false} />
        <Timeline
          items={[
            { time: '09:12', title: '검토 시작', description: '초안이 담당자에게 전달됨', tone: 'signal' },
            { time: '09:18', title: '수정 요청', description: '설명 문구 보완 필요', tone: 'cautionary' },
            { time: '09:26', title: '게시 완료', description: '변경 이력 기록', tone: 'positive' },
          ]}
        />
      </section>

      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Bubble>검토 코멘트</Bubble>
        <Tooltip content="툴팁은 hover/focus에서 표시됩니다.">
          <button type="button" style={{ height: 40, padding: '0 var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}>
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
      <span style={{ background: 'var(--material-dimmer)', color: 'var(--color-semantic-inverse-label)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
        {label}
      </span>
    );
    return (
      <div data-visual-crop-root style={{ width: 700, height: 220, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Thumbnail ratio="1/1" overlay={overlay('1:1')} />
          <Thumbnail ratio="16/9" border overlay={overlay('16:9')} overlayAlign="bottom-right" />
          <Thumbnail ratio="4/3" radius={false} border overlay={overlay('square')} />
        </div>
      </div>
    );
  },
};

export const TooltipBubbleBookmarkDividerCard = {
  name: 'Tooltip · Bubble · Bookmark · Divider card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 760, height: 150, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Tooltip content="상세 도움말"><IconButton variant="ghost" label="info"><Icon name="circle-info" size={20} /></IconButton></Tooltip>
        <Bubble tone="navy" tail="left">선택 항목 설명</Bubble>
        <Bookmark defaultActive />
        <Bookmark />
        <span style={{ color: 'var(--color-semantic-label-alternative)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>문서</span>
        <Divider vertical />
        <span style={{ color: 'var(--color-semantic-label-alternative)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>국방·보안</span>
      </div>
    </div>
  ),
};

export const ListCellAccordionCard = {
  name: 'ListCell · Accordion card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 380, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', padding: '8px 16px', width: 340 }}>
          <ListCell leading={<Icon name="document" />} title="컴포넌트 검토 기록" description="2026.06.30 · PDF" chevron onClick={() => {}} divider selected />
          <ListCell leading={<Icon name="bell" />} title="실시간 알림" trailing={<Switch defaultChecked size="sm" aria-label="실시간 알림" />} interaction="hovered" />
        </div>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', padding: '0 16px', width: 340 }}>
          <Accordion
            defaultOpen={[0]}
            items={[
              { title: '검토 기간은?', content: '초안 등록 후 평균 2일 내 확인합니다.' },
              { title: '변경 이력은?', content: '게시 시점마다 요약과 담당자를 남깁니다.' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
