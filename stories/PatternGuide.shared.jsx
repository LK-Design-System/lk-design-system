import React from 'react';
import {
  Callout,
  Link,
  Stack,
  Table,
  Tag,
} from '../src/index.js';
import { storybookManagerHref } from './ComponentGuide.logic.mjs';

const sectionHeading = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 'var(--title3-size)',
  lineHeight: 'var(--title3-line)',
};

const bodyCopy = {
  margin: 0,
  color: 'var(--color-semantic-label-normal)',
  fontSize: 'var(--body1-size)',
  lineHeight: 'var(--body1-reading-line, var(--body1-line))',
};

function BulletList({ items }) {
  return (
    <ul
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        margin: 0,
        paddingInlineStart: 'var(--space-5)',
        color: 'var(--color-semantic-label-normal)',
        fontSize: 'var(--body2-size)',
        lineHeight: 1.65,
      }}
    >
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function ComponentTags({ components }) {
  return (
    <div
      data-pattern-components
      style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}
    >
      {components.map((component) => (
        <Tag key={component.name} tone="neutral">{component.name}</Tag>
      ))}
    </div>
  );
}

function RestrictedVariants({ variants }) {
  if (!variants?.length) return null;

  return (
    <Callout
      tone="signal"
      title="제한적 Theme 변형"
      data-pattern-restricted-variants
    >
      <Stack gap="var(--space-3)">
        {variants.map((variant) => (
          <Stack key={variant.name} gap="var(--space-1)">
            <strong>{variant.name} · {variant.owner}</strong>
            <span>{variant.when}</span>
            <span>{variant.avoid}</span>
            <span>
              범위·시간·접근성 규약은 {variant.baseSignal}와 동일합니다.{' '}
              <Link
                href={storybookManagerHref(variant.storybookDocsId)}
                target="_parent"
                tone="neutral"
                underline="always"
                data-pattern-restricted-variant-link
              >
                {variant.name} 문서 열기
              </Link>
            </span>
          </Stack>
        ))}
      </Stack>
    </Callout>
  );
}

function Section({ title, level, children }) {
  const Heading = `h${level}`;
  return (
    <Stack as="section" gap="var(--space-4)">
      <Heading style={sectionHeading}>{title}</Heading>
      {children}
    </Stack>
  );
}

export function PatternOverview({ pattern }) {
  return (
    <Stack
      as="section"
      gap="var(--space-6)"
      data-pattern-overview
      data-pattern-id={pattern.id}
      data-pattern-authority={`${pattern.authority} · ${pattern.type}`}
    >
      <Callout
        tone="signal"
        title="적용 범위"
        data-pattern-applicability
      >
        <Stack gap="var(--space-2)">
          <strong>{pattern.applicability}</strong>
          <span>{pattern.primaryRule}</span>
        </Stack>
      </Callout>

      <Stack as="section" gap="var(--space-4)">
        <h2 style={sectionHeading}>선택 기준</h2>
        <div
          data-pattern-decision-count={pattern.decisions.length}
        >
          <Table
            columns={[
              { key: 'condition', label: '조건' },
              { key: 'signal', label: '주 신호' },
            ]}
            rows={pattern.decisions}
            rowHeaderKey="condition"
            tableLabel={`${pattern.title} Pattern 빠른 선택 기준`}
            role="region"
            aria-label={`${pattern.title} Pattern 빠른 선택 기준`}
            tabIndex={0}
            getRowId={(row) => row.signal}
          />
        </div>
      </Stack>

      <Stack as="section" gap="var(--space-3)">
        <h2 style={sectionHeading}>조합 대상</h2>
        <ComponentTags components={pattern.components} />
      </Stack>

      <RestrictedVariants variants={pattern.restrictedVariants} />
    </Stack>
  );
}

export function PatternGuide({ pattern, sectionLevel = 2 }) {
  const decisionRows = pattern.decisions.map((decision) => ({
    condition: decision.condition,
    signal: decision.signal,
    detail: decision.detail,
  }));

  return (
    <Stack
      as="article"
      gap="var(--space-8)"
      data-pattern-guide
      data-pattern-id={pattern.id}
    >
      <Callout
        tone="signal"
        title={`${pattern.authority} · ${pattern.type}`}
        data-pattern-applicability
      >
        <Stack gap="var(--space-2)">
          <strong>적용 범위 · {pattern.applicability}</strong>
          <span>{pattern.primaryRule}</span>
        </Stack>
      </Callout>

      <Section title="문제와 범위" level={sectionLevel}>
        <p style={bodyCopy}>{pattern.problem}</p>
      </Section>

      <Section title="선택 기준" level={sectionLevel}>
        <Table
          columns={[
            { key: 'condition', label: '조건' },
            { key: 'signal', label: '주 신호' },
            { key: 'detail', label: '적용' },
          ]}
          rows={decisionRows}
          rowHeaderKey="condition"
          tableLabel={`${pattern.title} Pattern 선택 기준`}
          role="region"
          aria-label={`${pattern.title} Pattern 선택 기준`}
          tabIndex={0}
          getRowId={(row) => row.signal}
        />
      </Section>

      <Section title="컴포넌트 조합" level={sectionLevel}>
        <ComponentTags components={pattern.components} />
        <BulletList
          items={pattern.components.map(
            (component) => `${component.name} · ${component.relationship}`,
          )}
        />
      </Section>

      {pattern.restrictedVariants?.length ? (
        <Section title="제한적 변형" level={sectionLevel}>
          <RestrictedVariants variants={pattern.restrictedVariants} />
        </Section>
      ) : null}

      <Section title="상태·실패 처리" level={sectionLevel}>
        <BulletList items={pattern.failure} />
      </Section>

      <Section title="접근성" level={sectionLevel}>
        <BulletList items={pattern.accessibility} />
      </Section>

      <Callout tone="negative" title="피해야 할 사용">
        <BulletList items={pattern.avoid} />
      </Callout>
    </Stack>
  );
}
