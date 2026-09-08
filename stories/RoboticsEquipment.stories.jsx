import React from 'react';
import { userEvent } from 'storybook/test';
import {
  Button,
  ConnectionBadge,
  EquipmentStatusCard,
  Icon,
  StatusBadge,
} from '../src/index.js';
import { EquipmentStatusCardCard as EquipmentStatusCardCardStory } from './ProductEditorAndViz.shared.jsx';

const meta = {
  title: 'LDS Product/Status/Equipment State',
  tags: ['autodocs'],
  component: EquipmentStatusCard,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-status-equipment-state--equipment-state',
      eyebrow: 'Product / Equipment State',
      title: '설비 상태 카드는 주변 인프라의 가용성을 알립니다',
      description:
        '제품 운영에 필요한 장비의 identity와 대표 상태를 먼저 읽고 이동·위치·연결 같은 보조 사실을 비교할 때 사용합니다. 실시간 telemetry 스트림이나 지도 위 마커에는 더 구체적인 표현을 사용하세요.',
    },
    docs: {
      description: {
        component: '제품 화면에 종속되지 않고 장비 identity, 대표 상태, 라벨이 있는 사실과 후속 동작을 묶는 EquipmentStatusCard 패턴입니다. 장비 한 대의 identity와 상태 요약 카드에 적합하며, 실시간 telemetry 스트림이나 지도 위 마커에는 사용하지 마세요.',
      },
    },
  },
};

export default meta;

export const EquipmentState = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          '엘리베이터와 게이트웨이를 같은 범용 anatomy로 표현합니다. 제목→보이는 상태 라벨→key/value facts→meta/action 순서와 ConnectionBadge 조합을 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 640, minWidth: 0 }}>
      <EquipmentStatusCard
        headingLevel={2}
        icon={<Icon name="home" size={24} />}
        title="화물 엘리베이터 2호기"
        description="물류동 동측"
        status="운행 중"
        statusTone="positive"
        details={[
          { label: '이동', value: <><Icon name="arrow-up" size={16} aria-hidden="true" /> 상승 중</> },
          { label: '층', value: '3층' },
        ]}
        meta="30초 전에 갱신"
      />
      <EquipmentStatusCard
        headingLevel={2}
        icon={<Icon name="signal" size={24} />}
        title="옥상 게이트웨이"
        description="로봇 네트워크 중계 장비"
        status="주의 필요"
        statusTone="cautionary"
        details={[
          { label: '연결', value: <ConnectionBadge status="reconnecting" size="sm" /> },
          { label: '구역', value: '옥상 서측' },
        ]}
        actions={<Button type="button" size="sm" variant="ghost">상세 보기</Button>}
      />
    </main>
  ),
};

