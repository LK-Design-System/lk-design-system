import { userEvent } from 'storybook/test';
import { AnnotatedImage } from '../src/index.js';

const evidenceImage = '/assets/industry/ind-construction-hazard-patrol.webp';

const regions = [
  { id: 'worker', label: '작업자', score: 0.96, x: 0.18, y: 0.19, width: 0.18, height: 0.57 },
  { id: 'helmet', label: '안전모', score: 0.91, x: 0.2, y: 0.13, width: 0.11, height: 0.12, tone: 'positive' },
];

const points = [
  { id: 'heat', label: '모터 온도', value: 71, unit: '℃', x: 0.77, y: 0.67, tone: 'cautionary' },
];

const annotationArgs = {
  src: evidenceImage,
  alt: '건설 현장을 순찰하는 로봇의 카메라 프레임',
  caption: '프레임 00318 · 원본 비율 유지',
  regions,
  points,
};

async function waitForElement(canvasElement, selector) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const element = canvasElement.querySelector(selector);
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for ${selector}.`);
}

export default {
  title: 'LDS Product/Data/Annotated Image',
  component: AnnotatedImage,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 800 }}><Story /></div>],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '출처나 검토 흐름을 소유하지 않는 비대화형 이미지 주석 표시기입니다. 시각 표식과 같은 순서의 텍스트 요약을 함께 제공합니다.',
      },
    },
  },
};

export const DetectionAnnotations = {
  name: '영역과 측정 지점',
  args: annotationArgs,
};

export const AnnotationsHidden = {
  name: '주석 숨김',
  args: {
    ...annotationArgs,
    defaultAnnotationsVisible: false,
  },
};

export const KeyboardToggleAndTextAlternative = {
  name: '키보드 오버레이 제어와 텍스트 요약',
  args: {
    ...annotationArgs,
    defaultAnnotationsVisible: false,
  },
  play: async ({ canvasElement }) => {
    const toggle = await waitForElement(canvasElement, 'button[aria-label="주석 표시"]');
    const overlayId = toggle.getAttribute('aria-controls');
    const overlay = overlayId ? canvasElement.ownerDocument.getElementById(overlayId) : null;
    if (!overlay || toggle.getAttribute('aria-pressed') !== 'false' || !overlay.hidden) {
      throw new Error('The annotation toggle must expose and control the initially hidden overlay.');
    }

    toggle.focus();
    await userEvent.keyboard(' ');
    if (toggle.getAttribute('aria-pressed') !== 'true' || overlay.hidden) {
      throw new Error('Space must reveal the annotation overlay and update aria-pressed.');
    }

    const image = canvasElement.querySelector('img');
    const detailsId = image?.getAttribute('aria-details');
    const details = detailsId ? canvasElement.ownerDocument.getElementById(detailsId) : null;
    const summary = details?.querySelector('summary');
    if (!details || !summary) throw new Error('The image must reference its extended annotation summary.');
    await userEvent.click(summary);
    if (!details.open || details.querySelectorAll('ol > li').length !== regions.length + points.length) {
      throw new Error('The disclosed text alternative must preserve every visual annotation in marker order.');
    }
  },
};

export const NarrowDenseAnnotations = {
  name: '좁은 폭 · 번호 표식',
  args: {
    ...annotationArgs,
    regions: [
      ...regions,
      { id: 'barrier', label: '작업 구역 안전 차단선', x: 0.48, y: 0.54, width: 0.26, height: 0.18, tone: 'negative' },
    ],
    points: [
      ...points,
      { id: 'edge', label: '프레임 가장자리의 긴 측정 이름', value: 18, unit: ' cm', x: 0.96, y: 0.08 },
    ],
    labelDisplay: 'auto',
  },
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <AnnotatedImage {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await waitForElement(canvasElement, '.lk-annotated-image__label-text');
    const figure = canvasElement.querySelector('figure');
    const collapsibleLabels = [...canvasElement.querySelectorAll('[data-collapse="true"]')];
    if (!figure || figure.scrollWidth > figure.clientWidth + 1) {
      throw new Error('AnnotatedImage must not create horizontal overflow at 320px.');
    }
    if (collapsibleLabels.some((label) => getComputedStyle(label).display !== 'none')) {
      throw new Error('Auto labels must collapse to numbered markers in a narrow media container.');
    }
  },
};

export const NoImage = {
  name: '이미지 없음',
  args: {
    alt: '',
    src: null,
    emptyMessage: '선택한 evidence에 이미지가 없습니다.',
  },
};

export const MismatchedAspectRatio = {
  name: '이미지와 프레임 비율이 다른 맞춤 상태',
  args: {
    src: evidenceImage,
    alt: '정사각형 frame 안에 contain으로 표시된 건설 현장 이미지',
    aspectRatio: '1 / 1',
    objectFit: 'contain',
    caption: 'letterbox가 있어도 annotation은 실제 이미지 영역을 기준으로 배치됩니다.',
    regions: [{ id: 'worker', label: '작업자', x: 0.18, y: 0.19, width: 0.18, height: 0.57 }],
    points: [{ id: 'heat', label: '모터 온도', value: 71, unit: '℃', x: 0.77, y: 0.67 }],
  },
};

export const ImageError = {
  name: '이미지 로드 실패',
  args: {
    src: 'data:image/png;base64,AAAA',
    alt: '불러오지 못한 감지 frame',
    errorMessage: '감지 frame을 불러오지 못했습니다.',
  },
};
