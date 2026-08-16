# LDS 운영 가이드

| Field | Value |
| --- | --- |
| Type | Operations reference |
| Status | Active (2026-08-16) |
| Owner | Design system owner · Frontend platform |
| 범위 | 릴리스, 위성 관리, 정상 상태의 정의 |
| 관련 | [`OPERATIONS_COST_REDUCTION_PLAN.md`](OPERATIONS_COST_REDUCTION_PLAN.md) (이 문서를 만든 계획) · [`SYSTEM_PARTITION_REFORM_PLAN.md`](SYSTEM_PARTITION_REFORM_PLAN.md) (구조 계약) |

이 문서는 **LDS를 운영하는 사람이 처음 읽는 한 장**이다. 컴포넌트를
만드는 방법은 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)가, 구조가 왜
이런지는 개편 계획이 소유한다. 여기는 굴리는 방법만 다룬다.

---

## 1. 지금 무엇이 있나

```
코어 워크스페이스 (이 저장소)          위성 (독립 저장소)
  packages/core     토큰·기초           robotics-ui   도메인 팩 · 유일하게 성숙
  packages/theme    LK 테마             slides-ui     도메인 팩 · 슬라이드 16종
  packages/product  제품 공통 확장       motion        능력 레이어 · 영상 렌더
                                        3d            능력 레이어 · 선행 구축
```

**셋은 한 저장소에 있고 항상 같이 릴리스된다.** 서로를 정확히 핀하므로
버전이 어긋나면 설치가 깨진다. 위성은 반대로 제각각 릴리스되고, 따로 죽을
수 있다. 이 경계가 "같이 살고 같이 죽는 건 한 저장소"라는 규칙이다.

위성이 LDS를 어느 버전에 핀하고 있는지는
[`references/SATELLITE_PIN_REPORT.md`](references/SATELLITE_PIN_REPORT.md)에
있다. 이 리포트는 손으로 쓰지 않는다 — `npm run report:satellite-pins`가
위성 저장소를 읽어 생성한다.

## 2. 릴리스

### 2.1 왜 robotics가 딸려오나

LDS는 robotics의 배포본(tgz)을 vendor에 넣어 쓰고, robotics는 그 안에
"내가 맞춘 LDS 버전"을 기록해 둔다. 그래서 LDS 버전을 올리면 그 기록과
어긋나 `check:type-surface`가 실패한다. **LDS rc 릴리스에는 robotics rc
릴리스가 반드시 따라온다.** 코드 변경만 커밋하고 릴리스는 나중에 하는 것은
가능하다.

### 2.2 레시피

```bash
# 1. robotics를 먼저 릴리스하고 그 tgz를 가져온다.
#    vendor/에는 robotics tgz가 정확히 하나만 있어야 한다 — 옛것은 지운다.

# 2. 파생값 31곳을 재계산한다. 손으로 고치지 않는다.
npm run update:release-pins -- --lds <새 LDS 버전> --robotics <새 robotics 버전>

# 3. 락파일을 새 버전으로 맞춘다.
npm install --package-lock-only

# 4. CHANGELOG를 쓴다. 이 스크립트가 다루지 않는 유일한 릴리스 기록이다.

# 5. 위성 핀 리포트를 갱신한다. 격차를 좁힐 필요는 없다 — 기록만 하면 된다.
npm run report:satellite-pins

# 6. 검사 통과를 확인하고 커밋·태그·푸시한다.
npm run check:fast
git tag lds-v<새 LDS 버전> && git push --tags
```

태그를 밀면 `release-packages.yml`이 게이트를 돌고 패키지를 퍼블리시한다.

### 2.3 손으로 하는 일은 두 가지뿐

버전을 정하는 것과 CHANGELOG를 쓰는 것. 나머지 31곳(워크스페이스 상호
참조, 스타일 계약, 외부 표면의 sha256, vendor README)은
`update:release-pins`가 계산한다. 손으로 고쳤다가 어긋나면
`check:release-pins`가 CI에서 막는다.

