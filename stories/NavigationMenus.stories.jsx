import {
  Button,
  DropdownMenu,
  Menubar,
} from '../src/index.js';

const meta = {
  title: 'LDS Core/3 Component/8 Presentation/Menu',
  parameters: {
    docs: {
      description: {
        component: 'Menu presentation patterns aligned with Menu variant, action area, scroll, and item state axes.',
      },
    },
  },
};

export default meta;

const menuItems = [
  { label: 'Open profile', shortcut: 'Enter', active: true },
  { label: 'Share', description: 'Copy a link for collaborators', shortcut: 'S' },
  { divider: true },
  { label: 'Disabled item', disable: true },
  { label: 'Delete', danger: true, shortcut: 'Del' },
];

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const MenuPatterns = {
  name: 'Menu patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980 }}>
      <Section title="Dropdown variants, scroll, and action area">
        <div style={{ minHeight: 360, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, alignItems: 'start' }}>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Normal</Button>} items={menuItems} open />
          </div>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Radio</Button>} variant="radio" cellPadding="8px" verticalPadding="8px" items={[{ label: 'Newest', checked: true }, { label: 'Oldest' }, { label: 'Most viewed' }]} open />
          </div>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu
              trigger={<Button variant="ghost">Checkbox</Button>}
              variant="checkbox"
              verticalPadding="12px"
              items={[
                { label: 'Jobs', checked: true },
                { label: 'Companies', checked: true },
                { label: 'Education', captionContent: 'Caption text' },
                { label: 'Events' },
                { label: 'Saved searches' },
                { label: 'Disabled', disable: true },
              ]}
              menuActionArea
              maxHeight={160}
              open
            />
          </div>
        </div>
      </Section>

      <Section title="Menubar wrapper">
        <div style={{ justifySelf: 'start' }}>
          <Menubar
            menus={[
              { label: 'File', items: menuItems, menuActionArea: true },
              { label: 'View', variant: 'radio', items: [{ label: 'List', checked: true }, { label: 'Grid' }, { label: 'Preview', disabled: true }] },
              { label: 'Filter', variant: 'checkbox', items: [{ label: 'Open', checked: true }, { label: 'Assigned to me', checked: true }, { label: 'Archived' }] },
            ]}
            maxHeight={180}
          />
        </div>
      </Section>
    </main>
  ),
};
