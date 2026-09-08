# Dot Matrix Preview

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `DotMatrixPreview` |
| Storybook | `LDS Product/Viewer/Dot Matrix Preview` |
| Source | `../component-content.json#product-viewer-dot-matrix-preview` |

로봇 측면 LED 사인, 순찰 안내판처럼 고정 격자 1비트 패널의 프레임을 실제 색·밝기로 미리 볼 때 적합합니다. 카메라·지도처럼 연속 이미지 소스에는 Viewer Frame이나 Video Stream Tile을 사용하세요.

## 사용 판단

### 사용하지 않음

- 미리보기는 입력이 바뀔 때마다 갱신하되 전송은 명시적 action으로만 합니다(즉시 반영 금지). 적용 button은 프레임이 비었거나 연결이 끊겼으면 비활성화합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Visible title and the start of the canvas accessible name (e.g. "로봇 왼쪽 LED"). |
| description | Text alternative of what the frame shows (the message being rendered). Required for a meaningful accessible name whenever the frame is not empty. |
| emptyLabel | Summary shown when no dot is lit. @default "꺼진 화면" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `columns` | `number` | No | Panel width in pixels (dots). @default 128 |
| `rows` | `number` | No | Panel height in pixels (dots). @default 32 |
| `bitmap` | `ArrayLike` | No | 1-bit frame, row-major from the top-left, MSB first inside each byte (columns × rows / 8 bytes). |
| `pixels` | `ArrayLike` | No | Alternative to bitmap: one truthy entry per lit dot in row-major order. Takes precedence when both are given. |
| `color` | `string` | No | Lit-dot colour as a 6-digit hex string. Invalid values fall back to white. @default "#ffffff" |
| `brightness` | `number` | No | Panel brightness 0–255 applied to the lit colour, matching the value sent to the controller. @default 255 |
| `label` | `React.ReactNode` | Yes | Visible title and the start of the canvas accessible name (e.g. "로봇 왼쪽 LED"). |
| `description` | `React.ReactNode` | No | Text alternative of what the frame shows (the message being rendered). Required for a meaningful accessible name whenever the frame is not empty. |
| `status` | `React.ReactNode` | No | Optional connection or sync status composed with LDS status primitives. |
| `dotShape` | `'square' \| 'round'` | No | Dot geometry of the physical panel. @default "square" |
| `emptyLabel` | `React.ReactNode` | No | Summary shown when no dot is lit. @default "꺼진 화면" |

## States

| State | Contract |
| --- | --- |
| status | Optional connection or sync status composed with LDS status primitives. |
| emptyLabel | Summary shown when no dot is lit. @default "꺼진 화면" |

## Behavior and interaction

- LK Control Gungneung (LK-ROBOTICS/lkrobotics-control-gungneung · 9298e1c0): supported by composition. frontend/src/views/dashboard/RobotDashboard/components/LedControl/index.jsx는 128×32 양면 패널, 문구 두 개, 0–255 밝기, 색, MCU 연결 상태, 전송 action과 MSB-first 비트맵 규격을 증명합니다.
- DotMatrixPreview는 로봇 측면 LED 사인, 순찰 안내판, 전광판처럼 고정 격자의 1비트 프레임을 실제 패널이 보여 줄 모습 그대로 미리 보여 주는 LDS Product / Operations 시각 부품입니다. provenance는 product-extension입니다. 패널 chrome(검은 베젤, 꺼진 점, 색·밝기가 적용된 켜진 점)과 접근 가능한 텍스트 대체만 소유하며, 문구를 비트맵으로 굽는 rasterization, 폰트, 패킷 인코딩, 전송과 상태 폴링은 제품이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 반복 문제: 운영자가 LED 문구·색·밝기를 바꾸기 전에 128×32 같은 저해상도 패널에서 글자가 잘리거나 뭉개지지 않는지, 밝기를 낮추면 어떻게 보이는지 확인해야 합니다. |
| 명시 규칙 2 | bitmap은 좌상단부터 행 우선, 바이트 안에서는 MSB가 먼저인 1비트 프레임입니다(궁릉 MCU 패킷 규격과 같음). pixels는 점 단위 truthy 배열이며 둘 다 주면 pixels를 씁니다. 길이가 짧으면 나머지는 꺼진 것으로 봅니다. |
| 명시 규칙 3 | color는 6자리 hex, brightness는 컨트롤러에 보내는 0–255 값입니다. 켜진 점은 color × brightness/255로 어둡게 그려 실제 밝기를 가늠하게 합니다. brightness={0}은 켜진 점이 있어도 검게 보이지만 요약 줄과 accessible name은 여전히 문구와 밝기 0%를 전달합니다. |
| 명시 규칙 4 | 점 크기는 내부 6px 격자(간격 1px)이며 canvas는 width: 100%·aspect-ratio: columns/rows로 컨테이너에 맞춥니다. 320px 폭에서도 128×32 패널이 4:1 비율로 유지됩니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- ViewerFrame·VideoStreamTile과의 차이: 그것들은 카메라·3D·지도처럼 연속 이미지 소스를 감싸는 viewport chrome입니다. 이 컴포넌트는 소스가 아니라 이산 픽셀 격자를 그리며, 픽셀 하나하나가 보여야 하므로 image-rendering: pixelated와 점 간격이 표현의 핵심입니다.
- | 역할 | LDS 부품 | 제품 소유 | | --- | --- | --- | | 문구 입력(좌/우 패널) | Input 또는 Textarea(줄바꿈 허용 시) | 줄 수 제한, 글자 수 상한, 안전 문구 기본값 | | 밝기 | Slider (min=0 max=255 showValue) | 하드웨어 상한 | | 색 | ColorSwatch(패널이 지원하는 색 팔레트) | 지원 색 목록 | | 미리보기 | DotMatrixPreview × 패널 수 | 문구→비트맵 rasterization(폰트·줄 나눔·세로 정렬) | | 연결 상태 |…

