import React from 'react';
import { userEvent } from 'storybook/test';
import { FileUpload, FileUploadQueue, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/File Upload Queue',
  tags: ['autodocs'],
  component: FileUploadQueue,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-file-upload-queue--upload-and-conversion',
      eyebrow: 'Product / File Upload Queue',
      title: '업로드 큐는 선택 이후의 처리 상태와 복구 동작을 파일별로 보여줍니다',
      description:
        '여러 파일이 업로드·변환·검증을 거치고 일부 항목만 다시 시도하거나 취소해야 할 때 적합합니다. 파일 하나를 고르는 진입점만 필요하면 File Upload를 사용하세요.',
    },
    docs: {
      description: {
        component: '파일 선택 이후 업로드, 변환, 검증, 부분 실패와 retry 상태를 파일별로 표시하는 queue 패턴입니다.',
      },
    },
  },
};

export default meta;

const items = [
  { id: '1', name: 'system-architecture.pdf', status: 'succeeded', sizeLabel: '4.8 MB' },
  { id: '2', name: 'operations-guide.docx', status: 'processing', progress: 72, message: 'Markdown으로 변환 중' },
  { id: '3', name: 'legacy-report.hwp', status: 'failed', message: '지원하지 않는 문서 형식' },
];

const narrowItems = [
  { id: 'narrow-complete', name: '현장_AMR_운영_절차서_최종_검토본_2026-07-11.pdf', status: 'succeeded', sizeLabel: '18.4 MB' },
  { id: 'narrow-progress', name: '다중_카메라_캘리브레이션_데이터_변환_진행중_원본.zip', status: 'processing', progress: 64, message: '좌표계와 메타데이터를 변환하는 중' },
  { id: 'narrow-error', name: '기존_시설_지도_좌표계_변환_실패_보고서_수정본.hwp', status: 'failed', message: '좌표계 메타데이터를 읽을 수 없습니다.' },
];

function UploadAndConversionExample() {
  const [queue, setQueue] = React.useState(items);
  const nextId = React.useRef(0);
  const update = (target, patch) => {
    setQueue((current) => current.map((item) => item.id === target.id ? { ...item, ...patch } : item));
  };

  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 720 }}>
      <FileUpload
        multiple
        accept=".pdf,.doc,.docx,.hwp"
        hint="문서를 끌어다 놓거나 선택하세요"
        onFiles={(files) => {
          setQueue((current) => [
            ...current,
            ...files.map((file) => ({
              id: `${file.name}-${file.lastModified}-${nextId.current++}`,
              name: file.name,
              status: 'queued',
              sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            })),
          ]);
        }}
        onRejectedFiles={(files) => {
          setQueue((current) => [
            ...current,
            ...files.map((file) => ({
              id: `rejected-${file.name}-${file.lastModified}-${nextId.current++}`,
              name: file.name,
              status: 'failed',
              message: '허용되지 않는 파일 형식 또는 개수입니다.',
            })),
          ]);
        }}
      />
      <FileUploadQueue
        items={queue}
        onRetry={(item) => update(item, { status: 'processing', progress: undefined, message: '다시 처리 중' })}
        onCancel={(item) => update(item, { status: 'queued', progress: undefined, message: '처리가 취소되었습니다.' })}
        onRemove={(item) => setQueue((current) => current.filter((entry) => entry.id !== item.id))}
        onOpen={(item) => update(item, { message: '열기 요청됨' })}
      />
    </main>
  );
}

