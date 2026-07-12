**Drawer**는 현재 화면과 관련된 필터, 상세, 설정을 한쪽 edge에서 보조하는 modal side panel입니다. 분류는 **LDS Product Extension**이며 WDS variant axis를 추가하지 않습니다.

```jsx
const firstFilterRef = useRef(null);

<Drawer
  open={open}
  side="right"
  title="필터"
  initialFocusRef={firstFilterRef}
  onClose={close}
  footer={<Button variant="signal">적용</Button>}
>
  <input ref={firstFilterRef} aria-label="현장 검색" />
</Drawer>
```

## 내부 비교와 시각 차이

- `Modal`, `Sheet`, `ConfirmDialog`를 sibling으로 확인했습니다. focus/keyboard 계약은 `ConfirmDialog`와 공유하되 표면은 기존 Drawer 그대로입니다.
- Modal과 달리 좌/우 edge에 붙고, `side`, 380px 기본 폭, 92vw 상한, slide transition을 유지합니다. 이 차이는 본문 맥락과 나란히 연결되는 보조 작업이라는 기능으로 정당화됩니다.
- 시각 delta inventory: headline/body typography, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 유지합니다. header/body는 `space-5 space-6`, footer는 `space-4 space-6`, action gap은 `space-2`로 Modal과 맞춥니다. radius와 선택/활성 marker는 추가하지 않고 `side` 방향만 기존 public axis로 유지합니다.
- 제목이 있으면 `aria-labelledby`, 없으면 `ariaLabel`을 사용합니다.
- 제품 맥락에 맞는 닫기 명령은 `closeLabel`로 제공하며 inline/overlay 표현을 바꾸어도 같은 이름을 유지할 수 있습니다.

## 상호작용 계약

- `initialFocusRef` → 첫 tabbable 요소 → dialog 표면 순으로 초기 초점을 선택합니다.
- 최상위 Drawer만 `Tab`/`Shift+Tab` 순환, 외부 focus containment, `Escape` dismiss를 소유합니다.
- 닫히면 trigger로 복원하며 `returnFocusRef`로 논리적 다음 지점을 지정할 수 있습니다. `restoreFocus` 기본값은 `true`입니다.
- overlay Drawer를 여러 개 겹치지 않습니다. Drawer 위에 확인 Modal이 불가피할 때는 Modal만 활성화되고, 닫힌 뒤 Drawer 내부 trigger로 돌아갑니다.
- scrim 클릭 닫기는 `closeOnScrim`으로 제어하지만, 유일한 dismiss 수단으로 사용하지 않습니다.
- 데스크톱 Drawer footer는 버튼 수와 관계없이 inline end 정렬합니다. 단독 확정 CTA도 `full`을 쓰지
  않으며, 취소·보조 액션은 `variant="outlined" color="assistive"`로 Modal과 같은 WDS 문법을 씁니다.
  full-width 액션은 작은 화면의 Sheet에 한정합니다.

## 공식 근거

- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): modal Drawer에도 내부 focus trap, Escape, 복원, 이름 있는 `dialog` 계약을 적용했습니다.
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): overlay Drawer는 중요한 짧은 보조 작업에 사용하고, header/body/footer anatomy와 스크롤 body, 예측 가능한 edge 배치를 유지했습니다. 여러 overlay Drawer 동시 노출은 제외했습니다.
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage): 확인이 필요한 작업은 Drawer를 중첩 확장하지 않고 별도 확인 dialog로 구분합니다.

필터 query 직렬화, 변경 유실 경고 조건, route 상태와 반응형으로 inline surface로 전환하는 정책은 제품 레이어가 소유합니다.
