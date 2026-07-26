import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const figPath = 'docs/references/wds/Wanted Design System (Community).fig';
const queuePath = 'docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json';
const outputPath = 'docs/references/wds/FIGMA_LOCAL_CONTENT_AUDIT.json';

const TARGET_NODE_IDS = new Set([
  '395:1958',
  '1173:12995',
  '1174:12996',
  '3242:22217',
  '15625:32983',
  '15625:52196',
  '15625:54522',
  '15625:57936',
  '16222:137703',
  '16222:137704',
  '16222:137705',
  '16248:4248410',
  '16248:4248411',
  '16248:4248412',
  '16248:4248413',
  '16250:11954',
  '16257:145131',
  '16257:145132',
  '16257:145133',
  '16355:159654',
  '16486:130929',
  '16215:43042',
  '16215:35516',
  '16215:30100',
  '16215:25192',
  '16215:24867',
  '16215:20255',
  '16215:19283',
  '16215:17599'
]);

function readUInt16(buffer, offset) {
  return buffer.readUInt16LE(offset);
}

function readUInt32(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function findEndOfCentralDirectory(buffer) {
  const signature = 0x06054b50;
  const minOffset = Math.max(0, buffer.length - 0xffff - 22);
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (readUInt32(buffer, offset) === signature) return offset;
  }
  throw new Error('Could not find ZIP end of central directory');
}

function readZipEntries(buffer) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const entryCount = readUInt16(buffer, eocdOffset + 10);
  const centralDirectoryOffset = readUInt32(buffer, eocdOffset + 16);
  const entries = new Map();
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (readUInt32(buffer, offset) !== 0x02014b50) {
      throw new Error(`Invalid ZIP central directory entry at ${offset}`);
    }

    const method = readUInt16(buffer, offset + 10);
    const compressedSize = readUInt32(buffer, offset + 20);
    const uncompressedSize = readUInt32(buffer, offset + 24);
    const fileNameLength = readUInt16(buffer, offset + 28);
    const extraLength = readUInt16(buffer, offset + 30);
    const commentLength = readUInt16(buffer, offset + 32);
    const localHeaderOffset = readUInt32(buffer, offset + 42);
    const fileName = buffer
      .subarray(offset + 46, offset + 46 + fileNameLength)
      .toString('utf8');

    entries.set(fileName, {
      fileName,
      method,
      compressedSize,
      uncompressedSize,
      localHeaderOffset
    });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function readZipEntry(buffer, entries, fileName) {
  const entry = entries.get(fileName);
  if (!entry) throw new Error(`Missing ZIP entry: ${fileName}`);

  const offset = entry.localHeaderOffset;
  if (readUInt32(buffer, offset) !== 0x04034b50) {
    throw new Error(`Invalid ZIP local header for ${fileName}`);
  }

  const localFileNameLength = readUInt16(buffer, offset + 26);
  const localExtraLength = readUInt16(buffer, offset + 28);
  const dataOffset = offset + 30 + localFileNameLength + localExtraLength;
  const compressed = buffer.subarray(dataOffset, dataOffset + entry.compressedSize);

  if (entry.method === 0) return Buffer.from(compressed);
  if (entry.method === 8) return inflateRawSync(compressed);

  throw new Error(`Unsupported ZIP compression method ${entry.method} for ${fileName}`);
}

function parseFigKiwi(buffer) {
  const prelude = buffer.subarray(0, 8).toString('utf8');
  if (prelude !== 'fig-kiwi') throw new Error(`Unexpected fig-kiwi prelude: ${prelude}`);

  const version = readUInt32(buffer, 8);
  let offset = 12;
  const chunks = [];
  while (offset + 4 < buffer.length) {
    const size = readUInt32(buffer, offset);
    offset += 4;
    chunks.push(buffer.subarray(offset, offset + size));
    offset += size;
  }
  if (chunks.length < 2) throw new Error(`Expected at least 2 fig-kiwi chunks, found ${chunks.length}`);

  const schema = decodeBinarySchema(inflateRawSync(chunks[0]));
  const dataChunk = chunks[1];
  const data =
    dataChunk[0] === 0x28 && dataChunk[1] === 0xb5 && dataChunk[2] === 0x2f && dataChunk[3] === 0xfd
      ? zstdDecompressSync(dataChunk)
      : inflateRawSync(dataChunk);
  const message = compileSchema(schema).decodeMessage(data);

  return {
    header: { prelude, version, chunkCount: chunks.length, chunkSizes: chunks.map((chunk) => chunk.length) },
    message
  };
}

