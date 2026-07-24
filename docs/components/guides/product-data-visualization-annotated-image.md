# Annotated Image

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `AnnotatedImage` |
| Storybook | `LDS Product/Data/Visualization/Annotated Image` |
| Source | `../component-content.json#product-data-visualization-annotated-image` |

검출 영역·측정 지점·번호 표식을 이미지 위에 표시하고 같은 정보를 텍스트로 제공할 때 적합합니다. 사용자가 직접 영역을 그리거나 편집해야 하면 Annotated Image 대신 전용 annotation editor를 사용하세요.

## 사용 판단

### 사용

- 검출 영역·측정 지점·번호 표식을 이미지 위에 표시하고 같은 정보를 텍스트로 제공할 때 적합합니다. 사용자가 직접 영역을 그리거나 편집해야 하면 Annotated Image 대신 전용 annotation editor를 사용하세요.
- annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다.
- alt는 이미지 전체의 목적과 맥락을 짧게 설명합니다. 모든 region/point에는 의미 있는 label을 제공하고, 전체 annotation은 번호가 일치하는 ordered text summary로도 노출합니다. 이미지는 aria-details로 그 긴 설명을 참조합니다.
- 좌표는 frame 전체가 아니라 objectFit으로 계산된 실제 image content box를 기준으로 합니다. 지원 모드는 contain, cover, fill, none, scale-down입니다.

### 사용하지 않음

