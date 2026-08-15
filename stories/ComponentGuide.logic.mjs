export function decisionSectionTitle(useWhen, avoidWhen) {
  const hasUse = useWhen.length > 0;
  const hasAvoid = avoidWhen.length > 0;
  if (hasUse && hasAvoid) return '사용 판단';
  if (hasUse) return '사용하는 경우';
  if (hasAvoid) return '사용하지 않는 경우';
  return '';
}

export function shouldShowDecisionPanels(useWhen, avoidWhen) {
  const evidence = [...useWhen, ...avoidWhen];
  return useWhen.length > 0
    && avoidWhen.length > 0
    && evidence.length <= 5
    && evidence.every((item) => item.length <= 220);
}

export function shouldRenderSectionNavigation(sections) {
  return sections.length > 1;
}

export function publicGuideText(value) {
  const text = String(value || '');
  if (/^[^\n]+[—-]\s*[0-9a-f]{7,40},\s*[^\n]+\([0-9a-f]{7,40}\):/i.test(text)) return '';

  return text
    .replace(/examples and visual parity checks/gi, 'examples and state comparisons')
    .replace(/Storybook\/state rendering aid/gi, 'Static rendering aid')
    .replace(/ in Storybook or tests/gi, ' in examples')
    .replace(/스토리·테스트용/g, '상태 비교용')
    .replace(/\s*근거와 전체 스코프는 PROSESURFACEPROPOSAL\.md\.?$/u, '')
    .replace(/토큰 레이어\(tokens\/focus\.css\)의 전역/gu, '전역')
    .replace(/tokens\/focus\.css 전역 규칙/gu, '전역 포커스 규칙')
    .replace(
      /Button\.jsx의 loading focusable-disabled 선례와 동일/gu,
      '다른 비동기 버튼과 같은 focusable-disabled 규칙',
    )
    .replace(
      /Button\.jsx의 loading focusable-disabled 선례, 아래 Fluent Button 지침/gu,
      '다른 비동기 버튼과 같은 focusable-disabled 규칙',
    )
    .replace(/TOKENGOVERNANCE\.md의 elevation 규칙/gu, 'elevation 규칙')
    .replace(/docs\/GUIDEDCREATIONPATTERN\.md가 소유합니다/gu, '별도의 조합 패턴 가이드가 소유합니다');
}

export function storybookManagerHref(storybookDocsId, pathname = globalThis.location?.pathname ?? '/iframe.html') {
  if (!/^lds-[a-z0-9-]+--docs$/.test(storybookDocsId)) {
    throw new Error(`Canonical Storybook Docs ID is invalid: "${storybookDocsId}".`);
  }
  const managerBase = pathname.endsWith('/iframe.html')
    ? pathname.slice(0, -'iframe.html'.length)
    : `${pathname.replace(/[^/]*$/, '').replace(/\/?$/, '/')}`;
  return `${managerBase}?path=/docs/${storybookDocsId}`;
}
