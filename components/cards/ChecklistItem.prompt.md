**ChecklistItem** — 시그널 잉크 체크(또는 레드 `cross`) + 라벨; 브랜드의 핵심 리스트 스타일. `dark`는 네이비 서피스용, `muted`는 흐리게 표시.

```jsx
<ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
  <ChecklistItem>상태 라벨 표시</ChecklistItem>
  <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
  <ChecklistItem stateLabel="미지원">사용자 정의 테마</ChecklistItem>
</ul>
```

## 계약

- 정적 표시 전용입니다. 사용자가 직접 켜고 끄는 항목은 `Checkbox`, 순서가 의미인 절차는 `Steps`를 쓰세요.
- **상태를 색·아이콘으로만 전달하지 않습니다.** 체크/크로스 글리프와 취소선은 장식(`aria-hidden`)이고, 포함·제외 상태는 시각적으로 숨긴 `stateLabel` 텍스트로 보조기술에 전달됩니다(WCAG 1.4.1 / 1.3.1). 기본값은 `cross`에 따라 `"포함"` / `"제외"`이며, 목록의 의미가 다르면 `stateLabel="미지원"`처럼 바꾸고, 주변 문맥이 이미 상태를 말할 때만 `stateLabel={null}`로 끕니다.
- 행은 기본적으로 `as="li"`로 렌더합니다. 여러 항목은 반드시 `ul`/`ol`로 감싸 개수와 위치가 읽히게 하고(래퍼에 `listStyle: none; margin: 0; padding: 0`), 목록이 아닌 단독 행에만 `as="div"`를 씁니다.
- `cross`는 취소선 + 레드, `muted`는 흐린 라벨 톤입니다 — 두 축은 독립이며 함께 쓰면 "제외된 항목"이 됩니다.
- 타입 스케일 정합: 라벨 16.5px → `--body1-size`(16px)로 스냅했습니다. 본문 계열 한 단계로 정렬합니다.
