**Modal** — 네이비 스크림 위 일반 콘텐츠 다이얼로그(헤더 + 스크롤 본문 + 선택적 푸터). `Alert`보다 크고 유연합니다.

```jsx
<Modal open={open} title="도입 문의" onClose={close}
  footer={<><Button variant="ghost" onClick={close}>취소</Button><Button variant="signal">보내기</Button></>}>
  <Input label="회사명" /> …
</Modal>
```

- **open / onClose** — 제어형(Esc·스크림으로 닫힘). **title / children / footer** — 슬롯. **width** — 최대 px. 단순 확인에는 `Alert`를 쓰세요.
