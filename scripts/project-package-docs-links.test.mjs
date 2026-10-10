import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Exercise only the authored link transformer in memory; never write package projections.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(path.join(root, 'scripts/project-package-docs.mjs'), 'utf8');
const parsed = ts.createSourceFile('project-package-docs.mjs', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const functions = ['posixPath', 'githubSourceUrl', 'splitHref', 'rewriteMarkdownLinks'].map(name => {
  const node = parsed.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
  assert(node, `Actual generator function missing: ${name}`); return node.getText(parsed);
});
function initializer(name) {
  for (const statement of parsed.statements) if (ts.isVariableStatement(statement)) {
    const declaration = statement.declarationList.declarations.find(node => node.name.getText(parsed) === name);
    if (declaration) return declaration.initializer.getText(parsed);
  }
  throw new Error(`Actual generator variable missing: ${name}`);
}
const mapping = Function(`return (${initializer('sharedReferenceTargets')})`)();
const repositoryUrl = Function(`return (${initializer('repositoryUrl')})`)();
const rewrite = Function('path', 'root', 'repositoryUrl', `${functions.join('\n')}\nreturn rewriteMarkdownLinks;`)(path, root, repositoryUrl);
const registry = 'docs/references/quality/TOKEN_DEPRECATION_RETENTION.json';
const projected = 'docs/policies/TOKEN_DEPRECATION_RETENTION.json';
assert.equal(mapping.get(registry), projected);
const policy = await readFile(path.join(root, 'docs/TOKEN_GOVERNANCE.md'), 'utf8');
const result = rewrite(policy, 'docs/TOKEN_GOVERNANCE.md', 'docs/policies/TOKEN_GOVERNANCE.md', mapping, 'lds-v0.4.7');
assert(result.includes('[retention contract](./TOKEN_DEPRECATION_RETENTION.json)'));
assert(!result.includes('/blob/lds-v0.4.7/' + registry));
assert.deepEqual(JSON.parse(await readFile(path.join(root, registry), 'utf8')).schemaVersion, 1);
assert.equal(path.posix.normalize(path.posix.join('docs/policies', './TOKEN_DEPRECATION_RETENTION.json')), projected);
assert.equal(rewrite('[policy](references/quality/TOKEN_DEPRECATION_RETENTION.json#retained?x=1)', 'docs/TOKEN_GOVERNANCE.md', 'docs/policies/TOKEN_GOVERNANCE.md', mapping, 'lds-v0.4.7'), '[policy](./TOKEN_DEPRECATION_RETENTION.json#retained?x=1)');
assert.equal(rewrite('[web](https://example.com/a)', 'docs/TOKEN_GOVERNANCE.md', 'docs/policies/TOKEN_GOVERNANCE.md', mapping, 'lds-v0.4.7'), '[web](https://example.com/a)');
assert.equal(rewrite('[other](OTHER.md)', 'docs/TOKEN_GOVERNANCE.md', 'docs/policies/TOKEN_GOVERNANCE.md', mapping, 'lds-v0.4.7'), '[other](https://github.com/LK-Design-System/lk-design-system/blob/lds-v0.4.7/docs/OTHER.md)');
const control = new Map(mapping); control.delete(registry);
assert(rewrite(policy, 'docs/TOKEN_GOVERNANCE.md', 'docs/policies/TOKEN_GOVERNANCE.md', control, 'lds-v0.4.7').includes('/blob/lds-v0.4.7/' + registry));
console.log('Validated Core local retention-registry link, real map, authored JSON target, suffix/external/fallback preservation and failing unmapped control; no generated file writes.');
