import React from 'react';
import { FileBrowser } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/File Browser',
  parameters: {
    docs: {
      description: {
        component:
          '서버 파일·디렉터리를 탐색해 폴더/파일을 고르는 FileBrowser 패턴입니다. 트리 선택 패널과 리스트 셀 계열의 compact data row 문법을 따릅니다.',
      },
    },
  },
};

export default meta;

const TREE = {
  '/': [
    { id: 'maps', name: 'maps', type: 'dir' },
    { id: 'recordings', name: 'recordings', type: 'dir' },
    { id: 'config', name: 'config.yaml', type: 'file', size: '2 KB' },
  ],
  '/maps': [
    { id: 'b1-pgm', name: 'b1_floor.pgm', type: 'file', size: '1.4 MB' },
    { id: 'b1-yaml', name: 'b1_floor.yaml', type: 'file', size: '312 B' },
    { id: 'archive', name: 'archive', type: 'dir' },
  ],
  '/recordings': [
    { id: 'amr-0721', name: 'amr-dock-test-2026-07-21.bag', type: 'file', size: '428 MB' },
    { id: 'amr-0722', name: 'amr-lidar-replay-2026-07-22.bag', type: 'file', size: '612 MB' },
    { id: 'calibration', name: 'calibration', type: 'dir' },
    { id: 'notes', name: 'operator-notes.txt', type: 'file', size: '8 KB', disabled: true },
  ],
};

function joinPath(base, name) {
  return base === '/' ? `/${name}` : `${base}/${name}`;
}

function BrowserStory({
  initialPath = '/',
  initialSelected = null,
  entries,
  fixedPath,
  height,
  emptyLabel,
  selectionMode = 'file',
  loading = false,
  loadingLabel,
  error,
  readOnly = false,
}) {
  const [path, setPath] = React.useState(initialPath);
  const [selected, setSelected] = React.useState(initialSelected);
  const currentPath = fixedPath ?? path;
  const currentEntries = entries ?? TREE[currentPath] ?? [];
  const navigationLocked = fixedPath != null || entries != null;

  return (
    <main style={{ width: 'min(420px, 100%)', minWidth: 0 }}>
      <FileBrowser
        path={currentPath}
        entries={currentEntries}
        selected={selected}
        selectionMode={selectionMode}
        height={height}
        emptyLabel={emptyLabel}
        loading={loading}
        loadingLabel={loadingLabel}
        error={error}
        readOnly={readOnly}
        onOpen={
          navigationLocked
            ? undefined
            : (dir) => {
                setPath(joinPath(currentPath, dir.name));
                setSelected(null);
              }
        }
        onUp={
          navigationLocked
            ? undefined
            : () => {
                setPath('/');
                setSelected(null);
              }
        }
        onSelect={(entry) => setSelected(entry.id ?? entry.name)}
      />
    </main>
  );
}

export const FileBrowsers = {
  name: '파일 브라우저',
  render: () => <BrowserStory />,
};

export const SelectedFile = {
  name: '선택 상태',
  render: () => <BrowserStory initialPath="/maps" initialSelected="b1-pgm" />,
};

export const Empty = {
  name: '빈 폴더',
  render: () => (
    <BrowserStory
      fixedPath="/maps/archive"
      entries={[]}
      emptyLabel="폴더가 비어 있습니다"
    />
  ),
};

export const Loading = {
  name: '목록 로딩',
  render: () => (
    <BrowserStory
      fixedPath="/maps"
      loading
      loadingLabel="파일 목록을 불러오는 중입니다"
    />
  ),
};

export const ErrorState = {
  name: '목록 오류',
  render: () => (
    <BrowserStory
      fixedPath="/recordings"
      error="파일 목록을 불러오지 못했습니다"
    />
  ),
};

export const ReadOnly = {
  name: '읽기 전용 파일 목록',
  render: () => (
    <BrowserStory
      initialPath="/recordings"
      initialSelected="amr-0722"
      readOnly
    />
  ),
};

export const FolderSelection = {
  name: '폴더 선택 패널',
  render: () => (
    <BrowserStory
      fixedPath="/maps"
      initialSelected="archive"
      selectionMode="folder"
      entries={TREE['/maps']}
    />
  ),
};

export const SelectionRules = {
  name: '선택 제한',
  render: () => (
    <BrowserStory
      fixedPath="/recordings"
      initialSelected="amr-0721"
      entries={TREE['/recordings']}
    />
  ),
};

export const LongPathAndScroll = {
  name: '긴 경로와 스크롤',
  render: () => (
    <BrowserStory
      fixedPath="/mnt/robot/fleet/amr-03/maps/site/b1/validated/routes"
      height={150}
      initialSelected="route-06"
      entries={[
        { id: 'route-01', name: 'route-dock-to-zone-a.yaml', type: 'file', size: '18 KB' },
        { id: 'route-02', name: 'route-zone-a-to-zone-b.yaml', type: 'file', size: '21 KB' },
        { id: 'route-03', name: 'route-zone-b-to-elevator.yaml', type: 'file', size: '24 KB' },
        { id: 'route-04', name: 'route-elevator-to-dock.yaml', type: 'file', size: '19 KB' },
        { id: 'route-05', name: 'route-safety-hold-points.yaml', type: 'file', size: '11 KB' },
        { id: 'route-06', name: 'route-night-shift-patrol.yaml', type: 'file', size: '32 KB' },
      ]}
    />
  ),
};
