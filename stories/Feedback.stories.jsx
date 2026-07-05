import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Icon,
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
