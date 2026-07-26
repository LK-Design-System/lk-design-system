const INTERNAL_REFERENCE_PATTERNS = [
  /^(?:npm|pnpm|yarn)\s+run\b/i,
  /^(?:\.{0,2}\/)?(?:assets|components|docs|packages|scripts|src|stories|tokens)\//i,
  /\.(?:css|jsx?|json|md|tsx?)$/i,
  /\bstory\b/i,
];

const PUBLIC_REFERENCE_RENAMES = new Map([
  ['Writing foundation', 'Writing'],
  ['Banner embedded', 'Banner'],
  ['DataGrid embedded', 'DataGrid'],
  ['ViewerFrame embedded', 'ViewerFrame'],
]);

export function isPublicFoundationReference(value) {
  const reference = String(value || '').trim();
  return Boolean(reference)
    && !INTERNAL_REFERENCE_PATTERNS.some((pattern) => pattern.test(reference));
}

export function publicFoundationText(value) {
  return String(value || '')
    .replace(/코드·Storybook·Figma·AI 출력/gu, '제품 UI·Figma·코드·AI 출력')
    .replace(
      /변경과 함께 Storybook 영향 예시를 남깁니다\./gu,
      '변경이 영향을 주는 대표 UI 상태를 함께 확인합니다.',
    )
    .replace(
      /ACCESSIBILITY_CONTRACTS\.md의 semantic·keyboard·focus·screen reader 계약/gu,
      '정의된 semantic·keyboard·focus·screen reader 계약',
    )
    .replace(/Storybook Axe/gu, '자동 접근성 검사');
}

export function publicFoundationContent(foundation) {
  const projectRows = (rows) => rows.map((row) => row.map(publicFoundationText));
  return {
    ...foundation,
    purpose: publicFoundationText(foundation.purpose),
    principles: foundation.principles.map(publicFoundationText),
    semanticModel: projectRows(foundation.semanticModel),
    selectionCriteria: projectRows(foundation.selectionCriteria),
    quantitativeRules: projectRows(foundation.quantitativeRules),
    doDont: projectRows(foundation.doDont),
    exceptions: foundation.exceptions.map(publicFoundationText),
    accessibility: foundation.accessibility.map(publicFoundationText),
    internationalization: foundation.internationalization.map(publicFoundationText),
    examples: projectRows(foundation.examples),
  };
}

export function publicFoundationReferences(foundation) {
  if (foundation.slug === 'design-token') {
    return {
      tokens: ['원자 토큰', '의미 토큰', '컴포넌트 토큰'],
      apis: ['CSS 커스텀 프로퍼티', 'LDS 스타일 진입점'],
    };
  }

  const project = (items) => items
    .filter(isPublicFoundationReference)
    .map((item) => PUBLIC_REFERENCE_RENAMES.get(item) || item);

  return {
    tokens: project(foundation.tokens),
    apis: project(foundation.apis),
  };
}