### 2.4 태그를 찍은 뒤 실수를 발견하면

태그를 옮기지 않는다. **버전을 올려 새로 릴리스한다.** 같은 버전이 서로
다른 커밋을 가리키는 상태를 막는 것이 `check:release-immutability --tag`의
목적이고, 이는 릴리스 워크플로가 전용 단계로 검사한다.

## 3. 위성

### 3.1 새로 만들 때

만들기 전에 조건을 통과해야 한다:

- **도메인 팩**(특정 제품군용)이면 — 실제 제품이 쓴다는 소비 핀 증거
- **능력 레이어**(도메인 무관 기능)면 — 기존 위성 2개 이상에 적용 가능하다는 근거

레시피는 기존 위성을 따른다: 독립 저장소 + vendored tgz 소비 + 자기
Storybook 포트. **퍼블리시하는 위성은 LDS 레이어를 `peerDependencies`로
선언한다.** `dependencies`의 `file:` 참조는 `npm pack`이 tgz를 제외하므로
소비자 설치에서 반드시 깨지고, 버전 범위 + overrides는 npm이 `EOVERRIDE`로
거부한다. peer가 유일하게 설치되는 형태다.

핀 리포트의 `vendored 전용` 상태가 이 함정에 걸린 위성을 가리킨다 — LDS를
쓰지만 버전을 주장하지 않는 상태이고, 퍼블리시하는 순간 깨진다.

### 3.2 죽일 때

릴리스 사이클 2회 연속으로 소비자 0이고 커밋도 0이면 아카이브를 기본값으로
심사한다. **예외: 소유자가 선행 구축으로 선언한 위성(현재 3d)은 소비자 0이
실패 신호가 아니다.** 그 경우 질문은 "쓰이나"가 아니라 "예정된 용처가 아직
유효한가"다.

파괴 전에는 소비자 스캔을 **저장소별로** 돌리고, 알려진 소비자가 결과에
나오는지로 도구를 먼저 검증한다. 전체 스캔이 실소비자를 놓친 적이 있다.
0건은 청신호가 아니라 도구를 의심할 이유다.

## 4. 정상 상태의 정의

**main의 CI가 빨간불이면 고장이다.** 예외는 없다.

2026-08-16 이전에는 그렇지 않았다 — `check:release-immutability`가 상시
스위트에 있어서 태그 이후 모든 커밋이 빨간불이었고, "이 빨간불은 정상"이라는
걸러 읽기가 습관이 되어 있었다. 그 기간에 실고장 1건이 실제로 묻혀 있었다.
지금은 태그 동일성 검사가 릴리스 시점(`--tag`)에만 돌고, 상시 스위트에는
언제나 만족 가능한 검사만 남아 있다.

빨간불을 보면 고친다. 무시해도 되는 빨간불은 없다.

## 5. 자주 쓰는 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run check:fast` | 상시 검사 스위트. 커밋 전 기준 |
| `npm run check` | check:fast + Storybook + pack. 최종 확인용 |
| `npm run storybook:dev` | 로컬 Storybook (6006). 색 재생성 없이 뜬다 |
| `npm run update:release-pins` | 릴리스 파생값 31곳 재계산 |
| `npm run report:satellite-pins` | 위성 핀 리포트 생성 (네트워크 필요) |

검사는 작업 중에는 관련된 것만 돌리고, 넘기기 전에 한 번 전체를 돌린다.
매 수정마다 전체를 돌리지 않는다.

## 6. 아직 사람에게만 있는 것

이 문서는 **이관 시험을 통과하지 않았다.** 문서만 읽은 사람이 릴리스
레시피와 lds-motion 퀵스타트를 질문 없이 완주하는지 확인한 적이 없고,
확인될 때까지 이 저장소의 버스 팩터는 1이다. 시험에서 나온 질문은 전부
이 문서의 구멍으로 취급해 메운다.
