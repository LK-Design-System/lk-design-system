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
어긋나 `check:type-surface`가 실패한다(이름에 robotics가 없지만 실제로
대조하는 것은 `scripts/check-workspace-packages.mjs`의 robotics 문서 매니페스트
비교다). **LDS rc 릴리스에는 robotics rc 릴리스가 반드시 따라온다.** 코드
변경만 커밋하고 릴리스는 나중에 하는 것은 가능하다.

**순서에 함정이 있다.** robotics 산출물 안에 LDS 버전이 구워지므로
(`ROBOTICS_EXTERNAL_SURFACE.json`의 `canonicalContract.source.ref` =
`lds-v<LDS 버전>`), **새 LDS 버전을 먼저 정한 뒤에** robotics를 릴리스해야
한다. "robotics가 먼저"는 tgz를 만드는 순서일 뿐, 버전을 정하는 순서가
아니다.

**위성은 LDS를 정확한 버전이 아니라 범위로 선언한다.** 이유가 둘이다.

1. 정확히 핀하면 호스트가 한 버전만 올라가도 npm이 위성 밑에 **디자인 시스템
   사본을 하나 더** 설치한다. 실측으로 확인했다 — robotics가 rc.4를 핀한 동안
   워크스페이스의 rc.69.18 옆에 65버전 된 rc.4가 나란히 설치돼 있었다.
2. 위성은 LDS를 레지스트리에서 설치하는데(robotics는 자체 conformance 규칙이
   `file:` 의존을 금지한다), **지금 만들고 있는 LDS 버전은 아직 퍼블리시되지
   않았으므로 핀할 수가 없다.** 즉 정확한 핀은 구조적으로 항상 한 릴리스
   뒤처지고, 뒤처지는 순간 1번이 발동한다.

그래서 계약은 값을 둘로 나눠 가진다:

| 필드 | 뜻 | 예 |
| --- | --- | --- |
| `version` | **검증한** 정확한 버전 (재현성) | `0.1.0-rc.69.18` |
| `declaredRange` | 위성이 package.json에 **선언하는** 범위 (호환성) | `>=0.1.0-rc.69.18 <0.2.0` |

`declaredRange`는 peerDependencies에만 허용되고, 검증한 버전을 포함해야 한다.
`devDependencies`는 위성 자신의 개발용이라 정확한 버전을 쓰며 한 릴리스
뒤처지는 것이 정상이다 — 핀 리포트도 그것은 격차로 세지 않는다.

### 2.2 버전 번호 정하기

현재 라인은 `0.1.0-rc.<major>.<minor>` 4단이다(예: `0.1.0-rc.69.18`).

| 상황 | 다음 버전 |
| --- | --- |
| 대부분의 릴리스 — 컴포넌트·토큰·문서·스크립트 변경 | 마지막 자리 +1 (`rc.69.19`) |
| 워크스페이스 패키지 구성이 바뀜(패키지 추가·삭제), 공개 API 대량 변경 | 셋째 자리 +1, 넷째 자리 0 (`rc.70.0`) |

robotics는 자기 라인(`0.1.0-rc.N`)을 따로 쓰고 릴리스마다 +1 한다. LDS
버전과 숫자를 맞추려 하지 않는다.

### 2.3 robotics 릴리스

robotics 저장소: **`LK-Design-System/lk-design-system-robotics`**
(로컬 체크아웃은 `Documents/lds_ws/lk-design-system-robotics`. 없으면 clone한다.)

robotics는 레지스트리에 퍼블리시하지 않는다 — **LDS로 전달되는 경로는
vendored tgz 하나뿐이다.** 그래서 "릴리스"는 버전을 올리고 pack해서 LDS의
`vendor/`에 넣는 것까지다.

```bash
cd <robotics 체크아웃>

# ① LDS 레이어 핀이 새 LDS 버전을 가리키게 한다.
#    robotics는 자체 conformance 규칙이 file: 의존을 금지하므로
#    레지스트리 버전을 쓴다(peerDependencies의 core·product, devDependencies의 theme).
#    LDS 쪽 docs/references/package-split/CROSS_REPOSITORY_STYLE_CONTRACT.json의
#    profiles."robotics-ui".packageDependencies도 같은 값으로 함께 고친다 —
#    양쪽이 일치해야 check:lds-style이 통과한다.

npm version <새 robotics 버전> --no-git-tag-version
npm install                    # NODE_AUTH_TOKEN 필요 (GitHub Packages)

# ② 검사. 형제 LDS 체크아웃이 낡았으면 릴리스 라인을 명시적으로 가리킨다.
LDS_CONFORMANCE_CLI=<LDS 체크아웃>/packages/conformance/src/cli.mjs npm run check:lds-style
npm run check:local

# ③ 문서를 재생성하고 빌드한 뒤 LDS의 vendor/로 pack한다.
npm run generate:docs && npm run build
npm pack --pack-destination <LDS 체크아웃>/vendor

# ④ 커밋·푸시.
```

