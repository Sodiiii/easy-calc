import "./calc-body.scss";
import { buttons } from "./buttons";
import { useState } from "react";

const CalcBody = () => {
  const [calc, setCalc] = useState("");

  const [result, setResult] = useState("");
  const [display, setDisplay] = useState("0");
  const [workDisplay, setWorkDisplay] = useState("");
  const [max, setMax] = useState(0);

  const ops = ["/", "*", "+", "-", ",", ".", "%"];
  const zero = ["0", "00"];

  const updateCalc = (value) => {
    setMax(max + 1);
    if (
      (ops.includes(value) && calc === "") ||
      (zero.includes(value) && calc === "") ||
      (ops.includes(value) && ops.includes(calc.slice(-1)))
    ) {
      return;
    }
    if (max <= 20) {
      setCalc(calc + value.replace(",", "."));

      setWorkDisplay(
        (workDisplay + value).toString().replace("*", "×").replace(".", ",")
      );
      if (!ops.includes(value)) {
        setResult((calc + value).toString());
      }
    } else setCalc(calc.slice(-1));
  };
  const calculate = () => {
    const noWsStr = calc.replace("×", "*");
    const operators = noWsStr.replace(/[\d.,]/g, "").split("");
    const operands = noWsStr
      .replace(/[+/%*-]/g, " ")
      .replace(/\,/g, ".")
      .split(" ")
      .map(parseFloat)
      .filter((it) => it);

    if (operators.length >= operands.length) {
      throw new Error("Operators qty must me lesser than operands qty");
    }

    while (operators.includes("*")) {
      let opIndex = operators.indexOf("*");
      operands.splice(opIndex, 2, operands[opIndex] * operands[opIndex + 1]);
      operators.splice(opIndex, 1);
    }
    while (operators.includes("/")) {
      let opIndex = operators.indexOf("/");
      operands.splice(opIndex, 2, operands[opIndex] / operands[opIndex + 1]);
      operators.splice(opIndex, 1);
    }
    while (operators.includes("%")) {
      let opIndex = operators.indexOf("%");
      operands.splice(opIndex, 2, operands[opIndex] % operands[opIndex + 1]);
      operators.splice(opIndex, 1);
    }

    let final = operands[0];
    for (let i = 0; i < operators.length; i++) {
      operators[i] === "+"
        ? (final += operands[i + 1])
        : (final -= operands[i + 1]);
    }
    return setDisplay(final);
  };

  const refresh = () => {
    setResult("");
    setCalc("");
    setDisplay("");
    setWorkDisplay("");
    setMax(0);
  };

  const sqare = () => {
    setDisplay(Math.trunc(Math.sqrt(result) * 1000) / 1000);
  };

  return (
    <div className="body-wrapper">
      <div className="body-inner">
        <div className="work-display">
          {workDisplay ? <span>{workDisplay}</span> : "0"}
        </div>
        <div className="result-display">
          {display ? <span>{display}</span> : "0"}
        </div>
        <div className="buttons">
          <div className="line-1">
            <button className="button" onClick={() => refresh()}>
              C
            </button>
            <button className="button" onClick={() => sqare()}>
              √
            </button>
            <button className="button" onClick={() => updateCalc("%")}>
              %
            </button>
            <button className="button" onClick={() => updateCalc("/")}>
              /
            </button>
          </div>
          <div className="underblock">
            <div className="digits">
              {!!buttons?.length &&
                buttons.map((but, id) => {
                  return (
                    <button
                      className="button"
                      onClick={() => updateCalc(but.val.toString())}
                    >
                      {but.val}
                    </button>
                  );
                })}
            </div>
            <div className="line-2">
              <button className="button" onClick={() => updateCalc("*")}>
                ×
              </button>
              <button className="button" onClick={() => updateCalc("-")}>
                -
              </button>
              <button className="button" onClick={() => updateCalc("+")}>
                +
              </button>
              <button className="button" onClick={() => calculate()}>
                =
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalcBody;
