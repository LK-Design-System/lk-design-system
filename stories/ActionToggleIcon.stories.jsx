import { userEvent, waitFor } from 'storybook/test';
import { Icon, ToggleIcon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Toggle Icon',
  component: ToggleIcon,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-action-toggle-icon--toggle-states',
      eyebrow: 'Core / Action / Toggle Icon',
      title: '아이콘 하나로 켬·끔 선택 상태를 유지합니다',
      description:
        '미리보기 표시, 즐겨찾기, 고정처럼 같은 제어를 다시 눌러 상태를 해제하는 이진 선택에 적합합니다. 즉시 실행 후 끝나는 행동은 Icon Button을, 텍스트 레이블이 필요한 설정은 Switch나 Toggle Button을 사용하세요.',
    },
    docs: {
      description: {
        component: '켬·끔 상태를 유지하는 아이콘 토글 ToggleIcon입니다. WDS 원본 축(active, disable)을 따르며 항상 접근 가능한 label을 요구합니다.',
      },
    },
  },
};

export default meta;

export const ToggleStates = {
  name: '개요',
  parameters: storyDescription(
    '아이콘 기반 이진 설정의 선택·미선택·비활성 상태를 함께 검토하는 상황입니다. 눌림 상태가 색상에만 의존하지 않고 접근 가능한 이름과 pressed 상태로 보조 기술에도 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', maxWidth: 640 }}>
      <ToggleIcon label="미리보기 표시" defaultPressed>
        <Icon name="eye" size={18} />
      </ToggleIcon>
      <ToggleIcon label="즐겨찾기">
        <Icon name="star" size={18} />
      </ToggleIcon>
      <ToggleIcon label="고정" disabled>
        <Icon name="pin" size={18} />
      </ToggleIcon>
    </main>
  ),
};

export const InteractionContract = {
  name: '상호작용 · 지속 상태 계약',
  parameters: storyDescription(
    '아이콘 토글의 순간 pressed 피드백과 클릭 뒤 유지되는 선택 상태를 구분하는 상황입니다. 접근 가능한 이름과 aria-pressed가 함께 바뀌고 aria-disabled 토글은 초점은 받되 상태가 바뀌지 않아야 합니다.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', maxWidth: 640 }}>
      <ToggleIcon data-contract="interactive" label="레이어 표시">
        <Icon name="layers" size={18} aria-hidden="true" />
      </ToggleIcon>
      <ToggleIcon data-contract="aria-disabled" label="권한이 필요한 고정" aria-disabled="true">
        <Icon name="pin" size={18} aria-hidden="true" />
      </ToggleIcon>
      <ToggleIcon label="비활성 즐겨찾기" disabled>
        <Icon name="star" size={18} aria-hidden="true" />
      </ToggleIcon>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const interactive = canvasElement.querySelector('[data-contract="interactive"]');
    const ariaDisabled = canvasElement.querySelector('[data-contract="aria-disabled"]');
    if (!interactive || !ariaDisabled) throw new Error('ToggleIcon contract targets are required.');
    if (interactive.getAttribute('aria-label') !== '레이어 표시' || interactive.getAttribute('aria-pressed') !== 'false') {
      throw new Error('ToggleIcon must expose its name and initial pressed state.');
    }

    const restBackground = getComputedStyle(interactive).backgroundColor;
    await userEvent.hover(interactive);
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === restBackground) throw new Error('ToggleIcon hover feedback is missing.');
    });
    const hoverBackground = getComputedStyle(interactive).backgroundColor;
    interactive.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === hoverBackground) throw new Error('ToggleIcon momentary pressed feedback is missing.');
    });
    interactive.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await userEvent.click(interactive);
    if (interactive.getAttribute('aria-pressed') !== 'true') throw new Error('ToggleIcon must retain its toggled state.');

    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled ToggleIcon must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (ariaDisabled.getAttribute('aria-pressed') !== 'false') throw new Error('aria-disabled ToggleIcon must not toggle.');
  },
};
