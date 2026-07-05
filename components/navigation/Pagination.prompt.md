**Pagination** — 이전/다음 셰브론과 말줄임 접기가 있는 번호 페이지 컨트롤.

```jsx
<Pagination page={page} count={12} onChange={setPage} />
```

- **page / count / onChange** — 제어형. **siblingCount** — 현재 양옆에 보이는 페이지 수. 현재 페이지는 시안 워시 + 시그널 잉크 링으로 채워지고, 경계에서는 끝 버튼이 비활성화됩니다.
