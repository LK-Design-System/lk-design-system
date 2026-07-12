**FormField** — 아무 컨트롤이나 감싸는 라벨 래퍼(라벨 + 필수 표시 + 헬퍼/에러).

## Shared wrapper contract

- FormField uses the same input-label tokens, caption helper/error typography, required color, and stack gap as native LDS fields. It must not create a second typography scale around composed controls.
- Reference basis: [GOV.UK Error message](https://design-system.service.gov.uk/components/error-message/) and [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/).

```jsx
<FormField label="회사명" required helper="공식 등록명으로 입력">
  <Input placeholder="디자인 시스템" />
</FormField>
<FormField label="이메일" error="올바른 이메일을 입력하세요">
  <Input aria-invalid />
</FormField>
```

- **label / required** — 헤딩. **helper / error** — 아래 줄(에러가 우선하며 레드로 틴트). `Input`, `Select`, `RadioGroup` 등을 감쌉니다.
