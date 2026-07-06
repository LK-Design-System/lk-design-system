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

const meta = {
  title: '컴포넌트/피드백',
  parameters: {
    docs: {
      description: {
        component: '아바타, 배지, 알림, 평가처럼 사용자에게 상태를 돌려주는 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const IdentityAndBadges = {
  name: '아이덴티티와 배지',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar name="LK ROBOTICS" status="online" />
        <Avatar name="운영자" size={40} status="busy" />
        <AvatarGroup
          items={[
            { name: '김운영' },
            { name: '박관제' },
            { name: '이지도' },
            { name: '최로봇' },
            { name: '정품질' },
          ]}
        />
      </section>

      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge>12</Badge>
        <Badge tone="amber">점검</Badge>
        <Badge tone="red" dot>장애</Badge>
        <Chip selected>선택된 필터</Chip>
        <Chip as="a" href="#">링크 칩</Chip>
        <Tag>ROBOTICS</Tag>
        <Tag tone="amber" solid>주의</Tag>
        <PushBadge count={7}>
          <span style={{ display: 'inline-flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
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
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
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
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <AvatarGroup max={4} items={[{ name: '김' }, { name: '이' }, { name: '박' }, { name: '최' }, { name: '정' }, { name: '한' }]} />
    </div>
  ),
};

export const BadgeCard = {
  name: 'Badge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Badge tone="signal">3</Badge>
        <Badge tone="navy">12</Badge>
        <Badge tone="red">!</Badge>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'var(--bw-gray)' }}>
          <Badge tone="signal" dot /> 운영중
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'var(--bw-gray)' }}>
          <Badge tone="red" dot /> 점검 필요
        </span>
      </div>
    </div>
  ),
};

export const ChipCard = {
  name: 'Chip card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Chip>자율주행</Chip>
        <Chip>비전 AI</Chip>
        <Chip selected>EO/IR</Chip>
        <Chip as="a" href="#">LKR-CP</Chip>
        <Chip as="a" href="#">LKR-SSAI</Chip>
      </div>
    </div>
  ),
};

export const PushBadgeCard = {
  name: 'PushBadge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 140, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
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
    <div data-visual-crop-root style={{ width: 300, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
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
    <div data-visual-crop-root style={{ width: 420, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
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
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Notification
          unread
          icon={<Icon name="triangle-exclamation" />}
          title="충전 스테이션 점검 필요"
          description="Docking-03의 연결 상태가 약합니다."
          time="2분 전"
        />
        <Notification
          icon={<Icon name="circle-check" />}
          title="미션 완료"
          description="AMR-07 순찰 미션 보고서가 생성되었습니다."
          time="18분 전"
        />
      </div>
      <Rating defaultValue={4} />
      <Rating value={3} readOnly size={18} />
    </main>
  ),
};
