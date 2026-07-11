import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Icon,
  IconButton,
  Notification,
  PushBadge,
  Rating,
  Tag,
} from '../src/index.js';

export const IdentityAndBadges = {
  name: '아이덴티티와 배지',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar name="LK" status="online" />
        <Avatar name="운영자" size={40} status="busy" />
        <AvatarGroup
          items={[
            { name: '김운영' },
            { name: '박관리' },
            { name: '이문서' },
            { name: '최품질' },
            { name: '정품질' },
          ]}
        />
      </section>

      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge>12</Badge>
        <Badge tone="amber">검토</Badge>
        <Badge tone="red" dot>주의</Badge>
        <Chip selected>선택된 필터</Chip>
        <Chip as="a" href="#">링크 칩</Chip>
        <Tag>SYSTEM</Tag>
        <Tag tone="amber" solid>주의</Tag>
        <PushBadge count={7}>
          <span style={{ display: 'inline-flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
            <Icon name="bell" />
          </span>
        </PushBadge>
      </section>
    </main>
  ),
};

export const AvatarCard = {
  name: 'Avatar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Avatar name="LK" size={40} status="online" />
        <Avatar name="Han Kim" size={40} />
        <Avatar name="SS AI" size={40} status="busy" />
        <Avatar name="대전 본사" size={40} status="offline" />
      </div>
    </div>
  ),
};

export const AvatarGroupCard = {
  name: 'AvatarGroup card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <AvatarGroup max={4} items={[{ name: '김' }, { name: '이' }, { name: '박' }, { name: '최' }, { name: '정' }, { name: '한' }]} />
    </div>
  ),
};

export const BadgeCard = {
  name: 'Badge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Badge tone="signal">3</Badge>
        <Badge tone="navy">12</Badge>
        <Badge tone="red">!</Badge>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'var(--color-semantic-label-alternative)' }}>
          <Badge tone="signal" dot /> 활성
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'var(--color-semantic-label-alternative)' }}>
          <Badge tone="red" dot /> 검토 필요
        </span>
      </div>
    </div>
  ),
};

export const ChipCard = {
  name: 'Chip card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Chip>문서</Chip>
        <Chip>컴포넌트</Chip>
        <Chip selected>토큰</Chip>
        <Chip as="a" href="#">Button</Chip>
        <Chip as="a" href="#">Input</Chip>
      </div>
    </div>
  ),
};

export const PushBadgeCard = {
  name: 'PushBadge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 140, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
        <PushBadge count={5}><IconButton variant="ghost" label="alerts"><Icon name="bell" /></IconButton></PushBadge>
        <PushBadge count={128} max={99}><IconButton variant="ghost" label="mail"><Icon name="mail" /></IconButton></PushBadge>
        <PushBadge dot tone="signal"><IconButton variant="ghost" label="home"><Icon name="home" /></IconButton></PushBadge>
      </div>
    </div>
  ),
};

export const RatingCard = {
  name: 'Rating card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 300, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
        <Rating defaultValue={4} />
        <Rating value={5} readOnly size={16} />
      </div>
    </div>
  ),
};

export const TagCard = {
  name: 'Tag card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Tag tone="signal">Products</Tag>
        <Tag tone="neutral">Technology</Tag>
        <Tag tone="steel">R&amp;D</Tag>
        <Tag tone="amber">CES 2026</Tag>
        <Tag tone="signal" solid>NEW</Tag>
      </div>
    </div>
  ),
};

export const NotificationsAndRating = {
  name: '알림과 평점',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Notification
          unread
          icon={<Icon name="triangle-exclamation" />}
          title="검토 필요"
          description="게시 전 확인해야 할 항목이 있습니다."
          time="2분 전"
        />
        <Notification
          icon={<Icon name="circle-check" />}
          title="검토 완료"
          description="컴포넌트 변경 요약이 생성되었습니다."
          time="18분 전"
        />
      </div>
      <Rating defaultValue={4} />
      <Rating value={3} readOnly size={18} />
    </main>
  ),
};
