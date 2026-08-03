**Footer** — 사이트 푸터. 네이비 밴드 + 정보 블록(대표전화·사업자등록번호 → 본사·R&D·공장 주소 → 저작권)을 일관된 토큰으로 렌더합니다. `compact`는 대시보드 바닥용 한 줄 버전.

Classification: **LK Product Extension**. 전체형 Footer는 랜딩·콘텐츠 사이트에서 `TopBar`와 조합하고, `compact`는 대시보드의 보조 메타데이터에만 사용합니다. 어느 변형도 주 탐색을 대신하지 않습니다.

```jsx
<Footer />                                {/* 기본 푸터 */}
<Footer backToTop />                      {/* '맨 위로' 플로팅 버튼 포함 */}

<Footer compact copyright="© 2026 LK ROBOTICS Inc. · Design System" links={[{ label: '고객지원', href: '#' }]} />
```

- **contact / locations** — `{ label, value }[]`. 라벨은 흰색 62%·700, 값은 45%. EN 페이지는 `{ label: 'Tel', value: '02-3159-2865' }`처럼 번역해 전달.
- **copyright** — 기본 `Copyright ⓒ 2024 - 2026 LK ROBOTICS Inc. All rights reserved.`
- **backToTop** — 푸터와 함께 렌더하는 플로팅 버튼(스크롤 600px 후 표시, 부드러운 상단 이동).
- **(확장, 실사이트엔 없음)** `brand` · `columns` — 마케팅 푸터가 커질 때만. `compact`는 페이지 서피스 위 한 줄 변형.
- 서피스는 `--color-semantic-inverse-background`(라이트에서 `#1B1C1E`, 다크에선 페이지와 반전되는 인버스 서피스), 텍스트는 고정 화이트 알파(0.62 / 0.45 / 0.38)를 사용합니다.
- 타입 스케일 정합: 저작권·법적 링크 12.5px → `--caption1-size`(12px), 컬럼 링크 13.5px → `--label2-size`(13px)로 스냅했습니다. 파인 프린트는 한 단계 아래로, 컬럼 링크는 15px 헤딩(body2)과의 위계를 유지합니다.
- **접근성** — 컬럼 제목은 `role="heading"` + `aria-level=3`으로 헤딩 시맨틱을 갖고, 링크 그룹(컬럼·정책 링크)은 `ul`/`li`로 렌더됩니다. `href`가 없는 링크 항목은 `href="#"` 폴백 없이 일반 텍스트로 렌더됩니다.
