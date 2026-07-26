**BrandLogo** — 풀컬러 플랫폼 브랜드 로고(Apple·Facebook·Google·GitHub·Hugging Face·LinkedIn·X·YouTube). 자체 브랜드 색을 유지 — 로그인 버튼, 플랫폼 표시, 스토어 배지에.

```jsx
<BrandLogo name="google" size={20} />
<BrandLogo name="github" size={20} mono />
<BrandLogo name="youtube" size={20} title="YouTube" />
```

- **name / size** — 마크와 정사각 크기(px). **mono**로 어떤 마크든 `currentColor` 단색 실루엣으로 반전(다크바·푸터에 적합). **BRAND_LOGO_NAMES** 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 `Icon`을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용.

## 접근성 기본값

- 마크는 **기본이 장식**입니다(`aria-hidden="true"`, role 없음). `Icon`과 같은 기본값이며, 로고 옆에는 거의 항상 플랫폼 이름이 이미 있기 때문입니다. 기본이 정보성이면 `SocialButton`이 "google logo Google로 계속하기"처럼 이름을 두 번 낭독합니다.
- 이름이 필요하면 **`title`(또는 `aria-label`)을 명시**하세요. 그때만 `role="img"` + 그 이름으로 승격됩니다. 레지스트리 키(`"google"`)를 이름으로 흘려보내지 않습니다 — `"google logo"`는 사람이 읽을 이름이 아닙니다.
- **decorative**는 이름을 함께 넘기면서도 장식으로 강제해야 하는 합성 표면용입니다. 이름을 주지 않는 한 기본 동작이 이미 장식이므로 대부분의 호출에는 필요 없습니다.
- 마크만으로 링크·버튼을 만들 때는 이름을 마크가 아니라 **컨트롤**에 주세요(`IconButton` / `SocialButton`의 `aria-label`).
