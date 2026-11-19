import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Grid, Lightbox, Thumbnail } from '../src/index.js';
import {
  LightboxCard as LightboxCardStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Lightbox',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-lightbox--lightbox-open',
      eyebrow: 'Product / Lightbox',
      title: '사용자가 이미지와 캡처를 주변 화면의 방해 없이 크게 검토합니다',
      description:
        '사진·스크린샷 같은 미디어를 원본 맥락에서 확대해 집중 검토할 때 적합합니다. 긴 문서, 편집 폼, 확인 작업에는 Lightbox 대신 전용 페이지나 Dialog를 사용하세요.',
    },
    docs: {
      description: {
        component: '이미지나 캡처를 화면 위에 크게 띄워 검토하는 Lightbox 패턴입니다.',
      },
    },
  },
};

export default meta;

export const LightboxOpen = {
  name: '개요',
  parameters: storyDescription(
    '썸네일을 선택해 해당 이미지를 크게 보고 이전·다음 이미지로 이동합니다. 닫기나 Escape 뒤 선택했던 썸네일로 초점이 돌아오고 다시 열 수 있는지 확인하세요.',
  ),
  render: () => <LightboxNavigationDemo showThumbnails />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = canvasElement.querySelector('button[aria-label="점검 중 초록 캡처 크게 보기"]');
    if (!trigger) throw new Error('Lightbox 개요는 선택할 수 있는 이미지 미리보기를 보여줘야 합니다.');
    await userEvent.click(trigger);
    await waitFor(() => {
      const dialog = canvasElement.querySelector('[role="dialog"]');
      if (dialog?.querySelector('img')?.getAttribute('alt') !== '점검 중 초록 캡처') throw new Error('선택한 썸네일의 이미지가 열려야 합니다.');
    });
    const dialog = canvasElement.querySelector('[role="dialog"]');
    await waitUntilLoaded(dialog);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]') || ownerDocument.activeElement !== trigger) throw new Error('닫은 뒤 선택했던 썸네일로 초점이 돌아와야 합니다.');
    });
    trigger.blur();
  },
};

function LightboxKeyboardDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Lightbox 열기</Button>
      <Lightbox open={open} images={[{ src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%233878B3"/%3E%3C/svg%3E', alt: '파란 테스트 이미지' }]} onClose={() => setOpen(false)} />
    </div>
  );
}

export const LightboxKeyboardContract = {
  name: '상호작용 · 초점 순환과 복원',
  parameters: storyDescription(
    '키보드로 Lightbox를 열고 닫는 상황입니다. 닫기 액션으로 초기 초점이 이동하고 Tab이 dialog 안에 머문 뒤 Escape에서 트리거로 복원되는지 확인하세요.',
  ),
  render: () => <LightboxKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Lightbox 열기');
    await userEvent.click(trigger);
    await waitFor(() => {
      if (ownerDocument.activeElement?.getAttribute('aria-label') !== '닫기') throw new Error('Lightbox must focus its close action.');
    });
    await userEvent.tab();
    if (ownerDocument.activeElement?.getAttribute('aria-label') !== '닫기') throw new Error('Lightbox Tab must stay inside the dialog.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('Lightbox must close on Escape.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Lightbox must restore focus to its trigger.');
    });
  },
};
const swatch = (fill) => `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%23${fill}"/%3E%3C/svg%3E`;

const galleryImages = [
  { src: swatch('3878B3'), alt: '점검 전 파란 캡처' },
  { src: swatch('2E8B6B'), alt: '점검 중 초록 캡처' },
  { src: swatch('B3722E'), alt: '점검 후 주황 캡처' },
];

function LightboxNavigationDemo({ showThumbnails = false }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <div style={{ minHeight: 260, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', maxWidth: 640 }}>
      {showThumbnails && (
        <Grid minItemWidth={160} gap="var(--space-3)" style={{ width: '100%' }}>
          {galleryImages.map((image, imageIndex) => (
            <Button
              key={image.src}
              variant="ghost"
              aria-label={`${image.alt} 크게 보기`}
              onClick={() => { setIndex(imageIndex); setOpen(true); }}
              style={{ height: 'auto', padding: 'var(--space-2)', minWidth: 0 }}
              styles={{ content: { display: 'grid', gap: 'var(--space-2)', width: '100%', whiteSpace: 'normal' } }}
            >
              <Thumbnail src={image.src} alt="" ratio="16/9" />
              <span style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)' }}>{image.alt}</span>
            </Button>
          ))}
        </Grid>
      )}
      <Button onClick={() => { setIndex(0); setOpen(true); }}>이미지 갤러리 열기</Button>
      <Lightbox
        open={open}
        images={galleryImages}
        index={index}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </div>
  );
}

