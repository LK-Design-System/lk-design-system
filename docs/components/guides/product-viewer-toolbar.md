# Toolbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `ViewerToolbar` |
| Storybook | `LDS Product/Viewer/Toolbar` |
| Source | `../component-content.json#product-viewer-toolbar` |

운영자가 지도·3D·영상에서 확대·맞춤·레이어 토글 같은 로컬 도구를 사용할 때 적합합니다. 저장·내보내기처럼 문서 전체에 영향을 주는 명령에는 Viewer Toolbar 대신 Command Bar를 사용하세요.

## 사용 판단

### 사용하지 않음

- Adobe Spectrum Action Group: 관련된 action/toggle이 같은 size·density·interaction state를 공유하고, 공간이 제한되어도 control 자체를 임의 축소하지 않는 근거입니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 아이콘 전용 컨트롤의 필수 접근성 라벨 + tooltip. |
| children | 16px 아이콘 glyph. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal'` | No |  |
| `appearance` | `'minimal' \| 'on-dark' \| 'surface'` | No | minimal: transparent group with individually surfaced controls. on-dark: transparent group with inverse controls for scene/video surfaces. surface: compact grouped surface for dense light UI. |
| `label` | `string` | No | toolbar 접근성 라벨. @default "뷰어 컨트롤" |
| `children` | `React.ReactNode` | No |  |
| `kind` | `'command' \| 'toggle'` | No | 일회성 command와 유지되는 toggle을 구분합니다. @default "command" |
| `pressed` | `boolean` | No | 제어형 toggle 상태. kind="toggle"에서만 사용합니다. |
| `defaultPressed` | `boolean` | No | 비제어 toggle 초기 상태. @default false |
| `onPressedChange` | `(pressed: boolean) = void` | No | toggle 상태 변경 콜백. |
| `active` | `boolean` | No | 이전 active 사용은 호환을 위해 toggle로 해석됩니다. |
| `label` | `string` | Yes | 아이콘 전용 컨트롤의 필수 접근성 라벨 + tooltip. |
| `children` | `React.ReactNode` | No | 16px 아이콘 glyph. |

## States

| State | Contract |
| --- | --- |
| pressed | 제어형 toggle 상태. kind="toggle"에서만 사용합니다. |
| defaultPressed | 비제어 toggle 초기 상태. @default false |
| onPressedChange | toggle 상태 변경 콜백. |
| active | 이전 active 사용은 호환을 위해 toggle로 해석됩니다. |

## Behavior and interaction

- WAI-ARIA Toolbar pattern: 단일 Tab stop, orientation-aware 방향키, Home/End, disabled navigation 계약의 기준입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Toolbar의 children은 ViewerToolbarButton 컨트롤 목록입니다. roving focus는 enabled 버튼만 등록하므로, 임의 컴포넌트를 끼워 넣으면 키보드 시퀀스에서 제외됩니다 — 다른 형태의 컨트롤이 필요하면 toolbar 밖에서 조합합니다. 버튼 쪽 children은 16px 아이콘 glyph 슬롯입니다. |
| 명시 규칙 2 | ViewerToolbarButton은 icon-only control이므로 label이 필수이며 icon은 16px, control은 LDS small icon-control과 같은 32px입니다. |
| 명시 규칙 3 | Sibling IconButton과 ToggleIcon의 32px size, radius, semantic foreground/background, disabled, transition, focus token 계약을 재사용합니다. Toolbar 고유 버튼 크기나 focus ring을 만들지 않습니다. |
| 명시 규칙 4 | WCAG 2.2 Target Size (Minimum): 좁은 viewport에서도 32px target을 축소하지 않고 outer chrome과 label을 먼저 줄입니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- Toolbar root는 grid/flex의 stretch 가능한 slot에 놓여도 control 묶음의 intrinsic width를 유지합니다. 화면 폭을 채우는 command bar가 필요하면 별도 toolbar/navigation 컴포넌트를 사용합니다.
- CanvasEditorShell에서도 zoom, fit, camera, display control은 viewport 안에 둡니다. 문서 저장/history command는 shell header 소유입니다.
- Unity default Scene View overlays: viewport-local navigation/orientation control만 scene edge에 두고 편집 panel과 분리했습니다.
- NVIDIA Omniverse viewport controls: camera/view/display control을 viewport context에 귀속하고 진단 UI와 구분했습니다.

## Accessibility

- 일회성 zoom/reset/fit은 기본 kind="command"이며 aria-pressed를 노출하지 않습니다. 유지되는 visibility/mode만 kind="toggle" + pressed/defaultPressed를 사용하고, 꺼짐도 aria-pressed="false"로 명시합니다.
- Toolbar는 EditorToolbar와 같은 private roving-focus engine을 사용하지만 enabled ViewerToolbarButton만 대상으로 삼습니다. 내부 Popover·field·nested toolbar의 버튼을 섞지 않습니다. role="presentation"/role="none" 래퍼는 소유권을 바꾸지 않지만, nested toolbar처럼 자체 semantic role을 가진 composite는 자기 roving sequence를 소유합니다.
- Focus 중인 Viewer command가 동적으로 unavailable 상태가 되면 다음 enabled command로 focus를 복구합니다. Native disabled와 aria-disabled="true" command/toggle은 모두 실행을 차단합니다.
- Tab 진입점은 하나이며 horizontal은 좌우, vertical은 상하 방향키로 이동합니다. disabled item은 건너뛰고 Home/End를 지원합니다. 자식이 추가·제거되어도 마지막 focus item을 유지합니다.
- 포함: viewport-local icon command/toggle, horizontal/vertical layout, roving focus, light/dark/minimal placement.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `Popover` | 대표 시나리오에서 조합 |
| `Switch` | 대표 시나리오에서 조합 |
| `ViewerToolbarButton` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `Scene3DFrame` | 대표 시나리오에서 조합 |
| `VideoStreamTile` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-line-normal-normal`
- `--radius-md`
- `--shadow-sm`
- `--space-1`
- `--viewer-border`
- `--viewer-surface-elevated`

### Source contracts

- `components/viz/ViewerToolbar.jsx`
- `components/viz/ViewerToolbar.d.ts`
- `components/viz/ViewerToolbar.prompt.md`
- `stories/ViewerToolbar.stories.jsx`

## Migration

- active는 이전 호환 alias일 뿐입니다. 새 코드는 명시적인 kind="toggle" pressed={...}를 사용합니다.

## Sources

- ViewerToolbar prompt contract: `components/viz/ViewerToolbar.prompt.md`
- Storybook implementation evidence: `stories/ViewerToolbar.stories.jsx`
- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/)
- [Apple HIG Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)
- [Unity default Scene View overlays](https://docs.unity3d.com/Manual/default-overlays-reference.html)
- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html)
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
