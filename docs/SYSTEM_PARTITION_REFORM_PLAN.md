# LDS 시스템 구분 개편 계획 (파괴적 변경 포함)

| Field | Value |
| --- | --- |
| Type | Architecture reform proposal |
| Status | Phase 0 완료 · Phase 1 완료(2026-08-15). Phase 2 이후는 승인 전 실행 금지. R1은 기존 분리 계획 Wave 5의 실행안을 겸한다. |
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
| R4-2 핀 정렬 캐덴스 | LDS rc 릴리스 레시피에 "활성 위성 핀 범프 또는 스킵 사유 기록" 단계를 추가한다. 스킵은 가능하되 침묵은 불가. 분기마다 전 위성 핀 리포트를 `docs/references/`에 갱신 |
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
Phase 3 (2026-Q4)             R3-2 editorial 흡수 (파괴 지점 ③) · R2-3 file: 금지
                              R2-4 SlideSurface scale prop · R4 계약 문서화·레시피 반영
2027-01                       R3-3 slides-ui 존속 재심사 · R4-3 첫 정기 심사
```

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

### B.4 부수 발견 — compat 삭제 시 함께 고쳐야 하는 것

`check:consumer`(check-consumer-smoke.mjs)는 `@lk-design-system/design-system-core`
(compat facade)에서 import한다. `check-workspace-consumer-matrix.mjs`도
`compat`을 기대 패키지 목록에 포함한다. **R1-3(compat 삭제)은 이 두 스크립트의
수정을 반드시 동반한다.** Phase 2 착수 시 첫 단계로 처리한다.
