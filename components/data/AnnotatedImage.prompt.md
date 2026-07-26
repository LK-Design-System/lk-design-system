# AnnotatedImage

`AnnotatedImage`는 정규화된 영역과 지점 annotation을 이미지 위에 표시하는 **LK Product Data 확장**입니다. WDS Core parity가 아니며, provenance·검토 action·workflow를 소유하지 않습니다.

```jsx
<AnnotatedImage
  src={frameUrl}
  alt="건설 현장을 순찰하는 로봇의 카메라 프레임"
  regions={detections}
  points={measurements}
/>
```

## 재사용 계약

- anatomy는 `figure` → media frame → overlay 표시 `ToggleIcon` → 시각 overlay → 직접 자식인 `figcaption`과 순서가 같은 텍스트 요약입니다. 캡션과 요약은 공간이 충분하면 같은 행의 좌우에 놓고, 좁거나 문구가 길 때만 요약을 다음 행으로 래핑합니다. 요약은 별도 native `details`를 만들지 않고 기존 `Collapsible`의 `compact` density와 `align="end"`를 재사용합니다. 트리거와 패널을 같은 내용 너비 블록으로 오른쪽 정렬해 관계를 분명히 하고, 펼침 전후 트리거 위치를 고정합니다.
- annotation은 비대화형 시각 데이터입니다. overlay 자체에는 클릭 handler나 별도 focus stop을 만들지 않습니다. 사용자가 hotspot을 눌러 이동하거나 실행해야 한다면 이 컴포넌트를 확장하지 말고, 명시적인 link/button 이름과 동일한 순서의 중복 텍스트 link를 가진 별도 interactive-map 계약을 설계합니다.
- `alt`는 이미지 전체의 목적과 맥락을 짧게 설명합니다. 모든 region/point에는 의미 있는 `label`을 제공하고, 전체 annotation은 번호가 일치하는 ordered text summary로도 노출합니다. 이미지는 `aria-details`로 그 긴 설명을 참조합니다.
- overlay 표시 제어는 기존 `ToggleIcon`의 `on-dark` variant를 사용합니다. 지속적으로 읽어야 하는 annotation 이름이나 값은 `Tooltip`에만 넣지 않습니다. `Tooltip`은 focus/hover 힌트이고 focus 가능한 내용을 소유하지 않기 때문입니다.
- `labelDisplay="auto"`는 420px 이하 media container에서 긴 overlay label을 번호 marker로 축약합니다. `always`는 label을 계속 보이고, `index`는 항상 번호 marker만 보입니다. 어떤 모드에서도 ordered text summary는 보존됩니다.
- 영역 label은 detection 도구 관행대로 region tone 색으로 채운 tag를 box 상단 테두리 바깥에 이어 붙여, 색 공유로 소속을 드러내면서 annotation 대상을 가리지 않습니다. box가 frame 상단에 붙어 위 공간이 없으면 box 안쪽 상단으로 폴백해 잘리지 않게 하고, 상단 자리가 다른 region과 겹치면 box 하단 바깥으로 플립해 어느 box의 label인지 오독되지 않게 합니다. tag 텍스트는 tone 채움 위에서 대비가 보장된 색(status tone은 static black, neutral은 inverse label)을 사용합니다. point label은 좌표가 가장자리에 가까우면 반대 방향으로 배치합니다. 좁은 폭에서는 label보다 번호와 텍스트 summary를 우선합니다.
- 좌표는 frame 전체가 아니라 `objectFit`으로 계산된 실제 image content box를 기준으로 합니다. 지원 모드는 `contain`, `cover`, `fill`, `none`, `scale-down`입니다.
- canonical tone은 `signal`, `positive`, `cautionary`, `negative`, `neutral`입니다. `warning`과 `danger`는 기존 consumer 호환 alias일 뿐 새 사용에서는 선택하지 않습니다. 색만으로 의미를 전달하지 않고 번호·label·요약을 항상 함께 제공합니다.
- 이미지가 없으면 원본 비율을 억지로 유지하지 않는 compact empty frame을, load 실패에는 `alert`, loading/empty에는 `status`를 사용합니다.
- 출처, model version, capture time, hash는 `SourceDisclosure`로 조합합니다. 다운로드·review action·관련 evidence 이동·집계 비교는 제품 layer에서 별도로 배치합니다.

## 내부 일관성 점검

- media framing과 대체 텍스트는 LDS `Image`, overlay 제어는 `ToggleIcon`, 지속 정보와 임시 힌트의 구분은 `Tooltip`/`Popover`, tone·spacing·radius는 LDS semantic token 관행과 맞췄습니다.
- `Image`나 `Thumbnail`을 대체하지 않습니다. annotation 좌표와 그 텍스트 등가물이 함께 필요한 경우에만 사용합니다.

## 외부 참고와 반영 결론

- [W3C WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/): informative/complex image의 짧은 대체 텍스트와 완전한 텍스트 등가물을 분리했습니다.
- [W3C WAI Image Maps Tutorial](https://www.w3.org/WAI/tutorials/images/imagemap/): interactive hotspot이 필요할 때 각 영역의 고유한 텍스트 대안과 중복 텍스트 link가 필요하다는 경계를 계약에 명시했습니다.
- [WAI-ARIA APG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): 지속 annotation 내용을 tooltip에만 숨기지 않고 overlay와 ordered summary로 제공합니다.
- [MDN: Add a hit map on top of an image](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Add_a_hit_map_on_top_of_an_image): 시각 순서와 텍스트 순서를 맞추고 responsive 좌표 보존을 우선했습니다.

의도적으로 interactive hotspot, drag/edit, provenance, review action, model comparison은 제외했습니다. 이들은 별도 Product 계약이나 application workflow의 책임입니다.
