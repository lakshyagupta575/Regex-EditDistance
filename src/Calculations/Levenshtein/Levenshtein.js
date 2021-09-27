import React from "react";
import classes from "./Levenshtein.module.css";
import Footer from "../../Footer/Footer";

const Levenshtein = (props) => {
  var current = new Array(props.target.length + 1);
  for (let i = 0; i < props.target.length + 1; i++) {
    current[i] = new Array(props.regex.length + 1).fill(0);
  }
  for (let t_i = 0; t_i < props.target.length + 1; t_i++) {
    for (let r_i = 0; r_i < props.regex.length + 1; r_i++) {
      if (r_i === 0 && t_i === 0) current[t_i][r_i] = 0;
      else if (r_i === 0) current[t_i][r_i] = t_i;
      else if (t_i === 0) {
        var i = r_i - 1;
        var counter = 0;
        while (i >= 0) {
          var char = props.regex[i];
          i -= char === "?" || char === "*" || char === "+" ? 2 : 1;
          counter += !(char === "?" || char === "*") ? 1 : 0;
        }
        current[t_i][r_i] = counter;
      } else if (props.regex[r_i - 1] === ".")
        // Regex special cases
        current[t_i][r_i] = current[t_i - 1][r_i - 1];
      else if (
        props.regex[r_i - 1] === "+" ||
        props.regex[r_i - 1] === "*" ||
        props.regex[r_i - 1] === "?"
      ) {
        if (props.regex[r_i - 2] === props.target[t_i - 1]) {
          if (props.regex[r_i - 1] == "?") {
            current[t_i][r_i] = current[t_i][r_i - 2];
          } else
            current[t_i][r_i] = Math.min(
              current[t_i - 1][r_i - 2],
              current[t_i - 1][r_i]
            );
        } else {
          let additional_cost = props.regex[r_i - 1] === "+" ? 1 : 0;
          current[t_i][r_i] = Math.min(
            current[t_i - 1][r_i - 2] + 1,
            current[t_i - 1][r_i] + 1,
            current[t_i][r_i - 2] + additional_cost
          );
        }
      } else if (props.regex[r_i - 1] === props.target[t_i - 1])
        // Other characters
        current[t_i][r_i] = current[t_i - 1][r_i - 1];
      else {
        current[t_i][r_i] = Math.min(
          current[t_i - 1][r_i - 1] + 1,
          current[t_i - 1][r_i] + 1,
          current[t_i][r_i - 1] + 1
        );
      }
    }
  }
  var finalMatrix = current;
  var minOperations = current[current.length - 1][current[0].length - 1];
  //
  var finalMatrix2 = new Array(props.regex.length + 1);
  for (let i = 0; i < props.regex.length + 1; i++) {
    finalMatrix2[i] = new Array(props.regex.length + 1).fill(0);
  }
  finalMatrix2[0][0] = "#";
  for (let i = 0; i < props.target.length; i++) {
    finalMatrix2[0][i + 1] = props.target[i];
  }
  var indexOfRedux = 0;
  for (let i = 1; i < props.regex.length + 1; i++) {
    for (let j = 0; j < props.target.length + 1; j++) {
      if (j == 0) {
        finalMatrix2[i][j] = props.regex[indexOfRedux++];
      } else {
        finalMatrix2[i][j] = current[j][i];
      }
    }
  }
  // console.log(current);
  //console.log(finalMatrix2);
  //return finalMatrix;
  return (
    <React.Fragment>
      <div className={classes.container}>
        {/* <table>
        <tbody>
          {finalMatrix.map((item) => {
            return <tr>{item}</tr>;
          })}
        </tbody>
      </table> */}
        <table className={classes.table}>
          <tbody>
            {/* <tr className={classes.trow}>
              <td className={classes.tcell}>{props.regex}</td>
            </tr> */}
            {finalMatrix2.map((items) => {
              return (
                <tr className={classes.trow}>
                  {items.map((item) => {
                    return <td className={classes.tcell}>{item}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={classes.result}>Min Distance : {minOperations}</div>

      {/* <Footer className={classes.footer} /> */}
    </React.Fragment>
  );
};

export default Levenshtein;
