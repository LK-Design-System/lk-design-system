import {
  Button,
  DropdownMenu,
  Menubar,
} from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Presentation/Menu',
  parameters: {
    docs: {
      description: {
        component: 'Menu의 variant, action area, scroll, 항목 상태 축에 맞춘 메뉴 프레젠테이션 패턴입니다.',
      },
    },
  },
};

export default meta;

const menuItems = [
  { label: '프로필 열기', shortcut: 'Enter', active: true },
  { label: '공유', description: '협업자에게 링크를 복사합니다', shortcut: 'S' },
  { divider: true },
  { label: '비활성 항목', disable: true },
  { label: '삭제', danger: true, shortcut: 'Del' },
];

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const MenuPatterns = {
  name: 'Menu patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980 }}>
      <Section title="드롭다운 변형, 스크롤, 액션 영역">
        <div style={{ minHeight: 360, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, alignItems: 'start' }}>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Normal</Button>} items={menuItems} open />
          </div>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Radio</Button>} variant="radio" cellPadding="8px" verticalPadding="8px" items={[{ label: '최신순', checked: true }, { label: '오래된순' }, { label: '조회순' }]} open />
          </div>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu
              trigger={<Button variant="ghost">Checkbox</Button>}
              variant="checkbox"
              verticalPadding="12px"
              items={[
                { label: '로봇', checked: true },
                { label: '설비', checked: true },
                { label: '배차', captionContent: '캡션 텍스트' },
                { label: '이벤트' },
                { label: '저장된 검색' },
                { label: '비활성', disable: true },
              ]}
              menuActionArea
              maxHeight={160}
              open
            />
          </div>
        </div>
      </Section>

      <Section title="Menubar 래퍼">
        <div style={{ justifySelf: 'start' }}>
          <Menubar
            menus={[
              { label: '파일', items: menuItems, menuActionArea: true },
              { label: '보기', variant: 'radio', items: [{ label: '목록', checked: true }, { label: '그리드' }, { label: '미리보기', disabled: true }] },
              { label: '필터', variant: 'checkbox', items: [{ label: '진행 중', checked: true }, { label: '내 담당', checked: true }, { label: '보관됨' }] },
            ]}
            maxHeight={180}
          />
        </div>
      </Section>
    </main>
  ),
};
