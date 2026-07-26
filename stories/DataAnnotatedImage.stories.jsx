import { userEvent } from 'storybook/test';
import { AnnotatedImage } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const evidenceImage = './assets/industry/ind-construction-hazard-patrol.webp';

const regions = [
  { id: 'safety-net', label: '안전 방호망', score: 0.93, x: 0.14, y: 0.27, width: 0.2, height: 0.5, tone: 'positive' },
  { id: 'excavator', label: '굴착기 작업 구역', score: 0.97, x: 0.6, y: 0.28, width: 0.23, height: 0.27, tone: 'cautionary' },
];

const points = [
  { id: 'heat', label: '모터 온도', value: 71, unit: '℃', x: 0.42, y: 0.69, tone: 'cautionary' },
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

async function openAnnotationSummary(canvasElement) {
  const image = canvasElement.querySelector('img');
  const disclosureId = image?.getAttribute('aria-details');
  const disclosure = disclosureId ? canvasElement.ownerDocument.getElementById(disclosureId) : null;
  const trigger = disclosure?.querySelector('button[aria-expanded]');
  if (!disclosure || !trigger || disclosure.dataset.density !== 'compact') {
    throw new Error('The image must reference the compact annotation disclosure.');
  }

  const disclosureBounds = disclosure.getBoundingClientRect();
  const captionBounds = disclosure.parentElement.getBoundingClientRect();
  const before = trigger.getBoundingClientRect();
  const contentWidthTrigger = before.width < disclosureBounds.width - 1;
  const endAligned = Math.abs(before.right - disclosureBounds.right) <= 1;
  const contentWidthDisclosure = disclosureBounds.width < captionBounds.width - 1;
  const sameMetadataRow = Math.abs(before.top - captionBounds.top) <= 1;
  await userEvent.click(trigger);
  await new Promise((resolve) => canvasElement.ownerDocument.defaultView.requestAnimationFrame(resolve));
  const after = trigger.getBoundingClientRect();
  const panel = disclosure.querySelector('[role="region"]');
  const panelBounds = panel?.getBoundingClientRect();
  const moved = Math.abs(before.x - after.x) > 1
    || Math.abs(before.y - after.y) > 1
    || Math.abs(before.width - after.width) > 1;
  const panelEndAligned = panelBounds
    && panelBounds.width <= disclosureBounds.width + 1
    && Math.abs(panelBounds.right - disclosureBounds.right) <= 1;

  if (trigger.getAttribute('aria-expanded') !== 'true'
    || disclosure.querySelectorAll('ol > li').length !== regions.length + points.length
    || !contentWidthTrigger
    || !endAligned
    || !contentWidthDisclosure
    || !sameMetadataRow
    || !panelEndAligned
    || moved) {
    throw new Error('The disclosed text alternative must keep its content-width trigger and panel end-aligned, open in place, and preserve every annotation in marker order.');
  }

  return trigger;
}

export default {
  title: 'LDS Product/Data/Visualization/Annotated Image',
  tags: ['autodocs'],
  component: AnnotatedImage,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 800 }}><Story /></div>],
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-visualization-annotated-image--detection-annotations',
      eyebrow: 'Product / Data / Annotated Image',
      title: '사용자가 이미지의 관심 영역과 측정값을 원본 맥락 안에서 확인합니다',
      description:
        '검출 영역·측정 지점·번호 표식을 이미지 위에 표시하고 같은 정보를 텍스트로 제공할 때 적합합니다. 사용자가 직접 영역을 그리거나 편집해야 하면 Annotated Image 대신 전용 annotation editor를 사용하세요.',
    },
    docs: {
      description: {
        component: '출처나 검토 흐름을 소유하지 않는 비대화형 이미지 주석 표시기입니다. 시각 표식과 같은 순서의 텍스트 요약을 함께 제공합니다.',
      },
    },
  },
};