## Content and writing

- description은 접근 가능한 대체 텍스트입니다. 화면에 보이는 문구를 그대로 넘기세요. 없으면 켜진 픽셀 수만 읽힙니다.
- 켜진 점이 없으면 루트에 data-empty를 두고 emptyLabel을 읽습니다. 제품은 적용 button 비활성화에 같은 조건(프레임에 켜진 점이 없음)을 쓰면 됩니다.
- 두 패널이 같은 문구를 쓰는 경우에도 미리보기는 패널마다 하나씩 두어 좌우가 다른 상황을 감춥니다.
- 캡션·요약 typography는 EquipmentStatusCard의 label1/caption1 규칙을 따릅니다.

## Accessibility

- HTML Living Standard — canvas best practices: canvas에는 같은 목적을 전하는 fallback content를 두고, 텍스트는 canvas가 아니라 마크업으로 제공하라는 지침입니다. 이 컴포넌트는 role="img" accessible name과 fallback text, 별도 요약 줄로 문구를 마크업에 남깁니다.
- 1. figcaption: 패널 이름(label) → 오른쪽에 status 슬롯(연결·동기화 상태) 2. 패널: 베젤 안의 canvas (role="img", accessible name = label: description, 밝기 N%) 3. 요약 줄: 표시 문구(description) 또는 켜진 픽셀 수, 오른쪽에 columns×rows · 밝기 N%.
- DOM 순서와 시각 순서가 같고, canvas는 상호작용하지 않으므로 Tab stop을 만들지 않습니다. 켜진 점이 하나도 없으면 data-empty와 emptyLabel로 꺼진 화면임을 텍스트로도 알립니다.

## Exceptions

- canvas fill은 CSS 변수를 읽을 수 없어 베젤·꺼진 점(6% 흰색)·켜진 점(제품 RGB×밝기) 리터럴을 씁니다. 이 값은 LDS 표면이 아니라 하드웨어를 묘사하므로 VISUALTOKENEXCEPTIONS.json에 예외로 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `Input` | 대표 시나리오에서 조합 |
| `Slider` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DotMatrixPreview
  label="로봇 왼쪽 LED"
  columns={128}
  rows={32}
  bitmap={leftBitmap}
  color="#ffdd00"
  brightness={60}
  description="안전순찰을 위해 주변을 촬영합니다"
  status={<StatusBadge tone="positive">MCU 연결됨</StatusBadge>}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-solid-_strong`
- `--color-semantic-line-solid-normal`
- `--font-sans`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--radius-md`
- `--space-2`
- `--space-3`

### Source contracts

- `components/viz/DotMatrixPreview.jsx`
- `components/viz/DotMatrixPreview.d.ts`
- `components/viz/DotMatrixPreview.prompt.md`
- `stories/ViewerDotMatrixPreview.stories.jsx`

## Sources

- DotMatrixPreview prompt contract: `components/viz/DotMatrixPreview.prompt.md`
- Storybook implementation evidence: `stories/ViewerDotMatrixPreview.stories.jsx`
- [HTML Living Standard — canvas best practices](https://html.spec.whatwg.org/multipage/canvas.html#best-practices)
- [Adafruit RGB LED matrix guide](https://learn.adafruit.com/32x16-32x32-rgb-led-matrix/overview)
- [Daktronics Venus Control Suite 운영 매뉴얼](https://www.daktronics.com/web-documents/manuals/dd4736661.pdf)
