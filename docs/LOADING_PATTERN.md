# 로딩 패턴

| Field | Value |
| --- | --- |
| Type | Cross-component pattern guide |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-24 |

로딩을 표현하는 컴포넌트는 여섯 개다. 이 문서는 컴포넌트 각각의 계약(각 `.prompt.md`)이 아니라
**그 사이의 선택** — 어떤 상황에서 무엇을, 예상 시간에 따라 어떻게 고르고, 시작→진행→완료→실패
단계마다 무엇을 보여주는가 — 를 소유한다. 시나리오는 소비 제품이 붙기 전까지 설계 가설이며,
실사용 데이터가 생기면 이 문서의 숫자부터 다시 검증한다.

## 요소 선택

| | Spinner | Skeleton | ProgressBar / CircularProgress | Dimmer | ResourceState |
| --- | --- | --- | --- | --- | --- |
| 형태 | 회전 인디케이터 | 콘텐츠 구조의 회색 예고 | 확정(determinate) 진행률, 선형/원형 | 영역을 덮는 스크림 | 상태 머신을 가진 리소스 표면 |
| 적합 | 짧고 범위가 좁은 작업 | 레이아웃이 예측 가능한 콘텐츠 | 시작·끝이 있는 연속 작업(업로드·변환·내보내기) | 이미 보이는 영역의 일시 차단 | 위젯·표·차트처럼 수명 내내 상태가 바뀌는 표면 |
| 시간대 | ~4초 | 1~10초 | 4초 이상, 특히 10초+ | 재요청·재계산 동안 | 전 구간(loading→ready→stale→error) |
| 유의 | 여러 개 동시 사용 금지 — 화면이 깜빡이는 인상 | 실제 레이아웃과 다르면 역효과 | 진행률을 모르면 쓰지 않는다(indeterminate 변형은 Spinner와 동일 역할) | 페이지 전체를 막지 않는다 | 직접 조립하지 말고 이것을 쓴다 |

**Skeleton과 Spinner 사이의 선택**: 로드될 콘텐츠의 구조를 미리 알면 Skeleton, 모르면(또는
공간이 좁으면) Spinner. 같은 화면에서 두 방식을 섞으면 로딩의 심각도가 두 가지로 읽힌다.

## 시간 기준

임계값은 [Nielsen의 응답 시간 한계](https://www.nngroup.com/articles/response-times-3-important-limits/)
(0.1초/1초/10초)를 기준으로 하며, 아직 실사용 데이터로 보정되지 않았다.

- **~1초**: 아무것도 표시하지 않는다. 이 구간에 인디케이터를 넣으면 플리커가 된다. 지연이
  1초를 넘길 수 있는 작업만 인디케이터를 예약한다.
- **1~4초**: Spinner 또는 Skeleton. 진행률 표시는 오히려 과하다.
- **4~10초**: Skeleton(구조를 알 때) 또는 진행률(`ProgressBar`/`CircularProgress`, 진행을
  측정할 수 있을 때). 사용자가 지루함을 느끼기 시작하는 구간이므로 무엇이 진행 중인지
  텍스트로 밝힌다.
- **10초 이상**: 확정 진행률 + 예상 시간 또는 남은 단계. 시스템이 살아 있다는 증거를
  주기적으로 갱신한다(`RefreshControl`의 "마지막 업데이트" 문법).
- **1분 이상**: 진행률 + 취소 수단 + 가능하면 백그라운드 처리 후 완료 통지(`Toast`).
  `DataExportAction`이 이 계약의 선례다(진행 중 상태·취소·완료 통지).

## 상황별 선택 (로보틱스 운영 도메인 — 설계 가설)

- **대시보드 첫 진입**(위젯별 텔레메트리 로드): 위젯마다 `ResourceState state="loading"` —
  Skeleton을 자체 렌더하고 `aria-busy`와 polite 공지를 소유한다. 페이지 전체 Spinner로
  개별 위젯의 실패를 가리지 않는다.
- **맵·비디오 등 무거운 뷰어 진입**: 뷰어 프레임의 상태 슬롯(로딩 라벨)을 쓰고, 프레임
  바깥에 별도 인디케이터를 두지 않는다.
- **데이터 재요청**(새로고침·필터 변경): 콘텐츠를 지우지 않는다. `ResourceState
  state="refreshing"`은 기존 콘텐츠를 유지한 채 상태만 알리고, 영역 단위 차단이 필요하면
  `Dimmer`(+`Spinner`)가 해당 영역만 덮고 `aria-busy`·`inert`로 실제 차단까지 소유한다.
- **명령 제출**(수동 제어·설정 저장): 제출 컨트롤 자체의 `Button loading` — 버튼은
  포커스를 유지한 채(`aria-disabled`) "불러오는 중"을 낭독하고, 성공·실패는 `Toast`/`Banner`가
  이어받는다. 폼 전체를 Dimmer로 덮지 않는다.
- **추가 로드**(로그 테일·목록 더보기): 뷰포트를 live region으로 만들지 않는다. `LogViewer`가
  선례다 — 도착분 요약만 상시 announcer로 공지하고 뷰포트는 `aria-live="off"`.

## 단계별 피드백

`ResourceState`의 상태 머신이 이 절의 코드 구현이다. 직접 조립하는 표면도 같은 순서를 따른다.

1. **시작**: 1초 규칙을 넘길 작업만 인디케이터 표시. 컨테이너에 `aria-busy` — 시각과 보조기술이
   같은 시점에 "진행 중"을 안다.
2. **진행**: 측정 가능하면 확정 진행률로 승격. 진행 표시의 reduced-motion 정지는 컴포넌트가
   소유하므로(`!important` 계약) 소비자가 재구현하지 않는다.
3. **완료**: 짧은 작업은 조용히 콘텐츠로 대체. 사용자가 명시적으로 시작한 작업만 완료를
   통지(`Toast`)하고, 신선도는 `RefreshControl`의 "마지막 업데이트"로 남긴다.
4. **실패**: 무엇이 실패했고 다음에 뭘 할 수 있는지를 함께 — 콘텐츠가 남아 있으면 비차단
   (`ResourceState`의 preserved `error`: 기존 콘텐츠 유지 + polite), 콘텐츠가 없으면 차단
   (`EmptyState` 표면 + assertive alert). 재시도 액션은 실패 메시지 옆에 둔다. 실패를
   성공처럼 표시하지 않는다 — `CopyButton`의 실패 상태 계약이 선례다.

## 관련 계약

각 컴포넌트의 정확한 API·접근성 계약은 `components/status/Spinner.prompt.md`,
`Skeleton.prompt.md`, `ProgressBar.prompt.md`, `CircularProgress.prompt.md`,
`components/overlay/Dimmer.prompt.md`, `components/data/ResourceState.prompt.md`,
`components/data/RefreshControl.prompt.md`가 소유한다. Storybook에서 실물은
`LDS Product/Status/Progress`, `LDS Core/Components/Overlay/Dimmer`,
`LDS Product/Data/Operations` 그룹에서 확인한다.
