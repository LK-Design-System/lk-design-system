# LDS 운영 가이드

| Field | Value |
| --- | --- |
| Type | Operations reference |
| Status | Active (2026-08-23) |
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
  packages/theme    LK 테마             slides-ui     도메인 팩 · 슬라이드 14종
  packages/product  제품 공통 확장       motion        능력 레이어 · 영상 렌더
                                        (slides-ui의 슬라이드는 14종이다 —
                                         DeckViewer 등 상영 런타임은 별도)
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
"내가 맞춘 LDS 버전"을 기록해 둔다. 그래서 LDS 버전을 올리면 — 그리고
**버전을 올리지 않아도 Core 패키지 문서 표면(`packages/core/docs/*`로
투영되는 것)을 바꾸면** — 그 기록과 어긋나 `check:type-surface`가
실패한다(이름에 robotics가 없지만 실제로 대조하는 것은
`scripts/check-workspace-packages.mjs`의 robotics 문서 매니페스트 비교다).
**LDS rc 릴리스에는 robotics rc 릴리스가 반드시 따라온다.** 코드
변경만 커밋하고 릴리스는 나중에 하는 것은 가능하다 — 단, Core 문서
표면을 바꾼 커밋은 다음 짝 릴리스 전까지 main을 빨갛게 만드므로,
그런 변경은 짝 릴리스와 가까운 시점에 묶는다 (§4.1의 베이스라인 갈래).

**순서에 함정이 있다.** robotics 산출물 안에 LDS 버전이 구워지므로
(이 저장소의 `docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json`,
필드 `documentation.canonicalContract.source.ref` = `lds-v<LDS 버전>`),
**새 LDS 버전을 먼저 정한 뒤에** robotics를 릴리스해야
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

첫 stable 이후 지원 라인은 `0.1.x`다. `0.1.0-rc.<major>.<minor>` 형식은 stable 이전
후보와 별도 검증 후보의 immutable history로 유지한다.

| 상황 | 다음 버전 |
| --- | --- |
| `0.1.x` 호환 범위의 결함·접근성·문서·additive API 변경 | stable patch +1 (`0.1.1`) |
| stable 전 추가 검증 후보 | 마지막 RC 자리 +1 (`rc.69.32`) |
| public export/prop/token 제거 또는 의미 변경 | `0.1.x`에서 금지; breaking review 후 `0.2.0` 이상 |

robotics는 자기 라인(`0.1.0-rc.N`)을 따로 쓰고 릴리스마다 +1 한다. LDS
버전과 숫자를 맞추려 하지 않는다.

### 2.3 robotics 릴리스

robotics 저장소: **`LK-Design-System/lk-design-system-robotics`**
(로컬 체크아웃은 `Documents/lds_ws/lk-design-system-robotics`. 없으면 clone한다.)

robotics는 레지스트리에 퍼블리시하지 않는다 — **LDS로 전달되는 경로는
vendored tgz 하나뿐이다.** 그래서 "릴리스"는 버전을 올리고 pack해서 LDS의
`vendor/`에 넣는 것까지다. 생성 문서가 `packages/core/docs/*`를 스냅샷으로
가져가므로, Core 문서 표면이 바뀐 릴리스는 아래 두 저장소 순환을 생략할 수 없다.

**선행조건 — 시작 전에 넷을 확인한다:**

1. LDS main CI가 초록이고 `npm run check:release-pins`가 통과한다. 릴리스
   사이에 Core 문서 표면이 바뀌었다면 여기서 이미 드리프트가 보인다(§2.1) —
   그 드리프트의 정식 해소가 바로 지금 하려는 짝 릴리스이므로 진행하면 된다.
   다른 종류의 빨간불이면 먼저 고친다.
2. robotics 체크아웃이 `main`이고 origin과 동기이며 작업트리가 깨끗하다.
   다른 작업자의 미푸시 커밋·작업트리 변경이 있으면 릴리스 전에 조율한다.
3. `NODE_AUTH_TOKEN`이 설정돼 있다 — GitHub Packages 읽기용. `gh` 로그인이
   있으면 `gh auth token`으로 얻는 것이 가장 빠르고, 없으면 `read:packages`
   스코프 PAT를 만든다. PowerShell은 `$env:NODE_AUTH_TOKEN = ...`,
   또는 `~/.npmrc`에 설정.
4. Node 22 (CI가 검증하는 버전은 22.17.1이다. 로컬 24에서도 대부분
   동작하지만 판정 기준은 CI다).

