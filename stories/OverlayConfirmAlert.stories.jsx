import {
  AlertCard as AlertCardStory,
  AlertOpen as AlertOpenStory,
  AlertToastCard as AlertToastCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Confirm Alert',
  parameters: {
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

function AlertPreview({ platform, heading = true, variant = 'negative', title = '리포트를 삭제할까요?', body = '이 작업은 되돌릴 수 없습니다.' }) {
  const ios = platform === 'ios';
  const android = platform === 'android';
  const width = ios ? 210 : android ? 230 : 250;
  const accent = alertVariantColor[variant] || alertVariantColor.normal;
  const primaryLabel = variant === 'negative' ? '삭제' : variant === 'assistive' ? '알겠어요' : '확인';

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
              취소
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

export const AlertOpen = { ...AlertOpenStory, name: 'Alert 열림' };

export const AlertPlatformPreview = {
  name: 'Alert 플랫폼·변형 미리보기',
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
