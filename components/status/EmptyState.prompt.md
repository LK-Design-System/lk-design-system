**EmptyState** — 빈 목록 / 결과 없음을 위한 중앙 플레이스홀더.

```jsx
<EmptyState icon={<Icon name="search" size={26} />} title="검색 결과가 없습니다"
  description="다른 산업이나 제품군으로 다시 검색해 보세요."
  action={<Button variant="flat">필터 초기화</Button>} />

<EmptyState headingLevel={3} title="아직 로그가 없습니다" />
```

- **icon / title / description / action** — 모두 선택적 노드. 아이콘은 부드러운 시안 타일에 놓입니다.
- **tone** — 기본 `signal`. 오류·주의 차단 상태는 `negative`/`cautionary`를 전달해 아이콘의
  의미와 타일 surface/foreground를 맞춥니다.
- **title은 실제 heading으로 렌더됩니다.** 스타일된 `div`가 아니라 `h2`–`h6`이므로 스크린 리더 사용자가 heading 탐색으로 빈 상태에 바로 도달할 수 있습니다(Carbon · Polaris · Atlassian의 empty state와 같은 규약).
- **headingLevel** — 기본 `2`. 주변 문서 개요에 맞춰 `2`–`6`으로 지정하세요(범위를 벗어나면 클램프됩니다). 카드나 패널 안처럼 이미 `h2`가 있는 영역에서는 `headingLevel={3}`처럼 한 단계 낮춰 heading 순서가 건너뛰지 않게 합니다.

## 컨테이너 안의 배치

- 헤더·툴바와 높이가 할당된 본문을 가진 카드, 패널, 표에서는 빈 상태를 **헤더를 제외한 가용 본문 영역의 가로·세로 중앙**에 둡니다. 컨테이너 전체 중앙을 사용해 헤더 때문에 아래로 밀리거나, 고정 padding만으로 본문 위쪽에 붙이지 않습니다.
- 메뉴, 자동완성, disclosure, 자동 높이 목록처럼 콘텐츠 높이만큼 열리는 표면은 본문을 인위적으로 키우지 않고 흐름 배치를 유지합니다.
- 작은 bounded region에서는 텍스트 중심의 compact 상태를 사용하고, 충분한 크기와 다음 행동이 필요한 차단 상태에서만 icon·description·action을 포함한 `EmptyState`를 사용합니다.
- loading·error가 같은 본문을 대체한다면 empty와 동일한 배치 축을 공유해 상태 전환 때 메시지 위치가 흔들리지 않게 합니다. 긴급도와 live-region 역할은 각 상태의 의미에 따라 별도로 결정합니다.

## 공식 근거와 LDS 결론

- [Carbon Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)는 컨테이너 크기와 맥락에 따라 compact 상태와 큰 empty state를 구분합니다.
- [SAP Fiori Empty States](https://experience.sap.com/fiori-design-web/designing-for-empty-states/)와 [Illustrated Message](https://experience.sap.com/fiori-design-web/illustrated-message-web-component/)는 메시지를 컨테이너 크기에 맞춰 조정하고 작은 영역에서는 text-only 표현을 사용하도록 안내합니다.
- LDS는 이를 `bounded body는 본문 중앙`, `auto-height surface는 흐름 배치`로 명시합니다. `FileUploadQueue`, `FileBrowser`, `TreePicker`, `MessageFeed`, `DataGrid` 같은 영역형 컴포넌트는 전자를 따르고, dropdown·autocomplete·일반 목록은 후자를 따릅니다.
