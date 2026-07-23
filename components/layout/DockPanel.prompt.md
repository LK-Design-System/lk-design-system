**DockPanel** — 캔버스 위에서 돌출 핸들로 접고 펼치는 사이드 도킹 패널. 맵, 에디터, 로봇 뷰어 위의 속성/레이어/상태 패널에 씁니다.

```jsx
<DockPanel side="right" title="속성" defaultOpen>
  <PropertyField ... />
</DockPanel>
```

- **side** `left|right` · **open/defaultOpen/onOpenChange** · **title** · **width** · **resizable/minWidth/maxWidth/resizeStep/onWidthChange** · **closeOnEscape** · **bodyPadding/bodyStyle** · **footer** · **children**.
- Compare against common docked panel expectations before changing it: controlled/uncontrolled open state, persistent collapse handle, side-aware layout, optional resizable separator, keyboard resize, focus return, hidden collapsed content, and clear distinction from modal/drawer overlays.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Dock Panel component set; keep it as a product layout pattern rather than WDS layout primitive parity.
- 새 Drawer/Modal이 아니라 캔버스 내부에 붙는 layout pattern입니다. 페이지 전체 탐색, route transition, focus trap이 필요한 오버레이에는 쓰지 않습니다.
- 접힌 상태에서도 handle은 남고, 패널 region은 `aria-controls` 대상 id를 유지합니다. 접힌 패널은 `hidden`/`inert`로 focus tree에서 빠집니다.
- 에디터형 패널은 `resizable`을 켜고 숫자 `width`를 사용합니다. resize separator는 `role="separator"`와 `aria-valuenow`를 가지며 드래그, ArrowLeft/ArrowRight, Home/End를 지원합니다.
- 열린 패널 내부 또는 resize separator에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다(separator는 `<aside>`의 형제라 패널 keydown이 닿지 않으므로 같은 핸들러를 직접 붙입니다). 패널 안에 열려 있던 오버레이가 Escape를 먼저 처리해 `defaultPrevented`가 되면 패널은 접지 않습니다. **closeOnEscape**로 이 동작 전체를 끌 수 있습니다.
- 아이콘은 `Icon` registry의 chevron을 사용하고, 선/배경은 semantic token을 따릅니다. raw SVG나 legacy border alias를 새 source of truth로 쓰지 않습니다.
