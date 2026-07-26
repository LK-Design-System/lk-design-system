**StatusBadge**는 진행·마감·게시·검토처럼 현재 대상의 명시적인 상태를 짧은 라벨로 보여주는 비대화형 Core 컴포넌트입니다.

```jsx
<StatusBadge tone="positive">진행중</StatusBadge>
<StatusBadge tone="cautionary">마감 임박</StatusBadge>
<StatusBadge tone="negative">처리 실패</StatusBadge>
```

## Classification and boundary

- Runtime owner는 **Core**, provenance는 최신 WDS 상태 배지 시각 증거와 LDS semantic status 문법을 결합한 **WDS-adjacent redesign**입니다.
- 옅은 의미 배경과 같은 계열의 AA 텍스트를 사용하며, 상태 점·pulse·아이콘은 기본 anatomy에 포함하지 않습니다. 라벨 텍스트가 상태의 주 정보입니다.
- 높이 20px, 12px 글자, `--radius-pill`, 좌우 `--space-2`로 기본 Tag와 인라인 중심을 맞춥니다. 분류용 Tag와 상태용 StatusBadge는 같은 높이를 공유하지만 대문자 자간과 tone grammar로 역할이 구분됩니다.
- 실시간 가용성·연결·freshness처럼 계속 관찰되는 신호에는 `StatusIndicator`를 사용합니다. 플랫폼·유형·추천 여부 같은 메타 분류에는 `ContentBadge` 또는 `Tag`를 사용합니다.
- `tone`은 `positive | cautionary | negative | signal | offline`과 시스템 별칭을 정규화합니다. `critical`은 정적인 negative 표면으로 렌더하며 모션을 자동 실행하지 않습니다. 알 수 없는 값은 성공으로 승격하지 않고 neutral/offline으로 안전하게 처리합니다.
- 배지는 읽기 전용 `<span>`이며 `role="status"`를 자동 부여하지 않습니다. 상태 변경 공지가 필요하면 제품이 변화가 발생하는 문장 단위 live region을 소유합니다.

## Evidence and deliberate delta

- 과거 [`COMPONENT_STYLE_PARITY.md`](../../docs/references/wds/COMPONENT_STYLE_PARITY.md)는 neutral fill + dot을 WDS `_Badge/Status`로 매핑했지만, 최신 WDS 사용 화면의 진행·마감 상태는 soft semantic surface + label로 나타납니다. 이 재설계는 lifecycle badge를 최신 시각 문법으로 옮기고 과거 dot 문법을 `StatusIndicator`로 분리합니다.
- [Primer StateLabel](https://primer.style/product/components/state-label/)은 짧은 상태 라벨을 독립된 채움 표면으로 구분하고 small variant를 제공합니다. LDS는 제품별 issue iconography를 복제하지 않고 작은 semantic label이라는 결론만 적용합니다.
- [Spectrum Status light](https://spectrum.adobe.com/page/status-light/)는 dot + label을 별도 status-light 문법으로 정의하고 라벨을 필수로 둡니다. 따라서 dot은 모든 badge의 장식이 아니라 실시간 신호용 `StatusIndicator`로 제한합니다.
- [Carbon Tag](https://carbondesignsystem.com/components/tag/usage/)는 읽기 전용 label/tag가 비대화형이며 짧고 훑기 쉬운 텍스트를 사용한다는 범주 기대치를 확인하는 근거입니다.

## Product boundary and verification

상태 계산, 허용된 상태 전이, 시간 임계값, action과 live announcement는 제품이 소유합니다. LK Web Viz, LK Control Full Daedeok, LK Context Hub는 공통 status label을 소비할 수 있지만 이 시각 재설계가 route·workflow·transport 계약을 바꾸지 않으므로 세 제품 자산 검토는 모두 **not applicable**입니다.

Storybook에서 모든 tone, Tag 인라인 조합, 긴 라벨, light/dark를 확인합니다. 텍스트 대비 4.5:1, 색 외 visible label, 320px reflow와 20px 인라인 중심을 검증합니다.
