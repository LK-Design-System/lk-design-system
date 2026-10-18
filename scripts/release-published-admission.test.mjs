import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Execute the actual ship/env sources with private, fixed local command stubs.
// No real Git/GitHub, VM, runner, dispatcher, registry or operator config is used.
const sourceRoot = path.dirname(fileURLToPath(import.meta.url));
const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const version = '1.2.3';

const ghStub = String.raw`
const fs = require('node:fs');
const args = process.argv.slice(2), mode = process.env.SCENARIO;
const trace = text => fs.appendFileSync(process.env.RELEASE_TRACE, text + '\n');
if (args[0] === 'api' && args[1].endsWith('/versions')) {
  if (!args.includes('--paginate') || !args.includes('--slurp')) process.exit(90);
  const count = Number(fs.existsSync(process.env.REGISTRY_COUNT) ? fs.readFileSync(process.env.REGISTRY_COUNT, 'utf8') : 0) + 1;
  fs.writeFileSync(process.env.REGISTRY_COUNT, String(count));
  trace('registry:' + count);
  const response = mode.startsWith('post-') ? (count <= 3 ? 'absent-empty' : mode.slice(5)) : mode;
  if (['403', '401', 'transport'].includes(response)) {
    process.stderr.write('fixed private fixture query error\n'); process.exit(1);
  }
  if (response === 'malformed') { process.stdout.write('{'); process.exit(0); }
  if (response === 'shape') { process.stdout.write(JSON.stringify([{name: '1.2.3'}])); process.exit(0); }
  const pages = response === 'present' ? [[{name: '1.2.30'}], [{name: '1.2.3'}]]
    : response === 'absent-neighbor' ? [[{name: '1.2.30'}], [{name: '0.9.0'}]] : [[]];
  process.stdout.write(JSON.stringify(pages)); process.exit(0);
}
if (args[0] === 'run' && args[1] === 'list') { process.stdout.write('12345\n'); process.exit(0); }
if (args[0] === 'run' && args[1] === 'view') {
  const field = args[args.indexOf('--json') + 1];
  process.stdout.write(field === 'status' ? 'completed\n' : field === 'conclusion' ? 'success\n' : 'fixed local jobs\n');
  process.exit(0);
}
trace('unexpected-gh'); process.exit(91);
`;

