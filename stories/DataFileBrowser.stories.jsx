import React from 'react';
import { FileBrowser } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/File Browser',
  component: FileBrowser,
  parameters: {
    docs: {
      description: {
        component: 'Path navigation과 file/folder selection을 서로 다른 action으로 제공하는 표준 file browser입니다.',
      },
    },
  },
};

export default meta;

const tree = {
  '/': [
    { id: 'maps', name: 'maps', kind: 'directory' },
    { id: 'recordings', name: 'recordings', kind: 'directory' },
    { id: 'config', name: 'config.yaml', kind: 'file', meta: '2 KB' },
  ],
  '/maps': [
    { id: 'b1-pgm', name: 'b1_floor.pgm', kind: 'file', meta: '1.4 MB' },
    { id: 'b1-yaml', name: 'b1_floor.yaml', kind: 'file', meta: '312 B' },
    { id: 'archive', name: 'archive', kind: 'directory' },
  ],
};

export const FileSelection = {
  name: 'File 선택과 navigation',
  render: () => {
    const [path, setPath] = React.useState('/');
    const [selectedId, setSelectedId] = React.useState(null);
    return <FileBrowser path={path} entries={tree[path] ?? []} selectedId={selectedId} onSelectionChange={(entry) => setSelectedId(entry.id)} onNavigate={(entry) => { setPath(path === '/' ? `/${entry.name}` : `${path}/${entry.name}`); setSelectedId(null); }} onUp={() => { setPath('/'); setSelectedId(null); }} />;
  },
};

export const FolderSelection = {
  name: 'Folder 선택과 open 분리',
  args: {
    path: '/maps',
    entries: tree['/maps'],
    selectionMode: 'folder',
    selectedId: 'archive',
    onSelectionChange: () => {},
    onNavigate: () => {},
    onUp: () => {},
  },
};

export const ResourceStates = {
  name: 'Resource 상태',
  render: () => <main style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}><FileBrowser path="/loading" loading /><FileBrowser path="/failed" error="목록을 불러오지 못했습니다." /><FileBrowser path="/empty" entries={[]} /></main>,
};
