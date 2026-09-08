import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  ColorSwatch,
  DotMatrixPreview,
  Input,
  Slider,
  StatusBadge,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Viewer/Dot Matrix Preview',
  tags: ['autodocs'],
  component: DotMatrixPreview,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-viewer-dot-matrix-preview--panel-preview',
      eyebrow: 'Product / Viewer / Dot Matrix Preview',
      title: '사용자가 저해상도 패널에 문구가 어떻게 보일지 보내기 전에 확인합니다',
      description:
        '로봇 측면 LED 사인, 순찰 안내판처럼 고정 격자 1비트 패널의 프레임을 실제 색·밝기로 미리 볼 때 적합합니다. 카메라·지도처럼 연속 이미지 소스에는 Viewer Frame이나 Video Stream Tile을 사용하세요.',
    },
    docs: {
      description: {
        component: '1비트 프레임을 물리 패널처럼 그리고 문구를 접근 가능한 텍스트로 함께 제공하는 DotMatrixPreview 패턴입니다. 문구를 비트맵으로 굽는 일과 전송은 제품이 소유합니다.',
      },
    },
  },
};

export default meta;

const COLUMNS = 128;
const ROWS = 32;

/* Story-only rasteriser: the product owns its font and line policy. */
function rasterize(text, columns = COLUMNS, rows = ROWS) {
  const pixels = new Array(columns * rows).fill(0);
  if (typeof document === 'undefined') return pixels;
  const canvas = document.createElement('canvas');
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return pixels;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, columns, rows);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = 26;
  do {
    ctx.font = `700 ${size}px monospace`;
    if (ctx.measureText(text).width <= columns - 4) break;
    size -= 1;
  } while (size > 8);
  ctx.fillText(text, columns / 2, rows / 2 + 1);
  const data = ctx.getImageData(0, 0, columns, rows).data;
  for (let index = 0; index < columns * rows; index += 1) {
    if (data[index * 4] >= 112) pixels[index] = 1;
  }
  return pixels;
}

const PALETTE = ['#ffdd00', '#ff3b30', '#34c759', '#ffffff', '#b400ff'];

export const PanelPreview = {
  name: '개요',
  parameters: storyDescription(
    '로봇 왼쪽·오른쪽 LED 패널에 같은 안전 문구가 노란색·밝기 60으로 표시된 상황입니다. 격자 픽셀이 뭉개지지 않고, 문구·크기·밝기가 텍스트로도 읽히며, 연결 상태가 패널 이름 옆에 붙는지 확인하세요.',
  ),
  render: () => {
    const pixels = rasterize('LK PATROL');
    return (
      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 880, minWidth: 0 }}>
        <DotMatrixPreview data-testid="panel-left" label="로봇 왼쪽 LED" pixels={pixels} color="#ffdd00" brightness={60} description="LK PATROL" status={<StatusBadge tone="positive">MCU 연결됨</StatusBadge>} />
        <DotMatrixPreview data-testid="panel-right" label="로봇 오른쪽 LED" pixels={pixels} color="#ffdd00" brightness={255} description="LK PATROL" status={<StatusBadge tone="positive">MCU 연결됨</StatusBadge>} />
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const left = canvasElement.querySelector('[data-testid="panel-left"] canvas');
    const right = canvasElement.querySelector('[data-testid="panel-right"] canvas');
    if (!left || left.getAttribute('role') !== 'img' || !left.getAttribute('aria-label')?.includes('로봇 왼쪽 LED: LK PATROL, 밝기 24%')) {
      throw new Error('The preview canvas must be an image with the panel name, message and brightness in its accessible name.');
    }
    await waitFor(() => {
      if (Number(left.dataset.litPixels) <= 0 || left.width !== COLUMNS * 6 || left.height !== ROWS * 6) {
        throw new Error('The preview must rasterise the frame onto a fixed 6px-per-dot grid with lit pixels.');
      }
    });
    const sample = (node) => {
      const ctx = node.getContext('2d');
      const { data } = ctx.getImageData(0, 0, node.width, node.height);
      let brightest = 0;
      for (let index = 0; index < data.length; index += 4) brightest = Math.max(brightest, data[index]);
      return brightest;
    };
    await waitFor(() => {
      const dim = sample(left);
      const full = sample(right);
      if (!(full > dim && full >= 250 && dim > 40 && dim < 80)) {
        throw new Error('Brightness must scale the lit colour so a 60/255 panel renders darker than a full-brightness panel.');
      }
    });
    const summary = canvasElement.querySelector('[data-testid="panel-left"] [data-slot="summary"]');
    if (!summary?.textContent?.includes('LK PATROL') || !summary.textContent.includes('128×32')) {
      throw new Error('The summary row must repeat the message and the panel geometry in text.');
    }
  },
};

