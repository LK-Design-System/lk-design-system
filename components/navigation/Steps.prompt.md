**Steps** — 가로 진행 단계 표시(도입 절차, 설치 단계).

Classification: **LK Product Extension**. 순서가 있는 워크플로의 진행 상태를 표시하며, 사이트·제품·페이지 내 탐색으로 사용하지 않습니다. 콘텐츠와 이전/다음 제어까지 필요하면 `Wizard`를 사용합니다.

```jsx
<Steps current={1} steps={['작성', '검토', '게시']} />
```

- **steps** — 문자열 또는 `{ label }`. **current** — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다.
- **접근성** — 순서 있는 리스트(`<ol>`/`<li>`)로 렌더되고, 현재 단계 `<li>`에 `aria-current="step"`이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(`aria-hidden`)입니다.
- **전경 대비** — 예정 단계의 숫자와 라벨은 비활성 컨트롤이 아니라 사용자가 읽어야 하는 진행 정보입니다. 따라서 숫자와 라벨 모두 `label-alternative`를 사용합니다. LDS light/dark elevated surface에서 계산된 대비는 각각 5.27:1, 4.67:1이며, 14px 텍스트에 [WCAG 2.2 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)의 4.5:1 기준을 적용합니다. `label-assistive`는 같은 표면에서 1.69:1, 1.79:1이므로 이 용도에 사용하지 않습니다.

외부 근거는 [W3C WAI 다단계 폼](https://www.w3.org/WAI/tutorials/forms/multi-page/)의 순서 목록·시각적으로 숨긴 상태 텍스트 권고와 [Carbon Progress indicator](https://carbondesignsystem.com/components/progress-indicator/style/)의 미시작 아이콘 `icon-primary`·라벨 `text-primary` 역할 구분을 확인했습니다. LDS는 기존 `ol`/숨김 상태/`aria-current` 구조를 유지하고, 시각 스타일은 외부 시스템을 복제하지 않고 LDS semantic foreground만 교정합니다.
