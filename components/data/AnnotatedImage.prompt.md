**AnnotatedImage**는 한 이미지와 normalized region/point annotation만 렌더링하는 LK Product Data 확장입니다.

```jsx
<AnnotatedImage
  src={frameUrl}
  alt="점검 프레임"
  regions={detections}
  points={measurements}
/>
```

- 출처, 모델 버전, capture time, hash는 `SourceDisclosure`로 별도 조합합니다.
- review action, 다운로드, 관련 evidence 이동은 제품이 소유합니다.
- metric 비교는 `DataGrid` 또는 제품 분석 표면이 소유합니다.
- annotation 표시 토글은 이미지와 분리된 상단 CTA가 아니라 media frame 내부 제어로 표시합니다.
- 이미지가 없을 때는 원본 비율을 강제로 유지하지 않고 compact empty frame을 사용합니다.
- 모든 region/point는 색상과 무관하게 label을 제공하고 접근성 요약에 노출해야 합니다.
- annotation 색은 임의 문자열이 아니라 `signal`/`positive`/`warning`/`danger`/`neutral` semantic `tone`으로 선택합니다.
- normalized 좌표는 frame 전체가 아니라 `objectFit`으로 실제 렌더된 이미지 content box를 기준으로 계산합니다. 따라서 `contain` letterbox와 `cover` crop에서도 overlay가 원본 위치를 유지합니다.
