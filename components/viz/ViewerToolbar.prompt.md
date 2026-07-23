**ViewerToolbar** — LK Robotics Extension. 지도·3D·영상 viewport에 귀속되는 zoom, fit, camera, layer visibility 조작을 모으는 작은 icon toolbar입니다.

```jsx
<ViewerToolbar orientation="horizontal" appearance="on-dark" label="3D 보기">
  <ViewerToolbarButton label="확대" onClick={zoomIn}>
    <Icon name="plus" size={16} />
  </ViewerToolbarButton>
  <ViewerToolbarButton label="레이어 표시" kind="toggle" pressed={layersVisible} onPressedChange={setLayersVisible}>
    <Icon name="filter" size={16} />
  </ViewerToolbarButton>
</ViewerToolbar>
```

## Contract

- Toolbar의 `children`은 `ViewerToolbarButton` 컨트롤 목록입니다. roving focus는 enabled 버튼만 등록하므로, 임의 컴포넌트를 끼워 넣으면 키보드 시퀀스에서 제외됩니다 — 다른 형태의 컨트롤이 필요하면 toolbar 밖에서 조합합니다. 버튼 쪽 `children`은 16px 아이콘 glyph 슬롯입니다.
- `ViewerToolbarButton`은 icon-only control이므로 `label`이 필수이며 icon은 16px, control은 LDS small icon-control과 같은 32px입니다.
- 일회성 zoom/reset/fit은 기본 `kind="command"`이며 `aria-pressed`를 노출하지 않습니다. 유지되는 visibility/mode만 `kind="toggle"` + `pressed/defaultPressed`를 사용하고, 꺼짐도 `aria-pressed="false"`로 명시합니다.
- Toolbar는 EditorToolbar와 같은 private roving-focus engine을 사용하지만 enabled `ViewerToolbarButton`만 대상으로 삼습니다. 내부 Popover·field·nested toolbar의 버튼을 섞지 않습니다. `role="presentation"`/`role="none"` 래퍼는 소유권을 바꾸지 않지만, nested toolbar처럼 자체 semantic role을 가진 composite는 자기 roving sequence를 소유합니다. Editor의 설명 가능한 `aria-disabled` mode와 달리 Viewer의 unavailable command는 방향키 탐색에서도 제외합니다.
- Focus 중인 Viewer command가 동적으로 unavailable 상태가 되면 다음 enabled command로 focus를 복구합니다. Native `disabled`와 `aria-disabled="true"` command/toggle은 모두 실행을 차단합니다.
- Tab 진입점은 하나이며 horizontal은 좌우, vertical은 상하 방향키로 이동합니다. disabled item은 건너뛰고 Home/End를 지원합니다. 자식이 추가·제거되어도 마지막 focus item을 유지합니다.
- `appearance="minimal"`은 outer card chrome 없이 개별 light control만 표시합니다. `on-dark`는 scene/video 위의 inverse control, `surface`는 밀집된 밝은 UI의 grouped surface입니다.
- Toolbar root는 grid/flex의 stretch 가능한 slot에 놓여도 control 묶음의 intrinsic width를 유지합니다. 화면 폭을 채우는 command bar가 필요하면 별도 toolbar/navigation 컴포넌트를 사용합니다.
- `CanvasEditorShell`에서도 zoom, fit, camera, display control은 viewport 안에 둡니다. 문서 저장/history command는 shell header 소유입니다.
- `active`는 이전 호환 alias일 뿐입니다. 새 코드는 명시적인 `kind="toggle" pressed={...}`를 사용합니다.

## Scope decisions

- 포함: viewport-local icon command/toggle, horizontal/vertical layout, roving focus, light/dark/minimal placement.
- 제외: global app command bar, editing tool selection, transport controls, free docking, overflow policy, Popover focus management. 해당 소유 컴포넌트를 조합합니다.
- Sibling `IconButton`과 `ToggleIcon`의 32px size, radius, semantic foreground/background, disabled, transition, focus token 계약을 재사용합니다. Toolbar 고유 버튼 크기나 focus ring을 만들지 않습니다.

## External research basis

- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/): 단일 Tab stop, orientation-aware 방향키, Home/End, disabled navigation 계약의 기준입니다.
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/): 관련된 action/toggle이 같은 size·density·interaction state를 공유하고, 공간이 제한되어도 control 자체를 임의 축소하지 않는 근거입니다.
- [Apple HIG Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars): 뷰에 영향을 주는 자주 쓰는 명령을 논리적으로 묶고 placement를 일관되게 유지하는 기준입니다.
- [Unity default Scene View overlays](https://docs.unity3d.com/Manual/default-overlays-reference.html): viewport-local navigation/orientation control만 scene edge에 두고 편집 panel과 분리했습니다.
- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html): camera/view/display control을 viewport context에 귀속하고 진단 UI와 구분했습니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 좁은 viewport에서도 32px target을 축소하지 않고 outer chrome과 label을 먼저 줄입니다.