export const UploadAndConversion = {
  name: '개요',
  parameters: storyDescription(
    '새 파일을 선택해 queue에 추가하고 성공·처리 중·실패 항목의 복구 action을 검증합니다. 간결한 header 아래에서 각 행의 badge·progress·message·action이 처리 상태를 설명하는지 확인하세요.',
  ),
  render: () => <UploadAndConversionExample />,
  play: async ({ canvasElement }) => {
    const queue = canvasElement.querySelector('.lk-file-upload-queue');
    if (!queue) throw new Error('FileUploadQueue root is missing.');

    const header = queue.querySelector('header');
    if (!header || !header.textContent?.includes('파일 처리')) {
      throw new Error('FileUploadQueue header must keep its queue title.');
    }

    // The live region is mounted once on the queue root, not inside the header, so a layout
    // switch cannot unmount the region that carries the announcement.
    const liveSummary = queue.querySelector('.lk-file-upload-queue__live-summary[role="status"]');
    const liveSummaryStyle = liveSummary ? getComputedStyle(liveSummary) : null;
    if (liveSummary?.textContent?.trim() !== '진행 1개, 완료 1개, 실패 1개'
      || liveSummary.hasAttribute('aria-label')
      || liveSummaryStyle?.width !== '1px'
      || liveSummaryStyle?.height !== '1px') {
      throw new Error('Queue counts must remain available to assistive technology as live region text, without a duplicate aria-label or visible header badges.');
    }

    const fileNames = Array.from(queue.querySelectorAll('.lk-file-upload-queue__item strong'))
      .map((name) => name.textContent?.trim());
    for (const expectedName of ['system-architecture.pdf', 'operations-guide.docx', 'legacy-report.hwp']) {
      if (!fileNames.includes(expectedName)) {
        throw new Error(`FileUploadQueue must keep the file name visible: ${expectedName}`);
      }
    }

    const fileIcons = Array.from(queue.querySelectorAll('.lk-file-upload-queue__file-icon'));
    const iconTreatments = new Set(fileIcons.map((icon) => {
      const computed = getComputedStyle(icon);
      return `${computed.color}|${computed.backgroundColor}`;
    }));
    if (fileIcons.length !== fileNames.length || iconTreatments.size !== 1) {
      throw new Error('File identity icons must keep one neutral treatment across queue states.');
    }

    const progress = queue.querySelector('[role="progressbar"][aria-label="operations-guide.docx 처리 중"]');
    if (progress?.getAttribute('aria-valuenow') !== '72') {
      throw new Error('FileUploadQueue must expose determinate per-file progress.');
    }
    const progressLayout = progress?.closest('.lk-file-upload-queue__progress');
    const progressHeader = progressLayout?.firstElementChild;
    if (progressHeader?.textContent?.replace(/\s+/g, ' ').trim() !== 'Markdown으로 변환 중 72%') {
      throw new Error('The busy message and determinate value must share the progress header.');
    }
    if (progressHeader.getBoundingClientRect().bottom > progress.getBoundingClientRect().top) {
      throw new Error('The progress label and value must stay above the track.');
    }

    const actionNames = Array.from(queue.querySelectorAll('button'))
      .map((button) => button.getAttribute('aria-label'));
    for (const expectedAction of [
      'system-architecture.pdf 열기',
      'system-architecture.pdf 목록에서 제거',
      'operations-guide.docx 처리 취소',
      'legacy-report.hwp 다시 시도',
      'legacy-report.hwp 제거',
    ]) {
      if (!actionNames.includes(expectedAction)) {
        throw new Error(`FileUploadQueue actions must include the file name: ${expectedAction}`);
      }
    }

    const surfaces = [queue, ...queue.querySelectorAll('.lk-file-upload-queue__item')];
    const overflowing = surfaces.find((surface) => surface.scrollWidth > surface.clientWidth + 1);
    if (overflowing) {
      throw new Error('FileUploadQueue must not introduce horizontal overflow.');
    }
  },
};

