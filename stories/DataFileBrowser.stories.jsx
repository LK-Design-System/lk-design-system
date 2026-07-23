import React from 'react';
import { userEvent } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]');
    const list = canvasElement.querySelector('ul');
    if (group?.getAttribute('aria-label') !== '파일 브라우저' || list?.getAttribute('aria-label') !== '파일과 폴더') {
      throw new Error('기본 accessible name은 한국어여야 합니다(파일 브라우저 / 파일과 폴더).');
    }

    const code = canvasElement.querySelector('code');
    if (code?.hasAttribute('aria-label')) {
      throw new Error('code는 naming prohibited role이므로 경로에 aria-label을 붙이면 안 됩니다(ARIA in HTML).');
    }
    if (code?.previousElementSibling?.textContent?.trim() !== '현재 경로') {
      throw new Error('경로 맥락은 보이는 텍스트를 덮어쓰지 않는 별도 텍스트로 제공되어야 합니다.');
    }

    const up = canvasElement.querySelector('button[aria-label="상위 폴더로 이동"]');
    if (!up) throw new Error('FileBrowser must expose a named up-navigation control.');
    if (up.hasAttribute('disabled') || up.getAttribute('aria-disabled') !== 'true') {
      throw new Error('루트에서 상위 이동은 native disabled가 아니라 focusable한 aria-disabled여야 합니다.');
    }

    const folder = canvasElement.querySelector('button[aria-label="maps, 폴더"]');
    if (!folder) throw new Error('폴더 행의 primary action은 이름에 유형을 포함한 버튼이어야 합니다.');
    await userEvent.click(folder);
    if (canvasElement.querySelector('code')?.textContent?.trim() !== '/maps' || up.getAttribute('aria-disabled') === 'true') {
      throw new Error('폴더를 열면 경로가 갱신되고 상위 이동이 활성화되어야 합니다.');
    }

    const file = canvasElement.querySelector('button[aria-label="b1_floor.pgm, 파일"]');
    if (!file) throw new Error('항목 이름에는 파일/폴더 유형이 포함되어야 합니다.');
    await userEvent.click(file);
    const selectedFile = canvasElement.querySelector('button[aria-label="b1_floor.pgm, 파일"]');
    if (selectedFile?.getAttribute('aria-pressed') !== 'true') {
      throw new Error('선택은 aria-pressed로 전달되어야 합니다.');
    }
    if (selectedFile.getAttribute('aria-label').includes('선택됨')) {
      throw new Error('aria-pressed가 있는 행의 이름에 선택 상태를 중복해서 넣으면 안 됩니다.');
    }

    up.focus();
    await userEvent.click(up);
    if (canvasElement.querySelector('code')?.textContent?.trim() !== '/' || canvasElement.querySelector('[aria-pressed="true"]')) {
      throw new Error('상위로 이동하면 경로가 초기화되고 선택도 함께 해제되어야 합니다.');
    }
    if (canvasElement.ownerDocument.activeElement !== up) {
      throw new Error('루트에 도달해 버튼이 비활성이 되어도 포커스는 <body>로 떨어지지 않아야 합니다(WCAG 2.4.3).');
    }
    up.blur();
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
  play: async ({ canvasElement }) => {
    const folder = canvasElement.querySelector('button[aria-label="archive, 폴더"]');
    if (folder?.getAttribute('aria-pressed') !== 'true') {
      throw new Error('선택된 폴더는 aria-pressed로 상태를 전달해야 합니다.');
    }
    if (folder.getAttribute('aria-label').includes('선택됨')) {
      throw new Error('aria-pressed와 이름이 선택 상태를 이중으로 낭독하면 안 됩니다.');
    }
    if (!canvasElement.querySelector('button[aria-label="archive 폴더 열기"]')) {
      throw new Error('폴더 선택 모드에서 열기는 별도의 이름 있는 trailing 버튼이어야 합니다.');
    }
    const file = canvasElement.querySelector('button[aria-label="b1_floor.pgm, 파일"]');
    if (!file?.disabled || file.hasAttribute('aria-pressed')) {
      throw new Error('선택할 수 없는 파일 행은 토글 상태를 갖지 않고 비활성이어야 합니다.');
    }
  },
};

export const ResourceStates = {
  name: '변형·상태 · 불러오기 · 오류와 빈 상태',
  parameters: storyDescription(
    '파일 목록을 불러오는 중이거나 실패했거나 비어 있는 경로를 비교하는 상황입니다. loading·error·empty가 구분되고 사용자가 다음 행동을 예측할 수 있는지 확인하세요.',
  ),
  render: () => <main style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}><FileBrowser path="/loading" loading /><FileBrowser path="/failed" error="목록을 불러오지 못했습니다." /><FileBrowser path="/empty" entries={[]} /></main>,
  play: async ({ canvasElement }) => {
    const browsers = [...canvasElement.querySelectorAll('[role="group"]')];
    if (browsers.length !== 3) throw new Error('ResourceStates must render the loading, error and empty surfaces.');
    const [loading, failed, empty] = browsers;
    if (loading.getAttribute('aria-busy') !== 'true' || loading.querySelector('[role="status"]')?.textContent?.trim() !== '항목을 불러오는 중입니다.') {
      throw new Error('불러오는 중 상태는 aria-busy와 polite status로 전달되어야 합니다.');
    }
    if (failed.querySelector('[role="alert"]')?.textContent?.trim() !== '목록을 불러오지 못했습니다.') {
      throw new Error('오류 상태는 alert로 전달되어야 합니다.');
    }
    if (empty.querySelector('li')?.textContent?.trim() !== '이 위치에 항목이 없습니다.') {
      throw new Error('빈 상태는 다음 행동을 예측할 수 있는 한국어 안내를 보여야 합니다.');
    }
    if (browsers.some((browser) => browser.querySelector('button[aria-label="상위 폴더로 이동"]')?.hasAttribute('disabled'))) {
      throw new Error('상위 이동 버튼은 비활성 상태에서도 native disabled로 Tab 순서에서 사라지면 안 됩니다.');
    }
  },
};