export const DetectionAnnotations = {
  name: '개요',
  parameters: storyDescription(
    '현장 이미지 위에 검출 영역과 센서 측정 지점을 함께 보여 주는 상황입니다. 표식과 텍스트 요약의 순서가 대응되고 이미지 비율이 유지되는지 확인하세요.',
  ),
  args: annotationArgs,
  play: async ({ canvasElement }) => {
    const trigger = await openAnnotationSummary(canvasElement);
    await userEvent.click(trigger);
    if (trigger.getAttribute('aria-expanded') !== 'false') {
      throw new Error('The annotation disclosure must return to its collapsed default state.');
    }
    trigger.blur();
  },
};

export const AnnotationsHidden = {
  name: '시나리오 · 주석 숨김',
  parameters: storyDescription(
    '원본 이미지를 가리지 않고 보기 위해 모든 시각 주석을 숨긴 상황입니다. 주석 visibility가 바뀌어도 이미지 대체 텍스트와 캡션이 유지되는지 확인하세요.',
  ),
  args: {
    ...annotationArgs,
    defaultAnnotationsVisible: false,
  },
};

export const KeyboardToggleAndTextAlternative = {
  name: '상호작용 · 키보드 제어와 텍스트 요약',
  parameters: storyDescription(
    '키보드로 주석 오버레이를 켜고 끄면서 같은 정보를 텍스트 목록으로 확인하는 상황입니다. 토글 상태와 포커스가 명확하고 시각 표식 없이도 모든 주석을 이해할 수 있는지 확인하세요.',
  ),
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

    await openAnnotationSummary(canvasElement);
  },
};

export const NarrowDenseAnnotations = {
  name: '반응형 · 좁은 폭의 조밀한 번호 표식',
  parameters: storyDescription(
    '좁은 이미지에서 여러 긴 주석을 번호 표식과 별도 목록으로 연결하는 상황입니다. 표식이 겹치지 않고 번호와 텍스트 항목의 대응이 작은 폭에서도 유지되는지 확인하세요.',
  ),
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
  name: '시나리오 · 이미지 없음',
  parameters: storyDescription(
    '아직 표시할 이미지가 제공되지 않은 초기 상황입니다. 빈 표면이 실패로 오해되지 않고 다음 데이터나 작업을 기다리는 상태로 읽히는지 확인하세요.',
  ),
  args: {
    alt: '',
    src: null,
    emptyMessage: '선택한 evidence에 이미지가 없습니다.',
  },
};

export const MismatchedAspectRatio = {
  name: '변형·상태 · 이미지와 프레임 비율 맞춤',
  parameters: storyDescription(
    '원본 이미지와 표시 프레임의 비율이 달라 letterbox가 생기는 상황입니다. 이미지가 왜곡되지 않고 주석 좌표가 실제 이미지 영역에 정확히 맞는지 확인하세요.',
  ),
  args: {
    src: evidenceImage,
    alt: '정사각형 frame 안에 contain으로 표시된 건설 현장 이미지',
    aspectRatio: '1 / 1',
    objectFit: 'contain',
    caption: 'letterbox가 있어도 annotation은 실제 이미지 영역을 기준으로 배치됩니다.',
    regions: [{ id: 'safety-net', label: '안전 방호망', x: 0.14, y: 0.27, width: 0.2, height: 0.5 }],
    points: [{ id: 'heat', label: '모터 온도', value: 71, unit: '℃', x: 0.42, y: 0.69 }],
  },
};

export const ImageError = {
  name: '변형·상태 · 이미지 불러오기 실패',
  parameters: storyDescription(
    '이미지 URL을 불러오지 못해 대체 상태를 보여 주는 상황입니다. 오류 의미와 대체 텍스트가 전달되고 깨진 이미지 아이콘에만 의존하지 않는지 확인하세요.',
  ),
  args: {
    src: 'data:image/png;base64,AAAA',
    alt: '불러오지 못한 감지 프레임',
    errorMessage: '감지 프레임을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
  },
};