export const QueueStates = {
  name: '변형·상태 · 대기 · 업로드와 빈 상태',
  parameters: storyDescription(
    '대기·업로드 진행 항목이 있는 queue와 완료 후 비어 있는 queue를 비교합니다. progress가 필요한 상태와 empty message가 동시에 나타나지 않고 다음 행동이 분명한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}>
      <FileUploadQueue
        data-testid="queue-states-active"
        items={[
          { id: 'queued', name: 'queued-map.pgm', status: 'queued' },
          { id: 'uploading', name: 'point-cloud.pcd', status: 'uploading', progress: 38 },
        ]}
        onCancel={() => {}}
        onRemove={() => {}}
      />
      <FileUploadQueue data-testid="queue-states-empty" title="완료된 큐" items={[]} emptyLabel="처리 중인 파일이 없습니다." />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const activeQueue = canvasElement.querySelector('[data-testid="queue-states-active"]');
    const busyRow = activeQueue?.querySelector('.lk-file-upload-queue__item:nth-child(2)');
    const progress = busyRow?.querySelector('[role="progressbar"]');
    const cancel = busyRow?.querySelector('.lk-file-upload-queue__actions');
    if (!activeQueue || !busyRow || !progress || !cancel) {
      throw new Error('Queue states must render the busy row, progress, and trailing cancel action.');
    }
    if (activeQueue.clientWidth > 360) {
      const rowRect = busyRow.getBoundingClientRect();
      const cancelRect = cancel.getBoundingClientRect();
      const rowCenter = rowRect.top + (rowRect.height / 2);
      const cancelCenter = cancelRect.top + (cancelRect.height / 2);
      if (Math.abs(rowCenter - cancelCenter) > 2) {
        throw new Error('At normal queue widths, cancel must stay vertically centered in the trailing action column.');
      }
    }

    const emptyQueue = canvasElement.querySelector('[data-testid="queue-states-empty"]');
    const emptyHeader = emptyQueue?.querySelector('header');
    const emptyBody = emptyQueue?.querySelector('.lk-file-upload-queue__empty');
    const emptyText = emptyBody?.querySelector('span');
    if (!emptyQueue || !emptyHeader || !emptyBody || !emptyText) {
      throw new Error('The empty queue must preserve its header and empty-state body.');
    }
    const queueRect = emptyQueue.getBoundingClientRect();
    const headerRect = emptyHeader.getBoundingClientRect();
    const textRect = emptyText.getBoundingClientRect();
    const contentCenter = headerRect.bottom + ((queueRect.bottom - headerRect.bottom) / 2);
    const textCenter = textRect.top + (textRect.height / 2);
    if (Math.abs(contentCenter - textCenter) > 2) {
      throw new Error('The empty message must remain centered in the available queue body.');
    }
  },
};

