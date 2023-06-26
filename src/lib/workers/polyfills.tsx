import Interpreter from "../services/interpreter";

// , 'clear'
// , 'time', 'timeEnd', 'assert'
const logMethods = ['log', 'debug', 'info', 'warn', 'error', 'table'];

const timers = new Map();
const counts = new Map();

export default function applyPolyfills(logs: any[], promises: Promise<any>[]) {
  timers.clear();
  counts.clear();

  return function (interpreter: Interpreter, globalObject: any) {

    createConsole(logs, interpreter, globalObject);
  }
}

function createConsole(logs: any[], interpreter: Interpreter, globalObject: any) {
  var console = interpreter.nativeToPseudo({});
  interpreter.setProperty(globalObject, 'console', console);

  logMethods.forEach((i) => {
    interpreter.setProperty(console, i, interpreter.createNativeFunction(function (...args: string[]) {
      logs.push({
        method: i,
        data: args
      })
    }, false));

    interpreter.setProperty(console, 'time', interpreter.createNativeFunction(function (name: string = 'default') {
      timers.set(name, Date.now());
    }, false));

    interpreter.setProperty(console, 'timeEnd', interpreter.createNativeFunction(function (name: string = 'default') {
      if (timers.has(name)) {
        logs.push({
          method: 'timeEnd',
          data: [`${name}: ${Date.now() - timers.get(name)} ms`]
        });
        timers.delete(name);
      } else {
        logs.push({
          method: 'warn',
          data: [`Timer '${name}' does not exist`]
        });
      }
    }, false));

    interpreter.setProperty(console, 'assert', interpreter.createNativeFunction(function (assertion: boolean, message: string) {
      if (!assertion) {
        logs.push({
          method: 'warn',
          data: [`Assertion failed: ${message}`]
        });
      }
    }, false));

    interpreter.setProperty(console, 'clear', interpreter.createNativeFunction(function () {
      logs.splice(0, logs.length);
    }, false));

    interpreter.setProperty(console, 'count', interpreter.createNativeFunction(function (name: string = 'default') {
      const c = (counts.get(name) ?? 0) + 1;

      logs.push({
        method: 'count',
        data: [`${name}: ${c}`]
      });

      counts.set(name, c);
    }, false));

    const notImplemented = (name: string) => {
      return interpreter.createNativeFunction(function () {
        logs.push({
          method: 'warn',
          data: [`console.${name}() not implemented yet.`]
        })
      }, false);
    }

    interpreter.setProperty(console, 'group', notImplemented('group'));
    interpreter.setProperty(console, 'groupCollapsed', notImplemented('groupCollapsed'));
    interpreter.setProperty(console, 'groupEnd', notImplemented('groupEnd'));
    interpreter.setProperty(console, 'trace', notImplemented('trace'));
  });
}

// NOT WORKING
function createFetch(interpreter: Interpreter, globalObject: any, promises: Promise<any>[]) {
  interpreter.setProperty(globalObject, 'fetch', interpreter.createAsyncFunction(function (url: string, options: RequestInit) {
    const p = fetch(url, options);
    promises.push(p);
    return p;
  }));
}