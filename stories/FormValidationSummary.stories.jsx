import React from 'react';
import { Input, ValidationSummary } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

function getSummaryRoot(canvasElement) {
  const root = canvasElement.querySelector('.lk-validation-summary');
  if (!root) throw new Error('ValidationSummary root is missing.');
  return root;
}

function labelledByText(element) {
  return String(element.getAttribute('aria-labelledby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => element.ownerDocument.getElementById(id)?.textContent?.trim() ?? '')
    .filter(Boolean)
    .join(' ');
}

function accessibleName(element) {
  return element.getAttribute('aria-label')?.trim()
    || labelledByText(element)
    || element.textContent?.trim()
    || '';
}

function assertRootContract(root, { announced = false, announcementCopy = [] } = {}) {
  if (root.tagName !== 'SECTION' || !root.getAttribute('aria-labelledby') || !labelledByText(root)) {
    throw new Error('ValidationSummary root must be a heading-labelled section.');
  }
  if (root.hasAttribute('role') || root.hasAttribute('aria-live')) {
    throw new Error('ValidationSummary must not turn the full interactive root into a live region.');
  }
  if (root.getAttribute('tabindex') !== '-1') {
    throw new Error('An error summary root must be programmatically focusable with tabIndex={-1}.');
  }
  const describedBy = root.getAttribute('aria-describedby');
  if (root.querySelector('.lk-validation-summary__header p') && !describedBy) {
    throw new Error('A focused ValidationSummary must expose its visible description with aria-describedby.');
  }

  const announcers = Array.from(root.querySelectorAll('[role="alert"], [role="status"]'));
  if (!announced) {
    if (announcers.length !== 0) {
      throw new Error('Focus-led error summaries must not add a second live announcement.');
    }
    return;
  }
  if (announcers.length !== 1 || announcers[0].getAttribute('role') !== 'alert') {
    throw new Error('announce must render one internal role="alert" count summary.');
  }
  const announcer = announcers[0];
  if (!announcementCopy.every((copy) => announcer.textContent?.includes(copy))) {
    throw new Error('The live announcement must contain only the short validation count/result summary.');
  }
  const rect = announcer.getBoundingClientRect();
  const computed = getComputedStyle(announcer);
  const visuallyHidden = rect.width <= 2
    && rect.height <= 2
    && (computed.overflow === 'hidden' || computed.clip !== 'auto' || computed.clipPath !== 'none');
  if (!visuallyHidden) {
    throw new Error('The validation announcer must be an sr-only region, not a second visible summary.');
  }
}

function assertIssueAction(group, issue) {
  const row = Array.from(group.querySelectorAll('.lk-validation-summary__item'))
    .find((candidate) => candidate.textContent?.includes(issue.label));
  if (!row) throw new Error(`${issue.label} issue row is missing.`);

  const action = row.querySelector('a[href]');
  if (!action) throw new Error(`${issue.label} is missing its field return action.`);
  if (action.getAttribute('href') !== issue.href) {
    throw new Error(`${issue.label} must link to its declared field target.`);
  }
  const name = accessibleName(action);
  if (!name.includes(issue.message) || !name.includes(issue.label)) {
    throw new Error(`${issue.label} action accessible name must include both the field label and issue message.`);
  }
  if (action.textContent?.trim() !== issue.message) {
    throw new Error(`${issue.label} must use the same visible sentence as its inline field message.`);
  }
}

function assertMixedGrouping(root, expectedIssues) {
  const groups = Array.from(root.querySelectorAll('.lk-validation-summary__group[data-severity]'));
  if (groups.length !== 2 || groups[0].getAttribute('data-severity') !== 'error' || groups[1].getAttribute('data-severity') !== 'warning') {
    throw new Error('ValidationSummary must render separate error-first error and warning groups.');
  }

  const errorIssues = expectedIssues.filter((issue) => issue.severity === 'error');
  const errorOrder = Array.from(groups[0].querySelectorAll('.lk-validation-summary__item'))
    .map((row) => errorIssues.find((issue) => row.textContent?.includes(issue.label))?.label ?? 'unknown');
  if (errorOrder.join(',') !== '대상 로봇,Evidence 업로드') {
    throw new Error(`Error grouping must preserve source order within severity; received ${errorOrder.join(',')}.`);
  }

  for (const issue of expectedIssues) {
    const group = groups.find((candidate) => candidate.getAttribute('data-severity') === issue.severity);
    assertIssueAction(group, issue);
  }
}

function assertFieldContract(canvasElement, issue) {
  const target = canvasElement.querySelector(issue.href);
  if (!target) throw new Error(`${issue.label} field target is missing.`);
  const describedBy = String(target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  const description = describedBy
    .map((id) => canvasElement.ownerDocument.getElementById(id)?.textContent?.trim() ?? '')
    .filter(Boolean)
    .join(' ');
  if (!description.includes(issue.message)) {
    throw new Error(`${issue.label} field must expose the same message through aria-describedby.`);
  }
  const expectedInvalid = issue.severity === 'error';
  if ((target.getAttribute('aria-invalid') === 'true') !== expectedInvalid) {
    throw new Error(`${issue.label} field aria-invalid state does not match its severity.`);
  }
}

function ValidationFormExample({ width = '100%', maxWidth = 640, ...args }) {
  const summaryRef = React.useRef(null);
  const activateIssue = React.useCallback((issue, event) => {
    const target = event.currentTarget.ownerDocument.querySelector(issue.href);
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{ width, maxWidth, display: 'grid', gap: 'var(--space-5)' }}
    >
      <ValidationSummary
        {...args}
        ref={summaryRef}
        onIssueActivate={activateIssue}
      />
      <div
        aria-label="검증 대상 필드"
        style={{ display: 'grid', gap: 'var(--space-4)' }}
      >
        {args.issues.map((issue) => (
          <Input
            key={issue.id}
            id={issue.href.startsWith('#') ? issue.href.slice(1) : issue.id}
            label={issue.label}
            error={issue.severity === 'error' ? issue.message : undefined}
            helper={issue.severity === 'warning' ? issue.message : undefined}
            defaultValue={issue.severity === 'warning' ? '15분' : undefined}
          />
        ))}
      </div>
      <button
        type="button"
        hidden
        data-testid="focus-validation-summary"
        onClick={() => summaryRef.current?.focus()}
      >
        Focus summary
      </button>
    </form>
  );
}

const mixedIssues = [
  {
    id: 'timeout',
    label: '대기 시간',
    message: '10분을 초과하면 작업 만료 정책을 다시 확인해야 합니다.',
    severity: 'warning',
    href: '#timeout-field',
  },
  {
    id: 'target',
    label: '대상 로봇',
    message: '실행 대상을 선택하세요.',
    severity: 'error',
    href: '#target-field',
  },
  {
    id: 'upload',
    label: 'Evidence 업로드',
    message: '업로드할 컬렉션을 선택해 주세요.',
    severity: 'error',
    href: '#upload-field',
  },
];

const meta = {
  title: 'LDS Product/Selection and Input/Validation Summary',
  tags: ['autodocs'],
  component: ValidationSummary,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-selection-and-input-validation-summary--errors-and-warnings',
      eyebrow: 'Product / Validation Summary',
      title: '검증 요약은 제출을 막는 문제와 돌아갈 위치를 한곳에 모읍니다',
      description:
        '긴 폼을 제출한 뒤 여러 오류를 우선순위대로 고치게 할 때 적합합니다. 각 요약 문장은 같은 inline error를 가진 실제 field로 연결되어야 하며, 차단 오류가 없는 주의·성공 결과에는 Callout 또는 Notification을 사용하세요.',
    },
    docs: {
      description: {
        component: '제출을 막는 오류와 실제 field로 돌아가는 링크를 제공합니다. 같은 submit에 속한 actionable warning만 별도 구역에 둘 수 있으며, warning-only·성공 상태에는 사용하지 않습니다.',
      },
    },
  },
  render: (args) => <ValidationFormExample {...args} />,
};

export default meta;

export const ErrorsAndWarnings = {
  name: '개요',
  parameters: storyDescription(
    '제출을 막는 오류 2개와 검토할 주의 1개를 별도 group으로 보여줍니다. focusable summary, 동일 inline message, 실제 field 복귀가 severity 위계와 일치하는지 확인하세요.',
  ),
  args: {
    description: '아래 항목을 수정해야 저장할 수 있습니다. 주의 항목도 함께 검토하세요.',
    issues: mixedIssues,
    announce: false,
  },
  play: async ({ canvasElement }) => {
    const root = getSummaryRoot(canvasElement);
    assertRootContract(root);
    canvasElement.querySelector('[data-testid="focus-validation-summary"]')?.click();
    if (canvasElement.ownerDocument.activeElement !== root) {
      throw new Error('ValidationSummary must forward its ref to the focusable error-summary root.');
    }
    root.blur();
    assertMixedGrouping(root, mixedIssues);
    for (const issue of mixedIssues) assertFieldContract(canvasElement, issue);

    const firstIssueLink = root.querySelector(`a[href="${mixedIssues[1].href}"]`);
    firstIssueLink?.click();
    if (canvasElement.ownerDocument.activeElement !== canvasElement.querySelector(mixedIssues[1].href)) {
      throw new Error('Activating a summary link must move focus to the owning field.');
    }
  },
};

export const ErrorsOnly = {
  name: '변형·상태 · 오류 전용 요약',
  parameters: storyDescription(
    '저장을 막는 필수 오류만 있는 요약입니다. 제목과 설명이 차단 상태를 분명히 알리고 각 오류가 수정 대상으로 읽히는지 확인하세요.',
  ),
  args: {
    title: '저장할 수 없습니다',
    description: '아래 오류를 수정한 뒤 다시 저장하세요.',
    issues: [
      {
        id: 'name',
        label: '작업 이름',
        message: '작업 이름을 입력하세요.',
        severity: 'error',
        href: '#job-name-field',
      },
      {
        id: 'target',
        label: '대상 로봇',
        message: '실행 대상을 선택하세요.',
        severity: 'error',
        href: '#robot-target-field',
      },
    ],
    announce: true,
  },
  play: async ({ canvasElement }) => {
    const root = getSummaryRoot(canvasElement);
    assertRootContract(root, {
      announced: true,
      announcementCopy: ['오류 2'],
    });
  },
};

export const NarrowLongCopy = {
  name: '반응형 · 좁은 폭과 긴 문구',
  parameters: storyDescription(
    '320px 폭에서 긴 label·오류·주의 문장을 함께 보여줍니다. severity group과 복귀 action이 겹치거나 의미 없이 잘리지 않는지 확인하세요.',
  ),
  args: {
    title: '저장 전에 수정하세요',
    description: '좁은 영역에서도 제목, 오류 문장, 복귀 링크가 겹치거나 의미 없이 잘리지 않아야 합니다.',
    issues: [
      {
        id: 'collection-permission',
        label: '로봇 운영 데이터 컬렉션 접근 권한',
        message: '선택한 컬렉션에 업로드 권한이 없습니다. 쓰기 권한이 있는 컬렉션을 선택해 주세요.',
        severity: 'error',
        href: '#collection-permission-field',
      },
      {
        id: 'retention-policy',
        label: '실행 결과 보관 정책',
        message: '현재 정책에서는 장기 실행의 전체 로그가 보관되지 않을 수 있습니다.',
        severity: 'warning',
        href: '#retention-policy-field',
      },
    ],
  },
  render: (args) => <ValidationFormExample {...args} width={320} maxWidth="100%" />,
};

export const FieldLinksAndKeyboardFocus = {
  name: '상호작용 · 오류 링크와 키보드 초점',
  parameters: storyDescription(
    '오류 문장을 link로 제공해 원래 field 또는 field group으로 돌아가게 합니다. 키보드 포커스 순서와 링크 목적지가 오류 항목 순서에 맞는지 확인하세요.',
  ),
  args: {
    title: '수정이 필요한 항목',
    description: '오류 문장을 선택하면 해당 field 또는 field group으로 돌아갑니다.',
    issues: [
      {
        id: 'target-link',
        label: '대상 로봇',
        message: '실행 대상을 선택하세요.',
        severity: 'error',
        href: '#target-robot-field',
      },
      {
        id: 'upload-link',
        label: 'Evidence 업로드',
        message: '업로드할 컬렉션을 선택해 주세요.',
        severity: 'error',
        href: '#evidence-collection-field',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a[href="#target-robot-field"]');
    if (!link) throw new Error('ValidationSummary must render the error sentence as a field link.');
    if (!link.textContent?.includes('실행 대상을 선택하세요.')) {
      throw new Error('The visible field link must use the same actionable sentence as the inline error.');
    }
    link.click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const target = canvasElement.querySelector('#target-robot-field');
    if (canvasElement.ownerDocument.activeElement !== target) {
      throw new Error('ValidationSummary field links must move focus to their field target.');
    }
    assertFieldContract(canvasElement, {
      label: '대상 로봇',
      message: '실행 대상을 선택하세요.',
      severity: 'error',
      href: '#target-robot-field',
    });
  },
};
