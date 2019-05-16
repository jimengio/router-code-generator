import { IRouteRule } from "@jimengio/ruled-router";

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
  return (x.match(/:\w+/g) || []).map((y) => `${y.slice(1)}${/\Id$/.test(y) ? ":Id" : ":string"},`).join(" ");
}

function getQueryPath(queries: string[]): string {
  if (queries == null || queries.length === 0) {
    return "";
  }
  return "?${qsStringify(queries)}";
}

function getDefaultQueryTypes(queries: string[]): string {
  if (queries == null || queries.length === 0) {
    return "";
  }
  let queryTypes = queries.map((k) => `${k}?:string`).join(", ");
  return `{${queryTypes}}`;
}

function generateField(rule: IRouteRule, basePath: string): string {
  let nameString = JSON.stringify(rule.name || rule.path || "");
  let currentPath = `${basePath}/${rule.path}`;
  let rawPath = JSON.stringify(rule.path);
  let propName = convertPathToMethodName(rule.path);
  let fieldsInString = ((rule as any).next || []).map((childRule: IRouteRule) => generateField(childRule, currentPath)).join("\n");
  let paramsList = convertPathToParams(currentPath);
  let pathInString: string;
  if (rule.queries == null || rule.queries.length === 0) {
    pathInString = "`" + convertVariables(currentPath) + "`";
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
  pathInString = "`" + convertVariables(currentPath) + getQueryPath(rule.queries) + "`";
  let queriesParam = getDefaultQueryTypes(rule.queries);
  let resultObj = ` {
		name: ${nameString},
		raw: ${rawPath},
		path: <T=${queriesParam}>(${paramsList} queries: T) => ${pathInString},
		go: <T=${queriesParam}>(${paramsList} queries: T) => switchPath(${pathInString}),
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