async function runFixture(scenario) {
  const directory = await mkdtemp(path.join(tmpdir(), 'lds-ship-admission-'));
  try {
    const release = path.join(directory, 'release'), bin = path.join(directory, 'bin');
    const checkout = path.join(directory, 'checkout'), trace = path.join(directory, 'trace');
    await Promise.all([mkdir(release), mkdir(bin), mkdir(path.join(checkout, 'scripts'), {recursive: true})]);
    for (const name of ['ship.sh', 'release-env.sh']) {
      await writeFile(path.join(release, name), await readFile(path.join(sourceRoot, 'release', name)), {flag: 'wx'});
    }
    const executable = (name, content) => writeFile(path.join(bin, name), content, {flag: 'wx', mode: 0o700});
    await executable('node', `#!/bin/bash\nif [[ "$SCENARIO" == parser-exit-one && "$1" == -e ]]; then exit 1; fi\nexec ${quote(process.execPath)} "$@"\n`);
    await executable('gh', `#!${process.execPath}\n${ghStub}`);
    await executable('git', '#!/bin/bash\ncase "$3" in fetch|merge-base) exit 0;; rev-parse) printf "%040d\\n" 1;; *) exit 92;; esac\n');
    for (const name of ['ssh', 'npm']) {
      await executable(name, `#!/bin/bash\nprintf 'unexpected-${name}\\n' >> "$RELEASE_TRACE"\nexit 93\n`);
    }
    for (const name of ['vm-prepare.sh', 'vm-register.sh', 'vm-down.sh']) {
      const status = name === 'vm-prepare.sh' && scenario.startsWith('absent-') ? 67 : 0;
      await writeFile(path.join(release, name), `#!/bin/bash\nprintf '${name}\\n' >> "$RELEASE_TRACE"\nexit ${status}\n`, {flag: 'wx', mode: 0o700});
    }
    await writeFile(path.join(checkout, 'scripts/dispatch-package-release.mjs'),
      "import {appendFileSync} from 'node:fs'; appendFileSync(process.env.RELEASE_TRACE, 'dispatch-fixture\\n');\n", {flag: 'wx'});
    const settings = {
      LDS_RELEASE_REPO: 'LK-Design-System/lk-design-system', LDS_CHECKOUT: checkout,
      LDS_RELEASE_VM_HOST: 'server04', LDS_RELEASE_VM_ROOT: path.join(directory, 'unopened-guest'),
      LDS_RELEASE_RUNNER_NAME: 'lk-lds-release-server04-fixed-test', LDS_RELEASE_RUNNER_GROUP: 'fixed-test',
      LDS_RELEASE_RUNNER_GROUP_ID: '1', LDS_RELEASE_RUNNER_LABEL: 'lk-lds-release-linux-x64',
      LDS_RELEASE_LOG_DIR: path.join(directory, 'logs'),
    };
    const environment = path.join(directory, 'release.env');
    await writeFile(environment, Object.entries(settings).map(([key, value]) => `${key}=${quote(value)}`).join('\n') + '\n', {flag: 'wx', mode: 0o600});
    const result = spawnSync('/bin/bash', [path.join(release, 'ship.sh'), `lds-v${version}`], {
      cwd: directory, encoding: 'utf8', timeout: 8000, maxBuffer: 1024 * 1024,
      env: {PATH: `${bin}:/usr/bin:/bin`, LANG: 'C.UTF-8',
        LDS_RELEASE_ENV: environment, SCENARIO: scenario, RELEASE_TRACE: trace,
        REGISTRY_COUNT: path.join(directory, 'registry-count')},
    });
    assert.equal(result.error, undefined, result.error?.message);
    const events = (await readFile(trace, 'utf8')).trim().split('\n');
    assert.ok(!events.some(event => event.startsWith('unexpected-')), events.join('\n'));
    return {...result, events};
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
}

for (const scenario of ['403', 'malformed']) {
  test(`${scenario} is unknown and stops actual ship before every VM/dispatch stage`, async () => {
    const result = await runFixture(scenario);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /package_availability_unknown: lds-core@1\.2\.3/);
    assert.deepEqual(result.events, ['registry:1']);
  });
}

test('parser process exit 1 is unknown and stops actual ship before every VM/dispatch stage', async () => {
  const result = await runFixture('parser-exit-one');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /package_availability_unknown: lds-core@1\.2\.3/);
  assert.deepEqual(result.events, ['registry:1']);
});

test('an exact version on a later metadata page blocks admission', async () => {
  const result = await runFixture('present');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /already_published: lds-core@1\.2\.3/);
  assert.deepEqual(result.events, ['registry:1']);
});

test('only confirmed exact-version absence reaches the owned preparation stub', async () => {
  const result = await runFixture('absent-neighbor');
  assert.equal(result.status, 67);
  assert.deepEqual(result.events, ['registry:1', 'registry:2', 'registry:3', 'vm-prepare.sh']);
});

for (const scenario of ['403']) {
  test(`postpublish ${scenario} remains unknown after owned stub cleanup`, async () => {
    const result = await runFixture(`post-${scenario}`);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /publish_visibility_unknown: lds-core@1\.2\.3/);
    assert.doesNotMatch(result.stderr, /publish_not_visible/);
    assert.equal(result.events.filter(event => event === 'dispatch-fixture').length, 1);
    assert.equal(result.events.filter(event => event === 'vm-down.sh').length, 1);
    assert.doesNotMatch(result.stdout, /shipped lds-/);
  });
}
