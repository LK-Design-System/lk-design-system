# SocialButton

"…로 계속하기" 소셜 로그인 버튼. 소셜 로그인 킷의 6개 심볼(Continue with Google/Apple/Facebook × Centre/Left Aligned)을 `provider` × `align` prop으로 통합. 지오메트리·타이포는 킷이 아니라 **LK 컨트롤 문법**(52px 높이 · radius-md · 16px 볼드 · 토큰 모션)을 따르고, 기본 `tone="outline"`은 DS 네이티브(서피스+헤어라인+풀컬러 마크, 다크 테마 자동 대응), `tone="brand"`는 킷의 플랫폼 원색 필(구글 화이트+섀도 · 애플 블랙 · 페이스북 #1877F2)을 재현합니다. 마크는 `BrandLogo` 재사용, 카피는 KR 우선.

```jsx
<SocialButton provider="google" full />
<SocialButton provider="apple" full />
<SocialButton provider="facebook" tone="brand" full />
<SocialButton provider="google" align="left">Continue with Google</SocialButton>
```

## 접근성과 상태 계약

- 이름은 **가시 텍스트 하나**가 담당합니다. 마크는 `BrandLogo`를 장식(`decorative`)으로 렌더하므로 "Google로 계속하기"가 한 번만 낭독됩니다. `BrandLogo`도 기본이 장식이라 이 지점에서 이름이 중복될 여지가 없습니다.
- **iconOnly**는 원형 48px 마크 버튼이며 이 경우에만 `aria-label`(+`title`)로 같은 문구를 실어 이름 없는 버튼이 되지 않게 합니다.
- **as**로 `a` 등 비버튼 요소를 렌더할 때 **disabled**는 native `disabled`가 없으므로 `aria-disabled="true"` + 활성화 차단(`preventDefault`)으로 전달됩니다. 흐리기만 하고 조작 가능한 "비활성"을 만들지 않습니다. `as="button"`일 때는 그대로 native `disabled`입니다.
- 페이스북 브랜드 필은 흰 텍스트 AA(4.5:1)를 위해 공식 `#1877F2`를 `#1465D8`로 어둡게 조정한 의도적 이탈입니다. `tone="brand"`의 원색 필과 킷 섀도는 다크 테마 자동 대응 대상이 아니며, 테마 대응이 필요하면 기본 `tone="outline"`을 쓰세요.
