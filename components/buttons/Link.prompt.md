**Link** — 스타일이 적용된 인라인 앵커(시그널 잉크, 호버 시 밑줄).

```jsx
<Link href="/products">제품 보기</Link>
<Link href="https://example.com" external>외부 문서</Link>
```

- **tone** `signal · neutral · inherit`. **underline** `none · hover · always`. **external** — 새 탭 + 외부 링크 화살표 + 안전한 rel.
- Link는 밑줄 제어가 있는 앵커/내비게이션 전용입니다. 사이즈·로딩 상태가 필요한 버튼형 액션(독립형 텍스트 CTA)에는 `TextButton`을 쓰세요.