그리고 LDS의 `vendor/`에서 **옛 robotics tgz를 지운다** — 정확히 하나만
있어야 한다(`update:release-pins`가 두 개 이상이면 멈춘다).

### 2.4 LDS 릴리스 레시피

```bash
# 1. 새 tgz를 실제로 설치한다. 이 순서가 중요하다 — 다음 단계가 문서 해시를
#    "설치된" robotics에서 계산하므로, 설치를 건너뛰면 옛 버전의 해시가
#    새 버전 기록에 들어간다. (스크립트가 설치본 버전을 확인해 막는다.)
npm install

# 2. 파생값 31곳을 재계산한다. 손으로 고치지 않는다.
npm run update:release-pins -- --lds <새 LDS 버전> --robotics <새 robotics 버전>

# 3. 락파일을 새 버전으로 맞춘다.
npm install --package-lock-only

# 4. CHANGELOG를 쓴다. 이 스크립트가 다루지 않는 유일한 릴리스 기록이다.
#    형식이 기계 검사 대상이다 — 반드시 날짜를 붙인 이 형태여야 한다:
#      ## <새 LDS 버전> - YYYY-MM-DD
#    짝 robotics 버전도 여기 적는다.

# 5. 위성 핀 리포트를 갱신한다. 격차를 좁힐 필요는 없다 — 기록만 하면 된다.
npm run report:satellite-pins

# 6. 스테이징을 먼저 한다. check:generated가 `git diff -- src dist packages`라서
#    2단계가 고친 packages/*/package.json이 스테이징되지 않으면 실패한다.
git add -A

# 7. 검사.
npm run check:fast

# 8. 커밋·태그·푸시. 브랜치와 태그를 둘 다 민다 —
#    태그만 밀면 원격에 없는 커밋을 가리킨다.
#
#    `--tags`를 쓰지 않는다. 그것은 로컬의 **모든** 태그를 밀기 때문에,
#    원격에 없던 옛 태그까지 함께 올라가 릴리스 워크플로를 여러 개 띄운다
#    (2026-08-16에 실제로 rc.62가 딸려 올라가 실패 런을 하나 만들었다).
#    이번에 만든 태그 하나만 이름으로 민다.
git commit -m "release: <새 LDS 버전>"
git tag lds-v<새 LDS 버전>
git push
git push origin lds-v<새 LDS 버전>
```

### 2.5 릴리스 이후

태그를 밀면 `release-packages.yml`이 게이트(`check:release-immutability --tag`
→ 패키지 부재 확인 → `check:fast`)를 돌고 core/theme/product를 GitHub
Packages에 퍼블리시한다.

확인:

```bash
gh run list --workflow=release-packages.yml --limit 1
npm view @lk-design-system/lds-core@<새 LDS 버전> version   # NODE_AUTH_TOKEN 필요
```

**실패하면 태그를 옮기지 않는다.** 고친 뒤 버전을 올려 다시 릴리스한다 —
같은 버전이 서로 다른 커밋을 가리키는 것을 막는 것이 이 게이트의 목적이다.

### 2.6 손으로 하는 일은 두 가지뿐

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

핀 리포트의 상태 라벨이 이것을 구분한다:

| 상태 | 뜻 | 할 일 |
| --- | --- | --- |
| `current` | LDS 핀이 현행 릴리스 라인과 같다 | 없음 |
| `behind` | 핀이 뒤처졌다 | 기록만 하면 된다. 정렬은 선택 |
| `vendored-only` | ⚠ 퍼블리시하는데 vendored `file:`만 있다 | **고친다** — 퍼블리시하면 깨진다 |
| `vendored-app` | `private: true`라 퍼블리시하지 않는다 | 없음. `file:`가 옳다 |
| `no-lds-pin` | LDS를 아직 쓰지 않는다 | 없음 |

`vendored-only`만 조치 대상이다. `vendored-app`은 같은 모양이지만 퍼블리시
하지 않으므로 함정이 발동할 수 없고, 오히려 clone 설치가 레지스트리 인증
없이 끝나는 이점이 있다.

**새 위성을 만들었다면 `scripts/report-satellite-pins.mjs`의 `satellites`
배열에 등록한다.** 등록하지 않으면 리포트에 잡히지 않고, 리포트가 막으려던
바로 그 "침묵 속 방치" 상태가 된다.

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

### 4.1 `check:fast`가 실패했을 때

검사는 **순차로 돌고 첫 실패에서 멈춘다**(`scripts/run-package-scripts.mjs`).
그러니 화면 맨 아래 실패 하나만 보면 된다 — 나머지는 아직 돌지도 않았다.
실패한 검사 이름을 그대로 다시 돌려 반복한다:

```bash
npm run <실패한 검사 이름>
```

원인을 세 갈래로 가른다:

| 갈래 | 신호 | 대처 |
| --- | --- | --- |
| **환경** | pull 직후, 또는 `node_modules`가 낡음 | `npm install`부터. 설치된 패키지를 읽는 검사(`check:conformance`, `check:type-surface`)가 엉뚱하게 실패하는 원인 1위다 |
| **베이스라인** | "drift", "baseline", "snapshot" 문구 | 변경이 의도된 것이면 짝이 되는 `update:*`/`generate:*`를 돌려 갱신하고 **그 갱신 자체를 커밋에 포함**한다. 의도치 않았다면 진짜 회귀다 |
| **진짜 회귀** | 위 둘이 아님 | 고친다 |

베이스라인 갱신은 자동 통과 수단이 아니다. **무엇이 왜 바뀌었는지 설명할 수
있을 때만** 돌린다 — 설명할 수 없으면 그것이 회귀다.

`check:generated`(`git diff --exit-code -- src dist packages`)는 성격이 다르다.
생성 산출물이 커밋되지 않았다는 뜻이므로, `npm run build` 후 `git add`한다.

## 5. 자주 쓰는 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run check:fast` | 상시 검사 스위트. **커밋 전 기준이자 릴리스 게이트다** |
| `npm run check` | check:fast + Storybook + pack. 넓게 확인하고 싶을 때 |
| `npm run storybook:dev` | 로컬 Storybook (6006). 색 재생성 없이 뜬다 |
| `npm run report:inventory` | 컴포넌트·스토리 수 (손으로 센 숫자를 믿지 않는다) |
| `npm run update:release-pins` | 릴리스 파생값 31곳 재계산 |
| `npm run report:satellite-pins` | 위성 핀 리포트 생성 (네트워크 필요) |

**릴리스 게이트는 `check:fast`다.** 다른 문서에 `check:ops-release`나
`check`가 릴리스 게이트로 적혀 있다면 낡은 것이다 — CI의 릴리스 워크플로가
실제로 돌리는 것은 `check:fast`이고, 그것이 정의다.

`report:satellite-pins`는 `raw.githubusercontent.com`에 **인증 없이** 접근한다.
위성이 private이 되거나 rate-limit에 걸리면 해당 위성은 `unreachable`로
기록되고 리포트 생성 자체는 성공한다 — 릴리스가 막히지 않는다. 다만
`unreachable`이 남은 채로 릴리스했다면 다음에 그 위성을 확인한다.

검사는 작업 중에는 관련된 것만 돌리고, 넘기기 전에 한 번 전체를 돌린다.
매 수정마다 전체를 돌리지 않는다.

## 6. 위성 문서

각 위성의 사용법은 그 저장소가 소유한다. 시작점:

| 위성 | 저장소 | 시작 문서 |
| --- | --- | --- |
| robotics-ui | [lk-design-system-robotics](https://github.com/LK-Design-System/lk-design-system-robotics) | 저장소 README + [Storybook](https://lk-design-system.github.io/lk-design-system-robotics/) |
| slides-ui | [lk-design-system-slides](https://github.com/LK-Design-System/lk-design-system-slides) | 저장소 README |
| motion | [lk-design-system-motion](https://github.com/LK-Design-System/lk-design-system-motion) | 저장소 README의 "시작하기" (clone → `npm install` → `npm run dev`) |
| 3d | [lk-design-system-3d](https://github.com/LK-Design-System/lk-design-system-3d) | 저장소 README |

## 7. 이관 시험 기록

2026-08-16, 이 저장소의 문맥이 전혀 없는 두 독자로 시험했다.

**신입 시험(lds-motion)** — clone부터 새 장면 렌더까지 **완주했다**(재시도 0).
다만 완주 과정에서 소스 5개를 열었고 그중 2개는 문서에 답이 없어서였다.
구멍 9건이 나왔고 전부 메웠다(슬라이드 목록·prop의 출처, 낡은 SKILL.md,
registry 엔트리 예시, Node 버전).

**인계자 시험(릴리스)** — **완주하지 못했다.** 1단계에서 멈췄다: robotics
저장소가 어디인지, 거기서 무엇을 하는지가 어느 문서에도 없었다. 구멍 12건,
문서 간 모순 11건이 나왔다. §2.1~2.5, §3.1, §4.1, §5가 그 답이다.

두 시험이 공통으로 가리킨 것: **문서가 틀린 것보다 문서가 낡은 것이 더
위험하다.** 낡은 문서가 "Status: Current"를 달고 있으면 새 문서를 무력화한다.
그래서 현재 상태의 권위는 [`README.md`](README.md)의 표 하나로 모았고,
손으로 갱신하는 숫자는 스크립트 산출물로 대체했다.

**아직 확인되지 않은 것**: 다른 사람의 실제 PC(다른 OS·Node)에서의 동작.
이것만은 문서로 메울 수 없다.
