import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ownerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharedRoot = path.dirname(ownerRoot);
const repositories = [
  { name: 'lk-design-system', workflows: ['CI', 'Deploy Storybook to GitHub Pages'], package: 'lds-core', port: 6006 },
  { name: 'lk-design-system-robotics', workflows: ['CI', 'Release conformance gate', 'Deploy Storybook to GitHub Pages'], port: 6008 },
  { name: 'lk-design-system-3d', workflows: ['CI', 'Deploy Storybook to GitHub Pages'], package: 'lds-3d-core', port: 6007 },
  { name: 'lk-design-system-slides', workflows: ['Deploy Storybook to GitHub Pages'], package: 'lds-slides-ui', port: 6009 },
  { name: 'lk-design-system-motion', workflows: ['check'], port: 6011 },
];

// Reuse existing read-only checks. Builds and browser sweeps remain in CI.
export const quickChecks = {
  'lk-design-system': [
    ['--test', 'scripts/lds-maintenance.test.mjs'],
    ['scripts/check-token-source.mjs'],
    ['scripts/check-token-source-coverage.mjs'],
    ['scripts/check-documentation-system.mjs'],
  ],
  'lk-design-system-robotics': [
    ['scripts/check-package-docs.mjs'],
    ['scripts/check-owner-boundaries.mjs'],
    ['scripts/check-navigation-coordinates.mjs'],
  ],
  'lk-design-system-3d': [
    ['scripts/check-workflow-pins.mjs'],
    ['scripts/check-package-exports.mjs'],
    ['scripts/generate-evidence.mjs', '--check'],
  ],
  'lk-design-system-slides': [
    ['scripts/check-style-ownership.mjs'],
    ['scripts/generate-catalogue.mjs', '--check'],
    ['scripts/check-skill-shipping.mjs'],
  ],
  'lk-design-system-motion': [
    ['scripts/check-slides-types.mjs'],
    ['node_modules/typescript/bin/tsc', '--noEmit'],
  ],
};

export function evaluateWorkflowRuns(headSha, runs, required) {
  return required.map((name) => {
    const run = runs.filter((entry) => entry.name === name && entry.head_sha === headSha)
      .sort((a, b) => b.id - a.id)[0];
    const state = !run ? 'unverified' : run.status !== 'completed' ? 'pending'
      : run.conclusion === 'success' ? 'passed' : 'failed';
    return { name, state, runId: run?.id ?? null, url: run?.html_url ?? null, conclusion: run?.conclusion ?? null };
  });
}

export function evaluateConsumerFreshness(entry, current) {
  const recorded = Object.fromEntries(entry.packages.map((item) => [item.name, item.version]));
  const changes = Object.entries(recorded).filter(([name, version]) => current.packages[name] !== version)
    .map(([name, recordedVersion]) => ({ name, recordedVersion, currentVersion: current.packages[name] ?? null }));
  return {
    id: entry.id, repository: entry.repository, currentSourceCommit: current.sourceCommit,
    recordedSourceCommit: entry.sourceCommit, packages: current.packages,
    recordedStage: entry.stage, recordedDeployment: entry.deployment.status,
    packageEvidence: changes.length ? 'requires-reverification' : 'same-package-pins',
    sourceEvidence: current.sourceCommit === entry.sourceCommit ? 'same-source' : 'different-source-not-reverified',
    packageChanges: changes,
    note: 'Observed main pins do not promote workflow verification or deployment. Historical approvals are preserved.',
  };
}

export function runChecks(root, checks, { runner, budgetMs = 110000 } = {}) {
  const started = Date.now();
  const invoke = runner ?? ((args, timeout) => execFileSync(process.execPath, args, {
    cwd: root, stdio: 'inherit', windowsHide: true, timeout,
  }));
  for (const args of checks) {
    const remaining = budgetMs - (Date.now() - started);
    if (remaining <= 0) throw new Error('Quick-check time budget exhausted; no push was attempted.');
    invoke(args, remaining);
  }
}

function command(bin, args, cwd = ownerRoot) {
  return execFileSync(bin, args, { cwd, encoding: 'utf8', windowsHide: true, timeout: 30000 }).trim();
}
function api(route) {
  return JSON.parse(command('gh', ['api', route]));
}
function remoteFile(repository, commit, file) {
  const response = api(`repos/${repository}/contents/${file}?ref=${commit}`);
  return JSON.parse(Buffer.from(response.content, 'base64').toString('utf8'));
}
function installedRoot(name) {
  const root = path.join(sharedRoot, name);
  if (!existsSync(path.join(root, 'package.json'))) throw new Error(`Missing LDS checkout: ${root}`);
  return root;
}

