import React from 'react';
import { FileBrowser } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/File Browser',
  parameters: {
    docs: {
      description: {
        component: '서버 파일·디렉터리를 탐색해 폴더/파일을 고르는 FileBrowser 패턴입니다. 모달과 함께 "폴더 선택"에 씁니다.',
      },
    },
  },
};

export default meta;

const TREE = {
  '/': [
    { name: 'maps', type: 'dir' },
    { name: 'recordings', type: 'dir' },
    { name: 'config.yaml', type: 'file', size: '2 KB' },
  ],
  '/maps': [
    { name: 'b1_floor.pgm', type: 'file', size: '1.4 MB' },
    { name: 'b1_floor.yaml', type: 'file', size: '312 B' },
    { name: 'archive', type: 'dir' },
  ],
};

export const FileBrowsers = {
  name: '파일 브라우저',
  render: () => {
    const [path, setPath] = React.useState('/');
    const [sel, setSel] = React.useState(null);
    return (
      <FileBrowser
        path={path}
        entries={TREE[path] || []}
        selected={sel}
        onOpen={(dir) => { setPath(path === '/' ? `/${dir.name}` : `${path}/${dir.name}`); setSel(null); }}
        onUp={() => { setPath('/'); setSel(null); }}
        onSelect={(e) => setSel(e.name)}
      />
    );
  },
};