export const NarrowQueue = {
  name: '반응형 · 좁은 폭의 진행과 동작',
  parameters: storyDescription(
    '320px 폭에서 긴 파일명, 진행률, 실패 message, retry·cancel·remove·open action을 함께 보여줍니다. 정보 우선순위와 모든 행 동작이 잘림 없이 유지되는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <FileUploadQueue
        items={narrowItems}
        onRetry={() => {}}
        onCancel={() => {}}
        onRemove={() => {}}
        onOpen={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const queue = canvasElement.querySelector('.lk-file-upload-queue');
    const rows = queue ? Array.from(queue.querySelectorAll('.lk-file-upload-queue__item')) : [];
    if (!queue || rows.length !== narrowItems.length) {
      throw new Error('The narrow queue must preserve every file row.');
    }
    if ([queue, ...rows].some((surface) => surface.scrollWidth > surface.clientWidth + 1)) {
      throw new Error('FileUploadQueue must not create horizontal overflow at 320px.');
    }
    const renderedNames = Array.from(queue.querySelectorAll('.lk-file-upload-queue__item strong'));
    for (const item of narrowItems) {
      if (!renderedNames.some((name) => name.textContent?.trim() === item.name)) {
        throw new Error(`The narrow queue must keep the full file name in the DOM: ${item.name}`);
      }
    }
    if (!renderedNames.some((name) => name.scrollWidth > name.clientWidth + 1)) {
      throw new Error('At least one long file name must exercise the ellipsis contract at 320px.');
    }

    const progressName = narrowItems[1].name;
    const progress = queue.querySelector(`[role="progressbar"][aria-label="${progressName} 처리 중"]`);
    if (progress?.getAttribute('aria-valuenow') !== '64') {
      throw new Error('The narrow queue must keep determinate per-file progress visible.');
    }
    const progressHeader = progress?.closest('.lk-file-upload-queue__progress')?.firstElementChild;
    if (!progressHeader?.textContent?.includes('좌표계와 메타데이터를 변환하는 중')
      || !progressHeader.textContent.includes('64%')) {
      throw new Error('The narrow queue must keep the busy label and percentage together above the track.');
    }
    if (!queue.textContent?.includes('좌표계 메타데이터를 읽을 수 없습니다.')) {
      throw new Error('The narrow queue must keep the file-level error message visible.');
    }

    const expectedActions = [
      `${narrowItems[0].name} 열기`,
      `${narrowItems[0].name} 목록에서 제거`,
      `${narrowItems[1].name} 처리 취소`,
      `${narrowItems[2].name} 다시 시도`,
      `${narrowItems[2].name} 제거`,
    ];
    const actions = Array.from(queue.querySelectorAll('button'));
    for (const actionName of expectedActions) {
      if (!actions.some((action) => action.getAttribute('aria-label') === actionName)) {
        throw new Error(`The narrow queue must preserve its row action: ${actionName}`);
      }
    }
    for (const action of actions) {
      const target = action.getBoundingClientRect();
      if (target.width < 32 || target.height < 32) {
        throw new Error('Narrow queue actions must preserve at least a 32px target.');
      }
    }
    const actionGroups = Array.from(queue.querySelectorAll('.lk-file-upload-queue__actions'));
    if (actionGroups.length !== narrowItems.length || actionGroups.some((group) => getComputedStyle(group).gridColumnStart !== '2')) {
      throw new Error('Narrow queue actions must wrap below row content in the second grid column.');
    }
  },
};

const photo = (hue) => `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" fill="${hue}"/>
    <circle cx="86" cy="34" r="22" fill="#ffffff" opacity="0.55"/>
    <path d="M0 96 L40 60 L74 94 L96 76 L120 100 L120 120 L0 120 Z" fill="#ffffff" opacity="0.35"/>
  </svg>
`)}`;

export const MediaAttachments = {
  name: '변형·상태 · 미디어 첨부(썸네일)',
  parameters: storyDescription(
    '사진·영상을 첨부해 대표 이미지를 고르는 상황입니다. 미디어는 파일명보다 그림으로 식별되므로 행 목록 대신 썸네일 타일로 깔고, 진행률이 이미지 위 오버레이에 얹히는지, 상태 어휘와 액션 접근 이름은 목록형과 동일한지 확인하세요.',
  ),
  render: () => (
    <FileUploadQueue
      layout="grid"
      title="사진 첨부"
      trigger={(
        <button
          type="button"
          aria-label="사진 추가, 10장 중 3장 선택됨"
          style={{
            width: '100%', aspectRatio: '1 / 1',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)',
            border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)',
            background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-neutral)',
            font: 'inherit', cursor: 'pointer',
          }}
        >
          <Icon name="camera" size={22} aria-hidden="true" />
          <span aria-hidden="true" style={{ fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}>3/10</span>
        </button>
      )}
      items={[
        { id: 'a', name: '현장_01.jpg', status: 'succeeded', thumbnailSrc: photo('#2b8a3e'), primary: true, sizeLabel: '1.2MB' },
        { id: 'b', name: '현장_02.jpg', status: 'uploading', progress: 62, thumbnailSrc: photo('#1f6feb') },
        { id: 'c', name: '현장_03.jpg', status: 'failed', thumbnailSrc: photo('#d9480f'), message: '업로드에 실패했습니다.' },
        { id: 'd', name: '법인사업자등록증.pdf', status: 'succeeded', sizeLabel: '20.5KB' },
      ]}
      onRetry={() => {}}
      onCancel={() => {}}
      onRemove={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const tiles = canvasElement.querySelectorAll('.lk-file-upload-queue__item--grid');
    if (tiles.length !== 4) throw new Error('grid 레이아웃은 항목마다 썸네일 타일을 렌더해야 합니다.');
    // 스트립은 카드 크롬 없이 인라인으로 놓이고, 트리거가 맨 앞에 온다.
    const strip = canvasElement.querySelector('.lk-file-upload-queue');
    if (getComputedStyle(strip).borderTopWidth !== '0px' || strip.querySelector('header')) {
      throw new Error('미디어 스트립은 패널 테두리와 보이는 헤더 없이 렌더되어야 합니다.');
    }
    if (!strip.querySelector('.lk-file-upload-queue__live-summary')) {
      throw new Error('크롬을 없애도 polite 라이브 리전은 유지되어야 합니다.');
    }
    const triggerCell = strip.querySelector('li[role="presentation"]');
    if (!triggerCell || !triggerCell.querySelector('button')) {
      throw new Error('trigger는 스트립 맨 앞 셀에 렌더되어야 합니다.');
    }
    if (triggerCell !== strip.querySelector('ul').firstElementChild) {
      throw new Error('trigger 셀이 첨부 타일보다 앞에 와야 합니다.');
    }
    // 이름이 항목을 설명하므로 썸네일 이미지는 장식이어야 한다.
    const images = canvasElement.querySelectorAll('.lk-file-upload-queue__item--grid img');
    if (images.length !== 3) throw new Error('thumbnailSrc가 있는 항목만 이미지를 렌더해야 합니다.');
    for (const img of images) {
      if (img.getAttribute('alt') !== '') throw new Error('썸네일 이미지는 장식(alt="")이어야 합니다.');
      if (img.getAttribute('loading') !== 'lazy') throw new Error('썸네일은 지연 로드되어야 합니다.');
    }
    // 진행 중 타일의 진행률은 파일명이 붙은 접근 이름을 가진다.
    const progress = canvasElement.querySelector('[role="progressbar"]');
    if (!progress || !/현장_02\.jpg/.test(progress.getAttribute('aria-label') || '')) {
      throw new Error('진행률에는 파일명이 포함된 접근 이름이 있어야 합니다.');
    }
    // 첨부는 자기를 식별하는 것으로 그려진다: 사진은 정사각 타일, 문서는 이름·용량 칩.
    const mediaTiles = canvasElement.querySelectorAll('.lk-file-upload-queue__item--media');
    const fileChips = canvasElement.querySelectorAll('.lk-file-upload-queue__item--file');
    if (mediaTiles.length !== 3 || fileChips.length !== 1) {
      throw new Error('썸네일이 있는 항목은 미디어 타일로, 없는 항목은 파일 칩으로 렌더되어야 합니다.');
    }
    const chipText = fileChips[0].textContent;
    if (!/법인사업자등록증\.pdf/.test(chipText) || !/20\.5KB/.test(chipText)) {
      throw new Error('파일 칩은 이름과 용량을 눈에 보이게 표시해야 합니다(이름으로 식별되므로).');
    }
    // 대표 배지와 액션 접근 이름은 목록형과 동일한 계약을 따른다.
    if (!/대표/.test(canvasElement.textContent)) throw new Error('primary 항목에는 대표 배지가 붙어야 합니다.');
    const labels = [...canvasElement.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') || '');
    if (!labels.some((l) => /현장_03\.jpg 다시 시도/.test(l))) {
      throw new Error('실패 항목의 다시 시도 액션은 파일명을 접근 이름에 포함해야 합니다.');
    }
  },
};
