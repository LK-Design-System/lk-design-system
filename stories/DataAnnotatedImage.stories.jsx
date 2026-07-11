import { AnnotatedImage } from '../src/index.js';

const evidenceImage = '/assets/industry/ind-construction-hazard-patrol.webp';

export default {
  title: 'LDS Product/Data/Annotated Image',
  component: AnnotatedImage,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 800 }}><Story /></div>],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '출처나 review workflow를 소유하지 않는 image annotation renderer입니다.',
      },
    },
  },
};

export const DetectionAnnotations = {
  name: '영역과 측정 지점',
  args: {
    src: evidenceImage,
    alt: '건설 현장을 순찰하는 로봇의 감지 프레임',
    caption: 'frame 00318 · 원본 비율 유지',
    regions: [
      { id: 'worker', label: 'worker', score: 0.96, x: 0.18, y: 0.19, width: 0.18, height: 0.57 },
      { id: 'helmet', label: 'helmet', score: 0.91, x: 0.2, y: 0.13, width: 0.11, height: 0.12, tone: 'positive' },
    ],
    points: [
      { id: 'heat', label: 'motor temperature', value: 71, unit: '°C', x: 0.77, y: 0.67 },
    ],
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
  name: '이미지와 frame 비율이 다른 contain 상태',
  args: {
    src: evidenceImage,
    alt: '정사각형 frame에 contain으로 표시한 건설 현장 이미지',
    aspectRatio: '1 / 1',
    objectFit: 'contain',
    caption: 'letterbox가 있어도 annotation은 실제 이미지 영역을 기준으로 배치됩니다.',
    regions: [{ id: 'worker', label: 'worker', x: 0.18, y: 0.19, width: 0.18, height: 0.57 }],
    points: [{ id: 'heat', label: '모터 온도', value: 71, unit: '°C', x: 0.77, y: 0.67 }],
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
