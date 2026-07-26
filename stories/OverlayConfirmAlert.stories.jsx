import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Alert, Button } from '../src/index.js';
import {
  AlertCard as AlertCardStory,
  AlertOpen as AlertOpenStory,
  AlertToastCard as AlertToastCardStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Alert',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-alert--alert-open',
      eyebrow: 'Core / Overlay',
      title: 'Alert는 즉시 확인해야 하는 짧고 중요한 결정을 흐름 위에 제시합니다',
      description:
        '진행을 멈추고 경고나 간단한 선택에 응답해야만 다음 단계로 갈 수 있을 때 적합합니다. 긴 설명이나 입력이 필요한 작업에는 Modal을, 흐름을 막지 않는 완료·오류 알림에는 Toast나 Snackbar를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Alert 플랫폼별 처리에 맞춘 모달 피드백 알럿 패턴입니다.',
      },
    },
  },
};

export default meta;

const alertVariantColor = {
  normal: 'var(--color-semantic-primary-normal)',
  negative: 'var(--color-semantic-status-negative-text)',
  assistive: 'var(--color-semantic-label-neutral)',
};

function AlertPreview({ platform, heading = true, variant = 'negative', title = '세션이 만료되었습니다', body = '작업을 계속하려면 다시 로그인해 주세요.' }) {
  const ios = platform === 'ios';
  const android = platform === 'android';
  const width = ios ? 210 : android ? 230 : 250;
  const accent = alertVariantColor[variant] || alertVariantColor.normal;
  const primaryLabel = variant === 'negative' ? '다시 로그인' : variant === 'assistive' ? '알겠어요' : '확인';

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{platform}{variant ? ` / ${variant}` : ''}</h3>
      <div
        style={{
          height: 210,
          display: 'grid',
          placeItems: 'center',
          padding: 18,
          background: 'var(--color-semantic-interaction-inactive)',
        }}
      >
        <div
          style={{
            width,
            maxWidth: '100%',
            padding: ios ? '20px 14px 14px' : '18px 18px 14px',
            borderRadius: ios ? 18 : 8,
            background: 'var(--color-semantic-background-elevated-normal)',
            boxShadow: 'var(--shadow-lg)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {heading && (
            <div style={{ marginBottom: 8, fontSize: ios ? 14 : 15, fontWeight: 'var(--fw-extra)', color: 'var(--color-semantic-label-normal)' }}>
              {title}
            </div>
          )}
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--color-semantic-label-neutral)' }}>
            {body}
          </p>
          <div style={{ display: 'flex', justifyContent: ios ? 'center' : 'flex-end', gap: 8, marginTop: 18 }}>
            <button type="button" style={{ height: ios ? 34 : 30, padding: '0 12px', border: 'none', borderRadius: ios ? 'var(--radius-pill)' : 'var(--radius-md)', background: ios ? 'var(--color-semantic-fill-normal)' : 'transparent', color: 'var(--color-semantic-label-normal)', fontSize: 12, fontWeight: 'var(--fw-bold)' }}>
              나중에
            </button>
            <button type="button" style={{ height: ios ? 34 : 30, padding: '0 12px', border: 'none', borderRadius: ios ? 'var(--radius-pill)' : 'var(--radius-md)', background: ios ? accent : 'transparent', color: ios ? 'var(--color-semantic-inverse-label)' : accent, fontSize: 12, fontWeight: 'var(--fw-bold)' }}>
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const AlertOpen = {
  ...AlertOpenStory,
  name: '개요',
  parameters: storyDescription(
    '게시 전 선택 내용을 다시 확인하는 기본 Alert입니다. 제목과 본문, 취소·게시 동작의 우선순위가 즉시 읽히고 열린 동안 배경 흐름이 차단되는지 확인하세요.',
  ),
};

