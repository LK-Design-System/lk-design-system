import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  AlarmCaseBanner,
  Button,
  ConfirmDialog,
  Textarea,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Status/Alarm Case',
  tags: ['autodocs'],
  component: AlarmCaseBanner,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-status-alarm-case--case-overview',
      eyebrow: 'Product / Status / Alarm Case',
      title: '운영자가 알람 한 건의 상태·처리 기록·다음 행동을 몇 초 안에 판단합니다',
      description:
        '화재·쓰러짐·가스 임계치처럼 누군가 처리할 때까지 남아야 하는 알람 사례에 적합합니다. 한 문장짜리 공지는 Banner, 일시적 피드백은 Toast, 대상의 현재 상태 요약은 Equipment Status Card를 사용하세요.',
    },
    docs: {
      description: {
        component:
          '심각도·lifecycle·신선도·연결·권한을 별도 축으로 보여 주고, 영속된 확인 기록(처리자·시각·사유·권한)을 표시하며, 확인 action을 원격 명령과 분리하는 AlarmCaseBanner 패턴입니다. 알람 진실과 전이, 기록 저장, 사이렌, 원격 전송은 제품이 소유합니다.',
      },
    },
  },
};

export default meta;

const OCCURRED = '2026-09-09T11:14:31+09:00';
const RECORD = { actor: '관제사 김하늘', at: '11:15:02', reason: '현장 확인 요청 완료, 소화기 이동', authority: 'ADMIN' };

const list = (children, width) => (
  <main data-testid="alarm-list" style={{ display: 'grid', gap: 'var(--space-3)', width: width ?? '100%', maxWidth: width ? '100%' : 760, minWidth: 0 }}>
    {children}
  </main>
);

export const CaseOverview = {
  name: '개요',
  parameters: storyDescription(
    '미확인 화재 사례, 영속 기록이 있는 확인된 사례, 기록 없이 확인된 사례가 한 목록에 있는 상황입니다. 미확인 사례만 alert로 알려지고, 기록이 없는 사례는 기록 없음이 그대로 드러나며, 확인 button이 미확인 사례에만 있는지 확인하세요.',
  ),
  render: () =>
    list(
      <>
        <AlarmCaseBanner data-testid="case-active" title="화재 감지로 정지" target="순찰 로봇 2호" location="서오릉 1층 전시실" occurredAt={OCCURRED} occurredLabel="11:14:31 · 40초 전" reference="alert-1842" onAcknowledge={() => {}} remoteAction={<Button size="sm" variant="secondary" disabled>순찰 재개</Button>} />
        <AlarmCaseBanner data-testid="case-recorded" lifecycle="acknowledged" title="쓰러짐 감지로 정지" target="순찰 로봇 1호" location="서오릉 2층 복도" occurredAt="2026-09-09T11:02:10+09:00" occurredLabel="11:02:10 · 13분 전" reference="alert-1839" evidence={RECORD} remoteAction={<Button size="sm" variant="secondary">순찰 재개</Button>} />
        <AlarmCaseBanner data-testid="case-missing" lifecycle="acknowledged" severity="warning" title="가스 경고 임계치 초과" target="순찰 로봇 3호" occurredAt="2026-09-09T10:48:00+09:00" occurredLabel="10:48:00 · 27분 전" reference="gas-77" />
      </>,
    ),
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelector('[data-testid="case-active"]');
    const recorded = canvasElement.querySelector('[data-testid="case-recorded"]');
    const missing = canvasElement.querySelector('[data-testid="case-missing"]');
    if (!active || !recorded || !missing) throw new Error('All three cases must render.');
    const alert = active.querySelector('[role="alert"]');
    if (!alert?.textContent?.includes('화재 감지로 정지') || !alert.textContent.includes('순찰 로봇 2호')) {
      throw new Error('An active case must announce its title and target through an alert live region.');
    }
    if (recorded.querySelector('[role="alert"]') || !recorded.querySelector('[role="status"]')) {
      throw new Error('A non-active case must use a polite status announcement, not an alert.');
    }
    if (!active.querySelector('[data-alarm-action="acknowledge"]') || recorded.querySelector('[data-alarm-action="acknowledge"]')) {
      throw new Error('The acknowledge action must exist only while the case is active.');
    }
    if (recorded.dataset.evidence !== 'recorded' || !recorded.querySelector('[data-evidence-field="actor"] dd')?.textContent?.includes('김하늘')) {
      throw new Error('A recorded acknowledgement must list the actor, time, reason and authority.');
    }
    if (missing.dataset.evidence !== 'missing' || missing.querySelectorAll('[data-evidence-field][data-missing]').length !== 4) {
      throw new Error('An acknowledgement without a persisted record must mark every evidence field missing.');
    }
    const heading = active.querySelector('h3');
    if (!heading || active.getAttribute('aria-labelledby') !== heading.id) throw new Error('The section must be labelled by its heading.');
    if (active.querySelector('[data-slot="remote"]')?.textContent?.includes('원격 명령') !== true) throw new Error('The remote command group must carry its own label.');
  },
};

