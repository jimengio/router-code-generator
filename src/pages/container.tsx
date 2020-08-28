import React, { useState, FC } from "react";
import { css, cx } from "emotion";

import { generateTree } from "../generator";
import { IRouteRule } from "@jimengio/ruled-router";
import { row, fullscreen, column, rowMiddle, rowParted, expand } from "@jimengio/flex-styles";
import copy from "copy-to-clipboard";

import parserTypeScript from "prettier/parser-typescript";
import prettier from "prettier/standalone";

let Container: FC<{}> = React.memo((props) => {
  let [text, setText] = useState(`[ { "path": "a" } ]`);
  let [result, setResult] = useState("");

  /** Methods */

  let changeCode = () => {
    try {
      setResult(
        prettier.format(generateTree(JSON.parse(text) as IRouteRule[], { addTypes: true }), {
          parser: "typescript",
          plugins: [parserTypeScript],
        })
      );
    } catch (err) {
      setResult(err.message);
    }
  };

  /** Effects */
  /** Renderers */

  return (
    <div className={cx(fullscreen, column)}>
      <div className={cx(rowParted, styleToolbar)}>
        <span />
        <div className={rowMiddle}>
          <button
            className={styleButton}
            onClick={() => {
              changeCode();
            }}
          >
            Transform
          </button>
        </div>
      </div>
      <div className={cx(expand, row)}>
        <textarea
          className={cx(expand, styleTextarea)}
          placeholder={"Router rules in JSON..."}
          value={text}
          onChange={(event) => {
            let newText = event.target.value;
            setText(newText);
          }}
          onKeyDown={(event) => {
            if (event.keyCode === 13 && event.metaKey) {
              changeCode();
            }
          }}
        />
        <textarea placeholder={"Generated code..."} className={cx(expand, styleTextarea)} value={result} disabled />
      </div>
      <button
        className={cx(styleButton, styleCopy)}
        onClick={() => {
          copy(result);
        }}
      >
        Copy
      </button>
    </div>
  );
});

export default Container;

const styleTextarea = css`
  font-size: 14px;
  font-family: Source Code Pro, menlo, monospace;
  height: 100%;
  border: 1px solid #eee;
  padding: 8px;
`;

let styleToolbar = css`
  padding: 8px;
`;

let styleButton = css`
  display: inline-block;
  line-height: 30px;
  background-color: hsl(200, 80%, 70%);
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
  transition-duration: 200ms;

  &:hover {
    cursor: pointer;
  }

  &:active {
    transition-duration: 0ms;
    transform: scale(1.1);
  }
`;

let styleCopy = css`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;
