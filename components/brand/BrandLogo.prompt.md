**BrandLogo** — 풀컬러 플랫폼 브랜드 로고(Apple·Facebook·Google·GitHub·Hugging Face·LinkedIn·X·YouTube). 자체 브랜드 색을 유지 — 로그인 버튼, 플랫폼 표시, 스토어 배지에.

```jsx
<BrandLogo name="google" size={20} />
<BrandLogo name="github" size={20} mono />
```

- **mono**로 어떤 마크든 `currentColor` 단색 실루엣으로 반전(다크바·푸터에 적합). **BRAND_LOGO_NAMES** 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 `Icon`을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용.
