// Temporary native-browser QA; no browser automation, storage, or dependencies.
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import esbuild from 'esbuild';
import {focusPackageSources} from './fixtures/focus-contract/package-sources.mjs';
const root=process.cwd(),directory=process.argv[2];
if(!directory)throw new Error('Pass the task temporary directory containing focus-before.css.');
await mkdir(directory,{recursive:true});
await esbuild.build({entryPoints:['scripts/fixtures/focus-contract/harness.jsx'],outfile:path.join(directory,'harness.js'),bundle:true,format:'esm',platform:'browser',jsx:'automatic',plugins:[focusPackageSources(root)],logOverride:{'ignored-bare-import':'silent'}});
const baseStyles=['packages/core/tokens/spacing.css','packages/core/tokens/grid.css','packages/core/tokens/components.css','packages/core/tokens/base.css','packages/theme/styles.css','packages/product/styles.css'];
const uiCss=`body{margin:0;background:var(--color-semantic-background-normal-normal);color:var(--color-semantic-label-normal);font-family:var(--font-sans)}main{max-width:960px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between}h1{font-size:22px}h2{font-size:13px;margin:0 0 12px;color:var(--color-semantic-label-neutral)}section{padding:18px;border:1px solid var(--color-semantic-line-solid-normal);border-radius:12px;margin:12px 0;min-width:0}.focus-cases{display:grid;grid-template-columns:1fr 1fr;gap:12px}.focus-cases section{margin:0}.focus-inset{--lds-focus-outline-offset:-2px}.focus-alternative{--lds-focus-outline:3px solid var(--color-semantic-focus-indicator);--lds-focus-outline-offset:0px}@media(max-width:760px){main{padding:16px}.focus-cases{grid-template-columns:1fr}}`;
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1');res.setHeader('cache-control','no-store');
 if(url.pathname==='/narrow'){res.setHeader('content-type','text/html; charset=utf-8');res.end('<!doctype html><html><body style="margin:16px"><iframe title="390px 포커스" src="/" style="width:390px;height:1400px;border:0"></iframe></body></html>');return;}
 if(url.pathname==='/'){res.setHeader('content-type','text/html; charset=utf-8');res.end(`<!doctype html><html lang="ko"><head><meta name="viewport" content="width=device-width,initial-scale=1">${baseStyles.map(file=>`<link rel="stylesheet" href="/${file}">`).join('')}<link rel="stylesheet" href="/focus.css${url.searchParams.has('before')?'?before=1':''}"><style>${uiCss}</style></head><body><div id="focus-root"></div><script type="module" src="/harness.js"></script></body></html>`);return;}
 const file=url.pathname==='/harness.js'?path.join(directory,'harness.js'):url.pathname==='/focus.css'?url.searchParams.has('before')?path.join(directory,'focus-before.css'):path.join(root,'tokens/focus.css'):path.resolve(root,'.'+url.pathname);
 if(!file.startsWith(root+path.sep)&&!file.startsWith(directory+path.sep)){res.writeHead(403);res.end();return;}
 res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.writeHead(404);res.end();}});
server.listen(Number(process.argv[3])||0,'127.0.0.1',()=>console.log(JSON.stringify({origin:`http://127.0.0.1:${server.address().port}`,directory})));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
