**CopyButton** — `value`를 클립보드에 복사하고 결과(성공 또는 실패)를 약 1.4초 동안 같은 자리에서 알립니다.

```jsx
<CopyButton value="LKR-T1-2026-0001">시리얼 복사</CopyButton>
<CopyButton value={token} copiedLabel="토큰 복사됨" errorLabel="토큰을 복사하지 못했습니다" />
```

- **value** — 복사할 텍스트. **children** — 대기 라벨(기본 `복사`). **size** `sm · md`.
- **copiedLabel** — 성공 라벨(기본 `복사됨`). **errorLabel** — 실패 라벨(기본 `복사 실패`).

## 결과 계약

- 클립보드 쓰기가 **실패하면 실패로 표시합니다.** 권한 거부, 비보안 컨텍스트(`navigator.clipboard` 미지원), `writeText` reject는 모두 실패이며 `errorLabel` + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 `copiedLabel`을 보여 주지 않습니다.
- 버튼 안에 **상시 마운트된 시각적 숨김 `role="status" aria-live="polite"`** 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않습니다(`ToastStack`과 같은 방식). 같은 문구를 연속으로 알릴 때는 영역을 비웠다가 다시 채워 변경을 관찰 가능하게 만듭니다.
- 상태 리셋 타이머는 언마운트와 재클릭 때 정리되므로 연타해도 피드백이 조기에 사라지거나 언마운트 후 setState가 발생하지 않습니다. 현재 상태는 `data-copy-status`(`idle` · `copied` · `error`)로 노출됩니다.
- 아이콘은 `aria-hidden`이고 이름은 항상 버튼 텍스트가 담당합니다. 소비자 `onClick`은 복사 동작을 덮어쓰지 않고 함께 호출됩니다.
- 36/44px 높이는 Button 높이 스케일(32/40/48) 이전의 지오메트리로, 시각 변화를 막기 위해 그대로 유지합니다.
