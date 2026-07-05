**StepList** — 편집형 순서 시퀀스. 태스크 저작(웨이포인트·액션 스텝)에 씁니다. 번호 행 + 재정렬(↑/↓) + 삭제 + 선택적 추가 버튼. 변경 시 다음 배열을 `onChange`로 흘립니다.

```jsx
<StepList steps={steps} onChange={setSteps} onAdd={addStep}
  addLabel="웨이포인트 추가" />
// steps: [{ id, label: '1층 로비로 이동', detail: 'x 12.4 · y 3.1' }, …]
```

- **steps** — `{ id, label, detail }[]` · **editable** · **onAdd / addLabel**. 읽기 전용 진행 표시는 `Steps`를 쓰세요.
