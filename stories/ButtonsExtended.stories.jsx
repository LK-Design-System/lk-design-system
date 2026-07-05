import React from 'react';
import {
  Button,
  ButtonGroup,
  CopyButton,
  Fab,
  Icon,
  IconButton,
  Link,
  SocialButton,
  SplitButton,
  TextButton,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/버튼 상세',
  parameters: {
    docs: {
      description: {
        component: 'Button 외에 액션 계열로 함께 제공되는 컨트롤 전체입니다.',
      },
    },
  },
};

export default meta;

export const ActionControls = {
  name: '액션 컨트롤 전체',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <ButtonGroup options={['자동', '수동', '점검']} defaultValue="자동" />
        <CopyButton value="mission-2026-0705">미션 ID 복사</CopyButton>
        <SplitButton
          items={[
            { label: '초안으로 저장', icon: <Icon name="document" size={16} /> },
            { label: '예약 실행', icon: <Icon name="calendar" size={16} /> },
          ]}
        >
          배포
        </SplitButton>
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <IconButton label="검색">
          <Icon name="search" size={19} />
        </IconButton>
        <IconButton label="설정" variant="solid">
          <Icon name="setting" size={19} />
        </IconButton>
        <IconButton label="알림" variant="signal" round>
          <Icon name="bell" size={19} />
        </IconButton>
        <TextButton>텍스트 액션</TextButton>
        <TextButton tone="danger">삭제</TextButton>
        <Link href="https://www.lkrobotics.co.kr/" external>
          회사 사이트
        </Link>
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Fab label="미션 추가" variant="signal">
          <Icon name="plus" size={24} />
        </Fab>
        <Fab label="지도 보기" variant="white">
          <Icon name="map" size={24} />
        </Fab>
      </section>
    </main>
  ),
};

export const SocialLoginControls = {
  name: '소셜 로그인 버튼',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 460 }}>
      <SocialButton provider="google" full />
      <SocialButton provider="apple" full />
      <SocialButton provider="facebook" tone="brand" full />
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <SocialButton provider="google" iconOnly />
        <SocialButton provider="apple" iconOnly />
        <SocialButton provider="facebook" iconOnly tone="brand" />
      </div>
    </main>
  ),
};