```bash
# ⓪ LDS 체크아웃에서 새 LDS identity를 먼저 부트스트랩한다. 이때는 아직
#    현재 Robotics tgz와 설치본을 유지한다. 커밋·태그·푸시는 하지 않는다.
cd <LDS 체크아웃>
node scripts/update-release-pins.mjs --lds <새 LDS 버전> --robotics <현재 robotics 버전>
npm run generate:workspace-sources

cd <robotics 체크아웃>

# ① LDS 레이어 핀을 갱신한다. "새 LDS 버전"이 아니라 **직전 퍼블리시된
#    LDS 버전**을 적는다 — 지금 만드는 버전은 아직 레지스트리에 없어 설치
#    자체가 안 된다(§2.1). 예: rc.69.20을 내는 릴리스에서 peer
#    declaredRange의 하한·계약의 version·theme dev핀은 전부 rc.69.19다.
#    한 릴리스 뒤처지는 것이 정상이다.
#    robotics는 자체 conformance 규칙이 file: 의존을 금지하므로
#    레지스트리 버전을 쓴다(peerDependencies의 core·product, devDependencies의 theme).
#    LDS 쪽 docs/references/package-split/CROSS_REPOSITORY_STYLE_CONTRACT.json의
#    profiles."robotics-ui".packageDependencies도 같은 값으로 함께 고친다 —
#    양쪽이 일치해야 check:lds-style이 통과한다.

npm version <새 robotics 버전> --no-git-tag-version
npm install                    # NODE_AUTH_TOKEN 필요 (GitHub Packages)

# ② 새 LDS Core 문서 표면을 명시적으로 투영하고 Robotics 자체 계약을 검사한다.
npm run generate:docs -- --upstream-root <LDS 체크아웃>/packages/core/docs
npm run check:local
npm run check:storybook:local

# ③ 빌드·pack 파일 집합을 확인한 뒤 LDS의 vendor/로 candidate를 pack한다.
npm run build
npm pack --dry-run --ignore-scripts
npm pack --pack-destination <LDS 체크아웃>/vendor
```

Stable 승격처럼 `packages/core/docs/*`의 release ref나 package migration 문서가 바뀌는
경우에는 Robotics 문서를 생성하기 전에 그 Core 문서 투영을 먼저 동결한다. 그 뒤
`docs/PACKAGE_MIGRATION_GUIDE.md`, canonical adoption contract 또는 Core package docs에
투영되는 source를 다시 바꾸면 Robotics snapshot hash도 달라지므로 같은 Robotics version의
최종 tgz를 다시 만들고 설치·2차 pin·검사를 반복해야 한다. Tag 뒤에 이 순환을 발견하면
기존 tag를 움직이지 말고 새 version으로 다시 릴리스한다.

이 시점에는 아직 Robotics를 커밋·태그하지 않는다. LDS external surface가 옛
tgz를 가리키므로 cross-repository 검사는 의도적으로 실패한다. §2.4의 2차 해시
완성 뒤 `check:lds-style`까지 통과한 같은 bytes만 immutable release로 확정한다.

그리고 LDS의 `vendor/`에서 **옛 robotics tgz를 지운다** — 정확히 하나만
있어야 한다(`update:release-pins`가 두 개 이상이면 멈춘다). 태그는 이미 존재하는
release identity를 옮기지 않는다. 실패를 고쳤다면 Robotics 버전을 올려 새 tag/tgz를 만든다.

### 2.4 LDS 릴리스 레시피

