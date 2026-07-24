# LK Design System Components

| Field | Value |
| --- | --- |
| Type | Component decision-guide index |
| Status | Current |
| Owner | Component owners · Design system owner |
| Compiled registry | `component-content.json` |

LDS 컴포넌트 문서는 구현 예시 모음이 아니라 선택·상태·상호작용·접근성·정량 규칙을 함께 제공하는 결정 계약입니다. 컴포넌트별 `.prompt.md`, `.d.ts`, 구현 source, Storybook audit와 token source를 하나의 검증 가능한 registry로 컴파일합니다.

## Coverage

- Public component entries: **179**
- Named exports: **182**
- Component and Theme/Product decision guides: **148**
- SEED component benchmark traces: **30**
- Entries without an owned Storybook page: **8** — reference registry에서 source·type·prompt 계약을 계속 추적합니다.

## Completion contract

1. `purpose-and-selection`
2. `anatomy`
3. `properties`
4. `states`
5. `behavior`
6. `quantitative-rules`
7. `responsive`
8. `content-writing`
9. `accessibility`
10. `do-dont`
11. `exceptions`
12. `related-components`
13. `examples`
14. `tokens-api`
15. `migration`
16. `machine-readable-reference`

## Generated surfaces

- [Component reference](COMPONENT_REFERENCE.md)
- [Progress board](PROGRESS_BOARD.md)
- [LLM bundle](llms.txt)
- [JSON Schema](component-content.schema.json)
- [Compiled registry](component-content.json)
- [Decision guides](guides/)

## Authoring workflow

1. 컴포넌트의 `.prompt.md`에 사용 판단, 제약, 접근성, 근거와 예제를 기록합니다.
2. `.d.ts`, 구현 source와 Storybook에서 API·token·상태 증거를 유지합니다.
3. `npm run generate:components`로 registry와 문서를 갱신합니다.
4. `npm run check:components`로 전체 export와 guide 계약을 검증합니다.
