# DotMatrixPreview

`DotMatrixPreview`는 로봇 측면 LED 사인, 순찰 안내판, 전광판처럼 **고정 격자의 1비트 프레임을 실제 패널이 보여 줄 모습 그대로** 미리 보여 주는 **LDS Product / Operations** 시각 부품입니다. provenance는 `product-extension`입니다. 패널 chrome(검은 베젤, 꺼진 점, 색·밝기가 적용된 켜진 점)과 접근 가능한 텍스트 대체만 소유하며, 문구를 비트맵으로 굽는 rasterization, 폰트, 패킷 인코딩, 전송과 상태 폴링은 제품이 소유합니다.

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

## Problem and duplication check

- 반복 문제: 운영자가 LED 문구·색·밝기를 바꾸기 전에 128×32 같은 저해상도 패널에서 글자가 잘리거나 뭉개지지 않는지, 밝기를 낮추면 어떻게 보이는지 확인해야 합니다.
- **`ViewerFrame`·`VideoStreamTile`과의 차이**: 그것들은 카메라·3D·지도처럼 연속 이미지 소스를 감싸는 viewport chrome입니다. 이 컴포넌트는 소스가 아니라 **이산 픽셀 격자**를 그리며, 픽셀 하나하나가 보여야 하므로 `image-rendering: pixelated`와 점 간격이 표현의 핵심입니다.
- **`AnnotatedImage`·`Thumbnail`과의 차이**: 그것들은 실제 이미지를 표시합니다. 이 컴포넌트는 프레임 데이터에서 패널을 합성합니다.
- 기존 primitive 조합만으로는 픽셀 격자·밝기 스케일·접근 가능한 요약을 만들 수 없어 새 부품이 필요합니다. 편집기 자체는 새 컴포넌트가 아니라 조합입니다(아래).

## Anatomy and reading order

1. `figcaption`: 패널 이름(`label`) → 오른쪽에 `status` 슬롯(연결·동기화 상태)
2. 패널: 베젤 안의 `canvas` (`role="img"`, accessible name = `label: description, 밝기 N%`)
3. 요약 줄: 표시 문구(`description`) 또는 `켜진 픽셀 수`, 오른쪽에 `columns×rows · 밝기 N%`

DOM 순서와 시각 순서가 같고, canvas는 상호작용하지 않으므로 Tab stop을 만들지 않습니다. 켜진 점이 하나도 없으면 `data-empty`와 `emptyLabel`로 꺼진 화면임을 텍스트로도 알립니다.

## Contract

- `bitmap`은 좌상단부터 행 우선, 바이트 안에서는 MSB가 먼저인 1비트 프레임입니다(궁릉 MCU 패킷 규격과 같음). `pixels`는 점 단위 truthy 배열이며 둘 다 주면 `pixels`를 씁니다. 길이가 짧으면 나머지는 꺼진 것으로 봅니다.
- `color`는 6자리 hex, `brightness`는 컨트롤러에 보내는 0–255 값입니다. 켜진 점은 `color × brightness/255`로 어둡게 그려 실제 밝기를 가늠하게 합니다. `brightness={0}`은 켜진 점이 있어도 검게 보이지만 요약 줄과 accessible name은 여전히 문구와 `밝기 0%`를 전달합니다.
- `description`은 **접근 가능한 대체 텍스트**입니다. 화면에 보이는 문구를 그대로 넘기세요. 없으면 켜진 픽셀 수만 읽힙니다.
- 켜진 점이 없으면 루트에 `data-empty`를 두고 `emptyLabel`을 읽습니다. 제품은 적용 button 비활성화에 같은 조건(프레임에 켜진 점이 없음)을 쓰면 됩니다.
- 점 크기는 내부 6px 격자(간격 1px)이며 canvas는 `width: 100%`·`aspect-ratio: columns/rows`로 컨테이너에 맞춥니다. 320px 폭에서도 128×32 패널이 4:1 비율로 유지됩니다.

## Editor composition (LED 문구 편집기)

패널 문구 편집기는 별도 컴포넌트가 아니라 다음 조합입니다.

