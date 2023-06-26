import { SandboxStatus, SandboxLog } from "../services/sandbox/util";
import Interpreter from "../services/interpreter";
import applyPolyfills from "./polyfills";
import initSwc, { transformSync } from '@swc/wasm-web';

let swcInit = false;
let working = false;

async function importAndRunSwcOnMount() {
  await initSwc();
  swcInit = true;
  postMessage(['ready']);
}

importAndRunSwcOnMount();


function sendStatus(status: number) {
  postMessage(['status', status]);
}

function roughValueMemoryBytes(value: any) {
  const measured = new Set();
  let notMeasured = [value];
  let bytes = 0;

  while (notMeasured.length) {
    const val = notMeasured.pop();
    bytes += 8;  // Rough estimate of overhead per value.

    const type = typeof val;
    if (type === 'string' && !measured.has(val)) {
      // Assume that the native JS environment has a string table
      // and that each string is only counted once.
      bytes += val.length * 2;
      measured.add(val);
    } else if (type === 'object' && val !== null && !measured.has(val)) {
      const keys = Object.keys(val);
      const vals = Object.values(val);
      try {
        notMeasured.push(...keys, ...vals);
      } catch (_e) {
        // Arguments too long.  Use much slower concat.
        notMeasured = notMeasured.concat(keys, vals);
      }
      measured.add(val);
    }
  }
  return bytes / 1024;
}


function runCode(code: string) {
  if (working || !swcInit) {
    return;
  }
  working = true;
  try {
    sendStatus(SandboxStatus.Parsing);

    const js = transformSync(code, {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
          decorators: false,
        },
        target: 'es5',
        loose: false
      },
      module: {
        type: "es6"
      },
      minify: false,
      isModule: true
    }).code;

    sendStatus(SandboxStatus.Running);

    const logs: SandboxLog[] = [];
    const promises: Promise<any>[] = [];
    const interpreter = new Interpreter(js, applyPolyfills(logs, promises));

    interpreter.REGEXP_MODE = 2;
    interpreter.REGEXP_THREAD_TIMEOUT = 1000;

    const startedAt = Date.now();

    while (interpreter.step() && roughValueMemoryBytes(interpreter.getStateStack()) < 10000 && Date.now() - startedAt < 1000) {
      // await Promise.all(promises);
      // promises.splice(0, promises.length);
      continue;
    }

    // we reset the logs
    postMessage(['logs', logs]);
  } catch (err: any) {
    if (err.code?.startsWith('BABEL')) {
      postMessage(['error', err.message])
    }
    sendStatus(SandboxStatus.Idle);
  }
  working = false;
}

function onMessage(event: MessageEvent) {

  if (Array.isArray(event.data)) {
    switch (event.data[0]) {
      case 'run':
        runCode(event.data[1]);
        break;
    }
  }
};


addEventListener('message', onMessage);

/*
FOR BABEL
parse(code, {
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      attachComment: false,
      sourceType: 'script',
      plugins: [
        'typescript',
        'estree',
        'asyncGenerators',
        'dynamicImport',
        'exportNamespaceFrom',
        'moduleStringNames',
        'nullishCoalescingOperator',
        'logicalAssignment',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'regexpUnicodeSets',
        'topLevelAwait',
        preset
      ],
    });
*/

/*
FOR SWC

import initSwc, { parseSync } from '@swc/wasm-web';

let swcInit = false;

async function importAndRunSwcOnMount() {
  await initSwc();
  swcInit = true;
}
importAndRunSwcOnMount();

// we try to parse the code
    const ast = parseSync(code, {
      syntax: 'typescript',
      comments: false
    });
*/