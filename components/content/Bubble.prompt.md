**Bubble** — 꼬리가 대상을 가리키는 지속형 콜아웃(코치 마크, 지도·화면 주석, 짧은 설명).

```jsx
<Bubble tone="navy" tail="bottom">선택 항목의 설명을 표시합니다.</Bubble>
<Bubble tone="light" tail="left">여기를 눌러 대시보드로 이동</Bubble>
```

## 계약

- **tone** — `navy`(솔리드) · `light`(화이트 + 헤어라인). **tail** — `top | bottom | left | right`.
- **대화에는 쓰지 마세요.** `tone`은 대상 배경 위에서 읽히는 서피스를 고르는 시각 선택일 뿐 화자 정보를 담지 않습니다. 두 화자를 navy/light로 나누면 발신자를 색으로만 구분하게 되어 WCAG 1.4.1에 걸립니다. 채팅·대화 기록은 작성자 이름과 역할을 텍스트로 유지하는 `ConversationMessage`(그리고 목록 컨테이너 `MessageFeed`)를 쓰세요.
- 사라지는 호버 힌트에는 `Tooltip`, 즉시 대응이 필요한 시스템 오류에는 `Alert`를 쓰세요. Bubble은 화면에 남아 있는 설명입니다.
- 폭은 최대 280px로 묶어 한 줄이 읽기 좋은 길이를 넘지 않게 합니다. 더 긴 본문이 필요하면 콜아웃이 아니라 `Popover`나 본문 영역으로 승격하세요.
