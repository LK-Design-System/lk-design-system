import React from 'react';

const MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)';

/* The product parses and sanitizes markdown into React nodes; Prose owns only
   the rendered result's typography. It styles descendant block/inline elements
   through one injected, scope-classed stylesheet (the SearchField precedent for
   descendants a component does not itself create) using semantic tokens only,
   so it carries no hardcoded colors and matches the Code and Blockquote atoms
   exactly. The engine, sanitizer, and syntax highlighter stay in product code. */
const PROSE_CSS = `
.lk-prose{color:var(--color-semantic-label-neutral);font-family:var(--font-sans);line-height:var(--label1-reading-line);letter-spacing:var(--label1-spacing);word-break:keep-all;overflow-wrap:anywhere;}
.lk-prose > :first-child{margin-top:0;}
.lk-prose > :last-child{margin-bottom:0;}
.lk-prose p{margin:var(--space-4) 0;font-size:var(--label1-size);}
.lk-prose h1,.lk-prose h2,.lk-prose h3,.lk-prose h4,.lk-prose h5,.lk-prose h6{color:var(--color-semantic-label-strong);font-weight:var(--fw-extra);letter-spacing:0;margin:var(--space-8) 0 var(--space-4);line-height:1.3;}
.lk-prose h1{font-size:var(--heading1-size);}
.lk-prose h2{font-size:var(--heading2-size);}
.lk-prose h3{font-size:var(--headline1-size);}
.lk-prose h4{font-size:var(--headline2-size);}
.lk-prose h5,.lk-prose h6{font-size:var(--body1-size);font-weight:var(--fw-bold);}
.lk-prose ul,.lk-prose ol{margin:var(--space-4) 0;padding-inline-start:var(--space-5);font-size:var(--label1-size);}
.lk-prose li{margin:var(--space-2) 0;}
.lk-prose li > ul,.lk-prose li > ol{margin:var(--space-2) 0;}
.lk-prose a{color:var(--color-semantic-primary-normal);text-underline-offset:2px;}
.lk-prose strong{font-weight:var(--fw-bold);color:var(--color-semantic-label-strong);}
.lk-prose em{font-style:italic;}
.lk-prose del{text-decoration:line-through;color:var(--color-semantic-label-alternative);}
.lk-prose code{padding:2px 6px;background:var(--color-semantic-fill-strong);color:var(--color-semantic-label-normal);border-radius:var(--radius-sm);font-family:${MONO};font-size:0.9em;overflow-wrap:anywhere;}
.lk-prose pre{margin:var(--space-4) 0;padding:var(--space-4);background:var(--color-semantic-inverse-background);color:var(--color-semantic-inverse-label);border-radius:var(--radius-lg);overflow-x:auto;font-family:${MONO};font-size:var(--label2-size);line-height:1.6;}
.lk-prose pre code{padding:0;background:transparent;color:inherit;border-radius:0;font-size:1em;}
.lk-prose blockquote{margin:var(--space-4) 0;padding:var(--space-2) 0 var(--space-2) var(--space-5);border-inline-start:3px solid var(--color-semantic-primary-normal);color:var(--color-semantic-label-normal);}
.lk-prose hr{margin:var(--space-8) 0;border:0;border-top:1px solid var(--color-semantic-line-normal-normal);}
.lk-prose img{max-width:100%;height:auto;border-radius:var(--radius-md);}
.lk-prose table{width:100%;margin:var(--space-4) 0;border-collapse:collapse;font-size:var(--label2-size);}
.lk-prose th,.lk-prose td{padding:var(--space-2) var(--space-3);border:1px solid var(--color-semantic-line-normal-normal);text-align:start;}
.lk-prose th{background:var(--color-semantic-fill-normal);font-weight:var(--fw-bold);color:var(--color-semantic-label-strong);}
.lk-prose ul.contains-task-list,.lk-prose li.task-list-item{list-style:none;}
.lk-prose li.task-list-item{padding-inline-start:0;}
`;

// Layout effect so the scoped rules are present before the browser paints and
// before any consumer measures reflow; falls back to a plain effect on the
// server where layout effects warn and do nothing.
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useProseStyles() {
  useSafeLayoutEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-prose-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-prose-css';
    el.textContent = PROSE_CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — Prose
 * Typography for a block of already-rendered formatted content (markdown
 * output, article body, an assistant's rich response). The product parses and
 * sanitizes into React nodes and passes them as `children`; Prose applies the
 * design system's document type scale, spacing rhythm, and the same code and
 * quote treatment as the `Code` and `Blockquote` atoms.
 *
 * It owns the visual and accessibility contract of the OUTPUT only — heading
 * scale, list/table semantics carried by the elements, reading order = DOM
 * order, reading measure. It does not parse, sanitize, highlight, or edit; those
 * are product/transport responsibilities (see docs/PROSE_SURFACE_PROPOSAL.md).
 * Heading levels come from the content and are not renumbered, so the product
 * must emit levels that fit the surrounding document (WCAG 1.3.1).
 */
export function Prose({ children, measure = '68ch', style, className, ...rest }) {
  useProseStyles();
  const root = React.useRef(null);

  // Code blocks scroll sideways because this component says so, so reaching
  // that scroll is this component's problem too: a `pre` that overflows and
  // takes no focus is content a keyboard user cannot pan to. Applied only when
  // the block actually overflows, so the tab order does not collect stops that
  // scroll nowhere, and re-measured on resize because narrow widths are exactly
  // where it starts to matter.
  React.useEffect(() => {
    const element = root.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const update = () => {
      for (const block of element.querySelectorAll('pre')) {
        const scrolls = block.scrollWidth > block.clientWidth + 1;
        if (scrolls) block.setAttribute('tabindex', '0');
        else if (block.getAttribute('tabindex') === '0') block.removeAttribute('tabindex');
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      ref={root}
      className={className ? `lk-prose ${className}` : 'lk-prose'}
      style={{ maxWidth: measure, minWidth: 0, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
