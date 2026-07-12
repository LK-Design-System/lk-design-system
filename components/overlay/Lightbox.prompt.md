**Lightbox** — 거의 검정에 가까운 스크림 위 전체 화면 이미지 뷰어.

```jsx
<Lightbox open={open} images={photos} index={idx} onClose={close} onIndexChange={setIdx} />
```

- **images** — URL 또는 `{ src, alt }`. **open / index / onClose / onIndexChange** — 제어형.
  화살표 키 / Esc 지원. 기본 초점은 닫기 버튼이며 Tab 순환과 닫힘 후 trigger focus 복원을
  공용 modal 계약으로 제공합니다. 필요하면 `initialFocusRef`·`returnFocusRef`를 지정합니다.

### 접근성 근거와 적용 결론

- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — 전체 화면
  뷰어도 `aria-modal`을 선언하면 바깥으로 Tab이 빠지지 않아야 하며 명시적 닫기 버튼과 Escape,
  trigger 복원이 필요합니다.
- [React Aria Modal](https://react-aria.adobe.com/Modal) — modal overlay의 focus containment와 복원
  책임을 컴포넌트가 소유합니다. Lightbox의 화살표 이미지 이동은 유지하고 focus/Escape는
  Modal·Drawer와 같은 `useDialogFocus`가 담당합니다.