function guidToId(guid) {
  return guid ? `${guid.sessionID}:${guid.localID}` : undefined;
}

function round(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 100) / 100 : value;
}

function colorToHex(color) {
  if (!color) return undefined;
  const to255 = (value) => Math.max(0, Math.min(255, Math.round(value * 255)));
  return `#${[to255(color.r), to255(color.g), to255(color.b)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

function summarizePaint(paint) {
  if (!paint) return undefined;
  const type = paint.type || paint.paintType;
  if (type === 'SOLID') {
    return {
      type,
      hex: colorToHex(paint.color),
      opacity: round(paint.opacity ?? paint.color?.a ?? 1),
      visible: paint.visible !== false
    };
  }
  if (type?.startsWith?.('GRADIENT')) {
    return {
      type,
      stops: (paint.gradientStops || []).map((stop) => ({
        position: round(stop.position),
        hex: colorToHex(stop.color),
        opacity: round(stop.color?.a ?? 1)
      })),
      visible: paint.visible !== false
    };
  }
  if (type === 'IMAGE') {
    return {
      type,
      imageHash: paint.imageHash ? 'present' : undefined,
      scaleMode: paint.scaleMode,
      visible: paint.visible !== false
    };
  }
  return type ? { type, visible: paint.visible !== false } : undefined;
}

function summarizeNode(node) {
  const fillPaints = Array.isArray(node.fillPaints) ? node.fillPaints.map(summarizePaint).filter(Boolean) : undefined;
  const strokePaints = Array.isArray(node.strokePaints)
    ? node.strokePaints.map(summarizePaint).filter(Boolean)
    : undefined;

  return {
    id: guidToId(node.guid),
    name: node.name || '',
    type: node.type,
    parentId: guidToId(node.parentIndex?.guid),
    visible: node.visible,
    x: round(node.transform?.m02),
    y: round(node.transform?.m12),
    width: round(node.size?.x),
    height: round(node.size?.y),
    stackMode: node.stackMode,
    stackSpacing: round(node.stackSpacing),
    stackPadding: node.stackHorizontalPadding !== undefined || node.stackVerticalPadding !== undefined
      ? {
          horizontal: round(node.stackHorizontalPadding),
          vertical: round(node.stackVerticalPadding),
          right: round(node.stackPaddingRight),
          bottom: round(node.stackPaddingBottom)
        }
      : undefined,
    stackAlign: node.stackAlign,
    stackCounterAlign: node.stackCounterAlign,
    stackJustify: node.stackJustify,
    stackSizing: node.stackPrimarySizing || node.stackCounterSizing
      ? {
          primary: node.stackPrimarySizing,
          counter: node.stackCounterSizing
        }
      : undefined,
    cornerRadius: round(node.cornerRadius),
    strokeWeight: round(node.strokeWeight),
    fills: fillPaints?.length ? fillPaints : undefined,
    strokes: strokePaints?.length ? strokePaints : undefined,
    text: node.textData?.characters || node.characters || undefined,
    fontSize: round(node.fontSize),
    lineHeight: node.lineHeight,
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical
  };
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function collectDescendants(rootId, childrenByParent) {
  const descendants = [];
  const stack = [...(childrenByParent.get(rootId) || [])];
  while (stack.length) {
    const node = stack.shift();
    descendants.push(node);
    const children = childrenByParent.get(guidToId(node.guid));
    if (children) stack.push(...children);
  }
  return descendants;
}

function summarizeTarget(node, childrenByParent) {
  const nodeId = guidToId(node.guid);
  const directChildren = childrenByParent.get(nodeId) || [];
  const descendants = collectDescendants(nodeId, childrenByParent);
  const textNodes = descendants
    .filter((descendant) => descendant.type === 'TEXT' || descendant.textData?.characters)
    .map(summarizeNode);
  const symbols = descendants
    .filter((descendant) => descendant.type === 'SYMBOL')
    .map(summarizeNode);
  const instances = descendants
    .filter((descendant) => descendant.type === 'INSTANCE')
    .map(summarizeNode);
  const visualSamples = descendants
    .filter((descendant) =>
      descendant.cornerRadius !== undefined ||
      descendant.stackMode ||
      descendant.stackSpacing !== undefined ||
      (Array.isArray(descendant.fillPaints) && descendant.fillPaints.length > 0) ||
      (Array.isArray(descendant.strokePaints) && descendant.strokePaints.length > 0)
    )
    .slice(0, 200)
    .map(summarizeNode);

  const sectionLabels = directChildren.map((child) => {
    const childId = guidToId(child.guid);
    const text = collectDescendants(childId, childrenByParent)
      .filter((descendant) => descendant.type === 'TEXT' || descendant.textData?.characters)
      .map((descendant) => descendant.textData?.characters || descendant.characters)
      .find(Boolean);
    return {
      ...summarizeNode(child),
      label: text
    };
  });

  return {
    node: summarizeNode(node),
    totals: {
      directChildren: directChildren.length,
      descendants: descendants.length,
      textNodes: textNodes.length,
      symbols: symbols.length,
      instances: instances.length
    },
    directChildren: sectionLabels,
    textNodes: textNodes.slice(0, 500),
    uniqueText: uniqueBy(
      textNodes
        .map((textNode) => textNode.text)
        .filter(Boolean)
        .map((text) => text.trim())
        .filter(Boolean),
      (text) => text
    ).slice(0, 500),
    variantSymbols: symbols
      .filter((symbol) => symbol.name.includes('=') || symbol.name.includes('/'))
      .slice(0, 500),
    instanceNames: uniqueBy(
      instances.map((instance) => ({
        name: instance.name,
        width: instance.width,
        height: instance.height
      })),
      (instance) => `${instance.name}|${instance.width}|${instance.height}`
    ).slice(0, 300),
    visualSamples
  };
}

function parseVariantAxes(items) {
  const axes = new Map();

  for (const item of items) {
    const name = item.name || '';
    for (const part of name.split(',')) {
      const [rawKey, ...rawValue] = part.split('=');
      if (!rawKey || rawValue.length === 0) continue;

      const key = rawKey.trim();
      const value = rawValue.join('=').trim();
      if (!key || !value) continue;

      if (!axes.has(key)) axes.set(key, new Set());
      axes.get(key).add(value);
    }
  }

  return [...axes.entries()]
    .map(([name, values]) => ({ name, values: [...values].sort() }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function summarizeComponentSection(node, childrenByParent) {
  const summary = summarizeTarget(node, childrenByParent);
  const variantItems = [
    ...summary.variantSymbols,
    ...summary.instanceNames.map((instance) => ({ name: instance.name }))
  ];

  return {
    ...summary,
    variantAxes: parseVariantAxes(variantItems),
    representativeSizes: uniqueBy(
      [
        ...summary.variantSymbols,
        ...summary.instanceNames
      ]
        .filter((item) => item.width !== undefined && item.height !== undefined)
        .map((item) => ({
          name: item.name,
          width: item.width,
          height: item.height
        })),
      (item) => `${item.name}|${item.width}|${item.height}`
    ).slice(0, 200)
  };
}

function findNodeLabel(node, childrenByParent) {
  const nodeId = guidToId(node.guid);
  return collectDescendants(nodeId, childrenByParent)
    .filter((descendant) => descendant.type === 'TEXT' || descendant.textData?.characters)
    .map((descendant) => descendant.textData?.characters || descendant.characters)
    .find(Boolean);
}

function summarizeIndexNode(node, childrenByParent) {
  const nodeId = guidToId(node.guid);
  const descendants = collectDescendants(nodeId, childrenByParent);
  return {
    ...summarizeNode(node),
    label: findNodeLabel(node, childrenByParent),
    totals: {
      directChildren: (childrenByParent.get(nodeId) || []).length,
      descendants: descendants.length,
      textNodes: descendants.filter((descendant) => descendant.type === 'TEXT' || descendant.textData?.characters).length,
      symbols: descendants.filter((descendant) => descendant.type === 'SYMBOL').length,
      instances: descendants.filter((descendant) => descendant.type === 'INSTANCE').length
    }
  };
}

const figBuffer = readFileSync(figPath);
const entries = readZipEntries(figBuffer);
const meta = JSON.parse(readZipEntry(figBuffer, entries, 'meta.json').toString('utf8'));
const canvas = readZipEntry(figBuffer, entries, 'canvas.fig');
const { header, message } = parseFigKiwi(canvas);
const nodeChanges = message.nodeChanges || [];
const byId = new Map(nodeChanges.map((node) => [guidToId(node.guid), node]));
const childrenByParent = new Map();
for (const node of nodeChanges) {
  const parentId = guidToId(node.parentIndex?.guid);
  if (!parentId) continue;
  if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
  childrenByParent.get(parentId).push(node);
}

const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
const queuedIds = new Set((queue.queue || []).map((row) => row.figmaNodeId));
for (const target of TARGET_NODE_IDS) queuedIds.add(target);

const targetSummaries = [...queuedIds]
  .map((nodeId) => byId.get(nodeId))
  .filter(Boolean)
  .map((node) => summarizeTarget(node, childrenByParent));

const componentSectionIds = new Set();
for (const nodeId of queuedIds) {
  const directChildren = childrenByParent.get(nodeId) || [];
  for (const child of directChildren) {
    if (child.type !== 'SECTION') continue;
    componentSectionIds.add(guidToId(child.guid));
  }
}

const componentSections = [...componentSectionIds]
  .map((nodeId) => byId.get(nodeId))
  .filter(Boolean)
  .map((node) => summarizeComponentSection(node, childrenByParent))
  .sort((a, b) => {
    const parentCompare = (a.node.parentId || '').localeCompare(b.node.parentId || '');
    if (parentCompare !== 0) return parentCompare;
    return (a.node.y ?? 0) - (b.node.y ?? 0) || (a.node.x ?? 0) - (b.node.x ?? 0);
  });

const pageNodes = nodeChanges.filter((node) => node.type === 'CANVAS' && guidToId(node.parentIndex?.guid) === '0:0');
const pages = pageNodes.map((node) => summarizeNode(node));
const pageSectionIndex = pageNodes.map((pageNode) => {
  const pageId = guidToId(pageNode.guid);
  const directChildren = childrenByParent.get(pageId) || [];
  return {
    page: summarizeNode(pageNode),
    directChildren: directChildren.map((child) => summarizeIndexNode(child, childrenByParent))
  };
});

const output = {
  source: {
    name: meta.file_name,
    localFigPath: figPath,
    exportedAt: meta.exported_at,
    extractionMethod: 'Local .fig ZIP parse: fig-kiwi schema + zstd message decode',
    note:
      'This records source content from the checked-in WDS .fig export. It does not prove that a newer live Figma URL is unchanged.'
  },
  generatedAt: new Date().toISOString(),
  decode: {
    header,
    nodeChangeCount: nodeChanges.length,
    blobCount: message.blobs?.length || 0
  },
  pages,
  pageSectionIndex,
  targets: targetSummaries,
  componentSections
};

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
console.log(
  `Decoded ${nodeChanges.length} node changes, ${message.blobs?.length || 0} blobs, ${targetSummaries.length} target summaries, ${componentSections.length} component section summaries.`
);
