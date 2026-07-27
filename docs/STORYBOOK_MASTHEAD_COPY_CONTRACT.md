# Storybook Masthead Copy Contract

Storybook Canvas의 masthead는 빠르게 스캔하는 요약 표면이다. 컴포넌트·패턴의 상세
명세, 내부 구현, 테스트 방법은 Docs 본문이 소유한다.

## 작성 규칙

- `storyGuide.title`은 사용자가 얻는 결과를 한 문장으로 선언한다.
- `storyGuide.description`은 기본 두 문장, 권장 100–180자로 작성한다.
  - 첫 문장: 언제, 왜 사용하는가.
  - 둘째 문장: 적용하지 않는 경우 또는 선택해야 할 대안.
- 함수명, 내부 모듈 소유권, 공개 API 여부, 테스트·회귀 방식, 전체 예외 목록은
  `storyGuide.docsDescription` 또는 구조화된 Docs 본문으로 이동한다.
- `docsDescription`은 Canvas에 렌더하지 않는다. Docs의 `사용 판단`처럼 독자가 상세
  근거를 요청한 위치에서만 사용한다.
- 여러 컴포넌트 이름을 나열해 구현 인벤토리처럼 쓰지 않는다. masthead에는 현재
  페이지의 주제와 직접 비교해야 하는 대안만 남긴다.

## 자동 검사

개별 설명은 최대 240자·4문장을 넘을 수 없다. 종합 Foundation 페이지 같은 예외를
허용하되 저장소 전체가 장문화되지 않도록 다음 분포도 함께 검사한다.

- 평균: 최대 150자
- 중앙값: 최대 140자
- 90백분위: 최대 180자

이 값은 메인 LDS Storybook의 검토된 masthead 분포를 상한으로 삼는다. Robotics를
포함한 하위 디자인 시스템은 공용 conformance 검사기를 소비하며 자체 기준을 만들지
않는다.

기계 판독 계약은
[`STORYBOOK_MASTHEAD_COPY_CONTRACT.json`](references/quality/STORYBOOK_MASTHEAD_COPY_CONTRACT.json)에
있다.
