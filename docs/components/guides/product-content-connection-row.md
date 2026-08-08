# Connection Row

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ConnectionRow` |
| Storybook | `LDS Product/Content/Connection Row` |
| Source | `../component-content.json#product-content-connection-row` |

계정·서비스·저장소 연결이 반복되는 설정 화면에서 사용합니다. LDS는 visual부터 action까지의 읽기 순서와 상태 표현, 좁은 폭 재배치만 소유하고 연결 실행·권한·확인은 제품에 남깁니다.

## 사용 판단

### 사용

- connected: 관리 또는 연결 해제를 보조 액션으로 제공합니다. 연결 해제는 행에서 variant="outlined" color="assistive"를 사용하고, 파괴적 강조와 최종 확인은 ConfirmDialog가 소유합니다.
- GitHub OAuth app authorization은 사용자가 연결된 앱과 접근 범위를 검토하고 오래된 연결을 제거할 수 있어야 함을 보여 줍니다.
- Google third-party connections은 앱 이름, 접근 권한, 연결 검토·삭제를 사용자가 통제하는 구조를 설명합니다.
- LDS는 여섯 소비처의 layout drift만 줄입니다. 제품별 계정 cardinality, provider metadata, mutation, permission, confirmation, route는 그대로 Portal에 남습니다.

### 사용하지 않음

- pending: 취소 또는 다시 시도 같은 하나의 회복 액션만 제공합니다. 같은 요청을 중복 생성하는 연결 버튼을 함께 노출하지 않습니다.
- disconnected: 연결 시작이 유일한 주 액션일 때 primary 문법을 사용할 수 있습니다. 권한이 없으면 disabled control과 이유를 제품이 제공합니다.
- ConnectionRow는 연결된 계정·서비스·저장소·자원을 한 줄로 식별하고 현재 상태와 관련 액션을 함께 보여 주는 LK Product Extension입니다. 제품마다 Avatar, 상태 위치, 연결 해제 강조를 다시 조립하지 않도록 표면과 읽기 순서만 닫으며, 실제 연결 workflow는 소유하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| actions | Product-owned actions that follow the state-specific action rules. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | No | Root element. Use as="li" when the row belongs to a semantic list. @default "div" |
| `visual` | `React.ReactNode` | No | Decorative identity visual. Avatar, Thumbnail, or a service logo are accepted; interactive content is not. |
| `name` | `React.ReactNode` | Yes | Visible account, service, or resource name. |
| `status` | `React.ReactNode` | Yes | Visible product-authored state label. It must communicate the state without color. |
| `detail` | `React.ReactNode` | No | Supporting identifier, scope, owner, or last-connected information. |
| `actions` | `React.ReactNode` | No | Product-owned actions that follow the state-specific action rules. |
| `state` | `ConnectionRowState` | No | Presentational connection state. @default "disconnected" |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| status | Visible product-authored state label. It must communicate the state without color. |
| state | Presentational connection state. @default "disconnected" |

## Behavior and interaction

- 상태 dot은 장식이고 visible status가 상태를 전달합니다. 자동 live region은 만들지 않습니다. 실제 비동기 결과를 알릴 필요가 있으면 제품 workflow가 별도 status region을 소유합니다.
- LK Portal에서 SynologyChatWorkspace, PetWorkspace, ConfluenceConnections, CatalogResourceDetail, RepositoryDrawer, ProjectWorkspace가 같은 account/resource connection anatomy를 서로 다르게 조립한다는 issue evidence를 출발점으로 삼았습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | root는 420px 이하 container에서 actions를 다음 grid line으로 내립니다. 이름과 상세 정보는 overflow-wrap:anywhere를 사용하며 320 CSS px에서 가로 스크롤을 만들지 않습니다. |
| 명시 규칙 2 | 액션 wrapper는 줄바꿈을 허용하고 직접 자식 control의 최소 target을 24×24px로 보장합니다. 제품은 가능한 한 LDS Button 또는 IconButton을 사용합니다. |
| 명시 규칙 3 | custom styles로 상태 dot 또는 focus indicator의 3:1 비텍스트 대비를 약화하지 않습니다. |
| 명시 규칙 4 | WCAG 2.2 Use of Color, Target Size, Non-text Contrast, Reflow를 적용합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- vars는 --lds-connection-row-min-height, --lds-connection-row-padding, --lds-connection-row-gap, --lds-connection-row-action-gap, --lds-connection-row-visual-size를 받습니다.

## Content and writing

- DOM과 읽기 순서는 visual → name → status → detail → actions입니다. CSS reflow로 이 순서를 바꾸지 않습니다.
- stable named part는 root, visual, name, status, detail, actions입니다.
- state="connected | pending | disconnected"는 상태 dot의 tone과 pending pulse만 결정합니다. status의 visible text는 제품이 작성하며 색만으로 상태를 전달하면 안 됩니다.
- 실제 연결·해제, optimistic/polling 상태, 권한, route, 확인 절차, 상태·날짜 문구, 표시할 계정 집합은 제품이 소유합니다.

## Accessibility

- visual은 Avatar, Thumbnail, 서비스 로고를 받습니다. 옆의 필수 name이 같은 정체성을 제공하므로 wrapper가 aria-hidden="true"로 접근성 트리에서 제외합니다. interactive control은 visual에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Avatar` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ConnectionRow
  as="li"
  visual={<Avatar name="Synology Chat" variant="company" />}
  name="Synology Chat"
  state="connected"
  status="연결됨"
  detail="workspace@lkrobotics.co.kr · 5분 전 확인"
  actions={<Button size="sm" variant="outlined" color="assistive">연결 해제</Button>}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--component-card-bg`
- `--component-card-border`
- `--component-card-fg`
- `--component-card-radius`
- `--font-sans`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--lds-connection-row-action-gap`
- `--lds-connection-row-gap`
- `--lds-connection-row-min-height`
- `--lds-connection-row-padding`
- `--lds-connection-row-visual-size`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/content/ConnectionRow.jsx`
- `components/content/ConnectionRow.d.ts`
- `components/content/ConnectionRow.prompt.md`
- `stories/ContentConnectionRow.stories.jsx`

## Sources

- ConnectionRow prompt contract: `components/content/ConnectionRow.prompt.md`
- Storybook implementation evidence: `stories/ContentConnectionRow.stories.jsx`
- [Shopify Polaris Account connection](https://github.com/Shopify/polaris-react-archive/blob/af6ffb66a5b1d20f6c2c898b334a1ebb53728ba2/polaris.shopify.com/content/components/actions/account-connection.mdx)
- [GitHub OAuth app authorization](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/authorizing-oauth-apps)
- [Google third-party connections](https://support.google.com/accounts/answer/13533235?hl=en)
- [WCAG 2.2 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [Target Size](https://www.w3.org/TR/WCAG22/#target-size-minimum)
- [Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast)
- [Reflow](https://www.w3.org/TR/WCAG22/#reflow)
