**ViewerToolbar** — LDS Product application pattern. 지도·3D·영상 viewport에 귀속되는 zoom, fit, camera, layer visibility 조작을 모으는 작은 icon toolbar입니다. 실제 공간 의미와 renderer 명령은 LDS Robotics, LDS3D 또는 애플리케이션이 제공하고 이 컴포넌트는 공통 DOM toolbar 계약만 소유합니다.

```jsx
<ViewerToolbar orientation="horizontal" appearance="on-dark" label="3D 보기">
  <ViewerToolbarButton label="축소" onClick={zoomOut}>
    <Icon name="minus" size={16} />
  </ViewerToolbarButton>
  <output>{zoom}%</output>
  <ViewerToolbarButton label="확대" onClick={zoomIn}>
    <Icon name="plus" size={16} />
  </ViewerToolbarButton>
  <ViewerToolbarButton label="전체 보기" onClick={fitView}>
    <Icon name="full" size={16} />
  </ViewerToolbarButton>
  <ViewerToolbarButton label="레이어 설정" onClick={openLayerSettings}>
    <Icon name="layers" size={16} />
  </ViewerToolbarButton>
</ViewerToolbar>
```

Persistent viewport modes remain explicit toggles:

```jsx
<ViewerToolbarButton
  label="격자 표시"
  kind="toggle"
  pressed={gridVisible}
  onPressedChange={setGridVisible}
>
  <Icon name="layers" size={16} />
</ViewerToolbarButton>
```

## Contract

- Toolbar의 `children`은 `ViewerToolbarButton` 컨트롤 목록입니다. roving focus는 enabled 버튼만 등록하므로, 임의 컴포넌트를 끼워 넣으면 키보드 시퀀스에서 제외됩니다 — 다른 형태의 컨트롤이 필요하면 toolbar 밖에서 조합합니다. 버튼 쪽 `children`은 16px 아이콘 glyph 슬롯입니다.
- `ViewerToolbarButton`은 icon-only control이므로 `label`이 필수이며 icon은 16px, control은 조밀한 데스크톱 viewport chrome에 맞춘 28px입니다.
- 일회성 zoom/reset/fit은 기본 `kind="command"`이며 `aria-pressed`를 노출하지 않습니다. 유지되는 visibility/mode만 `kind="toggle"` + `pressed/defaultPressed`를 사용하고, 꺼짐도 `aria-pressed="false"`로 명시합니다.
- Horizontal zoom anatomy follows `decrement → current value → increment → fit/reset`. Display configuration begins after a visual separator. A layers/settings popover owns each visibility state in one place; do not repeat the same overlay as both an outer quick toggle and an inner switch. If a product proves that one visibility toggle is frequent enough to remain outside, remove that same state from the popover.
- Toolbar는 EditorToolbar와 같은 private roving-focus engine을 사용하지만 enabled `ViewerToolbarButton`만 대상으로 삼습니다. 내부 Popover·field·nested toolbar의 버튼을 섞지 않습니다. `role="presentation"`/`role="none"` 래퍼는 소유권을 바꾸지 않지만, nested toolbar처럼 자체 semantic role을 가진 composite는 자기 roving sequence를 소유합니다. Editor의 설명 가능한 `aria-disabled` mode와 달리 Viewer의 unavailable command는 방향키 탐색에서도 제외합니다.
- Focus 중인 Viewer command가 동적으로 unavailable 상태가 되면 다음 enabled command로 focus를 복구합니다. Native `disabled`와 `aria-disabled="true"` command/toggle은 모두 실행을 차단합니다.
- Tab 진입점은 하나이며 horizontal은 좌우, vertical은 상하 방향키로 이동합니다. disabled item은 건너뛰고 Home/End를 지원합니다. 자식이 추가·제거되어도 마지막 focus item을 유지합니다.
- `appearance="minimal"`만 outer chrome 없이 2px 간격의 flat control을 배치합니다. `surface`와 `on-dark`는 2px outer inset과 2px control gap을 가진 grouped surface를 소유합니다. 세 appearance 모두 기본 command/toggle 버튼은 transparent이며 hover·focus·pressed 또는 선택된 toggle에서만 개별 면이 나타납니다.
- `on-dark`는 툴바 루트에서 `--viewer-foreground`를 static white로 제공합니다. 이 값은 Popover 같은 presentation wrapper를 사이에 둔 버튼에도 상속되며, 비선택 command가 어두운 장면 위에서 기본 label 색상으로 떨어져 사라지지 않게 합니다. Disabled 버튼은 각 control의 disabled foreground를 계속 우선합니다.
- `ViewerFrame` 안에서 `surface`와 `on-dark` ViewerToolbar는 자체 grouped surface를 유지하고, 프레임의 `data-viewer-control-shelf`는 투명한 배치 래퍼로 동작합니다. `minimal`이나 사용자 정의 toolbar에는 프레임 shelf가 같은 2px inset의 배경·테두리를 제공하므로 chrome이 중첩되거나 페이지마다 여백이 달라지지 않습니다.
- Toolbar root는 grid/flex의 stretch 가능한 slot에 놓여도 control 묶음의 intrinsic width를 유지합니다. 화면 폭을 채우는 command bar가 필요하면 별도 toolbar/navigation 컴포넌트를 사용합니다.
- `CanvasEditorShell`에서도 zoom, fit, camera, display control은 viewport 안에 둡니다. 문서 저장/history command는 shell header 소유입니다.
- `active`는 이전 호환 alias일 뿐입니다. 새 코드는 명시적인 `kind="toggle" pressed={...}`를 사용합니다.

## Scope decisions

- 포함: viewport-local icon command/toggle, horizontal/vertical layout, roving focus, light/dark/minimal placement.
- 제외: global app command bar, editing tool selection, transport controls, free docking, overflow policy, Popover focus management. 해당 소유 컴포넌트를 조합합니다.
- Sibling `IconButton`과 `ToggleIcon`의 radius, semantic foreground/background, disabled, transition, focus token 계약을 재사용하되, Viewer 전용 밀도에서 control box만 28px로 고정합니다. 별도 focus ring은 만들지 않습니다.

## External research basis

- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/): 단일 Tab stop, orientation-aware 방향키, Home/End, disabled navigation 계약의 기준입니다.
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/): 관련된 action/toggle이 같은 size·density·interaction state를 공유하고, 공간이 제한되어도 control 자체를 임의 축소하지 않는 근거입니다.
- [Apple HIG Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars): 뷰에 영향을 주는 자주 쓰는 명령을 논리적으로 묶고 placement를 일관되게 유지하는 기준입니다.
- [Unity default Scene View overlays](https://docs.unity3d.com/Manual/default-overlays-reference.html): viewport-local navigation/orientation control만 scene edge에 두고 편집 panel과 분리했습니다.
- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html): camera/view/display control을 viewport context에 귀속하고 진단 UI와 구분했습니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): Viewer의 28px target은 24px 최소 기준을 넘기며, 더 좁은 viewport에서도 이 크기 아래로 축소하지 않습니다.
