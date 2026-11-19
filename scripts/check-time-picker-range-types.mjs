import ts from 'typescript';
import path from 'node:path';
let failed = false;
for (const configName of ['tsconfig.consumer-react18.json','tsconfig.consumer-react19.json']) {
  const config=ts.readConfigFile(configName,ts.sys.readFile);
  config.config.include=['scripts/type-tests/time-picker-ranges-contract.tsx'];
  const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,process.cwd());
  const program=ts.createProgram(parsed.fileNames,parsed.options);
  const diagnostics=ts.getPreEmitDiagnostics(program);
  if(diagnostics.length){failed=true;console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:file=>file,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));}
  else console.log(path.basename(configName)+': TimePicker range contract PASS');
}
if(failed)process.exitCode=1;
