# Prose 표면 제안

| Field | Value |
| --- | --- |
| Type | Adopted implementation record |
| Status | Adopted and implemented — Core `Prose` source·type·prompt·Storybook·generated guide 완료 |
| Owner | Design system owner |
| Last reviewed | 2026-08-22 |
| Source | [`Prose.jsx`](../components/content/Prose.jsx) · [`Prose.prompt.md`](../components/content/Prose.prompt.md) · [`ContentProse.stories.jsx`](../stories/ContentProse.stories.jsx) |
| Current roadmap | 종결 — 새 backlog 없음 |

이 문서의 제안은 채택되어 Core `Prose`로 구현됐다. 아래 문제·경계·API 스케치는 구현 전
결정 기록으로 보존하며, 현재 public 계약은 source, type, prompt와 generated component
guide를 우선한다.

형식화된 글(마크다운 렌더 결과, 문서 본문, 어시스턴트 rich response)에 DS 타이포그래피
계약을 입히는 **Prose** 표면의 착수 전 스코프를 정의한 기록이다.

## 문제

`PRODUCT_FRONTEND_COVERAGE.md`가 고정 커밋 `e5ee99d5062170e26abe63d9105c2b8a024ce710`에서 관찰한 LK Portal은
어시스턴트 대화에 **rich response**(형식화된 마크다운 본문)를 렌더한다. 커버리지 판정은
"user/assistant turn, rich response, source link를 LDS message/feed/composer/source
primitive로 조합할 수 있다"이지만 — 정작 그 **형식화된 본문 한 덩어리에 타이포그래피를 입히는
컨테이너가 DS에 없다**. 그 결과 제품이 heading·list·code block·표·인라인 코드의 시각 처리를
자체적으로 재발명하고 있고, 이는 DS가 막으려는 상황("제품이 자체 스타일을 다시 만들지 않고
조합할 primitive를 제공")에 정확히 해당한다.

현재 DS가 가진 것은 *원자*뿐이다: `Code`(블록 `<pre>` · 인라인 틴트 칩), `Blockquote`(좌측 룰
인용 + 출처). 이들을 묶어 한 흐름으로 조판하는 *컨테이너*가 없다. `ContentEditor`의 "미리보기"
탭은 툴바 토글일 뿐 마크다운을 직접 렌더하지 않는다(리치 텍스트 엔진 미포함).

## 경계 — 엔진과 타이포그래피를 가른다

이 표면의 핵심은 마크다운 처리를 둘로 나누고, 그 경계를 DS가 이미 다른 곳에서 그은 선과 맞추는
것이다.

### DS가 소유하지 않는다 — 마크다운 엔진

- **파싱**(문자열 → AST): remark/marked 같은 라이브러리 관심사. DS를 특정 파서에 묶지 않는다.
- **sanitize**: 신뢰할 수 없는 마크다운(LLM 응답·사용자 입력)의 정화는 **보안 = transport/앱
  책임**이다. `COMPONENT_WORKFLOW.md`가 "transport logic, backend policy를 컴포넌트로
  복제하지 않는다"고 명시한 영역이며, `ContentEditor`가 리치 텍스트 엔진을 제품에 위임한 것과
  같은 이유다.
- **구문 하이라이팅 엔진**: 토큰화는 라이브러리·언어 문법의 문제다. DS는 하이라이팅된 결과의
  *색 토큰*만 소유할 수 있고 토크나이저는 소유하지 않는다.
- **편집**: 리치 텍스트 저작은 제품 전용 편집기 몫이다. 이 표면은 읽기 전용 렌더링이다.

### DS가 소유한다 — 산문 타이포그래피 계약

제품이 파싱·정화한 결과(React 노드)를 받아 DS 타이포 계약을 입히는 스타일 컨테이너.

- **요소별 조판**: heading(스케일·상하 리듬), 문단·리스트(간격·마커·중첩), 표(경계·헤더·zebra),
  링크, 인라인 코드, 수평선의 시각 처리를 토큰으로 고정한다.
- **원자 재사용**: 코드 블록은 기존 `Code block`, 인용은 `Blockquote`를 재사용한다 — 산문 안에서
  같은 시각 언어를 두 번 만들지 않는다.
- **접근성 계약**: heading 레벨의 문서 계층 정합(WCAG 1.3.1), 리스트·표 시맨틱, 코드 블록의
  접근 이름, 읽기 순서 = DOM 순서. 이 표면이 소유해 제품이 재구현하지 않게 한다.
- **폭·리듬**: 읽기 폭 상한(measure)과 수직 리듬을 토큰으로 규정한다.

## 소비처

- **ConversationMessage** — assistant turn은 이미 `document` presentation이고 `children`
  슬롯을 받는다. 마크다운 응답이 Prose로 렌더되어 이 슬롯에 들어간다(주 소비처).
- **ContentEditor 미리보기** — "미리보기" 토글이 켜졌을 때 제품이 파싱한 본문을 Prose로 보여줄
  수 있다(엔진은 제품, 조판은 Prose).
- **문서·리포트 표면** — 서술형 본문을 렌더하는 제품 화면.

## API 스케치 (미확정 — 착수 시 확정)

두 방향이 있으며 트레이드오프를 착수 단계에서 판정한다.

1. **노드 슬롯**: `<Prose>{reactNodes}</Prose>`. 제품이 마크다운 → React 노드로 파싱·정화해
   넘기고, Prose는 CSS 스코프(자손 선택자)로 조판만 한다. 파서 무관, 가장 얇다. 단, 자손
   요소가 임의 HTML이면 조판 계약이 새므로 허용 요소 목록을 문서화한다.
2. **요소 맵**: `<Prose components={{ code: Code, a: Link, ... }} />`처럼 파서(예: react-markdown)의
   컴포넌트 매핑을 DS가 제공한다. 원자 재사용이 명시적이지만 특정 파서 관례에 가까워진다.

두 경우 모두 파서·sanitizer는 제품이 소유하고 Prose는 **결과의 시각·접근성 계약만** 소유한다.

## 착수 전 확인할 것 (현재 unverified)

`COMPONENT_WORKFLOW.md` 절차를 따르며, 아래는 구현 착수 전 반드시 채운다.

- **LK Portal 실제 출력** — 저장소가 로컬에 체크아웃돼 있지 않아 마크다운 컴포넌트를 직접
  읽지 못했다. 고정 커밋 `e5ee99d5062170e26abe63d9105c2b8a024ce710`의 `src/components/chat/FloatingChat.tsx`를 확인해 실제
  요소 집합(표·체크리스트·이미지 포함 여부)과 sanitize 경계를 근거로 삼는다.
- **외부 근거 2개 이상**(아직 비교 전, 후보): GitHub의 마크다운 스타일시트, Tailwind Typography
  (`prose`) 플러그인의 요소 계약과 주요 디자인 시스템의 Article/Prose 표면.
  카테고리 기대치 확인용이지 템플릿이 아니다.
- **heading 레벨 정책** — 산문 안 heading을 문서 계층에 어떻게 맞출지(오프셋 prop vs 고정 시작
  레벨). NewsCard·Card의 `headingLevel` 선례와 정합.
- **원자 커버리지 격차** — 표에 DS 컴포넌트가 없다(신설 여부 판단). 이미지·각주·수식은 범위
  밖으로 둘지 결정.

## 결정 요청

이 문서는 **만들지 말지의 게이트**다. 채택하면 위 "착수 전 확인"을 채운 뒤 새 공개 컴포넌트로
워크플로를 밟는다(문제 → 근거 2개 → product coverage → API → 시각·접근성 → 검증). 보류하면
제품이 자체 조판을 유지하되, 이 격차를 커버리지 원장에 명시적 gap으로 기록한다.
