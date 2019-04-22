import React, { useState } from "react";
import { css } from "emotion";
import { generateTree } from "../generator";
import { IRouteRule } from "@jimengio/ruled-router";

export default function Home() {
  let [text, setText] = useState("");
  let [result, setResult] = useState("");

  return (
    <div className={styleRow}>
      <textarea
        className={styleTextarea}
        value={text}
        onChange={(event) => {
          let newText = event.target.value;
          setText(newText);
        }}
      />
      <div>
        <button
          onClick={() => {
            setResult(generateTree(JSON.parse(text) as IRouteRule[]));
          }}
        >
          Transform
        </button>
      </div>
      <textarea className={styleTextarea} value={result} disabled />
    </div>
  );
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;

const styleRow = css`
  display: flex;
`;

const styleTextarea = css`
  width: 400px;
  height: 400px;
  font-size: 14px;
  font-family: Menlo;
`;