| 역할 | LDS 부품 | 제품 소유 |
| --- | --- | --- |
| 문구 입력(좌/우 패널) | `Input` 또는 `Textarea`(줄바꿈 허용 시) | 줄 수 제한, 글자 수 상한, 안전 문구 기본값 |
| 밝기 | `Slider` (`min=0 max=255 showValue`) | 하드웨어 상한 |
| 색 | `ColorSwatch`(패널이 지원하는 색 팔레트) | 지원 색 목록 |
| 미리보기 | `DotMatrixPreview` × 패널 수 | 문구→비트맵 rasterization(폰트·줄 나눔·세로 정렬) |
| 연결 상태 | `StatusBadge`/`StatusIndicator`를 `status`에 조합 | 폴링 주기, 재시도 |
| 적용 | `Button`(loading) + 필요 시 `ConfirmDialog` | 전송, 실패 복구, 권한 |
| 결과 안내 | `Banner` 또는 `Callout` | 문구 |

- 미리보기는 입력이 바뀔 때마다 갱신하되 전송은 명시적 action으로만 합니다(즉시 반영 금지). 적용 button은 프레임이 비었거나 연결이 끊겼으면 비활성화합니다.
- 두 패널이 같은 문구를 쓰는 경우에도 미리보기는 패널마다 하나씩 두어 좌우가 다른 상황을 감춥니다.

## Visual-delta inventory

- 베젤은 `radius-md`와 `line-solid-strong` 외곽선을 쓰고 배경은 물리 패널의 검정입니다. 카드 elevated 표면 위에 다시 카드를 만들지 않도록 shadow는 없습니다.
- canvas fill은 CSS 변수를 읽을 수 없어 베젤·꺼진 점(6% 흰색)·켜진 점(제품 RGB×밝기) 리터럴을 씁니다. 이 값은 LDS 표면이 아니라 하드웨어를 묘사하므로 `VISUAL_TOKEN_EXCEPTIONS.json`에 예외로 기록합니다.
- 캡션·요약 typography는 `EquipmentStatusCard`의 label1/caption1 규칙을 따릅니다.

## External category evidence

- [HTML Living Standard — canvas best practices](https://html.spec.whatwg.org/multipage/canvas.html#best-practices): canvas에는 같은 목적을 전하는 fallback content를 두고, 텍스트는 canvas가 아니라 마크업으로 제공하라는 지침입니다. 이 컴포넌트는 `role="img"` accessible name과 fallback text, 별도 요약 줄로 문구를 마크업에 남깁니다.
- [Adafruit RGB LED matrix guide](https://learn.adafruit.com/32x16-32x32-rgb-led-matrix/overview): 패널은 고정 격자(16×32, 32×32 등)를 체인으로 잇고 밝기는 구동 측에서 스케일한다는 하드웨어 사실입니다. `columns`/`rows`를 패널 기하로 받고 밝기를 색에 곱해 그리는 근거입니다.
- [Daktronics Venus Control Suite 운영 매뉴얼](https://www.daktronics.com/web-documents/manuals/dd4736661.pdf): 메시지 디스플레이 소프트웨어는 짧고 단순한 문구를 권하며 전송 전 표시 결과를 미리 보는 흐름을 둡니다. 편집기 조합에서 미리보기와 적용을 분리한 근거입니다.

## Product workflow coverage

- **LK Control Gungneung** (`LK-ROBOTICS/lkrobotics-control-gungneung` · `9298e1c0`): `supported by composition`. `frontend/src/views/dashboard/RobotDashboard/components/LedControl/index.jsx`는 128×32 양면 패널, 문구 두 개, 0–255 밝기, 색, MCU 연결 상태, 전송 action과 MSB-first 비트맵 규격을 증명합니다. 문구→비트맵 rasterization(NeoDunggeunmo 폰트, 두 줄 나눔, 세로 중앙 보정)과 `sendLedFrame` 전송은 제품이 소유합니다.
- **LK Control Full Daedeok** (`3bdce49ec6868f016f4ec2cdbd12aabbf8a04f19`): `not applicable`. pinned source에 LED 패널 편집이 없습니다.
- **LK Web Viz** (`4701e1dcfb0d0e9163c74c227da2d6feb801cb30`): `not applicable`.
- **LK Portal** (`e5ee99d5062170e26abe63d9105c2b8a024ce710`): `not applicable`.

## Intentional exclusions

- 문구 rasterization, 폰트 로딩, 줄 나눔, 스크롤·애니메이션 프레임
- 픽셀 직접 편집(그리기), 컬러 픽셀(다비트) 프레임, 패널 체인 배치도
- 전송, 폴링, 권한, 샘플 프레임 불러오기
