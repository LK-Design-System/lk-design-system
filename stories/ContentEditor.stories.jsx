import React from 'react';
import {
  Button,
  ContentEditor,
  Icon,
  StatusBadge,
} from '../src/index.js';

const meta = {
  title: 'LK Product Extension/Content/Writing Editor',
  parameters: {
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
  name: '작성 에디터',
  render: () => (
    <main style={{ width: '100%', maxWidth: 860 }}>
      <DraftEditorDemo />
    </main>
  ),
};

export const EditorStates = {
  name: '읽기 전용과 오류',
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
        titlePlaceholder="제목을 입력하세요"
        placeholder="본문을 입력하세요"
        status={<StatusBadge tone="negative">입력 필요</StatusBadge>}
        helper="필수 필드가 비어 있으면 제목과 본문 영역 모두 오류 상태를 공유합니다."
        actions={<Button size="sm" disabled>저장</Button>}
      />
    </main>
  ),
};
