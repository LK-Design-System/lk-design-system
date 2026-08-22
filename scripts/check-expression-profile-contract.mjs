import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contractPath = 'docs/references/architecture/EXPRESSION_PROFILE_CONTRACT.json';
const packagePath = 'packages/theme/package.json';
const packagedContractPath = 'packages/theme/docs/profile-contract.json';
const sourcePath = 'components/selection/LdsProvider.jsx';
const declarationPath = 'components/selection/LdsProvider.d.ts';
const stylePath = 'tokens/profiles.css';
const packagedStylePath = 'packages/theme/tokens/profiles.css';
const stylesEntryPath = 'packages/theme/styles.css';
const storybookPreviewPath = '.storybook/preview.jsx';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const contract = JSON.parse(await readFile(path.join(root, contractPath), 'utf8'));
const packageManifest = JSON.parse(await readFile(path.join(root, packagePath), 'utf8'));
const packagedContract = JSON.parse(await readFile(path.join(root, packagedContractPath), 'utf8'));
const provider = await readFile(path.join(root, sourcePath), 'utf8');
const declaration = await readFile(path.join(root, declarationPath), 'utf8');
const profileCss = await readFile(path.join(root, stylePath), 'utf8');
const packagedProfileCss = await readFile(path.join(root, packagedStylePath), 'utf8');
const stylesEntry = await readFile(path.join(root, stylesEntryPath), 'utf8');
const storybookPreview = await readFile(path.join(root, storybookPreviewPath), 'utf8');
const declaredOverrides = [...new Set([...profileCss.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map((match) => match[1]))].sort();

assert(contract.schemaVersion === 1, `${contractPath} must use schemaVersion 1.`);
assert(contract.status === 'active' && contract.authority === 'live', `${contractPath} must be the active live contract.`);
assert(contract.ownerLayer === 'theme' && contract.package === packageManifest.name, `${contractPath} must describe the Theme package.`);
assert(JSON.stringify(contract.values) === JSON.stringify(['default', 'ops']), `${contractPath} values must be default and ops in that order.`);
assert(contract.default === 'default', `${contractPath} default must be default.`);
assert(packageManifest.lds?.profileContract === './docs/profile-contract.json', `${packagePath} must point to its packaged profile contract.`);
assert(JSON.stringify(packagedContract) === JSON.stringify(contract), `${packagedContractPath} must match ${contractPath}.`);
assert(packagedProfileCss === profileCss, `${packagedStylePath} must match ${stylePath}.`);
assert(packageManifest.lds?.profiles?.join('|') === contract.values.join('|'), `${packagePath} profile metadata must match ${contractPath}.`);
assert(provider.includes("const PROFILES = new Set(['default', 'ops']);"), `${sourcePath} must validate the profile axis.`);
assert(provider.includes("data-lds-profile"), `${sourcePath} must project data-lds-profile.`);
assert(declaration.includes("export type LdsProfile = 'default' | 'ops';"), `${declarationPath} must expose LdsProfile.`);
assert(profileCss.includes("[data-lds-profile='ops']"), `${stylePath} must define the ops profile selector.`);
assert(stylesEntry.includes('@import "./tokens/profiles.css";'), `${stylesEntryPath} must import ${stylePath}.`);
assert(storybookPreview.includes('export const globalTypes = {'), `${storybookPreviewPath} must expose a profile toolbar.`);
assert(storybookPreview.includes("value: 'ops'"), `${storybookPreviewPath} must expose the ops profile option.`);
assert(storybookPreview.includes('data-lds-profile={profile}'), `${storybookPreviewPath} must project the selected profile in the Canvas wrapper.`);
assert(JSON.stringify(declaredOverrides) === JSON.stringify([...contract.allowedOverrides].sort()), `${stylePath} overrides must match the profile whitelist.`);
assert(declaredOverrides.every((name) => !name.startsWith('--color-') && !name.includes('status')), `${stylePath} must not override color or status semantics.`);
await access(path.join(root, stylePath));

console.log(`Validated expression profile contract: ${contract.values.join(', ')} with ${contract.matrix.length} theme/profile matrix entries.`);
