**Blockquote** — 조용한 채움 표면 위의 인용.

이전의 3px primary 좌측 룰은 제거했습니다. primary는 이 시스템의 인터랙션 잉크라 인용이 링크나 선택 강조로 읽혔고, 채움 상자는 「다른 문서에서 떠온 글」이라는 스니펫 관용구입니다. `SourceDisclosure`의 발췌와 같은 처리라 인용은 시스템 어디서나 한 가지 모양입니다. `Prose`의 마크다운 `blockquote`도 같은 표면을 씁니다.

```jsx
<Blockquote attribution="문서 가이드">문서 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.</Blockquote>
<Blockquote attribution="LDS 접근성 가이드" citeUrl="https://example.com/a11y">…</Blockquote>
```

- **children** — 인용문. **attribution** — 뮤트 톤의 출처 표기. **citeUrl** — HTML `cite` 속성(출처 문서 URL).
- 타입 스케일 정합: 출처 13.5px → `--label2-size`(13px)로 스냅했습니다(−0.5px, 인용문 대비 뮤트 위계 유지). 인용문(headline2)과 함께 전 사이트가 토큰 스케일 위에 있습니다.

## 마크업 구조와 prop 이름

- 출처는 **인용문의 일부가 아닙니다.** HTML 명세는 출처 표기를 `blockquote` **바깥**에 두라고 안내하므로, `attribution` 이 있으면 `figure > (blockquote + figcaption)` 으로 렌더링합니다. `blockquote` 안에 넣으면 "누가 말했는가"까지 인용문으로 낭독됩니다. 좌측 룰과 패딩은 `figure` 로 옮겨 시각은 동일합니다.
- **이름 충돌 주의** — HTML 의 `cite` **속성**은 사람이 읽는 이름이 아니라 **출처 문서의 URL** 입니다. 이 컴포넌트의 텍스트 출처는 `attribution`, URL 은 `citeUrl` 로 분리했습니다. 기존 코드 호환을 위해 `cite` prop 은 `attribution` 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요.
