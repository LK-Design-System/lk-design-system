# LDS 시스템 구분 개편 계획 (파괴적 변경 포함)

| Field | Value |
| --- | --- |
| Type | Architecture reform proposal |
| Status | **Phase 0–3 완료 (2026-08-15 ~ 08-16).** R1 compat 일몰(rc.69.17) · R2 소비 산출물 계약 · R3 위성 재편(editorial 흡수, 위성 6→4) · R4 수명주기 계약 확정. 잔여는 2027-01 정기 심사(R3-3 slides-ui 존속, R4-3 첫 아카이브 심사, R4-4 core 잔류 조건 데이터화 필요성 재평가 — 현 규모(소비 제품 4·단일 유지보수자)에서는 순찰 누락이 발생하지 않아 이연). 실행 기록은 부록 A–F. |
| Owner | Design system owner · Frontend platform |
| Last reviewed | 2026-08-15 |
| 근거 소비자 | [`lk-design-system-motion`](https://github.com/LK-Design-System/lk-design-system-motion) — 2026-08-15 신규 위성이 LDS를 외부 런타임(헤드리스 영상 렌더러)에서 소비하며 수집한 실측 증거 |

이 문서는 LDS의 **세부 구분 체계** — 워크스페이스 패키지 분할, 위성 저장소
분할 축, 그리고 그 수명주기 — 의 구조 개편을 제안한다. 실행 순서의 상위
문서는 [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md)이며,
이 문서의 R1(compat 일몰)은 그 문서의 Wave 5(compatibility retirement)를
구체화한 실행안이다. 계층 의존 정책([`OPERATING_MODEL.md`](OPERATING_MODEL.md))과
컴포넌트 분류([`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md))는 이 문서가
바꾸지 않는다.

---

## 1. 진단 — 무엇이 실측으로 확인됐나

### 1.1 이식 시험: 가로 분할은 통과했다

2026-08-15, lds-motion이 LDS를 원래 설계 대상이 아닌 런타임(Playwright
헤드리스 크롬 + 프레임 스테핑 영상 렌더러)에 이식했다. 결과:

- core → theme → slides 순서로 CSS를 로드하는 것만으로 **스타일 오버라이드
  0개**로 브랜드가 재현됐다. 시맨틱 토큰 참조만으로 충분했다.
- 번들된 Pretendard @font-face가 Linux·Windows CI 러너에서 동일하게 로드됐다.
- lds-slides-ui의 레이아웃 16종은 애니메이션·전이가 0이라, 정적 레이아웃
  위에 시간 축을 외부에서 얹는 구성이 마찰 없이 성립했다.

**결론: atomic → semantic → component 레이어링과 출처 분류(WDS Core / LK
Theme Override / LK Product Extension / LK Robotics Extension)는 이 시스템의
검증된 자산이다. 이 문서는 이를 바꾸지 않는다.**

### 1.2 소비 함정: 배포 가장자리는 통과하지 못했다

같은 이식에서 소비자가 우회 코드를 작성해야 했던 지점 4개. 전부
"자체 Storybook에서는 재현되지 않고 외부 소비자에게만 드러나는" 종류다.

| # | 함정 | 소비자가 한 우회 |
| --- | --- | --- |
| T1 | 패키지가 트랜스파일 없는 raw `.jsx` 소스로 배포됨 | 웹팩 esbuild-loader 룰 / Vite optimizeDeps 수동 구성 |
| T2 | `.d.ts` 부재 | 소비자가 앰비언트 타입 선언을 손으로 작성 |
| T3 | `npm pack`이 `vendor/*.tgz`를 무조건 제외 → 패키지 내부 `file:` 참조가 소비자 설치에서 깨짐 | 소비자 package.json에 `overrides`로 자기 vendor 경로 재지정 |
| T4 | SlideSurface가 ResizeObserver + layout effect로 자체 스케일 → 헤드리스에서 비결정(실측: effect가 돌면 이중 스케일 2.25×, 안 돌면 미적용) | `style.transform='none'` 주입으로 무력화하고 스케일을 외부에서 재계산 |

`check:consumer`(소비자 스모크)는 이 4개를 하나도 잡지 못했다. 현재 소비자
검증은 "우리가 아는 소비 형태"만 본다.

### 1.3 위성 현황: 만드는 레시피는 있고, 유지·폐기 레시피가 없다

2026-08-15 기준 (`lds_ws` 체크아웃 + GitHub):

| 위성 | 버전 | 상태 | 코어 핀 |
| --- | --- | --- | --- |
| lds-robotics-ui | rc.15 | 성숙 — LDS rc.69.15와 짝 릴리스, 제품 소비 존재 | 정렬됨 |
| lds-editorial-ui | alpha.3 | slides-ui의 의존성으로만 확인됨 | rc.4 |
| lds-slides-ui | alpha.1 | 레이아웃 16종 완비, 독립 제품 소비 미확인 | **rc.4 (릴리스 라인은 rc.69.14 — 65+ rc 뒤)** |
| lds-3d | alpha.1 | 별도 저장소 유지 결정은 분리 계획에 기록됨 | — |
| lk-design-system-infographics | — | **빈 스텁** (package.json·origin 없음) | — |
| lds-motion | alpha.2 | 신설. slides-ui 소비, CI(콜드 클론 2-OS) 보유 | rc.4 (slides-ui 핀 추종) |

관찰:

- 위성 6개 중 성숙 1개. 셋은 alpha에서 정지, 하나는 시작조차 안 됐다.
- slides-ui의 rc.4 핀은 65개 rc 뒤다. 이번 이식에서 주요 시맨틱 토큰 값이
  우연히 릴리스 라인과 일치해 사고가 없었지만, 이는 정책이 아니라 운이다.
- 위성 분할 축이 **내용 도메인**(editorial, slides, infographics, 3d)이라
  이론상 무한히 늘어나며, 하나마다 릴리스 트레인·vendor 핀·Storybook·CI가
  통째로 따라온다. 유지비는 선형으로 늘고 관리 주체는 늘지 않았다 — 위
  표가 그 결과다.
- 반례: lds-motion은 도메인이 아니라 **능력**(시간·모션) 축이다. 어떤
  도메인 위성 위에도 직교로 얹히고, 소유 경계 질문("모션은 누구 소유인가")에
  즉답이 나온다.

### 1.4 compat: 갚다 만 빚

`packages/compat`의 `tokens/*.css`는 `packages/theme/tokens/*.css`와 파일
단위로 중복이다(동일 크기 확인: color-semantic 23.2KB, effects 8.5KB 등).
같은 토큰에 진입로가 두 개 존재하며, Wave 5(facade 종료)는 "open" 상태로
기한이 없다. 마이그레이션 편의 장치는 기한이 없으면 영구 구조물이 된다.

### 1.5 core/product 경계: 기계가 아니라 사람이 지킨다

레이어 경계(토큰 방향)는 `check:layers`가 기계로 막는다. 반면 core↔product
경계는 COMPONENT_WORKFLOW의 제품 3종 게이트 등 **사람의 판단과 순찰**로
유지된다. 경계 자체가 데이터로 정의돼 있지 않아서다. 순찰 비용은 컴포넌트
수에 비례해 늘어난다.

---

## 2. 유지하는 것 (명시적 비변경)

1. atomic → semantic → component 토큰 레이어링과 `check:layers` 계열 가드.
2. 출처 분류 4종과 WDS 증거 규율.
3. 워크스페이스(core/theme/product) 락스텝 버전 정책.
4. lds-robotics-ui — 성숙 위성이며 짝 릴리스 관행이 이미 작동한다.
   도메인 축임에도 유지하는 이유는 §4.3의 "도메인 팩 존속 조건"을 이미
   충족하기 때문이다.
5. lk-design-system-3d의 독립 저장소 지위(분리 계획의 기존 결정).

---

## 3. 개편안 R1–R4

### R1. compat 일몰 — 기한을 박는다 (Wave 5 실행안)

**목표 상태: `@lk-design-system/design-system-core`(compat facade)와
`packages/compat` 삭제. 토큰 진입로는 theme 하나.**

| 단계 | 내용 | 게이트 |
| --- | --- | --- |
| R1-1 | facade 소비 전수 스캔: 제품 3종 + 위성 전체에서 `design-system-core` import를 grep, 결과를 이 문서에 부록으로 커밋 | 소비 0이면 R1-3으로 직행 |
| R1-2 | 남은 소비처를 lds-core/theme 직접 참조로 이관 (제품별 PR) | 제품 CI 통과 |
| R1-3 | `packages/compat` 삭제, `generate-compat-facade.mjs`와 관련 check 제거, CHANGELOG에 breaking 명시 | `check:fast` 통과 |
| R1-4 | 다음 rc에서 퍼블리시 중단 | — |

**기한: R1-1·R1-2는 2026-09 정기 릴리스까지, R1-3·R1-4는 2026-10 릴리스까지.**
기한을 넘기면 그 사유를 이 문서 Status에 기록한다 — "조용한 연장"을 금지한다.

### R2. 소비 가능 산출물 계약 — 함정 4개를 계약과 가드로 전환

**목표 상태: "LDS 패키지를 설치하면 로더 설정·타입 선언·overrides 없이
동작한다"가 CI가 지키는 계약이 된다.**

| 항목 | 계약 | 근거 함정 |
| --- | --- | --- |
| R2-1 | 모든 퍼블리시 패키지는 트랜스파일된 `dist/`(ESM)와 `exports` 맵을 출하한다. raw `.jsx`를 main으로 노출하지 않는다 | T1 |
| R2-2 | 모든 퍼블리시 패키지는 `.d.ts`를 출하한다. JSDoc→tsc 생성으로 시작해도 된다. lds-motion이 작성한 slides-ui 앰비언트 선언을 시드로 이관한다 | T2 |
| R2-3 | 퍼블리시 패키지의 dependencies에 `file:` 참조 금지. 위성 간 의존은 퍼블리시된 버전 범위로 선언하고, 오프라인 설치가 필요한 소비자가 자기 쪽에서 vendor+overrides를 택한다 | T3 |
| R2-4 | 런타임 측정(ResizeObserver, layout effect 측정)으로 시각 결과가 달라지는 컴포넌트는 opt-out prop을 계약에 포함한다. 우선 대상: SlideSurface `scale` prop (`'auto' \| 'none'`) | T4 |
| R2-5 | **소비자 검증의 미검증 축을 닫는다.** → Phase 1에서 `check:consumer-toolchain`으로 구현 완료. 범위는 §4.1의 실측에 따라 좁혔다 | T1–T3 재발 방지 |

R2-5가 이 개편의 핵심 가드다. 1.2의 함정들은 전부 "우리 환경에서만 검증"이
원인이므로, 검증 환경 자체를 소비자 환경으로 바꾼다.

### R3. 위성 재편 — 분할 축을 도메인에서 능력으로

**목표 상태: 위성은 "능력 레이어"가 기본이고, "도메인 팩"은 소비 제품이
실재할 때만 존속한다.**

| 단계 | 내용 |
| --- | --- |
| R3-1 | **infographics 아카이브.** 빈 스텁. GitHub archive 처리, lds_ws 체크아웃 제거 |
| R3-2 | **editorial-ui를 slides-ui에 흡수.** 확인된 소비자가 slides-ui 하나뿐이다. 흡수 전 R3-2a로 독립 소비자 부재를 확정한다(제품 3종 + Portal grep). 독립 소비자가 나오면 흡수를 중단하고 존속 조건(R3-4)을 적용한다 |
| R3-3 | 남는 위성을 재분류: **능력 레이어** = lds-motion(시간), lds-3d(3D 렌더링) / **도메인 팩** = lds-robotics-ui(소비 제품 존재), lds-slides-ui(editorial 흡수 후; 소비자는 현재 lds-motion 하나 — 존속 조건을 2027-01 재심사) |
| R3-4 | **신설 규칙:** 새 도메인 팩은 shipping 제품의 소비 핀 증거 없이 만들 수 없다. 새 능력 레이어는 기존 위성 2개 이상에 적용 가능함을 제안 문서에서 보여야 한다 |

### R4. 위성 수명주기 계약 — 만들기·유지하기·죽이기를 전부 정의

**목표 상태: 위성의 상태 전이가 문서화된 조건으로만 일어난다.**

| 계약 | 내용 |
| --- | --- |
| R4-1 승격 (alpha→rc) | 조건 3개 전부: ① 소비자(제품 또는 다른 위성) 1개 이상 ② 콜드 클론 CI 존재 ③ 코어 핀이 현행 릴리스 라인 기준 2 rc 이내 |
| R4-2 핀 정렬 캐덴스 | LDS rc 릴리스 레시피에 "활성 위성 핀 범프 또는 스킵 사유 기록" 단계를 추가한다. 스킵은 가능하되 침묵은 불가. 분기마다 전 위성 핀 리포트를 `docs/references/`에 갱신. **추가(rc.69.15 실측): 릴리스 파생값 재계산 스크립트(`update:release-pins` 가칭)를 만든다.** 지금은 버전 하나를 올릴 때 32곳을 손으로 고쳐야 하고 그중 다수가 sha256이라, 자동 계산이 가능한데도 사람이 옮겨 적고 있다. 대상: 워크스페이스 상호 참조, `ROBOTICS_EXTERNAL_SURFACE.json` 파생값, `CROSS_REPOSITORY_STYLE_CONTRACT.json` 위성 버전, `vendor/README.md` |
| R4-3 아카이브 | 릴리스 사이클 2회(약 2분기) 연속으로 소비자 0 && 커밋 0이면 아카이브를 기본값으로 심사한다. infographics가 첫 적용 사례 |
| R4-4 core 잔류 조건의 데이터화 | `COVERAGE_AUDIT.json`을 근거로 "core 컴포넌트는 소비 제품 2개 이상, 미달이면 product행"을 기계 검사로 제안한다. 기존 사람 순찰(COMPONENT_WORKFLOW 게이트)을 대체하지 않고, 순찰 대상을 미달 컴포넌트로 좁히는 필터로 도입한다 |

---

## 4. 실행 순서와 게이트

의존성이 얇은 것부터. 각 단계는 독립 커밋·독립 롤백.

```text
Phase 0 ✅ 완료 (2026-08-15)  R1-1 소비 스캔 · R3-2a editorial 소비자 확인 → 부록 A
Phase 1 ✅ 완료 (2026-08-15)  R1-2 대상 없음 · R3-1 아카이브 대상 없음(전제 오류)
                              R2-5 → check:consumer-toolchain 신설·CI 배선 → 부록 B
Phase 2 (2026-10 릴리스까지)  R1-3·R1-4 compat 삭제 (파괴 지점 ①)
                              ※ 선행: check:consumer-smoke·workspace-consumer-matrix의
                                 compat 참조 제거 (부록 B.4)
                              R2-1·R2-2 dist·d.ts 출하 (파괴 지점 ②: deep import 경로 변경 가능)
Phase 3 ✅ 완료 (2026-08-16)  R3-2 editorial 흡수 → 부록 D
                              R2-3 file: 금지 · R2-4 SlideSurface scale prop → 부록 E
                              R4 수명주기 계약 확정 → 부록 F
2027-01                       R3-3 slides-ui 존속 재심사 · R4-3 첫 정기 심사
```

Phase 3은 계획한 2026-Q4보다 앞당겨 2026-08-16에 완료했다.

파괴 지점 3개의 롤백:

- ① compat 삭제 — 직전 rc tgz가 vendor·registry에 남는다. 복구는 revert 커밋.
- ② dist 출하 — `exports`에 기존 소스 경로를 한 릴리스 동안 병행 노출하고
  deprecation 로그를 남긴 뒤 제거한다.
- ③ editorial 흡수 — 흡수 커밋 전 마지막 alpha tgz를 slides-ui vendor에
  보존한다. 저장소는 삭제가 아니라 archive.

## 5. 리스크

| 리스크 | 완화 |
| --- | --- |
| R2-1 트랜스파일 도입이 위성 빌드(현재 빌드 스텝 없음)에 새 도구 부담 | 워크스페이스의 기존 tsup 설정을 위성에 복제하는 표준 레시피를 R2-1 산출물에 포함 |
| R1 기한 내 제품 이관 리소스 부족 | R1-1 스캔 결과가 소비 0이면 비용이 사실상 0. 스캔부터 하고 판단 |
| R3-2 editorial 숨은 소비자 | R3-2a 게이트가 선행. 발견 시 흡수 중단이 기본값 |
| R4-4가 사람 판단을 기계로 오대체 | 필터로만 도입(순찰 범위 축소), 최종 분류는 기존 워크플로 유지 |

## 6. 이 문서가 바꾸지 않는 것

§2와 동일. 추가로: Storybook 정보 구조, 컴포넌트 API, 토큰 이름·값,
릴리스 절차의 나머지 부분, `lds_ws` 작업 방식.

---

## 부록 A. Phase 0 스캔 결과 (2026-08-15 실행)

### A.1 R1-1 — compat facade(`design-system-core`) 소비 스캔

로컬 체크아웃의 소스(`node_modules`·빌드 산출물 제외)에서
`design-system-core` 문자열 검색:

| 대상 | 결과 |
| --- | --- |
| lk_portal/src | 0건 |
| lk_vision (+jetson/nxp/pi) | 0건 |
| lk_deviceops | 0건 |
| lk_mlops | 0건 |

**판정: R1-1 게이트 통과 — 소비 0이므로 R1-2(이관)는 불필요하고 R1-3
(삭제)으로 직행 가능하다.** 단, 로컬에 없는 소비자(사내 다른 저장소·배포
파이프라인)가 있으면 릴리스 전 동일 스캔을 반복한다.

### A.2 R3-2a — editorial-ui 독립 소비자 스캔

`lds-editorial-ui` 문자열 검색 (slides-ui 자신 제외):

| 대상 | 결과 |
| --- | --- |
| lk_portal | 0건 |
| lk-design-system-robotics | 0건 |
| lk-design-system-3d | 0건 |
| lk-design-system (workspace packages) | 0건 |

**판정: R3-2a 게이트 통과 — 확인된 소비자는 slides-ui 하나뿐이므로 흡수
진행 가능하다.**

---

## 부록 B. Phase 1 실행 기록 (2026-08-15)

### B.1 R1-2 (facade 이관) — 대상 없음

부록 A.1에서 소비 0으로 확인됐으므로 이관할 코드가 없다. R1은 Phase 2의
R1-3(삭제)에서 재개한다.

### B.2 R3-1 infographics — 계획의 전제가 틀렸다

계획은 이를 "GitHub 위성 저장소 아카이브 + 로컬 체크아웃 제거"로 적었으나,
실제 상태는 다르다:

| 확인 항목 | 실제 |
| --- | --- |
| GitHub 저장소 | **존재하지 않음** (`gh repo view` → Could not resolve to a Repository) |
| 로컬 remote | 없음 |
| 커밋 수 | 0 |
| 내용물 | 빈 `.claude/` 디렉터리 하나, 총 0KB |

즉 위성으로 **생성된 적이 없다.** 아카이브할 대상이 없으므로 R3-1의
GitHub 조치는 무효(no-op)이고, 위성 목록에서 제외하는 것으로 종결한다.
§1.3 표의 "빈 스텁" 기술은 유효하나 "위성"으로 세지 않는다 — 활성 위성은
5개(robotics, editorial, slides, 3d, motion)다.

`lds_ws/lk-design-system-infographics` 로컬 디렉터리는 이 저장소의 소유가
아니고 사용자가 만든 작업 공간이므로 이 작업에서 삭제하지 않았다. 정리는
소유자 판단에 맡긴다.

### B.3 R2-5 — 범위를 실측에 맞춰 좁혔다

계획 초안은 "빈 프로젝트에서 tgz만으로 설치 → Vite·webpack 빌드 → tsc"를
전부 신설하는 것으로 적었다. 구현 전 기존 가드를 조사한 결과, 런타임 축은
이미 `check:workspace-consumer`(check-workspace-consumer-matrix.mjs)가
소유하고 있었다:

- sha256으로 봉인된 tarball 세트에서 설치
- React 18 / React 19 두 fixture
- ESM · CJS · SSR(renderToStaticMarkup) · Vite 빌드 · Playwright 브라우저
- core/theme/product/compat/robotics 전부

초안대로 만들었다면 상당 부분이 중복 구축이었다. 실제 공백은 두 축이었다
(해당 스크립트 내 언급 0건으로 확인):

| 공백 | 왜 신호가 되는가 |
| --- | --- |
| **TypeScript 해석** | 우리 `.d.ts`는 `export {X} from './X.jsx'`로 재수출한다. TS 확장자 매핑에 의존하므로 소비자 `moduleResolution` 설정에 따라 갈린다. 타입이 안 잡히면 소비자가 앰비언트 선언을 손으로 쓰게 된다(T2의 실제 경로) |
| **제2 번들러 계열** | 매트릭스는 Vite·esbuild(동일 계열)만 쓴다. webpack은 확장자·조건부 exports 해석 관습이 달라 독립 신호다 |

그래서 **`check:consumer-toolchain`** (scripts/check-consumer-toolchain.mjs)로
이름과 범위를 좁혀 신설했다. 하는 일:

1. 정적 계약 — 퍼블리시 패키지의 `file:` 의존 금지(T3 구조적 차단), 타입
   진입점 선언, dist 존재
2. 저장소 **밖**(`os.tmpdir()`)에 소비자 프로젝트 생성 — 저장소 안에 두면
   Node가 상위 워크스페이스 `node_modules`를 주워 검증이 무효가 된다
3. tarball + 레지스트리만으로 캐시 격리 설치, 타입 진입점이 tarball에
   실제로 담겼는지 확인
4. **축 1** `tsc --noEmit` (`skipLibCheck: false`, `strict`,
   `moduleResolution: bundler`) — 켜면 우리 `.d.ts` 결함이 숨으므로 끈다
5. **축 2** webpack 프로덕션 빌드

**결과: core/theme/product 전부 통과 (로컬 실행 61초).** 타입 해석과 webpack
번들(317KB) 모두 우회 코드 없이 성공했다 — 워크스페이스 패키지는 이미 R2-1
(dist 출하)·R2-2(.d.ts 출하) 요건을 충족하고 있음이 확인됐다. 함정 T1·T2는
**위성 패키지에 한정된 문제**이며, Phase 3에서 위성으로 확장할 때 이
스크립트를 재사용한다.

CI 배선: `ci.yml`의 `design-system` 잡에 `check:workspace-consumer:windows`
바로 다음 스텝으로 추가했다. `check:fast`에 넣지 않은 이유는 네트워크 설치가
필요한 무거운 검사이고, 기존의 무거운 소비자 검증(`check:workspace-consumer`)도
동일하게 CI 잡 스텝으로만 배선돼 있기 때문이다.

### B.4 CI 검증 상태 — 새 가드는 아직 CI에서 실행되지 못한다

`main`의 CI는 이 작업 **이전부터** 연속 실패 상태다. 확인 결과 최근 14회
런이 모두 failure이고, 여기에는 릴리스 태그가 붙은 커밋들
(rc.69.7~rc.69.14)도 포함된다. 태그 커밋의 실패 원인은
`check:storybook-public` — "Public Storybook copy exposes internal
maintenance information"이며 이 작업과 무관하다.

추가로, 태그 이후의 모든 커밋은 구조적으로 `check:release-immutability`에
걸린다. 이 가드는 `lds-v<version>` 태그가 존재하는데 HEAD가 그 커밋이 아니면
실패하므로, 다음 버전 범프 전까지 릴리스 사이의 모든 커밋이 빨간불이다.
이 문서의 두 커밋도 같은 이유로 이 항목에 걸린다.

결과적으로 `check:consumer-toolchain` 스텝은 같은 잡에서 `check:ci`가 먼저
실패해 **아직 CI에서 한 번도 실행되지 않았다.** 스텝 순서를 앞당겨
우회하지 않았다 — 이 검사는 `dist`를 요구하고 그 빌드는 `check:fast` 안에서
일어나므로, 순서는 의존성상 옳다.

CI에서 신호를 받지 못하는 동안의 대체 검증:

| 축 | 확인 |
| --- | --- |
| 기능 | 로컬 Windows에서 전 단계 통과 (61초). CI 잡도 windows-latest다 |
| npm 버전 차이 | CI는 npm 10.9.2, 로컬은 11.16.0. 위험 지점인 `npm pack --json`을 `npx npm@10.9.2`로 직접 확인 — stdout이 순수 JSON이라 `JSON.parse(stdout)`가 그대로 동작한다. 나머지 플래그(`--ignore-scripts`, `--pack-destination`, `--no-audit`, `--no-fund`, `--cache`)는 npm 10 지원 범위다 |
| Node 버전 차이 | CI는 22.17.1, 로컬은 24.18.0. 스크립트는 `mkdtempSync`/`execFileSync`/`execSync`만 쓰며 22에서 전부 안정 API다 |

**해소됨(2026-08-15, rc.69.15).** `check:storybook-public` 실패는 Wizard
접근성 가이드가 내부 문서 경로를 공개 문구로 노출한 것이었고,
`publicGuideText()`의 기존 치환 관례를 따라 공개 경계에서 걸러 해결했다.
이어서 rc.69.15 릴리스로 `check:release-immutability`까지 해소돼
**CI가 초록으로 전환됐다**(`69e6035e`). 최근 14회 연속 실패 이후 첫 성공이다.

`check:consumer-toolchain`은 이 런에서 **CI에서 처음 실행되어 통과**했다
(Design system checks 잡, 약 86초: 콜드 설치 67초 + tsc 5초 + webpack 7초).
B.4에 기록했던 대체 검증은 이제 실측으로 대체됐다.

같은 릴리스에서 위성 짝맞춤의 실제 비용이 드러났다 — 버전 하나를 올리는 데
손으로 유지되는 기록 32곳을 갱신해야 했고(package.json 5, 워크스페이스
상호 참조 6, 스타일 계약 4, robotics tarball·참조 3, 외부 표면 파생값 10,
vendor README 3, CHANGELOG 1), 자동 생성 스크립트는 없다. 이는 R4-2(핀 정렬
캐덴스)에 **릴리스 파생값 재계산 스크립트**를 후속 항목으로 추가할 근거다.

---

## 부록 C. Phase 2 실행 기록 (2026-08-16) — R1-3 compat 삭제

부록 A.1의 소비 0 판정을 삭제 직전에 재확인하고(제품 9곳 전부 0건) 진행했다.

**접근 전환.** 처음에는 compat 참조를 파일마다 찾아 고치려 했으나, 조사 결과
21개 파일에 남아 있었고 그중 다수가 **과거 상태를 서술하는 기록**(Wave 0 증거
조립·검증, 레거시 소비자 스캐너, 마이그레이션 감사)이었다. 그런 파일을 고치면
기록이 틀려진다. 그래서 **패키지를 먼저 삭제하고 실제로 깨지는 것만 고치는**
방식으로 바꿨다. 결과적으로 손대야 했던 것은 아래 뿐이고, 역사 기록 계열은
하나도 건드리지 않았다.

| 대상 | 처리 |
| --- | --- |
| `packages/compat` (2,689 파일) · `scripts/generate-compat-facade.mjs` | 삭제 |
| `tsup.workspace.config.ts` | ESM/CJS 이중 빌드, 조건부 splitting·clean, 번들 예외 로직 제거 — 설정이 절반으로 줄었다 |
| 빌드·프로젝션 4종 | compat 대상 제거 (`build-workspace-packages`, `copy-workspace-types`, `project-workspace-styles-and-assets`, `project-package-docs`) |
| 검사 6종 | compat 서술자·분기·전용 함수 제거 (`check-workspace-packages`의 `validateFacade`/`validateCompatExports` 59줄 포함) |
| 소비 검증 4종 | facade 경유 import를 owner 패키지로 재작성 (`check-consumer-smoke`, `check-workspace-consumer-matrix`, WDS 렌더 스타일 2종) |
| 타입 계약 | React 18/19 소비자 계약에서 facade 전용 케이스 제거; deep import 검증은 `lds-core/components/...`로 유지 |

**설계 판단 3건**

1. **CJS 검증 제거.** CommonJS는 facade만의 산출물이었다. 워크스페이스가 ESM
   전용이 되었으므로 소비자 매트릭스의 `cjs` 항목을 지웠다 — 하지 않은 검증을
   `passed`로 보고하지 않기 위해서다. 대신 ESM 경로에 SSR과 deep-import 동일성
   검증을 옮겨 커버리지를 유지했다.
2. **robotics 버전 대조의 근거 이동.** facade가 워크스페이스에서 유일하게
   robotics를 의존 선언했기 때문에 그 범위가 대조 기준이었다. 이제
   `ROBOTICS_EXTERNAL_SURFACE.json`(저장소 측)과 잠긴 package set(설치 측)이
   기준이다.
3. **정적 경로 스모크의 기준 패키지.** facade가 모든 리소스를 담았기에 기준이
   었으나, Core가 같은 세 종류(styles/tokens/assets)를 담으므로 Core로 옮겼다.

**되돌린 것 1건.** `scripts/check-package-artifact.mjs`와 세 개의
`*:pack:baseline` 스크립트는 aggregate 패키지 전용이라 함께 지웠으나,
`check:package-migration`이 **Wave 0 증거 체인으로 이 파일과 세 스크립트 문자열의
존재를 검증**하고 있었다. 역사 증거 모델을 손대는 것은 R1-3 범위 밖이라 복원했다.
지금은 대상이 없어 동작할 수 없는 죽은 코드이며, 정리하려면 Wave 0 증거 모델
변경을 별도로 결정해야 한다.

**검증**: `check:fast`가 `check:release-immutability`(태그 이후 커밋의 구조적
실패)까지 도달, `check:pack`·`check:consumer`·`check:type-consumer`·
`check:package-migration` 통과. `check:workspace-consumer`는 Node 22.17.1을
강제해 로컬에서 실행되지 않으므로 CI가 검증한다.

**R1-4 완료 (rc.69.17, 2026-08-16).** 퍼블리시 중단의 실체는
`release-packages.yml`의 `npm publish ./packages/compat` 한 줄이었고, 이는 코드
검사가 읽지 않는 자리에 있었다. 함께 발견된 잔재:

| 위치 | 내용 | 어떻게 드러났나 |
| --- | --- | --- |
| `.storybook/main.js` | `staticDirs`가 `packages/compat/docs` 참조 | CI의 `build:storybook` 실패 (`check:fast`는 Storybook을 빌드하지 않는다) |
| `.github/workflows/ci.yml` | 아티팩트 업로드 경로 6줄 | 위 추적 중 발견 |
| `.github/workflows/release-packages.yml` | `npm publish ./packages/compat` | 위 추적 중 발견 |
| `scripts/check-release-package-availability.mjs` | robotics 레지스트리 선행 조건 | 릴리스 워크플로 실패 조사 중 발견 |

마지막 항목이 특히 시사적이다. 그 게이트는 **compat이 robotics를 런타임
의존으로 선언했기 때문에** 존재했다 — robotics 없이 facade를 퍼블리시하면
설치 불가능한 패키지가 되므로. compat이 사라진 지금 퍼블리시 대상
(core/theme/product) 중 robotics를 의존하는 것은 없고, 게이트의 존재 이유가
함께 사라졌다. 게다가 그 조건은 애초에 **충족 불가능**했다: Robotics 저장소에는
퍼블리시 워크플로가 없고 vendored tarball로만 배포되므로, 레지스트리 조회는
403으로 실패했고 **태그가 찍힌 모든 릴리스 실행이 이 지점에서 죽었다**(rc.69.15,
rc.69.16 확인). vendored 아티팩트의 무결성은 `check:publish-policy`와
`check:pack`이 sha256으로 이미 검증하고 있었다 — 실제 배포 방식에 맞는 검사는
따로 있었던 셈이다.

**릴리스 연쇄 비용(측정)**: rc.69.16은 태그 후 Storybook 잔재가 드러나
퍼블리시 없이 폐기됐고, rc.69.17로 대체했다. 태그를 옮기는 대신 버전을 올린
것은 `check:release-immutability`가 명시적으로 그렇게 요구하기 때문이다.
그 결과 **3줄짜리 워크플로 수정에 robotics 릴리스가 한 번 더 필요했다**
(rc.16 → rc.17). 위성이 LDS 버전 문자열을 자기 산출물에 박는 한 이 비용은
릴리스마다 발생한다. R4-2의 재계산 스크립트와 함께, **위성이 LDS 버전을
런타임에 읽도록 계약을 바꾸는 안**도 Phase 3 검토 대상으로 추가한다.

**최종 상태 (rc.69.17)**: CI 전 잡 통과 — Design system checks, Conformance
fixtures (Linux), Linux workspace package consumers. Phase 1의
`check:consumer-toolchain`과 Phase 2에서 25곳을 재작성한
`check:workspace-consumer`가 Windows·Linux 양쪽에서 React 18/19로 실행되어
통과했다.

### B.5 부수 발견 — compat 삭제 시 함께 고쳐야 하는 것

`check:consumer`(check-consumer-smoke.mjs)는 `@lk-design-system/design-system-core`
(compat facade)에서 import한다. `check-workspace-consumer-matrix.mjs`도
`compat`을 기대 패키지 목록에 포함한다. **R1-3(compat 삭제)은 이 두 스크립트의
수정을 반드시 동반한다.** Phase 2 착수 시 첫 단계로 처리한다.

---

## 부록 D. R3-2 실행 기록 (2026-08-16) — editorial-ui 흡수

### D.1 게이트 재확인

부록 A.2의 판정을 파괴 직전에 다시 확인했다. 처음 `lds_ws` 전체를 한 번에
스캔했을 때 **slides-ui의 참조를 놓치는** 결과가 나와 그 결과를 버리고 저장소별로
다시 확인했다. 파괴적 작업 전의 스캔은 결과가 "0건"일 때 특히 도구가 실제로
동작했는지부터 의심해야 한다.

| 대상 | 결과 |
| --- | --- |
| lk_portal | 0건 |
| lk-design-system (workspace) | 0건 |
| lds-robotics-ui · lds-3d | 0건 |
| lds-slides-ui | 컴포넌트 5종 import + 의존 선언 — 유일한 실소비자 |
| lds-motion | overrides·optimizeDeps 참조 — slides-ui 경유 전이 의존에 대한 우회 |

### D.2 흡수 내역 (slides-ui alpha.2)

| 항목 | 수량 |
| --- | --- |
| 컴포넌트 | 8 (`src/components/editorial/`) |
| 스토리 | 16 |
| 토큰 | `tokens/editorial.css` → `styles.css`에 연결 |
| 진입점 export | 8 추가 |

슬라이드 5종(Assessment·Compare·Figure·Roadmap·Stat)의 import를 패키지 경로에서
로컬 상대 경로로 바꿨다.

**의존성 산술이 분할의 근거가 얇았음을 보여준다.** 흡수한 컴포넌트가 필요로 하는
외부 의존은 `lds-core`·`lds-product`·`react`로, slides-ui가 이미 갖고 있던 것과
정확히 같다. 새로 들어온 의존이 없고 매니페스트의 의존 수는 오히려 하나 줄었다.
즉 이 패키지 경계는 의존 격리를 제공하지 않으면서 릴리스·vendor·Storybook·CI
비용만 지고 있었다.

### D.3 깨진 것 하나 — 예상과 다른 곳이었다

`.storybook/preview.jsx`가 editorial 스타일시트를 직접 import하고 있었다.
빌드는 실패를 **`preview.jsx` 자체의 resolve 실패**로 보고해서 처음에는 옮긴
스토리를 의심했으나(스토리의 패키지 참조는 0건), 원인은 그 파일이 import하는
대상이었다. 그 줄을 지우는 것으로 끝났다 — 바로 아래 `import '../styles.css'`가
이미 흡수된 editorial 토큰을 싣기 때문이다.

검증: `check:storybook` 전 단계 통과 — style-ownership, catalogue, Storybook
빌드, story play 63개, slide-overflow, deck-content.

### D.4 하류 효과 — 우회 코드가 사라졌다

lds-motion은 slides-ui의 내부 `file:` 참조를 자기 vendor로 돌리는 `overrides`
항목과 Vite `optimizeDeps` 항목을 editorial 때문에 갖고 있었다. 패키지 경계가
사라지자 **둘 다 불필요해져 제거**했다. 클린 설치 후 타입 통과, DeckDemo 렌더
정상(StatSlide가 흡수된 KeyFigure로 그려지며 강조 카드 유지), 전환 프레임
결정론 유지.

위성을 줄이는 것이 하류 소비자를 단순하게 만든 사례다. R3의 "능력 축" 논거를
지지한다.

### D.5 아카이브

`lk-design-system-editorial`은 README 상단에 이관 안내(마이그레이션 방법·흡수
사유·근거 문서 링크)를 남기고 GitHub archive 처리했다. 롤백 대비로 alpha.3
tarball은 slides-ui `vendor/`에 보존한다.

**위성 현황: 5 → 4** (robotics-ui, slides-ui, 3d, motion). infographics는 애초에
생성되지 않았음이 Phase 1에서 확인됐다.

---

## 부록 E. R2-3 · R2-4 실행 기록 (2026-08-16)

### E.1 R2-4 — SlideSurface `scale` 계약

`scale="none"`을 추가했다(slides-ui alpha.3). 기본값 `'auto'`는 기존처럼
프레임을 측정해 스스로 스케일하고, `'none'`은 **측정 자체를 건너뛴다.**
측정하고 결과를 버리는 것이 아니라 layout effect와 ResizeObserver를 아예
등록하지 않는다 — 헤드리스에서 비결정성이 생길 여지를 없애는 것이 목적이므로
그 편이 맞다. 모든 레이아웃이 이미 `{...rest}`를 표면에 스프레드하므로
`TitleSlide` 등 소비 지점까지 그대로 전달된다.

lds-motion은 `style.transform`을 밖에서 덮어쓰던 우회를 버리고 이 prop을
쓴다(T4 해소).

### E.2 R2-3 — 퍼블리시 표면에서 `file:` 제거

slides-ui의 `lds-core`·`lds-product`를 `dependencies`(file: tarball)에서
**`peerDependencies`(버전 범위)**로 옮기고, 자기 빌드·스토리용으로는
`devDependencies`에 vendored tarball을 유지했다.

먼저 "버전 범위 + 자기 overrides"를 시도했으나 npm이 거부한다 —
`EOVERRIDE: Override ... conflicts with direct dependency`. 직접 의존을
override로 덮을 수 없으므로, 이 경우 peer가 더 깔끔한 선택이 아니라
**설치가 되는 유일한 형태**다.

흡수된 editorial-ui가 이미 이 형태(`dependencies: {}` + peer 선언)였다.
slides-ui만 예외였던 셈이고, 그래서 lds-motion이 `overrides`로 우회해야 했다.
그 `overrides` 블록도 이번에 제거됐다.

검증: `npm pack` 산출물의 매니페스트에서 `dependencies`가 비어 있고 `file:`
참조가 0건임을 확인했다.

### E.3 부수 발견 — push 전환이 한 번도 동작하지 않았다

R2-4 검증 중 프레임 76~120이 **바이트 단위로 동일**한 것을 발견했다. 원인은
lds-motion 엔진의 `layerStyle` 한 줄이다.

중간 장면은 들어오는 전환과 나가는 전환을 **동시에** 갖는다(앞 장면에 밀려
들어와 뒤 장면에 밀려난다). 나가는 전환은 한참 뒤에 시작하므로 그동안
`exit.progress`는 0으로 clamp된다. 그런데 조건 없이
`translateX = -exit.progress * 100`을 대입해 **-0 → 0**이 되면서 바로 위에서
계산한 등장 오프셋을 지웠다. 결과적으로 중간 장면은 항상 제자리에 놓인 채
나타나고 앞 장면만 빠져나갔다 — 그럴듯해 보여서 여러 번의 렌더 검수를
통과했다. 마지막 장면은 exit이 없어 정상이었고, 그 점이 발견을 더 늦췄다.

**결정론 검사로는 잡을 수 없는 종류다. 멈춘 애니메이션은 완벽하게 재현
가능하기 때문이다.** 프레임 간 차이를 보는 검사가 따로 필요하다는 뜻이고,
lds-motion 쪽 후속으로 기록한다.

---

## 부록 F. R4 확정 — 위성 수명주기 계약 (2026-08-16)

§3의 R4 제안을 실행 경험으로 보정해 확정한다. 위성의 상태 전이는 아래
조건으로만 일어난다.

### F.1 현재 위성 (4개)

| 위성 | 축 | 버전 | 소비자 | 상태 |
| --- | --- | --- | --- | --- |
| lds-robotics-ui | 도메인 팩 | rc.17 | LDS 워크스페이스(문서 대조), 제품 | **rc** — LDS와 짝 릴리스 |
| lds-slides-ui | 도메인 팩 | alpha.3 | lds-motion | alpha — 2027-01 존속 재심사 |
| lds-motion | 능력 레이어 | alpha.3 | (없음 — 파일럿 대기) | alpha |
| lds-3d | 능력 레이어 | alpha.1 | (미확인) | alpha |

`lk-design-system-editorial`은 R3-2로 흡수·아카이브, `lk-design-system-infographics`는
생성된 적 없음(Phase 1 확인).

### F.2 신설 (R3-4)

- **도메인 팩**은 출하 제품의 소비 핀 증거 없이 만들지 않는다.
- **능력 레이어**는 기존 위성 2개 이상에 적용 가능함을 제안 문서에서 보인다.
- 어느 쪽도 아니면 기존 위성 안의 디렉터리로 시작한다. 경계는 나중에 그을 수
  있지만, 한 번 그은 경계를 되돌리는 데는 릴리스·아카이브·소비자 갱신이
  전부 따라온다(R3-2가 그 실측이다).

### F.3 승격 alpha → rc (R4-1)

세 조건 전부:

1. 소비자(제품 또는 다른 위성) 1개 이상이 **핀으로** 소비한다.
2. 콜드 클론 CI가 있다 — clone → 캐시 없는 설치 → 빌드/렌더까지.
3. LDS 코어 핀이 현행 릴리스 라인 기준 2 rc 이내.

### F.4 퍼블리시 표면 계약 (R2-3 확정형)

위성이 퍼블리시하는 매니페스트는:

- `dependencies`에 `file:` 참조를 두지 않는다. `npm pack`이 `vendor/*.tgz`를
  무조건 제외하므로 소비자 설치에서 **반드시** 깨진다.
- LDS 레이어(core/theme/product)는 `peerDependencies`로 선언한다. 소비자가
  공급하는 것이 맞고, npm이 직접 의존을 override로 덮는 것을 거부하므로
  실질적으로 유일하게 설치되는 형태이기도 하다.
- 자기 빌드·스토리용 vendored tarball은 `devDependencies`에 둔다.

### F.5 핀 정렬 캐덴스 (R4-2)

- LDS rc 릴리스 레시피에 "활성 위성 핀 범프 또는 스킵 사유 기록"을 포함한다.
  스킵은 가능하되 침묵은 불가.
- **릴리스 파생값 재계산 스크립트를 만든다.** rc.69.15 실측 기준 버전 하나를
  올리는 데 손으로 고친 곳이 32개였고 다수가 sha256이었다.
- **위성이 LDS 버전 문자열을 자기 산출물에 박지 않게 한다.** 현재 robotics는
  `canonicalAdoption.source.ref`에 `lds-v<version>`을 굽고, LDS가 그것을 자기
  버전과 대조한다. 그래서 **LDS 버전을 올릴 때마다 robotics 릴리스가
  강제된다** — 2026-08-16에 3줄짜리 워크플로 수정 때문에 robotics를 두 번
  릴리스했다(rc.16 → rc.17). 런타임 조회 또는 범위 대조로 바꾸는 안을 별도
  제안으로 다룬다.

### F.6 아카이브 (R4-3)

릴리스 사이클 2회(약 2분기) 연속으로 **소비자 0 && 커밋 0**이면 아카이브를
기본값으로 심사한다. 아카이브 시:

1. 흡수·이관 대상이 있으면 먼저 옮기고, 마지막 tarball을 수용 저장소
   `vendor/`에 보존한다(롤백 경로).
2. README 상단에 이관 안내를 남긴다 — 마이그레이션 방법, 사유, 근거 문서 링크.
3. GitHub archive 처리. **삭제하지 않는다.**

### F.7 파괴적 단계의 사전 스캔 규칙

R3-2에서 저장소 전체를 한 번에 훑은 스캔이 **실소비자(slides-ui)의 참조를
놓쳤다.** 0건 결과를 그대로 믿었으면 잘못된 근거로 파괴를 진행했을 것이다.

- 소비자 스캔은 **저장소별로** 돌리고, 알려진 소비자가 결과에 나타나는지로
  도구 자체를 먼저 검증한다.
- "0건"은 청신호가 아니라 **도구가 실제로 동작했는지 확인할 이유**다.