```bash
# 1. 새 tgz를 vendor/에 넣고 옛 tgz를 제거한 뒤 1차를 돌린다. 이 1차는
#    package.json 경로와 version identity만 새 tgz로 바꾼다. 설치본이 아직
#    이전 버전인 동안 문서 해시는 의도적으로 쓰지 않는다.
node scripts/update-release-pins.mjs --lds <새 LDS 버전> --robotics <새 robotics 버전>

# 2. 새 tgz를 실제로 설치한 뒤 같은 명령을 2차로 돌린다. 이 순서가 중요하다 —
#    2차가 설치된 robotics 문서 bytes의 해시까지 완성한다.
npm install
node scripts/update-release-pins.mjs --lds <새 LDS 버전> --robotics <새 robotics 버전>

# 3. 파생값 31곳을 재계산하는 위 명령을 손으로 대체하지 않는다.
#    root와 워크스페이스 package.json의 version 필드도 이 스크립트가 올린다 —
#    별도의 npm version 단계는 없다.
npm install --package-lock-only

# 4. 이제 LDS external surface와 설치본이 같은 candidate를 가리킨다.
#    Robotics candidate를 먼저 commit/push하고 exact SHA의 CI·Pages를 확인하되,
#    아직 tag는 만들지 않는다. 최종 LDS commit SHA를 입력으로 받는 release gate가
#    성공한 뒤에만 immutable Robotics tag를 만든다.
cd <robotics 체크아웃>
LDS_CONFORMANCE_ROOT=<LDS 체크아웃> \
LDS_CONFORMANCE_CLI=<LDS 체크아웃>/packages/conformance/src/cli.mjs \
npm run check:lds-style
git commit -m "release: <새 robotics 버전>"
git push origin main
cd <LDS 체크아웃>

# 5. CHANGELOG를 쓴다. 이 스크립트가 다루지 않는 유일한 릴리스 기록이다.
#    형식이 기계 검사 대상이다 — 반드시 날짜를 붙인 이 형태여야 한다:
#      ## <새 LDS 버전> - YYYY-MM-DD
#    짝 robotics 버전도 여기 적는다.

# 6. 위성 핀 리포트를 갱신한다. 격차를 좁힐 필요는 없다 — 기록만 하면 된다.
npm run report:satellite-pins

# 7. 검토한 release 파일만 명시적으로 스테이징한다. check:generated가
#    `git diff -- src dist packages`를 보므로 packages/*/package.json과 생성 투영도
#    빠뜨리지 않는다. 작업트리의 무관한 untracked 파일은 포함하지 않는다.
git add <검토한 release 파일들>

# 8. 검사.
npm run check:fast

# 9. LDS candidate를 commit/push하고 exact SHA의 CI·Pages를 확인한다.
#    이어서 Robotics release gate를 그 LDS SHA로 dispatch한다. 실행 결과의
#    Robotics head SHA와 입력 LDS SHA가 두 candidate와 정확히 같은지 확인한 뒤
#    Robotics tag, LDS tag 순으로 각각 하나씩 민다.
#
#    `--tags`를 쓰지 않는다. 그것은 로컬의 **모든** 태그를 밀기 때문에,
#    원격에 없던 옛 태그까지 함께 올라가 릴리스 워크플로를 여러 개 띄운다
#    (2026-08-16에 실제로 rc.62가 딸려 올라가 실패 런을 하나 만들었다).
#    이번에 만든 태그 하나만 이름으로 민다.
git commit -m "release: <새 LDS 버전>"
git push origin main

gh workflow run release-gate.yml \
  --repo LK-Design-System/lk-design-system-robotics \
  --ref main \
  -f lds_sha=<exact LDS candidate SHA>

cd <robotics 체크아웃>
git tag v<새 robotics 버전> <exact Robotics candidate SHA>
git push origin refs/tags/v<새 robotics 버전>

cd <LDS 체크아웃>
git tag lds-v<새 LDS 버전> <exact LDS candidate SHA>
git push origin refs/tags/lds-v<새 LDS 버전>
```

### 2.5 릴리스 이후

태그를 밀면 `release-packages.yml`의 `publish` job이 게이트
(`check:release-immutability --tag` → 패키지 부재 확인 → `check:fast`)를
돌고 core/theme/product를 GitHub Packages에 퍼블리시한다. 이어지는
`verify-published` job은 레지스트리 전파를 별도로 재시도하며 세 패키지의
정확한 버전·integrity·선택된 dist-tag를 확인한다. 발행은 성공하고 이 검증
job만 일시 실패했다면 GitHub의 **Re-run failed jobs**로 검증만 다시 실행한다.

확인:

```bash
gh run list --workflow=release-packages.yml --limit 1
npm view @lk-design-system/lds-core@<새 LDS 버전> version   # NODE_AUTH_TOKEN 필요
npm run check:published-release                            # 정확한 tag checkout에서 실행
```

세 package 각각에서 `name`, `version`, `dist.tarball`, `dist.shasum`, `dist.integrity`,
`publishedAt`과 `dist-tags`를 수집한다. RC는 `rc`, stable은 `latest`가 선택되어야 하며 다른
채널의 기존 tag를 암묵적으로 바꾸지 않는다. Stable publish 뒤에는 실제 tag SHA·workflow
run·registry metadata로 `LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json` 같은 structured evidence를
만들고 `check:published-release`와 `check:adoption-registry`를 다시 실행한다.

Support policy/matrix/rollback의 machine status는 실제 publish·availability가 확인된 후에만
`published-verified`로 바꾼다. Consumer pin과 attestation은 해당 제품이 exact stable tgz로
install/build/workflow를 다시 통과한 뒤 별도 evidence commit으로 갱신한다. Package release,
consumer adoption, product deployment는 서로 독립이며 deployment evidence가 없으면 계속
`not-attested`다.

