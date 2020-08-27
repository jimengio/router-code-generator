import { IRouteRule } from "@jimengio/ruled-router";
import { union, isEmpty } from "lodash";
let pkg = require("../package.json");
let genTypeName = "GenRouterTypeTree";

/** get string interpolation code from each path with variables */
function convertVariables(x: string): string {
  return x.replace(/:\w+/g, function (y) {
    return "${" + y.slice(1) + "}";
  });
}

/** get property name from path, from `/ab/cd` to `AbCd */
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

let queryToTypeDef = (x: string) => {
  if (x.endsWith("[]")) {
    return `${x.replace(/\[\]$/, "")}?: string[]`;
  } else {
    return `${x}?: string`;
  }
};

function getDefaultQueryTypes(queries: string[]): string {
  if (queries == null) {
    return "";
  }
  let queryTypes = queries.map(queryToTypeDef).join(", ");
  return `{${queryTypes}}`;
}

/** generats code from /ab/cd to IGenQueryAbCd  */
function path2QueryName(path: string): string {
  let piece = path
    .replace(/:\w+/g, "_")
    .replace(/\/(\w)/g, (x) => x[1].toUpperCase())
    .replace(/-(\w)/g, (x) => x[1].toUpperCase())
    .replace(/\/$/, "$");
  return `IGenQuery${piece}`;
}

function generateField(rule: IRouteRule, basePath: string, trackQueryTypes: (name: string, queries: string[]) => void, parentQueries: string[]): string {
  let nameString = JSON.stringify(rule.name || rule.path || "");
  let currentPath = `${basePath}/${rule.path}`;
  let rawPath = JSON.stringify(rule.path);
  let propName = convertPathToMethodName(rule.path);

  let queries = union(rule.queries, parentQueries);

  let fieldsInString = ((rule as any).next || []).map((childRule: IRouteRule) => generateField(childRule, currentPath, trackQueryTypes, queries)).join("\n");
  let paramsList = convertPathToParams(currentPath);
  let pathInString: string;

  // for queries=[], allow generating queries:{} for use cases such as `queries as any`
  if (rule.queries == null && isEmpty(parentQueries)) {
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
  pathInString = "`" + convertVariables(currentPath) + getQueryPath(queries) + "`";
  let queryName = path2QueryName(currentPath);

  if (queries.length > 0) {
    trackQueryTypes(queryName, queries);
  } else {
    // handle empty queries carefully, not need to create a new name
    queryName = "{}";
  }

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

/** Controller code generation function */
export function generateTree(rules: IRouteRule[], options?: { addVersion?: boolean; addTypes?: boolean }): string {
  options = options || {};

  let queryTypes: [string, string[]][] = [];
  let trackQueryTypes = (name: string, queries: string[]) => {
    queryTypes.push([name, queries]);
  };
  let fieldsInString = rules.map((y) => generateField(y, "", trackQueryTypes, [])).join("\n");
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
    code = `// Generated with router-code-generator@${pkg.version}\n\n${code}`;
  }

  if (options.addTypes) {
    code = `${code}\n\n${generateTypesTree(rules)}`;
  }

  return code;
}

/** generate from path to property name */
let formatPropName = (x: string) => JSON.stringify(convertPathToMethodName(x));

let generateTypesInterface = (rule: IRouteRule, baseType: string, inheritVariables: string[], inheritQueries: string[]): string => {
  let currentVariables = rule.path
    .split("/")
    .filter((x) => x.length > 0)
    .filter((x) => x[0] === ":")
    .map((x) => x.slice(1));
  let variables = inheritVariables.concat(currentVariables);
  let variablesCode = variables.map((x) => `${x}: string`).join(",");

  let queries = inheritQueries.concat([]);
  (rule.queries || []).forEach((query) => {
    if (!queries.includes(query)) {
      queries.push(query);
    }
  });
  let queriesCode = queries.map(queryToTypeDef).join(",");

  let nextTypesCode = (rule.next || []).map((x) => `${baseType}[${formatPropName(x.path)}]`).join(" | ");

  let childrenCode = (rule.next || []).map((rule) => {
    return `${convertPathToMethodName(rule.path)}: ${generateTypesInterface(rule, `${baseType}[${formatPropName(rule.path)}]`, variables, queries)}`;
  });

  return `
  {
    name: ${JSON.stringify(rule.name || rule.path || "")},
    params: {${variablesCode}},
    query: {${queriesCode}},
    next: ${nextTypesCode || "null"}
    ${childrenCode}
  }
  `;
};

/** Generate types from rules */
export let generateTypesTree = (rules: IRouteRule[]) => {
  let childrenCode = rules.map((rule: IRouteRule) => {
    let interfaceCode = generateTypesInterface(rule, `${genTypeName}[${formatPropName(rule.path)}]`, [], []);
    return `${formatPropName(rule.path)}: ${interfaceCode}`;
  });

  let topLevelInterfacesCode = rules
    .map((rule) => {
      return `${genTypeName}[${formatPropName(rule.path)}]`;
    })
    .join(" | ");

  return `
  export interface ${genTypeName} {
    next: ${topLevelInterfacesCode},
    ${childrenCode}
  }
  `;
};
