import { IRouteRule } from "@jimengio/ruled-router";
let pkg = require("../package.json");

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
    return "$";
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

function path2QueryName(path: string): string {
  let piece = path
    .replace(/:\w+/g, "_")
    .replace(/\/(\w)/g, (x) => x[1].toUpperCase())
    .replace(/-(\w)/g, (x) => x[1].toUpperCase())
    .replace(/\/$/, "$");
  return `IGenQuery${piece}`;
}

function generateField(rule: IRouteRule, basePath: string, trackQueryTypse: (name: string, queries: string[]) => void): string {
  let nameString = JSON.stringify(rule.name || rule.path || "");
  let currentPath = `${basePath}/${rule.path}`;
  let rawPath = JSON.stringify(rule.path);
  let propName = convertPathToMethodName(rule.path);
  let fieldsInString = ((rule as any).next || []).map((childRule: IRouteRule) => generateField(childRule, currentPath, trackQueryTypse)).join("\n");
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
  let queryName = path2QueryName(currentPath);

  trackQueryTypse(queryName, rule.queries);

  let resultObj = ` {
		name: ${nameString},
		raw: ${rawPath},
		path: (${paramsList} queries?: ${queryName}) => ${pathInString},
		go: (${paramsList} queries?: ${queryName}) => switchPath(${pathInString}),
		${fieldsInString}
	}
	`;
  return `${propName}: ${resultObj},`;
}

export function generateTree(rules: IRouteRule[], options?: { addVersion?: boolean }): string {
  options = options || {};

  let queryTypes: [string, string[]][] = [];
  let trackQueryTypse = (name: string, queries: string[]) => {
    queryTypes.push([name, queries]);
  };
  let fieldsInString = rules.map((y) => generateField(y, "", trackQueryTypse)).join("\n");
  let queryTypesInString = queryTypes
    .map(([name, queries]) => {
      return `export interface ${name} ${getDefaultQueryTypes(queries)};`;
    })
    .join("\n\n");
  let code = `export let genRouter = {
    ${fieldsInString}
  };

  ${queryTypesInString}`;

  if (options.addVersion) {
    return `// Generated with router-code-generator@${pkg.version}\n\n${code}`;
  } else {
    return code;
  }
}
