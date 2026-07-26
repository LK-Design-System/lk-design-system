**Skeleton** - WDS loading placeholder for content that is not ready yet.

```jsx
<Skeleton variant="circle" width={44} />
<Skeleton variant="text" lines={3} width="75%" />
<Skeleton variant="rect" width={280} height={160} />
<Skeleton variant="rect" width={80} height={80} color="#E8EDF5" opacity={0.8} />
```

- **variant**: `rect`, `text`, or `circle`.
- **width / height / radius** map to WDS customize geometry.
- **lines** and **align** cover WDS text skeleton length and alignment examples.
- **color / opacity** cover WDS rectangle/circle customize axes.
- Motion respects `prefers-reduced-motion`. shimmer는 inline style로 적용되므로
  reduced-motion 규칙은 `animation:none!important`로 선언되어 사용자 설정이 항상
  이깁니다.
- **aria-busy 컨테이너 규약** — Skeleton 자체는 항상 `aria-hidden="true"`라서
  보조기술에 뼈대가 콘텐츠로 읽히지 않습니다. 로딩 상태는 Skeleton이 아니라 대기
  중인 영역을 감싸는 컨테이너가 알립니다. 컨테이너에 `aria-busy="true"`를 주고,
  대기를 소리로 알려야 하면 `role="status" aria-live="polite"`와 짧은 텍스트
  레이블(예: visually-hidden "데이터를 불러오는 중입니다")을 함께 두세요.

```jsx
<div aria-busy="true" role="status" aria-live="polite">
  <VisuallyHidden>데이터를 불러오는 중입니다</VisuallyHidden>
  <Skeleton variant="text" lines={3} />
</div>
```
