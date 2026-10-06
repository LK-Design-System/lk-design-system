import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateWorkflowRuns, evaluateConsumerFreshness, runChecks } from './lds-maintenance.mjs';

test('CI must belong to the current main SHA; an older green run cannot hide a failure', () => {
  const runs = [
    { id: 1, name: 'CI', head_sha: 'old', status: 'completed', conclusion: 'success' },
    { id: 2, name: 'CI', head_sha: 'current', status: 'completed', conclusion: 'failure' },
  ];
  assert.equal(evaluateWorkflowRuns('current', runs, ['CI'])[0].state, 'failed');
  assert.equal(evaluateWorkflowRuns('other', runs, ['CI'])[0].state, 'unverified');
});

test('a rerun supersedes the failed attempt and queued checks remain pending', () => {
  const runs = [
    { id: 2, name: 'CI', head_sha: 'current', status: 'completed', conclusion: 'failure' },
    { id: 3, name: 'CI', head_sha: 'current', status: 'completed', conclusion: 'success' },
    { id: 4, name: 'Pages', head_sha: 'current', status: 'in_progress' },
  ];
  assert.deepEqual(evaluateWorkflowRuns('current', runs, ['CI', 'Pages']).map((item) => item.state), ['passed', 'pending']);
});

test('new product pins do not inherit historical workflow or deployment approval', () => {
  const entry = { id: 'portal', repository: 'portal', sourceCommit: 'old', stage: 'workflow-verified',
    deployment: { status: 'not-attested' }, packages: [{ name: 'core', version: '0.1.0' }] };
  const result = evaluateConsumerFreshness(entry, { sourceCommit: 'new', packages: { core: '0.2.9' } });
  assert.equal(result.packageEvidence, 'requires-reverification');
  assert.equal(result.sourceEvidence, 'different-source-not-reverified');
  assert.equal(result.recordedDeployment, 'not-attested');
  assert.equal(entry.sourceCommit, 'old');
});

test('quick checks stop immediately on a failure', () => {
  const calls = [];
  assert.throws(() => runChecks('.', [['first'], ['broken'], ['expensive']], {
    runner: (args) => { calls.push(args[0]); if (args[0] === 'broken') throw new Error('fixture failed'); },
  }), /fixture failed/);
  assert.deepEqual(calls, ['first', 'broken']);
});

test('an exhausted time budget blocks execution', () => {
  assert.throws(() => runChecks('.', [['first']], { budgetMs: 0, runner: () => assert.fail('must not run') }), /budget exhausted/);
});
