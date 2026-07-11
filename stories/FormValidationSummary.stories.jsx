import React from 'react';
import { ValidationSummary } from '../src/index.js';

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

function assertRootContract(root, { hasErrors, announcedRole, announcementCopy }) {
  if (root.tagName !== 'SECTION' || !root.getAttribute('aria-labelledby') || !labelledByText(root)) {
    throw new Error('ValidationSummary root must be a heading-labelled section.');
  }
  if (root.hasAttribute('role') || root.hasAttribute('aria-live')) {
    throw new Error('ValidationSummary must not turn the full interactive root into a live region.');
  }

  if (hasErrors) {
    if (root.getAttribute('tabindex') !== '-1') {
      throw new Error('An error summary root must be programmatically focusable with tabIndex={-1}.');
    }
  } else if (root.hasAttribute('tabindex')) {
    throw new Error('Warning-only and valid summaries must not add an unnecessary root Tab stop.');
  }

  const announcers = Array.from(root.querySelectorAll('[role="alert"], [role="status"]'));
  if (announcers.length !== 1 || announcers[0].getAttribute('role') !== announcedRole) {
    throw new Error(`announce must render one internal role="${announcedRole}" summary.`);
  }
  const announcer = announcers[0];
  const live = announcer.getAttribute('aria-live');
  const expectedLive = announcedRole === 'alert' ? 'assertive' : 'polite';
  if (live != null && live !== expectedLive) {
    throw new Error(`The internal ${announcedRole} announcer must use implicit or explicit aria-live="${expectedLive}" semantics.`);
  }
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

function visibleGenericMoveText(root) {
  return Array.from(root.querySelectorAll('*')).some((element) => {
    if (element.children.length > 0 || element.textContent?.trim() !== '이동') return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 2 && rect.height > 2 && style.display !== 'none' && style.visibility !== 'hidden';
  });
}

function assertIssueAction(group, issue) {
  const row = Array.from(group.querySelectorAll('.lk-validation-summary__item'))
    .find((candidate) => candidate.textContent?.includes(issue.label));
  if (!row) throw new Error(`${issue.label} issue row is missing.`);

  const action = row.querySelector('a[href], button');
  if (!action) throw new Error(`${issue.label} is missing its field return action.`);
  const name = accessibleName(action);
  if (!name || (!name.includes(issue.message) && !name.includes(issue.label))) {
    throw new Error(`${issue.label} action accessible name must identify the actual issue.`);
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
  if (visibleGenericMoveText(root)) {
    throw new Error('ValidationSummary must not expose generic visible “이동” action text.');
  }
}

function FocusableSummaryExample(args) {
  const summaryRef = React.useRef(null);
  return (
    <div style={{ width: '100%', maxWidth: 760 }}>
      <ValidationSummary {...args} ref={summaryRef} />
      <button
        type="button"
        hidden
        data-testid="focus-validation-summary"
        onClick={() => summaryRef.current?.focus()}
      >
        Focus summary
      </button>
    </div>
  );
}

const mixedIssues = [
  {
    id: 'timeout',
    label: '대기 시간',
    message: '10분을 초과하면 작업 만료 정책을 다시 확인해야 합니다.',
    severity: 'warning',
  },
  {
    id: 'target',
    label: '대상 로봇',
    message: '실행 대상을 선택하세요.',
    severity: 'error',
  },
  {
    id: 'upload',
    label: 'Evidence 업로드',
    message: '업로드할 collection을 선택하세요.',
    severity: 'error',
  },
];

const meta = {
  title: 'LDS Product/Selection and Input/Validation Summary',
  component: ValidationSummary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '제출을 막는 오류를 요약하고 원래 field로 돌아가는 링크를 제공합니다. Warning은 같은 목록에 섞지 않고 별도 검토 구역으로 구분합니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 760 }}>
      <ValidationSummary {...args} />
    </div>
  ),
};

export default meta;

export const ErrorsAndWarnings = {
  name: '오류와 warning 분리',
  args: {
    description: '오류 2개를 수정해야 저장할 수 있습니다. 주의 1개도 함께 검토하세요.',
    issues: mixedIssues,
    onIssueActivate: () => {},
    announce: true,
  },
  render: (args) => <FocusableSummaryExample {...args} />,
  play: async ({ canvasElement }) => {
    const root = getSummaryRoot(canvasElement);
    assertRootContract(root, {
      hasErrors: true,
      announcedRole: 'alert',
      announcementCopy: ['오류 2', '주의 1'],
    });
    canvasElement.querySelector('[data-testid="focus-validation-summary"]')?.click();
    if (canvasElement.ownerDocument.activeElement !== root) {
      throw new Error('ValidationSummary must forward its ref to the focusable error-summary root.');
    }
    root.blur();
    assertMixedGrouping(root, mixedIssues);
  },
};

export const ErrorsOnly = {
  name: '오류 전용 summary',
  args: {
    title: '저장할 수 없습니다',
    description: '아래 오류를 수정한 뒤 다시 저장하세요.',
    issues: [
      {
        id: 'name',
        label: '작업 이름',
        message: '작업 이름을 입력하세요.',
        severity: 'error',
      },
      {
        id: 'target',
        label: '대상 로봇',
        message: '실행 대상을 선택하세요.',
        severity: 'error',
      },
    ],
    onIssueActivate: () => {},
  },
};

export const WarningOnly = {
  name: 'Warning only · 비차단',
  args: {
    title: '저장 전에 검토하세요',
    description: '주의 항목은 저장을 막지 않습니다. 현재 설정으로 계속할 수 있습니다.',
    issues: [
      {
        id: 'timeout',
        label: '대기 시간',
        message: '긴 대기 시간은 작업 만료 가능성을 높일 수 있습니다.',
        severity: 'warning',
      },
      {
        id: 'retention',
        label: '보관 기간',
        message: '90일 이후에는 실행 기록이 자동으로 정리됩니다.',
        severity: 'warning',
      },
    ],
    onIssueActivate: () => {},
    announce: true,
  },
  play: async ({ canvasElement }) => {
    const root = getSummaryRoot(canvasElement);
    assertRootContract(root, {
      hasErrors: false,
      announcedRole: 'status',
      announcementCopy: ['주의 2'],
    });
    const groups = root.querySelectorAll('.lk-validation-summary__group[data-severity]');
    if (groups.length !== 1 || groups[0].getAttribute('data-severity') !== 'warning') {
      throw new Error('A warning-only summary must render one separate warning group and no error group.');
    }
    if (visibleGenericMoveText(root)) {
      throw new Error('Warning-only actions must not expose generic visible “이동” text.');
    }
  },
};

export const Valid = {
  name: '문제 없음',
  args: {
    description: '필수 항목과 실행 조건을 모두 확인했습니다.',
    issues: [],
    announce: true,
  },
  play: async ({ canvasElement }) => {
    const root = getSummaryRoot(canvasElement);
    assertRootContract(root, {
      hasErrors: false,
      announcedRole: 'status',
      announcementCopy: ['문제 없음'],
    });
    if (root.querySelector('.lk-validation-summary__group, .lk-validation-summary__item, a, button')) {
      throw new Error('A valid ValidationSummary must not render issue groups or return actions.');
    }
  },
};

export const NarrowLongCopy = {
  name: '좁은 폭 · 긴 문구',
  args: {
    title: '저장 전에 수정하세요',
    description: '좁은 영역에서도 제목, 오류 문장, 복귀 링크가 겹치거나 의미 없이 잘리지 않아야 합니다.',
    issues: [
      {
        id: 'collection-permission',
        label: '로봇 운영 데이터 collection 접근 권한',
        message: '선택한 collection에 업로드 권한이 없습니다. 쓰기 권한이 있는 collection을 선택하세요.',
        severity: 'error',
      },
      {
        id: 'retention-policy',
        label: '실행 결과 보관 정책',
        message: '현재 정책에서는 장기 실행의 전체 로그가 보관되지 않을 수 있습니다.',
        severity: 'warning',
      },
    ],
    onIssueActivate: () => {},
  },
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <ValidationSummary {...args} />
    </div>
  ),
};

export const FieldLinksAndKeyboardFocus = {
  name: '오류 문장 link · keyboard focus',
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
        message: '업로드할 collection을 선택하세요.',
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
    link.focus();
    await new Promise((resolve) => setTimeout(resolve, 20));
    if (canvasElement.ownerDocument.activeElement !== link) {
      throw new Error('ValidationSummary field links must accept keyboard focus.');
    }
  },
};
