import React from 'react';
import { Banner, Button, Callout, Icon } from '../src/index.js';
import { BannerCard as BannerCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Feedback/Notices and Callouts',
  parameters: {
    docs: {
      description: {
        component: '배너와 콜아웃처럼 화면 흐름 안에서 시스템 상태, 주의, 안내를 전달하는 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const NoticesAndCallouts = {
  name: '알림과 안내',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 820 }}>
      <Banner tone="info" title="데이터 동기화 진행 중" action={<Button size="sm" variant="ghost">상세 보기</Button>}>
        최신 데이터를 불러오고 있습니다. 동기화가 끝나면 편집을 다시 시작할 수 있습니다.
      </Banner>
      <Banner tone="success" title="변경 사항 저장 완료" onClose={() => {}}>
        게시 전 검토할 초안이 저장되었습니다.
      </Banner>
      <Callout tone="cautionary" title="필수 항목 확인" icon={<Icon name="triangle-exclamation" />}>
        저장 전 필수 입력값을 확인합니다.
      </Callout>
      <Callout tone="negative" title="권한 제한" icon={<Icon name="lock" />}>
        현재 권한에서는 이 작업을 시작할 수 없습니다. 관리자 승인이 필요합니다.
      </Callout>
    </main>
  ),
};

export const BannerCard = { ...BannerCardStory, name: 'Banner card parity', tags: ['!dev', 'visual-parity'] };
