import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { VideoPlaybackControls } from '../components/viz/VideoPlaybackControls.jsx';
import { ViewerToolbar, ViewerToolbarButton } from '../components/viz/ViewerToolbar.jsx';
import { Icon } from '../components/icon/Icon.jsx';
import { VideoStreamTile } from '../packages/product/src/components/viz/VideoStreamTile.jsx';
import warehouseVideoFrame from './fixtures/video-stream-warehouse-frame.png';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Viewer/Video Playback Controls',
  component: VideoPlaybackControls,
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-viewer-video-playback-controls--overview',
      eyebrow: 'Product / Video Playback Controls',
      title: '녹화 영상의 재생 상태와 탐색 위치를 한 곳에서 조작합니다',
      description: '재생 위치를 탐색하는 데 적합한 녹화 영상 조작입니다. 실시간 피드만 표시할 때는 영상 스트림을 사용하세요. 재생 상태와 권한, 원본 촬영 시각은 제품이 관리합니다.',
    },
    docs: { description: { component: 'VideoPlaybackControls는 controlled 재생 조작입니다. Native range의 키보드를 유지하며, 실제 영상 요소와 재생 성공 여부는 소비자가 관리합니다.' } },
  },
};
export default meta;

function Controlled({ width = 760, appearance = 'on-dark', footage = false, ...props }) {
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [currentTime, setTime] = React.useState(83);
  const [seekCount, setSeekCount] = React.useState(0);
  const controls = <VideoPlaybackControls appearance={appearance} duration={3600} currentTime={currentTime}
      playing={playing} muted={muted} fullscreen={fullscreen}
      onPlayingChange={setPlaying} onSeek={(value) => { setTime(value); setSeekCount((count) => count + 1); }} onMutedChange={setMuted} onFullscreenChange={setFullscreen} {...props} />;
  return <div data-seek-count={seekCount} style={{ width: '100%', maxWidth: width, minWidth: 0 }}>
    {footage ? <VideoStreamTile label="창고 카메라" state="ready">
      <img src={warehouseVideoFrame} alt="창고 영상 프레임" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', insetInline: 0, bottom: 0 }}>{controls}</div>
    </VideoStreamTile> : controls}
  </div>;
}

export const Overview = {
  name: '개요',
  parameters: storyDescription('한 시간 길이의 녹화에서 재생·음소거·전체 화면 요청과 seek 위치를 조작합니다. 실제 transport 없이 controlled callback과 읽기 순서를 확인합니다.'),
  render: () => <Controlled footage variant="embedded" />,
  play: async ({ canvasElement }) => {
    const play = canvasElement.querySelector('button[aria-label="영상 재생"]');
    if (!play) throw new Error('Play command must have a visible-control accessible name.');
    await userEvent.click(play);
    await waitFor(() => { if (!canvasElement.querySelector('button[aria-label="영상 일시 정지"]')) throw new Error('Controlled play request must reconcile.'); });
    await userEvent.click(canvasElement.querySelector('button[aria-label="음소거 해제"]'));
    await waitFor(() => { if (!canvasElement.querySelector('button[aria-label="음소거"]')) throw new Error('Controlled mute request must reconcile.'); });
    const slider = canvasElement.querySelector('input[type="range"]');
    if (!slider || slider.disabled || slider.max !== '3600' || !slider.getAttribute('aria-valuetext')?.includes('1분 23초')) throw new Error('Seek must expose native range and spoken elapsed/duration.');
    const controls = [...canvasElement.querySelectorAll('button,input')];
    if (controls[1] !== slider || canvasElement.querySelector('[role="toolbar"]')) throw new Error('Seek keyboard must not be captured by roving toolbar.');
  },
};

export const VariantsStates = {
  name: '변형·상태 · 표면과 가용성',
  parameters: storyDescription('일반 표면·inverse·buffering·미확보 길이·비활성 조작을 비교합니다. 로딩은 가용성과 독립이며, 미확보 길이는 0으로 표시하지 않습니다.'),
  render: () => <div style={{ width: '100%', maxWidth: 760, display: 'grid', gap: 'var(--space-4)' }}>
    <Controlled appearance="surface" />
    <Controlled appearance="minimal" />
    <Controlled loading playing />
    <Controlled duration={null} currentTime={0} />
    <Controlled disabled />
    <ViewerToolbar orientation="horizontal" appearance="on-dark" label="비교할 뷰포트 명령">
      <ViewerToolbarButton label="확대"><Icon name="plus" size={16} /></ViewerToolbarButton>
      <ViewerToolbarButton label="전체 보기"><Icon name="maximize" size={16} /></ViewerToolbarButton>
    </ViewerToolbar>
  </div>,
  play: async ({ canvasElement }) => {
    const groups = [...canvasElement.querySelectorAll('[data-video-playback-appearance]')];
    if (groups.length !== 5) throw new Error('Expected all five playback state specimens.');
    if (groups[2].getAttribute('aria-busy') !== 'true' || groups[2].querySelector('input').disabled) throw new Error('Buffering and availability must remain independent.');
    if (!groups[3].querySelector('input').disabled || !groups[3].textContent.includes('—')) throw new Error('Unknown duration must disable seek and remain unknown.');
    if ([...groups[4].querySelectorAll('button,input')].some((element) => !element.disabled)) throw new Error('Disabled controls must not remain executable.');
  },
};

export const Dark = {
  ...Overview,
  name: '변형·상태 · 다크 테마',
  globals: { backgrounds: { value: 'dark' } },
  parameters: storyDescription('다크 테마의 일반 표면·최소 chrome·inverse 상태를 비교합니다. 재생바는 외부 테마에서 native controls의 스타일을 끌어오지 않고 LDS 토큰으로 표현합니다.'),
};

export const UnknownDuration = {
  name: '변형·상태 · 전체 시간 미확인',
  parameters: storyDescription('길이가 미확보·무한·0·유효하지 않은 경우에도 이미 확인된 경과 시간은 유지합니다. 전체 시간만 결측으로 표시하고 탐색을 비활성화합니다.'),
  render: () => <div style={{ width: '100%', maxWidth: 760, display: 'grid', gap: 'var(--space-4)' }}>
    {[undefined, Infinity, 0, NaN].map((duration, index) => <Controlled key={index} duration={duration} />)}
  </div>,
  play: async ({ canvasElement }) => {
    const groups = [...canvasElement.querySelectorAll('[data-video-playback-appearance]')];
    if (groups.length !== 4) throw new Error('Expected four unavailable-duration specimens.');
    for (const group of groups) {
      if (!group.querySelector('[data-video-playback-time]')?.getAttribute('title')?.includes('1:23 / —') || !group.querySelector('input').disabled) throw new Error('Known elapsed time must survive unknown duration without an invented total.');
    }
  },
};

export const Narrow = {
  name: '반응형 · 좁은 폭',
  parameters: storyDescription('320px 영상에서 한 줄 조작과 28px 명령을 유지합니다. 좁은 폭에는 경과 시간을 표시하고 전체 시간은 seek의 접근성 이름과 시간 도움말에 보존합니다.'),
  render: () => <Controlled width={320} footage variant="embedded" currentTime={86398} duration={86399} />,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-video-playback-appearance]');
    if (group.scrollWidth > group.clientWidth + 1) throw new Error('Playback controls must fit 320px without horizontal overflow.');
    for (const command of group.querySelectorAll('button')) {
      if (command.getBoundingClientRect().width < 24 || command.getBoundingClientRect().height < 24) throw new Error('Control targets must stay at least 24px.');
    }
  },
};