export const AxesAndStates = {
  name: '변형·상태 · 권한·연결·신선도·보류·해제',
  parameters: storyDescription(
    '확인 권한이 없는 사용자, 연결이 끊기고 정보가 오래된 사례, 같은 유형이 접힌 사례, 상위 보고·보류·해제된 사례입니다. 각 축이 텍스트 배지로 따로 읽히고, 권한 없음은 사례를 숨기지 않고 확인 button만 사유와 함께 막는지 확인하세요.',
  ),
  render: () =>
    list(
      <>
        <AlarmCaseBanner data-testid="case-view-only" title="화재 감지로 정지" target="순찰 로봇 2호" occurredAt={OCCURRED} occurredLabel="11:14:31" authority="view-only" onAcknowledge={() => {}} />
        <AlarmCaseBanner data-testid="case-offline" title="쓰러짐 감지로 정지" target="순찰 로봇 1호" occurredAt={OCCURRED} occurredLabel="11:10:05 · 4분 전" stale link="offline" relatedCount={2} onAcknowledge={() => {}} remoteAction={<Button size="sm" variant="secondary" disabled>순찰 재개</Button>} />
        <AlarmCaseBanner data-testid="case-escalated" lifecycle="escalated" title="가스 위험 임계치 초과" target="순찰 로봇 3호" occurredAt={OCCURRED} occurredLabel="11:00:00" evidence={{ actor: '관제사 이도윤', at: '11:03:40', reason: '소방서 신고, 현장 대피 요청', authority: 'ADMIN' }} />
        <AlarmCaseBanner data-testid="case-shelved" lifecycle="shelved" severity="warning" title="가스 경고 임계치 초과" target="순찰 로봇 3호" occurredAt={OCCURRED} occurredLabel="10:20:00" evidence={{ actor: '관제사 이도윤', at: '10:21:12', reason: '센서 교정 중, 30분 보류', authority: 'ADMIN' }} />
        <AlarmCaseBanner data-testid="case-cleared" lifecycle="cleared" severity="notice" title="침입자 감지" target="순찰 로봇 1호" occurredAt={OCCURRED} occurredLabel="09:41:00" evidence={{ actor: '시스템', at: '09:42:00', reason: '대상 이탈 후 자동 해제', authority: 'SYSTEM' }} />
      </>,
    ),
  play: async ({ canvasElement }) => {
    const viewOnly = canvasElement.querySelector('[data-testid="case-view-only"]');
    const ack = viewOnly?.querySelector('[data-alarm-action="acknowledge"]');
    if (!ack || !ack.disabled) throw new Error('A view-only user must see the case with the acknowledge action disabled.');
    const reasonId = ack.getAttribute('aria-describedby');
    if (!reasonId || !viewOnly.ownerDocument.getElementById(reasonId)?.textContent?.includes('권한')) {
      throw new Error('The blocked acknowledge action must describe why it is blocked.');
    }
    if (!viewOnly.querySelector('[data-axis="authority"]')?.textContent?.includes('확인 권한 없음')) throw new Error('Authority must be a text chip.');
    const offline = canvasElement.querySelector('[data-testid="case-offline"]');
    const chips = [...offline.querySelectorAll('[data-slot="axes"] [data-axis]')].map((chip) => chip.dataset.axis);
    if (!['stale', 'offline', 'related'].every((axis) => chips.includes(axis)) || offline.dataset.lifecycle !== 'active') {
      throw new Error('Stale, offline and related-count must be separate chips and must not change the lifecycle.');
    }
    if (!offline.querySelector('[data-axis="related"]')?.textContent?.includes('+2건')) throw new Error('The flood count must be readable text.');
    for (const [id, label] of [['case-escalated', '상위 보고됨'], ['case-shelved', '보류됨'], ['case-cleared', '해제됨']]) {
      const node = canvasElement.querySelector(`[data-testid="${id}"]`);
      if (!node?.querySelector('[data-slot="lifecycle"]')?.textContent?.includes(label) || node.dataset.evidence !== 'recorded') {
        throw new Error(`${id} must show its lifecycle label and a complete record.`);
      }
    }
  },
};