function EditorFixture() {
  const [text, setText] = React.useState('SAFETY');
  const [color, setColor] = React.useState('#ffdd00');
  const [brightness, setBrightness] = React.useState(60);
  const [applied, setApplied] = React.useState('전송 없음');
  const pixels = React.useMemo(() => rasterize(text), [text]);
  const empty = !pixels.some(Boolean);
  return (
    <main data-testid="editor-fixture" style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 720, minWidth: 0 }}>
      <Input label="패널 문구" value={text} onChange={(event) => setText(event.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        <Slider aria-label="밝기" min={0} max={255} value={brightness} onChange={setBrightness} showValue />
        <ColorSwatch label="글자 색" colors={PALETTE} value={color} onChange={setColor} />
      </div>
      <DotMatrixPreview data-testid="editor-preview" label="로봇 왼쪽 LED" pixels={pixels} color={color} brightness={brightness} description={text} status={<StatusBadge tone="positive">MCU 연결됨</StatusBadge>} />
      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
        <Button type="button" disabled={empty} onClick={() => setApplied(`전송: ${text} / ${color} / ${brightness}`)}>LED 변경</Button>
      </div>
      <p data-testid="editor-result" role="status" style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{applied}</p>
    </main>
  );
}

export const EditorComposition = {
  name: '사용법 · LED 문구 편집 조합',
  parameters: storyDescription(
    '문구 입력, 밝기 Slider, 색 ColorSwatch, 미리보기, 적용 Button을 조합한 편집기입니다. 입력이 바뀌면 미리보기와 접근 가능한 이름이 함께 갱신되고, 빈 문구에서는 적용이 막히며, 전송은 명시적 action으로만 일어나는지 확인하세요.',
  ),
  render: () => <EditorFixture />,
  play: async ({ canvasElement }) => {
    const preview = canvasElement.querySelector('[data-testid="editor-preview"]');
    const canvas = preview?.querySelector('canvas');
    const input = canvasElement.querySelector('input[type="text"], input:not([type])');
    const apply = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'LED 변경');
    if (!preview || !canvas || !input || !apply) throw new Error('The editor composition must expose the input, preview and apply action.');
    if (!canvas.getAttribute('aria-label')?.includes('SAFETY') || apply.disabled) throw new Error('The initial message must be previewed and applicable.');
    await userEvent.clear(input);
    await waitFor(() => {
      if (!preview.hasAttribute('data-empty') || !apply.disabled) throw new Error('An empty message must mark the preview empty and disable the apply action.');
    });
    await userEvent.type(input, 'HELLO');
    await waitFor(() => {
      if (!canvas.getAttribute('aria-label')?.includes('HELLO') || Number(canvas.dataset.litPixels) <= 0) {
        throw new Error('Typing must re-rasterise the preview and update its accessible name.');
      }
    });
    await userEvent.click(apply);
    if (!canvasElement.querySelector('[data-testid="editor-result"]')?.textContent?.startsWith('전송: HELLO')) {
      throw new Error('Applying must delegate to the product callback with the current frame settings.');
    }
    if (canvasElement.querySelector('[data-testid="editor-fixture"]').scrollWidth > canvasElement.querySelector('[data-testid="editor-fixture"]').clientWidth + 1) {
      throw new Error('The editor composition must not overflow horizontally.');
    }
  },
};

export const NarrowAndOffline = {
  name: '반응형 · 320px와 연결 끊김',
  parameters: storyDescription(
    '320px 폭에서 128×32 패널이 4:1 비율을 유지하며 넘치지 않는지, 연결이 끊긴 패널이 상태 배지와 꺼진 화면 요약으로 구분되는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="narrow-fixture" style={{ display: 'grid', gap: 'var(--space-4)', width: 320, maxWidth: '100%', minWidth: 0 }}>
      <DotMatrixPreview data-testid="narrow-lit" label="로봇 왼쪽 LED" pixels={rasterize('LK')} color="#34c759" brightness={200} description="LK" status={<StatusBadge tone="positive">MCU 연결됨</StatusBadge>} />
      <DotMatrixPreview data-testid="narrow-off" label="로봇 오른쪽 LED" columns={128} rows={32} color="#34c759" brightness={200} status={<StatusBadge tone="offline">MCU 연결 대기</StatusBadge>} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="narrow-fixture"]');
    if (fixture.scrollWidth > fixture.clientWidth + 1) throw new Error('Panels must not overflow a 320px container.');
    const lit = fixture.querySelector('[data-testid="narrow-lit"] canvas');
    const rect = lit.getBoundingClientRect();
    if (Math.abs(rect.width / rect.height - 4) > 0.1) throw new Error('A 128×32 panel must keep its 4:1 aspect ratio when scaled down.');
    const off = fixture.querySelector('[data-testid="narrow-off"]');
    if (!off?.hasAttribute('data-empty') || !off.querySelector('canvas')?.getAttribute('aria-label')?.includes('꺼진 화면')) {
      throw new Error('A frame without lit dots must announce the empty screen.');
    }
  },
};

export const DotMatrixPreviewCard = {
  name: 'DotMatrixPreview card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 720, height: 420, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <DotMatrixPreview label="로봇 왼쪽 LED" pixels={rasterize('LK PATROL')} color="#ffdd00" brightness={60} description="LK PATROL" status={<StatusBadge tone="positive">MCU 연결됨</StatusBadge>} />
        <DotMatrixPreview label="로봇 오른쪽 LED" columns={128} rows={32} color="#ffdd00" brightness={60} status={<StatusBadge tone="offline">MCU 연결 대기</StatusBadge>} />
      </div>
    </div>
  ),
};
