import ts from 'typescript';

function stringLiteralValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function propertyName(node) {
  if (ts.isIdentifier(node)) return node.text;
  const literal = stringLiteralValue(node);
  if (literal !== undefined) return literal;
  if (ts.isComputedPropertyName(node)) return stringLiteralValue(node.expression);
  return undefined;
}

function fail(file, message) {
  throw new Error(`${file} ${message}`);
}

export function extractStorySortRootOrder(source, file = '.storybook/preview.jsx') {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const storySortFunctions = [];

  function collectStorySort(node) {
    if (
      ts.isPropertyAssignment(node)
      && propertyName(node.name) === 'storySort'
      && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      storySortFunctions.push(node.initializer);
    }
    ts.forEachChild(node, collectStorySort);
  }
  collectStorySort(sourceFile);

  if (storySortFunctions.length !== 1) {
    fail(file, `must define exactly one storySort function; found ${storySortFunctions.length}.`);
  }

  const groupOrderDeclarations = [];
  function collectGroupOrder(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'groupOrder') {
      groupOrderDeclarations.push(node);
    }
    ts.forEachChild(node, collectGroupOrder);
  }
  collectGroupOrder(storySortFunctions[0]);

  if (groupOrderDeclarations.length !== 1) {
    fail(file, `storySort must define exactly one groupOrder object; found ${groupOrderDeclarations.length}.`);
  }

  const groupOrder = groupOrderDeclarations[0].initializer;
  if (!groupOrder || !ts.isObjectLiteralExpression(groupOrder)) {
    fail(file, 'storySort groupOrder must be an object literal.');
  }

  const rootProperties = groupOrder.properties.filter(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === '',
  );
  if (rootProperties.length !== 1) {
    fail(file, `storySort groupOrder must define exactly one root entry; found ${rootProperties.length}.`);
  }

  const rootOrder = rootProperties[0].initializer;
  if (!ts.isArrayLiteralExpression(rootOrder)) {
    fail(file, 'storySort groupOrder root entry must be an array literal.');
  }

  return rootOrder.elements.map((element, index) => {
    const value = stringLiteralValue(element);
    if (value === undefined) fail(file, `storySort root entry ${index} must be a static string literal.`);
    return value;
  });
}

export function assertStorySortRootOrder(source, expected, file = '.storybook/preview.jsx') {
  const actual = extractStorySortRootOrder(source, file);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(
      file,
      `storySort root order must be ${JSON.stringify(expected)}; found ${JSON.stringify(actual)}.`,
    );
  }
}
