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
  let rules = loadJSON("json/basic.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/basic.ts");
  expect(formatted).toBe(expectedCode);
});

test("router with params", () => {
  let rules = loadJSON("json/params.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/params.ts");
  expect(formatted).toBe(expectedCode);
});

test("router with queries", () => {
  let rules = loadJSON("json/queries.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/queries.ts");
  expect(formatted).toBe(expectedCode);
});

test("nested router", () => {
  let rules = loadJSON("json/nested.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/nested.ts");
  expect(formatted).toBe(expectedCode);
});

test("kebab path", () => {
  let rules = loadJSON("json/kebab-path.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/kebab-path.ts");
  expect(formatted).toBe(expectedCode);
});

test("home path", () => {
  let rules = loadJSON("json/home-path.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/home-path.ts");
  expect(formatted).toBe(expectedCode);
});

test("basic version", () => {
  let rules = loadJSON("json/basic.json");
  let result = generateTree(rules, { addVersion: true });
  let formatted = prettier.format(result, prettierConfigs);
  let pkg = require("../package.json");
  let expectedCode = loadFile("generated/basic-version.ts").replace("{version}", pkg.version);
  expect(formatted).toBe(expectedCode);
});

test("empty query", () => {
  let rules = loadJSON("json/empty-query.json");
  let result = generateTree(rules);
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/empty-query.ts");
  expect(formatted).toBe(expectedCode);
});

test("generate types", () => {
  let rules = loadJSON("json/types-nested.json");
  let result = generateTree(rules, { addTypes: true });
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/types-nested.ts");
  expect(formatted).toBe(expectedCode);
});

test("queries types", () => {
  let rules = loadJSON("json/types-queries.json");
  let result = generateTree(rules, { addTypes: true });
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/types-queries.ts");
  expect(formatted).toBe(expectedCode);
});

test("array queries", () => {
  let rules = loadJSON("json/array-query.json");
  let result = generateTree(rules, { addTypes: true });
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/array-query.ts");
  expect(formatted).toBe(expectedCode);
});

test("inherit queries", () => {
  let rules = loadJSON("json/inherit-queries.json");
  let result = generateTree(rules, { addTypes: true });
  let formatted = prettier.format(result, prettierConfigs);
  let expectedCode = loadFile("generated/inherit-queries.ts");
  expect(formatted).toBe(expectedCode);
});
