# SocialButton

"…로 계속하기" 소셜 로그인 버튼. 소셜 로그인 킷의 6개 심볼(Continue with Google/Apple/Facebook × Centre/Left Aligned)을 `provider` × `align` prop으로 통합. 지오메트리·타이포는 킷이 아니라 **LK 컨트롤 문법**(52px 높이 · radius-md · 16px 볼드 · 토큰 모션)을 따르고, 기본 `tone="outline"`은 DS 네이티브(서피스+헤어라인+풀컬러 마크, 다크 테마 자동 대응), `tone="brand"`는 킷의 플랫폼 원색 필(구글 화이트+섀도 · 애플 블랙 · 페이스북 #1877F2)을 재현합니다. 마크는 `BrandLogo` 재사용, 카피는 KR 우선.

```jsx
<SocialButton provider="google" full />
<SocialButton provider="apple" full />
<SocialButton provider="facebook" tone="brand" full />
<SocialButton provider="google" align="left">Continue with Google</SocialButton>
```
