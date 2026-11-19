import path from 'node:path';
export function focusPackageSources(root){return {name:'focus-package-sources',setup(build){build.onResolve({filter:/^@lk-design-system\/lds-(core|theme|product)$/},args=>({path:path.join(root,'packages',args.path.split('-').at(-1),'src/index.js')}));}};}
