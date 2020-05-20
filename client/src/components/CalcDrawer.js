import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import ResultComponent from "./ResultComponent";
import KeyPadComponent from "./KeyPadComponent";
import DialpadIcon from "@material-ui/icons/Dialpad";
import { AiOutlineCalculator } from "react-icons/ai";

const useStyles = makeStyles({
  list: {
    paddingTop: "50%",
    width: 350,
  },
  fullList: {
    width: "auto",
  },
});

export default function CalcDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const [result, setResult] = React.useState("");

  const onClick = (button) => {
    if (button === "=") {
      calculate();
    } else if (button === "C") {
      reset();
    } else if (button === "CE") {
      backspace();
    } else {
      setResult(result + button);
    }
  };

  const calculate = () => {
    var checkResult = "";
    if (result.includes("--")) {
      checkResult = result.replace("--", "+");
    } else {
      checkResult = result;
    }

    try {
      setResult((eval(checkResult) || "") + "");
    } catch (e) {
      setResult("error");
    }
  };

  const reset = () => {
    setResult("");
  };

  const backspace = () => {
    setResult(result.slice(0, -1));
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="calculator-body">
        <ResultComponent result={result} />
        <KeyPadComponent onClick={onClick} />
      </div>
    </div>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>

          <a
          
            onClick={toggleDrawer(anchor, true)}
            style={{
              position: "absolute",
              right: 10,
              top: 70,
              outline: "none",
              fontSize: 20,
              color: "#fff",
              // boxShadow: "1px 5px 10px #afafaf",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              backgroundColor: "#f50057"
            }}
          >Calculator <AiOutlineCalculator size="1.5em" /></a>
          <SwipeableDrawer
            style={{ backgroundColor: "rgba(0,0,0,0)" }}
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