function AcknowledgeFixture() {
  const [lifecycle, setLifecycle] = React.useState('active');
  const [evidence, setEvidence] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [remote, setRemote] = React.useState('대기');
  const textareaRef = React.useRef(null);
  const acknowledged = lifecycle === 'acknowledged';

  const confirm = () => {
    setPending(true);
    setOpen(false);
    // The product persists the record first, then flips the lifecycle.
    window.setTimeout(() => {
      setEvidence({ actor: '관제사 김하늘', at: '11:15:02', reason, authority: 'ADMIN' });
      setLifecycle('acknowledged');
      setPending(false);
    }, 120);
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 760, minWidth: 0 }}>
      <AlarmCaseBanner
        data-testid="ack-case"
        lifecycle={lifecycle}
        title="화재 감지로 정지"
        target="순찰 로봇 2호"
        location="서오릉 1층 전시실"
        occurredAt={OCCURRED}
        occurredLabel="11:14:31 · 40초 전"
        reference="alert-1842"
        evidence={evidence}
        acknowledgePending={pending}
        onAcknowledge={() => setOpen(true)}
        remoteAction={
          <Button size="sm" variant="secondary" disabled={!acknowledged || remote !== '대기'} onClick={() => setRemote('전송됨 · 수락 대기')}>
            순찰 재개
          </Button>
        }
      />
      <p data-testid="remote-state" role="status" style={{ margin: 0, fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)' }}>
        재개 명령: {remote}
      </p>
      <ConfirmDialog
        open={open}
        title="알람 확인 기록"
        confirmLabel="확인 기록"
        confirmDisabled={reason.trim().length === 0}
        initialFocusRef={textareaRef}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      >
        <Textarea ref={textareaRef} label="처리 사유" required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} helper="처리자·시각·권한은 서버가 기록합니다." />
      </ConfirmDialog>
    </div>
  );
}

