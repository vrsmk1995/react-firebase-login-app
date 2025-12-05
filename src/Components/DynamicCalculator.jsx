import React, { useEffect, useMemo, useState } from "react";
import "../Css/Calculator.css";

export default function DynamicReactCalculator({ buttons }) {
  const defaultLayout = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "%", "+"],
    ["(", ")", "BS", "C"],
    ["="],
  ];

  const layout = buttons && buttons.length ? buttons : defaultLayout;

  const [expr, setExpr] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [compact, setCompact] = useState(false);

  // --- Expression parsing & evaluation (shunting-yard -> RPN) ---
  function tokenize(s) {
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === " ") {
        i++;
        continue;
      }
      if (/[0-9.]/.test(ch)) {
        let num = ch;
        i++;
        while (i < s.length && /[0-9.]/.test(s[i])) {
          num += s[i++];
        }
        tokens.push({ type: "num", value: num });
        continue;
      }
      if (/[+\-*/%^()]/.test(ch)) {
        tokens.push({ type: "op", value: ch });
        i++;
        continue;
      }
      throw new Error(`Invalid character \"${ch}\" in expression`);
    }
    return tokens;
  }

  function shuntingYard(tokens) {
    const out = [];
    const opStack = [];
    const prec = { "+": 2, "-": 2, "*": 3, "/": 3, "%": 3, "^": 4 };
    const rightAssoc = { "^": true };

    for (const t of tokens) {
      if (t.type === "num") out.push(t);
      else if (t.type === "op") {
        const v = t.value;
        if (v === "(") {
          opStack.push(v);
        } else if (v === ")") {
          while (opStack.length && opStack[opStack.length - 1] !== "(")
            out.push({ type: "op", value: opStack.pop() });
          if (!opStack.length) throw new Error("Mismatched parentheses");
          opStack.pop();
        } else {
          while (opStack.length) {
            const top = opStack[opStack.length - 1];
            if (top === "(") break;
            const topPrec = prec[top] || 0;
            const curPrec = prec[v] || 0;
            if (
              (!rightAssoc[v] && curPrec <= topPrec) ||
              (rightAssoc[v] && curPrec < topPrec)
            ) {
              out.push({ type: "op", value: opStack.pop() });
              continue;
            }
            break;
          }
          opStack.push(v);
        }
      }
    }
    while (opStack.length) {
      const t = opStack.pop();
      if (t === "(" || t === ")") throw new Error("Mismatched parentheses");
      out.push({ type: "op", value: t });
    }
    return out;
  }

  function evalRPN(rpn) {
    const st = [];
    for (const token of rpn) {
      if (token.type === "num") st.push(Number(token.value));
      else if (token.type === "op") {
        const b = st.pop();
        const a = st.pop();
        if (a === undefined || b === undefined)
          throw new Error("Malformed expression");
        switch (token.value) {
          case "+":
            st.push(a + b);
            break;
          case "-":
            st.push(a - b);
            break;
          case "*":
            st.push(a * b);
            break;
          case "/":
            if (b === 0) throw new Error("Division by zero");
            st.push(a / b);
            break;
          case "%":
            st.push(a % b);
            break;
          case "^":
            st.push(Math.pow(a, b));
            break;
          default:
            throw new Error("Unknown operator " + token.value);
        }
      }
    }
    if (st.length !== 1) throw new Error("Malformed expression");
    return st[0];
  }

  function evaluateExpression(s) {
    if (!s || s.trim() === "") return null;
    const tokens = tokenize(s);
    const rpn = shuntingYard(tokens);
    return evalRPN(rpn);
  }

  // --- Handlers ---
  function handlePress(val) {
    setError("");
    if (val === "C") {
      setExpr("");
      setResult(null);
      return;
    }
    if (val === "BS") {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (val === "=") {
      try {
        const res = evaluateExpression(expr);
        setResult(res);
        setHistory((h) => [{ expr, result: res }, ...h].slice(0, 50));
      } catch (err) {
        setError(err.message);
        setResult(null);
      }
      return;
    }
    setExpr((e) => e + val);
  }

  // keyboard support
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter") {
        handlePress("=");
      } else if (e.key === "Backspace") {
        handlePress("BS");
      } else if (e.key === "Escape") {
        handlePress("C");
      } else {
        if (/^[0-9+\-*/%^().]$/.test(e.key)) {
          handlePress(e.key);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expr]);

  // quick-eval preview while typing
  useEffect(() => {
    try {
      const preview = evaluateExpression(expr);
      setResult(preview);
      setError("");
    } catch (err) {
      setResult(null);
    }
  }, [expr]);

  const rows = useMemo(() => layout, [layout]);

  // Embedded plain CSS used by this component
  // CSS moved to external file
  // import './DynamicReactCalculator.css';

  return (
    <div className={`calc-wrap ${compact ? "compact" : ""}`}>
      <div className="calc-header">
        <div className="calc-title">Dynamic Calculator</div>
        <div className="btn-group">
          <button className="small-btn" onClick={() => setCompact((c) => !c)}>
            {compact ? "Expand" : "Compact"}
          </button>
          <button
            className="small-btn"
            onClick={() => {
              setExpr("");
              setResult(null);
              setHistory([]);
              setError("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div>
        <div className="display">
          <div className="label">Expression</div>
          <div className="expr">{expr || "0"}</div>
        </div>
        <div className="meta">
          <div>
            Result: <strong>{result !== null ? String(result) : "-"}</strong>
          </div>
          <div style={{ color: "#dc2626" }}>{error}</div>
        </div>
      </div>

      <div className="grid">
        {rows.map((r, ri) => (
          <div key={ri} className="row">
            {r.map((b, bi) => (
              <button
                key={bi}
                onClick={() => handlePress(b)}
                className={`key ${b === "=" ? "equals" : ""}`}
              >
                {b}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="history">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600 }}>History</div>
          <button className="small-btn" onClick={() => setHistory([])}>
            Clear
          </button>
        </div>
        <div className="history-list">
          {history.length === 0 && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              No history yet — press <code>=</code> to evaluate.
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} className="history-item">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setExpr(h.expr)}
              >
                <div style={{ fontFamily: "Courier New" }}>{h.expr}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  = {String(h.result)}
                </div>
              </div>
              <div>
                <button
                  className="history-use use-btn"
                  onClick={() => {
                    setExpr(String(h.result));
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: "#f3f4f6",
                    border: "1px solid #e6e7eb",
                    cursor: "pointer",
                  }}
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tip">
        Tip: Pass a <code>buttons</code> prop (array of rows) to customize the
        layout. Keyboard supported: numbers, + - * / % ^ ( ), Enter, Backspace,
        Escape.
      </div>
    </div>
  );
}