function AlertKeyboardDemo() {
  const [open, setOpen] = React.useState(false);
  const [defaultsOpen, setDefaultsOpen] = React.useState(false);
  return (
    <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', gap: 'var(--space-3)' }}>
      <Button onClick={() => setOpen(true)}>Alert 열기</Button>
      <Button data-testid="alert-defaults-trigger" variant="outlined" color="assistive" onClick={() => setDefaultsOpen(true)}>
        기본 레이블 Alert 열기
      </Button>
      <Alert open={open} title="변경 사항을 게시할까요?" secondaryLabel="취소" primaryLabel="게시" onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
      <Alert open={defaultsOpen} title="설정이 저장되었습니다" onConfirm={() => setDefaultsOpen(false)} onClose={() => setDefaultsOpen(false)} />
    </div>
  );
}

export const AlertKeyboardContract = {
  name: '상호작용 · 키보드 탐색과 초점 복원',
  parameters: storyDescription(
    '키보드로 Alert를 열고 취소·게시 동작 사이를 순환한 뒤 Escape로 닫는 계약입니다. 첫 초점이 안전한 보조 동작에 놓이고 초점이 내부에서 순환하며 닫힌 뒤 호출 버튼으로 복원되는지 확인하세요.',
  ),
  render: () => <AlertKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Alert 열기');
    await userEvent.click(trigger);
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '취소') throw new Error('Alert must focus the secondary action first.');
    });

    // APG Alert Dialog: Alert always acquires a response, so the role is
    // alertdialog regardless of the variant axis.
    const alertDialog = canvasElement.querySelector('[role="alertdialog"]');
    if (!alertDialog || alertDialog.getAttribute('aria-modal') !== 'true') {
      throw new Error('Alert must render role="alertdialog" with aria-modal.');
    }
    if (canvasElement.querySelector('[role="dialog"]')) {
      throw new Error('Alert must not fall back to the plain dialog role.');
    }
    if (ownerDocument.defaultView.getComputedStyle(ownerDocument.body).overflow !== 'hidden') {
      throw new Error('An open Alert must lock background page scrolling.');
    }

    await userEvent.tab();
    if (ownerDocument.activeElement?.textContent?.trim() !== '게시') throw new Error('Alert Tab must move to the primary action.');
    await userEvent.tab();
    if (ownerDocument.activeElement?.textContent?.trim() !== '취소') throw new Error('Alert Tab must wrap inside the dialog.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="alertdialog"]')) throw new Error('Alert must close on Escape.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Alert must restore focus to its trigger.');
      if (ownerDocument.defaultView.getComputedStyle(ownerDocument.body).overflow === 'hidden') {
        throw new Error('Closing the Alert must release the background scroll lock.');
      }
    });

    // Label defaults follow the system locale (확인 / 취소), not English.
    const defaultsTrigger = canvasElement.querySelector('[data-testid="alert-defaults-trigger"]');
    await userEvent.click(defaultsTrigger);
    await waitFor(() => {
      const primary = canvasElement.querySelector('[role="alertdialog"] [data-alert-primary]');
      if (primary?.textContent?.trim() !== '확인') {
        throw new Error('Alert primary label must default to the Korean 확인.');
      }
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="alertdialog"]')) throw new Error('The defaults Alert must close on Escape.');
    });
  },
};

export const AlertPlatformPreview = {
  name: '변형·상태 · 플랫폼별 형태',
  parameters: storyDescription(
    'iOS·Android·Web 환경에서 negative·normal·assistive Alert의 밀도와 동작 강조를 비교합니다. 플랫폼 차이를 유지하면서도 제목·설명·주요 동작의 읽기 순서와 위험 정도가 일관되게 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980 }}>
      <div style={{ padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-normal-alternative)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, alignItems: 'start' }}>
          <AlertPreview platform="ios" variant="negative" />
          <AlertPreview platform="android" variant="normal" title="변경 사항을 게시할까요?" body="선택한 업데이트가 구성원에게 공개됩니다." />
          <AlertPreview platform="web" variant="assistive" heading={false} body="단축키는 설정에서 나중에 변경할 수 있습니다." />
        </div>
      </div>
    </main>
  ),
};

export const AlertCard = { ...AlertCardStory, name: 'Alert card parity', tags: ['!dev', 'visual-parity'] };
export const AlertToastCard = { ...AlertToastCardStory, name: 'Alert Toast card parity', tags: ['!dev', 'visual-parity'] };
