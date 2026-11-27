// =========================================================
// Calculator — Oasis Infobyte · Level 2 · Task 1
// No eval(): the expression is split into tokens and solved
// in normal maths order (× and ÷ before + and −).
// =========================================================

// ---------- 1. Elements and state ----------
const expressionEl = document.getElementById("expression");
const currentEl    = document.getElementById("current");
const keys         = document.getElementById("keys");

const OPERATORS = ["+", "−", "×", "÷"];

let expression = "";          // e.g. "5+3×2"
let justEvaluated = false;    // true right after "=" is pressed

// ---------- 2. Display helpers ----------
function updateDisplay(mainText, topText) {
  currentEl.textContent = mainText;
  expressionEl.textContent = topText;

  currentEl.classList.remove("error");
  currentEl.classList.toggle("small", mainText.length > 11);
}

function showError(message) {
  currentEl.textContent = message;
  currentEl.classList.add("error");
  expressionEl.textContent = "";
  expression = "";
  justEvaluated = true;
}

// Returns the number currently being typed (used for the decimal check)
function lastNumber() {
  const parts = expression.split(/[+−×÷]/);
  return parts[parts.length - 1];
}

function lastChar() {
  return expression.slice(-1);
}

// ---------- 3. Button actions ----------
function inputDigit(digit) {
  if (justEvaluated) {          // a new number after "=" starts a new calculation
    expression = "";
    justEvaluated = false;
  }
  if (lastNumber() === "0" && digit !== ".") {
    expression = expression.slice(0, -1);   // avoid leading zeros like "05"
  }
  expression += digit;
  updateDisplay(expression, "");
}

function inputDecimal() {
  if (justEvaluated) {
    expression = "";
    justEvaluated = false;
  }
  if (lastNumber().includes(".")) return;   // only one decimal point per number
  if (lastNumber() === "") {
    expression += "0";                       // turn "." into "0."
  }
  expression += ".";
  updateDisplay(expression, "");
}

function inputOperator(op) {
  justEvaluated = false;                     // continue from the result (chaining)

  if (expression === "" || expression === "−") {
    if (op === "−") {                        // a leading minus means a negative number
      expression = "−";
      updateDisplay(expression, "");
    }
    return;
  }

  if (OPERATORS.includes(lastChar())) {
    expression = expression.slice(0, -1);    // replace the operator: "5+×" → "5×"
  }
  if (lastChar() === ".") {
    expression = expression.slice(0, -1);    // drop a trailing dot: "5." → "5"
  }
  expression += op;
  updateDisplay(expression, "");
}

function clearAll() {
  expression = "";
  justEvaluated = false;
  updateDisplay("0", "");
}

function backspace() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  updateDisplay(expression === "" ? "0" : expression, "");
}

// ---------- 4. Evaluation (without eval) ----------

// Split the expression into numbers and operators: "5+3×2" → [5, "+", 3, "×", 2]
function tokenize(expr) {
  const tokens = [];
  let number = "";

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    const isMinusSign = ch === "−" && (i === 0 || OPERATORS.includes(expr[i - 1]));

    if (OPERATORS.includes(ch) && !isMinusSign) {
      tokens.push(parseFloat(number));
      tokens.push(ch);
      number = "";
    } else {
      number += ch === "−" ? "-" : ch;       // convert the display minus to JS "-"
    }
  }
  tokens.push(parseFloat(number));
  return tokens;
}

function calculate(a, op, b) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷":
      if (b === 0) throw new Error("Cannot divide by zero");
      return a / b;
  }
}

// Operator precedence: × and ÷ first, then + and −
function evaluate(tokens) {
  // Pass 1: multiplication and division
  const stack = [tokens[0]];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const next = tokens[i + 1];
    if (op === "×" || op === "÷") {
      const prev = stack.pop();
      stack.push(calculate(prev, op, next));
    } else {
      stack.push(op, next);
    }
  }

  // Pass 2: addition and subtraction, left to right
  let result = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    result = calculate(result, stack[i], stack[i + 1]);
  }
  return result;
}

// Fix floating-point noise: 0.1 + 0.2 = 0.30000000000000004 → 0.3
function tidy(num) {
  return parseFloat(num.toFixed(10));
}

function equals() {
  if (expression === "" || justEvaluated) return;

  let expr = expression;
  while (OPERATORS.includes(expr.slice(-1)) || expr.slice(-1) === ".") {
    expr = expr.slice(0, -1);                // ignore a trailing operator: "5+" → "5"
  }
  if (expr === "" || expr === "−") return;

  try {
    const result = tidy(evaluate(tokenize(expr)));
    const shown = String(result).replace("-", "−");
    updateDisplay(shown, expr + " =");
    expression = shown;                      // allow chaining from the result
    justEvaluated = true;
  } catch (err) {
    showError("Error: can't divide by 0");
  }
}

// ---------- 5. Event listeners ----------
// One listener on the keypad handles every button (event delegation)
keys.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === "clear") clearAll();
  else if (action === "backspace") backspace();
  else if (action === "equals") equals();
  else if (value === ".") inputDecimal();
  else if (OPERATORS.includes(value)) inputOperator(value);
  else inputDigit(value);
});

// Keyboard support
const keyMap = { "*": "×", "/": "÷", "-": "−", "+": "+" };

document.addEventListener("keydown", function (event) {
  const k = event.key;
  let button = null;

  if (/^[0-9]$/.test(k)) button = keys.querySelector(`[data-value="${k}"]`);
  else if (k === ".") button = keys.querySelector('[data-value="."]');
  else if (keyMap[k]) button = keys.querySelector(`[data-value="${keyMap[k]}"]`);
  else if (k === "Enter" || k === "=") button = keys.querySelector('[data-action="equals"]');
  else if (k === "Backspace") button = keys.querySelector('[data-action="backspace"]');
  else if (k === "Escape" || k.toLowerCase() === "c") button = keys.querySelector('[data-action="clear"]');

  if (button) {
    event.preventDefault();
    button.click();
    button.classList.add("pressed");
    setTimeout(function () { button.classList.remove("pressed"); }, 100);
  }
});