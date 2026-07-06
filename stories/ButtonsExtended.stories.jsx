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
  title: '컴포넌트/버튼',
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

const ArrowLeftIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ArrowRightIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const UpIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);
const CloseIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const ButtonIconButtonSocialButtonCard = {
  name: 'Button · IconButton · SocialButton card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 540, background: 'var(--bw-paper)', padding: 22, boxSizing: 'border-box' }}>
      <style>
        {`
          [data-visual-crop-root] .lk-btn,
          [data-visual-crop-root] .lk-social-btn {
            letter-spacing: -0.3px !important;
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary">도입 문의</Button>
          <Button variant="secondary">문서 보기</Button>
          <Button variant="signal">제품 보기</Button>
          <Button variant="dark">회사소개</Button>
          <Button variant="flat">자세히 보기</Button>
          <Button variant="ghost">Learn more</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="signal" size="lg">Large CTA</Button>
          <IconButton variant="soft" label="prev">{ArrowLeftIcon}</IconButton>
          <IconButton variant="solid" label="next">{ArrowRightIcon}</IconButton>
          <IconButton variant="ghost" label="close">{CloseIcon}</IconButton>
          <IconButton variant="signal" round label="top">{UpIcon}</IconButton>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SocialButton provider="google" full />
          <SocialButton provider="google" tone="brand" full />
          <SocialButton provider="apple" full />
          <SocialButton provider="apple" tone="brand" full />
          <SocialButton provider="facebook" full />
          <SocialButton provider="facebook" tone="brand" full />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <SocialButton provider="google" iconOnly />
          <SocialButton provider="apple" iconOnly />
          <SocialButton provider="facebook" iconOnly />
          <SocialButton provider="google" iconOnly tone="brand" />
          <SocialButton provider="apple" iconOnly tone="brand" />
          <SocialButton provider="facebook" iconOnly tone="brand" />
        </div>
        <div style={{ background: 'var(--surface-inverse)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="on-dark">Learn more</Button>
          <Button variant="signal">제품 문의</Button>
          <IconButton variant="on-dark" label="prev">{ArrowLeftIcon}</IconButton>
          <IconButton variant="on-dark" round label="next">{ArrowRightIcon}</IconButton>
        </div>
      </div>
    </div>
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
