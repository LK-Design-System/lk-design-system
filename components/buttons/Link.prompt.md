**Link** — 스타일이 적용된 인라인 앵커(시그널 잉크, 호버 시 밑줄).

```jsx
<Link href="/products">제품 보기</Link>
<Link href="https://example.com" external>외부 문서</Link>
```

- **tone** `signal · neutral · inherit`. **underline** `none · hover · always`. **external** — 새 탭 + 외부 링크 화살표 + 안전한 rel.
- **externalLabel** — `external`일 때 접근 이름에 붙는 시각적 숨김 문구(기본 `새 창에서 열림`). 화살표 글리프는 `aria-hidden`이라 그것만으로는 새 창 이동이 보조기술에 전달되지 않습니다(WCAG G201 / H33). 문구를 바꿀 때만 지정하세요.
- **href**가 없으면 링크 역할도 포인터 커서도 주지 않습니다. 클릭 가능해 보이는 빈 앵커를 만들지 마세요.
- Link는 밑줄 제어가 있는 앵커/내비게이션 전용입니다. 사이즈·로딩 상태가 필요한 버튼형 액션(독립형 텍스트 CTA)에는 `TextButton`을 쓰세요.