**실패하면 태그를 옮기지 않는다.** 고친 뒤 버전을 올려 다시 릴리스한다 —
같은 버전이 서로 다른 커밋을 가리키는 것을 막는 것이 이 게이트의 목적이다.
패키지가 하나라도 이미 발행된 상태에서는 전체 workflow를 다시 실행하지 말고,
세 패키지의 실제 상태와 dist-tag를 먼저 감사한다.

### 2.6 손으로 하는 일은 두 가지뿐

버전을 정하는 것과 CHANGELOG를 쓰는 것. 나머지 31곳(워크스페이스 상호
참조, 스타일 계약, 외부 표면의 sha256, vendor README)은
`update:release-pins`가 계산한다. 손으로 고쳤다가 어긋나면
`check:release-pins`가 CI에서 막는다.

### 2.7 태그를 찍은 뒤 실수를 발견하면

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

**모노레포 위성은 루트에 아무것도 선언하지 않는다.** 리포트는 루트
`package.json`만 읽던 동안 `3d`를 `no-lds-pin`("LDS 미사용")으로 적었는데, 실제로는
`apps/docs`가 core/theme/product를 **rc.4**로 핀하고 있었다 — 릴리스 라인에서 65
버전 뒤. 낡은 기록보다 나쁜 종류의 오류다: 리포트가 "적을 것이 없다"고 주장했으니
주의 깊게 읽어도 격차가 보이지 않았다. 2026-08-17에 리포트가 워크스페이스 멤버를
함께 읽도록 고쳤고, 핀이 **어디에 선언됐는지**(루트 vs `apps/docs`)를 표에 적는다 —
루트 선언은 소비자에게 하는 약속이고 멤버 선언은 그 멤버의 것이라 같은 값이라도
뜻이 다르다.

`3d`의 rc.4 격차 판정: **기록하고 두되, 다음 3d 릴리스에서 올린다.** 격차가 있는
곳이 퍼블리시되지 않는 `apps/docs`(private) 하나이고 3d 패키지들 자체는 LDS를 물지
않으므로 소비자에게 새는 경로가 없다 — R4-2의 "격차는 허용, 침묵은 불가"가 정확히
이 상태를 위한 규칙이다. 65 버전을 한 번에 올리는 것은 그 레포의 게이트(pnpm
corepack 심, `check:lds-style` 드리프트)와 함께 다뤄야 하는 별개 작업이다.

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
| **베이스라인** | "drift", "baseline", "snapshot" 문구 | 변경이 의도된 것이면 짝이 되는 `update:*`/`generate:*`를 돌려 갱신하고 **그 갱신 자체를 커밋에 포함**한다. 의도치 않았다면 진짜 회귀다. 특수 사례: 릴리스 사이에 Core 문서 표면을 바꾼 커밋은 `check:type-surface`·`check:release-pins`를 함께 깨뜨린다(robotics 스냅샷 핀과 어긋남 — §2.1). 이 빨간불의 정식 해소는 다음 짝 릴리스이고, 그때까지 main이 빨갛게 남으므로 그런 커밋은 짝 릴리스에 붙여서 낸다 |
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

**재시험 (2026-08-16, 메운 문서로 2회차)** — 문맥 없는 새 독자 둘로 반복했다.

- 신입 시험: 완주, 질문 3건(전 회차 9건). 문서가 지목한 소스 2개 외에는
  탐색 0. 남은 3건은 motion README 한 파일 수준이라 즉시 메웠다.
- 인계자 시험: **절차 재구성 완주** — 전 회차를 1단계에서 멈춰 세운
  "robotics가 어디 있나"가 메워졌음이 확인됐다. 질문 9건이 나와 §1·§2.1·
  §2.3·§2.4·§4.1에 반영했다(선행조건 블록, NODE_AUTH_TOKEN 취득법,
  핀 값 예시, 버전 범프 위치, 문서 표면 함정, 절 번호 결함).
  이 시험은 실고장도 하나 잡았다 — 릴리스 사이의 Core 문서 표면 변경이
  main을 빨갛게 만드는 §2.1의 함정이 시험 당일 실제로 재현 중이었다.

"질문 0으로 완주"는 아직 미달성이다. 다음 재시험은 이번 반영분으로 돌린다.

**아직 확인되지 않은 것**: 다른 사람의 실제 PC(다른 OS·Node)에서의 동작.
이것만은 문서로 메울 수 없다.
