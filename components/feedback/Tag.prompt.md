**Tag** — 이브로우·등급·프로모 칩용 대문자·자간 오버라인 필.

```jsx
<Tag tone="signal">Products</Tag>
<Tag tone="neutral">Technology</Tag>
<Tag tone="signal" solid>NEW</Tag>
<Tag size="sm" tone="neutral">Robotics</Tag>
```

- **tone** — `signal`(틸, 기본) · `neutral`(네이비) · `steel` · `amber` · `red`. **solid**은 틴트 대신 채웁니다.
- **size** — `sm`(20px, 기본) · `md`(26px). 기본 Tag는 StatusBadge와 같은 인라인 메타데이터 행에 맞춰 외곽 높이와 글자 크기를 공유합니다. 상태가 주 정보인 행에서는 soft Tag를 기본으로 사용하고, 독립적인 이브로우·프로모 표식에만 `md` 또는 `solid`를 명시합니다.
- Tag는 대문자 이브로우/디스플레이 필 전용입니다. 클릭·선택되는 키워드에는 `Chip`, 콘텐츠 상태·속성을 알리는 정보 라벨에는 `ContentBadge`를 쓰세요.

## 인라인 크기 결정

분류용 Tag와 현재 상태용 StatusBadge는 의미를 합치지 않습니다. 기본 `Tag`는 20px 외곽 높이·12px 글자 크기를 StatusBadge와 공유하고, Tag의 대문자 자간·분류 tone과 StatusBadge의 의미 기반 soft surface로 역할을 구분합니다. 26px `size="md"`는 프로모·등급처럼 더 큰 시각적 무게가 필요한 경우에만 명시합니다.

- [Carbon Tag usage](https://carbondesignsystem.com/components/tag/usage/) — condensed·inline 공간에는 small Tag를 쓰고 인접 요소와 수직 정렬하라는 기준을 반영했습니다.
- [Carbon Tag specifications](https://preview.carbondesignsystem.com/building-blocks/core/components/tag/specifications) — 기본 크기를 하나로 강제하지 않고 small/medium/large 크기 축을 제공하는 사례를 확인했습니다.
- [Adobe Spectrum Tag](https://spectrum.adobe.com/page/tag/) · [Status light](https://spectrum.adobe.com/page/status-light/) — 분류와 상태 의미는 별도 컴포넌트로 유지하고, 각각 크기 선택지를 제공하는 구조를 따랐습니다.
- [Atlassian components](https://atlassian.design/components) — Tag와 상태용 Lozenge의 의미 분리를 유지했습니다.

이 변경은 **LDS Core 호환 확장**입니다. LK의 일반 Tag 기본값을 StatusBadge와 반복 조합되는 메타데이터 문맥에 맞춰 20px으로 두고, WDS Tag의 26px 표면은 명시적 `md` 크기로 보존합니다.
