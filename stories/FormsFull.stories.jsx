import {
  FileUpload,
  Icon,
  Input,
  InputGroup,
  NumberField,
  PasswordInput,
  PinInput,
  Textarea,
} from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/3 Selection and Input/Text Input',
  parameters: {
    docs: {
      description: {
        component: '텍스트, 숫자, 비밀번호, 코드, 파일, 긴 문장을 입력하는 기본 폼 요소입니다.',
      },
    },
  },
};

export default meta;

export const TextInputs = {
  name: '텍스트 입력',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Input label="프로젝트 이름" defaultValue="Design System" iconLeft={<Icon name="document" size={18} />} />
        <PasswordInput defaultValue="design-system" />
        <InputGroup prefix="ID" suffix="개" defaultValue="12" />
        <NumberField defaultValue={5} min={0} max={20} />
        <PinInput defaultValue="1205" length={6} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Textarea label="검토 메모" defaultValue="모바일 화면에서 줄바꿈과 도움말 위치를 확인합니다." rows={4} />
        <FileUpload accept="image/*,.pdf" multiple hint="이미지 또는 문서 업로드" />
      </section>
    </main>
  ),
};
