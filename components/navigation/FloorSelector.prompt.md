**FloorSelector** — 빌딩 층/레벨 선택기. 단일 선택 리스트로 활성 층은 시그널 잉크로 채워집니다(맵·플로어 뷰의 우측 컨트롤).

```jsx
<FloorSelector value={floor} onChange={setFloor}
  floors={[{ value: 'B1', label: 'B1' }, { value: '1F', label: '1F' }, { value: '2F', label: '2F' }]} />
```

- **floors** 문자열 또는 `{ value, label }`(위→아래 순서) · 제어(`value`)/비제어(`defaultValue`). ARIA radio group(단일 선택): 단일 tab stop(roving tabindex), 화살표로 이동+선택, Home/End. 각 층은 `role="radio"`·`aria-checked`.

## 표면 외형

- **appearance** `light | dark`(기본 `light`). Viewer 표면 위에 얹을 때는 반드시 `dark`를
  지정한다. 기본 `light`의 채움(`fill-normal`)과 라벨 잉크(`label-neutral`)는 다크
  캔버스 위에서 비선택 층이 약 **1.3:1**까지 떨어져 읽히지 않는다.
- `dark`는 라이트 토큰을 어둡게 물들이지 않고 Viewer가 이미 쓰는
  `--component-viewer-surface-elevated` / `--component-viewer-border` /
  `--component-viewer-muted`로 갈아탄다. 같은 표면 위 다른 컨트롤과 재질이 일치한다.
- 선택 층은 두 외형 모두 `primary` 채움 + `static-white`를 유지한다. 활성 표시는
  표면과 무관하게 같아야 하기 때문이다.

## 치수와 곡률

- 이 컨트롤은 Viewer 표면 위에 얹혀 `ViewerToolbar`와 나란히 놓인다. 따라서 컨테이너
  곡률은 Viewer 표면·툴바와 같은 `--radius-md`(12px)를 쓴다. 자기만의 곡률 체계를
  만들지 않는다.
- 세그먼트 곡률은 동심 관계를 지킨다: 컨테이너 12px − 패딩 4px = **8px**. 이 값이
  의미 스케일에 없어 `--radius-8`을 쓰며, 임의 선택이 아니라 위 계산의 결과다.
  패딩을 바꾸면 세그먼트 곡률도 함께 바꿔야 한다.
- 두 외형 모두 컨테이너에 헤어라인을 둔다. 라이트에서 채움만 쓰면 흰 배경 대비가
  1.1:1이라 경계가 사라지고 라벨만 떠 보인다. 세그먼트 컨트롤이라는 그룹 어피던스는
  채움이 아니라 경계선이 만든다.
- **size** `sm | md`(기본 `sm`). 이 컨트롤의 자리는 Viewer의 우측 컨트롤 열이고,
  거기서 ViewerToolbar 버튼은 28px다. 44px로 두면 같은 레일에 얹힌 더 무거운
  다른 컨트롤처럼 읽히므로 기본을 28px에 맞춘다. 라벨은 `--caption1-size`로
  주변 뷰어 메타 텍스트와 같은 위계에 둔다.
- `md`(44×44, `--label1-size`)는 뷰어 밖 단독 배치용이다. 패널 전체를 겨냥할 수
  있는 상황이라 WCAG 2.5.5(AAA) 44×44를 만족시킨다. 기본 `sm`은 2.5.8(AA, 24×24)을
  넘지만 2.5.5는 만족하지 않으므로, 터치 우선 화면은 `md`를 지정한다.
