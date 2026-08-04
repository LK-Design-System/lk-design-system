import { createHash } from 'node:crypto';

export const contractVersion = '2026-08-04';

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stableValue(entry)]),
    );
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

export function sourcePayload(copySet) {
  return {
    id: copySet.id,
    surface: copySet.surface,
    audience: copySet.audience,
    task: copySet.task,
    policyTags: copySet.policyTags,
    items: copySet.items,
    protected: copySet.protected,
  };
}

export function hashPayload(value) {
  return `sha256:${createHash('sha256').update(stableStringify(value), 'utf8').digest('hex')}`;
}

export function sourceHash(copySet) {
  return hashPayload(sourcePayload(copySet));
}

export function candidateCopySet(copySet) {
  const decisions = new Map((copySet.review?.decisions || []).map((decision) => [decision.key, decision]));
  return {
    ...copySet,
    items: copySet.items.map((item) => {
      const decision = decisions.get(item.key);
      return decision?.verdict === 'REVISE' ? { ...item, text: decision.text } : item;
    }),
  };
}

export function candidateHash(copySet) {
  return hashPayload(sourcePayload(candidateCopySet(copySet)));
}

function finding(code, copySet, detail) {
  return {
    code,
    copySet: copySet.id,
    detail,
    fingerprint: `${code}:${copySet.id}:${detail}`,
  };
}

function occurrenceCount(text, needle) {
  if (!needle) return 0;
  return text.split(needle).length - 1;
}

function expectedVerdict(review) {
  if (review.semanticDelta !== 'NONE' || review.decisions.some(({ verdict }) => verdict === 'BLOCKED')) {
    return 'BLOCKED';
  }
  return review.decisions.some(({ verdict }) => verdict === 'REVISE') ? 'REVISE' : 'KEEP';
}

export function verifyCopyCatalog(catalog) {
  const findings = [];
  const ids = new Set();

  for (const copySet of catalog.copySets || []) {
    if (ids.has(copySet.id)) findings.push(finding('COPY_SET_ID', copySet, 'duplicate copy-set id'));
    ids.add(copySet.id);

    const keys = copySet.items.map(({ key }) => key);
    if (new Set(keys).size !== keys.length) {
      findings.push(finding('COPY_ITEM_KEY', copySet, 'item keys must be unique'));
    }

    const computedSourceHash = sourceHash(copySet);
    if (copySet.sourceHash !== computedSourceHash) {
      findings.push(finding('COPY_SOURCE_HASH', copySet, `expected ${computedSourceHash}`));
    }

    const review = copySet.review;
    if (!review) continue;
    if (review.sourceHash !== copySet.sourceHash) {
      findings.push(finding('COPY_REVIEW_HASH', copySet, 'review sourceHash differs from copy set'));
    }

    const decisionKeys = review.decisions.map(({ key }) => key);
    if (JSON.stringify(decisionKeys) !== JSON.stringify(keys)) {
      findings.push(finding('COPY_DECISION_COVERAGE', copySet, 'decisions must cover item keys once in source order'));
    }

    const computedCandidateHash = candidateHash(copySet);
    if (review.candidateHash !== computedCandidateHash) {
      findings.push(finding('COPY_CANDIDATE_HASH', copySet, `expected ${computedCandidateHash}`));
    }

    const verdict = expectedVerdict(review);
    if (review.verdict !== verdict) {
      findings.push(finding('COPY_VERDICT', copySet, `expected ${verdict}`));
    }
    if (review.verdict === 'BLOCKED' && review.questions.length === 0) {
      findings.push(finding('COPY_BLOCKED_QUESTION', copySet, 'BLOCKED review requires a question'));
    }

    const sourceText = copySet.items.map(({ text }) => text).join('\n');
    const candidateText = candidateCopySet(copySet).items.map(({ text }) => text).join('\n');
    for (const [category, values] of Object.entries(copySet.protected.machine)) {
      for (const value of values) {
        if (occurrenceCount(sourceText, value) !== occurrenceCount(candidateText, value)) {
          const code = category === 'placeholders' ? 'COPY_PLACEHOLDER' : 'COPY_FACT';
          findings.push(finding(code, copySet, `${category}:${value}`));
        }
      }
    }

    const approvalRoles = new Set();
    for (const approval of copySet.approvals || []) {
      if (approvalRoles.has(approval.role)) {
        findings.push(finding('COPY_APPROVAL_ROLE', copySet, `duplicate approval role ${approval.role}`));
      }
      approvalRoles.add(approval.role);
      if (
        approval.sourceHash !== copySet.sourceHash
        || approval.candidateHash !== review.candidateHash
        || approval.rulesetVersion !== catalog.rulesetVersion
      ) {
        findings.push(finding('COPY_APPROVAL_BINDING', copySet, `stale approval ${approval.role}`));
      }
    }
  }

  return findings.sort(
    (left, right) => left.code.localeCompare(right.code)
      || left.copySet.localeCompare(right.copySet)
      || left.detail.localeCompare(right.detail),
  );
}

export function hydrateFixtureCatalog(input) {
  const catalog = structuredClone(input);
  for (const copySet of catalog.copySets || []) {
    if (copySet.sourceHash === 'AUTO') copySet.sourceHash = sourceHash(copySet);
    if (copySet.review?.sourceHash === 'AUTO') copySet.review.sourceHash = copySet.sourceHash;
    if (copySet.review?.candidateHash === 'AUTO') copySet.review.candidateHash = candidateHash(copySet);
    for (const approval of copySet.approvals || []) {
      if (approval.sourceHash === 'AUTO') approval.sourceHash = copySet.sourceHash;
      if (approval.candidateHash === 'AUTO') approval.candidateHash = copySet.review.candidateHash;
    }
  }
  return catalog;
}
