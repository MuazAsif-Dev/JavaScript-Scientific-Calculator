import {variables} from './constants.js'

const TokenTypes = {
  NUMBER: 'NUMBER',
  IDENTIFIER: 'IDENTIFIER',
  ADDITION: '+',
  SUBTRACTION: '-',
  MULTIPLICATION: '*',
  DIVISION: '/',
  EXPONENTIATION: '^',
  PARENTHESIS_LEFT: '(',
  PARENTHESIS_RIGHT: ')',
};

const TokenSpec = [
  [/^\s+/, null],
  [/^(?:\d+(?:\.\d*)?|\.\d+)/, TokenTypes.NUMBER],
  [/^[a-z]+/, TokenTypes.IDENTIFIER],
  [/^\+/, TokenTypes.ADDITION],
  [/^\-/, TokenTypes.SUBTRACTION],
  [/^\*/, TokenTypes.MULTIPLICATION],
  [/^\//, TokenTypes.DIVISION],
  [/^\^/, TokenTypes.EXPONENTIATION],
  [/^\(/, TokenTypes.PARENTHESIS_LEFT],
  [/^\)/, TokenTypes.PARENTHESIS_RIGHT],
];

class Tokenizer {
  constructor(input) {
    this.input = input;
    this.cursor = 0;
  }

  hasMoreTokens() {
    return this.cursor < this.input.length;
  }

  match(regex, inputSlice) {
    const matched = regex.exec(inputSlice);
    if (matched === null) {
      return null;
    }

    this.cursor += matched[0].length;
    return matched[0];
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const inputSlice = this.input.slice(this.cursor);

    for (let [regex, type] of TokenSpec) {
      const tokenValue = this.match(regex, inputSlice);

      if (tokenValue === null) {
        continue;
      }

      if (type === null) {
        return this.getNextToken();
      }

      return {
        type,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: "${inputSlice[0]}"`);
  }
}

const operators = {
  u: {
    prec: 4,
    assoc: 'right',
  },
  '^': {
    prec: 4,
    assoc: 'right',
  },
  '*': {
    prec: 3,
    assoc: 'left',
  },
  '/': {
    prec: 3,
    assoc: 'left',
  },
  '+': {
    prec: 2,
    assoc: 'left',
  },
  '-': {
    prec: 2,
    assoc: 'left',
  },
};

const functionList = ['sqrt', 'sin', 'cos', 'tan'];

const assert = (predicate) => {
  if (predicate) return;
  throw new Error('Assertion failed due to invalid token');
};

const isFunction = (token) => {
  return functionList.includes(token.toLowerCase());
};

const evaluate = (input) => {
  const opSymbols = Object.keys(operators);
  const stack = [];
  let output = [];

  const peek = () => {
    return stack.at(-1);
  };

  const addToOutput = (token) => {
    output.push(token);
  };

  const handlePop = () => {
    const op = stack.pop();

    if (op === '(') return;

    if (op === 'u') return -parseFloat(output.pop());

    if (isFunction(op)) {
      
      const poppedValue = output.pop();
      switch (op) {
        case 'sqrt':
          if (poppedValue < 0){
            throw new Error('Complex Number');
          }  
          return Math.sqrt(poppedValue);
        case 'sin':
          return Math.sin(poppedValue  * (Math.PI / 180));
        case 'cos':
          return Math.cos(poppedValue  * (Math.PI / 180));
        case 'tan':
          if (poppedValue % 90 == 0){
            throw new Error('Infinity');
          }  
          return Math.tan(poppedValue  * (Math.PI / 180));
      }
    }

    const right = parseFloat(output.pop());
    const left = parseFloat(output.pop());

    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right == 0){
          throw new Error('Division by zero');
        }
        return left / right;
      case '^':
        return left ** right;
      default:
        throw new Error(`Invalid operation: ${op}`);
    }
  };

  const handleToken = (token) => {
    switch (true) {
      case !isNaN(parseFloat(token)):
        addToOutput(token);
        break;
      case isFunction(token):
        stack.push(token);
        break;
      case opSymbols.includes(token):
        const o1 = token;
        let o2 = peek();

        while (
          o2 !== undefined &&
          o2 !== '(' &&
          (operators[o2].prec > operators[o1].prec ||
            (operators[o2].prec === operators[o1].prec &&
              operators[o1].assoc === 'left'))
        ) {
          addToOutput(handlePop());
          o2 = peek();
        }
        stack.push(o1);
        break;
      case token === '(':
        stack.push(token);
        break;
      case token === ')':
        let topOfStack = peek();
        while (topOfStack !== '(') {
          assert(stack.length !== 0);
          addToOutput(handlePop());
          topOfStack = peek();
        }
        assert(peek() === '(');
        handlePop();
        topOfStack = peek();
        if (topOfStack && isFunction(topOfStack)) {
          addToOutput(handlePop());
        }
        break;
      default:
        throw new Error(`Invalid token: ${token}`);
    }
  };

  const tokenizer = new Tokenizer(input);
  let token;
  let prevToken = null;
  while ((token = tokenizer.getNextToken())) {
    if (
      token.value === '-' &&
      (prevToken === null ||
        prevToken.value === '(' ||
        opSymbols.includes(prevToken.value))
    ) {
      handleToken('u');
    } else {
      handleToken(token.value);
    }
    prevToken = token;
  }

  while (stack.length !== 0) {
    assert(peek() !== '(');
    addToOutput(handlePop());
  }

  return output[0];
};

const addVariable = (name, value) => {

  if (variables[name]!== undefined) {
      throw new Error(`Variable "${name}" already defined`);
    }

  if (value === undefined || typeof(Number(value)) !== "number") {
    throw new Error(`Value of Variable "${name}" is invalid`);
  }
  
  variables[name] = value;
}

const removeVariable = (name) => {

  if (variables[name]== undefined) {
      throw new Error(`Variable "${name}" doesn't exist`);
    }
  
  delete variables[name];
}

const parseExpression = (expression) => {
  
  // Check for symbol between parentheses and operand
  if (expression.match(/[\d]\s*\(.*?\)|\(.*?\)\s*[\d\w]/)){
    throw new Error(`Invalid expression: ${expression}, no operator between parentheses and operand`);
  }

  // Check for expression ending or starting on a symbol
  if (expression.match(/^[/*^]|[-+*/^]$/)){
    throw new Error(`Invalid expression: ${expression}, symbol missing an operand`);
  }

  // Check for repeated symbols in a row
  if (expression.match(/(\.{2,}|\+{2,}|\/{2,}|\^{2,}|\-{2,})/)){
    throw new Error(`Invalid expression: ${expression}, repeated symbols`);
  }

  // Check for empty parentheses
  if (expression.match(/\(\s*\)/)){
    throw new Error(`Invalid expression: ${expression}, empty parentheses`);
  }

  for (const key in variables ){
    expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), variables[key]);
  }

  return expression;
}

const calculate = (expression) => {

  const parsedExpression = parseExpression(expression);

  const output = evaluate(parsedExpression);

  const result =  parseFloat(Number(output).toFixed(4))

  if (isNaN(result)){
    throw new Error(`Invalid expression: ${expression}`);
  }

  return result;
}

export { calculate , addVariable , removeVariable}