# EquipmentStatusCard

`EquipmentStatusCard`는 장비의 **정체성 → 대표 상태 → 라벨이 있는 보조 사실 → 메타데이터/동작**을 한 번에 읽게 하는 `LK Robotics Extension`입니다. 특정 제품의 설비 행이나 대시보드를 재현하지 않으며, 제품이 가진 장비 종류와 상태 범위만 LDS coverage 요구로 사용합니다.

```jsx
<EquipmentStatusCard
  icon={<Icon name="home" size={20} />}
  title="화물 엘리베이터 2호기"
  description="물류동 동측"
  status="운행 중"
  statusTone="positive"
  details={[
    { label: '이동', value: <><Icon name="arrow-up" size={16} aria-hidden="true" /> 상승 중</> },
    { label: '층', value: '3층' },
  ]}
  meta="30초 전에 갱신"
/>

<EquipmentStatusCard
  icon={<Icon name="signal" size={20} />}
  title="옥상 게이트웨이"
  status="주의 필요"
  statusTone="cautionary"
  details={[
    { label: '연결', value: <ConnectionBadge status="reconnecting" size="sm" /> },
    { label: '구역', value: '옥상 서측' },
  ]}
/>
```

## Contract and anatomy

- `title`과 `status`는 필수입니다. `headingLevel`은 주변 문서 계층에 맞춰 `2`–`6` 중 선택하며 기본값은 `3`입니다.
- `statusTone`은 `positive | cautionary | negative | signal | neutral`입니다. 톤은 상태를 보강할 뿐이며, `StatusBadge`의 보이는 라벨이 항상 주 정보를 전달합니다.
- `details`는 `{ label, value }` 배열이며 semantic `<dl>`로 렌더링됩니다. 값에는 문자열뿐 아니라 `ConnectionBadge`, 아이콘+방향 텍스트 같은 LDS 조합을 넣을 수 있습니다.
- `meta`는 갱신 시각이나 소유 정보처럼 낮은 강조도의 정보를, `actions`는 장비 전체에 적용되는 LDS 동작을 받습니다. 전송·권한·확인 정책은 제품이 소유합니다.
- DOM과 keyboard reading order는 identity group → status → details → meta → actions입니다. 좁은 폭에서는 상태와 footer가 다음 줄로 감싸지지만 순서는 바뀌지 않습니다.
- 카드 자체는 semantic `<article>`인 비상호작용 표면입니다. 선택, hover lift, disabled state, focus ring을 만들지 않으며, 실제 버튼/링크의 상호작용 상태는 `actions`에 전달한 primitive가 소유합니다.

## Visual-delta inventory

- **Card**: Card와 같은 elevated semantic surface, line border, `--component-card-radius`, no-shadow 토큰을 사용합니다. nested dark theme에서도 surface/foreground가 함께 전환되도록 background·foreground·line은 Card alias의 theme-adaptive 원천 semantic token에 직접 연결합니다. 상태 요약의 반복 밀도를 위해 기본 Card의 `space-8` 대신 `space-5` padding을 쓰지만 별도 radius·shadow·hover 언어는 만들지 않습니다.
- **RobotStatusCard**: 로봇 선택, thumbnail, battery, live connection cluster가 목적입니다. EquipmentStatusCard는 선택 불가능한 주변 장비 요약이므로 그 구조를 복제하지 않습니다. 기존의 제품 유래 38px icon tile, 오른쪽 ledger 라벨, ring/chip 배열을 제거했습니다.
- **StatusBadge**: 대표 상태의 점+읽을 수 있는 라벨을 그대로 재사용합니다. 카드가 자체 상태 점, 링, 색상 텍스트, pulse/dim 모션을 만들지 않습니다.
- **ConnectionBadge**: 연결이 실제 보조 사실일 때 `details[].value`로 조합합니다. 카드가 `connection` prop이나 연결 상태 machine을 재정의하지 않습니다.
- 아이콘 크기는 소비자가 기존 `Icon` size 축으로 정합니다. 컴포넌트는 임의의 38px/14px geometry를 강제하지 않고, identity가 제목에서 이미 전달되므로 leading icon subtree는 decorative로 숨깁니다.
- 제목은 body1/bold, 설명과 값은 label1, detail label/meta는 caption1을 사용합니다. divider는 details와 footer의 역할 그룹만 구분하고 각 fact를 카드처럼 둘러싸지 않습니다.

## External category evidence

- [Adobe Spectrum Status light](https://spectrum.adobe.com/page/status-light/): 상태 light는 항상 라벨을 포함해야 하고 색만으로 상태를 전달하면 안 됩니다. 라벨 텍스트 색을 상태 점 색과 맞추지 않으며, 긴 라벨은 가용 폭에서 wrap되어야 한다는 결론을 `StatusBadge` 조합과 visible status contract에 반영했습니다.
- [GOV.UK Summary list](https://design-system.service.gov.uk/components/summary-list/): key와 value가 있는 핵심 사실은 `<dl>` summary list로 표현하고, 단순 목록이나 표 데이터에는 남용하지 않습니다. 이를 `details`의 라벨→값 스캔 구조와 semantic markup에 반영했습니다.

외부 레퍼런스는 category anatomy와 접근성 근거이며 스타일을 복사하지 않습니다. LDS sibling과 semantic token이 최종 시각 언어를 결정합니다.

## Product workflow coverage

제품 저장소는 **어떤 장비와 상태 종류를 커버해야 하는지**를 확인하는 자료일 뿐, 이 컴포넌트의 anatomy·geometry·API·시각 스타일 근거가 아닙니다. pinned revision은 `docs/references/product-frontends/COVERAGE_AUDIT.json`에서 관리합니다.

- **LK Control Full Daedeok** (`93802fc2aa5d29f930380ae58d51dcb68322b5e7`): `supported by composition`. 문·엘리베이터·리프트·게이트웨이 등 장비 identity/status/facts를 이 카드와 `ConnectionBadge` 조합으로 표현할 수 있습니다. 장비 transport, command, permission, direction/connection state machine, 화면 layout은 Control 소유입니다.
- **LK Web Viz** (`a984def117c05acd213f494cbb8a42e990595505`): `not applicable`. pinned frontend의 map/editor/viewer workflow는 독립 equipment summary card를 요구하지 않으며 geometry나 editor state를 이 카드에 흡수하지 않습니다.
- **LK Context Hub** (`de124084b7e50049350a46f92c4ea4476269c58c`): `not applicable`. pinned frontend의 knowledge/chat workflow에는 robotics equipment identity+condition summary surface가 없습니다.

## Intentional exclusions and verification

- 제거한 public concepts: `ringLabel`, `ringCaption`, `tone`, `direction`, `connection`, `chips`. 제품 유래 ledger anatomy와 카드 내부 상태 machine을 유지할 독립 근거가 없기 때문입니다.
- 카드 내부 motion, 자동 갱신, command execution, acknowledgement, transport error recovery, 전체 설비 화면은 LDS 범위 밖입니다.
- 대표 Storybook 검토 대상은 `Equipment State / 개요`와 hidden `EquipmentStatusCard card parity`입니다. normal width의 elevator/gateway, 좁은 폭의 long identity/status, dark theme의 connection composition을 확인하고 제목→상태→facts→footer의 순서, wrap, overflow, divider, card-within-card 부재를 비교합니다.