const waitUntilLoaded = (dialog) => waitFor(() => {
  if (dialog.getAttribute('aria-busy') === 'true') throw new Error('Lightbox는 이미지 디코딩이 끝나면 aria-busy를 내려야 합니다.');
});

export const LightboxSlideAnnouncementContract = {
  name: '슬라이드 알림과 이동 컨트롤 계약',
  tags: ['!dev'],
  render: () => <LightboxNavigationDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '이미지 갤러리 열기');
    if (!trigger) throw new Error('Lightbox 탐색 계약 스토리에는 트리거가 필요합니다.');
    await userEvent.click(trigger);
    const dialog = await waitFor(() => {
      const current = canvasElement.querySelector('[role="dialog"]');
      if (!current) throw new Error('Lightbox must open from its trigger.');
      return current;
    });

    const live = dialog.querySelector('[data-lightbox-live]');
    const position = dialog.querySelector('[data-lightbox-position]');
    const previous = dialog.querySelector('[data-lightbox-previous]');
    const next = dialog.querySelector('[data-lightbox-next]');
    if (!live || !position || !previous || !next) {
      throw new Error('여러 장 Lightbox는 live region, 위치 표시, 이전/다음 컨트롤을 모두 제공해야 합니다.');
    }
    if (live.getAttribute('role') !== 'status' || live.getAttribute('aria-live') !== 'polite') {
      throw new Error('슬라이드 변경은 polite status region으로 알려야 합니다.');
    }
    if (previous.getAttribute('aria-label') !== '이전 이미지' || next.getAttribute('aria-label') !== '다음 이미지') {
      throw new Error('이동 컨트롤의 접근 이름은 한국어 기본값이어야 합니다.');
    }
    if (position.getAttribute('aria-hidden') !== 'true') {
      throw new Error('보이는 위치 표시는 live region과 중복되지 않도록 장식이어야 합니다.');
    }
    await waitUntilLoaded(dialog);
    if (!live.textContent?.includes('1 / 3')) throw new Error('Lightbox는 현재 슬라이드 위치를 알려야 합니다.');

    /* 이동 직후 로딩 구간에도 컨트롤은 마운트를 유지해야 한다. 초점을 가진
       버튼이 사라지면 초점이 <body>로 떨어진다(WCAG 2.4.3). */
    next.focus();
    await userEvent.click(next);
    await waitFor(() => {
      if (!live.textContent?.includes('2 / 3')) throw new Error('슬라이드가 바뀌면 위치 알림이 갱신되어야 합니다.');
    });
    if (!dialog.contains(next) || ownerDocument.activeElement !== next) {
      throw new Error('이미지 로딩 중에도 이동 컨트롤은 유지되고 초점을 잃지 않아야 합니다.');
    }
    if (!position.textContent?.includes('2 / 3')) throw new Error('보이는 위치 표시도 함께 갱신되어야 합니다.');
    if (dialog.querySelector('img')?.getAttribute('alt') !== '점검 중 초록 캡처') {
      throw new Error('이동한 슬라이드의 대체 텍스트가 이미지와 함께 바뀌어야 합니다.');
    }

    await waitUntilLoaded(dialog);
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      if (!live.textContent?.includes('1 / 3')) throw new Error('Arrow 키 이동도 같은 알림 경로를 사용해야 합니다.');
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('Lightbox must close on Escape.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Lightbox must restore focus to its trigger.');
    });
    trigger.blur();
  },
};

export const LightboxCard = { ...LightboxCardStory, name: 'Lightbox card parity', tags: ['!dev', 'visual-parity'] };

