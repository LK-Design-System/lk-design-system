**Drawer**는 현재 화면과 관련된 필터, 상세, 설정을 한쪽 edge에서 보조하는 modal side panel입니다. 분류는 **LDS Product Extension**이며 WDS variant axis를 추가하지 않습니다.

```jsx
const firstFilterRef = useRef(null);

<Drawer
  open={open}
  side="right"
  density="compact"
  title="필터"
  initialFocusRef={firstFilterRef}
  onClose={close}
  footer={<Button variant="signal">적용</Button>}
>
  <Input ref={firstFilterRef} aria-label="현장 검색" />
  <DrawerSection
    divider
    title="활동 기록 (선택)"
    description="선택하지 않으면 입력 내용과 맞는 기록을 자동으로 찾습니다."
  >
    <CheckboxGroup options={activityOptions} />
  </DrawerSection>
</Drawer>
```

## 내부 비교와 시각 차이

- `Modal`, `Sheet`, `ConfirmDialog`를 sibling으로 확인했습니다. focus/keyboard 계약은 `ConfirmDialog`와 공유하되 표면은 기존 Drawer 그대로입니다.
- Modal과 달리 좌/우 edge에 붙고, `side`, 380px 기본 폭, 92vw 상한, slide transition을 유지합니다. 이 차이는 본문 맥락과 나란히 연결되는 보조 작업이라는 기능으로 정당화됩니다.
- 시각 delta inventory: headline typography, divider, elevated fill/foreground, shadow, 20px 닫기 아이콘과 기존 Button 크기, hover/focus/disabled 처리는 유지합니다. `default` profile의 `comfortable`은 기존과 동일하게 header/body `space-5 space-6`, footer `space-4 space-6`, body `body2`/1.7을 사용합니다. `compact`은 같은 anatomy를 유지하며 header/body `space-4 space-5`, footer `space-3 space-5`, body `label1` 14/20px로 좁힙니다. `ops` profile은 선택된 density의 header/body/footer token만 한 단계 좁히며 type와 action target은 유지합니다. action gap은 두 밀도 모두 `space-2`입니다. radius와 선택/활성 marker는 추가하지 않습니다.
- 제목이 있으면 `aria-labelledby`, 없으면 `ariaLabel`을 사용합니다.
- 제품 맥락에 맞는 닫기 명령은 `closeLabel`로 제공하며 inline/overlay 표현을 바꾸어도 같은 이름을 유지할 수 있습니다.
- `bodyStyle`은 기본 body padding과 scroll contract를 유지하되, `DashboardShell temporaryNavigation`처럼 edge-attached 자식이 자체 padding·divider를 소유할 때만 `padding: 0` 같은 layout override를 전달합니다.

## Density contract

- `density="comfortable"`이 기본값이며 `default` profile의 기존 Drawer 출력과 동일합니다. 검토처럼 읽기 여유가 필요한 보조 표면에 사용합니다. `ops`에서는 같은 density API가 profile-aware chrome token을 읽습니다.
- `density="compact"`은 데스크톱의 짧고 반복적인 필터·설정 폼에서 Drawer가 소유하는 header/body/footer chrome과 body typography만 조밀하게 만듭니다. 제목 단계, 닫기 target, footer action 크기는 바꾸지 않습니다.
- body의 bounded component-density scope는 `Input`, `Select`, `Textarea`, `Checkbox`/`CheckboxGroup`, `Radio`/`RadioGroup`, `ChoiceCard`, `Callout`, `FileUpload`처럼 밀도 상속 계약을 가진 자식에 `compact`를 전달합니다. 중첩 깊이나 `DrawerField` 같은 직접 자식 복제에 의존하지 않습니다.
- 자식의 명시적 `size`, `padding`, `density`가 항상 상속값보다 우선합니다. Drawer 밖과 `comfortable` Drawer의 기존 기본 출력은 유지됩니다.
- header 닫기와 footer는 scope 밖에 있습니다. footer CTA와 보조 액션은 기존 `md` 40px를 유지하며 body 안의 행 단위 액션도 의미상 필요할 때만 명시적으로 `size="sm"`을 선택합니다.
- `DrawerSection`은 본문 하위 제목, 설명, 선택적 divider와 간격을 소유합니다. 제품은 `type-headline1`, `pt-6`, 직접 구분선으로 같은 해부학을 다시 만들지 않습니다. compact에서는 divider 상단 16px, 제목·설명 다음 8px을 사용하고 comfortable에서는 기존 읽기 여유를 유지합니다.
- `DrawerSection.headingLevel`은 실제 문서 계층에 맞춰 2~6을 선택하고 기본값은 3입니다. 짧은 보조 명령은 `actions`에 두며, `headerStyle`과 `contentStyle`은 고유한 레이아웃 조합에만 사용합니다. 이 style escape hatch로 제목 크기·밀도·divider 간격을 다시 정의하지 않습니다.
- 조밀화는 정보 위계나 상호작용 의미를 바꾸지 않습니다. Checkbox와 Radio의 실제 target은 시각 glyph보다 넓은 최소 24×24px이며, ChoiceCard와 FileUpload의 전체 label target도 유지됩니다.

## 공통 Portal·stack 계약

- 기본 `withinPortal=true`이며 `LdsProvider.portalTarget` 또는 명시적 `portalTarget`에 렌더링됩니다. 가까운 theme scope와 `dir`을 상속하고 clipping ancestor를 벗어납니다.
- `zIndex`는 예외적 명시 override입니다. 평상시에는 공통 overlay stack이 중첩 순서, topmost Escape, background inert, body scroll lock과 focus 복원을 소유합니다.
- 테스트·특수 embedding에서만 `withinPortal=false`를 사용하며 이 경우 background inert는 적용하지 않습니다.

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

- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): modal Drawer에도 내부 focus trap, Escape, 복원, 이름 있는 `dialog` 계약을 적용했습니다. 밀도는 이 interaction/semantic 계약을 변경하지 않습니다.
- [Fluent 2 Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): overlay Drawer는 중요한 짧은 보조 작업에 사용하고, header/body/footer anatomy와 스크롤 body, 예측 가능한 edge 배치를 유지했습니다. LDS의 두 density도 anatomy와 sticky region 순서는 공유하고 spacing/type만 바꾸며, 여러 overlay Drawer 동시 노출은 제외했습니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): compact scope에서도 Checkbox/Radio의 실제 target을 최소 24×24px로 유지하고 footer action을 축소하지 않는 근거입니다.
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage): 확인이 필요한 작업은 Drawer를 중첩 확장하지 않고 별도 확인 dialog로 구분합니다.

필터 query 직렬화, 변경 유실 경고 조건, route 상태와 반응형으로 inline surface로 전환하는 정책은 제품 레이어가 소유합니다.

## Subtitle contract

Use `subtitle` for one short, visible sentence that clarifies the scope or consequence of the Drawer. When present it is rendered directly below `title` and associated with the dialog through `aria-describedby`. Complex instructions, lists, validation, or independently navigable content belong in the body and must not be compressed into the subtitle.
