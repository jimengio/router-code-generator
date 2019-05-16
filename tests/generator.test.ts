import { generateTree } from "../src/generator";
import * as fs from "fs";
import * as path from "path";

let prettier = require("prettier");

let prettierConfigs = JSON.parse(fs.readFileSync(path.join(__dirname, "../.prettierrc"), "utf8"));

// specify parser is required in API
prettierConfigs.parser = "typescript";

let loadJSON = (filename: string) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, filename), "utf8"));
};

let loadFile = (filename: string) => {
  return fs.readFileSync(path.join(__dirname, filename), "utf8");
};

test("basic router", () => {
  let rules = loadJSON("basic.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated-basic.ts");
  expect(formatted).toBe(expectedCode);
});

test("router with params", () => {
  let rules = loadJSON("params.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated-params.ts");
  expect(formatted).toBe(expectedCode);
});

test("router with queries", () => {
  let rules = loadJSON("queries.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated-queries.ts");
  expect(formatted).toBe(expectedCode);
});

test("nested router", () => {
  let rules = loadJSON("nested.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated-nested.ts");
  expect(formatted).toBe(expectedCode);
});