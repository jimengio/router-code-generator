module.exports = {
  testEnvironment: "node",
  // testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  testRegex: "generator.test.ts",
  moduleFileExtensions: ["js", "json", "jsx", "node", "ts", "tsx"],
  collectCoverage: true,
  preset: "ts-jest",
  testMatch: null,
};
