// EL TIRRI SLOT — lógica base
const SYMBOLS = ['🍒','🍋','🍊','🔔','⭐','💎','7️⃣'];
const PAYTABLE = { '🍒': 8, '🍋': 8, '🍊': 10, '🔔': 12, '⭐': 15, '💎': 25, '7️⃣': 50 };

const state = { credits: 1000, betPerLine: 10, lines: 3, spinning: false };

function totalBet() { return state.betPerLine * state.lines; }
function randomSymbol() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]; }
function randomRow() { return Array.from({ length: 3 }, randomSymbol); }

// Separa el resultado del giro de la animación: el resultado se decide primero
// y los rodillos solo lo revelan progresivamente.
function createSpinResult() {
  return Array.from({ length: 3 }, randomSymbol);
}

function evaluate(result) {
  const [a,b,c] = result;
  if (a === b && b === c) return state.betPerLine * state.lines * PAYTABLE[a];
  if (a === b || b === c || a === c) return state.betPerLine * state.lines * 2;
  return 0;
}

window.ELTIRRI = { SYMBOLS, PAYTABLE, state, totalBet, randomRow, createSpinResult, evaluate };
