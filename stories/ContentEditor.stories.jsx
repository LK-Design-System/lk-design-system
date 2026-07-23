import React from 'react';
import {
  Button,
  ContentEditor,
  Icon,
  StatusBadge,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Writing Editor',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-writing-editor--writing-editor',
      eyebrow: 'Product / Writing Editor',
      title: '사용자가 제목과 본문을 작성하며 저장 상태와 다음 작업을 함께 확인합니다',
      description:
        '공지·게시글처럼 제목과 본문, 상태, 제출 액션을 한 작성 흐름으로 묶을 때 적합합니다. 짧은 단일 입력이나 완전한 rich text 저작에는 ContentEditor 셸 대신 Textarea 또는 제품 전용 편집기를 사용하세요.',
    },
    docs: {
      description: {
        component: '게시글, 공지, 운영 로그처럼 제목과 본문을 수정하는 작성 에디터 셸입니다. 실제 rich text 엔진은 제품 앱에서 연결합니다.',
      },
    },
  },
};

export default meta;

function DraftEditorDemo() {
  const [title, setTitle] = React.useState('점검 공지 초안');
  const [body, setBody] = React.useState('금일 18:00부터 관제 서버 점검을 진행합니다.\n\n영향 범위와 복구 예정 시각을 본문에 명확히 작성하세요.');
  return (
    <ContentEditor
      titleValue={title}
      onTitleChange={setTitle}
      value={body}
      onValueChange={setBody}
      activeToolbarItems={['body']}
      status={<StatusBadge tone="cautionary">임시 저장됨</StatusBadge>}
      meta="최종 수정 10:42"
      helper="제목, 본문, 저장 상태, 액션을 한 셸 안에서 정렬합니다."
      maxLength={1000}
      actions={(
        <>
          <Button variant="ghost" size="sm">취소</Button>
          <Button size="sm"><Icon name="check" size={16} aria-hidden="true" />게시</Button>
        </>
      )}
    />
  );
}