async function collectHealth() {
  const results = [];
  for (const repo of repositories) {
    const root = installedRoot(repo.name);
    const repository = `LK-Design-System/${repo.name}`;
    const remoteHead = api(`repos/${repository}/branches/main`).commit.sha;
    // Scope the API result as well as the verdict to the observed main SHA.
    // https://docs.github.com/en/rest/actions/workflow-runs#list-workflow-runs-for-a-repository
    const runs = api(`repos/${repository}/actions/runs?branch=main&head_sha=${remoteHead}&per_page=100`).workflow_runs;
    const checks = evaluateWorkflowRuns(remoteHead, runs, repo.workflows);
    const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
    let stories = null;
    if (repo.port !== 6011) {
      try {
        const index = await (await fetch(`http://127.0.0.1:${repo.port}/index.json`, { signal: AbortSignal.timeout(5000) })).json();
        const entries = Object.values(index.entries).filter((item) => item.type === 'story');
        stories = { total: entries.length, public: entries.filter((item) => item.tags?.includes('dev')).length };
      } catch { /* A stopped local preview is not a remote CI failure. */ }
    }
    const versions = repo.package ? api(`orgs/LK-Design-System/packages/npm/${repo.package}/versions?per_page=1`) : [];
    results.push({
      repository, localHead: command('git', ['rev-parse', 'HEAD'], root), remoteHead,
      localBranch: command('git', ['branch', '--show-current'], root),
      localDirty: Boolean(command('git', ['status', '--porcelain=v1'], root)),
      sourceVersion: manifest.version, publishedPackage: repo.package ?? null,
      publishedVersion: versions[0]?.name ?? null, publishedAt: versions[0]?.created_at ?? null,
      distribution: repo.name.endsWith('robotics') ? 'paired-vendored-tgz' : manifest.private && !repo.package ? 'private-application' : 'registry',
      checks, stories,
    });
    console.log(`${repo.name}: ${checks.every((item) => item.state === 'passed') ? 'passed' : checks.map((item) => item.state).join(', ')} @ ${remoteHead.slice(0, 8)}`);
  }
  const registry = JSON.parse(readFileSync(path.join(ownerRoot, 'docs/references/adoption/LDS_CONSUMER_REGISTRY.json'), 'utf8'));
  const consumers = registry.entries.map((entry) => {
    const sourceCommit = api(`repos/${entry.repository}/branches/main`).commit.sha;
    const manifest = remoteFile(entry.repository, sourceCommit, entry.id === 'portal' ? 'package.json' : 'frontend/package.json');
    const packages = Object.fromEntries(Object.entries(manifest.dependencies ?? {})
      .filter(([name]) => name.startsWith('@lk-design-system/'))
      .map(([name, value]) => [name, value.startsWith('file:') ? value.match(/-([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.]+)?)\.tgz$/)?.[1] ?? value : value]));
    return evaluateConsumerFreshness(entry, { sourceCommit, packages });
  });
  return {
    kind: 'lds-repository-health', schemaVersion: 1, observedAt: new Date().toISOString(),
    evidenceBoundary: 'Exact remote-main workflow results and read-only package observations; no deployment or owner approval is inferred.',
    repositories: results, consumers,
  };
}

async function main() {
  const [mode, ...args] = process.argv.slice(2);
  if (mode === 'health') {
    const report = await collectHealth();
    const outputIndex = args.indexOf('--output');
    if (outputIndex >= 0) {
      if (!args[outputIndex + 1]) throw new Error('--output requires a path.');
      const output = path.resolve(args[outputIndex + 1]);
      mkdirSync(path.dirname(output), { recursive: true });
      writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
      console.log(`Report: ${output}`);
    } else console.log(JSON.stringify(report, null, 2));
    if (report.repositories.some((repo) => repo.checks.some((check) => check.state !== 'passed'))) process.exitCode = 1;
    return;
  }
  const roots = mode === 'install-hooks' || args.includes('--all')
    ? repositories.map((repo) => installedRoot(repo.name))
    : [path.resolve(args[args.indexOf('--repo') + 1] ?? process.cwd())];
  if (!['check', 'install-hooks'].includes(mode)) throw new Error('Usage: lds-maintenance.mjs health [--output FILE] | check [--all | --repo DIR] | install-hooks');
  for (const root of roots) {
    const checks = quickChecks[path.basename(root)];
    if (!checks) throw new Error(`Not an LDS checkout: ${root}`);
    if (mode === 'check') {
      const started = Date.now();
      runChecks(root, checks);
      console.log(`${path.basename(root)} quick checks passed in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
    } else {
      let current = '';
      try { current = command('git', ['config', '--get', 'core.hooksPath'], root); }
      catch (error) { if (error.status !== 1) throw error; }
      if (current && current !== '.githooks') throw new Error(`Preserve existing hooksPath ${current} in ${root}; integrate manually.`);
      const target = path.join(root, '.githooks', 'pre-push');
      const template = readFileSync(path.join(ownerRoot, '.githooks', 'pre-push'), 'utf8');
      if (existsSync(target) && readFileSync(target, 'utf8') !== template) throw new Error(`Preserve existing hook: ${target}`);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, template, { mode: 0o755 });
      chmodSync(target, 0o755);
      command('git', ['config', '--local', 'core.hooksPath', '.githooks'], root);
      console.log(`Installed existing-check pre-push hook: ${path.basename(root)}`);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