export const AcknowledgeWithReason = {
  name: '상호작용 · 확인 사유 기록과 재개 분리',
  parameters: storyDescription(
    '확인 button이 사유 입력 다이얼로그를 열고, 사유가 있어야 기록할 수 있으며, 기록이 끝난 뒤에야 lifecycle이 확인됨으로 바뀌고 원격 재개가 열리는 조합입니다. 확인이 재개를 대신하지 않고, pending 중 중복 확인이 막히는지 확인하세요.',
  ),
  render: () => <AcknowledgeFixture />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const banner = canvasElement.querySelector('[data-testid="ack-case"]');
    const ack = banner?.querySelector('[data-alarm-action="acknowledge"]');
    const resume = [...banner.querySelectorAll('[data-slot="remote"] button')].find((button) => button.textContent?.includes('순찰 재개'));
    if (!banner || !ack || !resume) throw new Error('The fixture must expose the acknowledge and remote actions.');
    if (!resume.disabled) throw new Error('The product policy in this fixture keeps resume closed until the case is acknowledged.');
    await userEvent.click(ack);
    let dialog;
    await waitFor(() => {
      dialog = doc.querySelector('[role="dialog"]');
      if (!dialog) throw new Error('Acknowledging must open the reason dialog.');
    });
    const textarea = dialog.querySelector('textarea');
    const confirmButton = [...dialog.querySelectorAll('button')].find((button) => button.textContent?.trim() === '확인 기록');
    if (!textarea || !confirmButton) throw new Error('The reason dialog must contain a textarea and the confirm action.');
    if (!confirmButton.disabled) throw new Error('An empty reason must not be recordable.');
    await userEvent.type(textarea, '현장 확인 요청 완료');
    await waitFor(() => {
      if (confirmButton.disabled) throw new Error('A non-empty reason must enable the confirm action.');
    });
    await userEvent.click(confirmButton);
    await waitFor(() => {
      if (doc.querySelector('[role="dialog"]')) throw new Error('The dialog must close after confirming.');
    });
    await waitFor(() => {
      if (banner.dataset.lifecycle !== 'acknowledged' || banner.dataset.evidence !== 'recorded') {
        throw new Error('The lifecycle must flip to acknowledged with a complete record.');
      }
    });
    if (!banner.querySelector('[data-evidence-field="reason"] dd')?.textContent?.includes('현장 확인 요청 완료')) {
      throw new Error('The recorded reason must be shown in the evidence list.');
    }
    if (banner.querySelector('[data-alarm-action="acknowledge"]')) throw new Error('The acknowledge action must disappear once acknowledged.');
    await waitFor(() => {
      if (resume.disabled) throw new Error('Resume must open only after the acknowledgement is recorded.');
    });
    await userEvent.click(resume);
    await waitFor(() => {
      if (!canvasElement.querySelector('[data-testid="remote-state"]')?.textContent?.includes('전송됨')) {
        throw new Error('The remote command must report its own lifecycle apart from the acknowledgement.');
      }
    });
  },
};

export const NarrowList = {
  name: '반응형 · 320px 목록',
  parameters: storyDescription(
    '320px 폭에서 제목·대상·배지·기록·action이 줄바꿈으로 내려가고 가로 overflow가 생기지 않는지, 원격 명령 그룹이 별도 줄로 내려가도 라벨을 유지하는지 확인하세요.',
  ),
  render: () =>
    list(
      <>
        <AlarmCaseBanner title="화재 감지로 정지" target="순찰 로봇 2호" location="서오릉 1층 전시실" occurredAt={OCCURRED} occurredLabel="11:14:31 · 40초 전" reference="alert-1842" stale relatedCount={1} onAcknowledge={() => {}} remoteAction={<Button size="sm" variant="secondary" disabled>순찰 재개</Button>} />
        <AlarmCaseBanner lifecycle="acknowledged" title="쓰러짐 감지로 정지" target="순찰 로봇 1호" occurredAt={OCCURRED} occurredLabel="11:02:10" evidence={RECORD} />
      </>,
      320,
    ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="alarm-list"]');
    if (fixture.scrollWidth > fixture.clientWidth + 1) throw new Error('Cases must not overflow a 320px list.');
    for (const node of fixture.querySelectorAll('[data-alarm-case]')) {
      if (node.scrollWidth > node.clientWidth + 1) throw new Error('A case must wrap instead of overflowing.');
    }
  },
};

export const AlarmCaseBannerCard = {
  name: 'AlarmCaseBanner card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 720, height: 420, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <AlarmCaseBanner title="화재 감지로 정지" target="순찰 로봇 2호" location="서오릉 1층 전시실" occurredAt={OCCURRED} occurredLabel="11:14:31 · 40초 전" reference="alert-1842" onAcknowledge={() => {}} remoteAction={<Button size="sm" variant="secondary" disabled>순찰 재개</Button>} />
        <AlarmCaseBanner lifecycle="acknowledged" title="쓰러짐 감지로 정지" target="순찰 로봇 1호" occurredAt={OCCURRED} occurredLabel="11:02:10 · 13분 전" evidence={RECORD} remoteAction={<Button size="sm" variant="secondary">순찰 재개</Button>} />
        <AlarmCaseBanner lifecycle="acknowledged" severity="warning" title="가스 경고 임계치 초과" target="순찰 로봇 3호" occurredAt={OCCURRED} occurredLabel="10:48:00" />
      </div>
    </div>
  ),
};