export const FacilityEquipment = {
  name: '사용법 · 승강기·자동문·계단 리프트',
  parameters: {
    docs: {
      description: {
        story:
          '위치 값이 대표 정보인 세 설비를 같은 카드로 조합합니다. readout이 상태 라벨 뒤·facts 앞에 오고, 방향은 정적 glyph와 텍스트로, 문 열기 명령은 actions로 표현되는지 확인하세요. 명령 전송과 낙관적 표시는 제품이 소유합니다.',
      },
    },
  },
  render: () => <FacilityEquipmentFixture />,
  play: async ({ canvasElement }) => {
    const elevator = canvasElement.querySelector('[data-testid="facility-elevator"]');
    const readout = elevator?.querySelector('[data-equipment-readout]');
    const status = elevator?.querySelector('header');
    const details = elevator?.querySelector('dl');
    if (!elevator || !readout || !status || !details || readout.textContent?.replace(/\s+/g, '') !== '3F현재층') {
      throw new Error('The elevator card must expose the floor readout with its caption.');
    }
    if (!(status.compareDocumentPosition(readout) & Node.DOCUMENT_POSITION_FOLLOWING) || !(readout.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('The readout must read after the status header and before the facts.');
    }
    const doorReadout = canvasElement.querySelector('[data-testid="facility-door"] [data-equipment-readout]');
    if (doorReadout?.getAttribute('data-equipment-readout-tone') !== 'negative' || readout.getAttribute('data-equipment-readout-tone') !== 'offline') {
      throw new Error('readoutTone must resolve to the semantic tone while neutral keeps the strong ink.');
    }
    const open = [...canvasElement.querySelectorAll('[data-testid="facility-door"] button')].find((button) => button.textContent?.trim() === '문 열기');
    if (!open) throw new Error('The door card must expose the open command as a real button.');
    await userEvent.click(open);
    if (canvasElement.querySelector('[data-testid="door-request"]')?.textContent !== '열기 요청 전송') {
      throw new Error('The open command must delegate to the product callback.');
    }
    const fixture = canvasElement.querySelector('[data-testid="facility-fixture"]');
    if (fixture.scrollWidth > fixture.clientWidth + 1) throw new Error('Facility cards must not overflow their grid.');
  },
};

export const ResponsiveHierarchy = {
  name: '반응형 · 다크 · 긴 콘텐츠',
  parameters: {
    docs: {
      description: {
        story:
          '보통 폭의 계단 리프트와 300px 다크 영역의 긴 게이트 이름/상태를 비교합니다. narrow에서도 상태가 identity 뒤에 오고 facts와 footer가 잘리지 않는지 확인하세요.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760, minWidth: 0 }}>
      <section aria-label="보통 폭 장비 상태" style={{ maxWidth: 640 }}>
        <EquipmentStatusCard
          headingLevel={2}
          icon={<Icon name="setting" size={24} />}
          title="계단 리프트 A"
          description="본관 1층–2층"
          status="정기 점검 중"
          statusTone="cautionary"
          details={[
            { label: '운행', value: '일시 중지' },
            { label: '점검 종료', value: '오늘 16:00' },
            { label: '담당', value: '시설 운영팀' },
          ]}
          meta="10분 전에 갱신"
        />
      </section>

      <section
        data-theme="dark"
        aria-label="좁은 다크 영역의 긴 장비 상태"
        style={{ width: 300, maxWidth: '100%', padding: 'var(--space-4)', boxSizing: 'border-box', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)' }}
      >
        <EquipmentStatusCard
          headingLevel={2}
          icon={<Icon name="lock" size={24} />}
          title="북측 연구동 물류 차량 출입 게이트 12번 원격 제어 장치"
          description="야외 배송 동선과 연결된 원격 출입 설비"
          status="센서 응답을 확인해야 함"
          statusTone="negative"
          details={[
            { label: '연결', value: <ConnectionBadge status="offline" size="sm" /> },
            { label: '마지막 응답', value: '12분 전' },
          ]}
          meta="현장 확인 필요"
          actions={<Button type="button" size="sm" variant="ghost">이력 보기</Button>}
        />
      </section>
    </div>
  ),
};

function FacilityEquipmentFixture() {
  const [doorRequest, setDoorRequest] = React.useState('요청 없음');
  return (
    <main data-testid="facility-fixture" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 880, minWidth: 0 }}>
      <EquipmentStatusCard
        data-testid="facility-elevator"
        headingLevel={2}
        icon={<Icon name="home" size={24} />}
        title="승강기 1호기"
        description="본관 동측"
        status="운행 중"
        statusTone="positive"
        readout="3F"
        readoutLabel="현재 층"
        details={[
          { label: '이동', value: <><Icon name="chevron-up-small" size={16} aria-hidden="true" /> 상승 중</> },
          { label: '문', value: '닫힘' },
        ]}
        meta="5초 전에 갱신"
      />
      <EquipmentStatusCard
        data-testid="facility-door"
        headingLevel={2}
        icon={<Icon name="lock-open" size={24} />}
        title="자동문 · 정문"
        description="로봇 순찰 동선"
        status="닫힘 · 잠금 해제"
        statusTone="neutral"
        readout="CLOSE"
        readoutLabel="문 위치"
        readoutTone="negative"
        details={[
          { label: '잠금', value: <StatusBadge tone="positive">해제</StatusBadge> },
          { label: '마지막 통과', value: '10:42' },
        ]}
        actions={<Button type="button" size="sm" variant="outlined" color="assistive" onClick={() => setDoorRequest('열기 요청 전송')}>문 열기</Button>}
      />
      <EquipmentStatusCard
        data-testid="facility-lift"
        headingLevel={2}
        icon={<Icon name="setting" size={24} />}
        title="계단 리프트"
        description="본관 1층–2층"
        status="상행 중"
        statusTone="signal"
        readout="BOTTOM"
        readoutLabel="위치"
        readoutTone="signal"
        details={[
          { label: '운행', value: <><Icon name="chevron-up-small" size={16} aria-hidden="true" /> 상행</> },
          { label: '잠금', value: <StatusBadge tone="negative">잠김</StatusBadge> },
        ]}
      />
      <p data-testid="door-request" role="status" style={{ gridColumn: '1 / -1', margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{doorRequest}</p>
    </main>
  );
}

export const EquipmentStatusCardCard = { ...EquipmentStatusCardCardStory, name: 'EquipmentStatusCard card parity', tags: ['!dev', 'visual-parity'] };