const smallPortrait='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="82" height="182"%3E%3Crect width="82" height="182" fill="%233878B3"/%3E%3C/svg%3E';
function SmallImageExample({imageSizing='natural'}) {
  const [open,setOpen]=React.useState(false);
  return <><Button onClick={()=>setOpen(true)}>작은 이미지 열기</Button><Lightbox open={open} images={[{src:smallPortrait,alt:'82×182 테스트 사진'}]} imageSizing={imageSizing} onClose={()=>setOpen(false)} /></>;
}
export const NaturalSmallImage={
  name: '변형·상태 · 작은 이미지 원본 크기',
  parameters: storyDescription('작은 이미지를 기본 크기로 확인합니다.'),
  render:()=> <SmallImageExample />,
  play:async({canvasElement})=>{
    await userEvent.click(canvasElement.querySelector('button'));
    await waitFor(()=>{const image=canvasElement.querySelector('[role="dialog"] img');if(!image||image.naturalHeight!==182||image.getBoundingClientRect().height!==182)throw new Error('기본 natural은 작은 원본을 임의로 키우면 안 됩니다.');});
    await userEvent.keyboard('{Escape}');
  },
};
export const ContainSmallImage={
  name: '변형·상태 · 작은 이미지 화면 맞춤',
  parameters: storyDescription('작은 이미지를 가로세로 비율을 유지한 채 화면에 맞춰 확대합니다.'),
  render:()=> <SmallImageExample imageSizing="contain" />,
  play:async({canvasElement})=>{
    const doc=canvasElement.ownerDocument,trigger=canvasElement.querySelector('button');
    await userEvent.click(trigger);
    await waitFor(()=>{
      const dialog=canvasElement.querySelector('[role="dialog"]'),image=dialog?.querySelector('img');
      if(!image||image.naturalHeight!==182)throw new Error('사진이 decode되어야 합니다.');
      const rect=image.getBoundingClientRect();
      if(rect.height<=182||rect.width<=82||Math.abs(rect.width/rect.height-82/182)>.002)throw new Error('contain은 종횡비를 지키며 작은 사진을 키워야 합니다.');
      const expectedWidth=Math.min(doc.defaultView.innerWidth*.86,doc.defaultView.innerHeight*.86*82/182);
      if(Math.abs(rect.width-expectedWidth)>1)throw new Error('contain은 가용viewport에 최대 맞춤이어야 합니다.');
      if(rect.width>doc.defaultView.innerWidth*.86+1||rect.height>doc.defaultView.innerHeight*.86+1)throw new Error('이미지는 기존viewport 영역 안에 있어야 합니다.');
      if(dialog.querySelectorAll('button').length!==1||dialog.querySelector('[data-lightbox-position]'))throw new Error('한 장에는 X 외의 탐색/카운터를 표시하면 안 됩니다.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(()=>{if(canvasElement.querySelector('[role="dialog"]')||doc.activeElement!==trigger)throw new Error('Escape/focus 복원을 유지해야 합니다.');});
  },
};

function FittedGalleryExample(){
  const [open,setOpen]=React.useState(false),[index,setIndex]=React.useState(0);
  return <><Button onClick={()=>setOpen(true)}>비율 변경 갤러리</Button><Lightbox open={open} index={index} onIndexChange={setIndex} onClose={()=>setOpen(false)} imageSizing="contain"
    images={[{src:smallPortrait,alt:'세로 테스트'},{src:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="80"%3E%3Crect width="320" height="80" fill="%232E8B6B"/%3E%3C/svg%3E',alt:'가로 테스트'}]} /></>;
}
export const ContainImageChange={
  name: '상호작용 · 비율이 다른 이미지 이동',
  parameters: storyDescription('가로세로 비율이 다른 이미지로 이동할 때 각각의 비율을 유지한 채 새 이미지에 맞춥니다.'),
  render:()=> <FittedGalleryExample />,
  play:async({canvasElement})=>{
    await userEvent.click(canvasElement.querySelector('button'));
    const dialog=canvasElement.querySelector('[role="dialog"]');
    await waitUntilLoaded(dialog);
    const next=dialog.querySelector('[data-lightbox-next]');await userEvent.click(next);
    await waitFor(()=>{
      const image=dialog.querySelector('img'),rect=image.getBoundingClientRect(),win=canvasElement.ownerDocument.defaultView;
      if(image.naturalWidth!==320||Math.abs(rect.width/rect.height-4)>.002||Math.abs(rect.width-Math.min(win.innerWidth*.86,win.innerHeight*.86*4))>1)throw new Error('새 이미지의 비율과 최대 맞춤 크기를 사용해야 합니다.');
      if(!dialog.contains(next)||canvasElement.ownerDocument.activeElement!==next)throw new Error('이미지 변경은 탐색 컨트롤 focus를 잃지 않아야 합니다.');
    });
    await userEvent.keyboard('{Escape}');
  },
};
