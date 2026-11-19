import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import esbuild from 'esbuild';
import {focusPackageSources} from './fixtures/focus-contract/package-sources.mjs';

const root=process.cwd(),directory=await mkdtemp(path.join(tmpdir(),'lds-focus-ssr-'));
const require=createRequire(path.join(root,'package.json')),file=path.join(directory,'fixture.mjs');
let fixture;
try{
 await esbuild.build({entryPoints:['scripts/fixtures/focus-contract/harness.jsx'],outfile:file,bundle:true,format:'esm',platform:'node',jsx:'automatic',logLevel:'silent',plugins:[{name:'one-react',setup(build){build.onResolve({filter:/^react(?:-dom)?(?:\/|$)/},args=>({path:require.resolve(args.path),external:true}));}},focusPackageSources(root)]});
 fixture=await import(pathToFileURL(file));
}finally{await rm(directory,{recursive:true,force:true});}

function htmlNodes(html){
 const stack=[],nodes=[],voidTags=new Set(['input','br','hr','img','meta','link']);
 for(const match of html.matchAll(/<\/?([a-z][\w:-]*)([^>]*)>/gi)){
  if(match[0].startsWith('</')){const at=stack.findLastIndex(n=>n.tag===match[1]);if(at>=0)stack.length=at;continue;}
  const node={tag:match[1],attrs:match[2],parent:stack.at(-1)};nodes.push(node);if(!voidTags.has(node.tag)&&!match[0].endsWith('/>'))stack.push(node);
 }return nodes;
}
for(const [name,render] of fixture.fieldCases)test(`${name} renders native semantics and one direct frame owner`,()=>{
 const html=renderToStaticMarkup(React.createElement(render)),nodes=htmlNodes(html),target=nodes.filter(n=>n.attrs.includes('data-lds-focus-target=')),owners=nodes.filter(n=>n.attrs.includes('data-lds-focus-within='));
 assert.equal(target.length,1);assert.equal(target[0].tag,'input');assert.equal(owners.length,1);assert.equal(target[0].parent,owners[0]);
 assert.match(target[0].attrs,/id=|aria-label=/);if(name==='invalid'){assert.match(target[0].attrs,/aria-invalid="true"/);assert.match(html,/role="alert"/);}if(name==='readonly')assert.match(target[0].attrs,/readOnly=""/);if(name==='disabled')assert.match(target[0].attrs,/disabled=""/);
 for(const button of nodes.filter(n=>n.tag==='button'))assert.ok(!button.attrs.includes('data-lds-focus-target='),'nested actions keep their independent native focus');
});
test('standalone and segmented controls keep independent focus targets',()=>{
 const nodes=htmlNodes(renderToStaticMarkup(React.createElement(fixture.FocusContractSurface)));
 const orphan=nodes.find(n=>n.tag==='input'&&n.attrs.includes('aria-label="프레임 없는 입력"'));assert.ok(orphan);assert.ok(!orphan.parent.attrs.includes('data-lds-focus-within='));
 for(const node of nodes.filter(n=>n.tag==='textarea'||n.attrs.includes('aria-label="PIN 입력 ')))assert.ok(!node.attrs.includes('data-lds-focus-target='));
});