- overlay 표시 제어는 기존 ToggleIcon의 on-dark variant를 사용합니다. 지속적으로 읽어야 하는 annotation 이름이나 값은 Tooltip에만 넣지 않습니다. Tooltip은 focus/hover 힌트이고 focus 가능한 내용을 소유하지 않기 때문입니다.
- 영역 label은 detection 도구 관행대로 region tone 색으로 채운 tag를 box 상단 테두리 바깥에 이어 붙여, 색 공유로 소속을 드러내면서 annotation 대상을 가리지 않습니다. box가 frame 상단에 붙어 위 공간이 없으면 box 안쪽 상단으로 폴백해 잘리지 않게 하고, 상단 자리가 다른 region과 겹치면 box 하단 바깥으로 플립해 어느 box의 label인지 오독되지 않게 합니다. tag 텍스트는 tone 채움 위에서 대비가 보장된 색(status tone은 static black, neutral은 inverse label)을….
- canonical tone은 signal, positive, cautionary, negative, neutral입니다. warning과 danger는 기존 consumer 호환 alias일 뿐 새 사용에서는 선택하지 않습니다. 색만으로 의미를 전달하지 않고 번호·label·요약을 항상 함께 제공합니다.
- 이미지가 없으면 원본 비율을 억지로 유지하지 않는 compact empty frame을, load 실패에는 alert, loading/empty에는 status를 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | AnnotatedImage의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Caption | caption 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Error Message | errorMessage 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Summary Label | summaryLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label Display | Visible annotation labels collapse to numbered markers below 420px in auto. @default "auto" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `src` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `alt` | `string` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `caption` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `regions` | `ImageAnnotationRegion[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `points` | `ImageAnnotationPoint[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `annotationsVisible` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultAnnotationsVisible` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onAnnotationsVisibleChange` | `(visible: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loadingMessage` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyMessage` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `errorMessage` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `summaryLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `aspectRatio` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | No | CSS image fitting modes supported by the normalized overlay calculation. @default "contain" |
| `labelDisplay` | `'auto' \| 'always' \| 'index'` | No | Visible annotation labels collapse to numbered markers below 420px in auto. @default "auto" |

## States

| State | Contract |
| --- | --- |
| annotationsVisible | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| defaultAnnotationsVisible | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| onAnnotationsVisibleChange | 공개 타입 계약에 정의된 속성입니다. 타입 계약: (visible: boolean) = void |
| loadingMessage | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| emptyMessage | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| errorMessage | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| 변형·상태 · 이미지 불러오기 실패 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 변형·상태 · 이미지와 프레임 비율 맞춤 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 키보드 제어와 텍스트 요약 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭의 조밀한 번호 표식 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다.
- overlay 표시 제어는 기존 ToggleIcon의 on-dark variant를 사용합니다. 지속적으로 읽어야 하는 annotation 이름이나 값은 Tooltip에만 넣지 않습니다. Tooltip은 focus/hover 힌트이고 focus 가능한 내용을 소유하지 않기 때문입니다.
- canonical tone은 signal, positive, cautionary, negative, neutral입니다. warning과 danger는 기존 consumer 호환 alias일 뿐 새 사용에서는 선택하지 않습니다. 색만으로 의미를 전달하지 않고 번호·label·요약을 항상 함께 제공합니다.
- media framing과 대체 텍스트는 LDS Image, overlay 제어는 ToggleIcon, 지속 정보와 임시 힌트의 구분은 Tooltip/Popover, tone·spacing·radius는 LDS semantic token 관행과 맞췄습니다.
- - anatomy는 figure → media frame → overlay 표시 ToggleIcon → 시각 overlay → 직접 자식인 figcaption과 순서가 같은 텍스트 요약입니다. - annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다. - alt는….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | labelDisplay="auto"는 420px 이하 media container에서 긴 overlay label을 번호 marker로 축약합니다. always는 label을 계속 보이고, index는 항상 번호 marker만 보입니다. 어떤 모드에서도 ordered text summary는 보존됩니다. |
| 명시 규칙 2 | - anatomy는 figure → media frame → overlay 표시 ToggleIcon → 시각 overlay → 직접 자식인 figcaption과 순서가 같은 텍스트 요약입니다. - annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다. - alt는… |
| --border-thick | 2px |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 영역 label은 detection 도구 관행대로 region tone 색으로 채운 tag를 box 상단 테두리 바깥에 이어 붙여, 색 공유로 소속을 드러내면서 annotation 대상을 가리지 않습니다. box가 frame 상단에 붙어 위 공간이 없으면 box 안쪽 상단으로 폴백해 잘리지 않게 하고, 상단 자리가 다른 region과 겹치면 box 하단 바깥으로 플립해 어느 box의 label인지 오독되지 않게 합니다. tag 텍스트는 tone 채움 위에서 대비가 보장된 색(status tone은 static black, neutral은 inverse label)을….
- 이미지가 없으면 원본 비율을 억지로 유지하지 않는 compact empty frame을, load 실패에는 alert, loading/empty에는 status를 사용합니다.
- MDN: Add a hit map on top of an image: 시각 순서와 텍스트 순서를 맞추고 responsive 좌표 보존을 우선했습니다.
- - anatomy는 figure → media frame → overlay 표시 ToggleIcon → 시각 overlay → 직접 자식인 figcaption과 순서가 같은 텍스트 요약입니다. - annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다. - alt는….

## Content and writing

- anatomy는 figure → media frame → overlay 표시 ToggleIcon → 시각 overlay → 직접 자식인 figcaption과 순서가 같은 텍스트 요약입니다.
- annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다.
- alt는 이미지 전체의 목적과 맥락을 짧게 설명합니다. 모든 region/point에는 의미 있는 label을 제공하고, 전체 annotation은 번호가 일치하는 ordered text summary로도 노출합니다. 이미지는 aria-details로 그 긴 설명을 참조합니다.
- overlay 표시 제어는 기존 ToggleIcon의 on-dark variant를 사용합니다. 지속적으로 읽어야 하는 annotation 이름이나 값은 Tooltip에만 넣지 않습니다. Tooltip은 focus/hover 힌트이고 focus 가능한 내용을 소유하지 않기 때문입니다.

## Accessibility

- annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다.
- alt는 이미지 전체의 목적과 맥락을 짧게 설명합니다. 모든 region/point에는 의미 있는 label을 제공하고, 전체 annotation은 번호가 일치하는 ordered text summary로도 노출합니다. 이미지는 aria-details로 그 긴 설명을 참조합니다.
- overlay 표시 제어는 기존 ToggleIcon의 on-dark variant를 사용합니다. 지속적으로 읽어야 하는 annotation 이름이나 값은 Tooltip에만 넣지 않습니다. Tooltip은 focus/hover 힌트이고 focus 가능한 내용을 소유하지 않기 때문입니다.
- WAI-ARIA APG Tooltip Pattern: 지속 annotation 내용을 tooltip에만 숨기지 않고 overlay와 ordered summary로 제공합니다.
- - anatomy는 figure → media frame → overlay 표시 ToggleIcon → 시각 overlay → 직접 자식인 figcaption과 순서가 같은 텍스트 요약입니다. - annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다. - alt는….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다. |
| Don't | overlay 표시 제어는 기존 ToggleIcon의 on-dark variant를 사용합니다. 지속적으로 읽어야 하는 annotation 이름이나 값은 Tooltip에만 넣지 않습니다. Tooltip은 focus/hover 힌트이고 focus 가능한 내용을 소유하지 않기 때문입니다. |
| Do | alt는 이미지 전체의 목적과 맥락을 짧게 설명합니다. 모든 region/point에는 의미 있는 label을 제공하고, 전체 annotation은 번호가 일치하는 ordered text summary로도 노출합니다. 이미지는 aria-details로 그 긴 설명을 참조합니다. |
| Don't | 영역 label은 detection 도구 관행대로 region tone 색으로 채운 tag를 box 상단 테두리 바깥에 이어 붙여, 색 공유로 소속을 드러내면서 annotation 대상을 가리지 않습니다. box가 frame 상단에 붙어 위 공간이 없으면 box 안쪽 상단으로 폴백해 잘리지 않게 하고, 상단 자리가 다른 region과 겹치면 box 하단 바깥으로 플립해 어느 box의 label인지 오독되지 않게 합니다. tag 텍스트는 tone 채움 위에서 대비가 보장된 색(status tone은 static black, neutral은 inverse label)을…. |

## Exceptions

- Image나 Thumbnail을 대체하지 않습니다. annotation 좌표와 그 텍스트 등가물이 함께 필요한 경우에만 사용합니다.
- - media framing과 대체 텍스트는 LDS Image, overlay 제어는 ToggleIcon, 지속 정보와 임시 힌트의 구분은 Tooltip/Popover, tone·spacing·radius는 LDS semantic token 관행과 맞췄습니다. - Image나 Thumbnail을 대체하지 않습니다. annotation 좌표와 그 텍스트 등가물이 함께 필요한 경우에만 사용합니다.
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 AnnotatedImage의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DescriptionList` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<AnnotatedImage
  src={frameUrl}
  alt="건설 현장을 순찰하는 로봇의 카메라 프레임"
  regions={detections}
  points={measurements}
/>
```

## Tokens and API

### Tokens

- `--border-thick`
- `--caption1-line`
- `--caption1-size`
- `--caption2-size`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-label-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-black`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--font-sans`
- `--fw-bold`
- `--radius-lg`
- `--radius-xs`
- `--shadow-md`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-5`
- `--space-6`

### Source contracts

- `components/data/AnnotatedImage.jsx`
- `components/data/AnnotatedImage.d.ts`
- `components/data/AnnotatedImage.prompt.md`
- `stories/DataAnnotatedImage.stories.jsx`

## Migration

- canonical tone은 signal, positive, cautionary, negative, neutral입니다. warning과 danger는 기존 consumer 호환 alias일 뿐 새 사용에서는 선택하지 않습니다. 색만으로 의미를 전달하지 않고 번호·label·요약을 항상 함께 제공합니다.
- - anatomy는 figure → media frame → overlay 표시 ToggleIcon → 시각 overlay → 직접 자식인 figcaption과 순서가 같은 텍스트 요약입니다. - annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다. - alt는….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- AnnotatedImage prompt contract: `components/data/AnnotatedImage.prompt.md`
- Storybook implementation evidence: `stories/DataAnnotatedImage.stories.jsx`
- [W3C WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/)
- [W3C WAI Image Maps Tutorial](https://www.w3.org/WAI/tutorials/images/imagemap/)
- [WAI-ARIA APG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [MDN: Add a hit map on top of an image](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Add_a_hit_map_on_top_of_an_image)