export const WritingEditor = {
  name: '개요',
  parameters: storyDescription(
    '운영 공지 초안을 작성하고 임시 저장 상태를 확인한 뒤 게시하는 상황입니다. 제목·본문·상태·보조 정보·액션이 자연스러운 읽기 및 키보드 순서를 유지하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 860 }}>
      <DraftEditorDemo />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const toolbar = canvasElement.querySelector('[role="toolbar"]');
    if (!toolbar) throw new Error('기본 툴 행은 role="toolbar"로 선언되어야 합니다.');
    if (toolbar.querySelector('[role="status"]')) {
      throw new Error('저장 상태 live region은 툴바의 자식이 아니라 형제여야 합니다 — 툴바 자식은 컨트롤만.');
    }
    if (!canvasElement.querySelector('[role="status"]')) {
      throw new Error('저장 상태는 polite live region으로 노출되어야 합니다.');
    }

    const tools = Array.from(toolbar.querySelectorAll('button'));
    if (tools.length < 2) throw new Error('툴바 계약을 검증하려면 최소 두 개의 툴이 필요합니다.');
    const tabStops = tools.filter((tool) => tool.getAttribute('tabindex') === '0');
    if (tabStops.length !== 1) {
      throw new Error('APG Toolbar는 Tab stop이 하나여야 합니다(roving tabindex).');
    }
    if (tools[0].getAttribute('aria-pressed') !== 'true') {
      throw new Error('활성 토글은 aria-pressed="true"여야 합니다.');
    }
    const inactiveToggle = tools[3];
    if (inactiveToggle.getAttribute('aria-pressed') !== 'false') {
      throw new Error('비활성 토글도 aria-pressed="false"를 유지해야 토글 버튼임을 알 수 있습니다.');
    }
    if (tools[1].hasAttribute('aria-pressed')) {
      throw new Error('일회성 액션 툴에는 aria-pressed를 붙이지 않습니다.');
    }

    // 하네스는 document.hasFocus() === false로 돌기 때문에 roving 이동은
    // 활성 요소에 keydown을 직접 보내 검증한다(포커스 부기 의존 제거).
    const press = (key) => {
      doc.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    };
    tools[0].focus();
    tools[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    press('ArrowRight');
    if (doc.activeElement !== tools[1]) throw new Error('→ 키로 다음 툴로 이동해야 합니다.');
    press('End');
    if (doc.activeElement !== tools[tools.length - 1]) throw new Error('End 키는 마지막 툴로 이동해야 합니다.');
    press('Home');
    if (doc.activeElement !== tools[0]) throw new Error('Home 키는 첫 툴로 이동해야 합니다.');
    press('ArrowLeft');
    if (doc.activeElement !== tools[tools.length - 1]) throw new Error('← 키는 첫 툴에서 마지막 툴로 순환해야 합니다.');

    const titleInput = canvasElement.querySelector('input[id$="-title"]');
    if (!titleInput) throw new Error('제목 입력이 label과 연결되어 있어야 합니다.');

    // 이름난 상태로 복귀 — 첫 툴이 Tab stop인 초기 상태.
    tools[0].focus();
    tools[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    tools[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    tools[0].blur();
  },
};

export const EditorStates = {
  name: '변형·상태 · 읽기 전용과 오류',
  parameters: storyDescription(
    '게시 완료된 읽기 전용 문서와 필수 입력이 비어 있는 오류 상태를 비교합니다. 잠긴 입력과 오류 안내가 상태 배지뿐 아니라 필드 동작과 메시지로도 분명한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 860 }}>
      <ContentEditor
        readOnly
        titleValue="게시 완료 공지"
        value="게시된 글은 읽기 전용 상태에서 툴바와 입력을 잠급니다."
        status={<StatusBadge tone="positive">게시됨</StatusBadge>}
        meta="게시 2026.07.07 10:42"
        actions={<Button variant="ghost" size="sm"><Icon name="document" size={16} aria-hidden="true" />복제</Button>}
      />
      <ContentEditor
        required
        invalid
        titleValue=""
        value=""
        titlePlaceholder="제목을 입력해 주세요."
        placeholder="본문을 입력해 주세요."
        status={<StatusBadge tone="negative">입력 필요</StatusBadge>}
        helper="필수 필드가 비어 있으면 제목과 본문 영역 모두 오류 상태를 공유합니다."
        actions={<Button size="sm" disabled>저장</Button>}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const editors = Array.from(canvasElement.querySelectorAll('section'));
    if (editors.length !== 2) throw new Error('읽기 전용과 오류 상태 두 에디터가 필요합니다.');
    const [readOnlyEditor, invalidEditor] = editors;

    const readOnlyTools = Array.from(readOnlyEditor.querySelectorAll('[role="toolbar"] button'));
    if (readOnlyTools.length === 0) throw new Error('읽기 전용 에디터도 툴 행을 유지해야 합니다.');
    if (readOnlyTools.some((tool) => !tool.disabled)) {
      throw new Error('읽기 전용에서는 툴이 잠겨야 합니다.');
    }
    if (readOnlyTools.some((tool) => tool.getAttribute('tabindex') === '0')) {
      throw new Error('전부 잠긴 툴바는 Tab 순서에 남지 않아야 합니다.');
    }

    const labels = Array.from(invalidEditor.querySelectorAll('label')).map((label) => label.textContent);
    if (labels.length !== 2 || labels.some((label) => !label.includes('(필수)'))) {
      throw new Error('필수 표시는 별표 색상만이 아니라 라벨 텍스트로도 전달되어야 합니다.');
    }
    const body = invalidEditor.querySelector('textarea');
    if (body.getAttribute('aria-invalid') !== 'true') {
      throw new Error('오류 상태는 aria-invalid로도 전달되어야 합니다.');
    }
  },
};
