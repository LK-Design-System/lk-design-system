# TODO — 세션 작업 큐

> 이 목록은 채팅 세션의 내부 todo 트래커에 기록돼 있었습니다(파일이 아니라 대화 상태).
> 파일로도 볼 수 있게 여기 옮겨둡니다 — 이후 세션에서 이 파일 기준으로 진행·갱신합니다.

## 대기 중 (우선순위 순)

1. **#32 TopBar 서브메뉴·모션 렌더 확인** — 방금 구현한 네비 호버 모션(200ms 잉크+밑줄 scaleX)과 '제품' 호버 드롭다운(순찰/방역/관제, 페이드+리프트, focus-within, reduced-motion)이 라이트·다크 데모에서 잘 뜨는지, viewport 240px에서 메뉴가 잘리지 않는지 확인.
2. **#28 IconButton `bare` variant 정식 추가** — ghost(흰 배경+헤어라인 박스)가 TopBar에 부적절해 데모는 style override로 임시 처리함. `bare`(배경·보더 없음, 뮤트→호버 잉크)를 컴포넌트에 추가하고 `.d.ts`·`prompt.md`·버튼 카드 동기화, 데모 override를 `variant="bare"`로 교체. `TopBar.d.ts`에 `navAlign?: 'start'|'center'`도 추가.
3. **#21 인라인 록업 중앙 정렬 재확인** — v4(scale 3.90323, tx 969.35, ty -2590.76, vbW 1609.93 — 실측 bbox 기반)가 적용된 상태. 사용자 뷰에서 두 패스의 getBoundingClientRect로 centerY 오차 0 확인, 어긋나면 ty 보정. (실측치: LK bbox 1550/2020/1920/1790, ROBO 820/1181.3/3380/458.6)
5. **#17 원본 로고 에셋 재생성 여부** — `assets/brand/lk-logo-inline-*.svg` 2장을 새 동일 높이 조합(v4 지오메트리)으로 재생성할지 사용자 확인 후 진행.
6. **#6 Figma 파일 전체 임포트 (대형)** — 마운트된 `Figma CCD1jAobDjvlaZsTThZIJE.fig`: `/METADATA.md`·`/README.md` 읽기 → 모든 컴포넌트 패밀리·토큰(전 테마)·타이포그래피를 배치로 materialize → `styles.css`에 @import 추가 → "built M of N" 커버리지 보고. (킷 패밀리 `Group N`/`Saly-N`은 일러스트/잔여 레이어 — 가치 판단 후 선별.)

## 상시 참고

- **"147 components named after nothing in the kit" 체크 플래그** — `readme.md` "의도된 추가" 섹션과 `COVERAGE.md`가 확인 문서. 억제 메커니즘이 없어 매 체크마다 재표시되는 것이 정상이며 조치 불필요.
- 로고 방침: **LK ROBOTICS는 항상 한 로고** — LK와 ROBOTICS를 분리 취급하지 말 것. 인라인 록업은 두 워드 높이 동일 + 세로 중앙 정렬.

## 완료

- **#24 Templates 그룹 제거 확인** (2026-07-05) — `check_design_system`: Templates (none) ✓ · 카드 `group="4 템플릿 · 시작 폴더"` ✓ · readme 표에 중앙 카드 레이아웃+소셜 로그인 반영 ✓. 147-컴포넌트 플래그는 상시 참고대로 재표시만 됨(조치 불필요).
