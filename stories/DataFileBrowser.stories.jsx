import React from 'react';
import { FileBrowser } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Collections/File Browser',
  component: FileBrowser,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-collections-file-browser--file-selection',
      eyebrow: 'Product / Data / File Browser',
      title: '사용자가 경로를 탐색하고 올바른 파일이나 폴더를 선택합니다',
      description:
        '제품 안에서 원격 저장소나 작업 공간의 경로를 이동하며 대상을 고를 때 적합합니다. 로컬 파일을 한 번 첨부하거나 업로드 상태를 관리할 때는 File Browser 대신 File Upload 또는 File Upload Queue를 사용하세요.',
    },
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
  name: '개요',
  parameters: storyDescription(
    '폴더를 열어 경로를 이동한 뒤 파일 하나를 선택하는 상황입니다. navigation과 selection이 서로 다른 동작으로 인식되고 경로 변경 시 선택이 안전하게 초기화되는지 확인하세요.',
  ),
  render: () => {
    const [path, setPath] = React.useState('/');
    const [selectedId, setSelectedId] = React.useState(null);
    return <FileBrowser path={path} entries={tree[path] ?? []} selectedId={selectedId} onSelectionChange={(entry) => setSelectedId(entry.id)} onNavigate={(entry) => { setPath(path === '/' ? `/${entry.name}` : `${path}/${entry.name}`); setSelectedId(null); }} onUp={() => { setPath('/'); setSelectedId(null); }} />;
  },
};

export const FolderSelection = {
  name: '사용법 · 폴더 선택과 열기 분리',
  parameters: storyDescription(
    '폴더 자체를 선택하는 모드에서 선택과 폴더 열기를 구분하는 상황입니다. 선택된 폴더가 명확하고 open action이 현재 선택을 뜻밖에 바꾸지 않는지 확인하세요.',
  ),
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
  name: '변형·상태 · 불러오기 · 오류와 빈 상태',
  parameters: storyDescription(
    '파일 목록을 불러오는 중이거나 실패했거나 비어 있는 경로를 비교하는 상황입니다. loading·error·empty가 구분되고 사용자가 다음 행동을 예측할 수 있는지 확인하세요.',
  ),
  render: () => <main style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}><FileBrowser path="/loading" loading /><FileBrowser path="/failed" error="목록을 불러오지 못했습니다." /><FileBrowser path="/empty" entries={[]} /></main>,
};
