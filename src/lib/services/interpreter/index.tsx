import acorn from './acorn';
import Interpreter from './interpreter';

declare global {
  var acorn: any;
}


global.acorn = acorn;
export default Interpreter;