import { IRouteRule } from "ruled-router";

function convertVariables(x: string): string {
  return x.replace(/:\w+/g, function(y) {
    return "${" + y.slice(1) + "}";
  });
}

function convertPathToMethodName(x: string): string {
  let result = x
    .replace(/\/?:\w+/g, (y) => "_")
    .replace(/\//g, "-")
    .replace(/-\w/g, (y) => y.slice(1, 2).toUpperCase() + y.slice(2));
  if (result === "") {
    return "_";
  } else {
    return result;
  }
}

function convertPathToParams(x: string): string {
  return (x.match(/:\w+/g) || []).map((y) => `${y.slice(1)}${y.endsWith("Id") ? ":Id" : ":string"}`).join(",");
}

function generateField(rule: IRouteRule, basePath: string): string {
  let nameString = JSON.stringify(rule.name || rule.path || "");
  let currentPath = `${basePath}/${rule.path}`;
  let rawPath = JSON.stringify(rule.path);
  let pathInString = "`" + convertVariables(currentPath) + "`";
  let propName = convertPathToMethodName(rule.path);
  let fieldsInString = ((rule as any).next || []).map((childRule) => generateField(childRule, currentPath)).join("\n");
  let paramsList = convertPathToParams(currentPath);
  let resultObj = ` {
		name: ${nameString},
		raw: ${rawPath},
		path: (${paramsList}) => ${pathInString},
		go: (${paramsList}) => switchPath(${pathInString}),
		${fieldsInString}
	}
	`;
  return `${propName}: ${resultObj},`;
}

export function generateTree(rules: IRouteRule[]): string {
  let fieldsInString = rules.map((y) => generateField(y, "")).join("\n");
  return `export let genRouter = {
		${fieldsInString}
	};`;
}
