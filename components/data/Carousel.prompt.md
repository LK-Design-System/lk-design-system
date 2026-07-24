**Carousel** — 점 인디케이터와 화살표가 있는 가로 슬라이드 뷰포트. WAI-ARIA APG의 carousel 패턴을 따릅니다.

```jsx
<Carousel
  label="설비 점검 사진"
  slideLabels={['입고 검사', '주행 시험', '출고 검사']}
  slides={[
    <img src="a.jpg" alt="입고 검사" style={{ width: '100%' }} />,
    <img src="b.jpg" alt="주행 시험" style={{ width: '100%' }} />,
    <img src="c.jpg" alt="출고 검사" style={{ width: '100%' }} />,
  ]}
/>
```

- **slides** — 노드 배열. **showDots / showArrows** — 토글. 양 끝에서 순환합니다.
- **구조** — 루트는 `role="region"` + `aria-roledescription="carousel"`이고 **label**(기본 `캐러셀`)이 접근 이름입니다. 페이지 랜드마크로 올리고 싶지 않으면 `role="group"`을 직접 넘겨 덮어씁니다. 각 슬라이드는 `role="group"` + `aria-roledescription="slide"`이고 이름은 `N / 전체`, **slideLabels**를 주면 `이름, N / 전체`가 됩니다.
- **화면 밖 슬라이드** — 현재 슬라이드가 아닌 슬라이드는 `inert`와 `aria-hidden`을 함께 받습니다. `overflow`로 가려졌을 뿐인 링크·버튼이 Tab 순서와 접근성 트리에 남지 않게 하려는 것으로, `Dimmer`가 가려진 영역을 처리하는 방식과 같습니다. 현재 슬라이드는 `data-carousel-slide="current"`, 나머지는 `"offscreen"`입니다.
- **previousLabel / nextLabel / playLabel / pauseLabel** — 컨트롤의 접근 이름 override. 기본값은 모두 한국어이며 아이콘은 `aria-hidden`입니다. 점 인디케이터는 현재 위치를 `aria-current="true"`로 노출해 폭·색 변화에만 의존하지 않습니다.
- **autoPlay / interval** — 자동 회전은 opt-in입니다. 켜면 일시정지 컨트롤이 첫 번째 포커스 대상으로 렌더되고(WCAG 2.2.2), 포인터가 올라가거나 내부로 포커스가 들어오면 회전이 멈추며, 이전·다음·점을 누르면 회전이 완전히 멈춥니다(APG). 회전을 멈추는 수단 없이 움직이는 콘텐츠를 5초 넘게 두지 마세요. CTA가 있는 프로모션 배너는 읽고 누를 시간이 필요하므로 `interval`을 5초 미만으로 줄이지 마세요.
- **도트 대비** — 도트는 흰 채움에 스크림 링(1px)을 둘러 어두운 미디어뿐 아니라 밝은 프로모션 슬라이드 위에서도 3:1 비텍스트 대비를 스스로 확보합니다(WCAG 1.4.11). 전환 컨트롤의 가시성이 슬라이드 배경에 의존하지 않습니다.
- **컨트롤 겹침 영역** — 컨트롤은 뷰포트 위에 겹쳐 그려지므로 슬라이드 콘텐츠와 안전 영역을 나눠야 합니다. **하단**: 일시정지(좌하단)와 도트(하단 중앙)를 위해 슬라이드 하단 약 56px을 비우세요. **측면**: 이전·다음 화살표는 세로 중앙 좌우에 놓여 **텍스트·CTA를 가립니다** — 그래서 화살표는 미디어(이미지) 슬라이드용이고, 텍스트·CTA가 있는 프로모션/배너 슬라이드는 `showArrows={false}`로 도트만 쓰거나(권장) 콘텐츠가 좌우 약 52px 안전 여백을 확보해야 합니다. 배너형 슬라이드의 CTA는 sm이 아닌 기본(40px) 크기를 권장합니다.
- **알림** — 상시 마운트된 시각적 숨김 라이브 리전이 현재 슬라이드 위치를 전달합니다. 자체 회전 중에는 `aria-live="off"`(사용자가 요청하지 않은 변화를 읽지 않음), 멈춘 뒤 사용자가 넘길 때는 `polite`입니다.
- **모션** — 트랙 이동과 점 확장은 인라인 transition이므로 `prefers-reduced-motion: reduce`에서 `transition:none!important`로 무력화합니다(`!important`가 없으면 규칙이 인라인 스타일에 밀려 무시됩니다).
