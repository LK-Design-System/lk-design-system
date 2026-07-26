**Lightbox** — 거의 검정에 가까운 스크림 위 전체 화면 이미지 뷰어.

```jsx
<Lightbox open={open} images={photos} index={idx} onClose={close} onIndexChange={setIdx} />
```

- **images** — URL 또는 `{ src, alt }`. **open / index / onClose / onIndexChange** — 제어형.
  화살표 키 / Esc 지원. 기본 초점은 닫기 버튼이며 Tab 순환과 닫힘 후 trigger focus 복원을
  공용 modal 계약으로 제공합니다. 필요하면 `initialFocusRef`·`returnFocusRef`·`restoreFocus`를 지정합니다.
- 이미지가 2장 이상이면 화살표 컨트롤과 위치 표시가 함께 나타납니다. 위치 표시는 시각 장식이며
  같은 문구를 상시 마운트된 `role="status"` live region이 polite로 전달합니다. 슬라이드가 바뀌면
  위치와 대체 텍스트가 함께 발표됩니다.
- 화살표는 다음 이미지가 디코딩되는 동안에도 **마운트를 유지**하고 `aria-disabled`로만 잠급니다.
  같은 구간 동안 dialog는 `aria-busy="true"`입니다. 초점을 가진 컨트롤을 unmount하면 초점이
  `<body>`로 떨어지기 때문에 사라지게 하지 않습니다.
- 문자열 URL 이미지는 alt를 선언할 수단이 없으므로 `positionLabel` 결과를 대체 텍스트로 사용합니다.
  장식 이미지를 의도한다면 `{ src, alt: '' }`처럼 alt를 명시적으로 넘깁니다.
- 사용자에게 보이거나 읽히는 문자열은 모두 한국어 기본값이며 prop으로 교체합니다:
  `ariaLabel`(다이얼로그 이름), `closeLabel`, `previousLabel`, `nextLabel`,
  `positionLabel(position, total)`. 표준 `style`은 dialog 루트에 병합됩니다.

### 접근성 근거와 적용 결론

- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — 전체 화면
  뷰어도 `aria-modal`을 선언하면 바깥으로 Tab이 빠지지 않아야 하며 명시적 닫기 버튼과 Escape,
  trigger 복원이 필요합니다.
- [WAI-ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) — 슬라이드가 바뀌면
  현재 위치를 전달해야 합니다. Lightbox는 위치 문구를 시각적으로 표시하고 같은 문구를 polite
  live region으로 발표합니다.
- [React Aria Modal](https://react-aria.adobe.com/Modal) — modal overlay의 focus containment와 복원
  책임을 컴포넌트가 소유합니다. Lightbox의 화살표 이미지 이동은 유지하고 focus/Escape는
  Modal·Drawer와 같은 `useDialogFocus`가 담당합니다.
- Arrow 키는 dialog 자체에서 처리합니다. document 전역 리스너가 아니므로 위에 열린 overlay가
  키를 먼저 가져가고, 이미 처리된(`defaultPrevented`) 키는 다시 소비하지 않습니다.
- zoom·pan 컨트롤은 이 계약에 포함하지 않습니다. 확대가 필요한 검토 흐름은 전용 뷰어 화면을 씁니다.
