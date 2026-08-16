# LDS 자기 기준선 (lds-baseline)

| Field | Value |
| --- | --- |
| Type | Live baseline register |
| Status | Current |
| Owner | Design system owner |
| 결정 기록 | [`OPERATING_MODEL.md`](../../OPERATING_MODEL.md) — "Reference authority" |
| 채택 시점 | 2026-08-16 · 릴리스 라인 `0.1.0-rc.69.19` |

이 디렉터리는 LDS 치수·해부학·파운데이션 값의 **살아있는 권위**다.
2026-08-16 재앵커링으로 만들어졌다 — 그 전에는 WDS `.fig` 스냅샷
([`../wds/`](../wds/README.md))이 살아있는 비교 대상이었고, 지금 그 아카이브는
출처를 증언하는 역사 기록이다.

**채택은 값을 바꾸지 않았다.** 여기 있는 모든 값은 채택 시점의 WDS parity
추출본과 바이트 단위로 같다. 바뀐 것은 권위뿐이다: "Button 높이 40px"의
근거가 "WDS가 그랬다"에서 "LDS가 그렇게 정했다"로 바뀌었다.

## 파일과 게이트 매핑

| 파일 | 내용 | 소비 게이트 |
| --- | --- | --- |
| `COMPONENT_DIMENSIONS.json` | 컴포넌트 치수 164세트 (radius·padX·height·fontSize 등) | `check:component-styles` (토큰 레이어) · `check:component-styles-rendered` (렌더 측정) |
| `COMPONENT_DIMENSIONS_DEEP.json` | 중첩 내부 요소 치수 10세트 (checkbox box, tooltip bubble 등) | `check:nested-styles` |
| `FOUNDATION_VALUES.json` | 타이포 16단·그리드·브레이크포인트·투명도 사다리 | `check:foundation-parity` |
| `FOUNDATION_BASELINE_REPORT.md` | 위 검사의 생성 리포트 | `report:foundation-parity`가 갱신 |

세트 키(`Button/Button` 등)는 WDS 시절의 이름을 유지한다 — 출처 추적성이
목적이고, 게이트가 참조하는 키를 바꾸는 것은 별도 결정이다.

## 값을 바꾸려면

기준선 값 변경은 **디자인 소유자 결정**이다 (AGENTS.md의 Scope Escalation
Gate — 공유 토큰 값 변경과 같은 급). 절차:

1. 변경 근거(측정·접근성·제품 실측)를 이 README의 변경 이력에 기록한다.
2. 해당 JSON의 값을 고치고, 같은 커밋에서 `tokens/*.css`를 맞춘다.
3. `check:component-styles`·`check:foundation-parity`로 정합을 확인한다.

`scripts/freeze-lds-baseline.mjs`와 `report-wds-foundation-parity.mjs
--freeze-baseline`은 **복구 전용**이다 — 아카이브에서 기준선을 다시 만들 때만
쓴다. 값 변경 수단이 아니다 (재동결하면 여기 기록된 의도적 변경이 아카이브
값으로 되돌아간다).

## 변경 이력

- 2026-08-16 — 최초 채택. WDS parity 추출본에서 바이트 동일 동결. 의도적
  변경 0건.
