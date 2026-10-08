import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repository = 'LK-Design-System/lk-design-system';
const label = 'lk-lds-release-linux-x64';
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export function selectReleaseRunner(runners) {
  const release = runners.filter((runner) => runner.labels.some((item) => item.name === label));
  if (release.length !== 1) throw new Error('release_environment_unavailable: require exactly one approved LDS release runner');
  const runner = release[0];
  const labels = new Set(runner.labels.map((item) => item.name.toLowerCase()));
  if (!runner.name.startsWith('lk-lds-release-server04-') || runner.status !== 'online'
      || runner.busy || !['self-hosted', 'linux', 'x64'].every((item) => labels.has(item))) {
    throw new Error('release_environment_unavailable: require the qualified server04 LDS runner online and idle; no local fallback');
  }
  return runner;
}

// Metadata preflight does not provision a guest, register a runner, or publish a package.
// Runner identity must also have been qualified by the approved server04 operator procedure.
export function dispatchPackageRelease(args, { run = gh } = {}) {
  const preflight = args[0] === '--preflight';
  const tag = args[preflight ? 1 : 0];
  if (args.length !== (preflight ? 2 : 1) || !/^lds-v\d+\.\d+\.\d+(?:-[\dA-Za-z.-]+)?$/.test(tag ?? '')) {
    throw new Error('usage: node scripts/dispatch-package-release.mjs [--preflight] <existing-lds-tag>');
  }
  run(['api', `repos/${repository}/git/ref/tags/${tag}`]);
  const commit = JSON.parse(run(['api', `repos/${repository}/commits/refs%2Ftags%2F${tag}`, '--jq', '{sha: .sha}']));
  const comparison = JSON.parse(run(['api', `repos/${repository}/compare/${commit.sha}...main`, '--jq', '{status: .status}']));
  if (!['ahead', 'identical'].includes(comparison.status)) {
    throw new Error('release_source_unavailable: the immutable tag must be an ancestor of canonical main');
  }
  const pages = JSON.parse(run(['api', 'orgs/LK-Design-System/actions/runners', '--paginate', '--slurp']));
  const runner = selectReleaseRunner(pages.flatMap((page) => page.runners));
  if (!preflight) {
    run(['workflow', 'run', 'release-packages.yml', '--repo', repository, '--ref', 'main', '-f', `release_tag=${tag}`]);
  }
  return { mode: preflight ? 'preflight' : 'dispatched', repository, tag, sourceSha: commit.sha, runner: runner.name };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    console.log(JSON.stringify(dispatchPackageRelease(process.argv.slice(2)), null, 2));
  } catch (error) {
    // gh stderr can contain account or credential data; never forward it.
    console.error(error.status !== undefined ? 'release_preflight_failed: GitHub metadata/dispatch request failed; no fallback' : error.message);
    process.exitCode = 1;
  }
}
